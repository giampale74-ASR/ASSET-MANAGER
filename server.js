const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const bcrypt       = require('bcryptjs');
const { createClient } = require('@libsql/client');

const app  = express();
const PORT = process.env.PORT || 8080;

const db = createClient({
  url:       process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const ADMIN_USER           = process.env.ADMIN_USER        || 'HiliAdmin';
const ADMIN_PASS           = process.env.ADMIN_PASS        || 'Asset2026';
const SESSION_SECRET       = process.env.SESSION_SECRET    || 'hili-asset-2026-secret';
const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL  = process.env.GOOGLE_CALLBACK_URL || 'https://asset.hilitravel.com/auth/google/callback';
const ALLOWED_EMAIL        = process.env.ALLOWED_EMAIL     || 'agiampa@hilitravel.com';
const isProd               = process.env.RENDER || process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ── Cookie helpers ─────────────────────────────────────────────────────
function setUserCookie(res, user) {
  const payload = Buffer.from(JSON.stringify(user)).toString('base64');
  res.cookie('hili_user', payload, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure:   !!isProd,
    maxAge:   8 * 60 * 60 * 1000,
  });
}

function getSessionUser(req) {
  if (req.cookies?.hili_session === SESSION_SECRET) return { ruolo: 'admin', nome: ADMIN_USER };
  if (req.cookies?.hili_user) {
    try { return JSON.parse(Buffer.from(req.cookies.hili_user, 'base64').toString()); } catch {}
  }
  return null;
}

// ── Auth middleware ────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  if (req.path === '/api/login')  return next();
  if (req.path === '/api/logout') return next();
  if (req.path.startsWith('/auth/')) return next();
  if (req.path.startsWith('/api/')) {
    const u = getSessionUser(req);
    if (!u) return res.status(401).json({ error: 'Non autenticato' });
    req.sessionUser = u;
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.sessionUser?.ruolo !== 'admin') return res.status(403).json({ error: 'Non autorizzato' });
  next();
}
function requireEditor(req, res, next) {
  const r = req.sessionUser?.ruolo;
  if (r !== 'admin' && r !== 'editor') return res.status(403).json({ error: 'Non autorizzato' });
  next();
}

app.use(authMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

// ── DB init ────────────────────────────────────────────────────────────
async function initDB() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
      password TEXT, ruolo TEXT DEFAULT 'viewer', attivo INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nominativo TEXT NOT NULL, email TEXT, reparto TEXT,
      serialePC TEXT, modelloPC TEXT, dataAcquisto TEXT, dataConsegna TEXT,
      sim TEXT, numeroCellulare TEXT, accountMicrosoft TEXT, note TEXT,
      stato TEXT DEFAULT 'Attivo'
    )`,
    `CREATE TABLE IF NOT EXISTS hardware (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT, modello TEXT, seriale TEXT, stato TEXT DEFAULT 'In uso',
      assegnatoA TEXT, dataAcquisto TEXT, dataConsegna TEXT, note TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT, action TEXT, asset_id INTEGER,
      asset_serial TEXT, asset_nome TEXT, changes TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS reparti (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT UNIQUE
    )`,
    `CREATE TABLE IF NOT EXISTS checks (
      key TEXT PRIMARY KEY, value INTEGER DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS check_labels (
      idx INTEGER PRIMARY KEY, label TEXT
    )`,
  ];
  for (const sql of tables) await db.execute(sql);
}

const rows = (rs) => rs.rows;
const one  = (rs) => rs.rows[0] ?? null;

// ── Auth API ───────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // HiliAdmin
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.cookie('hili_session', SESSION_SECRET, {
      httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: !!isProd,
      maxAge: 8*60*60*1000,
    });
    return res.json({ ok: true, ruolo: 'admin', nome: ADMIN_USER });
  }

  // User table
  try {
    const rs = await db.execute({ sql: 'SELECT * FROM users WHERE email=? AND attivo=1', args: [username.toLowerCase()] });
    const user = rs.rows[0];
    if (user && user.password) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        setUserCookie(res, { id: user.id, email: user.email, nome: user.nome, ruolo: user.ruolo });
        return res.json({ ok: true, ruolo: user.ruolo, nome: user.nome });
      }
    }
  } catch(e) { console.error('Login error:', e.message); }

  res.status(401).json({ error: 'Credenziali non valide' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('hili_session');
  res.clearCookie('hili_user');
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  const u = getSessionUser(req);
  if (u) return res.json({ ok: true, user: u.nome || u.email, ruolo: u.ruolo });
  res.status(401).json({ error: 'Non autenticato' });
});

// ── Google OAuth (manual, no passport) ────────────────────────────────
app.get('/auth/google', (req, res) => {
  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope:         'openid email profile',
    access_type:   'online',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/?error=unauthorized');
  try {
    // Exchange code for token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri:  GOOGLE_CALLBACK_URL,
        grant_type:    'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.redirect('/?error=unauthorized');

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = await userRes.json();
    const email = userInfo.email?.toLowerCase();

    // Check if authorized
    let user = null;
    try {
      const rs = await db.execute({ sql: 'SELECT * FROM users WHERE email=? AND attivo=1', args: [email] });
      user = rs.rows[0];
    } catch {}

    if (user) {
      setUserCookie(res, { id: user.id, email: user.email, nome: user.nome, ruolo: user.ruolo });
      return res.redirect('/');
    }
    if (email === ALLOWED_EMAIL.toLowerCase()) {
      setUserCookie(res, { email, nome: userInfo.name || email, ruolo: 'admin' });
      return res.redirect('/');
    }
    return res.redirect('/?error=unauthorized');
  } catch(e) {
    console.error('Google auth error:', e.message);
    res.redirect('/?error=unauthorized');
  }
});

// ── Users API ──────────────────────────────────────────────────────────
app.get('/api/users', requireAdmin, async (req, res) => {
  try { res.json(rows(await db.execute('SELECT id,nome,email,ruolo,attivo FROM users ORDER BY nome'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/users', requireAdmin, async (req, res) => {
  const { nome, email, password, ruolo } = req.body;
  try {
    const hash = password ? await bcrypt.hash(password, 10) : null;
    const rs = await db.execute({ sql: 'INSERT INTO users (nome,email,password,ruolo,attivo) VALUES (?,?,?,?,1)', args: [nome, email.toLowerCase(), hash, ruolo||'viewer'] });
    res.json(one(await db.execute({ sql: 'SELECT id,nome,email,ruolo,attivo FROM users WHERE id=?', args: [rs.lastInsertRowid] })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/users/:id', requireAdmin, async (req, res) => {
  const { nome, email, password, ruolo, attivo } = req.body;
  try {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await db.execute({ sql: 'UPDATE users SET nome=?,email=?,password=?,ruolo=?,attivo=? WHERE id=?', args: [nome, email.toLowerCase(), hash, ruolo, attivo?1:0, req.params.id] });
    } else {
      await db.execute({ sql: 'UPDATE users SET nome=?,email=?,ruolo=?,attivo=? WHERE id=?', args: [nome, email.toLowerCase(), ruolo, attivo?1:0, req.params.id] });
    }
    res.json(one(await db.execute({ sql: 'SELECT id,nome,email,ruolo,attivo FROM users WHERE id=?', args: [req.params.id] })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/users/:id', requireAdmin, async (req, res) => {
  try { await db.execute({ sql: 'DELETE FROM users WHERE id=?', args: [req.params.id] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Assets ─────────────────────────────────────────────────────────────
app.get('/api/assets', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM assets ORDER BY id'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/assets', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    const rs = await db.execute({ sql: `INSERT INTO assets (nominativo,email,reparto,serialePC,modelloPC,dataAcquisto,dataConsegna,sim,numeroCellulare,accountMicrosoft,note,stato) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, args: [b.nominativo,b.email||null,b.reparto||null,b.serialePC||null,b.modelloPC||null,b.dataAcquisto||null,b.dataConsegna||null,b.sim||null,b.numeroCellulare||null,b.accountMicrosoft||null,b.note||null,b.stato||'Attivo'] });
    res.json(one(await db.execute({ sql: 'SELECT * FROM assets WHERE id=?', args: [rs.lastInsertRowid] })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/assets/:id', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    await db.execute({ sql: `UPDATE assets SET nominativo=?,email=?,reparto=?,serialePC=?,modelloPC=?,dataAcquisto=?,dataConsegna=?,sim=?,numeroCellulare=?,accountMicrosoft=?,note=?,stato=? WHERE id=?`, args: [b.nominativo,b.email||null,b.reparto||null,b.serialePC||null,b.modelloPC||null,b.dataAcquisto||null,b.dataConsegna||null,b.sim||null,b.numeroCellulare||null,b.accountMicrosoft||null,b.note||null,b.stato,req.params.id] });
    res.json(one(await db.execute({ sql: 'SELECT * FROM assets WHERE id=?', args: [req.params.id] })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/assets/all', requireAdmin, async (req, res) => {
  try { await db.execute('DELETE FROM assets'); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/assets/:id', requireEditor, async (req, res) => {
  try { await db.execute({ sql: 'DELETE FROM assets WHERE id=?', args: [req.params.id] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Hardware ───────────────────────────────────────────────────────────
app.get('/api/hardware', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM hardware ORDER BY id'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/hardware', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    const rs = await db.execute({ sql: `INSERT INTO hardware (tipo,modello,seriale,stato,assegnatoA,dataAcquisto,dataConsegna,note) VALUES (?,?,?,?,?,?,?,?)`, args: [b.tipo,b.modello||null,b.seriale||null,b.stato||'In uso',b.assegnatoA||null,b.dataAcquisto||null,b.dataConsegna||null,b.note||null] });
    res.json(one(await db.execute({ sql: 'SELECT * FROM hardware WHERE id=?', args: [rs.lastInsertRowid] })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/hardware/:id', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    await db.execute({ sql: `UPDATE hardware SET tipo=?,modello=?,seriale=?,stato=?,assegnatoA=?,dataAcquisto=?,dataConsegna=?,note=? WHERE id=?`, args: [b.tipo,b.modello||null,b.seriale||null,b.stato,b.assegnatoA||null,b.dataAcquisto||null,b.dataConsegna||null,b.note||null,req.params.id] });
    res.json(one(await db.execute({ sql: 'SELECT * FROM hardware WHERE id=?', args: [req.params.id] })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/hardware/:id', requireEditor, async (req, res) => {
  try { await db.execute({ sql: 'DELETE FROM hardware WHERE id=?', args: [req.params.id] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── History ────────────────────────────────────────────────────────────
app.get('/api/history', async (req, res) => {
  try {
    const list = rows(await db.execute('SELECT * FROM history ORDER BY ts DESC'));
    res.json(list.map(h => ({ ...h, changes: h.changes ? (() => { try { return JSON.parse(h.changes); } catch { return null; } })() : null })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/history', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    await db.execute({ sql: `INSERT INTO history (ts,action,asset_id,asset_serial,asset_nome,changes) VALUES (?,?,?,?,?,?)`, args: [b.ts,b.action,b.asset_id||null,b.asset_serial||null,b.asset_nome||null,b.changes?JSON.stringify(b.changes):null] });
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Reparti ────────────────────────────────────────────────────────────
app.get('/api/reparti', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM reparti ORDER BY nome'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/reparti', requireEditor, async (req, res) => {
  try { await db.execute({ sql: 'INSERT OR IGNORE INTO reparti (nome) VALUES (?)', args: [req.body.nome] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/reparti', requireAdmin, async (req, res) => {
  try { await db.execute({ sql: 'DELETE FROM reparti WHERE nome=?', args: [req.body.nome] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Checks ─────────────────────────────────────────────────────────────
app.get('/api/checks', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM checks'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/checks/upsert', requireEditor, async (req, res) => {
  try { await db.execute({ sql: 'INSERT OR REPLACE INTO checks (key,value) VALUES (?,?)', args: [req.body.key, req.body.value?1:0] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Check labels ───────────────────────────────────────────────────────
app.get('/api/check-labels', async (req, res) => {
  try { res.json(rows(await db.execute('SELECT * FROM check_labels ORDER BY idx'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/check-labels/upsert', requireAdmin, async (req, res) => {
  try { await db.execute({ sql: 'INSERT OR REPLACE INTO check_labels (idx,label) VALUES (?,?)', args: [req.body.idx, req.body.label] }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── SPA fallback ───────────────────────────────────────────────────────
app.get('/{*path}', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── Start ──────────────────────────────────────────────────────────────
initDB()
  .then(() => app.listen(PORT, () => console.log(`✅  Hili Asset Manager · porta ${PORT}`)))
  .catch(err => { console.error(err); process.exit(1); });
