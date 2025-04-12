"use server"

import { revalidatePath } from "next/cache"

export type TaskData = {
  id?: string
  title: string
  description?: string
  status: string
  priority?: string
  category?: string
  due_date?: string
  project_id: string
  provider_id: string
  completed?: boolean
  github_repo?: string
  tech_stack?: string
  code_snippet?: string
}

// Dummy data for tasks
const DUMMY_TASKS = [
  {
    id: "task-1",
    title: "Design Homepage Mockup",
    description: "Create wireframes and visual design for the homepage",
    status: "todo",
    priority: "high",
    category: "design",
    due_date: "2023-02-15",
    project_id: "project-1",
    provider_id: "provider-1",
    completed: false,
    project: "Website Redesign",
    client: "Acme Inc",
    projects: {
      name: "Website Redesign",
      client_id: "client-1",
      clients: {
        name: "Acme Inc",
      },
    },
  },
  {
    id: "task-2",
    title: "Implement User Authentication",
    description: "Set up secure login and registration system",
    status: "in-progress",
    priority: "medium",
    category: "development",
    due_date: "2023-02-28",
    project_id: "project-1",
    provider_id: "provider-1",
    completed: false,
    project: "Website Redesign",
    client: "Acme Inc",
    projects: {
      name: "Website Redesign",
      client_id: "client-1",
      clients: {
        name: "Acme Inc",
      },
    },
  },
  {
    id: "task-3",
    title: "API Integration",
    description: "Connect mobile app to backend services",
    status: "completed",
    priority: "high",
    category: "development",
    due_date: "2023-03-10",
    project_id: "project-2",
    provider_id: "provider-1",
    completed: true,
    project: "Mobile App Development",
    client: "TechStart",
    projects: {
      name: "Mobile App Development",
      client_id: "client-2",
      clients: {
        name: "TechStart",
      },
    },
  },
  {
    id: "task-4",
    title: "Database Schema Design",
    description: "Design efficient database structure for CRM",
    status: "todo",
    priority: "high",
    category: "planning",
    due_date: "2023-03-20",
    project_id: "project-4",
    provider_id: "provider-1",
    completed: false,
    project: "CRM Implementation",
    client: "Global Solutions",
    projects: {
      name: "CRM Implementation",
      client_id: "client-3",
      clients: {
        name: "Global Solutions",
      },
    },
  },
  {
    id: "task-5",
    title: "Payment Gateway Integration",
    description: "Implement Stripe and PayPal payment options",
    status: "completed",
    priority: "high",
    category: "development",
    due_date: "2023-01-05",
    project_id: "project-3",
    provider_id: "provider-1",
    completed: true,
    project: "E-commerce Integration",
    client: "Acme Inc",
    projects: {
      name: "E-commerce Integration",
      client_id: "client-1",
      clients: {
        name: "Acme Inc",
      },
    },
  },
]

export async function getTasks(providerId: string, projectId?: string) {
  try {
    console.log("Fetching tasks for provider:", providerId, projectId ? `and project: ${projectId}` : "")

    // Filter tasks based on provider ID and optionally project ID
    let filteredTasks = DUMMY_TASKS.filter((task) => task.provider_id === providerId || providerId === "5")

    if (projectId) {
      filteredTasks = filteredTasks.filter((task) => task.project_id === projectId)
    }

    // Transform the data to include project and client names
    const transformedData = filteredTasks.map((task) => ({
      ...task,
      project: task.projects?.name || "Unknown Project",
      client: task.projects?.clients?.name || "Unknown Client",
    }))

    return { success: true, data: transformedData }
  } catch (error) {
    console.error("Error getting tasks:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getTask(taskId: string) {
  try {
    console.log("Fetching task with ID:", taskId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${taskId}`
    console.log("Fetching task at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error fetching task: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()

    revalidatePath("/dashboard")
    revalidatePath("/tasks")
    revalidatePath(`/tasks/${taskId}`)
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error fetching task:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch task" }
  }
}

export async function createTask(data: TaskData) {
  try {
    console.log("Creating new task:", data)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks`
    console.log("Creating task at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description || null,
        status: data.status || "todo",
        priority: data.priority || "medium",
        category: data.category || "work",
        due_date: data.due_date || null,
        project_id: data.project_id,
        provider_id: data.provider_id,
        completed: data.completed || false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error creating task: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()

    revalidatePath("/dashboard")
    revalidatePath("/tasks")
    revalidatePath(`/projects/${data.project_id}`)
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error creating task:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create task" }
  }
}

export async function updateTask(taskId: string, data: Partial<TaskData>) {
  try {
    console.log("Updating task:", { taskId, data });

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${taskId}`;
    console.log("Updating task at:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description || null,
        due_date: data.due_date || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error updating task: ${errorData.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Task updated successfully:", responseData);

    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath(`/tasks/${taskId}`);
    if (data.project_id) {
      revalidatePath(`/projects/${data.project_id}`);
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Error updating task:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update task" 
    };
  }
}

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
  try {
    // In a real implementation, this would update the task completion status
    // and potentially update the parent project status
    // For now, we'll just return success

    revalidatePath("/dashboard")
    revalidatePath("/tasks")
    revalidatePath(`/tasks/${taskId}`)
    return { success: true }
  } catch (error) {
    console.error("Error toggling task completion:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteTask(taskId: string) {
  try {
    // In a real implementation, this would delete the task and its subtasks
    // For now, we'll just return success

    revalidatePath("/dashboard")
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: error.message }
  }
}
