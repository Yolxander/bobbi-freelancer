"use server"

import { createAdminClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type IssueData = {
  id?: string
  task_id: string
  title: string
  description?: string
  status: string
  fix?: string
  code_snippet?: string
}

export async function getIssues(taskId: string) {
  const supabase = createAdminClient()

  try {
    console.log("Fetching issues for task:", taskId)

    const { data, error } = await supabase
      .from("task_issues")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching issues:", error)
      throw error
    }

    console.log(`Found ${data?.length || 0} issues for task ${taskId}`)

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error getting issues:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function createIssue(data: IssueData) {
  const supabase = createAdminClient()

  try {
    const { data: newIssue, error } = await supabase
      .from("task_issues")
      .insert({
        task_id: data.task_id,
        title: data.title,
        description: data.description || null,
        status: data.status,
        fix: data.fix || null,
        code_snippet: data.code_snippet || null,
      })
      .select()

    if (error) throw error

    revalidatePath(`/tasks/${data.task_id}`)
    return { success: true, data: newIssue?.[0] || null }
  } catch (error) {
    console.error("Error creating issue:", error)
    return { success: false, error: error.message }
  }
}

export async function updateIssue(issueId: string, data: Partial<IssueData>) {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase
      .from("task_issues")
      .update({
        title: data.title,
        description: data.description,
        status: data.status,
        fix: data.fix,
        code_snippet: data.code_snippet,
      })
      .eq("id", issueId)

    if (error) throw error

    revalidatePath(`/tasks/${data.task_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating issue:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteIssue(issueId: string, taskId: string) {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase.from("task_issues").delete().eq("id", issueId)

    if (error) throw error

    revalidatePath(`/tasks/${taskId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting issue:", error)
    return { success: false, error: error.message }
  }
}
