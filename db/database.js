const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = process.env.DB_PATH || path.join(__dirname, '../data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(path.join(DB_DIR, 'assetmanager.db'));

// Abilita WAL per performance migliori
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS assets (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    nominativo       TEXT NOT NULL,
    email            TEXT,
    reparto          TEXT,
    serialePC        TEXT,
    modelloPC        TEXT,
    dataAcquisto     TEXT,
    dataConsegna     TEXT,
    sim              TEXT,
    numeroCellulare  TEXT,
    accountMicrosoft TEXT,
    note             TEXT,
    stato            TEXT DEFAULT 'Attivo'
  );

  CREATE TABLE IF NOT EXISTS hardware (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo         TEXT,
    modello      TEXT,
    seriale      TEXT,
    stato        TEXT DEFAULT 'In uso',
    assegnatoA   TEXT,
    dataAcquisto TEXT,
    dataConsegna TEXT,
    note         TEXT
  );

  CREATE TABLE IF NOT EXISTS history (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    ts           TEXT,
    action       TEXT,
    asset_id     INTEGER,
    asset_serial TEXT,
    asset_nome   TEXT,
    changes      TEXT
  );

  CREATE TABLE IF NOT EXISTS reparti (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS checks (
    key   TEXT PRIMARY KEY,
    value INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS check_labels (
    idx   INTEGER PRIMARY KEY,
    label TEXT
  );
`);

module.exports = db;
