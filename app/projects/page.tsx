"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Briefcase, Plus, Search, Filter, ChevronRight, AlertCircle, User, LayoutGrid, List, X, Folder } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { getProjects } from "../actions/project-actions"
import ProjectModal from "@/components/projects/project-modal"
import { getClients } from "../actions/client-actions"
import { format } from "date-fns"

export default function ProjectsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState("")
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState("grid") // "grid" or "list"
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      if (user && user.providerId) {
        setIsLoading(true)
        setError(null)

        try {
          const result = await getProjects(user.providerId)
          if (result.success) {
            console.log('Fetched projects:', result.data)
            setProjects(result.data)
          } else {
            setError(result.error || "Failed to fetch projects")
            console.error("Error fetching projects:", result.error)
          }
        } catch (err) {
          setError("An unexpected error occurred")
          console.error("Exception fetching projects:", err)
        } finally {
          setIsLoading(false)
        }
      }
    }

    const fetchClients = async () => {
      if (user && user.providerId) {
        try {
          const result = await getClients(user.providerId)
          if (result.success) {
            setClients(result.data)
          } else {
            console.error("Error fetching clients:", result.error)
          }
        } catch (err) {
          console.error("Exception fetching clients:", err)
        }
      }
    }

    if (user && user.providerId) {
      fetchProjects()
      fetchClients()
    }
  }, [user])

  // Filter projects based on search query and selected client
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedClient === "" || project.client_id === selectedClient),
  )

  // Get recent projects based on last update time
  const recentProjects = [...filteredProjects]
    .sort((a, b) => {
      // Compare by updated_at dates (most recent first)
      const dateA = new Date(a.updated_at || a.created_at)
      const dateB = new Date(b.updated_at || b.created_at)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 3) // Show only the 3 most recently updated projects

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Folder className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-64 bg-white rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button
                className={`p-2 rounded-full ${isFilterOpen ? "bg-gray-200" : "hover:bg-gray-100"} transition-colors shadow-sm`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex border border-gray-200 rounded-lg shadow-sm">
                <button
                  className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "bg-white"} transition-colors`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "bg-white"} transition-colors`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <button
                className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                onClick={() => setIsAddProjectModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Project</span>
              </button>
            </div>
          </div>

          {/* Filter dropdown */}
          {isFilterOpen && (
            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="client-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <select
                    id="client-filter"
                    className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    <option value="">All Clients</option>
                    <option value="">Personal Projects</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                    onClick={() => {
                      setSelectedClient("")
                      setSearchQuery("")
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 shadow-sm">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {!error && filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first project</p>
              <button
                className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-5 py-2 hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                onClick={() => setIsAddProjectModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Project</span>
              </button>
            </div>
          )}

          {!error && filteredProjects.length > 0 && (
            <>
              {/* Recent Projects Section */}
              {recentProjects.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Updated Projects</h2>
                  <div
                    className={
                      viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
                    }
                  >
                    {recentProjects.map((project) => (
                      <ProjectCard key={`recent-${project.id}`} project={project} viewMode={viewMode} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Projects Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">All Projects</h2>
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} viewMode={viewMode} />
                  ))}

                  <div
                    className={`
                      bg-white border border-dashed border-gray-200 rounded-xl p-6 
                      flex flex-col items-center justify-center text-center 
                      hover:bg-gray-50 transition-colors cursor-pointer shadow-sm hover:shadow-md
                      ${viewMode === "grid" ? "h-full" : "py-8"}
                    `}
                    onClick={() => setIsAddProjectModalOpen(true)}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                      <Plus className="w-6 h-6 text-gray-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Create New Project</h3>
                    <p className="text-sm text-gray-500">Start working on something new</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal isOpen={isAddProjectModalOpen} onClose={() => setIsAddProjectModalOpen(false)} clientId="" />
    </div>
  )
}

// Project Card Component
function ProjectCard({ project, viewMode }) {
  if (viewMode === "grid") {
    return (
      <Link href={`/projects/${project.id}`}>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-lg ${project.color || "bg-blue-100"} flex items-center justify-center shadow-sm`}
              >
                {project.client_id ? (
                  <Briefcase className="w-6 h-6 text-blue-600" />
                ) : (
                  <User className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-900">{project.name}</h3>
                <div className="flex items-center gap-2">
                  {project.client_id ? (
                    <p className="text-sm text-gray-500">{project.client?.name || "No client"}</p>
                  ) : (
                    <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Personal</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">75%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Tasks Overview */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">12</div>
                  <div className="text-xs text-green-700">Completed</div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">5</div>
                  <div className="text-xs text-blue-700">In Progress</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-semibold text-yellow-600">3</div>
                  <div className="text-xs text-yellow-700">Pending</div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
              <div
                className={`
                  text-xs font-medium px-2.5 py-0.5 rounded
                  ${
                    project.status === "In Progress"
                      ? "bg-green-100 text-green-700"
                      : project.status === "Review"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {project.status}
              </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-xs">Last updated</span>
                  <span className="text-xs font-medium">
                    {format(new Date(project.updated_at || project.created_at), 'MMM d')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  } else {
    // List view
    return (
      <Link href={`/projects/${project.id}`}>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-lg ${project.color || "bg-blue-100"} flex items-center justify-center shadow-sm`}
              >
                {project.client_id ? (
                  <Briefcase className="w-5 h-5 text-blue-600" />
                ) : (
                  <User className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <div className="flex items-center gap-2">
                  {project.client_id ? (
                    <p className="text-xs text-gray-500">{project.client?.name || "No client"}</p>
                  ) : (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Personal</span>
                  )}
                  <span className="text-xs text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">12 tasks completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs font-medium text-gray-600">75%</span>
              </div>
              <div
                className={`
                  text-xs font-medium px-2.5 py-0.5 rounded
                  ${
                    project.status === "In Progress"
                      ? "bg-green-100 text-green-700"
                      : project.status === "Review"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {project.status}
              </div>
              <div className="text-sm text-gray-500">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
