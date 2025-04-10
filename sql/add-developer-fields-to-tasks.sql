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
