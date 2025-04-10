"use server"

import { createAdminClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
// Import the sendTeamMemberInvitation function
import { sendTeamMemberInvitation } from "./email-actions"

export type TeamMemberData = {
  id?: string
  client_id?: string | null
  user_id: string
  email: string
  name: string
  role?: string
  phone?: string
  is_primary?: boolean
  status?: string
}

export type ProjectTeamMemberData = {
  id?: string
  project_id: string
  team_member_id: string
  added_by: string
}

// Get team members for a specific client
export async function getClientTeamMembers(clientId: string) {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase
      .from("client_team_member")
      .select("*")
      .eq("client_id", clientId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error getting client team members:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Get team members for a specific project
export async function getProjectTeamMembers(projectId: string) {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase
      .from("project_team_members")
      .select(`
        id,
        project_id,
        team_member_id,
        added_by,
        created_at,
        client_team_member (
          id,
          name,
          email,
          role,
          phone,
          is_primary,
          status
        )
      `)
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })

    if (error) throw error

    // Transform the data to make it easier to work with
    const transformedData =
      data?.map((item) => ({
        id: item.id,
        project_id: item.project_id,
        team_member_id: item.team_member_id,
        added_by: item.added_by,
        created_at: item.created_at,
        ...item.client_team_member,
      })) || []

    return { success: true, data: transformedData }
  } catch (error) {
    console.error("Error getting project team members:", error)
    return { success: false, error: error.message, data: [] }
  }
}

// Create a new team member
export async function createTeamMember(data: TeamMemberData) {
  const supabase = createAdminClient()

  try {
    const { data: newTeamMember, error } = await supabase
      .from("client_team_member")
      .insert({
        client_id: data.client_id || null,
        user_id: data.user_id,
        email: data.email,
        name: data.name,
        role: data.role || null,
        phone: data.phone || null,
        is_primary: data.is_primary || false,
        status: data.status || "active",
      })
      .select()
      .single()

    if (error) throw error

    if (data.client_id) {
      revalidatePath(`/clients/${data.client_id}`)
    }

    return { success: true, data: newTeamMember }
  } catch (error) {
    console.error("Error creating team member:", error)
    return { success: false, error: error.message }
  }
}

// Update the addTeamMemberToProject function to handle errors better
export async function addTeamMemberToProject(data: ProjectTeamMemberData) {
  const supabase = createAdminClient()

  try {
    const { data: newProjectTeamMember, error } = await supabase
      .from("project_team_members")
      .insert({
        project_id: data.project_id,
        team_member_id: data.team_member_id,
        added_by: data.added_by,
      })
      .select()
      .single()

    if (error) throw error

    // Get the team member details
    const { data: teamMember, error: teamMemberError } = await supabase
      .from("client_team_member")
      .select("*")
      .eq("id", data.team_member_id)
      .single()

    if (teamMemberError) {
      console.error("Error fetching team member details:", teamMemberError)
      // Continue anyway since we've already added the team member to the project
    }

    // Get the project details
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("name")
      .eq("id", data.project_id)
      .single()

    if (projectError) {
      console.error("Error fetching project details:", projectError)
      // Continue anyway since we've already added the team member to the project
    }

    // Try to send invitation email, but don't fail if it doesn't work
    try {
      if (teamMember && project) {
        // Call the updated sendTeamMemberInvitation function with the correct parameters
        const invitationResult = await sendTeamMemberInvitation(
          teamMember.id,
          data.project_id,
          teamMember.email,
          project.name,
        )

        if (!invitationResult.success) {
          console.warn(
            "Failed to send invitation email, but team member was added to project:",
            invitationResult.error || "Unknown error",
          )
        }
      }
    } catch (emailError) {
      console.error("Error sending invitation email:", emailError)
      // Don't throw, we still want to return success for adding the team member
    }

    revalidatePath(`/projects/${data.project_id}`)
    return {
      success: true,
      data: newProjectTeamMember,
      message: "Team member added to project successfully. They will receive an invitation to join.",
    }
  } catch (error) {
    console.error("Error adding team member to project:", error)
    return { success: false, error: error.message }
  }
}

// Remove a team member from a project
export async function removeTeamMemberFromProject(teamMemberId: string, projectId: string) {
  const supabase = createAdminClient()

  try {
    // First, find the project_team_members record for this team member and project
    const { data: projectTeamMember, error: findError } = await supabase
      .from("project_team_members")
      .select("id")
      .eq("team_member_id", teamMemberId)
      .eq("project_id", projectId)
      .single()

    if (findError) {
      console.error("Error finding project team member:", findError)
      return { success: false, error: "Team member not found in this project" }
    }

    // Then delete the record using its ID
    const { error } = await supabase.from("project_team_members").delete().eq("id", projectTeamMember.id)

    if (error) throw error

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Error removing team member from project:", error)
    return { success: false, error: error.message }
  }
}

// Get available team members for a project (team members from the same client who aren't already on the project)
export async function getAvailableTeamMembersForProject(projectId: string, clientId: string) {
  const supabase = createAdminClient()

  try {
    // First, get all team members already on the project
    const { data: existingTeamMembers, error: existingError } = await supabase
      .from("project_team_members")
      .select("team_member_id")
      .eq("project_id", projectId)

    if (existingError) throw existingError

    const existingIds = existingTeamMembers?.map((item) => item.team_member_id) || []

    // Then, get all team members from the client
    let query = supabase.from("client_team_member").select("*").eq("client_id", clientId)

    // Only filter out existing team members if there are any
    if (existingIds.length > 0) {
      // Use a more compatible approach for filtering
      query = query.filter("id", "not.in", `(${existingIds.join(",")})`)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error getting available team members:", error)
    return { success: false, error: error.message, data: [] }
  }
}
