"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// SQL query to create provider collaborations tables
const sql = `
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
`

export default function AddProviderCollaborationsMigration() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const runMigration = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) {
        throw error
      }

      setResult({
        success: true,
        message: "Provider collaborations tables created successfully!",
      })
    } catch (error) {
      console.error("Migration error:", error)
      setResult({
        success: false,
        message: `Error: ${error.message || "Unknown error occurred"}`,
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add Provider Collaborations</CardTitle>
        <CardDescription>
          This migration adds tables for provider collaborations, invitations, and notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <div
            className={`p-3 rounded-md mb-4 ${
              result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {result.message}
          </div>
        )}
        <p className="text-sm text-gray-500 mb-4">
          Running this migration will create the necessary database structure for provider collaborations.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={runMigration} disabled={isRunning} className="w-full">
          {isRunning ? "Running Migration..." : "Run Migration"}
        </Button>
      </CardFooter>
    </Card>
  )
}
