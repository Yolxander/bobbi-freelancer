"use client"

import { useState } from "react"
import { createAdminClient } from "@/lib/supabase"

export default function AddProjectTimeline() {
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const runMigration = async () => {
    setIsRunning(true)
    setError(null)
    setLogs([])

    try {
      const supabase = createAdminClient()

      // Add log
      setLogs((prev) => [...prev, "Starting migration: Adding project timeline table..."])

      // Read the SQL file
      const response = await fetch("/sql/add-project-timeline.sql")
      const sql = await response.text()

      // Execute the SQL
      const { error } = await supabase.rpc("run_sql", { query: sql })

      if (error) {
        throw error
      }

      setLogs((prev) => [...prev, "Successfully created project timeline table and policies"])
      setIsComplete(true)
    } catch (err) {
      console.error("Migration error:", err)
      setError(err.message || "An unknown error occurred")
      setLogs((prev) => [...prev, `Error: ${err.message}`])
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Project Timeline</h2>
      <p className="text-gray-600 mb-4">
        This migration adds a project timeline events table to track milestones and important events for projects.
      </p>

      {!isComplete ? (
        <button
          onClick={runMigration}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? "Running Migration..." : "Run Migration"}
        </button>
      ) : (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">Migration completed successfully!</div>
      )}

      {error && <div className="mt-4 bg-red-100 text-red-800 p-3 rounded-md">{error}</div>}

      {logs.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Logs:</h3>
          <div className="bg-gray-100 p-3 rounded-md max-h-40 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-sm font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
