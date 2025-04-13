"use server"

import { revalidatePath } from "next/cache"

export type SubtaskData = {
  id?: string
  title: string
  description?: string
  completed?: boolean
  task_id: string
}

export async function getSubtasks(taskId: string) {
  try {
    console.log("Fetching subtasks for task:", taskId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${taskId}/subtasks`
    console.log("Fetching subtasks from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error fetching subtasks: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    console.log(`Found ${data?.length || 0} subtasks for task ${taskId}`)
    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching subtasks:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch subtasks", data: [] }
  }
}

export async function createSubtask(data: SubtaskData) {
  try {
    console.log("Creating new subtask:", data)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${data.task_id}/subtasks`
    console.log("Creating subtask at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description || null,
        completed: data.completed || false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error creating subtask: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()

    revalidatePath(`/tasks/${data.task_id}`)
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error creating subtask:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create subtask" }
  }
}

export async function updateSubtask(subtaskId: string, data: Partial<SubtaskData>) {
  try {
    console.log("Updating subtask:", { subtaskId, data })

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/subtasks/${subtaskId}`
    console.log("Updating subtask at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error updating subtask: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()
    console.log("Subtask updated successfully:", responseData)

    revalidatePath(`/tasks/${data.task_id}`)
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error updating subtask:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update subtask" }
  }
}

export async function toggleSubtaskCompletion(subtaskId: string, completed: boolean) {
  try {
    console.log("Toggling subtask completion:", { subtaskId, completed })

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/subtasks/${subtaskId}`
    console.log("Updating subtask at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: completed,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error toggling subtask completion: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()
    console.log("Subtask completion toggled successfully:", responseData)

    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error toggling subtask completion:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to toggle subtask completion" }
  }
}

export async function deleteSubtask(subtaskId: string) {
  try {
    console.log("Deleting subtask:", subtaskId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/subtasks/${subtaskId}`
    console.log("Deleting subtask at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error deleting subtask: ${errorData.message || response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting subtask:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete subtask" }
  }
}
