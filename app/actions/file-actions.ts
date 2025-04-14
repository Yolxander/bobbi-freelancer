"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Types
export interface FileData {
  id: number
  name: string
  type: string
  size: string
  url: string
  folder_id: number
  created_at: string
  updated_at: string
  modified: string
}

// Get all files in a folder
export async function getFolderFiles(folderId: string): Promise<FileData[]> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${folderId}/files`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch files")
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching files:", error)
    throw error
  }
}

// Get a single file
export async function getFile(fileId: string): Promise<FileData> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch file")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching file:", error)
    throw error
  }
}

// Upload a file to a folder
export async function uploadFile(folderId: string, file: File): Promise<FileData> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      throw new Error("Authentication required")
    }

    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${folderId}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to upload file")
    }

    const data = await response.json()
    revalidatePath("/files")
    revalidatePath(`/files/folders/${folderId}`)
    return data.data
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

// Update a file
export async function updateFile(fileId: string, fileData: Partial<FileData>): Promise<FileData> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fileData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update file")
    }

    const data = await response.json()
    revalidatePath("/files")
    revalidatePath(`/files/folders/${data.data.folder_id}`)
    return data.data
  } catch (error) {
    console.error("Error updating file:", error)
    throw error
  }
}

// Delete a file
export async function deleteFile(fileId: string): Promise<void> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      throw new Error("Authentication required")
    }

    // First get the file to know which folder it belongs to
    const file = await getFile(fileId)
    const folderId = file.folder_id

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete file")
    }

    revalidatePath("/files")
    revalidatePath(`/files/folders/${folderId}`)
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

// Download a file
export async function downloadFile(fileId: string): Promise<Blob> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to download file")
    }

    return await response.blob()
  } catch (error) {
    console.error("Error downloading file:", error)
    throw error
  }
}

// Share a file (if implemented in the API)
export async function shareFile(fileId: string, email: string): Promise<void> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to share file")
    }

    revalidatePath("/files")
  } catch (error) {
    console.error("Error sharing file:", error)
    throw error
  }
} 