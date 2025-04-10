-- Create a table to track collaborations between providers
CREATE TABLE IF NOT EXISTS provider_collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES providers(id),
  collaborator_id UUID NOT NULL REFERENCES providers(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, active, rejected, removed
  role VARCHAR(50) DEFAULT 'collaborator', -- owner, collaborator, viewer, etc.
  permissions JSONB DEFAULT '{"edit": true, "delete": false, "invite": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, collaborator_id)
);

-- Create a table for collaboration invitations
CREATE TABLE IF NOT EXISTS collaboration_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES providers(id),
  recipient_id UUID NOT NULL REFERENCES providers(id),
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, expired
  role VARCHAR(50) DEFAULT 'collaborator',
  permissions JSONB DEFAULT '{"edit": true, "delete": false, "invite": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  UNIQUE(project_id, recipient_id, status)
);

-- Add a notifications table for collaboration events
CREATE TABLE IF NOT EXISTS provider_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- collaboration_invite, collaboration_accepted, etc.
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_provider_collaborations_project_id ON provider_collaborations(project_id);
CREATE INDEX IF NOT EXISTS idx_provider_collaborations_collaborator_id ON provider_collaborations(collaborator_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_invitations_recipient_id ON collaboration_invitations(recipient_id);
CREATE INDEX IF NOT EXISTS idx_provider_notifications_provider_id ON provider_notifications(provider_id);
