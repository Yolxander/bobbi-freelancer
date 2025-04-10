"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function UpdateCollaborationTablesMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const runMigration = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Remove email_sent column if it exists
      const { error } = await supabase.rpc("run_sql", {
        sql: `
          ALTER TABLE IF EXISTS collaboration_invitations 
          DROP COLUMN IF EXISTS email_sent;
        `,
      })

      if (error) throw error

      setResult("Migration completed successfully!")
    } catch (error) {
      console.error("Migration error:", error)
      setResult(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Update Collaboration Tables</h3>
        <p className="text-sm text-muted-foreground">Removes email-related fields from collaboration tables.</p>
      </div>

      <Button onClick={runMigration} disabled={isLoading}>
        {isLoading ? "Running..." : "Run Migration"}
      </Button>

      {result && (
        <div className={`p-4 rounded-md ${result.includes("Error") ? "bg-red-100" : "bg-green-100"}`}>{result}</div>
      )}
    </div>
  )
}
