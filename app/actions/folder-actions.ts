"use server"

import { revalidatePath } from "next/cache"

export type FolderData = {
  id?: string
  name: string
  description?: string
  color?: string
  created_at?: string
  updated_at?: string
  provider_id?: string
  project_id?: string
  parent_id?: string
}

export type FileData = {
  id?: string
  name: string
  type: string
  size: string
  modified: string
  folder_id: string
  path?: string
  created_at?: string
  updated_at?: string
}

// API base URL - replace with your actual Laravel API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

/**
 * Get all folders
 */
export async function getFolders(providerId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/folders?provider_id=${providerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if needed
        // "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch folders: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching folders:", error)
    throw error
  }
}

/**
 * Get a specific folder by ID
 */
export async function getFolder(folderId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if needed
        // "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch folder: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching folder ${folderId}:`, error)
    throw error
  }
}

/**
 * Create a new folder
 */
export async function createFolder(data: FolderData) {
  try {
    const response = await fetch(`${API_BASE_URL}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if needed
        // "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Failed to create folder: ${errorData.message || response.statusText}`)
    }

    const result = await response.json()
    revalidatePath("/files")
    return result
  } catch (error) {
    console.error("Error creating folder:", error)
    throw error
  }
}

/**
 * Update an existing folder
 */
export async function updateFolder(folderId: string, data: Partial<FolderData>) {
  try {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if needed
        // "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update folder: ${response.statusText}`)
    }

    const result = await response.json()
    revalidatePath("/files")
    revalidatePath(`/files/folders/${folderId}`)
    return result
  } catch (error) {
    console.error(`Error updating folder ${folderId}:`, error)
    throw error
  }
}

/**
 * Delete a folder
 */
export async function deleteFolder(folderId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if needed
        // "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete folder: ${response.statusText}`)
    }

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting folder ${folderId}:`, error)
    throw error
  }
}

/**
 * Get all files in a folder
 */
export async function getFolderFiles(folderId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}/files`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if needed
        // "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch folder files: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching files for folder ${folderId}:`, error)
    throw error
  }
}

/**
 * Upload a file to a folder
 */
export async function uploadFileToFolder(folderId: string, file: File) {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/folders/${folderId}/files`, {
      method: "POST",
      headers: {
        // Don't set Content-Type here, it will be set automatically with the boundary
        // Add any authentication headers if needed
        // "Authorization": `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`)
    }

    const result = await response.json()
    revalidatePath(`/files/folders/${folderId}`)
    return result
  } catch (error) {
    console.error(`Error uploading file to folder ${folderId}:`, error)
    throw error
  }
} 