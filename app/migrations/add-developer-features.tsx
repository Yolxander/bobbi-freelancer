"use client"

import { useState } from "react"
import { createAdminClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function AddDeveloperFeaturesMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message])
  }

  const runMigration = async () => {
    setIsLoading(true)
    setError(null)
    setLogs([])

    try {
      const supabase = createAdminClient()

      // Step 1: Add GitHub repository and tech stack fields to tasks table
      addLog("Adding GitHub repository and tech stack fields to tasks table...")
      const { error: tasksError } = await supabase.rpc("run_sql", {
        sql: `
          ALTER TABLE tasks
          ADD COLUMN IF NOT EXISTS github_repo TEXT,
          ADD COLUMN IF NOT EXISTS tech_stack TEXT;
        `,
      })

      if (tasksError) throw new Error(`Failed to update tasks table: ${tasksError.message}`)
      addLog("✅ Successfully added GitHub repository and tech stack fields to tasks table")

      // Step 2: Add code_snippet field to subtasks table
      addLog("Adding code_snippet field to subtasks table...")
      const { error: subtasksError } = await supabase.rpc("run_sql", {
        sql: `
          ALTER TABLE subtasks
          ADD COLUMN IF NOT EXISTS code_snippet TEXT;
        `,
      })

      if (subtasksError) throw new Error(`Failed to update subtasks table: ${subtasksError.message}`)
      addLog("✅ Successfully added code_snippet field to subtasks table")

      // Step 3: Create deployments table
      addLog("Creating deployments table...")
      const { error: deploymentsError } = await supabase.rpc("run_sql", {
        sql: `
          -- Create a deployments table for tracking deployments
          CREATE TABLE IF NOT EXISTS deployments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
            environment TEXT NOT NULL,
            status TEXT NOT NULL,
            url TEXT,
            version TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Create an index on task_id for faster lookups
          CREATE INDEX IF NOT EXISTS idx_deployments_task_id ON deployments(task_id);
        `,
      })

      if (deploymentsError) throw new Error(`Failed to create deployments table: ${deploymentsError.message}`)
      addLog("✅ Successfully created deployments table")

      // Step 4: Create pull_requests table
      addLog("Creating pull_requests table...")
      const { error: prError } = await supabase.rpc("run_sql", {
        sql: `
          -- Create a pull_requests table for tracking PRs
          CREATE TABLE IF NOT EXISTS pull_requests (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
            pr_number TEXT NOT NULL,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            url TEXT,
            author TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Create an index on task_id for faster lookups
          CREATE INDEX IF NOT EXISTS idx_pull_requests_task_id ON pull_requests(task_id);
        `,
      })

      if (prError) throw new Error(`Failed to create pull_requests table: ${prError.message}`)
      addLog("✅ Successfully created pull_requests table")

      // Step 5: Create branches table
      addLog("Creating branches table...")
      const { error: branchesError } = await supabase.rpc("run_sql", {
        sql: `
          -- Create a branches table for tracking git branches
          CREATE TABLE IF NOT EXISTS branches (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            last_commit TEXT,
            last_commit_author TEXT,
            last_commit_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Create an index on task_id for faster lookups
          CREATE INDEX IF NOT EXISTS idx_branches_task_id ON branches(task_id);
        `,
      })

      if (branchesError) throw new Error(`Failed to create branches table: ${branchesError.message}`)
      addLog("✅ Successfully created branches table")

      // Step 6: Add function to check if provider is a web developer
      addLog("Creating function to check if provider is a web developer...")
      const { error: functionError } = await supabase.rpc("run_sql", {
        sql: `
          -- Create a function to check if a provider is a web developer
          CREATE OR REPLACE FUNCTION is_web_developer(provider_id UUID)
          RETURNS BOOLEAN AS $$
          DECLARE
            provider_type TEXT;
          BEGIN
            SELECT provider_type INTO provider_type FROM providers WHERE id = provider_id;
            RETURN provider_type = 'Web Developer' OR provider_type = 'Software Developer';
          END;
          $$ LANGUAGE plpgsql;
        `,
      })

      if (functionError) throw new Error(`Failed to create is_web_developer function: ${functionError.message}`)
      addLog("✅ Successfully created is_web_developer function")

      setIsComplete(true)
      addLog("🎉 Migration completed successfully!")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err.message)
      addLog(`❌ Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add Developer Features Migration</CardTitle>
        <CardDescription>
          This migration adds support for web and software development providers by creating necessary database tables
          and fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="font-medium mb-2">This migration will:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Add GitHub repository and tech stack fields to tasks table</li>
              <li>Add code snippet support to subtasks</li>
              <li>Create a deployments table for tracking deployments</li>
              <li>Create a pull requests table for tracking PRs</li>
              <li>Create a branches table for tracking git branches</li>
              <li>Add a function to check if a provider is a web developer</li>
            </ul>
          </div>

          {logs.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-64 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="pb-1">
                  {log}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Migration failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {isComplete && !error && (
            <div className="bg-green-50 text-green-800 p-4 rounded-md flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Migration completed successfully</p>
                <p className="text-sm">All database changes have been applied.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={runMigration} disabled={isLoading || isComplete} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Migration...
            </>
          ) : isComplete ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Migration Complete
            </>
          ) : (
            "Run Migration"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
