"use server"

import { createAdminClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type TimelineEvent = {
  id?: string
  project_id: string
  title: string
  description?: string
  event_date: string
  event_type: string
  created_by: string
  created_at?: string
  updated_at?: string
}

// Get all timeline events for a project
export async function getTimelineEvents(projectId: string) {
  const supabase = createAdminClient()

  try {
    console.log("Fetching timeline events for project:", projectId)

    const { data, error } = await supabase
      .from("project_timeline_events")
      .select("*")
      .eq("project_id", projectId)
      .order("event_date", { ascending: true })

    if (error) {
      console.error("Error fetching timeline events:", error)
      throw error
    }

    console.log(`Found ${data?.length || 0} timeline events for project ${projectId}`)
    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error getting timeline events:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Create a new timeline event
export async function createTimelineEvent(data: TimelineEvent) {
  const supabase = createAdminClient()

  try {
    const { data: newEvent, error } = await supabase
      .from("project_timeline_events")
      .insert({
        project_id: data.project_id,
        title: data.title,
        description: data.description || null,
        event_date: data.event_date,
        event_type: data.event_type,
        created_by: data.created_by,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/projects/${data.project_id}`)
    return { success: true, data: newEvent }
  } catch (error) {
    console.error("Error creating timeline event:", error)
    return { success: false, error: error.message }
  }
}

// Update an existing timeline event
export async function updateTimelineEvent(eventId: string, data: Partial<TimelineEvent>) {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase
      .from("project_timeline_events")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    if (error) throw error

    revalidatePath(`/projects/${data.project_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating timeline event:", error)
    return { success: false, error: error.message }
  }
}

// Delete a timeline event
export async function deleteTimelineEvent(eventId: string, projectId: string) {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase.from("project_timeline_events").delete().eq("id", eventId)

    if (error) throw error

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting timeline event:", error)
    return { success: false, error: error.message }
  }
}
