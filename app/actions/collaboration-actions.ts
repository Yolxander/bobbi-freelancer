"use server"

import { createAdminClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Types for collaborations
export type CollaborationData = {
  id?: string
  project_id: string
  owner_id: string
  collaborator_id: string
  status?: string
  role?: string
  permissions?: {
    edit: boolean
    delete: boolean
    invite: boolean
  }
}

export type CollaborationInviteData = {
  project_id: string
  sender_id: string
  recipient_id: string
  message?: string
  role?: string
  permissions?: {
    edit: boolean
    delete: boolean
    invite: boolean
  }
}

// Search for providers to collaborate with
export async function searchProviders(query: string, currentUserId: string) {
  const supabase = createAdminClient()

  try {
    if (!query || query.length < 2) {
      return { success: true, data: [] }
    }

    // Search by name or email, excluding the current user
    const { data, error } = await supabase
      .from("providers")
      .select(`
        id,
        full_name,
        email,
        provider_type:provider_type_id (
          name
        ),
        custom_provider_type
      `)
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .neq("id", currentUserId)
      .limit(10)

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error searching providers:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Send a collaboration invitation
export async function sendCollaborationInvite(data: CollaborationInviteData) {
  const supabase = createAdminClient()

  try {
    // Check if an invitation already exists
    const { data: existingInvite, error: checkError } = await supabase
      .from("collaboration_invitations")
      .select("id, status")
      .eq("project_id", data.project_id)
      .eq("recipient_id", data.recipient_id)
      .eq("status", "pending")
      .maybeSingle()

    if (checkError) throw checkError

    if (existingInvite) {
      return {
        success: false,
        error: "An invitation has already been sent to this provider",
      }
    }

    // Create the invitation
    const { data: invitation, error } = await supabase
      .from("collaboration_invitations")
      .insert({
        project_id: data.project_id,
        sender_id: data.sender_id,
        recipient_id: data.recipient_id,
        message: data.message || null,
        role: data.role || "collaborator",
        permissions: data.permissions || { edit: true, delete: false, invite: false },
      })
      .select()
      .single()

    if (error) throw error

    // Create a notification for the recipient with the invitation ID
    await createCollaborationNotification(
      data.recipient_id,
      "collaboration_invite",
      data.project_id,
      data.sender_id,
      invitation.id, // Pass the invitation ID
    )

    return { success: true, data: invitation }
  } catch (error) {
    console.error("Error sending collaboration invite:", error)
    return { success: false, error: error.message }
  }
}

// Get pending invitations for a provider
export async function getCollaborationInvites(providerId: string) {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase
      .from("collaboration_invitations")
      .select(`
        id,
        project_id,
        sender_id,
        message,
        status,
        role,
        permissions,
        created_at,
        expires_at,
        projects (
          name
        ),
        providers!collaboration_invitations_sender_id_fkey (
          full_name,
          email
        )
      `)
      .eq("recipient_id", providerId)
      .eq("status", "pending")
      .gt("expires_at", "now()")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error getting collaboration invites:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Accept a collaboration invitation
export async function acceptCollaborationInvite(inviteId: string, providerId: string) {
  const supabase = createAdminClient()

  try {
    // Get the invitation details
    const { data: invite, error: getError } = await supabase
      .from("collaboration_invitations")
      .select("*")
      .eq("id", inviteId)
      .eq("recipient_id", providerId)
      .single()

    if (getError) throw getError

    if (!invite) {
      return { success: false, error: "Invitation not found" }
    }

    if (invite.status !== "pending") {
      return { success: false, error: "Invitation has already been processed" }
    }

    // Start a transaction
    const { error: transactionError } = await supabase.rpc("accept_collaboration_invite", {
      invite_id: inviteId,
      provider_id: providerId,
    })

    if (transactionError) throw transactionError

    // Create a notification for the sender
    await createCollaborationNotification(invite.sender_id, "collaboration_accepted", invite.project_id, providerId)

    revalidatePath(`/projects/${invite.project_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error accepting collaboration invite:", error)
    return { success: false, error: error.message }
  }
}

// Reject a collaboration invitation
export async function rejectCollaborationInvite(inviteId: string, providerId: string) {
  const supabase = createAdminClient()

  try {
    // Get the invitation details first
    const { data: invite, error: getError } = await supabase
      .from("collaboration_invitations")
      .select("*")
      .eq("id", inviteId)
      .eq("recipient_id", providerId)
      .single()

    if (getError) throw getError

    // Update the invitation status
    const { error } = await supabase
      .from("collaboration_invitations")
      .update({ status: "rejected" })
      .eq("id", inviteId)
      .eq("recipient_id", providerId)

    if (error) throw error

    // Create a notification for the sender
    await createCollaborationNotification(invite.sender_id, "collaboration_rejected", invite.project_id, providerId)

    return { success: true }
  } catch (error) {
    console.error("Error rejecting collaboration invite:", error)
    return { success: false, error: error.message }
  }
}

// Get collaborators for a project
export async function getProjectCollaborators(projectId: string) {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase
      .from("provider_collaborations")
      .select(`
        id,
        owner_id,
        collaborator_id,
        status,
        role,
        permissions,
        created_at,
        providers!provider_collaborations_collaborator_id_fkey (
          id,
          full_name,
          email,
          provider_type:provider_type_id (
            name
          ),
          custom_provider_type
        )
      `)
      .eq("project_id", projectId)
      .eq("status", "active")

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error getting project collaborators:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Remove a collaborator from a project
export async function removeCollaborator(collaborationId: string, ownerId: string) {
  const supabase = createAdminClient()

  try {
    // First check if the user is the owner
    const { data: collaboration, error: checkError } = await supabase
      .from("provider_collaborations")
      .select("*")
      .eq("id", collaborationId)
      .eq("owner_id", ownerId)
      .single()

    if (checkError) throw checkError

    if (!collaboration) {
      return { success: false, error: "You don't have permission to remove this collaborator" }
    }

    // Update the collaboration status
    const { error } = await supabase
      .from("provider_collaborations")
      .update({ status: "removed", updated_at: new Date().toISOString() })
      .eq("id", collaborationId)

    if (error) throw error

    // Create a notification for the collaborator
    await createCollaborationNotification(
      collaboration.collaborator_id,
      "collaboration_removed",
      collaboration.project_id,
      ownerId,
    )

    revalidatePath(`/projects/${collaboration.project_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error removing collaborator:", error)
    return { success: false, error: error.message }
  }
}

// Check if a user has access to a project (either as owner or collaborator)
export async function checkProjectAccess(projectId: string, userId: string) {
  try {
    // First, check if the user is the project owner
    const supabase = createAdminClient()

    // Get the project and check all possible owner column names
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

    // Check all possible owner column names
    const isOwner =
      (projectData.user_id && projectData.user_id === userId) ||
      (projectData.owner_id && projectData.owner_id === userId) ||
      (projectData.provider_id && projectData.provider_id === userId)

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
      .from("project_collaborations")
      .select("permissions")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .maybeSingle()

    // If there's an error but it's not a "not found" error
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

// Helper function to create a notification
async function createCollaborationNotification(
  providerId: string,
  type: string,
  projectId: string,
  actorId: string,
  invitationId?: string,
) {
  const supabase = createAdminClient()

  try {
    // Get project and actor details
    const { data: project } = await supabase.from("projects").select("name").eq("id", projectId).single()
    const { data: actor } = await supabase.from("providers").select("full_name").eq("id", actorId).single()

    const data = {
      project_id: projectId,
      project_name: project.name,
      actor_id: actorId,
      actor_name: actor.full_name,
      invitation_id: invitationId, // Include the invitation ID if provided
    }

    let title = ""
    let message = ""

    switch (type) {
      case "collaboration_invite":
        title = "New Collaboration Invitation"
        message = `${actor.full_name} has invited you to collaborate on project "${project.name}"`
        break
      case "collaboration_accepted":
        title = "Collaboration Invitation Accepted"
        message = `${actor.full_name} has accepted your invitation to collaborate on project "${project.name}"`
        break
      case "collaboration_rejected":
        title = "Collaboration Invitation Declined"
        message = `${actor.full_name} has declined your invitation to collaborate on project "${project.name}"`
        break
      case "collaboration_removed":
        title = "Removed from Collaboration"
        message = `${actor.full_name} has removed you from project "${project.name}"`
        break
      case "project_accessed":
        title = "Project Accessed"
        message = `${actor.full_name} has accessed your project "${project.name}"`
        break
    }

    await supabase.from("provider_notifications").insert({
      provider_id: providerId,
      type,
      title,
      message,
      data,
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { success: false, error: error.message }
  }
}

// Notify project owner when a collaborator accesses their project
export async function notifyProjectAccess(projectId: string, collaboratorId: string) {
  const supabase = createAdminClient()

  try {
    // Get the project owner
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (projectError) throw projectError

    // Determine the owner ID from available columns
    const ownerId = project.provider_id || project.user_id || project.owner_id

    // Don't notify if the owner is accessing their own project
    if (ownerId === collaboratorId) {
      return { success: true }
    }

    // Create a notification for the project owner
    await createCollaborationNotification(ownerId, "project_accessed", projectId, collaboratorId)

    return { success: true }
  } catch (error) {
    console.error("Error notifying project access:", error)
    return { success: false, error: error.message }
  }
}

// Get notifications for a provider
export async function getProviderNotifications(providerId: string) {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase
      .from("provider_notifications")
      .select("*")
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error getting provider notifications:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId: string, providerId: string) {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase
      .from("provider_notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("provider_id", providerId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: error.message }
  }
}
