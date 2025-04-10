-- Assuming you have a providers table and want to link it to projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES providers(id) ON DELETE CASCADE;

-- (Optional) Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_provider_id ON projects(provider_id);
