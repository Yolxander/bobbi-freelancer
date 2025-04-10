"use client"

import { useState } from "react"
import { createAdminClient } from "@/lib/supabase"

export default function AllowNullClientIdMigration() {
  const [status, setStatus] = useState("idle")
  const [message, setMessage] = useState("")

  const runMigration = async () => {
    setStatus("running")
    setMessage("Starting migration...")

    try {
      const supabase = createAdminClient()

      // Check if the constraint exists
      setMessage("Checking current constraints...")
      const { data: foreignKeys, error: checkError } = await supabase.rpc("get_foreign_keys", {
        table_name: "projects",
        column_name: "client_id",
      })

      if (checkError) {
        throw new Error(`Error checking constraints: ${checkError.message}`)
      }

      // If there's a NOT NULL constraint, we need to remove it
      setMessage("Updating client_id column to allow NULL values...")

      // First, make sure any existing projects have valid client_id values
      const { error: updateError } = await supabase.from("projects").update({ client_id: null }).eq("client_id", "")

      if (updateError) {
        throw new Error(`Error updating empty client_id values: ${updateError.message}`)
      }

      // Use raw SQL to alter the column (this requires superuser privileges)
      // Note: In a real application, you would do this through a proper migration system
      const { error: alterError } = await supabase.rpc("run_sql", {
        sql: "ALTER TABLE projects ALTER COLUMN client_id DROP NOT NULL;",
      })

      if (alterError) {
        throw new Error(`Error altering column: ${alterError.message}`)
      }

      setStatus("success")
      setMessage("Migration completed successfully! The client_id column now allows NULL values.")
    } catch (error) {
      console.error("Migration error:", error)
      setStatus("error")
      setMessage(`Migration failed: ${error.message}`)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Migration: Allow NULL client_id</h1>
      <p className="mb-4 text-gray-600">
        This migration will modify the projects table to allow NULL values in the client_id column, enabling "Personal"
        projects without an associated client.
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Warning:</strong> This migration requires database superuser privileges. In a production
              environment, you should use proper migration tools.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={runMigration}
        disabled={status === "running"}
        className={`px-4 py-2 rounded-lg ${
          status === "running" ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {status === "running" ? "Running Migration..." : "Run Migration"}
      </button>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            status === "error"
              ? "bg-red-100 text-red-800"
              : status === "success"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Migration Details</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
          {`-- This migration makes the client_id column in the projects table nullable
ALTER TABLE projects ALTER COLUMN client_id DROP NOT NULL;

-- This ensures any empty string client_ids are converted to NULL
UPDATE projects SET client_id = NULL WHERE client_id = '';`}
        </pre>
      </div>
    </div>
  )
}
