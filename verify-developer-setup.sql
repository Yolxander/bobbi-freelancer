-- This script verifies and fixes the developer-specific database setup

-- 1. First, check if the Web & Software Development provider type exists
DO $$
DECLARE
  web_dev_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM provider_types WHERE name = 'Web & Software Development'
  ) INTO web_dev_exists;
  
  IF NOT web_dev_exists THEN
    -- Create the provider type if it doesn't exist
    INSERT INTO provider_types (name, description)
    VALUES ('Web & Software Development', 'Web and software development services including frontend, backend, and full-stack development');
    
    RAISE NOTICE 'Created Web & Software Development provider type';
  ELSE
    RAISE NOTICE 'Web & Software Development provider type already exists';
  END IF;
END
$$;

-- 2. Check if the necessary columns exist in the tasks table
DO $$
BEGIN
  -- Check and add github_repo column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'github_repo'
  ) THEN
    ALTER TABLE tasks ADD COLUMN github_repo TEXT;
    RAISE NOTICE 'Added github_repo column to tasks table';
  ELSE
    RAISE NOTICE 'github_repo column already exists in tasks table';
  END IF;
  
  -- Check and add tech_stack column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'tech_stack'
  ) THEN
    ALTER TABLE tasks ADD COLUMN tech_stack TEXT;
    RAISE NOTICE 'Added tech_stack column to tasks table';
  ELSE
    RAISE NOTICE 'tech_stack column already exists in tasks table';
  END IF;
  
  -- Check and add code_snippet column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'code_snippet'
  ) THEN
    ALTER TABLE tasks ADD COLUMN code_snippet TEXT;
    RAISE NOTICE 'Added code_snippet column to tasks table';
  ELSE
    RAISE NOTICE 'code_snippet column already exists in tasks table';
  END IF;
  
  -- Check and add component_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'component_name'
  ) THEN
    ALTER TABLE tasks ADD COLUMN component_name TEXT;
    RAISE NOTICE 'Added component_name column to tasks table';
  ELSE
    RAISE NOTICE 'component_name column already exists in tasks table';
  END IF;
END
$$;

-- 3. Create deployments table if it doesn't exist
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

-- 4. Create pull_requests table if it doesn't exist
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

-- 5. Create branches table if it doesn't exist
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

-- 6. Check if any providers are assigned to the Web & Software Development type
DO $$
DECLARE
  web_dev_type_id UUID;
  provider_count INTEGER;
BEGIN
  SELECT id INTO web_dev_type_id FROM provider_types WHERE name = 'Web & Software Development';
  
  IF web_dev_type_id IS NOT NULL THEN
    SELECT COUNT(*) INTO provider_count FROM providers WHERE provider_type_id = web_dev_type_id;
    RAISE NOTICE 'Found % providers with Web & Software Development type', provider_count;
  ELSE
    RAISE NOTICE 'Could not find Web & Software Development provider type';
  END IF;
END
$$;

-- 7. Create a function to check if a provider is a web developer
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
