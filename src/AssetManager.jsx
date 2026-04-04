import { useState, useMemo, useRef, useEffect } from "react";
import { supabase } from "./supabase";

const CSV_COLUMNS = ["nominativo","email","reparto","serialePC","modelloPC","dataAcquisto","dataConsegna","sim","numeroCellulare","accountMicrosoft","note","stato"];
const CSV_HEADERS = ["Nominativo","Email","Ruolo","Seriale PC","Modello PC","Data Acquisto","Data Consegna","SIM","Numero Cellulare","Account Microsoft","Note","Stato"];
const emptyForm = { nominativo:"",email:"",reparto:"",serialePC:"",modelloPC:"",dataAcquisto:"",dataConsegna:"",sim:"",numeroCellulare:"",accountMicrosoft:"",note:"",stato:"Attivo" };
const defaultRepartiList = ["Back Office","Front Office","IT Management","IT","HR","Sales","Finance","Operations","Marketing","Direzione"];
const stati = ["Attivo","In manutenzione","Dismesso","Smarrito"];

const ALL_COLUMNS = [
  { key:"nominativo",      label:"Nominativo",    always:true  },
  { key:"email",           label:"Email",          always:false },
  { key:"reparto",         label:"Ruolo",          always:false },
  { key:"serialePC",       label:"Seriale PC",     always:false },
  { key:"modelloPC",       label:"Modello PC",     always:false },
  { key:"dataAcquisto",    label:"Data Acquisto",  always:false },
  { key:"dataConsegna",    label:"Data Consegna",  always:false },
  { key:"numeroCellulare", label:"Cellulare",      always:false },
  { key:"sim",             label:"SIM",            always:false },
  { key:"accountMicrosoft",label:"Account M365",   always:false },
  { key:"note",            label:"Note",           always:false },
  { key:"stato",           label:"Stato",          always:false },
  { key:"hardware",        label:"Hardware",       always:false },
];

const THEMES = {
  black: { bg:"#0a0c10",surface:"#13161e",surface2:"#0a0c10",border:"#1e2330",border2:"#2a3040",text:"#edf0f7",textSub:"#8892a8",textMuted:"#424d60",hover:"#181d28",inputBg:"#0a0c10",selectBg:"#13161e",link:"#6ea8fe",tabOn:"#1e2330",accent:"#4f6ef7",scrollTr:"#13161e",scrollTh:"#2a3040" },
  dark:  { bg:"#131929",surface:"#1b2236",surface2:"#131929",border:"#243050",border2:"#2e3d60",text:"#dde5f5",textSub:"#7f90b8",textMuted:"#4a5878",hover:"#1e2a42",inputBg:"#131929",selectBg:"#1b2236",link:"#82aaff",tabOn:"#1e2a42",accent:"#5b7cfa",scrollTr:"#1b2236",scrollTh:"#2e3d60" },
  light: { bg:"#f4f6fb",surface:"#ffffff",surface2:"#eef1f8",border:"#dce2f0",border2:"#c5cfe8",text:"#111827",textSub:"#374151",textMuted:"#6b7a99",hover:"#e8edf8",inputBg:"#ffffff",selectBg:"#ffffff",link:"#2563eb",tabOn:"#dde5f8",accent:"#4f6ef7",scrollTr:"#f4f6fb",scrollTh:"#c5cfe8" },
};

const statoColor = (s) => ({"Attivo":"#22c55e","In manutenzione":"#f59e0b","Dismesso":"#ef4444","Smarrito":"#8b5cf6"}[s]||"#888");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("it-IT") : "—";
const fmtTs  = (ts) => new Date(ts).toLocaleString("it-IT");

function toCSV(data) {
  const rows = [CSV_HEADERS.join(",")];
  data.forEach(a => rows.push(CSV_COLUMNS.map(k=>`"${(a[k]||"").replace(/"/g,'""')}"`).join(",")));
  return rows.join("\n");
}
function downloadFile(content, name, mime) {
  const blob = new Blob([content],{type:mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=name; a.click();
  URL.revokeObjectURL(url);
}
async function exportToXLSX(data, filename) {
  if (!window.XLSX) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const XLSX = window.XLSX;
  const rows = [CSV_HEADERS, ...data.map(a => CSV_COLUMNS.map(k => a[k] || ""))];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = CSV_HEADERS.map((h, i) => {
    const maxLen = Math.max(h.length, ...data.map(a => String(a[CSV_COLUMNS[i]] || "").length));
    return { wch: Math.min(maxLen + 2, 40) };
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Asset");
  XLSX.writeFile(wb, filename);
}
async function loadXLSX() {
  if (window.XLSX) return window.XLSX;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error("Impossibile caricare SheetJS"));
    document.head.appendChild(s);
  });
}
async function parseXLSX(file) {
  const XLSX = await loadXLSX();
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (rows.length < 2) return { records: [], errors: ["File vuoto o senza dati"] };
  const normalize = s => String(s).trim().toLowerCase().replace(/\s+/g, " ");
  const header = rows[0].map(normalize);
  const colMap = {};
  CSV_COLUMNS.forEach((col, i) => {
    [col.toLowerCase(), CSV_HEADERS[i].toLowerCase(), normalize(CSV_HEADERS[i])].forEach(alias => {
      const idx = header.indexOf(alias);
      if (idx !== -1 && colMap[col] === undefined) colMap[col] = idx;
    });
  });
  if (Object.keys(colMap).length === 0) {
    return { records: [], errors: [`Nessuna colonna riconosciuta. Intestazioni trovate: ${header.slice(0,6).join(", ")}`] };
  }
  const records = []; const errors = [];
  rows.slice(1).forEach((row, li) => {
    if (row.every(c => String(c).trim() === "")) return;
    const rec = { ...emptyForm };
    CSV_COLUMNS.forEach(col => {
      if (colMap[col] !== undefined) {
        const val = row[colMap[col]];
        rec[col] = val instanceof Date ? val.toISOString().slice(0, 10) : String(val ?? "").trim();
      }
    });
    if (!rec.nominativo) { errors.push(`Riga ${li + 2}: "Nominativo" mancante`); return; }
    if (!rec.serialePC)  { errors.push(`Riga ${li + 2}: "Seriale PC" mancante`); return; }
    if (!stati.includes(rec.stato)) rec.stato = "Attivo";
    records.push(rec);
  });
  return { records, errors };
}
function diffAssets(before, after) {
  return CSV_COLUMNS.filter(k=>(before[k]||"")!==(after[k]||"")).map(k=>({field:k,from:before[k]||"",to:after[k]||""}));
}

export default function AssetManager() {
  const [theme, setTheme] = useState("dark");
  const T = THEMES[theme];

  // data
  const [loading, setLoading]   = useState(true);
  const [dbError, setDbError]   = useState(null);
  const [assets, setAssets]     = useState([]);
  const [hardware, setHardware] = useState([]);
  const [history, setHistory]   = useState([]);
  const [reparti, setReparti]   = useState([]);
  const [checks, setChecks]     = useState({});
  const [checkLabels, setCheckLabels] = useState(["Email","HSW","Talkdesk","Opzione"]);

  // ui
  const [newReparto, setNewReparto]       = useState("");
  const [showAddReparto, setShowAddReparto] = useState(false);
  const [showRepartiManager, setShowRepartiManager] = useState(false);
  const [view, setView]         = useState("table");
  const [prevView, setPrevView] = useState("table");
  const [editId, setEditId]     = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [search, setSearch]     = useState("");
  const [filterReparto, setFilterReparto] = useState("Tutti");
  const [filterStato, setFilterStato]     = useState("Tutti");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]       = useState(null);
  const [sortField, setSortField] = useState("nominativo");
  const [sortDir, setSortDir]   = useState("asc");
  const [historySearch, setHistorySearch] = useState("");
  const [importData, setImportData] = useState(null);
  const [importMode, setImportMode] = useState("aggiungi");
  const fileRef = useRef();
  const [hwForm, setHwForm]     = useState({tipo:"",marca:"",modello:"",seriale:"",stato:"In uso",assegnatoA:"",note:""});
  const [hwEditId, setHwEditId] = useState(null);
  const [hwView, setHwView]     = useState("table");
  const [hwSearch, setHwSearch] = useState("");
  const [hwDeleteConfirm, setHwDeleteConfirm] = useState(null);
  const [hwSortField, setHwSortField] = useState("tipo");
  const [hwSortDir, setHwSortDir]     = useState("asc");
  const [editingLabel, setEditingLabel] = useState(null);
  const [visibleCols, setVisibleCols]   = useState(["nominativo","reparto","serialePC","modelloPC","numeroCellulare","sim","dataConsegna","stato","hardware"]);
  const [colOrder, setColOrder]         = useState(ALL_COLUMNS.map(c=>c.key));
  const [showColManager, setShowColManager] = useState(false);
  const [dragCol, setDragCol]   = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [colWidths, setColWidths] = useState({});
  const resizingCol   = useRef(null);
  const resizingStartX= useRef(0);
  const resizingStartW= useRef(0);
  const tableRef      = useRef(null);

  const HW_TIPI  = ["PC","Monitor","Telefono","SIM","Cuffie","Altro"];
  const HW_STATI = ["In uso","Disponibile","In manutenzione","Dismesso"];
  const emptyHwForm = {tipo:"",marca:"",modello:"",seriale:"",stato:"In uso",assegnatoA:"",note:""};

  // ── load ──
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [aR, hR, hiR, rR, cR, lR] = await Promise.all([
          supabase.from("assets").select("*").order("id"),
          supabase.from("hardware").select("*").order("id"),
          supabase.from("history").select("*").order("ts", { ascending: false }),
          supabase.from("reparti").select("*").order("nome"),
          supabase.from("checks").select("*"),
          supabase.from("check_labels").select("*").order("idx"),
        ]);
        if (aR.error)  throw aR.error;
        if (hR.error)  throw hR.error;
        if (hiR.error) throw hiR.error;
        if (rR.error)  throw rR.error;
        setAssets(aR.data || []);
        setHardware(hR.data || []);
        setHistory(hiR.data || []);
        setReparti((rR.data||[]).map(r=>r.nome).filter(Boolean).length > 0 ? (rR.data||[]).map(r=>r.nome) : defaultRepartiList);
        const chMap = {};
        (cR.data||[]).forEach(c => { chMap[c.key] = c.value; });
        setChecks(chMap);
        const lbs = (lR.data||[]).sort((a,b)=>a.idx-b.idx);
        if (lbs.length === 4) setCheckLabels(lbs.map(l=>l.label));
      } catch (err) {
        setDbError(err.message || "Errore connessione database");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  // ── computed ──
  const filtered = useMemo(() => {
    let d = [...assets];
    if (search) { const q=search.toLowerCase(); d=d.filter(a=>["nominativo","serialePC","numeroCellulare","sim","accountMicrosoft","email","modelloPC"].some(k=>(a[k]||"").toLowerCase().includes(q))); }
    if (filterReparto !== "Tutti") d = d.filter(a=>a.reparto===filterReparto);
    if (filterStato   !== "Tutti") d = d.filter(a=>a.stato===filterStato);
    d.sort((a,b)=>{ const va=(a[sortField]||"").toLowerCase(), vb=(b[sortField]||"").toLowerCase(); return sortDir==="asc"?va.localeCompare(vb):vb.localeCompare(va); });
    return d;
  }, [assets,search,filterReparto,filterStato,sortField,sortDir]);

  const filteredH = useMemo(() => {
    if (!historySearch) return history;
    const q = historySearch.toLowerCase();
    return history.filter(h=>(h.assetNome||"").toLowerCase().includes(q)||(h.assetSerial||"").toLowerCase().includes(q)||h.action.toLowerCase().includes(q));
  }, [history,historySearch]);

  const hwFiltered = useMemo(() => {
    let d = [...hardware];
    if (hwSearch) { const q=hwSearch.toLowerCase(); d=d.filter(h=>Object.values(h).some(v=>String(v).toLowerCase().includes(q))); }
    d.sort((a,b)=>{ const va=String(a[hwSortField]||"").toLowerCase(), vb=String(b[hwSortField]||"").toLowerCase(); return hwSortDir==="asc"?va.localeCompare(vb):vb.localeCompare(va); });
    return d;
  }, [hardware,hwSearch,hwSortField,hwSortDir]);

  // ── asset CRUD ──
  const openNew    = () => { setForm(emptyForm); setEditId(null); setPrevView("table"); setView("form"); };
  const openEdit   = (a) => { setForm({...a}); setEditId(a.id); setPrevView(view); setView("form"); };
  const openDetail = (a) => { setDetailId(a.id); setView("detail"); };
  const sortBy     = (f) => { if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc"); else{setSortField(f);setSortDir("asc");} };

  const saveForm = async () => {
    if (!form.nominativo) { showToast("Nominativo obbligatorio","error"); return; }
const clean = (v) => v === "" ? null : v;

const payload = {
  nominativo: form.nominativo,
  email: clean(form.email),
  reparto: clean(form.reparto),
  serialePC: clean(form.serialePC),
  modelloPC: clean(form.modelloPC),
  dataAcquisto: clean(form.dataAcquisto),
  dataConsegna: clean(form.dataConsegna),
  sim: clean(form.sim),
  numeroCellulare: clean(form.numeroCellulare),
  accountMicrosoft: clean(form.accountMicrosoft),
  note: clean(form.note),
  stato: form.stato
};
    try {
      if (editId) {
        const before = assets.find(a=>a.id===editId);
        const changes = diffAssets(before,{...form,id:editId});
        const { data, error } = await supabase.from("assets").update(payload).eq("id",editId).select().single();
        if (error) throw error;
        setAssets(prev=>prev.map(a=>a.id===editId?data:a));
        await addHistory("MODIFICATO",data,changes);
        showToast("Asset aggiornato!");
      } else {
        const { data, error } = await supabase.from("assets").insert(payload).select().single();
        if (error) throw error;
        setAssets(prev=>[...prev,data]);
        await addHistory("CREATO",data,null);
        showToast("Nuovo asset aggiunto!");
      }
      setView(prevView);
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  const doDelete = async () => {
    const a = assets.find(x=>x.id===deleteConfirm);
    try {
      const { error } = await supabase.from("assets").delete().eq("id",deleteConfirm);
      if (error) throw error;
      setAssets(prev=>prev.filter(x=>x.id!==deleteConfirm));
      await addHistory("ELIMINATO",a,null);
      setDeleteConfirm(null);
      if (view==="detail") setView("table");
      showToast("Asset eliminato","info");
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  const addHistory = async (action, asset, changes) => {
    const entry = { ts:Date.now(),action,assetId:asset?.id||null,assetSerial:asset?.serialePC||null,assetNome:asset?.nominativo||null,changes:changes||null };
    try {
      const { data, error } = await supabase.from("history").insert(entry).select().single();
      if (!error && data) setHistory(prev=>[data,...prev]);
    } catch {}
  };

  // ── reparti ──
  const addReparto = async (nome) => {
    if (!nome || reparti.includes(nome)) return;
    try {
      const { error } = await supabase.from("reparti").insert({ nome });
      if (error) throw error;
      setReparti(prev=>[...prev,nome]);
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };
  const removeReparto = async (nome) => {
    try {
      const { error } = await supabase.from("reparti").delete().eq("nome",nome);
      if (error) throw error;
      setReparti(prev=>prev.filter(r=>r!==nome));
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  // ── checks ──
  const toggleCheck = async (assetId, idx) => {
    const key = `${assetId}-${idx}`;
    const newVal = !checks[key];
    setChecks(prev=>({...prev,[key]:newVal}));
    try {
      const { error } = await supabase.from("checks").upsert({key,value:newVal},{onConflict:"key"});
      if (error) throw error;
    } catch (err) { setChecks(prev=>({...prev,[key]:!newVal})); showToast("Errore spunta","error"); }
  };
  const getCheck = (assetId,idx) => !!checks[`${assetId}-${idx}`];

  const saveCheckLabel = async (idx, label) => {
    setCheckLabels(prev=>{const n=[...prev];n[idx]=label;return n;});
    try { await supabase.from("check_labels").upsert({idx,label},{onConflict:"idx"}); } catch {}
  };

  // ── hardware CRUD ──
  const hwSortBy = (f) => { if(hwSortField===f) setHwSortDir(d=>d==="asc"?"desc":"asc"); else{setHwSortField(f);setHwSortDir("asc");} };

  const saveHwForm = async () => {
    if (!hwForm.tipo||!hwForm.seriale) { showToast("Tipo e Seriale obbligatori","error"); return; }
    if (hardware.some(h=>h.seriale===hwForm.seriale&&h.id!==hwEditId)) { showToast("Seriale duplicato","error"); return; }
    const statoAuto = hwForm.assegnatoA ? "In uso" : (hwForm.stato==="In uso"?"Disponibile":hwForm.stato);
    const payload = {...hwForm,stato:statoAuto};
    try {
      if (hwEditId) {
        const { data, error } = await supabase.from("hardware").update(payload).eq("id",hwEditId).select().single();
        if (error) throw error;
        setHardware(prev=>prev.map(h=>h.id===hwEditId?data:h));
        if (data.tipo==="PC"&&data.assegnatoA) {
          await supabase.from("assets").update({serialePC:data.seriale,modelloPC:`${data.marca} ${data.modello}`.trim()}).eq("nominativo",data.assegnatoA);
          setAssets(prev=>prev.map(a=>a.nominativo===data.assegnatoA?{...a,serialePC:data.seriale,modelloPC:`${data.marca} ${data.modello}`.trim()}:a));
        }
        const old = hardware.find(h=>h.id===hwEditId);
        if (old?.tipo==="PC"&&old.assegnatoA&&old.assegnatoA!==data.assegnatoA) {
          await supabase.from("assets").update({serialePC:"",modelloPC:""}).eq("nominativo",old.assegnatoA).eq("serialePC",old.seriale);
          setAssets(prev=>prev.map(a=>a.nominativo===old.assegnatoA&&a.serialePC===old.seriale?{...a,serialePC:"",modelloPC:""}:a));
        }
        showToast("Hardware aggiornato!");
      } else {
        const { data, error } = await supabase.from("hardware").insert(payload).select().single();
        if (error) throw error;
        setHardware(prev=>[...prev,data]);
        if (data.tipo==="PC"&&data.assegnatoA) {
          await supabase.from("assets").update({serialePC:data.seriale,modelloPC:`${data.marca} ${data.modello}`.trim()}).eq("nominativo",data.assegnatoA);
          setAssets(prev=>prev.map(a=>a.nominativo===data.assegnatoA?{...a,serialePC:data.seriale,modelloPC:`${data.marca} ${data.modello}`.trim()}:a));
        }
        showToast("Hardware aggiunto!");
      }
      setHwView("table"); setHwEditId(null); setHwForm(emptyHwForm);
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  const doDeleteHw = async (id) => {
    try {
      const { error } = await supabase.from("hardware").delete().eq("id",id);
      if (error) throw error;
      setHardware(prev=>prev.filter(h=>h.id!==id));
      setHwDeleteConfirm(null);
      showToast("Hardware eliminato","info");
    } catch (err) { showToast("Errore: "+err.message,"error"); }
  };

  // ── import ──
  const dlTemplate = async () => {
    const XLSX = await loadXLSX();
    const ws = XLSX.utils.aoa_to_sheet([CSV_HEADERS, CSV_COLUMNS.map(()=>"")]);
    ws["!cols"] = CSV_HEADERS.map(h=>({wch:Math.max(h.length+4,16)}));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Asset");
    XLSX.writeFile(wb,"template-import.xlsx");
  };
  const handleFile = async (e) => {
    const f=e.target.files[0]; if(!f) return; e.target.value="";
    try { setImportData(await parseXLSX(f)); } catch(err) { setImportData({records:[],errors:["Errore: "+err.message]}); }
  };
  const confirmImport = async () => {
    if (!importData||!importData.records.length) return;
    try {
      if (importMode==="sostituisci") { await supabase.from("assets").delete().neq("id",0); setAssets([]); }
      const toInsert = importData.records.map(r=>({nominativo:r.nominativo,email:r.email,reparto:r.reparto,serialePC:r.serialePC,modelloPC:r.modelloPC,dataAcquisto:r.dataAcquisto,dataConsegna:r.dataConsegna,sim:r.sim,numeroCellulare:r.numeroCellulare,accountMicrosoft:r.accountMicrosoft,note:r.note,stato:r.stato}));
      const { data, error } = await supabase.from("assets").insert(toInsert).select();
      if (error) throw error;
      setAssets(prev=>importMode==="sostituisci"?data:[...prev,...data]);
      const hi = {ts:Date.now(),action:importMode==="sostituisci"?"IMPORTAZIONE_COMPLETA":"IMPORTAZIONE",assetId:null,assetSerial:null,assetNome:`${data.length} asset`,changes:null};
      const { data:hd } = await supabase.from("history").insert(hi).select().single();
      if (hd) setHistory(prev=>[hd,...prev]);
      showToast(`${data.length} asset importati!`);
      setImportData(null); setView("table");
    } catch(err) { showToast("Errore importazione: "+err.message,"error"); }
  };

  const exportCSV = () => { downloadFile(toCSV(filtered),"asset-export.csv","text/csv;charset=utf-8"); showToast(`CSV esportato (${filtered.length} record)`); };
  const exportXLS = () => { exportToXLSX(filtered,"asset-export.xlsx").then(()=>showToast(`Excel esportato (${filtered.length} record)`)).catch(e=>showToast("Errore: "+e.message,"error")); };

  const SortIcon = ({field}) => <span style={{opacity:sortField===field?1:0.3,marginLeft:4,fontSize:10}}>{sortField===field&&sortDir==="desc"?"▼":"▲"}</span>;
  const detailAsset = assets.find(a=>a.id===detailId);
  const ActionBadge = ({action}) => {
    const map={CREATO:["#22c55e","✦"],MODIFICATO:["#f59e0b","✎"],ELIMINATO:["#ef4444","✕"],IMPORTAZIONE:["#1f6feb","⬆"],IMPORTAZIONE_COMPLETA:["#8b5cf6","⬆"]};
    const [color,icon]=map[action]||["#888","·"];
    return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>{icon} {action.replace(/_/g," ")}</span>;
  };

  // ── loading / error ──
  if (loading) return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#131929",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#dde5f5"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16}}>⏳</div>
        <div style={{fontSize:16,fontWeight:500}}>Caricamento dati dal database...</div>
        <div style={{fontSize:13,color:"#7f90b8",marginTop:8}}>Connessione a Supabase in corso</div>
      </div>
    </div>
  );

  if (dbError) return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#131929",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#dde5f5"}}>
      <div style={{textAlign:"center",maxWidth:500,padding:32}}>
        <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
        <div style={{fontSize:18,fontWeight:600,marginBottom:12}}>Errore connessione database</div>
        <div style={{fontSize:13,color:"#f85149",background:"#da363322",border:"1px solid #da363344",borderRadius:8,padding:"12px 16px",marginBottom:20,textAlign:"left",fontFamily:"monospace"}}>{dbError}</div>
        <div style={{fontSize:13,color:"#7f90b8",marginBottom:20,textAlign:"left",lineHeight:1.9}}>
          Verifica che le variabili d'ambiente siano configurate correttamente nel file <code style={{color:"#82aaff"}}>.env</code> (o in Netlify):<br/>
          <code style={{color:"#82aaff"}}>VITE_SUPABASE_URL</code><br/>
          <code style={{color:"#82aaff"}}>VITE_SUPABASE_ANON_KEY</code><br/><br/>
          Poi esegui lo script <code style={{color:"#82aaff"}}>supabase_schema.sql</code> nel tuo progetto Supabase.
        </div>
        <button onClick={()=>window.location.reload()} style={{background:"#1f6feb",color:"#fff",border:"none",borderRadius:8,padding:"10px 24px",fontSize:14,cursor:"pointer"}}>↺ Riprova</button>
      </div>
    </div>
  );

  // ── render ──
  return (
    <div style={{fontFamily:"'Inter','JetBrains Mono',sans-serif",background:T.bg,minHeight:"100vh",color:T.text,transition:"background .2s,color .2s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:${T.scrollTr}}
        ::-webkit-scrollbar-thumb{background:${T.scrollTh};border-radius:3px}
        input,select,textarea{outline:none;transition:border .15s,background .2s,color .2s}
        .btn{cursor:pointer;border:none;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;padding:8px 16px;transition:all .15s}
        .btn-primary{background:#238636;color:#fff}.btn-primary:hover{background:#2ea043}
        .btn-danger{background:#da3633;color:#fff}.btn-danger:hover{background:#f85149}
        .btn-ghost{background:transparent;color:${T.textSub};border:1px solid ${T.border2}}.btn-ghost:hover{background:${T.hover};color:${T.text}}
        .btn-accent{background:#1f6feb;color:#fff}.btn-accent:hover{background:#388bfd}
        .btn-purple{background:#6e40c9;color:#fff}.btn-purple:hover{background:#8957e5}
        .fi{display:flex;flex-direction:column;gap:6px}
        .fl{font-size:11px;color:${T.textSub};text-transform:uppercase;letter-spacing:.08em}
        .fi2{background:${T.inputBg};border:1px solid ${T.border2};border-radius:6px;color:${T.text};font-family:'JetBrains Mono',monospace;font-size:13px;padding:9px 12px;width:100%}
        .fi2:focus{border-color:#388bfd}
        .fi2::placeholder{color:${T.textMuted}}
        select.fi2 option{background:${T.selectBg};color:${T.text}}
        .th{cursor:pointer;user-select:none;white-space:nowrap}.th:hover{color:${T.link}}
        .rh:hover{background:${T.hover}!important}
        .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500}
        .tag{display:inline-block;background:${T.surface2};border:1px solid ${T.border};border-radius:4px;padding:2px 8px;font-size:11px;color:${T.textSub}}
        .ntab{cursor:pointer;padding:8px 16px;border-radius:6px;font-size:13px;color:${T.textSub};transition:all .15s;border:none;background:transparent;font-family:'JetBrains Mono',monospace;white-space:nowrap}
        .ntab:hover{color:${T.text};background:${T.tabOn}}
        .ntab.on{color:${T.text};background:${T.tabOn};border-bottom:2px solid #1f6feb}
        .dz{border:2px dashed ${T.border2};border-radius:10px;padding:40px;text-align:center;cursor:pointer;transition:all .2s}
        .dz:hover{border-color:#1f6feb;background:#1f6feb0a}
        @keyframes si{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .ai{animation:si .2s ease}
      `}</style>

      {/* HW DELETE MODAL */}
      {hwDeleteConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:12,padding:32,width:360,textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>⚠️</div><div style={{fontWeight:600,fontSize:15,color:T.text,marginBottom:8}}>Eliminare questo hardware?</div><div style={{color:T.textSub,fontSize:13,marginBottom:24}}>Operazione non reversibile.</div><div style={{display:"flex",gap:10,justifyContent:"center"}}><button className="btn btn-ghost" onClick={()=>setHwDeleteConfirm(null)}>Annulla</button><button className="btn btn-danger" onClick={()=>doDeleteHw(hwDeleteConfirm)}>Elimina</button></div></div></div>}

      {/* TOAST */}
      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:999,background:toast.type==="error"?"#da3633":toast.type==="info"?"#1f6feb":"#238636",color:"#fff",borderRadius:8,padding:"12px 20px",fontSize:13,boxShadow:"0 8px 24px rgba(0,0,0,.3)",maxWidth:340}}>{toast.msg}</div>}

      {/* DELETE MODAL */}
      {deleteConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:12,padding:32,width:360,textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>⚠️</div><div style={{fontWeight:600,fontSize:15,color:T.text,marginBottom:8}}>Eliminare questo asset?</div><div style={{color:T.textSub,fontSize:13,marginBottom:24}}>L'operazione verrà registrata nello storico.</div><div style={{display:"flex",gap:10,justifyContent:"center"}}><button className="btn btn-ghost" onClick={()=>setDeleteConfirm(null)}>Annulla</button><button className="btn btn-danger" onClick={doDelete}>Elimina</button></div></div></div>}

      {/* REPARTI MODAL */}
      {showRepartiManager&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowRepartiManager(false)}><div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:12,padding:28,width:440,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",alignItems:"center",marginBottom:20}}><div style={{fontWeight:600,fontSize:16,color:T.text}}>⚙ Gestisci Ruoli</div><div style={{flex:1}}/><button className="btn btn-ghost" style={{padding:"4px 10px",fontSize:12}} onClick={()=>setShowRepartiManager(false)}>✕</button></div><div style={{display:"flex",gap:6,marginBottom:16}}><input className="fi2" placeholder="Nome nuovo ruolo..." value={newReparto} onChange={e=>setNewReparto(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newReparto.trim()){addReparto(newReparto.trim());setNewReparto("");}}} style={{flex:1}}/><button className="btn btn-primary" style={{padding:"5px 12px",fontSize:12}} onClick={()=>{addReparto(newReparto.trim());setNewReparto("");}}>+ Aggiungi</button></div><div style={{display:"flex",flexDirection:"column",gap:6}}>{reparti.map(r=><div key={r} style={{display:"flex",alignItems:"center",background:T.surface2,borderRadius:6,padding:"8px 12px",border:`1px solid ${T.border}`}}><span style={{flex:1,fontSize:13,color:T.text}}>{r}</span><button onClick={()=>removeReparto(r)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}>🗑</button></div>)}</div></div></div>}

      {/* HEADER */}
      <div style={{borderBottom:`1px solid ${T.border}`,padding:"12px 24px",display:"flex",alignItems:"center",gap:12,background:T.surface,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:T.accent,borderRadius:12,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🖥️</div>
          <div>
            <div style={{fontWeight:700,fontSize:17,letterSpacing:"-0.02em",color:T.text}}>
              <span style={{color:T.accent,fontWeight:800}}>Hili</span>{" "}Asset Manager
            </div>
            <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.04em"}}>Gestione inventario IT</div>
          </div>
        </div>
        <div style={{display:"flex",gap:2,marginLeft:16}}>
          {[["table","📦 Asset"],["hardware","🖥 Hardware"],["history","🕓 Storico"],["import","⬆ Importa"]].map(([v,l])=>(
            <button key={v} className={`ntab${view===v?" on":""}`} onClick={()=>setView(v)}>{l}</button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:14,fontSize:12,color:T.textSub}}>
          <span>📦 <b style={{color:T.text}}>{assets.length}</b> totali</span>
          <span>✅ <b style={{color:"#22c55e"}}>{assets.filter(a=>a.stato==="Attivo").length}</b> attivi</span>
        </div>
        <div style={{display:"flex",gap:2,background:T.surface2,borderRadius:12,padding:3,border:`1px solid ${T.border}`}}>
          {["black","dark","light"].map((t,i)=>(
            <button key={t} onClick={()=>setTheme(t)} style={{background:theme===t?T.accent:"transparent",border:"none",borderRadius:9,padding:"5px 11px",cursor:"pointer",fontSize:13,color:theme===t?"#fff":T.textMuted}}>{["⬛","🌙","☀️"][i]}</button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nuovo Asset</button>
      </div>

      <div style={{padding:"24px 28px 48px"}}>

        {/* TABLE */}
        {view==="table"&&<div className="ai">
          {showColManager&&<div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:20,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",marginBottom:14}}>
              <div style={{fontWeight:600,fontSize:14,color:T.text}}>⚙ Gestisci colonne</div><div style={{flex:1}}/>
              <div style={{fontSize:12,color:T.textSub,marginRight:16}}>Trascina per riordinare · Spunta per mostrare/nascondere</div>
              <button className="btn btn-ghost" style={{padding:"4px 10px",fontSize:12}} onClick={()=>{setVisibleCols(ALL_COLUMNS.map(c=>c.key));setColOrder(ALL_COLUMNS.map(c=>c.key));}}>Ripristina</button>
              <button className="btn btn-ghost" style={{padding:"4px 10px",fontSize:12,marginLeft:6}} onClick={()=>setShowColManager(false)}>✕</button>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {colOrder.map(key=>{
                const col=ALL_COLUMNS.find(c=>c.key===key); if(!col) return null;
                const iv=visibleCols.includes(key), id=dragCol===key, io=dragOver===key;
                return <div key={key} draggable onDragStart={()=>setDragCol(key)} onDragOver={e=>{e.preventDefault();setDragOver(key);}} onDragEnd={()=>{if(dragCol&&dragOver&&dragCol!==dragOver){setColOrder(prev=>{const a=[...prev];const fi=a.indexOf(dragCol);const ti=a.indexOf(dragOver);a.splice(fi,1);a.splice(ti,0,dragCol);return a;});}setDragCol(null);setDragOver(null);}} onClick={()=>{if(col.always)return;setVisibleCols(prev=>prev.includes(key)?prev.filter(k=>k!==key):[...prev,key]);}} style={{display:"flex",alignItems:"center",gap:8,background:io&&!id?"#1f6feb22":iv?T.surface2:T.bg,border:`1px solid ${io&&!id?"#1f6feb":iv?T.border:T.border2}`,borderRadius:8,padding:"7px 12px",cursor:col.always?"default":"pointer",opacity:id?0.4:1,userSelect:"none"}}>
                  <span style={{fontSize:13,cursor:"grab",color:T.textMuted}}>⠿</span>
                  <span style={{width:14,height:14,borderRadius:4,border:`2px solid ${iv?"#1f6feb":T.border2}`,background:iv?"#1f6feb":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{iv&&<span style={{color:"#fff",fontSize:9,fontWeight:700}}>✓</span>}</span>
                  <span style={{fontSize:13,color:iv?T.text:T.textMuted,fontWeight:iv?500:400}}>{col.label}</span>
                  {col.always&&<span style={{fontSize:10,color:T.textMuted,border:`1px solid ${T.border}`,borderRadius:3,padding:"0 4px"}}>fisso</span>}
                </div>;
              })}
            </div>
          </div>}

          <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
            <input className="fi2" placeholder="🔍  Cerca nominativo, seriale, SIM, numero, modello..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:220}}/>
            <select className="fi2" value={filterReparto} onChange={e=>setFilterReparto(e.target.value)} style={{width:185}}><option value="Tutti">Tutti i ruoli</option>{reparti.map(r=><option key={r}>{r}</option>)}</select>
            <select className="fi2" value={filterStato} onChange={e=>setFilterStato(e.target.value)} style={{width:165}}><option value="Tutti">Tutti gli stati</option>{stati.map(s=><option key={s}>{s}</option>)}</select>
            {(search||filterReparto!=="Tutti"||filterStato!=="Tutti")&&<button className="btn btn-ghost" onClick={()=>{setSearch("");setFilterReparto("Tutti");setFilterStato("Tutti");}}>✕ Reset</button>}
            <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
              <button className="btn btn-ghost" onClick={()=>setShowColManager(v=>!v)} style={{display:"flex",alignItems:"center",gap:6,borderColor:showColManager?"#1f6feb":undefined,color:showColManager?"#1f6feb":undefined}}>⊞ Colonne <span style={{background:T.surface2,borderRadius:10,padding:"1px 6px",fontSize:11}}>{visibleCols.length}</span></button>
              <button className="btn btn-purple" onClick={exportXLS}>⬇ Excel</button>
            </div>
          </div>

          {(()=>{
            const activeCols=colOrder.filter(k=>visibleCols.includes(k)).map(k=>ALL_COLUMNS.find(c=>c.key===k)).filter(Boolean);
            const startResize=(e,key)=>{e.preventDefault();e.stopPropagation();const thEl=e.currentTarget.parentElement;resizingCol.current=key;resizingStartX.current=e.clientX;resizingStartW.current=colWidths[key]||thEl.offsetWidth;document.body.style.cursor="col-resize";document.body.style.userSelect="none";const onMove=(ev)=>{const delta=ev.clientX-resizingStartX.current;const nw=Math.max(60,resizingStartW.current+delta);setColWidths(prev=>({...prev,[resizingCol.current]:nw}));};const onUp=()=>{resizingCol.current=null;document.body.style.cursor="";document.body.style.userSelect="";window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);};window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);};
            const renderCell=(a,key,w)=>{
              const cs={padding:"11px 14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:w||undefined};
              switch(key){
                case "nominativo": return <td key={key} style={{...cs,maxWidth:w||220}}><div style={{fontWeight:500,fontSize:13,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.nominativo}</div><div style={{fontSize:11,color:T.textSub,overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>{a.email}</div></td>;
                case "email": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.email||"—"}</td>;
                case "reparto": return <td key={key} style={cs}><span className="tag">{a.reparto||"—"}</span></td>;
                case "serialePC": return <td key={key} style={{...cs,fontWeight:500,color:T.link}}>{a.serialePC||"—"}</td>;
                case "modelloPC": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.modelloPC||"—"}</td>;
                case "dataAcquisto": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{fmtDate(a.dataAcquisto)}</td>;
                case "dataConsegna": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{fmtDate(a.dataConsegna)}</td>;
                case "numeroCellulare": return <td key={key} style={{...cs,color:T.text}}>{a.numeroCellulare||"—"}</td>;
                case "sim": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.sim||"—"}</td>;
                case "accountMicrosoft": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.accountMicrosoft||"—"}</td>;
                case "note": return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a.note||"—"}</td>;
                case "stato": return <td key={key} style={cs}><span className="badge" style={{background:statoColor(a.stato)+"22",color:statoColor(a.stato),border:`1px solid ${statoColor(a.stato)}44`}}>{a.stato}</span></td>;
                case "hardware":{
                  const ti={"PC":"🖥","Monitor":"🖥","Telefono":"📱","SIM":"📡","Cuffie":"🎧","Altro":"📦"};
                  const ass=hardware.filter(h=>h.assegnatoA&&h.assegnatoA.toLowerCase()===a.nominativo.toLowerCase());
                  return <td key={key} style={{...cs,maxWidth:w||200}}>{ass.length===0?<span style={{color:T.textMuted,fontSize:12}}>—</span>:<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ass.map(h=><span key={h.id} title={`${h.marca} ${h.modello} · ${h.seriale}`} style={{display:"inline-flex",alignItems:"center",gap:3,background:T.surface2,border:`1px solid ${T.border}`,borderRadius:4,padding:"2px 6px",fontSize:11,color:T.textSub,whiteSpace:"nowrap"}}>{ti[h.tipo]||"📦"} {h.tipo}</span>)}</div>}</td>;
                }
                default: return <td key={key} style={{...cs,color:T.textSub,fontSize:12}}>{a[key]||"—"}</td>;
              }
            };
            return <div style={{background:T.surface,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}} ref={tableRef}>
                <table style={{tableLayout:"fixed",borderCollapse:"collapse",fontSize:13,minWidth:"100%"}}>
                  <colgroup>{activeCols.map(col=><col key={col.key} style={{width:colWidths[col.key]?colWidths[col.key]+"px":undefined}}/>)}<col style={{width:"120px"}}/><col style={{width:"120px"}}/></colgroup>
                  <thead><tr style={{background:T.surface2,borderBottom:`1px solid ${T.border}`}}>
                    {activeCols.map(col=><th key={col.key} className="th" style={{padding:"10px 14px",textAlign:"left",color:T.textSub,fontWeight:500,fontSize:11,textTransform:"uppercase",letterSpacing:"0.07em",position:"relative",whiteSpace:"nowrap",width:colWidths[col.key]||undefined}}>
                      <span onClick={()=>sortBy(col.key)} style={{display:"inline-flex",alignItems:"center",gap:2,cursor:"pointer"}}>{col.label}<SortIcon field={col.key}/></span>
                      <span onMouseDown={e=>startResize(e,col.key)} style={{position:"absolute",top:0,right:0,width:6,height:"100%",cursor:"col-resize",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}} onMouseEnter={e=>e.currentTarget.style.background="#1f6feb55"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><span style={{width:2,height:"60%",background:"currentColor",borderRadius:1,opacity:0.4,pointerEvents:"none"}}/></span>
                    </th>)}
                    <th style={{padding:"10px 14px",color:T.textSub,fontSize:11,textTransform:"uppercase",whiteSpace:"nowrap",minWidth:220}}>
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>{checkLabels.map((lbl,i)=><div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:46}}>{editingLabel===i?<input autoFocus defaultValue={lbl} onBlur={e=>{saveCheckLabel(i,e.target.value.trim()||lbl);setEditingLabel(null);}} onKeyDown={e=>{if(e.key==="Enter")e.target.blur();if(e.key==="Escape")setEditingLabel(null);}} style={{width:60,fontSize:10,background:T.inputBg,border:`1px solid ${T.border2}`,borderRadius:4,color:T.text,padding:"2px 4px",textAlign:"center"}}/>:<span onClick={()=>setEditingLabel(i)} title="Clicca per rinominare" style={{fontSize:10,color:T.textSub,cursor:"pointer",textAlign:"center",maxWidth:52,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",borderBottom:`1px dashed ${T.border2}`}}>{lbl}</span>}</div>)}</div>
                    </th>
                    <th style={{padding:"10px 14px",color:T.textSub,fontSize:11,textTransform:"uppercase"}}>Azioni</th>
                  </tr></thead>
                  <tbody>
                    {filtered.length===0?<tr><td colSpan={activeCols.length+2} style={{padding:"48px 0",textAlign:"center",color:T.textMuted}}>Nessun asset trovato</td></tr>
                    :filtered.map((a,i)=><tr key={a.id} className="rh" style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":T.surface2}}>
                      {activeCols.map(col=>renderCell(a,col.key,colWidths[col.key]))}
                      <td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:8,alignItems:"center"}}>{checkLabels.map((_,idx)=><div key={idx} style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:46}}><div onClick={()=>toggleCheck(a.id,idx)} style={{width:20,height:20,borderRadius:5,cursor:"pointer",border:`2px solid ${getCheck(a.id,idx)?"#22c55e":T.border2}`,background:getCheck(a.id,idx)?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>{getCheck(a.id,idx)&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}</div></div>)}</div></td>
                      <td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:6}}>
                        <button onClick={()=>openDetail(a)} style={{padding:"5px 10px",fontSize:12,background:"#d29922",border:"none",borderRadius:6,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#e3b341"} onMouseLeave={e=>e.currentTarget.style.background="#d29922"}>👁</button>
                        <button className="btn btn-accent" onClick={()=>openEdit(a)} style={{padding:"5px 10px",fontSize:12}}>✏️</button>
                        <button className="btn btn-danger" onClick={()=>setDeleteConfirm(a.id)} style={{padding:"5px 10px",fontSize:12}}>🗑</button>
                      </div></td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
              <div style={{padding:"10px 16px",borderTop:`1px solid ${T.border}`,fontSize:12,color:T.textSub,display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
                <span>{filtered.length} di {assets.length} record · {activeCols.length} colonne visibili</span>
                {filtered.length<assets.length&&<span style={{color:"#f59e0b"}}>⚠ Filtri attivi — esportazione parziale</span>}
                {Object.keys(colWidths).length>0&&<button className="btn btn-ghost" style={{padding:"2px 8px",fontSize:11,marginLeft:"auto"}} onClick={()=>setColWidths({})}>↺ Reset larghezze</button>}
              </div>
            </div>;
          })()}
        </div>}

        {/* FORM */}
        {view==="form"&&<div className="ai">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <button className="btn btn-ghost" onClick={()=>setView(prevView)} style={{padding:"6px 12px"}}>← Indietro</button>
            <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>{editId?"Modifica Asset":"Nuovo Asset"}</h2>
          </div>
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:28,maxWidth:900}}>
            {[
              {icon:"👤",title:"Dati Dipendente",grid:"1fr 1fr",fields:[["nominativo","Nominativo *","text","Nome Cognome"],["email","Email aziendale","email","nome@azienda.it"],["reparto","Ruolo","reparto",null],["accountMicrosoft","Account Microsoft 365","text","nome@azienda.onmicrosoft.com"]]},
              {icon:"📱",title:"Dati SIM / Telefono",grid:"1fr 1fr",fields:[["sim","Codice SIM","text","SIM-IT-XXX"],["numeroCellulare","Numero Cellulare","text","+39 3XX XXXXXXX"]]},
            ].map(({icon,title,grid,fields})=>(
              <div key={title} style={{marginBottom:28}}>
                <div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${T.border}`}}>{icon} {title}</div>
                <div style={{display:"grid",gridTemplateColumns:grid,gap:16}}>
                  {fields.map(([key,label,type,ph])=>(
                    <div key={key} className="fi">
                      <label className="fl">{label}</label>
                      {type==="reparto"?(
                        <div>
                          <select className="fi2" value={form.reparto} onChange={e=>setForm({...form,reparto:e.target.value})} style={{marginBottom:6}}><option value="">— Seleziona —</option>{reparti.map(r=><option key={r}>{r}</option>)}</select>
                          {!showAddReparto?(
                            <div style={{display:"flex",gap:6}}>
                              <button type="button" onClick={()=>setShowAddReparto(true)} style={{background:"transparent",border:`1px dashed ${T.border2}`,borderRadius:6,color:T.textSub,fontSize:12,padding:"5px 10px",cursor:"pointer",flex:1}}>+ Aggiungi nuovo ruolo</button>
                              <button type="button" onClick={()=>setShowRepartiManager(true)} style={{background:"transparent",border:`1px solid ${T.border2}`,borderRadius:6,color:T.textMuted,fontSize:11,padding:"5px 9px",cursor:"pointer"}} title="Gestisci ruoli">⚙</button>
                            </div>
                          ):(
                            <div style={{display:"flex",gap:6}}>
                              <input className="fi2" placeholder="Nome ruolo..." value={newReparto} onChange={e=>setNewReparto(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newReparto.trim()){addReparto(newReparto.trim());setForm(f=>({...f,reparto:newReparto.trim()}));setNewReparto("");setShowAddReparto(false);}if(e.key==="Escape"){setShowAddReparto(false);setNewReparto("");}}} style={{flex:1}} autoFocus/>
                              <button type="button" className="btn btn-primary" style={{padding:"5px 10px",fontSize:12}} onClick={()=>{if(newReparto.trim()){addReparto(newReparto.trim());setForm(f=>({...f,reparto:newReparto.trim()}));setNewReparto("");setShowAddReparto(false);}}}>✓</button>
                              <button type="button" className="btn btn-ghost" style={{padding:"5px 10px",fontSize:12}} onClick={()=>{setShowAddReparto(false);setNewReparto("");}}>✕</button>
                            </div>
                          )}
                        </div>
                      ):<input className="fi2" type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {(()=>{
              const pc=hardware.find(h=>h.tipo==="PC"&&h.assegnatoA===form.nominativo);
              return <div style={{marginBottom:28}}>
                <div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span>🖥️ Dati PC</span>
                  {!pc&&<span style={{fontSize:11,color:T.textMuted,fontWeight:400}}>Assegna un PC dalla sezione Hardware</span>}
                </div>
                {pc?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{[["Seriale PC",pc.seriale],["Modello",`${pc.marca} ${pc.modello}`.trim()],["Marca",pc.marca],["Stato HW",pc.stato]].map(([k,v])=><div key={k} style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:6,padding:"10px 14px"}}><div style={{fontSize:11,color:T.textMuted,marginBottom:4}}>{k}</div><div style={{fontSize:13,color:T.text,fontWeight:500}}>{v||"—"}</div></div>)}</div>
                :<div style={{background:T.surface2,border:`1px dashed ${T.border2}`,borderRadius:8,padding:"18px 16px",textAlign:"center",color:T.textMuted,fontSize:13}}>Nessun PC assegnato — vai in <b style={{color:T.textSub}}>🖥 Hardware</b></div>}
              </div>;
            })()}
            <div style={{marginBottom:28}}>
              <div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${T.border}`}}>📋 Stato & Note</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:16}}>
                <div className="fi"><label className="fl">Stato</label><select className="fi2" value={form.stato} onChange={e=>setForm({...form,stato:e.target.value})}>{stati.map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="fi"><label className="fl">Note</label><textarea className="fi2" rows={2} placeholder="Note aggiuntive..." value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{resize:"vertical"}}/></div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn btn-ghost" onClick={()=>setView(prevView)}>Annulla</button>
              <button className="btn btn-primary" onClick={saveForm}>💾 {editId?"Salva Modifiche":"Aggiungi Asset"}</button>
            </div>
          </div>
        </div>}

        {/* DETAIL */}
        {view==="detail"&&detailAsset&&<div className="ai">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <button className="btn btn-ghost" onClick={()=>setView("table")} style={{padding:"6px 12px"}}>← Indietro</button>
            <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>{detailAsset.nominativo}</h2>
            <span className="badge" style={{background:statoColor(detailAsset.stato)+"22",color:statoColor(detailAsset.stato),border:`1px solid ${statoColor(detailAsset.stato)}44`}}>{detailAsset.stato}</span>
            <div style={{flex:1}}/>
            <button className="btn btn-accent" onClick={()=>openEdit(detailAsset)}>✏️ Modifica</button>
            <button className="btn btn-danger" onClick={()=>setDeleteConfirm(detailAsset.id)}>🗑 Elimina</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,maxWidth:900,marginBottom:24}}>
            {[{icon:"👤",title:"Dipendente",rows:[["Nominativo",detailAsset.nominativo],["Email",detailAsset.email],["Ruolo",detailAsset.reparto],["Account M365",detailAsset.accountMicrosoft]]},{icon:"🖥️",title:"PC",rows:[["Seriale",detailAsset.serialePC],["Modello",detailAsset.modelloPC],["Data Acquisto",fmtDate(detailAsset.dataAcquisto)],["Data Consegna",fmtDate(detailAsset.dataConsegna)]]},{icon:"📱",title:"SIM / Telefono",rows:[["Codice SIM",detailAsset.sim],["Numero",detailAsset.numeroCellulare],["Note",detailAsset.note||"—"]]}].map(({icon,title,rows})=>(
              <div key={title} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:20}}>
                <div style={{fontSize:13,color:T.text,fontWeight:600,marginBottom:14}}>{icon} {title}</div>
                {rows.map(([k,v])=><div key={k} style={{marginBottom:12}}><div style={{fontSize:12,color:T.textSub,fontWeight:500,marginBottom:4}}>{k}</div><div style={{fontSize:14,color:(!v||v==="—")?T.textMuted:T.text,wordBreak:"break-all"}}>{v||"—"}</div></div>)}
              </div>
            ))}
          </div>
          {(()=>{
            const ah=history.filter(h=>h.assetId===detailAsset.id);
            if(!ah.length) return null;
            return <div style={{maxWidth:900}}><div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:12}}>🕓 Storico di questo asset</div>
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                {ah.map((h,i)=><div key={h.id} style={{padding:"12px 16px",borderBottom:i<ah.length-1?`1px solid ${T.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:h.changes?.length?8:0}}><ActionBadge action={h.action}/><span style={{fontSize:12,color:T.textSub}}>{fmtTs(h.ts)}</span></div>
                  {h.changes?.map((c,ci)=><div key={ci} style={{marginTop:4,fontSize:12,color:T.textSub,paddingLeft:8}}><span style={{color:T.textMuted}}>{c.field}: </span><span style={{color:"#ef4444"}}>{c.from||"(vuoto)"}</span><span style={{color:T.textMuted}}> → </span><span style={{color:"#22c55e"}}>{c.to||"(vuoto)"}</span></div>)}
                </div>)}
              </div>
            </div>;
          })()}
        </div>}

        {/* HARDWARE */}
        {view==="hardware"&&<div className="ai">
          {hwView==="table"?(
            <div>
              <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
                <input className="fi2" placeholder="🔍  Cerca tipo, marca, modello, seriale..." value={hwSearch} onChange={e=>setHwSearch(e.target.value)} style={{flex:1,minWidth:220}}/>
                {hwSearch&&<button className="btn btn-ghost" onClick={()=>setHwSearch("")}>✕ Reset</button>}
                <div style={{marginLeft:"auto",display:"flex",gap:8,fontSize:12,color:T.textSub,alignItems:"center"}}>
                  <span>🖥 <b style={{color:T.text}}>{hardware.length}</b> totali</span>
                  <span>✅ <b style={{color:"#22c55e"}}>{hardware.filter(h=>h.stato==="In uso").length}</b> in uso</span>
                  <span>📦 <b style={{color:"#58a6ff"}}>{hardware.filter(h=>h.stato==="Disponibile").length}</b> disponibili</span>
                </div>
                <button className="btn btn-primary" onClick={()=>{setHwForm(emptyHwForm);setHwEditId(null);setHwView("form");}}>+ Aggiungi</button>
              </div>
              <div style={{background:T.surface,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead><tr style={{background:T.surface2,borderBottom:`1px solid ${T.border}`}}>
                      {[["tipo","Tipo"],["marca","Marca"],["modello","Modello"],["seriale","Seriale"],["stato","Stato"],["assegnatoA","Assegnato a"],["note","Note"]].map(([f,l])=>(
                        <th key={f} onClick={()=>hwSortBy(f)} className="th" style={{padding:"10px 14px",textAlign:"left",color:T.textSub,fontWeight:500,fontSize:11,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                          {l}<span style={{opacity:hwSortField===f?1:0.3,marginLeft:4,fontSize:10}}>{hwSortField===f&&hwSortDir==="desc"?"▼":"▲"}</span>
                        </th>
                      ))}
                      <th style={{padding:"10px 14px",color:T.textSub,fontSize:11,textTransform:"uppercase"}}>Azioni</th>
                    </tr></thead>
                    <tbody>
                      {hwFiltered.length===0?<tr><td colSpan={8} style={{padding:"48px 0",textAlign:"center",color:T.textMuted}}>Nessun hardware trovato</td></tr>
                      :hwFiltered.map((h,i)=>{
                        const ti={"PC":"🖥","Monitor":"🖥","Telefono":"📱","SIM":"📡","Cuffie":"🎧","Altro":"📦"}[h.tipo]||"📦";
                        const sc={"In uso":"#22c55e","Disponibile":"#1f6feb","In manutenzione":"#f59e0b","Dismesso":"#ef4444"}[h.stato]||"#888";
                        return <tr key={h.id} className="rh" style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":T.surface2}}>
                          <td style={{padding:"11px 14px"}}><span style={{fontWeight:500,color:T.text}}>{ti} {h.tipo}</span></td>
                          <td style={{padding:"11px 14px",color:T.text}}>{h.marca||"—"}</td>
                          <td style={{padding:"11px 14px",color:T.textSub,fontSize:12}}>{h.modello||"—"}</td>
                          <td style={{padding:"11px 14px",fontWeight:500,color:T.link,fontSize:12}}>{h.seriale||"—"}</td>
                          <td style={{padding:"11px 14px"}}><span className="badge" style={{background:sc+"22",color:sc,border:`1px solid ${sc}44`}}>{h.stato}</span></td>
                          <td style={{padding:"11px 14px",color:T.textSub,fontSize:12}}>{h.assegnatoA||"—"}</td>
                          <td style={{padding:"11px 14px",color:T.textMuted,fontSize:12,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.note||"—"}</td>
                          <td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:6}}>
                            <button className="btn btn-accent" onClick={()=>{setHwForm({...h});setHwEditId(h.id);setHwView("form");}} style={{padding:"5px 10px",fontSize:12}}>✏️</button>
                            <button className="btn btn-danger" onClick={()=>setHwDeleteConfirm(h.id)} style={{padding:"5px 10px",fontSize:12}}>🗑</button>
                          </div></td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{padding:"10px 16px",borderTop:`1px solid ${T.border}`,fontSize:12,color:T.textSub}}>{hwFiltered.length} di {hardware.length} record</div>
              </div>
            </div>
          ):(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                <button className="btn btn-ghost" onClick={()=>{setHwView("table");setHwEditId(null);setHwForm(emptyHwForm);}} style={{padding:"6px 12px"}}>← Indietro</button>
                <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>{hwEditId?"Modifica Hardware":"Nuovo Hardware"}</h2>
              </div>
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:28,maxWidth:700}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                  {[["tipo","Tipo *","select"],["marca","Marca","text"],["modello","Modello","text"],["seriale","Seriale *","text"],["stato","Stato","select2"],["assegnatoA","Assegnato a","select3"]].map(([key,label,type])=>(
                    <div key={key} className="fi"><label className="fl">{label}</label>
                      {type==="select"?<select className="fi2" value={hwForm[key]} onChange={e=>setHwForm({...hwForm,[key]:e.target.value})}><option value="">— Seleziona —</option>{HW_TIPI.map(t=><option key={t}>{t}</option>)}</select>
                      :type==="select2"?<select className="fi2" value={hwForm[key]} onChange={e=>setHwForm({...hwForm,[key]:e.target.value})}>{HW_STATI.map(s=><option key={s}>{s}</option>)}</select>
                      :type==="select3"?<select className="fi2" value={hwForm[key]} onChange={e=>{const n=e.target.value;setHwForm(prev=>({...prev,[key]:n,stato:n?"In uso":(prev.stato==="In uso"?"Disponibile":prev.stato)}));}}><option value="">— Nessuno —</option>{[...assets].sort((a,b)=>a.nominativo.localeCompare(b.nominativo)).map(a=><option key={a.id} value={a.nominativo}>{a.nominativo}</option>)}</select>
                      :<input className="fi2" type="text" placeholder={label} value={hwForm[key]} onChange={e=>setHwForm({...hwForm,[key]:e.target.value})}/>}
                    </div>
                  ))}
                </div>
                <div className="fi" style={{marginBottom:24}}><label className="fl">Note</label><textarea className="fi2" rows={2} placeholder="Note aggiuntive..." value={hwForm.note} onChange={e=>setHwForm({...hwForm,note:e.target.value})} style={{resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <button className="btn btn-ghost" onClick={()=>{setHwView("table");setHwEditId(null);setHwForm(emptyHwForm);}}>Annulla</button>
                  <button className="btn btn-primary" onClick={saveHwForm}>💾 {hwEditId?"Salva Modifiche":"Aggiungi Hardware"}</button>
                </div>
              </div>
            </div>
          )}
        </div>}

        {/* HISTORY */}
        {view==="history"&&<div className="ai">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
            <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>🕓 Storico Modifiche</h2>
            <span style={{fontSize:12,color:T.textSub}}>{history.length} eventi</span>
            <div style={{flex:1}}/>
            <input className="fi2" placeholder="Filtra per nome, seriale, azione..." value={historySearch} onChange={e=>setHistorySearch(e.target.value)} style={{width:310}}/>
          </div>
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
            {filteredH.length===0?<div style={{padding:"48px 0",textAlign:"center",color:T.textMuted}}>Nessun evento trovato</div>
            :filteredH.map((h,i)=><div key={h.id} className="rh" style={{padding:"14px 20px",borderBottom:i<filteredH.length-1?`1px solid ${T.border}`:"none",display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{minWidth:160,paddingTop:1}}><ActionBadge action={h.action}/></div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:h.changes?.length?6:0}}>
                  <span style={{fontWeight:500,fontSize:13,color:T.text}}>{h.assetNome||"—"}</span>
                  {h.assetSerial&&<span style={{fontSize:12,color:T.link}}>{h.assetSerial}</span>}
                </div>
                {h.changes?.map((c,ci)=><div key={ci} style={{fontSize:12,color:T.textSub,marginTop:3}}><span style={{color:T.textMuted}}>{c.field}: </span><span style={{color:"#ef4444"}}>{String(c.from)||"(vuoto)"}</span><span style={{color:T.textMuted}}> → </span><span style={{color:"#22c55e"}}>{String(c.to)||"(vuoto)"}</span></div>)}
              </div>
              <div style={{fontSize:12,color:T.textMuted,whiteSpace:"nowrap",paddingTop:2}}>{fmtTs(h.ts)}</div>
            </div>)}
          </div>
        </div>}

        {/* IMPORT */}
        {view==="import"&&<div className="ai" style={{maxWidth:820}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <h2 style={{fontWeight:600,fontSize:18,color:T.text}}>⬆ Importazione da Excel</h2>
          </div>
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:20,marginBottom:20}}>
            <div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:12}}>📋 Come funziona</div>
            <div style={{fontSize:13,color:T.textSub,lineHeight:1.85}}>
              1. Scarica il{" "}<button className="btn btn-ghost" onClick={dlTemplate} style={{padding:"2px 10px",fontSize:12,display:"inline-flex",verticalAlign:"middle"}}>template Excel ⬇</button>{" "}e compilalo in Excel.<br/>
              2. Le colonne <span style={{color:T.link}}>Nominativo</span> e <span style={{color:T.link}}>Seriale PC</span> sono obbligatorie.<br/>
              3. Stati validi: <span style={{color:T.text}}>Attivo · In manutenzione · Dismesso · Smarrito</span>.<br/>
              4. Salva come <b style={{color:T.text}}>.xlsx</b> e carica — vedrai un'anteprima prima di confermare.
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
              <div style={{fontSize:15,marginBottom:6,color:T.text}}>Clicca per selezionare il file Excel</div>
              <div style={{fontSize:12,color:T.textMuted}}>Formati supportati: <b>.xlsx</b> · .xls · .ods</div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.ods" style={{display:"none"}} onChange={handleFile}/>
            </div>
          ):(
            <div>
              {importData.errors.length>0&&<div style={{background:"#da363322",border:"1px solid #da363344",borderRadius:8,padding:"12px 16px",marginBottom:16}}>
                <div style={{fontSize:12,color:"#f85149",marginBottom:6,fontWeight:500}}>⚠ {importData.errors.length} errore/i — righe saltate</div>
                {importData.errors.slice(0,6).map((e,i)=><div key={i} style={{fontSize:12,color:T.textSub}}>{e}</div>)}
              </div>}
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",marginBottom:16}}>
                <div style={{padding:"10px 16px",borderBottom:`1px solid ${T.border}`,fontSize:12}}><span style={{color:"#22c55e",fontWeight:600}}>✓ {importData.records.length} record pronti</span></div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr style={{background:T.surface2}}>{["Nominativo","Ruolo","Seriale PC","Modello","Cellulare","Stato"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:T.textSub,fontWeight:500,fontSize:11,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                    <tbody>
                      {importData.records.slice(0,8).map((r,i)=><tr key={i} style={{borderTop:`1px solid ${T.border}`}}>
                        <td style={{padding:"8px 12px",color:T.text}}>{r.nominativo}</td>
                        <td style={{padding:"8px 12px"}}><span className="tag">{r.reparto||"—"}</span></td>
                        <td style={{padding:"8px 12px",color:T.link}}>{r.serialePC}</td>
                        <td style={{padding:"8px 12px",color:T.textSub}}>{r.modelloPC||"—"}</td>
                        <td style={{padding:"8px 12px",color:T.textSub}}>{r.numeroCellulare||"—"}</td>
                        <td style={{padding:"8px 12px"}}><span className="badge" style={{background:statoColor(r.stato)+"22",color:statoColor(r.stato),border:`1px solid ${statoColor(r.stato)}44`}}>{r.stato}</span></td>
                      </tr>)}
                      {importData.records.length>8&&<tr><td colSpan={6} style={{padding:"8px 12px",textAlign:"center",color:T.textMuted,fontSize:11}}>...e altri {importData.records.length-8}</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn btn-ghost" onClick={()=>setImportData(null)}>← Cambia file</button>
                <button className="btn btn-primary" onClick={confirmImport} disabled={!importData.records.length}>✓ Conferma importazione ({importData.records.length})</button>
              </div>
            </div>
          )}
        </div>}

      </div>
    </div>
  );
}
