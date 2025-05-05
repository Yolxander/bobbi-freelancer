"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getDeliverables, type Deliverable, type Task } from "@/app/actions/deliverable-actions"
import { FileText, LayoutGrid, List, ArrowRight } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DeliverablesPage() {
  const { user } = useAuth()
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
    const router = useRouter()
    const hasTasks = deliverable.tasks && deliverable.tasks.length > 0

    const handleCardClick = async () => {
      try {
        // Navigate to the deliverable details page
        router.push(`/deliverables/${deliverable.id}`)
      } catch (error) {
        console.error('Error navigating to deliverable:', error)
      }
    }

    if (viewMode === 'card') {
      return (
        <div 
          onClick={handleCardClick}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 h-full cursor-pointer"
        >
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

              {/* See Details Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <span>See Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div 
          onClick={handleCardClick}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
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
                    <span className="text-xs text-gray-500">{deliverable.tasks_count || 0} tasks</span>
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <span>See Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading deliverables...</p>
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
              <h3 className="text-lg font-medium text-gray-700">Error</h3>
              <p className="text-gray-500 mt-2">{error}</p>
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Deliverables</h1>
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode("card")}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    viewMode === "card" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {deliverables.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deliverables yet</h3>
              <p className="text-gray-600">Create a proposal to get started</p>
            </div>
          ) : (
            <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
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
