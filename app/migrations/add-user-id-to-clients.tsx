"use client"

import { useState } from "react"
import { createAdminClient } from "@/lib/supabase"

export default function AddUserIdToClients() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const runMigration = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const supabase = createAdminClient()

      // Add user_id column to clients table
      const { error: alterError } = await supabase.rpc("execute_sql", {
        sql: `
          -- Add user_id column to clients table
          ALTER TABLE IF EXISTS public.clients
          ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
          
          -- Create index for faster lookups
          CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
        `,
      })

      if (alterError) {
        console.error("Error adding user_id to clients table:", alterError)
        setResult({
          success: false,
          message: `Failed to add user_id to clients table: ${alterError.message}`,
        })
        return
      }

      setResult({
        success: true,
        message: "Successfully added user_id to clients table",
      })
    } catch (error) {
      console.error("Error in migration:", error)
      setResult({
        success: false,
        message: `An unexpected error occurred: ${error.message}`,
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h2 className="text-lg font-semibold mb-2">Add User ID to Clients Table</h2>
      <p className="text-gray-600 mb-4">
        This migration adds a user_id column to the clients table to link clients with auth users.
      </p>

      <button
        onClick={runMigration}
        disabled={isRunning}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {isRunning ? "Running Migration..." : "Run Migration"}
      </button>

      {result && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}
