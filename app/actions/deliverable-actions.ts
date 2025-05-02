export interface Deliverable {
  id: string
  title: string
  description: string | null
  status: string | null
  order: number
  proposal_id: string
  proposal_content_id: string
  created_at: string
  updated_at: string
  timeline_start: string
  timeline_end: string
  tasks: any[]
  tasks_count: number
  proposal_content: {
    id: string
    proposal_id: string
    scope_of_work: string
    client_responsibilities: string
    deliverables: string
    payment_schedule: string
    pricing: string
    terms_and_conditions: string
    signature: string
    created_at: string
    updated_at: string
    proposal: {
      id: string
      title: string
      status: string
      current_version: number
      is_template: boolean
      template_id: string | null
      project_id: string
      client_id: string
      created_at: string
      updated_at: string
      project: {
        id: string
        name: string
        description: string
        status: string
        start_date: string
        end_date: string | null
        created_at: string
        updated_at: string
      }
    }
  }
}

export interface Task {
  id: string
  title: string
  description: string
  status: string
  due_date: string
  deliverable_id: string
  created_at: string
  updated_at: string
}

export async function getDeliverables(providerId: string): Promise<Deliverable[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    const response = await fetch(`${baseUrl}/providers/${providerId}/deliverables`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch deliverables')
    }

    const data = await response.json()
    console.log('API Response:', data)
    console.log('Response Type:', typeof data)
    console.log('Is Array:', Array.isArray(data))
    
    // Ensure we always return an array
    if (!Array.isArray(data)) {
      console.error('API response is not an array:', data)
      return []
    }

    return data
  } catch (error) {
    console.error("Error fetching deliverables:", error)
    // Return empty array instead of throwing error to prevent page from breaking
    return []
  }
}

export async function generateTasks(providerId: string, deliverableId: string): Promise<Task[]> {
  console.log('providerId', providerId)
  console.log('deliverableId', deliverableId)
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    const response = await fetch(`${baseUrl}/providers/${providerId}/deliverables/${deliverableId}/generate-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to generate tasks')
    }

    const data = await response.json()
    console.log('API Response:', data)
    console.log('Response Type:', typeof data)
    console.log('Is Array:', Array.isArray(data))
    
    // Ensure we always return an array
    if (!Array.isArray(data)) {
      console.error('API response is not an array:', data)
      return []
    }

    return data
  } catch (error) {
    console.error("Error generating tasks:", error)
    // Return empty array instead of throwing error to prevent page from breaking
    return []
  }
} 