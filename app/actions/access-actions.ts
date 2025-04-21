"use server"

import { createAdminClient } from "@/lib/supabase"

export async function checkProjectAccess(projectId: string, userId: string) {
  try {
    const supabase = createAdminClient()

    // First, check if the user is the project owner
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (projectError) {
      console.error("Error fetching project:", projectError)
      return {
        success: false,
        error: "Failed to check project access",
        isOwner: false,
        isCollaborator: false,
        permissions: null,
      }
    }

    if (!projectData) {
      return {
        success: false,
        error: "Project not found",
        isOwner: false,
        isCollaborator: false,
        permissions: null,
      }
    }

    // Check all possible owner column names
    const isOwner =
      (projectData?.user_id && projectData.user_id === userId) ||
      (projectData?.owner_id && projectData.owner_id === userId) ||
      (projectData?.provider_id && projectData.provider_id === userId)

    // If the user is the project owner, they have full access
    if (isOwner) {
      return {
        success: true,
        isOwner: true,
        isCollaborator: false,
        permissions: { view: true, edit: true, delete: true },
      }
    }

    // Check if the user is a collaborator
    const { data: collaborationData, error: collaborationError } = await supabase
      .from("provider_collaborations")
      .select("permissions")
      .eq("project_id", projectId)
      .eq("collaborator_id", userId)
      .eq("status", "active")
      .maybeSingle()

    if (collaborationError && collaborationError.code !== "PGRST116") {
      console.error("Error checking collaboration:", collaborationError)
      return {
        success: false,
        error: "Failed to check collaboration access",
        isOwner: false,
        isCollaborator: false,
        permissions: null,
      }
    }

    // User is a collaborator, return their permissions
    if (collaborationData) {
      return {
        success: true,
        isOwner: false,
        isCollaborator: true,
        permissions: collaborationData.permissions,
      }
    }

    // User is neither owner nor collaborator
    return {
      success: true,
      isOwner: false,
      isCollaborator: false,
      permissions: null,
    }
  } catch (error) {
    console.error("Error in checkProjectAccess:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
      isOwner: false,
      isCollaborator: false,
      permissions: null,
    }
  }
}
