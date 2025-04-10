"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Briefcase, Calendar, CheckCircle, X, User } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { createProject } from "@/app/actions/project-actions"

export default function NewProjectPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    client_id: "personal", // Default to personal project
    status: "Planning",
    start_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default to 2 weeks from now
  })

  useEffect(() => {
    const fetchClients = async () => {
      if (user) {
        try {
          const { getClients } = await import("@/app/actions/client-actions")
          const result = await getClients(user.id)
          if (result.success) {
            setClients(result.data || [])
          }
        } catch (err) {
          console.error("Error fetching clients:", err)
        }
      }
    }

    if (user) {
      fetchClients()
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!user) {
        throw new Error("You must be logged in to create a project")
      }

      // Prepare the data
      const data = {
        ...projectData,
        provider_id: user.id,
        client_id: projectData.client_id === "personal" ? null : projectData.client_id,
      }

      const result = await createProject(data)

      if (result.success) {
        router.push(`/projects/${result.data.id}`)
      } else {
        setError(result.error || "Failed to create project")
      }
    } catch (err) {
      console.error("Error creating project:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Authentication Required</h3>
              <p className="text-gray-500 mt-2">You need to be logged in to create a project.</p>
              <Link href="/auth">
                <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                  Go to Login
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
          <div className="mb-6">
            <Link href="/projects" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Projects</span>
            </Link>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={projectData.name}
                      onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
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
                      value={projectData.description}
                      onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Enter project description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Client
                    </label>
                    <select
                      id="client_id"
                      value={projectData.client_id}
                      onChange={(e) => setProjectData({ ...projectData, client_id: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <option value="personal">Personal Project (No Client)</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 flex items-center">
                      {projectData.client_id === "personal" ? (
                        <div className="flex items-center text-purple-600 text-sm">
                          <User className="w-4 h-4 mr-1" />
                          <span>This project will be created as a personal project</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-blue-600 text-sm">
                          <Briefcase className="w-4 h-4 mr-1" />
                          <span>
                            This project will be associated with{" "}
                            {clients.find((c) => c.id === projectData.client_id)?.name || "the selected client"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={projectData.status}
                      onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="start_date"
                          value={projectData.start_date}
                          onChange={(e) => setProjectData({ ...projectData, start_date: e.target.value })}
                          className="w-full pl-10 px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="due_date"
                          value={projectData.due_date}
                          onChange={(e) => setProjectData({ ...projectData, due_date: e.target.value })}
                          className="w-full pl-10 px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <Link href="/projects">
                    <button
                      type="button"
                      className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
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
          </div>
        </div>
      </div>
    </div>
  )
}
