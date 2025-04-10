"use server"

import { revalidatePath } from "next/cache"

export type ProjectData = {
  id?: string
  name: string
  description?: string
  status: string
  client_id: string | null
  provider_id: string
  color?: string
  start_date?: string
  due_date?: string
}

// Dummy data for projects
const DUMMY_PROJECTS = [
  {
    id: "project-1",
    name: "Website Redesign",
    description: "Complete overhaul of company website with new branding",
    status: "In Progress",
    client_id: "client-1",
    provider_id: "provider-1",
    color: "bg-blue-100",
    start_date: "2023-01-15",
    due_date: "2023-03-30",
    client: "Acme Inc",
  },
  {
    id: "project-2",
    name: "Mobile App Development",
    description: "iOS and Android app for customer engagement",
    status: "Review",
    client_id: "client-2",
    provider_id: "provider-1",
    color: "bg-green-100",
    start_date: "2023-02-01",
    due_date: "2023-05-15",
    client: "TechStart",
  },
  {
    id: "project-3",
    name: "E-commerce Integration",
    description: "Integrate payment gateway and inventory management",
    status: "Completed",
    client_id: "client-1",
    provider_id: "provider-1",
    color: "bg-purple-100",
    start_date: "2022-11-10",
    due_date: "2023-01-20",
    client: "Acme Inc",
  },
  {
    id: "project-4",
    name: "CRM Implementation",
    description: "Custom CRM solution for sales team",
    status: "In Progress",
    client_id: "client-3",
    provider_id: "provider-1",
    color: "bg-amber-100",
    start_date: "2023-03-01",
    due_date: "2023-06-30",
    client: "Global Solutions",
  },
]

export async function getProjects(providerId: string, clientId?: string) {
  try {
    console.log("Fetching projects for provider:", providerId, clientId ? `and client: ${clientId}` : "")

    // Construct the API URL based on whether we're fetching by client or not
    let apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?provider_id=${providerId}`
    if (clientId) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${clientId}/projects`
    }

    console.log("Fetching projects from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch projects:", response.status, response.statusText)
      // Return empty array instead of throwing error to prevent page from breaking
      return { success: true, data: [] }
    }

    const data = await response.json()
    
    // Ensure we always return an array
    return { success: true, data: Array.isArray(data) ? data : [] }
  } catch (error) {
    console.error("Error getting projects:", error)
    // Return empty array instead of error to prevent page from breaking
    return { success: true, data: [] }
  }
}

export async function getProject(projectId: string) {
  // Handle special case for "new" route
  if (projectId === "new") {
    console.log("Detected 'new' route, returning empty project data")
    return { success: false, error: "This is the new project page" }
  }

  try {
    console.log("Fetching project with ID:", projectId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}`
    console.log("Fetching project from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch project:", response.status, response.statusText)
      return { success: false, error: "Project not found" }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error getting project:", error)
    return { success: false, error: "Failed to fetch project" }
  }
}

export async function createProject(data: ProjectData) {
  try {
    console.log("Creating new project:", data)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`
    console.log("Creating project at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error creating project: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()

    revalidatePath("/dashboard")
    revalidatePath("/projects")
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create project" }
  }
}

export async function updateProject(projectId: string, data: Partial<ProjectData>) {
  try {
    console.log("Updating project:", projectId, data)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}`
    console.log("Updating project at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error updating project: ${errorData.message || response.statusText}`)
    }

    revalidatePath("/dashboard")
    revalidatePath("/projects")
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update project" }
  }
}

export async function deleteProject(projectId: string) {
  try {
    console.log("Deleting project:", projectId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}`
    console.log("Deleting project at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error deleting project: ${errorData.message || response.statusText}`)
    }

    revalidatePath("/dashboard")
    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete project" }
  }
}
