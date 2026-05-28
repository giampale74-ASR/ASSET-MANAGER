const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_DIR = process.env.DB_PATH || path.join(__dirname, '../data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
const DB_FILE = path.join(DB_DIR, 'assetmanager.db');

let sqlDb;

function save() {
  try { fs.writeFileSync(DB_FILE, Buffer.from(sqlDb.export())); }
  catch(e) { console.error('DB save error:', e.message); }
}

function makeStmt(sql) {
  return {
    all: (...args) => {
      const stmt = sqlDb.prepare(sql);
      const p = args.flat().filter(a => a !== undefined && a !== null);
      if (p.length) stmt.bind(p);
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      stmt.free();
      return rows;
    },
    get: (...args) => {
      const stmt = sqlDb.prepare(sql);
      const p = args.flat().filter(a => a !== undefined && a !== null);
      if (p.length) stmt.bind(p);
      let row = null;
      if (stmt.step()) row = stmt.getAsObject();
      stmt.free();
      return row;
    },
    run: (...args) => {
      const p = args.flat().filter(a => a !== undefined);
      sqlDb.run(sql, p.length ? p : []);
      save();
      const s = sqlDb.prepare("SELECT last_insert_rowid() as id");
      s.step();
      const obj = s.getAsObject();
      s.free();
      return { lastInsertRowid: obj.id || null };
    }
  };
}

const db = {
  prepare: (sql) => makeStmt(sql),
  exec: (sql) => {
    sql.split(';').map(s => s.trim()).filter(Boolean).forEach(s => {
      try { sqlDb.run(s); } catch(e) {}
    });
    save();
  },
  pragma: () => {}
};

async function initDB() {
  const SQL = await initSqlJs();
  sqlDb = fs.existsSync(DB_FILE)
    ? new SQL.Database(fs.readFileSync(DB_FILE))
    : new SQL.Database();
  [
    `CREATE TABLE IF NOT EXISTS assets (id INTEGER PRIMARY KEY AUTOINCREMENT, nominativo TEXT NOT NULL, email TEXT, reparto TEXT, serialePC TEXT, modelloPC TEXT, dataAcquisto TEXT, dataConsegna TEXT, sim TEXT, numeroCellulare TEXT, accountMicrosoft TEXT, note TEXT, stato TEXT DEFAULT 'Attivo')`,
    `CREATE TABLE IF NOT EXISTS hardware (id INTEGER PRIMARY KEY AUTOINCREMENT, tipo TEXT, modello TEXT, seriale TEXT, stato TEXT DEFAULT 'In uso', assegnatoA TEXT, dataAcquisto TEXT, dataConsegna TEXT, note TEXT)`,
    `CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, action TEXT, asset_id INTEGER, asset_serial TEXT, asset_nome TEXT, changes TEXT)`,
    `CREATE TABLE IF NOT EXISTS reparti (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT UNIQUE)`,
    `CREATE TABLE IF NOT EXISTS checks (key TEXT PRIMARY KEY, value INTEGER DEFAULT 0)`,
    `CREATE TABLE IF NOT EXISTS check_labels (idx INTEGER PRIMARY KEY, label TEXT)`,
  ].forEach(s => sqlDb.run(s));
  save();
}

module.exports = { db, initDB };
