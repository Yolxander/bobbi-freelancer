"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AddCustomProviderType() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const runMigration = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClientComponentClient()

      // SQL to add the custom_provider_type column
      const sql = `
        -- Add custom_provider_type column to providers table if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'providers' AND column_name = 'custom_provider_type'
          ) THEN
            ALTER TABLE providers ADD COLUMN custom_provider_type TEXT;
          END IF;
        END
        $$;

        -- Insert "Other" provider type if it doesn't exist
        INSERT INTO provider_types (name, description)
        VALUES ('Other', 'Other professional services not listed in the categories above')
        ON CONFLICT (name) DO NOTHING;
      `

      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) throw error

      setSuccess("Successfully added custom provider type support!")
    } catch (err) {
      console.error("Migration error:", err)
      setError(`Error: ${err.message || "Unknown error occurred"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Custom Provider Type Support</CardTitle>
        <CardDescription>Add support for custom provider types</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          This migration adds a custom_provider_type column to the providers table and adds an "Other" option to the
          provider types, allowing users to specify their own provider type when they don't fit into the existing
          categories.
        </p>

        {error && <div className="p-3 rounded-md bg-red-50 text-red-700 mb-4">{error}</div>}

        {success && <div className="p-3 rounded-md bg-green-50 text-green-700 mb-4">{success}</div>}
      </CardContent>
      <CardFooter>
        <Button onClick={runMigration} disabled={isLoading}>
          {isLoading ? "Running Migration..." : "Run Migration"}
        </Button>
      </CardFooter>
    </Card>
  )
}
