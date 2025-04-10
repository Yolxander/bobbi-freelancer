"use client"

import { useState } from "react"
import { createAdminClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddProviderTypesMigration() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const runMigration = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const supabase = createAdminClient()

      // Read the SQL file content
      const response = await fetch("/api/migrations/provider-types")
      if (!response.ok) {
        throw new Error(`Failed to fetch migration SQL: ${response.statusText}`)
      }

      const { sql } = await response.json()

      // Execute the SQL
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) {
        throw error
      }

      setResult({
        success: true,
        message: "Provider types table created and populated successfully!",
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
        <CardTitle>Add Provider Types</CardTitle>
        <CardDescription>
          Creates a provider_types table and adds a reference column to the providers table.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">This migration will:</p>
        <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1 mb-4">
          <li>Create a new provider_types table</li>
          <li>Add initial provider types (Creative & Design, Web & Software Development)</li>
          <li>Add a provider_type_id column to the providers table</li>
        </ul>

        {result && (
          <div
            className={`p-3 rounded-md mt-4 ${result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {result.message}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={runMigration} disabled={isRunning} className="w-full">
          {isRunning ? "Running Migration..." : "Run Migration"}
        </Button>
      </CardFooter>
    </Card>
  )
}
