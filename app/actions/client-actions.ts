"use server"

import { revalidatePath } from "next/cache"

export type ClientData = {
  id?: string
  name: string
  email?: string
  phone?: string
  address?: string
  description?: string
  provider_id: string
  user_id?: string
}

export async function getClients(providerId: string) {
  try {
    console.log("Fetching clients for provider:", providerId)

    // Validate provider ID to prevent API calls with user ID
    if (!providerId) {
      console.error("No provider ID provided to getClients function")
      return { success: false, error: "No provider ID provided", data: [] }
    }

    // Construct the correct API endpoint
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients?provider_id=${providerId}`

    // Log the full fetch URL to verify it's correct
    console.log("Fetching clients from:", apiUrl)

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch clients:", response.status, response.statusText)
      throw new Error(`Failed to fetch clients: ${response.statusText}`)
    }

    // Log the raw response text
    const rawResponse = await response.text()
    console.log("Raw API response:", rawResponse)

    let data
    try {
      data = JSON.parse(rawResponse)
      console.log("Parsed JSON data:", data)
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError)
      return { success: false, error: "Error parsing JSON response", data: [] }
    }

    if (!Array.isArray(data)) {
      console.error("API response is not an array:", data)
      return { success: false, error: "API response is not an array", data: [] }
    }

    return { success: true, data: data }
  } catch (error) {
    console.error("Error getting clients:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getClient(clientId: string) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${clientId}`
    console.log("Fetching client from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch client: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data: data }
  } catch (error) {
    console.error("Error getting client:", error)
    return { success: false, error: error.message }
  }
}

export async function createClient(data: ClientData) {
  try {
    // Validate that we have a provider_id and it's not a user_id
    if (!data.provider_id) {
      console.error("No provider_id provided to createClient function")
      return { success: false, error: "No provider ID provided" }
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients`
    console.log("Creating client at:", apiUrl)
    console.log("With provider ID:", data.provider_id)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error creating client: ${errorData.message || response.statusText}`)
    }

    const responseData = await response.json()

    revalidatePath("/dashboard")
    return { success: true, data: responseData }
  } catch (error) {
    console.error("Error creating client:", error)
    return { success: false, error: error.message }
  }
}

export async function updateClient(clientId: string, data: Partial<ClientData>) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${clientId}`
    console.log("Updating client at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error updating client: ${errorData.message || response.statusText}`)
    }

    revalidatePath("/dashboard")
    revalidatePath(`/clients/${clientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating client:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteClient(clientId: string) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${clientId}`
    console.log("Deleting client at:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error deleting client: ${errorData.message || response.statusText}`)
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting client:", error)
    return { success: false, error: error.message }
  }
}
