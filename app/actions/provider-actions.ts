"use server"

import { revalidatePath } from "next/cache"

// Add a new function to check if a provider profile exists
export async function checkProviderExists(userId: string) {
  try {
    // Update to use path parameter instead of query parameter
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/by-user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Record not found
        return { success: false, exists: false }
      }
      throw new Error(`Error checking provider: ${response.statusText}`)
    }

    const data = await response.json()
    const hasProvider = data && data.provider && Array.isArray(data.provider) && data.provider.length > 0

    return { success: true, exists: hasProvider, data }
  } catch (error) {
    console.error("Error checking if provider exists:", error)
    return { success: false, error: error.message, exists: false }
  }
}

// Update the createProviderProfile function to handle more fields
export async function createProviderProfile(
  userId: string,
  data: {
    email: string
    full_name?: string
    provider_type_id?: string
    bio?: string
    custom_provider_type?: string
    phone?: string
    website?: string
    description?: string
  },
) {
  try {
    // Prepare the data for the API
    const providerData = {
      user_id: userId,
      email: data.email,
      name: data.full_name || null,
      provider_type_id: data.provider_type_id || null,
      bio: data.bio || data.description || null,
      custom_provider_type: data.custom_provider_type || null,
      phone: data.phone || null,
      website: data.website || null,
    }

    // Make the API request
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(providerData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error creating provider: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error creating/updating provider profile:", error)
    return { success: false, error: error.message }
  }
}

export async function getProviderProfile(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error getting provider: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error getting provider profile:", error)
    return { success: false, error: error.message }
  }
}

export async function updateProviderProfile(
  userId: string,
  data: {
    full_name?: string
    email?: string
    provider_type_id?: string
    bio?: string
    custom_provider_type?: string | null
  },
) {
  try {
    // Create an update object with only the fields that are provided
    const updateData: any = {}

    if (data.full_name !== undefined) updateData.name = data.full_name
    if (data.email !== undefined) updateData.email = data.email
    if (data.provider_type_id !== undefined) updateData.provider_type_id = data.provider_type_id
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.custom_provider_type !== undefined) updateData.custom_provider_type = data.custom_provider_type

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error updating provider: ${errorData.message || response.statusText}`)
    }

    revalidatePath("/dashboard")
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating provider profile:", error)
    return { success: false, error: error.message }
  }
}

export async function getProviderTypes() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/provider-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error getting provider types: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error getting provider types:", error)
    return { success: false, error: error.message }
  }
}
