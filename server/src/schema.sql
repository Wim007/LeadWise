-- Carnegie Coach — databaseschema
-- Idempotent: veilig om meerdere keren te draaien (ook bij elke Railway-deploy).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Eén rij per afgeronde oefening: scenario, tekstreflectie of dagreflectie.
-- We slaan bewust alleen op wat nodig is voor continuïteit: geen ruwe
-- geplakte teksten, geen gespreksinhoud buiten het rollenspel om.
CREATE TABLE IF NOT EXISTS sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type              TEXT NOT NULL CHECK (type IN ('scenario', 'text_review', 'reflection')),
  context_label     TEXT NOT NULL,
  principles        TEXT[] NOT NULL DEFAULT '{}',
  feedback          TEXT,
  action            TEXT,
  development_point TEXT,
  status            TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('active', 'completed')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_created_at_idx ON sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS sessions_type_idx ON sessions (type);

-- Alleen gevuld voor scenario-sessies: het rollenspel zelf.
CREATE TABLE IF NOT EXISTS messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('user', 'coach')),
  content     TEXT NOT NULL,
  turn_index  INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_session_idx ON messages (session_id, turn_index);

-- De situatiebeschrijving en de gespeelde rol horen bij de sessie, niet bij een
-- bericht. We bewaren ze zodat de coach in rol kan blijven tijdens het scenario.
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS situation TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS partner_role TEXT;
