require('dotenv').config();
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const bcrypt       = require('bcryptjs');
const sql          = require('mssql');
const jwt          = require('jsonwebtoken');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── DB Config ──────────────────────────────────────────────────────────
const dbConfig = {
  server:   process.env.DB_SERVER   || 'hili-assetmanager-srv.database.windows.net',
  database: process.env.DB_NAME     || 'hili-assetmanager-db',
  user:     process.env.DB_USER     || 'hiliAdmin',
  password: process.env.DB_PASSWORD,
  port:     1433,
  options:  { encrypt: true, trustServerCertificate: false },
  pool:     { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

let pool;
async function getPool() {
  if (!pool) pool = await sql.connect(dbConfig);
  return pool;
}

async function q(sqlStr, params = {}) {
  const p = await getPool();
  const req = p.request();
  for (const [k, v] of Object.entries(params)) req.input(k, v ?? null);
  return req.query(sqlStr);
}

const rows = (r) => r.recordset;
const one  = (r) => r.recordset[0] ?? null;

// ── Auth config ────────────────────────────────────────────────────────
const ADMIN_USER           = process.env.ADMIN_USER        || 'HiliAdmin';
const ADMIN_PASS           = process.env.ADMIN_PASS        || 'Asset2026';
const SESSION_SECRET       = process.env.SESSION_SECRET    || 'hili-asset-2026-secret';
const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL  = process.env.GOOGLE_CALLBACK_URL || 'https://asset.hilitravel.com/auth/google/callback';
const ALLOWED_EMAIL        = process.env.ALLOWED_EMAIL     || 'agiampa@hilitravel.com';
const JWT_SECRET           = process.env.JWT_SECRET || '8b32693a9d8ea9fed9affeba434b4b53572fb79a81123d0d830083a90855a538';
const isProd               = process.env.WEBSITE_SITE_NAME || process.env.NODE_ENV === 'production';

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
  if (req.path === '/api/login' || req.path === '/api/logout') return next();
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
  const p = await getPool();

  const tables = [
    `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id=OBJECT_ID(N'users') AND type='U')
     CREATE TABLE users (
       id       INT IDENTITY(1,1) PRIMARY KEY,
       nome     NVARCHAR(255) NOT NULL,
       email    NVARCHAR(255) UNIQUE NOT NULL,
       password NVARCHAR(255),
       ruolo    NVARCHAR(50)  DEFAULT 'viewer',
       attivo   INT           DEFAULT 1
     )`,
    `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id=OBJECT_ID(N'assets') AND type='U')
     CREATE TABLE assets (
       id               INT IDENTITY(1,1) PRIMARY KEY,
       nominativo       NVARCHAR(255) NOT NULL,
       email            NVARCHAR(255),
       reparto          NVARCHAR(255),
       serialePC        NVARCHAR(255),
       modelloPC        NVARCHAR(255),
       dataAcquisto     NVARCHAR(50),
       dataConsegna     NVARCHAR(50),
       sim              NVARCHAR(255),
       numeroCellulare  NVARCHAR(100),
       accountMicrosoft NVARCHAR(255),
       note             NVARCHAR(MAX),
       stato            NVARCHAR(50) DEFAULT 'Attivo'
     )`,
    `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id=OBJECT_ID(N'hardware') AND type='U')
     CREATE TABLE hardware (
       id           INT IDENTITY(1,1) PRIMARY KEY,
       tipo         NVARCHAR(100),
       modello      NVARCHAR(255),
       seriale      NVARCHAR(255),
       stato        NVARCHAR(50) DEFAULT 'In uso',
       assegnatoA   NVARCHAR(255),
       dataAcquisto NVARCHAR(50),
       dataConsegna NVARCHAR(50),
       note         NVARCHAR(MAX)
     )`,
    `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id=OBJECT_ID(N'history') AND type='U')
     CREATE TABLE history (
       id           INT IDENTITY(1,1) PRIMARY KEY,
       ts           NVARCHAR(50),
       action       NVARCHAR(50),
       asset_id     INT,
       asset_serial NVARCHAR(255),
       asset_nome   NVARCHAR(255),
       changes      NVARCHAR(MAX)
     )`,
    `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id=OBJECT_ID(N'reparti') AND type='U')
     CREATE TABLE reparti (
       id   INT IDENTITY(1,1) PRIMARY KEY,
       nome NVARCHAR(255) UNIQUE
     )`,
    `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id=OBJECT_ID(N'checks') AND type='U')
     CREATE TABLE checks (
       [key] NVARCHAR(255) PRIMARY KEY,
       value INT DEFAULT 0
     )`,
    `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id=OBJECT_ID(N'check_labels') AND type='U')
     CREATE TABLE check_labels (
       idx   INT PRIMARY KEY,
       label NVARCHAR(255)
     )`,
  ];

  for (const sqlStr of tables) await p.request().query(sqlStr);
  console.log('✅  Tabelle DB verificate/create');
}

// ── Auth API ───────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.cookie('hili_session', SESSION_SECRET, {
      httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: !!isProd, maxAge: 8*60*60*1000,
    });
    return res.json({ ok: true, ruolo: 'admin', nome: ADMIN_USER });
  }

  try {
    const user = one(await q('SELECT * FROM users WHERE email=@email AND attivo=1', { email: username.toLowerCase() }));
    if (user?.password && await bcrypt.compare(password, user.password)) {
      setUserCookie(res, { id: user.id, email: user.email, nome: user.nome, ruolo: user.ruolo });
      return res.json({ ok: true, ruolo: user.ruolo, nome: user.nome });
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

// ── Google OAuth ───────────────────────────────────────────────────────
app.get('/auth/google', (req, res) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID, redirect_uri: GOOGLE_CALLBACK_URL,
    response_type: 'code', scope: 'openid email profile', access_type: 'online',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/?error=unauthorized');
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, redirect_uri: GOOGLE_CALLBACK_URL, grant_type: 'authorization_code' }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.redirect('/?error=unauthorized');
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
    const userInfo = await userRes.json();
    const email = userInfo.email?.toLowerCase();
    let user = null;
    try { user = one(await q('SELECT * FROM users WHERE email=@email AND attivo=1', { email })); } catch {}
    if (user) { setUserCookie(res, { id: user.id, email: user.email, nome: user.nome, ruolo: user.ruolo }); return res.redirect('/'); }
    if (email === ALLOWED_EMAIL.toLowerCase()) { setUserCookie(res, { email, nome: userInfo.name || email, ruolo: 'admin' }); return res.redirect('/'); }
    return res.redirect('/?error=unauthorized');
  } catch(e) { console.error('Google auth error:', e.message); res.redirect('/?error=unauthorized'); }
});

// ── SSO dalla Dashboard Hub ────────────────────────────────────────────
// Accetta JWT firmato dalla dashboard, crea cookie sessione e redirige
app.get('/auth/sso', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.redirect('/?error=no-token');
    
    const payload = jwt.verify(token, JWT_SECRET);
    const email = (payload.email || '').toLowerCase().trim();
    if (!email) return res.redirect('/?error=no-email');
    
    // Cerca l'utente nel DB
    let user = null;
    try { user = one(await q('SELECT * FROM users WHERE email=@email AND attivo=1', { email })); } catch {}
    
    if (user) {
      setUserCookie(res, { id: user.id, email: user.email, nome: user.nome, ruolo: user.ruolo });
      return res.redirect('/');
    }
    
    // Fallback: se è l'admin email autorizzata
    if (email === ALLOWED_EMAIL.toLowerCase()) {
      setUserCookie(res, { email, nome: payload.name || email, ruolo: 'admin' });
      return res.redirect('/');
    }
    
    res.redirect('/?error=unauthorized');
  } catch(e) {
    console.error('[SSO] errore:', e.message);
    res.redirect('/?error=invalid-token');
  }
});

// ── Users API ──────────────────────────────────────────────────────────
app.get('/api/users', requireAdmin, async (req, res) => {
  try { res.json(rows(await q('SELECT id,nome,email,ruolo,attivo FROM users ORDER BY nome'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/users', requireAdmin, async (req, res) => {
  const { nome, email, password, ruolo } = req.body;
  try {
    const hash = password ? await bcrypt.hash(password, 10) : null;
    const r = await q(
      `INSERT INTO users (nome,email,password,ruolo,attivo) OUTPUT INSERTED.id,INSERTED.nome,INSERTED.email,INSERTED.ruolo,INSERTED.attivo VALUES (@nome,@email,@password,@ruolo,1)`,
      { nome, email: email.toLowerCase(), password: hash, ruolo: ruolo||'viewer' }
    );
    res.json(one(r));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/users/:id', requireAdmin, async (req, res) => {
  const { nome, email, password, ruolo, attivo } = req.body;
  try {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await q('UPDATE users SET nome=@nome,email=@email,password=@password,ruolo=@ruolo,attivo=@attivo WHERE id=@id',
        { nome, email: email.toLowerCase(), password: hash, ruolo, attivo: attivo?1:0, id: req.params.id });
    } else {
      await q('UPDATE users SET nome=@nome,email=@email,ruolo=@ruolo,attivo=@attivo WHERE id=@id',
        { nome, email: email.toLowerCase(), ruolo, attivo: attivo?1:0, id: req.params.id });
    }
    res.json(one(await q('SELECT id,nome,email,ruolo,attivo FROM users WHERE id=@id', { id: req.params.id })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/users/:id', requireAdmin, async (req, res) => {
  try { await q('DELETE FROM users WHERE id=@id', { id: req.params.id }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Assets ─────────────────────────────────────────────────────────────
app.get('/api/assets', async (req, res) => {
  try { res.json(rows(await q('SELECT * FROM assets ORDER BY id'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/assets', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    const r = await q(
      `INSERT INTO assets (nominativo,email,reparto,serialePC,modelloPC,dataAcquisto,dataConsegna,sim,numeroCellulare,accountMicrosoft,note,stato)
       OUTPUT INSERTED.*
       VALUES (@nominativo,@email,@reparto,@serialePC,@modelloPC,@dataAcquisto,@dataConsegna,@sim,@numeroCellulare,@accountMicrosoft,@note,@stato)`,
      { nominativo:b.nominativo,email:b.email||null,reparto:b.reparto||null,serialePC:b.serialePC||null,modelloPC:b.modelloPC||null,dataAcquisto:b.dataAcquisto||null,dataConsegna:b.dataConsegna||null,sim:b.sim||null,numeroCellulare:b.numeroCellulare||null,accountMicrosoft:b.accountMicrosoft||null,note:b.note||null,stato:b.stato||'Attivo' }
    );
    res.json(one(r));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/assets/:id', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    const r = await q(
      `UPDATE assets SET nominativo=@nominativo,email=@email,reparto=@reparto,serialePC=@serialePC,modelloPC=@modelloPC,dataAcquisto=@dataAcquisto,dataConsegna=@dataConsegna,sim=@sim,numeroCellulare=@numeroCellulare,accountMicrosoft=@accountMicrosoft,note=@note,stato=@stato
       OUTPUT INSERTED.*
       WHERE id=@id`,
      { nominativo:b.nominativo,email:b.email||null,reparto:b.reparto||null,serialePC:b.serialePC||null,modelloPC:b.modelloPC||null,dataAcquisto:b.dataAcquisto||null,dataConsegna:b.dataConsegna||null,sim:b.sim||null,numeroCellulare:b.numeroCellulare||null,accountMicrosoft:b.accountMicrosoft||null,note:b.note||null,stato:b.stato,id:req.params.id }
    );
    res.json(one(r));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/assets/all', requireAdmin, async (req, res) => {
  try { await q('DELETE FROM assets'); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/assets/:id', requireEditor, async (req, res) => {
  try { await q('DELETE FROM assets WHERE id=@id', { id: req.params.id }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Hardware ───────────────────────────────────────────────────────────
app.get('/api/hardware', async (req, res) => {
  try { res.json(rows(await q('SELECT * FROM hardware ORDER BY id'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/hardware', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    const r = await q(
      `INSERT INTO hardware (tipo,modello,seriale,stato,assegnatoA,dataAcquisto,dataConsegna,note)
       OUTPUT INSERTED.*
       VALUES (@tipo,@modello,@seriale,@stato,@assegnatoA,@dataAcquisto,@dataConsegna,@note)`,
      { tipo:b.tipo,modello:b.modello||null,seriale:b.seriale||null,stato:b.stato||'In uso',assegnatoA:b.assegnatoA||null,dataAcquisto:b.dataAcquisto||null,dataConsegna:b.dataConsegna||null,note:b.note||null }
    );
    res.json(one(r));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/hardware/:id', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    const r = await q(
      `UPDATE hardware SET tipo=@tipo,modello=@modello,seriale=@seriale,stato=@stato,assegnatoA=@assegnatoA,dataAcquisto=@dataAcquisto,dataConsegna=@dataConsegna,note=@note
       OUTPUT INSERTED.*
       WHERE id=@id`,
      { tipo:b.tipo,modello:b.modello||null,seriale:b.seriale||null,stato:b.stato,assegnatoA:b.assegnatoA||null,dataAcquisto:b.dataAcquisto||null,dataConsegna:b.dataConsegna||null,note:b.note||null,id:req.params.id }
    );
    res.json(one(r));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/hardware/:id', requireEditor, async (req, res) => {
  try { await q('DELETE FROM hardware WHERE id=@id', { id: req.params.id }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── History ────────────────────────────────────────────────────────────
app.get('/api/history', async (req, res) => {
  try {
    const list = rows(await q('SELECT * FROM history ORDER BY ts DESC'));
    res.json(list.map(h => ({ ...h, changes: h.changes ? (() => { try { return JSON.parse(h.changes); } catch { return null; } })() : null })));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/history', requireEditor, async (req, res) => {
  const b = req.body;
  try {
    await q(
      `INSERT INTO history (ts,action,asset_id,asset_serial,asset_nome,changes) VALUES (@ts,@action,@asset_id,@asset_serial,@asset_nome,@changes)`,
      { ts:b.ts,action:b.action,asset_id:b.asset_id||null,asset_serial:b.asset_serial||null,asset_nome:b.asset_nome||null,changes:b.changes?JSON.stringify(b.changes):null }
    );
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Reparti ────────────────────────────────────────────────────────────
app.get('/api/reparti', async (req, res) => {
  try { res.json(rows(await q('SELECT * FROM reparti ORDER BY nome'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/reparti', requireEditor, async (req, res) => {
  try {
    await q(`IF NOT EXISTS (SELECT 1 FROM reparti WHERE nome=@nome) INSERT INTO reparti (nome) VALUES (@nome)`, { nome: req.body.nome });
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/reparti', requireAdmin, async (req, res) => {
  try { await q('DELETE FROM reparti WHERE nome=@nome', { nome: req.body.nome }); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Checks ─────────────────────────────────────────────────────────────
app.get('/api/checks', async (req, res) => {
  try { res.json(rows(await q('SELECT * FROM checks'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/checks/upsert', requireEditor, async (req, res) => {
  try {
    await q(
      `MERGE checks AS t USING (SELECT @k AS [key], @v AS value) AS s ON t.[key]=s.[key]
       WHEN MATCHED THEN UPDATE SET t.value=s.value
       WHEN NOT MATCHED THEN INSERT ([key],value) VALUES (s.[key],s.value);`,
      { k: req.body.key, v: req.body.value ? 1 : 0 }
    );
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Check labels ───────────────────────────────────────────────────────
app.get('/api/check-labels', async (req, res) => {
  try { res.json(rows(await q('SELECT * FROM check_labels ORDER BY idx'))); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/check-labels/upsert', requireAdmin, async (req, res) => {
  try {
    await q(
      `MERGE check_labels AS t USING (SELECT @idx AS idx, @label AS label) AS s ON t.idx=s.idx
       WHEN MATCHED THEN UPDATE SET t.label=s.label
       WHEN NOT MATCHED THEN INSERT (idx,label) VALUES (s.idx,s.label);`,
      { idx: req.body.idx, label: req.body.label }
    );
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── SPA fallback ───────────────────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── Start ──────────────────────────────────────────────────────────────
initDB()
  .then(() => app.listen(PORT, () => console.log(`✅  Hili Asset Manager · porta ${PORT}`)))
  .catch(err => { console.error('❌  DB init error:', err); process.exit(1); });
