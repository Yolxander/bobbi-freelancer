"use client"

import { useState } from "react"
import { createAdminClient } from "@/lib/supabase"

export default function AddTaskIssuesTable() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const runMigration = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const supabase = createAdminClient()

      // Create the task_issues table
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS task_issues (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          task_id UUID NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'open',
          fix TEXT,
          code_snippet TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)

      // Create index for faster lookups
      await supabase.query(`
        CREATE INDEX IF NOT EXISTS task_issues_task_id_idx ON task_issues(task_id);
      `)

      // Add a trigger to update the updated_at timestamp
      await supabase.query(`
        CREATE OR REPLACE FUNCTION update_task_issues_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_task_issues_updated_at
        BEFORE UPDATE ON task_issues
        FOR EACH ROW
        EXECUTE FUNCTION update_task_issues_updated_at();
      `)

      // Enable RLS
      await supabase.query(`
        ALTER TABLE task_issues ENABLE ROW LEVEL SECURITY;
      `)

      setResult({
        success: true,
        message: "Task issues table created successfully!",
      })
    } catch (error) {
      console.error("Migration error:", error)
      setResult({
        success: false,
        message: `Error: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Task Issues Table</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <p className="mb-4">
          This migration will create a new <code className="bg-gray-100 px-1 py-0.5 rounded">task_issues</code> table to
          track issues and fixes for tasks.
        </p>
        <button
          onClick={runMigration}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Running Migration..." : "Run Migration"}
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-lg ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          <p className="font-medium">{result.message}</p>
        </div>
      )}

      <div className="mt-8 bg-gray-800 text-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">SQL Migration</h2>
        <pre className="whitespace-pre-wrap text-sm">
          {`-- Create the task_issues table
CREATE TABLE IF NOT EXISTS task_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  fix TEXT,
  code_snippet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS task_issues_task_id_idx ON task_issues(task_id);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_task_issues_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_task_issues_updated_at
BEFORE UPDATE ON task_issues
FOR EACH ROW
EXECUTE FUNCTION update_task_issues_updated_at();

-- Enable RLS
ALTER TABLE task_issues ENABLE ROW LEVEL SECURITY;`}
        </pre>
      </div>
    </div>
  )
}
