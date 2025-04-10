"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { createProject } from "@/app/actions/project-actions"
import { getClients } from "@/app/actions/client-actions"
import { useAuth } from "@/lib/auth-context"
import { X, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
}

export default function ProjectModal({ isOpen, onClose, clientId }: ProjectModalProps) {
  const { user } = useAuth()
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "In Progress",
  })
  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(clientId || "personal")
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  // Fetch clients when the modal opens
  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return

      try {
        setIsLoadingClients(true)
        const result = await getClients(user.id)
        if (result.success) {
          setClients(result.data || [])
        }
      } catch (err) {
        console.error("Error fetching clients:", err)
      } finally {
        setIsLoadingClients(false)
      }
    }

    if (isOpen) {
      fetchClients()
    }
  }, [isOpen, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const data = {
        ...newProject,
        client_id: selectedClientId === "personal" ? null : selectedClientId,
        provider_id: user.id,
      }

      const result = await createProject(data)

      if (result.success) {
        // Navigate to the project page instead of just closing the modal
        router.push(`/projects/${result.data.id}`)
      } else {
        setError(result.error || "Failed to create project")
      }
    } catch (err) {
      console.error("Error creating project:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  // Client-side only code
  if (typeof window === "undefined") {
    return null
  }

  // Check if portal container exists, create if it doesn't
  let portalElement = document.getElementById("portal")
  if (!portalElement) {
    portalElement = document.createElement("div")
    portalElement.id = "portal"
    document.body.appendChild(portalElement)
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create New Project</h2>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            {isLoadingClients ? (
              <div className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-500">Loading clients...</div>
            ) : (
              <select
                id="client"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option value="personal">Personal (No Client)</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    portalElement,
  )
}
