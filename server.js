const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const { createClient } = require('@libsql/client');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Turso ──────────────────────────────────────────────────────────────
const db = createClient({
  url:       process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ── Auth ───────────────────────────────────────────────────────────────
const ADMIN_USER     = process.env.ADMIN_USER     || 'HiliAdmin';
const ADMIN_PASS     = process.env.ADMIN_PASS     || 'Asset2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'hili-asset-2026-secret';

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

function authMiddleware(req, res, next) {
  if (req.path === '/api/login')  return next();
  if (req.path === '/api/logout') return next();
  if (req.path.startsWith('/api/')) {
    const token = req.cookies?.hili_session;
    if (token !== SESSION_SECRET) return res.status(401).json({ error: 'Non autenticato' });
  }
  next();
}
app.use(authMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

// ── DB init ────────────────────────────────────────────────────────────
async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nominativo TEXT NOT NULL, email TEXT, reparto TEXT,
      serialePC TEXT, modelloPC TEXT, dataAcquisto TEXT, dataConsegna TEXT,
      sim TEXT, numeroCellulare TEXT, accountMicrosoft TEXT, note TEXT,
      stato TEXT DEFAULT 'Attivo'
    );
    CREATE TABLE IF NOT EXISTS hardware (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT, modello TEXT, seriale TEXT, stato TEXT DEFAULT 'In uso',
      assegnatoA TEXT, dataAcquisto TEXT, dataConsegna TEXT, note TEXT
    );
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT, action TEXT, asset_id INTEGER,
      asset_serial TEXT, asset_nome TEXT, changes TEXT
    );
    CREATE TABLE IF NOT EXISTS reparti (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT UNIQUE
    );
    CREATE TABLE IF NOT EXISTS checks (
      key TEXT PRIMARY KEY, value INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS check_labels (
      idx INTEGER PRIMARY KEY, label TEXT
    );
  `);
}

// helper
const rows = (rs) => rs.rows;
const one  = (rs) => rs.rows[0] ?? null;

// ── Auth API ───────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.cookie('hili_session', SESSION_SECRET, {
      httpOnly: true, sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'Credenziali non valide' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('hili_session');
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  const token = req.cookies?.hili_session;
  if (token === SESSION_SECRET) return res.json({ ok: true, user: ADMIN_USER });
  res.status(401).json({ error: 'Non autenticato' });
});

// ── Assets ─────────────────────────────────────────────────────────────
app.get('/api/assets', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM assets ORDER BY id'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/assets', async (req, res) => {
  const b = req.body;
  try {
    const rs = await db.execute({
      sql: `INSERT INTO assets (nominativo,email,reparto,serialePC,modelloPC,dataAcquisto,
            dataConsegna,sim,numeroCellulare,accountMicrosoft,note,stato)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [b.nominativo,b.email||null,b.reparto||null,b.serialePC||null,b.modelloPC||null,
             b.dataAcquisto||null,b.dataConsegna||null,b.sim||null,b.numeroCellulare||null,
             b.accountMicrosoft||null,b.note||null,b.stato||'Attivo'],
    });
    const row = one(await db.execute({ sql: 'SELECT * FROM assets WHERE id=?', args: [rs.lastInsertRowid] }));
    res.json(row);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/assets/:id', async (req, res) => {
  const b = req.body;
  try {
    await db.execute({
      sql: `UPDATE assets SET nominativo=?,email=?,reparto=?,serialePC=?,modelloPC=?,
            dataAcquisto=?,dataConsegna=?,sim=?,numeroCellulare=?,accountMicrosoft=?,note=?,stato=?
            WHERE id=?`,
      args: [b.nominativo,b.email||null,b.reparto||null,b.serialePC||null,b.modelloPC||null,
             b.dataAcquisto||null,b.dataConsegna||null,b.sim||null,b.numeroCellulare||null,
             b.accountMicrosoft||null,b.note||null,b.stato,req.params.id],
    });
    res.json(one(await db.execute({ sql: 'SELECT * FROM assets WHERE id=?', args: [req.params.id] })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/assets/all', async (req, res) => {
  try { await db.execute('DELETE FROM assets'); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/assets/:id', async (req, res) => {
  try { await db.execute({ sql: 'DELETE FROM assets WHERE id=?', args: [req.params.id] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Hardware ───────────────────────────────────────────────────────────
app.get('/api/hardware', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM hardware ORDER BY id'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/hardware', async (req, res) => {
  const b = req.body;
  try {
    const rs = await db.execute({
      sql: `INSERT INTO hardware (tipo,modello,seriale,stato,assegnatoA,dataAcquisto,dataConsegna,note)
            VALUES (?,?,?,?,?,?,?,?)`,
      args: [b.tipo,b.modello||null,b.seriale||null,b.stato||'In uso',b.assegnatoA||null,
             b.dataAcquisto||null,b.dataConsegna||null,b.note||null],
    });
    res.json(one(await db.execute({ sql: 'SELECT * FROM hardware WHERE id=?', args: [rs.lastInsertRowid] })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/hardware/:id', async (req, res) => {
  const b = req.body;
  try {
    await db.execute({
      sql: `UPDATE hardware SET tipo=?,modello=?,seriale=?,stato=?,assegnatoA=?,
            dataAcquisto=?,dataConsegna=?,note=? WHERE id=?`,
      args: [b.tipo,b.modello||null,b.seriale||null,b.stato,b.assegnatoA||null,
             b.dataAcquisto||null,b.dataConsegna||null,b.note||null,req.params.id],
    });
    res.json(one(await db.execute({ sql: 'SELECT * FROM hardware WHERE id=?', args: [req.params.id] })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/hardware/:id', async (req, res) => {
  try { await db.execute({ sql: 'DELETE FROM hardware WHERE id=?', args: [req.params.id] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── History ────────────────────────────────────────────────────────────
app.get('/api/history', async (req, res) => {
  try {
    const list = rows(await db.execute('SELECT * FROM history ORDER BY ts DESC'));
    res.json(list.map(h => ({
      ...h,
      changes: h.changes ? (() => { try { return JSON.parse(h.changes); } catch { return null; } })() : null,
    })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/history', async (req, res) => {
  const b = req.body;
  try {
    await db.execute({
      sql: `INSERT INTO history (ts,action,asset_id,asset_serial,asset_nome,changes)
            VALUES (?,?,?,?,?,?)`,
      args: [b.ts,b.action,b.asset_id||null,b.asset_serial||null,b.asset_nome||null,
             b.changes ? JSON.stringify(b.changes) : null],
    });
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Reparti ────────────────────────────────────────────────────────────
app.get('/api/reparti', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM reparti ORDER BY nome'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/reparti', async (req, res) => {
  try { await db.execute({ sql: 'INSERT OR IGNORE INTO reparti (nome) VALUES (?)', args: [req.body.nome] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/reparti', async (req, res) => {
  try { await db.execute({ sql: 'DELETE FROM reparti WHERE nome=?', args: [req.body.nome] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Checks ─────────────────────────────────────────────────────────────
app.get('/api/checks', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM checks'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/checks/upsert', async (req, res) => {
  try {
    await db.execute({
      sql: 'INSERT OR REPLACE INTO checks (key,value) VALUES (?,?)',
      args: [req.body.key, req.body.value ? 1 : 0],
    });
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Check labels ───────────────────────────────────────────────────────
app.get('/api/check-labels', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM check_labels ORDER BY idx'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/check-labels/upsert', async (req, res) => {
  try {
    await db.execute({
      sql: 'INSERT OR REPLACE INTO check_labels (idx,label) VALUES (?,?)',
      args: [req.body.idx, req.body.label],
    });
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── SPA fallback ───────────────────────────────────────────────────────
app.get('/{*path}', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── Start ──────────────────────────────────────────────────────────────
initDB()
  .then(() => app.listen(PORT, () => console.log(`✅  Hili Asset Manager · porta ${PORT}`)))
  .catch(err => { console.error(err); process.exit(1); });
