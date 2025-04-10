-- Add GitHub repository and tech stack fields to tasks table
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS github_repo TEXT,
ADD COLUMN IF NOT EXISTS tech_stack TEXT;

-- Add code_snippet field to subtasks table
ALTER TABLE subtasks
ADD COLUMN IF NOT EXISTS code_snippet TEXT;

-- Create a deployments table for tracking deployments
CREATE TABLE IF NOT EXISTS deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  environment TEXT NOT NULL,
  status TEXT NOT NULL,
  url TEXT,
  version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on task_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_deployments_task_id ON deployments(task_id);

-- Create a pull_requests table for tracking PRs
CREATE TABLE IF NOT EXISTS pull_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  pr_number TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  url TEXT,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on task_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_pull_requests_task_id ON pull_requests(task_id);

-- Create a branches table for tracking git branches
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  last_commit TEXT,
  last_commit_author TEXT,
  last_commit_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on task_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_branches_task_id ON branches(task_id);

-- Create a function to check if a provider is a web developer
CREATE OR REPLACE FUNCTION is_web_developer(provider_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  provider_type TEXT;
BEGIN
  SELECT provider_type INTO provider_type FROM providers WHERE id = provider_id;
  RETURN provider_type = 'Web Developer' OR provider_type = 'Software Developer';
END;
$$ LANGUAGE plpgsql;
