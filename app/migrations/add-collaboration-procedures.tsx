"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// SQL query to create collaboration procedures
const sql = `
-- Create a function to handle accepting a collaboration invitation in a transaction
CREATE OR REPLACE FUNCTION accept_collaboration_invite(invite_id UUID, provider_id UUID)
RETURNS VOID AS $$
DECLARE
  invite_record RECORD;
BEGIN
  -- Get the invitation
  SELECT * INTO invite_record FROM collaboration_invitations 
  WHERE id = invite_id AND recipient_id = provider_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;
  
  IF invite_record.status != 'pending' THEN
    RAISE EXCEPTION 'Invitation has already been processed';
  END IF;
  
  -- Update the invitation status
  UPDATE collaboration_invitations 
  SET status = 'accepted' 
  WHERE id = invite_id;
  
  -- Create the collaboration
  INSERT INTO provider_collaborations (
    project_id,
    owner_id,
    collaborator_id,
    status,
    role,
    permissions
  ) VALUES (
    invite_record.project_id,
    invite_record.sender_id,
    invite_record.recipient_id,
    'active',
    invite_record.role,
    invite_record.permissions
  );
END;
$$ LANGUAGE plpgsql;
`

export default function AddCollaborationProceduresMigration() {
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
        message: "Collaboration procedures created successfully!",
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
        <CardTitle>Add Collaboration Procedures</CardTitle>
        <CardDescription>This migration adds stored procedures for handling collaboration operations.</CardDescription>
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
          Running this migration will create stored procedures for handling collaboration invitations in transactions.
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
