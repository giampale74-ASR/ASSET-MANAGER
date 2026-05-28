const express = require('express');
const path = require('path');
const db = require('./db/database');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// ── ASSETS ──
app.get('/api/assets', (req, res) => {
  res.json(db.prepare('SELECT * FROM assets ORDER BY id').all());
});

app.post('/api/assets', (req, res) => {
  const b = req.body;
  try {
    const r = db.prepare(`INSERT INTO assets
      (nominativo,email,reparto,serialePC,modelloPC,dataAcquisto,
       dataConsegna,sim,numeroCellulare,accountMicrosoft,note,stato)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(b.nominativo,b.email,b.reparto,b.serialePC,b.modelloPC,
           b.dataAcquisto,b.dataConsegna,b.sim,b.numeroCellulare,
           b.accountMicrosoft,b.note,b.stato||'Attivo');
    res.json(db.prepare('SELECT * FROM assets WHERE id=?').get(r.lastInsertRowid));
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/assets/:id', (req, res) => {
  const b = req.body;
  try {
    db.prepare(`UPDATE assets SET nominativo=?,email=?,reparto=?,serialePC=?,
      modelloPC=?,dataAcquisto=?,dataConsegna=?,sim=?,numeroCellulare=?,
      accountMicrosoft=?,note=?,stato=? WHERE id=?`)
      .run(b.nominativo,b.email,b.reparto,b.serialePC,b.modelloPC,
           b.dataAcquisto,b.dataConsegna,b.sim,b.numeroCellulare,
           b.accountMicrosoft,b.note,b.stato,req.params.id);
    res.json(db.prepare('SELECT * FROM assets WHERE id=?').get(req.params.id));
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/assets/all', (req, res) => {
  // Usato da import "sostituisci"
  try {
    db.prepare('DELETE FROM assets').run();
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/assets/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM assets WHERE id=?').run(req.params.id);
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// ── HARDWARE ──
app.get('/api/hardware', (req, res) => {
  res.json(db.prepare('SELECT * FROM hardware ORDER BY id').all());
});

app.post('/api/hardware', (req, res) => {
  const b = req.body;
  try {
    const r = db.prepare(`INSERT INTO hardware
      (tipo,modello,seriale,stato,assegnatoA,dataAcquisto,dataConsegna,note)
      VALUES (?,?,?,?,?,?,?,?)`)
      .run(b.tipo,b.modello,b.seriale,b.stato||'In uso',b.assegnatoA,
           b.dataAcquisto,b.dataConsegna,b.note);
    res.json(db.prepare('SELECT * FROM hardware WHERE id=?').get(r.lastInsertRowid));
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/hardware/:id', (req, res) => {
  const b = req.body;
  try {
    db.prepare(`UPDATE hardware SET tipo=?,modello=?,seriale=?,stato=?,
      assegnatoA=?,dataAcquisto=?,dataConsegna=?,note=? WHERE id=?`)
      .run(b.tipo,b.modello,b.seriale,b.stato,b.assegnatoA,
           b.dataAcquisto,b.dataConsegna,b.note,req.params.id);
    res.json(db.prepare('SELECT * FROM hardware WHERE id=?').get(req.params.id));
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// Sync hardware → asset (usato da saveHwForm)
app.put('/api/hardware/:id/sync-asset', (req, res) => {
  const { assegnatoA, tipo, seriale, modello, dataAcquisto, dataConsegna } = req.body;
  try {
    if (assegnatoA && tipo === 'PC') {
      db.prepare(`UPDATE assets SET serialePC=?,modelloPC=?,dataAcquisto=?,dataConsegna=?
        WHERE nominativo=?`).run(seriale, modello, dataAcquisto, dataConsegna, assegnatoA);
    }
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/hardware/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM hardware WHERE id=?').run(req.params.id);
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// ── HISTORY ──
app.get('/api/history', (req, res) => {
  const rows = db.prepare('SELECT * FROM history ORDER BY ts DESC').all();
  res.json(rows.map(h => ({
    ...h,
    changes: h.changes ? (() => { try { return JSON.parse(h.changes); } catch { return null; } })() : null
  })));
});

app.post('/api/history', (req, res) => {
  const b = req.body;
  try {
    db.prepare(`INSERT INTO history (ts,action,asset_id,asset_serial,asset_nome,changes)
      VALUES (?,?,?,?,?,?)`)
      .run(b.ts, b.action, b.asset_id, b.asset_serial, b.asset_nome,
           b.changes ? JSON.stringify(b.changes) : null);
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// ── REPARTI ──
app.get('/api/reparti', (req, res) => {
  res.json(db.prepare('SELECT * FROM reparti ORDER BY nome').all());
});

app.post('/api/reparti', (req, res) => {
  try {
    db.prepare('INSERT OR IGNORE INTO reparti (nome) VALUES (?)').run(req.body.nome);
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/reparti', (req, res) => {
  try {
    db.prepare('DELETE FROM reparti WHERE nome=?').run(req.body.nome);
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// ── CHECKS ──
app.get('/api/checks', (req, res) => {
  res.json(db.prepare('SELECT * FROM checks').all());
});

app.post('/api/checks/upsert', (req, res) => {
  try {
    db.prepare('INSERT OR REPLACE INTO checks (key,value) VALUES (?,?)')
      .run(req.body.key, req.body.value ? 1 : 0);
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// ── CHECK LABELS ──
app.get('/api/check-labels', (req, res) => {
  res.json(db.prepare('SELECT * FROM check_labels ORDER BY idx').all());
});

app.post('/api/check-labels/upsert', (req, res) => {
  try {
    db.prepare('INSERT OR REPLACE INTO check_labels (idx,label) VALUES (?,?)')
      .run(req.body.idx, req.body.label);
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// ── SPA fallback ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ AssetManager in ascolto sulla porta ${PORT}`));
