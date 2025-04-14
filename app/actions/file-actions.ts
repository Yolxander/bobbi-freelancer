"use server"

import { revalidatePath } from "next/cache"

export type FileData = {
  id?: string
  name: string
  type: string
  size: string
  url: string
  folder_id: string
  provider_id: string
  modified: string
  created_at?: string
  updated_at?: string
}

export async function getFiles(folderId: string) {
  try {
    console.log("Fetching files for folder:", folderId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/folders/${folderId}/files`
    console.log("Fetching files from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch files:", response.status, response.statusText)
      // Return empty array instead of throwing error to prevent page from breaking
      return { success: true, data: [] }
    }

    const data = await response.json()
    
    // Ensure we always return an array
    return { success: true, data: Array.isArray(data) ? data : [] }
  } catch (error) {
    console.error("Error getting files:", error)
    // Return empty array instead of error to prevent page from breaking
    return { success: true, data: [] }
  }
}

export async function getFile(fileId: string) {
  try {
    console.log("Fetching file with ID:", fileId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}`
    console.log("Fetching file from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch file:", response.status, response.statusText)
      return { success: false, error: "File not found" }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error getting file:", error)
    return { success: false, error: "Failed to fetch file" }
  }
}

export async function createFile(folderId: string, fileData: FormData) {
  try {
    console.log("Creating new file in folder:", folderId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/folders/${folderId}/files`
    console.log("Creating file at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      body: fileData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error creating file: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()

    revalidatePath(`/files/folders/${folderId}`)
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error creating file:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create file" }
  }
}

export async function updateFile(fileId: string, data: Partial<FileData>) {
  try {
    console.log("Updating file:", fileId, data)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}`
    console.log("Updating file at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error updating file: ${errorData.message || response.statusText}`)
    }

    revalidatePath(`/files/folders/${data.folder_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating file:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update file" }
  }
}

export async function deleteFile(fileId: string, folderId: string) {
  try {
    console.log("Deleting file:", fileId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}`
    console.log("Deleting file at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error deleting file: ${errorData.message || response.statusText}`)
    }

    revalidatePath(`/files/folders/${folderId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete file" }
  }
}

export async function downloadFile(fileId: string) {
  try {
    console.log("Downloading file:", fileId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}/download`
    console.log("Downloading file from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Error downloading file: ${errorData.message || response.statusText}`)
    }

    // Get the file blob
    const blob = await response.blob()
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob)
    
    // Create a temporary link element
    const a = document.createElement('a')
    a.href = url
    a.download = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'downloaded-file'
    
    // Append to the document, click it, and remove it
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    return { success: true }
  } catch (error) {
    console.error("Error downloading file:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to download file" }
  }
}

export async function getAllProviderFiles(providerId: string) {
  try {
    console.log("Fetching all files for provider:", providerId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${providerId}/files`
    console.log("Fetching files from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch provider files:", response.status, response.statusText)
      // Return empty array instead of throwing error to prevent page from breaking
      return { success: true, data: [] }
    }

    const data = await response.json()
    
    // Ensure we always return an array
    return { success: true, data: Array.isArray(data) ? data : [] }
  } catch (error) {
    console.error("Error getting provider files:", error)
    // Return empty array instead of error to prevent page from breaking
    return { success: true, data: [] }
  }
} 