import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const CSV_COLUMNS = ["nominativo","email","reparto","serialePC","modelloPC","dataAcquisto","dataConsegna","sim","numeroCellulare","accountMicrosoft","note","stato"];
const CSV_HEADERS = ["Nominativo","Email","Reparto","Seriale PC","Modello PC","Data Acquisto","Data Consegna","SIM","Numero Cellulare","Account Microsoft","Note","Stato"];
const emptyForm = { nominativo:"",email:"",reparto:"",serialePC:"",modelloPC:"",dataAcquisto:"",dataConsegna:"",sim:"",numeroCellulare:"",accountMicrosoft:"",note:"",stato:"Attivo" };
const defaultReparti = ["Back Office","Front Office","IT Management","IT","HR","Sales","Finance","Operations","Marketing","Direzione"];
const stati = ["Attivo","In manutenzione","Dismesso","Smarrito"];

const statoColor = (s) => ({"Attivo":"#22c55e","In manutenzione":"#f59e0b","Dismesso":"#ef4444","Smarrito":"#8b5cf6"}[s]||"#888");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("it-IT") : "—";
const fmtTs = (ts) => new Date(ts).toLocaleString("it-IT");

// ─── EXPORT ──────────────────────────────────────────────────────────────────
function toCSV(data) {
  const rows = [CSV_HEADERS.join(",")];
  data.forEach(a => rows.push(CSV_COLUMNS.map(k => `"${(a[k]||"").replace(/"/g,'""')}"`).join(",")));
  return rows.join("\n");
}
function downloadFile(content, name, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=name; a.click();
  URL.revokeObjectURL(url);
}
function generateExcelXML(data) {
  const esc = v => String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  let xml = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Asset"><Table>`;
  xml += `<Row>${CSV_HEADERS.map(h=>`<Cell><Data ss:Type="String">${esc(h)}</Data></Cell>`).join("")}</Row>`;
  data.forEach(a => { xml += `<Row>${CSV_COLUMNS.map(k=>`<Cell><Data ss:Type="String">${esc(a[k])}</Data></Cell>`).join("")}</Row>`; });
  xml += `</Table></Worksheet></Workbook>`;
  return xml;
}

// ─── IMPORT ──────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { records:[], errors:["File vuoto o senza dati"] };
  const header = lines[0].split(",").map(h=>h.replace(/^"|"$/g,"").trim().toLowerCase());
  const colMap = {};
  CSV_COLUMNS.forEach((col,i) => {
    [col.toLowerCase(), CSV_HEADERS[i].toLowerCase()].forEach(alias => {
      const idx = header.indexOf(alias); if (idx!==-1) colMap[col]=idx;
    });
  });
  const records=[]; const errors=[];
  lines.slice(1).forEach((line,li) => {
    if (!line.trim()) return;
    const vals=[]; let cur=""; let inQ=false;
    for (let c of line) { if(c==='"') inQ=!inQ; else if(c===','&&!inQ){vals.push(cur);cur="";}else cur+=c; }
    vals.push(cur);
    const rec = {...emptyForm};
    CSV_COLUMNS.forEach(col => { if(colMap[col]!==undefined) rec[col]=(vals[colMap[col]]||"").replace(/^"|"$/g,"").trim(); });
    if (!rec.nominativo){errors.push(`Riga ${li+2}: nominativo mancante`);return;}
    if (!rec.serialePC){errors.push(`Riga ${li+2}: seriale PC mancante`);return;}
    if (!stati.includes(rec.stato)) rec.stato="Attivo";
    records.push(rec);
  });
  return { records, errors };
}

// ─── HISTORY ─────────────────────────────────────────────────────────────────
function diffAssets(before, after) {
  return CSV_COLUMNS.filter(k=>(before[k]||"")!==(after[k]||"")).map(k=>({field:k,from:before[k]||"",to:after[k]||""}));
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AssetManager({ onLogout }) {
  const [assets, setAssets] = useState([]);
  const [history, setHistory] = useState([]);
  const [reparti, setReparti] = useState(defaultReparti);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newReparto, setNewReparto] = useState("");
  const [showAddReparto, setShowAddReparto] = useState(false);
  const [showRepartiManager, setShowRepartiManager] = useState(false);

  const [view, setView] = useState("table");
  const [editId, setEditId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filterReparto, setFilterReparto] = useState("Tutti");
  const [filterStato, setFilterStato] = useState("Tutti");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [sortField, setSortField] = useState("nominativo");
  const [sortDir, setSortDir] = useState("asc");
  const [historySearch, setHistorySearch] = useState("");
  const [importData, setImportData] = useState(null);
  const [importMode, setImportMode] = useState("aggiungi");
  const fileRef = useRef();

  const showToast = useCallback((msg, type="success") => {
    setToast({msg,type}); setTimeout(()=>setToast(null),3500);
  }, []);

  // ── LOAD DATA FROM SUPABASE ──
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: assetsData, error: e1 }, { data: historyData, error: e2 }, { data: repartiData, error: e3 }] =
        await Promise.all([
          supabase.from('assets').select('*').order('nominativo'),
          supabase.from('history').select('*').order('ts', { ascending: false }).limit(200),
          supabase.from('reparti').select('nome').order('nome'),
        ]);
      if (e1) throw e1;
      if (assetsData) setAssets(assetsData);
      if (historyData) setHistory(historyData);
      if (repartiData && repartiData.length > 0) {
        const nomi = repartiData.map(r => r.nome);
        const merged = [...new Set([...defaultReparti, ...nomi])];
        setReparti(merged);
      }
    } catch (err) {
      showToast("Errore caricamento dati: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── REALTIME ──
  useEffect(() => {
    const channel = supabase.channel('realtime-assets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'history' }, () => loadData())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [loadData]);

  const addHistory = async (action, asset, changes=null) => {
    await supabase.from('history').insert({
      ts: new Date().toISOString(),
      action,
      asset_id: asset?.id || null,
      asset_serial: asset?.serialePC || null,
      asset_nome: asset?.nominativo || null,
      changes: changes ? JSON.stringify(changes) : null,
    });
  };

  // ── FILTERING ──
  const filtered = useMemo(()=>{
    let d=[...assets];
    if(search){const q=search.toLowerCase();d=d.filter(a=>["nominativo","serialePC","numeroCellulare","sim","accountMicrosoft","email","modelloPC"].some(k=>(a[k]||"").toLowerCase().includes(q)));}
    if(filterReparto!=="Tutti") d=d.filter(a=>a.reparto===filterReparto);
    if(filterStato!=="Tutti") d=d.filter(a=>a.stato===filterStato);
    d.sort((a,b)=>{const va=(a[sortField]||"").toLowerCase(),vb=(b[sortField]||"").toLowerCase();return sortDir==="asc"?va.localeCompare(vb):vb.localeCompare(va);});
    return d;
  },[assets,search,filterReparto,filterStato,sortField,sortDir]);

  const filteredH = useMemo(()=>{
    if(!historySearch) return history;
    const q=historySearch.toLowerCase();
    return history.filter(h=>(h.asset_nome||"").toLowerCase().includes(q)||(h.asset_serial||"").toLowerCase().includes(q)||h.action.toLowerCase().includes(q));
  },[history,historySearch]);

  // ── CRUD ──
  const openNew=()=>{setForm(emptyForm);setEditId(null);setView("form");};
  const openEdit=(a)=>{setForm({...a});setEditId(a.id);setView("form");};
  const openDetail=(a)=>{setDetailId(a.id);setView("detail");};
  const sortBy=(f)=>{if(sortField===f)setSortDir(d=>d==="asc"?"desc":"asc");else{setSortField(f);setSortDir("asc");}};

  const saveForm = async () => {
    if(!form.nominativo||!form.serialePC){showToast("Nominativo e Seriale PC obbligatori","error");return;}
    setSaving(true);
    try {
      if(editId){
        const before=assets.find(a=>a.id===editId);
        const { error } = await supabase.from('assets').update({
          nominativo:form.nominativo, email:form.email, reparto:form.reparto,
          serialePC:form.serialePC, modelloPC:form.modelloPC,
          dataAcquisto:form.dataAcquisto||null, dataConsegna:form.dataConsegna||null,
          sim:form.sim, numeroCellulare:form.numeroCellulare,
          accountMicrosoft:form.accountMicrosoft, note:form.note, stato:form.stato
        }).eq('id', editId);
        if(error) throw error;
        const changes = diffAssets(before, {...form, id:editId});
        await addHistory("MODIFICATO", {...form,id:editId}, changes);
        showToast("Asset aggiornato!");
      } else {
        const { data, error } = await supabase.from('assets').insert({
          nominativo:form.nominativo, email:form.email, reparto:form.reparto,
          serialePC:form.serialePC, modelloPC:form.modelloPC,
          dataAcquisto:form.dataAcquisto||null, dataConsegna:form.dataConsegna||null,
          sim:form.sim, numeroCellulare:form.numeroCellulare,
          accountMicrosoft:form.accountMicrosoft, note:form.note, stato:form.stato
        }).select().single();
        if(error) throw error;
        await addHistory("CREATO", data);
        showToast("Nuovo asset aggiunto!");
      }
      setView("table");
    } catch(err) {
      showToast("Errore salvataggio: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    const asset = assets.find(a=>a.id===deleteConfirm);
    try {
      const { error } = await supabase.from('assets').delete().eq('id', deleteConfirm);
      if(error) throw error;
      await addHistory("ELIMINATO", asset);
      setDeleteConfirm(null);
      if(view==="detail") setView("table");
      showToast("Asset eliminato","info");
    } catch(err) {
      showToast("Errore eliminazione: " + err.message, "error");
    }
  };

  // ── REPARTI ──
  const addReparto = async (nome) => {
    const v = nome.trim();
    if(!v || reparti.includes(v)) return;
    setReparti(p=>[...p,v]);
    if(!defaultReparti.includes(v)) {
      await supabase.from('reparti').upsert({ nome: v });
    }
  };
  const removeReparto = async (nome) => {
    setReparti(p=>p.filter(x=>x!==nome));
    await supabase.from('reparti').delete().eq('nome', nome);
    if(form.reparto===nome) setForm(f=>({...f,reparto:""}));
  };

  // ── EXPORT ──
  const exportCSV=()=>{downloadFile(toCSV(filtered),"asset-export.csv","text/csv;charset=utf-8");showToast(`CSV esportato (${filtered.length} record)`);};
  const exportXLS=()=>{downloadFile(generateExcelXML(filtered),"asset-export.xls","application/vnd.ms-excel");showToast(`Excel esportato (${filtered.length} record)`);};
  const dlTemplate=()=>{downloadFile([CSV_HEADERS.join(","),CSV_COLUMNS.map(()=>"").join(",")].join("\n"),"template-import.csv","text/csv");};

  // ── IMPORT ──
  const handleFile=(e)=>{
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader(); r.onload=(ev)=>setImportData(parseCSV(ev.target.result)); r.readAsText(f,"UTF-8"); e.target.value="";
  };

  const confirmImport = async () => {
    if(!importData||!importData.records.length) return;
    setSaving(true);
    try {
      if(importMode==="sostituisci") {
        await supabase.from('assets').delete().neq('id', 0);
      }
      const { error } = await supabase.from('assets').insert(importData.records.map(r=>({
        nominativo:r.nominativo, email:r.email, reparto:r.reparto,
        serialePC:r.serialePC, modelloPC:r.modelloPC,
        dataAcquisto:r.dataAcquisto||null, dataConsegna:r.dataConsegna||null,
        sim:r.sim, numeroCellulare:r.numeroCellulare,
        accountMicrosoft:r.accountMicrosoft, note:r.note, stato:r.stato
      })));
      if(error) throw error;
      await addHistory(importMode==="sostituisci"?"IMPORTAZIONE_COMPLETA":"IMPORTAZIONE",
        { id:null, serialePC:null, nominativo:`${importData.records.length} asset` });
      showToast(`${importData.records.length} asset importati!`);
      setImportData(null);
      setView("table");
    } catch(err) {
      showToast("Errore importazione: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const SortIcon=({field})=><span style={{opacity:sortField===field?1:0.3,marginLeft:4,fontSize:10}}>{sortField===field&&sortDir==="desc"?"▼":"▲"}</span>;
  const detailAsset=assets.find(a=>a.id===detailId);

  const ActionBadge=({action})=>{
    const map={CREATO:["#22c55e","✦"],MODIFICATO:["#f59e0b","✎"],ELIMINATO:["#ef4444","✕"],IMPORTAZIONE:["#1f6feb","⬆"],IMPORTAZIONE_COMPLETA:["#8b5cf6","⬆"]};
    const [color,icon]=map[action]||["#888","·"];
    return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>{icon} {action.replace(/_/g," ")}</span>;
  };

  if (loading) return (
    <div style={{background:"#0d1117",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'IBM Plex Mono',monospace",color:"#8b949e",flexDirection:"column",gap:16}}>
      <div style={{fontSize:32,animation:"spin 1s linear infinite"}}>⟳</div>
      <div style={{fontSize:13}}>Caricamento dati...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{fontFamily:"'IBM Plex Mono','Courier New',monospace",background:"#0d1117",minHeight:"100vh",color:"#e6edf3"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#161b22}::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px}
        input,select,textarea{outline:none}
        .btn{cursor:pointer;border:none;border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:500;padding:8px 16px;transition:all .15s}
        .btn-primary{background:#238636;color:#fff}.btn-primary:hover{background:#2ea043}
        .btn-primary:disabled{background:#21262d;color:#484f58;cursor:default}
        .btn-danger{background:#da3633;color:#fff}.btn-danger:hover{background:#f85149}
        .btn-ghost{background:transparent;color:#8b949e;border:1px solid #30363d}.btn-ghost:hover{background:#161b22;color:#e6edf3}
        .btn-accent{background:#1f6feb;color:#fff}.btn-accent:hover{background:#388bfd}
        .btn-orange{background:#9a6700;color:#e6edf3}.btn-orange:hover{background:#d29922}
        .btn-purple{background:#6e40c9;color:#fff}.btn-purple:hover{background:#8957e5}
        .fi{display:flex;flex-direction:column;gap:6px}
        .fl{font-size:11px;color:#8b949e;text-transform:uppercase;letter-spacing:.08em}
        .fi2{background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;font-family:'IBM Plex Mono',monospace;font-size:13px;padding:9px 12px;transition:border .15s;width:100%}
        .fi2:focus{border-color:#388bfd}.fi2::placeholder{color:#484f58}
        select.fi2 option{background:#161b22}
        .th{cursor:pointer;user-select:none;white-space:nowrap}.th:hover{color:#58a6ff}
        .rh:hover{background:#1c2128!important}
        .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500}
        .tag{display:inline-block;background:#161b22;border:1px solid #30363d;border-radius:4px;padding:2px 8px;font-size:11px;color:#8b949e}
        .ntab{cursor:pointer;padding:8px 16px;border-radius:6px;font-size:13px;color:#8b949e;transition:all .15s;border:none;background:transparent;font-family:'IBM Plex Mono',monospace;white-space:nowrap}
        .ntab:hover{color:#e6edf3;background:#21262d}
        .ntab.on{color:#e6edf3;background:#21262d;border-bottom:2px solid #1f6feb}
        .dz{border:2px dashed #30363d;border-radius:10px;padding:40px;text-align:center;cursor:pointer;transition:all .2s}
        .dz:hover{border-color:#1f6feb;background:#1f6feb0a}
        @keyframes si{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .ai{animation:si .2s ease}
        @keyframes ti{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* TOAST */}
      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:999,background:toast.type==="error"?"#da3633":toast.type==="info"?"#1f6feb":"#238636",color:"#fff",borderRadius:8,padding:"12px 20px",fontSize:13,animation:"ti .2s ease",boxShadow:"0 8px 24px rgba(0,0,0,.5)",maxWidth:340}}>{toast.msg}</div>}

      {/* SAVING OVERLAY */}
      {saving&&<div style={{position:"fixed",bottom:20,right:20,zIndex:998,background:"#161b22",border:"1px solid #30363d",borderRadius:8,padding:"10px 16px",fontSize:12,color:"#8b949e",display:"flex",alignItems:"center",gap:8}}><span style={{display:"inline-block",animation:"spin .8s linear infinite"}}>⟳</span> Salvataggio...</div>}

      {/* DELETE MODAL */}
      {deleteConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:997,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:12,padding:32,width:360,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>⚠️</div>
            <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:15,marginBottom:8}}>Eliminare questo asset?</div>
            <div style={{color:"#8b949e",fontSize:13,marginBottom:24}}>L'operazione verrà registrata nello storico.</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="btn btn-ghost" onClick={()=>setDeleteConfirm(null)}>Annulla</button>
              <button className="btn btn-danger" onClick={doDelete}>Elimina</button>
            </div>
          </div>
        </div>
      )}

      {/* REPARTI MANAGER MODAL */}
      {showRepartiManager&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:997,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowRepartiManager(false)}>
          <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:12,padding:28,width:440,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:600,fontSize:16}}>⚙ Gestisci Reparti</div>
              <div style={{flex:1}}/>
              <button className="btn btn-ghost" style={{padding:"4px 10px",fontSize:12}} onClick={()=>setShowRepartiManager(false)}>✕</button>
            </div>
            <div style={{fontSize:12,color:"#8b949e",marginBottom:16}}>Aggiungi o rimuovi reparti. I reparti predefiniti non possono essere eliminati.</div>
            <div style={{display:"flex",gap:6,marginBottom:16}}>
              <input className="fi2" placeholder="Nome nuovo reparto..." value={newReparto} onChange={e=>setNewReparto(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"){addReparto(newReparto);setNewReparto("");}}}
                style={{flex:1}}/>
              <button className="btn btn-primary" style={{padding:"5px 12px",fontSize:12}} onClick={()=>{addReparto(newReparto);setNewReparto("");}}>+ Aggiungi</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {reparti.map(r=>{
                const isDef=defaultReparti.includes(r);
                return (
                  <div key={r} style={{display:"flex",alignItems:"center",background:"#0d1117",borderRadius:6,padding:"8px 12px",border:"1px solid #21262d"}}>
                    <span style={{flex:1,fontSize:13}}>{r}</span>
                    {isDef
                      ? <span style={{fontSize:10,color:"#484f58",border:"1px solid #21262d",borderRadius:4,padding:"1px 6px"}}>predefinito</span>
                      : <button onClick={()=>removeReparto(r)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14,padding:"0 4px"}} title="Rimuovi">🗑</button>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{borderBottom:"1px solid #21262d",padding:"14px 28px",display:"flex",alignItems:"center",gap:12,background:"#161b22",flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"#1f6feb",borderRadius:8,padding:"6px 10px",fontSize:18}}>🖥️</div>
          <div>
            <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:600,fontSize:17,letterSpacing:"-0.01em"}}>AssetManager</div>
            <div style={{fontSize:10,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em"}}>Gestione inventario IT</div>
          </div>
        </div>
        <div style={{display:"flex",gap:2,marginLeft:16}}>
          {[["table","📦 Asset"],["history","🕓 Storico"],["import","⬆ Importa"]].map(([v,l])=>(
            <button key={v} className={`ntab${view===v?" on":""}`} onClick={()=>setView(v)}>{l}</button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:14,fontSize:12,color:"#8b949e"}}>
          <span>📦 <b style={{color:"#e6edf3"}}>{assets.length}</b></span>
          <span>✅ <b style={{color:"#22c55e"}}>{assets.filter(a=>a.stato==="Attivo").length}</b> attivi</span>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nuovo Asset</button>
        <button className="btn btn-ghost" onClick={onLogout} style={{padding:"6px 12px",fontSize:12}} title="Esci">⏻ Esci</button>
      </div>

      <div style={{padding:"24px 28px",maxWidth:1440,margin:"0 auto"}}>

        {/* ══ TABLE ══ */}
        {view==="table"&&(
          <div className="ai">
            <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
              <input className="fi2" placeholder="🔍  Cerca nominativo, seriale, SIM, numero, modello..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:220}}/>
              <select className="fi2" value={filterReparto} onChange={e=>setFilterReparto(e.target.value)} style={{width:155}}>
                <option value="Tutti">Tutti i reparti</option>
                {reparti.map(r=><option key={r}>{r}</option>)}
              </select>
              <select className="fi2" value={filterStato} onChange={e=>setFilterStato(e.target.value)} style={{width:165}}>
                <option value="Tutti">Tutti gli stati</option>
                {stati.map(s=><option key={s}>{s}</option>)}
              </select>
              {(search||filterReparto!=="Tutti"||filterStato!=="Tutti")&&<button className="btn btn-ghost" onClick={()=>{setSearch("");setFilterReparto("Tutti");setFilterStato("Tutti");}}>✕ Reset</button>}
              <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
                <button className="btn btn-orange" onClick={exportCSV}>⬇ CSV</button>
                <button className="btn btn-purple" onClick={exportXLS}>⬇ Excel</button>
              </div>
            </div>
            <div style={{background:"#161b22",borderRadius:10,border:"1px solid #21262d",overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{background:"#0d1117",borderBottom:"1px solid #21262d"}}>
                      {[["nominativo","Nominativo"],["reparto","Reparto"],["serialePC","Seriale PC"],["modelloPC","Modello"],["numeroCellulare","Cellulare"],["sim","SIM"],["dataConsegna","Consegna"],["stato","Stato"]].map(([f,l])=>(
                        <th key={f} className="th" onClick={()=>sortBy(f)} style={{padding:"10px 14px",textAlign:"left",color:"#8b949e",fontWeight:500,fontSize:11,textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}<SortIcon field={f}/></th>
                      ))}
                      <th style={{padding:"10px 14px",color:"#8b949e",fontSize:11,textTransform:"uppercase"}}>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length===0?(
                      <tr><td colSpan={9} style={{padding:"48px 0",textAlign:"center",color:"#484f58"}}>Nessun asset trovato</td></tr>
                    ):filtered.map((a,i)=>(
                      <tr key={a.id} className="rh" style={{borderBottom:"1px solid #21262d",background:i%2===0?"transparent":"#0d1117"}}>
                        <td style={{padding:"11px 14px"}}>
                          <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:500,fontSize:13}}>{a.nominativo}</div>
                          <div style={{fontSize:11,color:"#484f58"}}>{a.email}</div>
                        </td>
                        <td style={{padding:"11px 14px"}}><span className="tag">{a.reparto||"—"}</span></td>
                        <td style={{padding:"11px 14px",fontWeight:500,color:"#58a6ff"}}>{a.serialePC}</td>
                        <td style={{padding:"11px 14px",color:"#8b949e",fontSize:12}}>{a.modelloPC||"—"}</td>
                        <td style={{padding:"11px 14px"}}>{a.numeroCellulare||"—"}</td>
                        <td style={{padding:"11px 14px",color:"#8b949e",fontSize:12}}>{a.sim||"—"}</td>
                        <td style={{padding:"11px 14px",color:"#8b949e",fontSize:12}}>{fmtDate(a.dataConsegna)}</td>
                        <td style={{padding:"11px 14px"}}><span className="badge" style={{background:statoColor(a.stato)+"22",color:statoColor(a.stato),border:`1px solid ${statoColor(a.stato)}44`}}>{a.stato}</span></td>
                        <td style={{padding:"11px 14px"}}>
                          <div style={{display:"flex",gap:6}}>
                            <button className="btn btn-ghost" onClick={()=>openDetail(a)} style={{padding:"5px 10px",fontSize:12}}>👁</button>
                            <button className="btn btn-accent" onClick={()=>openEdit(a)} style={{padding:"5px 10px",fontSize:12}}>✏️</button>
                            <button className="btn btn-danger" onClick={()=>setDeleteConfirm(a.id)} style={{padding:"5px 10px",fontSize:12}}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{padding:"10px 16px",borderTop:"1px solid #21262d",fontSize:11,color:"#484f58",display:"flex",gap:16,flexWrap:"wrap"}}>
                <span>{filtered.length} di {assets.length} record</span>
                {filtered.length<assets.length&&<span style={{color:"#f59e0b"}}>⚠ Filtri attivi — l'esportazione include solo i record visibili</span>}
              </div>
            </div>
          </div>
        )}

        {/* ══ FORM ══ */}
        {view==="form"&&(
          <div className="ai">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
              <button className="btn btn-ghost" onClick={()=>setView("table")} style={{padding:"6px 12px"}}>← Indietro</button>
              <h2 style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:600,fontSize:18}}>{editId?"Modifica Asset":"Nuovo Asset"}</h2>
            </div>
            <div style={{background:"#161b22",border:"1px solid #21262d",borderRadius:12,padding:28,maxWidth:900}}>
              {[
                {icon:"👤",title:"Dati Dipendente",grid:"1fr 1fr",fields:[
                  ["nominativo","Nominativo *","text","Nome Cognome"],
                  ["email","Email aziendale","email","nome.cognome@azienda.it"],
                  ["reparto","Reparto","reparto",null],
                  ["accountMicrosoft","Account Microsoft 365","text","nome@azienda.onmicrosoft.com"],
                ]},
                {icon:"🖥️",title:"Dati PC",grid:"1fr 1fr",fields:[
                  ["serialePC","Numero Seriale *","text","PC-2024-XXX"],
                  ["modelloPC","Modello PC","text","es. Dell Latitude 5540"],
                  ["dataAcquisto","Data Acquisto","date",""],
                  ["dataConsegna","Data Consegna","date",""],
                ]},
                {icon:"📱",title:"Dati SIM / Telefono",grid:"1fr 1fr",fields:[
                  ["sim","Codice SIM","text","SIM-IT-XXX"],
                  ["numeroCellulare","Numero Cellulare","text","+39 3XX XXXXXXX"],
                ]},
              ].map(({icon,title,grid,fields})=>(
                <div key={title} style={{marginBottom:28}}>
                  <div style={{fontSize:11,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:16,paddingBottom:8,borderBottom:"1px solid #21262d"}}>{icon} {title}</div>
                  <div style={{display:"grid",gridTemplateColumns:grid,gap:16}}>
                    {fields.map(([key,label,type,ph])=>(
                      <div key={key} className="fi">
                        <label className="fl">{label}</label>
                        {type==="reparto" ? (
                          <div>
                            <select className="fi2" value={form.reparto} onChange={e=>setForm({...form,reparto:e.target.value})} style={{marginBottom:6}}>
                              <option value="">— Seleziona —</option>
                              {reparti.map(r=><option key={r}>{r}</option>)}
                            </select>
                            {!showAddReparto ? (
                              <div style={{display:"flex",gap:6}}>
                                <button type="button" onClick={()=>setShowAddReparto(true)} style={{background:"transparent",border:"1px dashed #30363d",borderRadius:6,color:"#8b949e",fontSize:12,padding:"5px 10px",cursor:"pointer",flex:1,fontFamily:"'IBM Plex Mono',monospace",transition:"all .15s"}}
                                  onMouseEnter={e=>e.target.style.borderColor="#388bfd"} onMouseLeave={e=>e.target.style.borderColor="#30363d"}>
                                  + Aggiungi nuovo reparto
                                </button>
                                <button type="button" onClick={()=>setShowRepartiManager(true)} style={{background:"transparent",border:"1px solid #30363d",borderRadius:6,color:"#484f58",fontSize:11,padding:"5px 9px",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace"}} title="Gestisci reparti">⚙</button>
                              </div>
                            ) : (
                              <div style={{display:"flex",gap:6}}>
                                <input className="fi2" placeholder="Nome reparto..." value={newReparto} onChange={e=>setNewReparto(e.target.value)}
                                  onKeyDown={e=>{if(e.key==="Enter"&&newReparto.trim()){const v=newReparto.trim();addReparto(v);setForm(f=>({...f,reparto:v}));setNewReparto("");setShowAddReparto(false);}if(e.key==="Escape"){setShowAddReparto(false);setNewReparto("");}}}
                                  style={{flex:1}} autoFocus/>
                                <button type="button" className="btn btn-primary" style={{padding:"5px 10px",fontSize:12}} onClick={()=>{const v=newReparto.trim();if(v){addReparto(v);setForm(f=>({...f,reparto:v}));setNewReparto("");setShowAddReparto(false);}}}>✓</button>
                                <button type="button" className="btn btn-ghost" style={{padding:"5px 10px",fontSize:12}} onClick={()=>{setShowAddReparto(false);setNewReparto("");}}>✕</button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input className="fi2" type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{marginBottom:28}}>
                <div style={{fontSize:11,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:16,paddingBottom:8,borderBottom:"1px solid #21262d"}}>📋 Stato & Note</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:16}}>
                  <div className="fi"><label className="fl">Stato</label>
                    <select className="fi2" value={form.stato} onChange={e=>setForm({...form,stato:e.target.value})}>{stati.map(s=><option key={s}>{s}</option>)}</select>
                  </div>
                  <div className="fi"><label className="fl">Note</label>
                    <textarea className="fi2" rows={2} placeholder="Note aggiuntive..." value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{resize:"vertical"}}/>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-ghost" onClick={()=>setView("table")}>Annulla</button>
                <button className="btn btn-primary" onClick={saveForm} disabled={saving}>
                  {saving?"Salvataggio...":"💾 "+(editId?"Salva Modifiche":"Aggiungi Asset")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ DETAIL ══ */}
        {view==="detail"&&detailAsset&&(
          <div className="ai">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
              <button className="btn btn-ghost" onClick={()=>setView("table")} style={{padding:"6px 12px"}}>← Indietro</button>
              <h2 style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:600,fontSize:18}}>{detailAsset.nominativo}</h2>
              <span className="badge" style={{background:statoColor(detailAsset.stato)+"22",color:statoColor(detailAsset.stato),border:`1px solid ${statoColor(detailAsset.stato)}44`}}>{detailAsset.stato}</span>
              <div style={{flex:1}}/>
              <button className="btn btn-accent" onClick={()=>openEdit(detailAsset)}>✏️ Modifica</button>
              <button className="btn btn-danger" onClick={()=>setDeleteConfirm(detailAsset.id)}>🗑 Elimina</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,maxWidth:900,marginBottom:24}}>
              {[
                {icon:"👤",title:"Dipendente",rows:[["Nominativo",detailAsset.nominativo],["Email",detailAsset.email],["Reparto",detailAsset.reparto],["Account M365",detailAsset.accountMicrosoft]]},
                {icon:"🖥️",title:"PC",rows:[["Seriale",detailAsset.serialePC],["Modello",detailAsset.modelloPC],["Data Acquisto",fmtDate(detailAsset.dataAcquisto)],["Data Consegna",fmtDate(detailAsset.dataConsegna)]]},
                {icon:"📱",title:"SIM / Telefono",rows:[["Codice SIM",detailAsset.sim],["Numero",detailAsset.numeroCellulare],["Note",detailAsset.note||"—"]]},
              ].map(({icon,title,rows})=>(
                <div key={title} style={{background:"#161b22",border:"1px solid #21262d",borderRadius:10,padding:20}}>
                  <div style={{fontSize:11,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>{icon} {title}</div>
                  {rows.map(([k,v])=>(
                    <div key={k} style={{marginBottom:12}}>
                      <div style={{fontSize:10,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{k}</div>
                      <div style={{fontSize:13,color:(!v||v==="—")?"#484f58":"#e6edf3",wordBreak:"break-all"}}>{v||"—"}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {(()=>{
              const ah=history.filter(h=>h.asset_id===detailAsset.id);
              if(!ah.length) return null;
              return (
                <div style={{maxWidth:900}}>
                  <div style={{fontSize:11,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>🕓 Storico di questo asset</div>
                  <div style={{background:"#161b22",border:"1px solid #21262d",borderRadius:10,overflow:"hidden"}}>
                    {ah.map((h,i)=>{
                      const changes = h.changes ? (typeof h.changes==="string" ? JSON.parse(h.changes) : h.changes) : null;
                      return (
                        <div key={h.id} style={{padding:"12px 16px",borderBottom:i<ah.length-1?"1px solid #21262d":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:changes?.length?8:0}}>
                            <ActionBadge action={h.action}/>
                            <span style={{fontSize:12,color:"#8b949e"}}>{fmtTs(h.ts)}</span>
                          </div>
                          {changes?.map((c,ci)=>(
                            <div key={ci} style={{marginTop:4,fontSize:12,color:"#8b949e",paddingLeft:8}}>
                              <span style={{color:"#484f58"}}>{c.field}: </span>
                              <span style={{color:"#ef4444"}}>{c.from||"(vuoto)"}</span>
                              <span style={{color:"#484f58"}}> → </span>
                              <span style={{color:"#22c55e"}}>{c.to||"(vuoto)"}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {view==="history"&&(
          <div className="ai">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
              <h2 style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:600,fontSize:18}}>🕓 Storico Modifiche</h2>
              <span style={{fontSize:12,color:"#8b949e"}}>{history.length} eventi</span>
              <div style={{flex:1}}/>
              <input className="fi2" placeholder="Filtra per nome, seriale, azione..." value={historySearch} onChange={e=>setHistorySearch(e.target.value)} style={{width:310}}/>
            </div>
            <div style={{background:"#161b22",border:"1px solid #21262d",borderRadius:10,overflow:"hidden"}}>
              {filteredH.length===0?(
                <div style={{padding:"48px 0",textAlign:"center",color:"#484f58"}}>Nessun evento trovato</div>
              ):filteredH.map((h,i)=>{
                const changes = h.changes ? (typeof h.changes==="string" ? JSON.parse(h.changes) : h.changes) : null;
                return (
                  <div key={h.id} className="rh" style={{padding:"14px 20px",borderBottom:i<filteredH.length-1?"1px solid #21262d":"none",display:"flex",gap:16,alignItems:"flex-start"}}>
                    <div style={{minWidth:160,paddingTop:1}}><ActionBadge action={h.action}/></div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:changes?.length?6:0}}>
                        <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:500,fontSize:13}}>{h.asset_nome||"—"}</span>
                        {h.asset_serial&&<span style={{fontSize:12,color:"#58a6ff"}}>{h.asset_serial}</span>}
                      </div>
                      {changes?.map((c,ci)=>(
                        <div key={ci} style={{fontSize:12,color:"#8b949e",marginTop:3}}>
                          <span style={{color:"#484f58"}}>{c.field}: </span>
                          <span style={{color:"#ef4444"}}>{String(c.from)||"(vuoto)"}</span>
                          <span style={{color:"#484f58"}}> → </span>
                          <span style={{color:"#22c55e"}}>{String(c.to)||"(vuoto)"}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:12,color:"#484f58",whiteSpace:"nowrap",paddingTop:2}}>{fmtTs(h.ts)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ IMPORT ══ */}
        {view==="import"&&(
          <div className="ai" style={{maxWidth:820}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
              <h2 style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:600,fontSize:18}}>⬆ Importazione Massiva</h2>
            </div>
            <div style={{background:"#161b22",border:"1px solid #21262d",borderRadius:10,padding:20,marginBottom:20}}>
              <div style={{fontSize:11,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>📋 Come funziona</div>
              <div style={{fontSize:13,color:"#8b949e",lineHeight:1.85}}>
                1. Scarica il{" "}<button className="btn btn-ghost" onClick={dlTemplate} style={{padding:"2px 10px",fontSize:12,display:"inline-flex",verticalAlign:"middle"}}>template CSV ⬇</button>{" "}e compilalo con i tuoi dati.<br/>
                2. Le colonne <span style={{color:"#58a6ff"}}>Nominativo</span> e <span style={{color:"#58a6ff"}}>Seriale PC</span> sono obbligatorie.<br/>
                3. Scegli la modalità e carica il file — vedrai un'anteprima prima di confermare.
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              {[["aggiungi","➕ Aggiungi ai record esistenti"],["sostituisci","♻ Sostituisci tutti i record"]].map(([m,l])=>(
                <button key={m} className={`btn ${importMode===m?"btn-accent":"btn-ghost"}`} onClick={()=>setImportMode(m)}>{l}</button>
              ))}
            </div>
            {importMode==="sostituisci"&&<div style={{background:"#da363322",border:"1px solid #da363344",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#f85149",marginBottom:16}}>⚠ Questa modalità eliminerà tutti i {assets.length} record esistenti.</div>}
            {!importData?(
              <div className="dz" onClick={()=>fileRef.current.click()}>
                <div style={{fontSize:40,marginBottom:12}}>📂</div>
                <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:15,marginBottom:6}}>Clicca per selezionare il file CSV</div>
                <div style={{fontSize:12,color:"#484f58"}}>Formato supportato: .csv (UTF-8)</div>
                <input ref={fileRef} type="file" accept=".csv,text/csv" style={{display:"none"}} onChange={handleFile}/>
              </div>
            ):(
              <div>
                {importData.errors.length>0&&(
                  <div style={{background:"#da363322",border:"1px solid #da363344",borderRadius:8,padding:"12px 16px",marginBottom:16}}>
                    <div style={{fontSize:12,color:"#f85149",marginBottom:6,fontWeight:500}}>⚠ {importData.errors.length} errore/i — righe saltate</div>
                    {importData.errors.slice(0,5).map((e,i)=><div key={i} style={{fontSize:12,color:"#8b949e"}}>{e}</div>)}
                  </div>
                )}
                <div style={{background:"#161b22",border:"1px solid #21262d",borderRadius:10,overflow:"hidden",marginBottom:16}}>
                  <div style={{padding:"10px 16px",borderBottom:"1px solid #21262d",fontSize:12,color:"#22c55e",fontWeight:600}}>✓ {importData.records.length} record pronti per l'importazione</div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead><tr style={{background:"#0d1117"}}>
                        {["Nominativo","Reparto","Seriale PC","Modello","Cellulare","Stato"].map(h=>(
                          <th key={h} style={{padding:"8px 12px",textAlign:"left",color:"#8b949e",fontWeight:500,fontSize:11,textTransform:"uppercase"}}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {importData.records.slice(0,8).map((r,i)=>(
                          <tr key={i} style={{borderTop:"1px solid #21262d"}}>
                            <td style={{padding:"8px 12px"}}>{r.nominativo}</td>
                            <td style={{padding:"8px 12px"}}><span className="tag">{r.reparto||"—"}</span></td>
                            <td style={{padding:"8px 12px",color:"#58a6ff"}}>{r.serialePC}</td>
                            <td style={{padding:"8px 12px",color:"#8b949e"}}>{r.modelloPC||"—"}</td>
                            <td style={{padding:"8px 12px",color:"#8b949e"}}>{r.numeroCellulare||"—"}</td>
                            <td style={{padding:"8px 12px"}}><span className="badge" style={{background:statoColor(r.stato)+"22",color:statoColor(r.stato),border:`1px solid ${statoColor(r.stato)}44`}}>{r.stato}</span></td>
                          </tr>
                        ))}
                        {importData.records.length>8&&<tr><td colSpan={6} style={{padding:"8px 12px",textAlign:"center",color:"#484f58",fontSize:11}}>...e altri {importData.records.length-8}</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-ghost" onClick={()=>setImportData(null)}>← Cambia file</button>
                  <button className="btn btn-primary" onClick={confirmImport} disabled={saving||!importData.records.length}>
                    {saving?"Importazione...":"✓ Conferma importazione ("+importData.records.length+")"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
