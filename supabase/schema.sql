-- ====================================================
-- SustainLabel – Supabase schema
-- Run in the Supabase SQL Editor
-- ====================================================

-- DPP-sidor (digital product passports)
CREATE TABLE dpp_pages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug       TEXT NOT NULL,
  name       TEXT NOT NULL,
  content    JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, slug)
);

-- DPP-mall (en per användare, valfri)
CREATE TABLE dpp_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content    JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Projekt / vector stores
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  vector_store_id TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ====================================================
-- Row Level Security
-- ====================================================
ALTER TABLE dpp_pages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE dpp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;

-- dpp_pages: publik läsning, ägaren hanterar sina egna
CREATE POLICY "Public can read pages"
  ON dpp_pages FOR SELECT USING (true);

CREATE POLICY "Users can insert own pages"
  ON dpp_pages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pages"
  ON dpp_pages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pages"
  ON dpp_pages FOR DELETE
  USING (auth.uid() = user_id);

-- dpp_templates: ägaren hanterar sin egen mall
CREATE POLICY "Users see own templates"
  ON dpp_templates FOR ALL
  USING (auth.uid() = user_id);

-- projects: ägaren hanterar sina egna projekt
CREATE POLICY "Users see own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id);

-- ====================================================
-- Auto-update updated_at trigger
-- ====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dpp_pages_updated_at
  BEFORE UPDATE ON dpp_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER dpp_templates_updated_at
  BEFORE UPDATE ON dpp_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
