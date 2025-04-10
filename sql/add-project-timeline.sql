-- Create project timeline events table
CREATE TABLE IF NOT EXISTS project_timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE project_timeline_events ENABLE ROW LEVEL SECURITY;

-- Policy for selecting timeline events - simplified to just check project ownership
CREATE POLICY "Users can view timeline events for their projects" 
ON project_timeline_events FOR SELECT 
USING (
  project_id IN (
    SELECT id FROM projects WHERE created_by = auth.uid()
  )
);

-- Policy for inserting timeline events
CREATE POLICY "Users can insert timeline events for their projects" 
ON project_timeline_events FOR INSERT 
WITH CHECK (
  project_id IN (
    SELECT id FROM projects WHERE created_by = auth.uid()
  )
);

-- Policy for updating timeline events
CREATE POLICY "Users can update timeline events for their projects" 
ON project_timeline_events FOR UPDATE 
USING (
  project_id IN (
    SELECT id FROM projects WHERE created_by = auth.uid()
  )
);

-- Policy for deleting timeline events
CREATE POLICY "Users can delete timeline events for their projects" 
ON project_timeline_events FOR DELETE 
USING (
  project_id IN (
    SELECT id FROM projects WHERE created_by = auth.uid()
  )
);
