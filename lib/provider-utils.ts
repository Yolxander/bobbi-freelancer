import { createAdminClient } from "@/lib/supabase"

// Update the isWebDeveloperProvider function to be more reliable

export async function isWebDeveloperProvider(userId: string) {
  try {
    const supabase = createAdminClient()

    // Direct query to check if the user is a web developer
    const { data, error } = await supabase
      .from("providers")
      .select(`
        provider_type_id,
        provider_types (
          name
        )
      `)
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error checking provider type:", error)
      return false
    }

    // Check if the provider type is "Web & Software Development"
    // Also log the result for debugging
    const isWebDev = data?.provider_types?.name === "Web & Software Development"
    console.log("Provider check result:", {
      userId,
      providerTypeId: data?.provider_type_id,
      providerTypeName: data?.provider_types?.name,
      isWebDev,
    })

    return isWebDev
  } catch (error) {
    console.error("Error checking provider type:", error)
    return false
  }
}

export function getGitHubRepoFromUrl(url: string) {
  try {
    if (!url) return null

    // Extract owner/repo from GitHub URL
    const githubRegex = /github\.com\/([^/]+)\/([^/]+)/
    const match = url.match(githubRegex)

    if (match && match.length >= 3) {
      return {
        owner: match[1],
        repo: match[2],
        fullName: `${match[1]}/${match[2]}`,
      }
    }

    return null
  } catch (error) {
    console.error("Error parsing GitHub URL:", error)
    return null
  }
}

// Add deployment-related functions
export async function createDeployment(
  taskId: string,
  environment: string,
  status: string,
  url?: string,
  version?: string,
) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("deployments")
      .insert({
        task_id: taskId,
        environment,
        status,
        url,
        version,
      })
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error creating deployment:", error)
    return { success: false, error: error.message }
  }
}

export async function getDeployments(taskId: string) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("deployments")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error getting deployments:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Add pull request-related functions
export async function createPullRequest(
  taskId: string,
  prNumber: string,
  title: string,
  status: string,
  url?: string,
  author?: string,
) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("pull_requests")
      .insert({
        task_id: taskId,
        pr_number: prNumber,
        title,
        status,
        url,
        author,
      })
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error creating pull request:", error)
    return { success: false, error: error.message }
  }
}

export async function getPullRequests(taskId: string) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("pull_requests")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error getting pull requests:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Add branch-related functions
export async function createBranch(
  taskId: string,
  name: string,
  lastCommit?: string,
  lastCommitAuthor?: string,
  lastCommitDate?: string,
) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("branches")
      .insert({
        task_id: taskId,
        name,
        last_commit: lastCommit,
        last_commit_author: lastCommitAuthor,
        last_commit_date: lastCommitDate,
      })
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error creating branch:", error)
    return { success: false, error: error.message }
  }
}

export async function getBranches(taskId: string) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("task_id", taskId)
      .order("name", { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error getting branches:", error)
    return { success: false, error: error.message, data: [] }
  }
}
