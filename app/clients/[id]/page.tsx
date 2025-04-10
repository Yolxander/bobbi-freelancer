"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Users,
  ArrowLeft,
  Edit,
  Trash,
  Send,
  Phone,
  MapPin,
  Mail,
  Briefcase,
  Plus,
  X,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { getClient, updateClient, deleteClient, getClientInfo } from "@/app/actions/client-actions"
import { getProjects } from "@/app/actions/project-actions"
import { sendClientCredentials } from "@/app/actions/email-actions"
import ProjectModal from "@/components/projects/project-modal"

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const clientId = params.id

  const [client, setClient] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedClient, setEditedClient] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSendingCredentials, setIsSendingCredentials] = useState(false)
  const [credentialsSent, setCredentialsSent] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (user && clientId) {
        setLoading(true)
        try {
          // Fetch client details using the new info endpoint
          const clientResult = await getClientInfo(clientId)
          if (clientResult.success) {
            setClient(clientResult.data)
            setEditedClient(clientResult.data)

            // Fetch projects for this client
            const projectsResult = await getProjects(user.id, clientId)
            if (projectsResult.success) {
              setProjects(projectsResult.data || [])
            }
          } else {
            setError(clientResult.error || "Client not found")
          }
        } catch (err) {
          console.error("Error fetching client data:", err)
          setError("Failed to load client details")
        } finally {
          setLoading(false)
        }
      }
    }

    if (user && clientId) {
      fetchData()
    }
  }, [user, clientId, isProjectModalOpen])

  const handleUpdateClient = async () => {
    if (!editedClient) return

    setIsUpdating(true)
    try {
      const result = await updateClient(client.id, editedClient)

      if (result.success) {
        setClient(editedClient)
        setIsEditing(false)
      } else {
        setError(result.error || "Failed to update client")
      }
    } catch (err) {
      console.error("Error updating client:", err)
      setError("Failed to update client")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteClient = async () => {
    if (!client) return

    if (
      confirm("Are you sure you want to delete this client? This will also delete all associated projects and tasks.")
    ) {
      try {
        const result = await deleteClient(client.id)

        if (result.success) {
          router.push("/clients")
        } else {
          setError(result.error || "Failed to delete client")
        }
      } catch (err) {
        console.error("Error deleting client:", err)
        setError("Failed to delete client")
      }
    }
  }

  const handleSendCredentials = async () => {
    if (!client || !client.email) {
      setError("Client email is required to send credentials")
      return
    }

    setIsSendingCredentials(true)
    try {
      const result = await sendClientCredentials(client.id, client.email)

      if (result.success) {
        setCredentialsSent(true)
      } else {
        setError(result.error || "Failed to send credentials")
      }
    } catch (err) {
      console.error("Error sending credentials:", err)
      setError("Failed to send credentials")
    } finally {
      setIsSendingCredentials(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading client details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Client not found</h3>
              <p className="text-gray-500 mt-2">
                {error || "The client you're looking for doesn't exist or has been deleted."}
              </p>
              <Link href="/clients">
                <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                  Back to Clients
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/clients" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Clients</span>
            </Link>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editedClient?.name}
                      onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                      className="text-2xl font-bold w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900"
                      placeholder="Enter client name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{client?.name}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-600">{client?.email || "No email"}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdateClient}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditedClient(client)
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                        disabled={isUpdating}
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleSendCredentials}
                        disabled={isSendingCredentials || !client.email}
                        className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSendingCredentials ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Credentials</span>
                          </>
                        )}
                      </button>
                      <div className="relative">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100"
                          onClick={() => {
                            const dropdown = document.getElementById("client-actions-dropdown")
                            dropdown?.classList.toggle("hidden")
                          }}
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                        <div
                          id="client-actions-dropdown"
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 hidden"
                        >
                          <button
                            onClick={handleDeleteClient}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Trash className="w-4 h-4" />
                            <span>Delete Client</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Client Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h2>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
                          <input
                            type="email"
                            value={editedClient?.email || ""}
                            onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={editedClient?.phone || ""}
                            onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900"
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">Address</label>
                          <input
                            type="text"
                            value={editedClient?.address || ""}
                            onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900"
                            placeholder="Enter address"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-600">{client?.email || "No email"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-600">{client?.phone || "No phone"}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                          <span className="text-gray-600">{client?.address || "No address"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Description</h2>
                    {isEditing ? (
                      <textarea
                        value={editedClient?.description || ""}
                        onChange={(e) => setEditedClient({ ...editedClient, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-900"
                        placeholder="Enter client description"
                        rows={4}
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {client?.description || "No description provided."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Credentials Status */}
                  {credentialsSent && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 font-medium">Credentials sent successfully</span>
                      </div>
                      <p className="text-green-600 text-sm mt-1">Login credentials have been sent to {client.email}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Client Projects</h2>
                  {projects.length > 0 ? (
                    <div className="space-y-3">
                      {projects.map((project) => (
                        <Link href={`/projects/${project.id}`} key={project.id}>
                          <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{project.name}</h3>
                                <p className="text-xs text-gray-600">
                                  {project.status} • Due: {new Date(project.due_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-gray-900 font-medium mb-2">No projects yet</h3>
                      <p className="text-gray-600 text-sm mb-4">No projects have been created for this client yet</p>
                      <button
                        onClick={() => setIsProjectModalOpen(true)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Project</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isProjectModalOpen && (
        <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} clientId={params.id} />
      )}
    </div>
  )
}
