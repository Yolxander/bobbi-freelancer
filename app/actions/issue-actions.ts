"use server"

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
  try {
    console.log("Fetching issues for task:", taskId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${taskId}/issues`
    console.log("Fetching issues from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error fetching issues: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    console.log(`Found ${data?.length || 0} issues for task ${taskId}`)
    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error getting issues:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch issues", data: [] }
  }
}

export async function createIssue(data: IssueData) {
  try {
    console.log("Creating new issue:", data)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${data.task_id}/issues`
    console.log("Creating issue at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description || null,
        status: data.status || "open",
        fix: data.fix || null,
        code_snippet: data.code_snippet || null,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error creating issue: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()

    revalidatePath(`/tasks/${data.task_id}`)
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error creating issue:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create issue" }
  }
}

export async function updateIssue(issueId: string, data: Partial<IssueData>) {
  try {
    console.log("Updating issue:", { issueId, data })

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/issues/${issueId}`
    console.log("Updating issue at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        status: data.status,
        fix: data.fix,
        code_snippet: data.code_snippet,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error updating issue: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()
    console.log("Issue updated successfully:", responseData)

    revalidatePath(`/tasks/${data.task_id}`)
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error updating issue:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update issue" }
  }
}

export async function deleteIssue(issueId: string, taskId: string) {
  try {
    console.log("Deleting issue:", issueId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/issues/${issueId}`
    console.log("Deleting issue at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error deleting issue: ${errorData.message || response.statusText}`)
    }

    revalidatePath(`/tasks/${taskId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting issue:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete issue" }
  }
}
