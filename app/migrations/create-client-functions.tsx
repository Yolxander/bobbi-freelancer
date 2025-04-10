"use client"

import { useState } from "react"
import { createAdminClient } from "@/lib/supabase"

export default function CreateClientFunctions() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const runMigration = async () => {
    setStatus("loading")
    setError(null)

    try {
      const supabase = createAdminClient()

      // Create the function to update client user_id
      const { error: functionError } = await supabase.rpc("execute_sql", {
        sql: `
          -- Function to update client user_id that bypasses RLS
          CREATE OR REPLACE FUNCTION update_client_user_id(p_client_id UUID, p_user_id UUID)
          RETURNS VOID AS $$
          BEGIN
            UPDATE clients
            SET user_id = p_user_id, updated_at = NOW()
            WHERE id = p_client_id;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;

          -- Grant execute permission to authenticated users
          GRANT EXECUTE ON FUNCTION update_client_user_id TO authenticated;
          GRANT EXECUTE ON FUNCTION update_client_user_id TO service_role;
        `,
      })

      if (functionError) {
        throw new Error(`Failed to create function: ${functionError.message}`)
      }

      setStatus("success")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err.message)
      setStatus("error")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Client Functions Migration</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="mb-4">
          This migration creates a database function that allows updating client user_id while bypassing Row Level
          Security.
        </p>

        <button
          onClick={runMigration}
          disabled={status === "loading"}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "loading" ? "Running..." : "Run Migration"}
        </button>

        {status === "success" && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">Migration completed successfully!</div>
        )}

        {status === "error" && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
