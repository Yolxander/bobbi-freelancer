"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getProviderNotifications,
  markNotificationAsRead,
  acceptCollaborationInvite,
  rejectCollaborationInvite,
  notifyProjectAccess,
} from "@/app/actions/collaboration-actions"
import { Bell, Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [processingInvites, setProcessingInvites] = useState({})
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const result = await getProviderNotifications(user.id)
      if (result.success) {
        setNotifications(result.data)
        setUnreadCount(result.data.filter((n) => !n.is_read).length)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    if (!user) return

    try {
      const result = await markNotificationAsRead(notificationId, user.id)
      if (result.success) {
        // Update local state
        setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user || notifications.length === 0) return

    const unreadNotifications = notifications.filter((n) => !n.is_read)
    if (unreadNotifications.length === 0) return

    try {
      await Promise.all(unreadNotifications.map((n) => markNotificationAsRead(n.id, user.id)))

      // Update local state
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const handleAcceptInvite = async (notificationId, invitationData) => {
    if (!user || !invitationData || !invitationData.invitation_id) return

    const invitationId = invitationData.invitation_id
    const projectId = invitationData.project_id

    setProcessingInvites((prev) => ({ ...prev, [notificationId]: "accepting" }))
    try {
      const result = await acceptCollaborationInvite(invitationId, user.id)
      if (result.success) {
        // Update notifications to mark this one as read
        await handleMarkAsRead(notificationId)
        // Refresh notifications
        fetchNotifications()
        // Redirect to the project
        router.push(`/projects/${projectId}`)
      }
    } catch (error) {
      console.error("Error accepting invitation:", error)
    } finally {
      setProcessingInvites((prev) => ({ ...prev, [notificationId]: null }))
    }
  }

  const handleRejectInvite = async (notificationId, invitationData) => {
    if (!user || !invitationData || !invitationData.invitation_id) return

    const invitationId = invitationData.invitation_id

    setProcessingInvites((prev) => ({ ...prev, [notificationId]: "rejecting" }))
    try {
      const result = await rejectCollaborationInvite(invitationId, user.id)
      if (result.success) {
        // Update notifications to mark this one as read
        await handleMarkAsRead(notificationId)
        // Refresh notifications
        fetchNotifications()
      }
    } catch (error) {
      console.error("Error rejecting invitation:", error)
    } finally {
      setProcessingInvites((prev) => ({ ...prev, [notificationId]: null }))
    }
  }

  const handleNotificationClick = async (notification) => {
    // Only handle collaboration notifications with project data
    if (!notification.data || !notification.data.project_id) return

    // Mark as read
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id)
    }

    // Show welcome message for collaboration invites that were accepted
    if (
      notification.type === "collaboration_accepted" ||
      (notification.type === "collaboration_invite" && notification.data.status === "accepted")
    ) {
      toast({
        title: `Welcome to ${notification.data.project_name}`,
        description: "You now have access to this project and all its data.",
        duration: 5000,
      })
    }

    // Notify the project owner that this collaborator has accessed the project
    if (user) {
      await notifyProjectAccess(notification.data.project_id, user.id)
    }

    // Navigate to the project
    router.push(`/projects/${notification.data.project_id}`)

    // Close the notification panel
    setIsOpen(false)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "collaboration_invite":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Bell size={16} />
          </div>
        )
      case "collaboration_accepted":
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Check size={16} />
          </div>
        )
      case "collaboration_rejected":
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <X size={16} />
          </div>
        )
      case "collaboration_removed":
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <X size={16} />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <Bell size={16} />
          </div>
        )
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 md:right-auto md:left-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-md bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 last:border-b-0 ${
                    !notification.is_read ? "bg-blue-50" : ""
                  } ${notification.data?.project_id ? "cursor-pointer hover:bg-gray-50" : ""}`}
                  onClick={() => notification.data?.project_id && handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                      {notification.data?.project_id && (
                        <p className="text-xs text-blue-500 mt-1 flex items-center">
                          <span className="mr-1">•</span> Click to view project
                        </p>
                      )}

                      {/* Add invitation actions for collaboration invites */}
                      {notification.type === "collaboration_invite" && notification.data && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleRejectInvite(notification.id, notification.data)}
                            disabled={processingInvites[notification.id]}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors flex-1"
                          >
                            {processingInvites[notification.id] === "rejecting" ? (
                              <span className="flex items-center justify-center gap-1">
                                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                <span>Declining...</span>
                              </span>
                            ) : (
                              "Decline"
                            )}
                          </button>
                          <button
                            onClick={() => handleAcceptInvite(notification.id, notification.data)}
                            disabled={processingInvites[notification.id]}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex-1"
                          >
                            {processingInvites[notification.id] === "accepting" ? (
                              <span className="flex items-center justify-center gap-1">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Accepting...</span>
                              </span>
                            ) : (
                              "Accept"
                            )}
                          </button>
                        </div>
                      )}

                      {/* Show permissions if this is a collaboration invite */}
                      {notification.type === "collaboration_invite" && notification.data?.permissions && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {notification.data.permissions.edit && (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">Can edit</span>
                          )}
                          {notification.data.permissions.delete && (
                            <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-xs">Can delete</span>
                          )}
                          {notification.data.permissions.invite && (
                            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs">Can invite</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
