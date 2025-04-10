"use client"

import { useState } from "react"
import { createAdminClient } from "@/lib/supabase"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function CreateTeamMemberInvitationsTable() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const runMigration = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createAdminClient()

      // Create the team_member_invitations table
      const { error: createTableError } = await supabase.rpc("create_team_member_invitations_table")

      if (createTableError) throw createTableError

      setSuccess(true)
    } catch (err: any) {
      console.error("Migration error:", err)
      setError(err.message || "An error occurred during migration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Create Team Member Invitations Table</h2>
      <p className="text-gray-600 mb-4">
        This migration creates the team_member_invitations table to track invitations sent to team members.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>Migration completed successfully!</span>
        </div>
      )}

      <button
        onClick={runMigration}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Running Migration..." : "Run Migration"}
      </button>
    </div>
  )
}
