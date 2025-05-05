"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  ArrowLeft,
  Edit,
  Trash,
  Plus,
  X,
  CheckCircle,
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { getDeliverable, updateDeliverable, deleteDeliverable, generateTasks, type Task } from "@/app/actions/deliverable-actions"
import { format } from "date-fns"

export default function DeliverableDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const deliverableId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const [deliverable, setDeliverable] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedDeliverable, setEditedDeliverable] = useState<any>(null)
  const [generatingTasks, setGeneratingTasks] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      if (user && deliverableId) {
        setLoading(true)
        setError(null)

        try {
          const deliverableResult = await getDeliverable(deliverableId)
          if (deliverableResult && deliverableResult.data) {
            // Ensure we have the correct data structure
            const deliverableData = {
              ...deliverableResult.data,
              tasks: deliverableResult.data.tasks || [],
              tasks_count: deliverableResult.data.tasks_count || 0,
              description: deliverableResult.data.description || null,
              title: deliverableResult.data.title || 'Untitled Deliverable'
            }
            setDeliverable(deliverableData)
            setEditedDeliverable(deliverableData)
          } else {
            setError('Deliverable not found')
          }
        } catch (error) {
          console.error('Error fetching deliverable:', error)
          setError('Failed to fetch deliverable details')
        } finally {
          setLoading(false)
        }
      }
    }

    if (user && deliverableId) {
      fetchData()
    }
  }, [user, deliverableId])

  const handleUpdateDeliverable = async () => {
    if (!editedDeliverable) return

    try {
      const result = await updateDeliverable(editedDeliverable.id, editedDeliverable)
      if (result.success) {
        setDeliverable(result.data)
        setIsEditing(false)
      } else {
        setError(result.error || "Failed to update deliverable")
      }
    } catch (error) {
      console.error("Error updating deliverable:", error)
      setError("Failed to update deliverable")
    }
  }

  const handleDeleteDeliverable = async () => {
    if (!deliverable) return

    try {
      const result = await deleteDeliverable(deliverable.id)
      if (result.success) {
        router.push('/deliverables')
      } else {
        setError(result.error || "Failed to delete deliverable")
      }
    } catch (error) {
      console.error("Error deleting deliverable:", error)
      setError("Failed to delete deliverable")
    }
  }

  const handleGenerateTasks = async () => {
    if (!user?.providerId || !deliverable) return

    try {
      setGeneratingTasks(deliverable.id)
      setError(null)
      
      await generateTasks(user.providerId, deliverable.id)
      const updatedDeliverable = await getDeliverable(deliverable.id)
      setDeliverable(updatedDeliverable.data)
    } catch (err) {
      setError("Failed to generate tasks")
      console.error(err)
    } finally {
      setGeneratingTasks(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "in_progress":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
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
              <p className="text-gray-500">Loading deliverable details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Deliverable not found</h3>
              <p className="text-gray-500 mt-2">{error}</p>
              <Link href="/deliverables">
                <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                  Back to Deliverables
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
            <Link href="/deliverables" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Deliverables</span>
            </Link>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-4">
                      <h1 className="text-2xl font-bold text-gray-900">{deliverable?.title}</h1>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this deliverable? This action cannot be undone.")) {
                            handleDeleteDeliverable();
                          }
                        }}
                        className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2"
                      >
                        <Trash className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {deliverable?.tasks_count || 0} tasks
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        Last updated {deliverable?.updated_at ? format(new Date(deliverable.updated_at), 'MMM d, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  {!deliverable?.tasks?.length && (
                    <button
                      onClick={handleGenerateTasks}
                      disabled={generatingTasks === deliverable?.id}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingTasks === deliverable?.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating Tasks...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Generate Tasks</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {deliverable?.tasks?.length ? 
                      `${Math.round((deliverable.tasks.filter((t: Task) => t.status === 'completed').length / deliverable.tasks.length) * 100)}%` : 
                      '0%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-300" 
                    style={{ 
                      width: deliverable?.tasks?.length ? 
                        `${(deliverable.tasks.filter((t: Task) => t.status === 'completed').length / deliverable.tasks.length) * 100}%` : 
                        '0%' 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === "tasks" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("tasks")}
              >
                Tasks
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Deliverable Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Description</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {deliverable?.description || "No description provided."}
                  </p>
                </div>

                {/* Tasks Overview */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Tasks Overview</h2>
                    {!deliverable?.tasks?.length && (
                      <button
                        onClick={handleGenerateTasks}
                        disabled={generatingTasks === deliverable?.id}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingTasks === deliverable?.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating Tasks...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Generate Tasks</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {deliverable?.tasks?.length > 0 ? (
                    <div className="space-y-4">
                      {deliverable.tasks.map((task: Task) => (
                        <div key={task.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                            <p className="text-xs text-gray-500">{task.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-xs text-gray-500">
                              Priority: <span className="font-medium">{task.priority}</span>
                            </div>
                            <div className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(task.status)}`}>
                              {task.status.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                      <p className="text-gray-600 mb-4">Generate tasks to get started with this deliverable</p>
                      <button
                        onClick={handleGenerateTasks}
                        disabled={generatingTasks === deliverable?.id}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingTasks === deliverable?.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating Tasks...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Generate Tasks</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Task Statistics */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Task Statistics</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {deliverable?.tasks?.filter((t: Task) => t.status === 'completed').length || 0}
                      </div>
                      <div className="text-sm text-green-700">Completed</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {deliverable?.tasks?.filter((t: Task) => t.status === 'in_progress').length || 0}
                      </div>
                      <div className="text-sm text-blue-700">In Progress</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {deliverable?.tasks?.filter((t: Task) => t.status === 'todo').length || 0}
                      </div>
                      <div className="text-sm text-yellow-700">To Do</div>
                    </div>
                  </div>
                </div>

                {/* Priority Distribution */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Priority Distribution</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">High Priority</span>
                      <span className="text-sm font-medium text-gray-900">
                        {deliverable?.tasks?.filter((t: Task) => t.priority === 'high').length || 0} tasks
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Medium Priority</span>
                      <span className="text-sm font-medium text-gray-900">
                        {deliverable?.tasks?.filter((t: Task) => t.priority === 'medium').length || 0} tasks
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Low Priority</span>
                      <span className="text-sm font-medium text-gray-900">
                        {deliverable?.tasks?.filter((t: Task) => t.priority === 'low').length || 0} tasks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                {!deliverable?.tasks?.length && (
                  <button
                    onClick={handleGenerateTasks}
                    disabled={generatingTasks === deliverable?.id}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingTasks === deliverable?.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Tasks...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Generate Tasks</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {deliverable?.tasks?.length > 0 ? (
                <div className="space-y-4">
                  {deliverable.tasks.map((task: Task) => (
                    <div key={task.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-gray-500">
                          Priority: <span className="font-medium">{task.priority}</span>
                        </div>
                        <div className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(task.status)}`}>
                          {task.status.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-600 mb-4">Generate tasks to get started with this deliverable</p>
                  <button
                    onClick={handleGenerateTasks}
                    disabled={generatingTasks === deliverable?.id}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingTasks === deliverable?.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Tasks...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Generate Tasks</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Deliverable Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Edit Deliverable</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateDeliverable(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deliverable Title</label>
                <input
                  type="text"
                  value={editedDeliverable?.title}
                  onChange={(e) => setEditedDeliverable({ ...editedDeliverable, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  placeholder="Enter deliverable title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editedDeliverable?.description}
                  onChange={(e) => setEditedDeliverable({ ...editedDeliverable, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  placeholder="Enter deliverable description"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 