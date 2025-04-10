"use server"

import { createAdminClient, createClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

export async function sendTeamMemberInvitation(
  teamMemberId: string,
  projectId: string,
  teamMemberEmail: string,
  projectName: string,
) {
  console.log("Sending invitation to team member:", teamMemberId, "for project:", projectId)

  try {
    const supabase = createAdminClient()
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Token expires in 7 days

    // First, check if the table exists
    const { data: tableExists, error: checkError } = await supabase
      .rpc("check_table_exists", {
        table_name: "team_member_invitations",
      })
      .single()

    if (checkError) {
      console.log("Error checking if table exists, will try to create it:", checkError)
      // Continue to table creation
    } else {
      console.log("Table exists check result:", tableExists)
    }

    // If table doesn't exist or we couldn't check, create it
    if (!tableExists || checkError) {
      console.log("Creating team_member_invitations table...")

      try {
        // Try direct SQL approach first (more reliable)
        const { error: sqlError } = await supabase.rpc("execute_sql", {
          sql: `
            CREATE TABLE IF NOT EXISTS public.team_member_invitations (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              team_member_id UUID NOT NULL REFERENCES public.client_team_member(id) ON DELETE CASCADE,
              project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
              token UUID NOT NULL UNIQUE,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              expires_at TIMESTAMPTZ NOT NULL,
              used_at TIMESTAMPTZ,
              UNIQUE(team_member_id, project_id, token)
            );
          `,
        })

        if (sqlError) {
          console.error("Error creating table with direct SQL:", sqlError)

          // Try the RPC method as fallback
          const { error: rpcError } = await supabase.rpc("create_team_member_invitations_table")

          if (rpcError) {
            console.error("Error creating team_member_invitations table with RPC:", rpcError)
            return {
              success: false,
              error: "Could not create invitation table. Team member was added to project but won't receive an email.",
            }
          }
        }

        console.log("Successfully created team_member_invitations table")
      } catch (createError) {
        console.error("Failed to create team_member_invitations table:", createError)
        return {
          success: false,
          error: "Could not create invitation table. Team member was added to project but won't receive an email.",
        }
      }
    }

    // Now try to insert the invitation
    try {
      console.log("Inserting team member invitation with data:", {
        team_member_id: teamMemberId,
        project_id: projectId,
        token,
        expires_at: expiresAt.toISOString(),
      })

      const { data: insertData, error: insertError } = await supabase
        .from("team_member_invitations")
        .insert({
          team_member_id: teamMemberId,
          project_id: projectId,
          token,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error inserting team member invitation:", insertError)

        // Check if it's a foreign key constraint error
        const errorStr = JSON.stringify(insertError)
        if (errorStr.includes("foreign key constraint") || errorStr.includes("violates foreign key")) {
          console.log("Foreign key constraint error - checking references")

          // Check if team member exists
          const { data: teamMemberExists } = await supabase
            .from("client_team_member")
            .select("id")
            .eq("id", teamMemberId)
            .single()

          // Check if project exists
          const { data: projectExists } = await supabase.from("projects").select("id").eq("id", projectId).single()

          console.log("Team member exists:", !!teamMemberExists, "Project exists:", !!projectExists)

          return {
            success: false,
            error: `Could not create invitation due to reference issues. Team member exists: ${!!teamMemberExists}, Project exists: ${!!projectExists}`,
          }
        }

        return {
          success: false,
          error: "Could not create invitation. Team member was added to project but won't receive an email.",
        }
      }

      // Success! Generate the invitation link
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      const invitationLink = `${appUrl}/auth/team-invitation?token=${token}`

      console.log("Team member invitation created successfully")
      console.log("Invitation link:", invitationLink)
      console.log("This would be sent to:", teamMemberEmail)
      console.log("Project name:", projectName)

      return { success: true }
    } catch (insertErr) {
      console.error("Unexpected error during invitation insertion:", insertErr)
      return {
        success: false,
        error:
          "Could not create invitation due to an unexpected error. Team member was added to project but won't receive an email.",
      }
    }
  } catch (error) {
    console.error("Error in sendTeamMemberInvitation:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Team member was added to project but won't receive an email.",
    }
  }
}

export async function verifyTeamMemberInvitation(token: string) {
  try {
    const supabase = createClient()

    // Get the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from("team_member_invitations")
      .select("*, team_member:team_member_id(id, email, name)")
      .eq("token", token)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (invitationError || !invitation) {
      console.error("Error verifying team member invitation:", invitationError)
      return { success: false, error: invitationError || "Invitation not found" }
    }

    return { success: true, invitation }
  } catch (error) {
    console.error("Error in verifyTeamMemberInvitation:", error)
    return { success: false, error }
  }
}

export async function markInvitationAsUsed(token: string) {
  try {
    const supabase = createAdminClient()

    // Mark the invitation as used
    const { error: updateError } = await supabase
      .from("team_member_invitations")
      .update({ used_at: new Date().toISOString() })
      .eq("token", token)

    if (updateError) {
      console.error("Error marking invitation as used:", updateError)
      return { success: false, error: updateError }
    }

    revalidatePath("/auth/team-invitation")
    return { success: true }
  } catch (error) {
    console.error("Error in markInvitationAsUsed:", error)
    return { success: false, error }
  }
}

// Helper function to generate a temporary password
function generateTemporaryPassword(length = 10) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

// Export the sendClientCredentials function
export async function sendClientCredentials(clientId: string, clientEmail: string) {
  console.log("=== STARTING CLIENT CREDENTIAL GENERATION ===")
  console.log(`Client ID: ${clientId}, Email: ${clientEmail}`)

  try {
    // Always use the admin client to bypass RLS policies
    const supabase = createAdminClient()

    // Generate a temporary password
    const tempPassword = generateTemporaryPassword()
    console.log("Generated temporary password")

    // First, check if this client already has a user_id
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("user_id, name, provider_id")
      .eq("id", clientId)
      .single()

    if (clientError) {
      console.error("Error checking client record:", clientError)
      return { success: false, error: "Failed to check client record: " + clientError.message }
    }

    if (!clientData.provider_id) {
      console.error("Client record is missing provider_id")
      return { success: false, error: "Client record is missing provider_id" }
    }

    console.log("Client data:", clientData)

    // If client already has a user_id, check if that user exists
    if (clientData.user_id) {
      console.log("Client already has user_id:", clientData.user_id)

      try {
        // Check if the user exists
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(clientData.user_id)

        if (userError) {
          console.error("Error checking existing user:", userError)
          // Continue to create a new user
        } else if (userData && userData.user) {
          console.log("Existing user found, updating password")

          // Update the existing user's password
          const { error: updateError } = await supabase.auth.admin.updateUserById(clientData.user_id, {
            password: tempPassword,
            user_metadata: {
              client_id: clientId,
              provider_id: clientData.provider_id,
              role: "client",
            },
            app_metadata: {
              role: "client",
            },
          })

          if (updateError) {
            console.error("Error updating user:", updateError)
            return { success: false, error: "Failed to update user: " + updateError.message }
          }

          console.log("Successfully updated user password")

          // Return the credentials
          const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client-dashboard`

          return {
            success: true,
            password: tempPassword,
            dashboardUrl: dashboardUrl,
            loginEmail: userData.user.email,
            isModifiedEmail: userData.user.email !== clientEmail,
            originalEmail: clientEmail,
            user_id: clientData.user_id,
          }
        }
      } catch (e) {
        console.error("Exception when checking existing user:", e)
        // Continue to create a new user
      }
    }

    // Try to create a user with the original email first
    console.log("Attempting to create user with original email:", clientEmail)

    try {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: clientEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          client_id: clientId,
          provider_id: clientData.provider_id,
          role: "client",
          name: clientData.name || "Client",
        },
        app_metadata: {
          role: "client",
        },
      })

      // If email already exists, try with a modified email
      if (createError && createError.message.includes("already")) {
        console.log("Email already exists, trying with modified email")

        // Add a timestamp to ensure uniqueness
        const uniqueEmail = clientEmail.includes("+") ? clientEmail : clientEmail.replace("@", `+${Date.now()}@`)

        console.log("Using modified email:", uniqueEmail)

        const { data: modifiedUser, error: modifiedError } = await supabase.auth.admin.createUser({
          email: uniqueEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            client_id: clientId,
            provider_id: clientData.provider_id,
            role: "client",
            name: clientData.name || "Client",
            original_email: clientEmail,
          },
          app_metadata: {
            role: "client",
          },
        })

        if (modifiedError) {
          console.error("Error creating user with modified email:", modifiedError)
          return { success: false, error: "Failed to create user: " + modifiedError.message }
        }

        if (!modifiedUser || !modifiedUser.user) {
          console.error("No user returned from createUser call with modified email")
          return { success: false, error: "Failed to create user: No user returned" }
        }

        console.log("Successfully created user with modified email, ID:", modifiedUser.user.id)

        // Update the client record with the new user_id using RPC to bypass RLS
        const { error: rpcError } = await supabase.rpc("update_client_user_id", {
          p_client_id: clientId,
          p_user_id: modifiedUser.user.id,
        })

        if (rpcError) {
          console.error("Error updating client with RPC:", rpcError)

          // Fallback to direct update with admin client
          const { error: updateError } = await supabase
            .from("clients")
            .update({
              user_id: modifiedUser.user.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", clientId)

          if (updateError) {
            console.error("Error updating client record:", updateError)
            return { success: false, error: "Failed to link client to user account: " + updateError.message }
          }
        }

        console.log("Successfully updated client record with user_id")

        // Return the credentials
        const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client-dashboard`

        return {
          success: true,
          password: tempPassword,
          dashboardUrl: dashboardUrl,
          loginEmail: uniqueEmail,
          isModifiedEmail: true,
          originalEmail: clientEmail,
          user_id: modifiedUser.user.id,
        }
      } else if (createError) {
        console.error("Error creating user:", createError)
        return { success: false, error: "Failed to create user: " + createError.message }
      }

      if (!newUser || !newUser.user) {
        console.error("No user returned from createUser call")
        return { success: false, error: "Failed to create user: No user returned" }
      }

      console.log("Successfully created user with original email, ID:", newUser.user.id)

      // Update the client record with the new user_id using RPC to bypass RLS
      const { error: rpcError } = await supabase.rpc("update_client_user_id", {
        p_client_id: clientId,
        p_user_id: newUser.user.id,
      })

      if (rpcError) {
        console.error("Error updating client with RPC:", rpcError)

        // Fallback to direct update with admin client
        const { error: updateError } = await supabase
          .from("clients")
          .update({
            user_id: newUser.user.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", clientId)

        if (updateError) {
          console.error("Error updating client record:", updateError)
          return { success: false, error: "Failed to link client to user account: " + updateError.message }
        }
      }

      console.log("Successfully updated client record with user_id")

      // Return the credentials
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client-dashboard`

      return {
        success: true,
        password: tempPassword,
        dashboardUrl: dashboardUrl,
        loginEmail: clientEmail,
        isModifiedEmail: false,
        user_id: newUser.user.id,
      }
    } catch (e) {
      console.error("Exception during user creation:", e)
      return { success: false, error: "Exception during user creation: " + (e.message || String(e)) }
    }
  } catch (error) {
    console.error("Unhandled error in sendClientCredentials:", error)
    return { success: false, error: "An unexpected error occurred: " + (error.message || String(error)) }
  }
}
