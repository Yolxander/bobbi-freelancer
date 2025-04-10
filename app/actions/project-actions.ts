"use server"

import { revalidatePath } from "next/cache"

export type ProjectData = {
  id?: string
  name: string
  description?: string
  status: string
  client_id: string
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

    // Filter projects based on provider ID and optionally client ID
    let filteredProjects = DUMMY_PROJECTS.filter((project) => project.provider_id === providerId || providerId === "5")

    if (clientId) {
      filteredProjects = filteredProjects.filter((project) => project.client_id === clientId)
    }

    return { success: true, data: filteredProjects }
  } catch (error) {
    console.error("Error getting projects:", error)
    return { success: false, error: error.message, data: [] }
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

    // Find project in dummy data
    const project = DUMMY_PROJECTS.find((p) => p.id === projectId)

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    return {
      success: true,
      data: {
        ...project,
        client: project.client_id ? project.client : "Personal",
      },
    }
  } catch (error) {
    console.error("Error getting project:", error)
    return { success: false, error: error.message }
  }
}

export async function createProject(data: ProjectData) {
  try {
    // Create a new project with a unique ID
    const newProject = {
      id: `project-${Date.now()}`,
      name: data.name,
      description: data.description || null,
      status: data.status,
      client_id: data.client_id || null,
      provider_id: data.provider_id,
      color: data.color || "bg-blue-100",
      start_date: data.start_date || new Date().toISOString(),
      due_date: data.due_date || null,
      client: data.client_id ? "Client Name" : "Personal", // This would be populated from the client table
    }

    // In a real implementation, this would be added to the database
    // For now, we'll just return the new project

    revalidatePath("/dashboard")
    revalidatePath("/projects")
    return { success: true, data: newProject }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, error: error.message }
  }
}

export async function updateProject(projectId: string, data: Partial<ProjectData>) {
  try {
    // In a real implementation, this would update the project in the database
    // For now, we'll just return success

    revalidatePath("/dashboard")
    revalidatePath("/projects")
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteProject(projectId: string) {
  try {
    // In a real implementation, this would delete the project from the database
    // For now, we'll just return success

    revalidatePath("/dashboard")
    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: error.message }
  }
}
