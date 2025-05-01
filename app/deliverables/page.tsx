"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getDeliverables, generateTasks, type Deliverable, type Task } from "@/app/actions/deliverable-actions"
import { FileText, Plus, AlertCircle, CheckCircle2, Clock, ChevronDown, LayoutGrid, List, ChevronRight } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { format } from "date-fns"

export default function DeliverablesPage() {
  const { user } = useAuth()
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatingTasks, setGeneratingTasks] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')

  useEffect(() => {
    const fetchDeliverables = async () => {
      if (!user?.providerId) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await getDeliverables(user.providerId)
        console.log('Deliverables data:', data)
        setDeliverables(data)
      } catch (err) {
        setError("Failed to load deliverables")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeliverables()
  }, [user?.providerId])

  const handleGenerateTasks = async (proposalId: string, deliverableId: string) => {
    try {
      if (!proposalId) {
        console.error('No proposal ID found for deliverable:', deliverableId)
        setError("Cannot generate tasks: No proposal ID found")
        return
      }

      setGeneratingTasks(deliverableId)
      setError(null)
      console.log('Generating tasks with proposalId:', proposalId, 'deliverableId:', deliverableId)
      
      await generateTasks(proposalId, deliverableId)
      const updatedDeliverables = await getDeliverables(user?.providerId || "")
      setDeliverables(updatedDeliverables)
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return null
      return format(date, 'MMM d')
    } catch {
      return null
    }
  }

  function DeliverableCard({ deliverable, viewMode }: { deliverable: Deliverable, viewMode: 'card' | 'list' }) {
    if (viewMode === 'card') {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 h-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4 h-16">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-medium text-lg text-gray-900">{deliverable.title}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">{deliverable.proposal_content?.proposal?.project?.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">0%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              {/* Tasks Overview */}
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Tasks Overview</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600">0</div>
                    <div className="text-xs text-green-700">Completed</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">0</div>
                    <div className="text-xs text-blue-700">In Progress</div>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-semibold text-yellow-600">0</div>
                    <div className="text-xs text-yellow-700">Pending</div>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(deliverable.status || 'pending')}`}>
                  {(deliverable.status || 'pending')?.replace("_", " ")}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-xs">Last updated</span>
                  <span className="text-xs font-medium">
                    {formatDate(deliverable.updated_at)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => handleGenerateTasks(deliverable.proposal_content?.proposal?.id, deliverable.id)}
                  disabled={generatingTasks === deliverable.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingTasks === deliverable.id ? (
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
            </div>
        </div>
      </div>
    )
    } else {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{deliverable.title}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">{deliverable.proposal_content?.proposal?.project?.name}</p>
                  <span className="text-xs text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">0 tasks</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <span className="text-xs font-medium text-gray-600">0%</span>
              </div>
              <div className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(deliverable.status || 'pending')}`}>
                {(deliverable.status || 'pending')?.replace("_", " ")}
              </div>
              <button
                onClick={() => handleGenerateTasks(deliverable.proposal_content?.proposal?.id, deliverable.id)}
                disabled={generatingTasks === deliverable.id}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingTasks === deliverable.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Generate Tasks</span>
                  </>
                )}
              </button>
            </div>
        </div>
      </div>
    )
  }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-xl">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Deliverables</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <LayoutGrid className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
                  </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
                    </div>
          ) : (
            <div className={`${viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
              {deliverables.map((deliverable) => (
                <DeliverableCard key={deliverable.id} deliverable={deliverable} viewMode={viewMode} />
                        ))}
                      </div>
          )}
        </div>
      </div>
    </div>
  )
} 
