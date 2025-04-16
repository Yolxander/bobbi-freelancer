"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Download,
  FileText,
  Edit,
  Save,
  Trash2,
  Send,
  Calendar,
  User,
  Building,
  AlertCircle,
  ChevronLeft,
  Clock,
  Pencil,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { getProposal, updateProposal, type Proposal } from "@/app/actions/proposal-actions"
import ProjectSelector from "@/components/proposals/ProjectSelector"
import ClientAutoFill from "@/components/proposals/ClientAutoFill"
import DateRangePicker from "@/components/proposals/DateRangePicker"
import BudgetInputList from "@/components/proposals/BudgetInputList"
import SignatureBlock from "@/components/proposals/SignatureBlock"
import DeliverablesInputList from "@/components/proposals/DeliverablesInputList"

export default function ProposalPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setIsLoading(true)
        const proposalId = params.id as string
        const fetchedProposal = await getProposal(proposalId)
        console.log('Fetched proposal:', fetchedProposal)
        
        if (!fetchedProposal) {
          setError("Proposal not found")
          return
        }

        // Transform the API response to match our component's expected structure
        const transformedProposal = {
          id: fetchedProposal.id,
          client_id: fetchedProposal.client_id,
          project_id: fetchedProposal.project_id,
          title: fetchedProposal.title,
          status: fetchedProposal.status,
          is_template: fetchedProposal.is_template || false,
          current_version: fetchedProposal.current_version || 1,
          created_at: fetchedProposal.created_at,
          updated_at: fetchedProposal.updated_at,
          scope_of_work: fetchedProposal.scope_of_work || "",
          deliverables: Array.isArray(fetchedProposal.deliverables) 
            ? fetchedProposal.deliverables.filter(Boolean)
            : [],
          timeline_start: fetchedProposal.timeline_start || "",
          timeline_end: fetchedProposal.timeline_end || "",
          pricing: Array.isArray(fetchedProposal.pricing)
            ? fetchedProposal.pricing
            : [],
          payment_schedule: fetchedProposal.payment_schedule || {},
          signature: fetchedProposal.signature || JSON.stringify({ provider: "", client: "" }),
          client: fetchedProposal.client || null,
          project: fetchedProposal.project || null,
          versions: Array.isArray(fetchedProposal.versions) ? fetchedProposal.versions : []
        }
        
        console.log('Transformed proposal:', transformedProposal)
        setProposal(transformedProposal)
      } catch (err) {
        console.error('Error fetching proposal:', err)
        setError("Failed to load proposal")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProposal()
    }
  }, [params.id])

  const handleSave = async () => {
    if (!proposal) return

    try {
      setIsLoading(true)
      const updatedProposal = await updateProposal(proposal.id, proposal)
      console.log('Updated proposal:', updatedProposal)
      setProposal(updatedProposal)
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating proposal:', err)
      setError("Failed to update proposal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!proposal) return

    try {
      setIsLoading(true)
      // TODO: Implement delete functionality
      router.push("/proposals")
    } catch (err) {
      console.error('Error deleting proposal:', err)
      setError("Failed to delete proposal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = () => {
    console.log("Exporting to PDF...")
  }

  const handleSend = () => {
    console.log("Sending proposal...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "sent":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-sm max-w-md w-full text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Proposal</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => router.push("/proposals")}
              className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Proposals
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-sm max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Proposal Not Found</h2>
            <button
              onClick={() => router.push("/proposals")}
              className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Proposals
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/proposals")}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Proposal Details</h1>
            </div>

            <div className="flex items-center gap-3">
              {!isEditing && (
                <>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={handleSend}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send to Client</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span>Edit Proposal</span>
                  </>
                )}
              </button>
              {!isEditing && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Proposal Details */}
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-900 transition-colors"
                  value={proposal.title}
                  onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className={`p-2 rounded-lg border ${getStatusColor(proposal.status)} transition-colors`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <ClientAutoFill
                    value={proposal.client_id}
                    onChange={(value) => setProposal({ ...proposal, client_id: value })}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <ProjectSelector
                    value={proposal.project_id}
                    onChange={(value) => setProposal({ ...proposal, project_id: value })}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Scope of Work</label>
              <textarea
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[200px] text-gray-900 transition-colors"
                value={proposal.scope_of_work}
                onChange={(e) =>
                  setProposal({
                    ...proposal,
                    scope_of_work: e.target.value,
                  })
                }
                readOnly={!isEditing}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <DeliverablesInputList
                  value={proposal.deliverables || []}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      deliverables: value,
                    })
                  }
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <DateRangePicker
                  value={{
                    start: proposal.timeline_start || "",
                    end: proposal.timeline_end || ""
                  }}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      timeline_start: value.start,
                      timeline_end: value.end,
                    })
                  }
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <BudgetInputList
                  value={proposal.pricing || []}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      pricing: value,
                    })
                  }
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Schedule</label>
              <textarea
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[200px] text-gray-900 transition-colors"
                value={proposal.payment_schedule ? 
                  Object.entries(proposal.payment_schedule)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n')
                  : ""}
                onChange={(e) => {
                  const lines = e.target.value.split('\n')
                  const schedule = lines.reduce((acc, line) => {
                    const [key, value] = line.split(':').map(s => s.trim())
                    if (key && value) {
                      acc[key] = value
                    }
                    return acc
                  }, {} as Record<string, string>)
                  setProposal({
                    ...proposal,
                    payment_schedule: schedule,
                  })
                }}
                readOnly={!isEditing}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature Section</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <SignatureBlock
                  value={proposal.signature}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      signature: JSON.stringify(value),
                    })
                  }
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 