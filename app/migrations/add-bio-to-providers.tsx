"use client"

import { useState } from "react"
import { createAdminClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddBioToProvidersMigration() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const runMigration = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const supabase = createAdminClient()

      // SQL to add bio column
      const sql = `
        -- Add bio column to providers table if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'providers' AND column_name = 'bio'
          ) THEN
            ALTER TABLE providers ADD COLUMN bio TEXT;
          END IF;
        END
        $$;
      `

      // Execute the SQL
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) {
        throw error
      }

      setResult({
        success: true,
        message: "Bio column added to providers table successfully!",
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
        <CardTitle>Add Bio to Providers</CardTitle>
        <CardDescription>Adds a bio column to the providers table.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          This migration will add a 'bio' column to the providers table to store provider biographies.
        </p>

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
