"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AddOtherProviderType() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const runMigration = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClientComponentClient()

      // SQL to add the "Other" provider type
      const sql = `
        -- Insert "Other" provider type if it doesn't exist
        INSERT INTO provider_types (name, description)
        VALUES ('Other', 'Other professional services not listed in the categories above')
        ON CONFLICT (name) DO NOTHING;
      `

      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) throw error

      setSuccess("Successfully added 'Other' provider type!")
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
        <CardTitle>Add "Other" Provider Type</CardTitle>
        <CardDescription>Add an "Other" option for providers who don't fit existing categories</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          This migration adds an "Other" option to the provider types table, allowing users to select this option if
          they don't identify as designers or developers.
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
