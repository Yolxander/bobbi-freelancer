"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Plus, Search, Phone, MapPin, MoreHorizontal, Edit, Trash, X, Key, Copy } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { getClients, createClient, deleteClient } from "@/app/actions/client-actions"
import { sendClientCredentials } from "@/app/actions/email-actions"

export default function ClientsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [clients, setClients] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCredentialModal, setShowCredentialModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [isSendingCredentials, setIsSendingCredentials] = useState(false)
  const [credentialsSent, setCredentialsSent] = useState({})
  const [tempCredentials, setTempCredentials] = useState(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const [copiedField, setCopiedField] = useState(null)

  useEffect(() => {
    // Only fetch clients if we have a user and auth loading is complete
    if (!loading) {
      if (!user) {
        router.push("/auth")
        return
      }

      const fetchClients = async () => {
        setPageLoading(true)
        try {
          const result = await getClients(user.id)
          if (result.success) {
            setClients(result.data || [])
          } else {
            setError(result.error || "Failed to load clients")
          }
        } catch (err) {
          console.error("Error fetching clients:", err)
          setError("Failed to load clients")
        } finally {
          setPageLoading(false)
        }
      }

      fetchClients()
    }
  }, [user, loading, router])

  const handleAddClient = async (e) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const result = await createClient({
        ...newClient,
        provider_id: user.id,
      })

      if (result.success) {
        // Add the new client to the list
        setClients([...clients, result.data])

        // Reset form and close modal
        setNewClient({
          name: "",
          email: "",
          phone: "",
          address: "",
          description: "",
        })
        setShowAddClientModal(false)
      } else {
        setError(result.error || "Failed to add client")
      }
    } catch (err) {
      console.error("Error adding client:", err)
      setError("Failed to add client")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async (clientId) => {
    if (
      !confirm("Are you sure you want to delete this client? This will also delete all associated projects and tasks.")
    ) {
      return
    }

    try {
      const result = await deleteClient(clientId)
      if (result.success) {
        // Remove the client from the list
        setClients(clients.filter((client) => client.id !== clientId))
      } else {
        setError(result.error || "Failed to delete client")
      }
    } catch (err) {
      console.error("Error deleting client:", err)
      setError("Failed to delete client")
    }
  }

  const handleSendCredentials = async () => {
    if (!selectedClient || !selectedClient.email) {
      setError("Client email is required to generate credentials")
      return
    }

    setIsSendingCredentials(true)
    setError(null) // Clear any previous errors

    try {
      console.log("Starting credential generation process for client:", selectedClient.id)
      console.log("Original client email being used:", selectedClient.email)

      const result = await sendClientCredentials(selectedClient.id, selectedClient.email)

      console.log("Credential generation result:", result)

      if (result.success) {
        // Check if we have a user_id in the response to confirm auth user creation
        if (result.user_id) {
          console.log("Auth user successfully created with ID:", result.user_id)
        } else {
          console.warn("Auth user may not have been created - no user_id in response")
        }

        setTempCredentials({
          email: result.loginEmail || selectedClient.email,
          originalEmail: result.originalEmail,
          password: result.password,
          url: result.dashboardUrl,
          isModifiedEmail: result.isModifiedEmail,
        })
        setShowCredentials(true)

        // Mark this client as having credentials generated
        setCredentialsSent({
          ...credentialsSent,
          [selectedClient.id]: true,
        })
      } else {
        console.error("Failed to generate credentials:", result.error)
        setError(result.error || "Failed to generate credentials. Check console for details.")
      }
    } catch (err) {
      console.error("Exception in handleSendCredentials:", err)
      setError(`Failed to generate credentials: ${err.message || String(err)}`)
    } finally {
      setIsSendingCredentials(false)
    }
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading || pageLoading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading clients...</p>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Clients</h1>
              <p className="text-gray-500">Manage your clients and their information</p>
            </div>
            <button
              onClick={() => setShowAddClientModal(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          {/* Error message */}
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

          {/* Clients List */}
          {filteredClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <div key={client.id} className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <p className="text-sm text-gray-500">{client.email || "No email"}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={() => {
                          const dropdown = document.getElementById(`client-actions-${client.id}`)
                          dropdown?.classList.toggle("hidden")
                        }}
                      >
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </button>
                      <div
                        id={`client-actions-${client.id}`}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 hidden"
                      >
                        <Link href={`/clients/${client.id}`}>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedClient(client)
                            setShowCredentialModal(true)
                            setShowCredentials(false) // Reset credentials display
                            setTempCredentials(null) // Clear any previous credentials
                            const dropdown = document.getElementById(`client-actions-${client.id}`)
                            dropdown?.classList.add("hidden")
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Key className="w-4 h-4" />
                          <span>Generate Credentials</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Trash className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{client.phone}</span>
                      </div>
                    )}

                    {client.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">{client.address}</span>
                      </div>
                    )}

                    {client.description && (
                      <div className="text-sm text-gray-700 mt-2">
                        <p className="line-clamp-2">{client.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Link href={`/clients/${client.id}`} className="flex-1">
                      <button className="w-full py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                        <Edit className="w-4 h-4" />
                        <span>Details</span>
                      </button>
                    </Link>
                    <button
                      className="flex-1 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                      onClick={() => {
                        setSelectedClient(client)
                        setShowCredentialModal(true)
                        setShowCredentials(false) // Reset credentials display
                        setTempCredentials(null) // Clear any previous credentials
                      }}
                    >
                      <Key className="w-4 h-4" />
                      <span>Credentials</span>
                    </button>
                  </div>

                  {/* Badge for credentials sent */}
                  {credentialsSent[client.id] && (
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Credentials generated
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No clients yet</h3>
              <p className="text-gray-500 mb-4">Add your first client to get started</p>
              <button
                onClick={() => setShowAddClientModal(true)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
              >
                Add Client
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Client</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setShowAddClientModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={newClient.address}
                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newClient.description}
                    onChange={(e) => setNewClient({ ...newClient, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Enter client description"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setShowAddClientModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Credentials Modal */}
      {showCredentialModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Client Credentials</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setShowCredentialModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedClient.name}</h3>
                  <p className="text-sm text-gray-500">{selectedClient.email || "No email"}</p>
                </div>
              </div>

              {!selectedClient.email ? (
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl">
                  <p>This client doesn't have an email address. Please add an email address to generate credentials.</p>
                </div>
              ) : !showCredentials ? (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700 mb-2">
                    This will generate login credentials for the client dashboard.
                  </p>
                  <p className="text-sm text-gray-700">
                    You will need to manually share these credentials with your client.
                  </p>
                </div>
              ) : null}

              {/* Error message in modal */}
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}
            </div>

            {showCredentials && tempCredentials && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Temporary Credentials</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600 font-medium">Login Email:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded flex-1 mr-2 overflow-x-auto">
                        {tempCredentials.email}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tempCredentials.email, "email")}
                        className="p-1.5 bg-gray-200 rounded hover:bg-gray-300"
                        title="Copy to clipboard"
                      >
                        {copiedField === "email" ? (
                          <span className="text-green-600 text-xs font-medium">Copied!</span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {tempCredentials.isModifiedEmail && (
                    <div className="mt-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-xs">
                      <p className="font-medium">Important:</p>
                      <p>
                        The email address has been modified to ensure uniqueness in our system. The client{" "}
                        <strong>must use this exact email address</strong> to log in, not their regular email.
                      </p>
                      <p className="mt-1">Original email: {tempCredentials.originalEmail || selectedClient.email}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600 font-medium">Password:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded flex-1 mr-2">
                        {tempCredentials.password}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tempCredentials.password, "password")}
                        className="p-1.5 bg-gray-200 rounded hover:bg-gray-300"
                        title="Copy to clipboard"
                      >
                        {copiedField === "password" ? (
                          <span className="text-green-600 text-xs font-medium">Copied!</span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600 font-medium">Dashboard URL:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded flex-1 mr-2 overflow-x-auto">
                        {tempCredentials.url}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tempCredentials.url, "url")}
                        className="p-1.5 bg-gray-200 rounded hover:bg-gray-300"
                        title="Copy to clipboard"
                      >
                        {copiedField === "url" ? (
                          <span className="text-green-600 text-xs font-medium">Copied!</span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-xs">
                    <p className="font-medium mb-1">Important:</p>
                    <p>
                      Please share these credentials with your client manually. They will need to change their password
                      after first login.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                onClick={() => setShowCredentialModal(false)}
              >
                Close
              </button>
              {!showCredentials && (
                <button
                  onClick={handleSendCredentials}
                  disabled={isSendingCredentials || !selectedClient.email}
                  className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSendingCredentials ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      <span>Generate Credentials</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
