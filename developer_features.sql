-- SQL script to add developer features to the database
-- Run this directly in the Supabase SQL editor

-- Step 1: Add GitHub repository and tech stack fields to the tasks table
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS github_repo TEXT,
ADD COLUMN IF NOT EXISTS tech_stack TEXT,
ADD COLUMN IF NOT EXISTS code_snippet TEXT;

-- Step 2: Add code snippet support to subtasks
ALTER TABLE subtasks
ADD COLUMN IF NOT EXISTS code_snippet TEXT,
ADD COLUMN IF NOT EXISTS language TEXT;

-- Step 3: Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  environment TEXT NOT NULL,
  status TEXT NOT NULL,
  url TEXT,
  version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 4: Create pull requests table
CREATE TABLE IF NOT EXISTS pull_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  pr_number TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  url TEXT,
  author TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 5: Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  last_commit TEXT,
  last_commit_author TEXT,
  last_commit_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 6: Create a function to check if a provider is a web developer
CREATE OR REPLACE FUNCTION is_web_developer(provider_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  provider_type TEXT;
BEGIN
  SELECT pt.name INTO provider_type
  FROM providers p
  JOIN provider_types pt ON p.provider_type_id = pt.id
  WHERE p.id = provider_id;
  
  RETURN provider_type = 'Web & Software Development';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all relevant tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'deployments_updated_at') THEN
    CREATE TRIGGER deployments_updated_at
    BEFORE UPDATE ON deployments
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'pull_requests_updated_at') THEN
    CREATE TRIGGER pull_requests_updated_at
    BEFORE UPDATE ON pull_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'branches_updated_at') THEN
    CREATE TRIGGER branches_updated_at
    BEFORE UPDATE ON branches
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  END IF;
END
$$;

-- Step 8: Set up RLS (Row Level Security) policies for the new tables
-- Enable RLS on the tables
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pull_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- Create policies for deployments
CREATE POLICY deployments_select_policy ON deployments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

CREATE POLICY deployments_insert_policy ON deployments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

CREATE POLICY deployments_update_policy ON deployments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

CREATE POLICY deployments_delete_policy ON deployments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

-- Create policies for pull_requests
CREATE POLICY pull_requests_select_policy ON pull_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

CREATE POLICY pull_requests_insert_policy ON pull_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

CREATE POLICY pull_requests_update_policy ON pull_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

CREATE POLICY pull_requests_delete_policy ON pull_requests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

-- Create policies for branches
CREATE POLICY branches_select_policy ON branches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

CREATE POLICY branches_insert_policy ON branches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

CREATE POLICY branches_update_policy ON branches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

CREATE POLICY branches_delete_policy ON branches
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id AND t.provider_id = auth.uid()
    )
  );

-- Step 9: Update the provider_utils.ts file to use the correct provider type ID
-- Make sure the WEB_DEV_PROVIDER_TYPE_ID in provider-utils.ts matches the actual ID in your database
-- You can find this by running: SELECT id FROM provider_types WHERE name = 'Web & Software Development';
