"use server"

import { revalidatePath } from "next/cache"

// Types
export interface CalendarEvent {
  id: number
  title: string
  client_id: number
  project_id: number
  client_name?: string
  project_name?: string
  date: string
  start_time: string
  end_time: string
  location: string
  attendees: number
  color: string
  created_at?: string
  updated_at?: string
}

export interface CalendarEventInput {
  title: string
  client_id: number
  project_id: number
  date: string
  start_time: string
  end_time: string
  location: string
  attendees: number
  color: string
}

// Helper function to get API URL
const getApiUrl = (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"
  return `${baseUrl}${endpoint}`
}

// Helper function for API requests
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }
  
  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers,
    cache: "no-store",
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API error: ${response.status}`)
  }
  
  return response.json()
}

/**
 * Get all calendar events
 */
export async function getCalendarEvents() {
  try {
    const data = await fetchApi("/calendar-events")
    return { data, error: null }
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return { data: null, error: error instanceof Error ? error.message : "Failed to fetch calendar events" }
  }
}

/**
 * Get a specific calendar event by ID
 */
export async function getCalendarEvent(id: number) {
  try {
    const data = await fetchApi(`/calendar-events/${id}`)
    return { data, error: null }
  } catch (error) {
    console.error(`Error fetching calendar event ${id}:`, error)
    return { data: null, error: error instanceof Error ? error.message : "Failed to fetch calendar event" }
  }
}

/**
 * Create a new calendar event
 */
export async function createCalendarEvent(event: CalendarEventInput) {
  try {
    const data = await fetchApi("/calendar-events", {
      method: "POST",
      body: JSON.stringify(event),
    })
    revalidatePath("/calendar")
    return { data, error: null }
  } catch (error) {
    console.error("Error creating calendar event:", error)
    return { data: null, error: error instanceof Error ? error.message : "Failed to create calendar event" }
  }
}

/**
 * Update an existing calendar event
 */
export async function updateCalendarEvent(id: number, event: Partial<CalendarEventInput>) {
  try {
    const data = await fetchApi(`/calendar-events/${id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    })
    revalidatePath("/calendar")
    return { data, error: null }
  } catch (error) {
    console.error(`Error updating calendar event ${id}:`, error)
    return { data: null, error: error instanceof Error ? error.message : "Failed to update calendar event" }
  }
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(id: number) {
  try {
    await fetchApi(`/calendar-events/${id}`, {
      method: "DELETE",
    })
    revalidatePath("/calendar")
    return { success: true, error: null }
  } catch (error) {
    console.error(`Error deleting calendar event ${id}:`, error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete calendar event" }
  }
}

/**
 * Get calendar events for a specific date range
 */
export async function getCalendarEventsByDateRange(startDate: string, endDate: string) {
  try {
    const data = await fetchApi(`/calendar-events?start_date=${startDate}&end_date=${endDate}`)
    return { data, error: null }
  } catch (error) {
    console.error("Error fetching calendar events by date range:", error)
    return { data: null, error: error instanceof Error ? error.message : "Failed to fetch calendar events" }
  }
}

/**
 * Get calendar events for a specific client
 */
export async function getCalendarEventsByClient(clientId: number) {
  try {
    const data = await fetchApi(`/calendar-events?client_id=${clientId}`)
    return { data, error: null }
  } catch (error) {
    console.error(`Error fetching calendar events for client ${clientId}:`, error)
    return { data: null, error: error instanceof Error ? error.message : "Failed to fetch calendar events" }
  }
}

/**
 * Get calendar events for a specific project
 */
export async function getCalendarEventsByProject(projectId: number) {
  try {
    const data = await fetchApi(`/calendar-events?project_id=${projectId}`)
    return { data, error: null }
  } catch (error) {
    console.error(`Error fetching calendar events for project ${projectId}:`, error)
    return { data: null, error: error instanceof Error ? error.message : "Failed to fetch calendar events" }
  }
} 