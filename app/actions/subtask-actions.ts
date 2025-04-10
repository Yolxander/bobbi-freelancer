"use server"

import { createAdminClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type SubtaskData = {
  id?: string
  title: string
  description?: string
  status?: string
  completed?: boolean
  task_id: string
  provider_id: string
}

export async function getSubtasks(taskId: string) {
  const supabase = createAdminClient()

  try {
    console.log("Fetching subtasks for task:", taskId)

    const { data, error } = await supabase
      .from("subtasks")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching subtasks:", error)
      throw error
    }

    console.log(`Found ${data?.length || 0} subtasks for task ${taskId}`)
    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error getting subtasks:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getSubtask(subtaskId: string) {
  const supabase = createAdminClient()

  try {
    console.log("Fetching subtask with ID:", subtaskId)

    // First check if the subtask exists
    const { data: subtaskExists, error: checkError } = await supabase.from("subtasks").select("id").eq("id", subtaskId)

    if (checkError) {
      console.error("Error checking if subtask exists:", checkError)
      throw checkError
    }

    if (!subtaskExists || subtaskExists.length === 0) {
      console.log(`No subtask found with ID: ${subtaskId}`)
      return { success: false, error: "Subtask not found" }
    }

    // Now fetch the subtask
    const { data, error } = await supabase.from("subtasks").select("*").eq("id", subtaskId).limit(1)

    if (error) {
      console.error("Error fetching subtask details:", error)
      throw error
    }

    if (!data || data.length === 0) {
      return { success: false, error: "Subtask not found" }
    }

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error getting subtask:", error)
    return { success: false, error: error.message }
  }
}

export async function createSubtask(data: SubtaskData) {
  const supabase = createAdminClient()

  try {
    const { data: newSubtask, error } = await supabase
      .from("subtasks")
      .insert({
        title: data.title,
        description: data.description || null,
        status: data.status || "todo",
        completed: data.completed || false,
        task_id: data.task_id,
        provider_id: data.provider_id,
      })
      .select()

    if (error) throw error

    revalidatePath(`/tasks/${data.task_id}`)
    return { success: true, data: newSubtask?.[0] || null }
  } catch (error) {
    console.error("Error creating subtask:", error)
    return { success: false, error: error.message }
  }
}

export async function updateSubtask(subtaskId: string, data: Partial<SubtaskData>) {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase
      .from("subtasks")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subtaskId)

    if (error) throw error

    revalidatePath(`/tasks/${data.task_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating subtask:", error)
    return { success: false, error: error.message }
  }
}

// Update the toggleSubtaskCompletion function to update parent task progress
export async function toggleSubtaskCompletion(subtaskId: string, completed: boolean) {
  const supabase = createAdminClient()

  try {
    // First, get the subtask to find its parent task
    const { data: subtask, error: subtaskError } = await supabase
      .from("subtasks")
      .select("task_id")
      .eq("id", subtaskId)
      .single()

    if (subtaskError) throw subtaskError

    // Update the subtask completion status
    const { error } = await supabase
      .from("subtasks")
      .update({
        completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subtaskId)

    if (error) throw error

    // Check if all subtasks for this task are completed
    if (subtask?.task_id) {
      const { data: allSubtasks, error: subtasksError } = await supabase
        .from("subtasks")
        .select("completed")
        .eq("task_id", subtask.task_id)

      if (subtasksError) throw subtasksError

      // If there are subtasks and all are completed, mark the parent task as completed
      if (allSubtasks && allSubtasks.length > 0) {
        const allCompleted = allSubtasks.every((st) => st.completed)

        // Update the parent task status
        await supabase
          .from("tasks")
          .update({
            completed: allCompleted,
            status: allCompleted ? "completed" : "in-progress",
            updated_at: new Date().toISOString(),
          })
          .eq("id", subtask.task_id)

        // Revalidate the task page
        revalidatePath(`/tasks/${subtask.task_id}`)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error toggling subtask completion:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteSubtask(subtaskId: string) {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase.from("subtasks").delete().eq("id", subtaskId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error deleting subtask:", error)
    return { success: false, error: error.message }
  }
}
