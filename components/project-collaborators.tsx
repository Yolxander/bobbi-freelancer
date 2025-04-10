"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  searchProviders,
  getProjectCollaborators,
  sendCollaborationInvite,
  removeCollaborator,
} from "@/app/actions/collaboration-actions"
import { Users, UserPlus, Search, X, Check, Edit, Trash, UserCheck } from "lucide-react"

export default function ProjectCollaborators({ projectId, isOwner = false }) {
  const { user } = useAuth()
  const [collaborators, setCollaborators] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteMessage, setInviteMessage] = useState("")
  const [permissions, setPermissions] = useState({
    edit: true,
    delete: false,
    invite: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (projectId && user) {
      fetchCollaborators()
    }
  }, [projectId, user])

  const fetchCollaborators = async () => {
    if (!projectId || !user) return

    setIsLoading(true)
    try {
      const result = await getProjectCollaborators(projectId)
      if (result.success) {
        setCollaborators(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to load collaborators")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const result = await searchProviders(query, user.id)
      if (result.success) {
        setSearchResults(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Search failed")
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider)
    setShowInviteModal(true)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleSendInvite = async () => {
    if (!selectedProvider || !projectId || !user) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await sendCollaborationInvite({
        project_id: projectId,
        sender_id: user.id,
        recipient_id: selectedProvider.id,
        message: inviteMessage,
        permissions,
      })

      if (result.success) {
        setSuccess(`Invitation sent to ${selectedProvider.full_name}`)
        setShowInviteModal(false)
        setSelectedProvider(null)
        setInviteMessage("")
        setPermissions({
          edit: true,
          delete: false,
          invite: false,
        })
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to send invitation")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCollaborator = async (collaborationId) => {
    if (!collaborationId || !user) return

    if (!confirm("Are you sure you want to remove this collaborator?")) {
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await removeCollaborator(collaborationId, user.id)
      if (result.success) {
        setSuccess("Collaborator removed successfully")
        // Update the local state
        setCollaborators(collaborators.filter((c) => c.id !== collaborationId))
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to remove collaborator")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderTypeDisplay = (provider) => {
    if (!provider.providers) return "Provider"

    const providerData = provider.providers
    if (providerData.custom_provider_type) {
      return providerData.custom_provider_type
    }

    return providerData.provider_type?.name || "Provider"
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Collaborators</h2>
        {isOwner && (
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search providers..."
                  className="w-64 px-4 py-2 pr-10 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
              <button
                className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm"
                onClick={() => {
                  setShowInviteModal(true)
                  setSelectedProvider(null)
                }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite</span>
              </button>
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                <div className="p-2 max-h-60 overflow-y-auto">
                  {searchResults.map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleSelectProvider(provider)}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{provider.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{provider.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">{success}</div>}

      {isLoading && collaborators.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading collaborators...</p>
        </div>
      ) : collaborators.length > 0 ? (
        <div className="overflow-hidden border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Provider
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Permissions
                </th>
                {isOwner && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collaborators.map((collaborator) => (
                <tr key={collaborator.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {collaborator.providers?.full_name || "Unknown Provider"}
                        </div>
                        <div className="text-sm text-gray-500">{collaborator.providers?.email || ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getProviderTypeDisplay(collaborator)}</div>
                    <div className="text-xs text-gray-500">{collaborator.role || "Collaborator"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {collaborator.permissions?.edit && (
                        <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-blue-100 text-blue-800">
                          <Edit className="w-3 h-3 mr-1" /> Edit
                        </span>
                      )}
                      {collaborator.permissions?.delete && (
                        <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-red-100 text-red-800">
                          <Trash className="w-3 h-3 mr-1" /> Delete
                        </span>
                      )}
                      {collaborator.permissions?.invite && (
                        <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-green-100 text-green-800">
                          <UserPlus className="w-3 h-3 mr-1" /> Invite
                        </span>
                      )}
                    </div>
                  </td>
                  {isOwner && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No collaborators yet</h3>
          <p className="text-gray-500 mb-4">
            {isOwner
              ? "Invite other providers to collaborate on this project"
              : "The project owner hasn't added any collaborators yet"}
          </p>
          {isOwner && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
            >
              Invite Collaborators
            </button>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Invite Collaborator</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                onClick={() => {
                  setShowInviteModal(false)
                  setSelectedProvider(null)
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedProvider ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedProvider.full_name}</h3>
                    <p className="text-sm text-gray-500">{selectedProvider.email}</p>
                    <p className="text-xs text-gray-500">
                      {selectedProvider.custom_provider_type || selectedProvider.provider_type?.name || "Provider"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Provider</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full px-4 py-3 pr-10 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Search className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-2 max-h-60 overflow-y-auto border border-gray-100 rounded-xl">
                    {searchResults.map((provider) => (
                      <div
                        key={provider.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => setSelectedProvider(provider)}
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{provider.full_name}</h3>
                          <p className="text-xs text-gray-500">{provider.email}</p>
                          <p className="text-xs text-gray-500">
                            {provider.custom_provider_type || provider.provider_type?.name || "Provider"}
                          </p>
                        </div>
                        <Check className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                  <p className="text-sm text-gray-500 mt-2">No providers found. Try a different search term.</p>
                )}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Message (Optional)</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Add a personal message to your invitation..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="permission-edit"
                      checked={permissions.edit}
                      onChange={(e) => setPermissions({ ...permissions, edit: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="permission-edit" className="ml-2 block text-sm text-gray-700">
                      Can edit project and tasks
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="permission-delete"
                      checked={permissions.delete}
                      onChange={(e) => setPermissions({ ...permissions, delete: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="permission-delete" className="ml-2 block text-sm text-gray-700">
                      Can delete tasks
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="permission-invite"
                      checked={permissions.invite}
                      onChange={(e) => setPermissions({ ...permissions, invite: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="permission-invite" className="ml-2 block text-sm text-gray-700">
                      Can invite other collaborators
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setShowInviteModal(false)
                  setSelectedProvider(null)
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvite}
                disabled={!selectedProvider || isLoading}
                className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
