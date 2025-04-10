"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createAdminClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateStoredProceduresMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const runMigration = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const supabase = createAdminClient()

      // Create the check_table_exists function
      const { error: checkTableError } = await supabase.rpc("execute_sql", {
        sql: `
          CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
          RETURNS boolean
          LANGUAGE plpgsql
          AS $$
          DECLARE
            exists_bool BOOLEAN;
          BEGIN
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public'
              AND table_name = $1
            ) INTO exists_bool;
            
            RETURN exists_bool;
          END;
          $$;
        `,
      })

      if (checkTableError) {
        throw new Error(`Error creating check_table_exists function: ${checkTableError.message}`)
      }

      // Create the execute_sql function
      const { error: executeSqlError } = await supabase.rpc("execute_sql", {
        sql: `
          CREATE OR REPLACE FUNCTION public.execute_sql(sql text)
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            EXECUTE sql;
          END;
          $$;
        `,
      })

      if (executeSqlError) {
        throw new Error(`Error creating execute_sql function: ${executeSqlError.message}`)
      }

      // Create the create_team_member_invitations_table function
      const { error: createTableError } = await supabase.rpc("execute_sql", {
        sql: `
          CREATE OR REPLACE FUNCTION public.create_team_member_invitations_table()
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            CREATE TABLE IF NOT EXISTS public.team_member_invitations (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              team_member_id UUID NOT NULL REFERENCES public.client_team_member(id) ON DELETE CASCADE,
              project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
              token UUID NOT NULL UNIQUE,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              expires_at TIMESTAMPTZ NOT NULL,
              used_at TIMESTAMPTZ,
              UNIQUE(team_member_id, project_id, token)
            );
          END;
          $$;
        `,
      })

      if (createTableError) {
        throw new Error(`Error creating create_team_member_invitations_table function: ${createTableError.message}`)
      }

      setResult({
        success: true,
        message: "Stored procedures created successfully!",
      })
    } catch (error) {
      console.error("Error creating stored procedures:", error)
      setResult({
        success: false,
        message: `Error: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Stored Procedures</CardTitle>
        <CardDescription>
          This migration creates stored procedures for team member invitations and utility functions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">This will create the following stored procedures:</p>
        <ul className="list-disc pl-5 mt-2 text-sm text-gray-500">
          <li>check_table_exists - Checks if a table exists in the database</li>
          <li>execute_sql - Executes arbitrary SQL (for admin use only)</li>
          <li>create_team_member_invitations_table - Creates the team_member_invitations table</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={runMigration} disabled={isLoading}>
          {isLoading ? "Running Migration..." : "Run Migration"}
        </Button>
        {result && <p className={`text-sm ${result.success ? "text-green-500" : "text-red-500"}`}>{result.message}</p>}
      </CardFooter>
    </Card>
  )
}
