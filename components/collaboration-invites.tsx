"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getCollaborationInvites,
  acceptCollaborationInvite,
  rejectCollaborationInvite,
} from "@/app/actions/collaboration-actions"
import { Users, Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function CollaborationInvites() {
  const { user } = useAuth()
  const [invites, setInvites] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [actionInProgress, setActionInProgress] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      fetchInvites()
    }
  }, [user])

  const fetchInvites = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const result = await getCollaborationInvites(user.id)
      if (result.success) {
        setInvites(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to load invitations")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (inviteId) => {
    if (!user) return

    setActionInProgress(inviteId)
    setError(null)
    try {
      const result = await acceptCollaborationInvite(inviteId, user.id)
      if (result.success) {
        // Remove the invite from the list
        setInvites(invites.filter((invite) => invite.id !== inviteId))
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to accept invitation")
      console.error(err)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleReject = async (inviteId) => {
    if (!user) return

    setActionInProgress(inviteId)
    setError(null)
    try {
      const result = await rejectCollaborationInvite(inviteId, user.id)
      if (result.success) {
        // Remove the invite from the list
        setInvites(invites.filter((invite) => invite.id !== inviteId))
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to reject invitation")
      console.error(err)
    } finally {
      setActionInProgress(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (invites.length === 0) {
    return null // Don't show anything if there are no invites
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-semibold mb-4">Collaboration Invitations</h2>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <div className="space-y-4">
        {invites.map((invite) => (
          <div key={invite.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Invitation from {invite.providers?.full_name || "Unknown"}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You've been invited to collaborate on project "{invite.projects?.name || "Unknown"}"
                </p>
                {invite.message && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="text-gray-700">{invite.message}</p>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {invite.permissions?.edit && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Can edit</span>
                  )}
                  {invite.permissions?.delete && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Can delete</span>
                  )}
                  {invite.permissions?.invite && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Can invite others
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Sent {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(invite.id)}
                      disabled={actionInProgress === invite.id}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {actionInProgress === invite.id ? (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <X className="w-3 h-3" />
                          Decline
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleAccept(invite.id)}
                      disabled={actionInProgress === invite.id}
                      className="px-3 py-1 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {actionInProgress === invite.id ? (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Accept
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
