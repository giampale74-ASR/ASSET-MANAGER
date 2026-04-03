-- ============================================================
-- ASSET MANAGER — Schema Supabase
-- Esegui questo SQL nel SQL Editor di Supabase
-- ============================================================

-- Tabella principale asset
CREATE TABLE assets (
  id              BIGSERIAL PRIMARY KEY,
  nominativo      TEXT NOT NULL,
  email           TEXT,
  reparto         TEXT,
  "serialePC"     TEXT NOT NULL,
  "modelloPC"     TEXT,
  "dataAcquisto"  DATE,
  "dataConsegna"  DATE,
  sim             TEXT,
  "numeroCellulare" TEXT,
  "accountMicrosoft" TEXT,
  note            TEXT,
  stato           TEXT DEFAULT 'Attivo',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Storico modifiche
CREATE TABLE history (
  id          BIGSERIAL PRIMARY KEY,
  ts          TIMESTAMPTZ DEFAULT NOW(),
  action      TEXT NOT NULL,
  asset_id    BIGINT REFERENCES assets(id) ON DELETE SET NULL,
  asset_serial TEXT,
  asset_nome  TEXT,
  changes     TEXT  -- JSON stringificato
);

-- Reparti personalizzati
CREATE TABLE reparti (
  nome TEXT PRIMARY KEY
);

-- Abilita Realtime per aggiornamenti live tra colleghi
ALTER PUBLICATION supabase_realtime ADD TABLE assets;
ALTER PUBLICATION supabase_realtime ADD TABLE history;

-- Row Level Security: accesso libero (app già protetta da password)
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reparti ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_assets"  ON assets  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_history" ON history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_reparti" ON reparti FOR ALL USING (true) WITH CHECK (true);
