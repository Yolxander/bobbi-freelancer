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
import { createProposal } from "@/app/actions/proposal-actions"

interface BudgetItem {
  item: string;
  amount: number;
}

export default function ProposalPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proposal, setProposal] = useState<Omit<Proposal, "id" | "created_at" | "updated_at">>({
    title: "",
    client_id: "",
    project_id: "",
    status: "draft",
    is_template: false,
    current_version: 1,
    content: {
      id: "",
      proposal_id: "",
      scope_of_work: "",
      deliverables: JSON.stringify([]),
      timeline_start: "",
      timeline_end: "",
      pricing: JSON.stringify([]),
      payment_schedule: JSON.stringify({}),
      signature: JSON.stringify({ provider: "", client: "" })
    },
    client: {
      id: "",
      name: "",
      email: "",
      phone: ""
    },
    project: {
      id: "",
      name: "",
      description: ""
    }
  })
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

        // Ensure deliverables is a JSON string
        const proposalWithParsedDeliverables = {
          ...fetchedProposal,
          content: {
            ...fetchedProposal.content,
            deliverables: typeof fetchedProposal.content.deliverables === 'string' 
              ? fetchedProposal.content.deliverables 
              : JSON.stringify(fetchedProposal.content.deliverables || [])
          }
        }

        setProposal(proposalWithParsedDeliverables)
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
    if (!proposal.title || !proposal.client_id || !proposal.project_id) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const newProposal = await createProposal({
        title: proposal.title,
        client_id: proposal.client_id,
        project_id: proposal.project_id,
        status: proposal.status,
        is_template: proposal.is_template,
        current_version: proposal.current_version,
        content: {
          scope_of_work: proposal.content?.scope_of_work || '',
          deliverables: proposal.content?.deliverables || '[]',
          timeline_start: proposal.content?.timeline_start || '',
          timeline_end: proposal.content?.timeline_end || '',
          pricing: proposal.content?.pricing || '[]',
          payment_schedule: proposal.content?.payment_schedule || '{}',
          signature: proposal.content?.signature || '{"provider":"","client":""}'
        }
      })
      router.push(`/proposals/${newProposal.id}`)
    } catch (error) {
      console.error("Error sending proposal:", error)
      setError("Failed to send proposal. Please try again.")
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

  const handleSend = async () => {
    if (!user || !user.providerId) {
      setError("You must be logged in to send a proposal")
      return
    }

    // Validate required fields
    if (!proposal?.client_id) {
      setError("Please select a client")
      return
    }

    if (!proposal?.project_id) {
      setError("Please select a project")
      return
    }

    if (!proposal?.title) {
      setError("Please enter a proposal title")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const newProposal = await createProposal({
        title: proposal.title,
        client_id: proposal.client_id,
        project_id: proposal.project_id,
        status: proposal.status,
        is_template: proposal.is_template,
        current_version: proposal.current_version,
        content: {
          scope_of_work: proposal.content.scope_of_work || '',
          deliverables: proposal.content.deliverables || '[]',
          timeline_start: proposal.content.timeline_start || '',
          timeline_end: proposal.content.timeline_end || '',
          pricing: proposal.content.pricing || '[]',
          payment_schedule: proposal.content.payment_schedule || '{}',
          signature: proposal.content.signature || '{"provider":"","client":""}'
        }
      })
      router.push(`/proposals/${newProposal.id}`)
    } catch (error) {
      console.error("Error sending proposal:", error)
      setError("Failed to send proposal. Please try again.")
    } finally {
      setIsLoading(false)
    }
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

  const handleDeliverablesChange = (value: string[]) => {
    setProposal(prev => ({
      ...prev,
      content: {
        ...prev.content,
        deliverables: JSON.stringify(value)
      }
    }))
  }

  const handleTimelineChange = (value: { start: string; end: string }) => {
    setProposal(prev => ({
      ...prev,
      content: {
        ...prev.content,
        timeline_start: value.start,
        timeline_end: value.end
      }
    }))
  }

  const handlePricingChange = (value: BudgetItem[]) => {
    setProposal(prev => ({
      ...prev,
      content: {
        ...prev.content,
        pricing: JSON.stringify(value)
      }
    }))
  }

  const handlePaymentScheduleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n')
    const schedule = lines.reduce((acc, line) => {
      const [key, value] = line.split(':').map(s => s.trim())
      if (key && value) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, string>)
    setProposal(prev => ({
      ...prev,
      content: {
        ...prev.content,
        payment_schedule: JSON.stringify(schedule)
      }
    }))
  }

  const handleSignatureChange = (value: { provider: string; client: string }) => {
    setProposal(prev => ({
      ...prev,
      content: {
        ...prev.content,
        signature: JSON.stringify(value)
      }
    }))
  }

  const parseDeliverables = (value: any): string[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('Error parsing deliverables:', e)
      return []
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
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
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

            {/* Project & Client Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Project</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <ProjectSelector
                    value={proposal.project_id}
                    onChange={(projectId) => {
                      if (!projectId) return
                      setProposal({ ...proposal, project_id: projectId })
                    }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Client</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <ClientAutoFill
                    value={proposal.client_id}
                    onChange={(clientId) => {
                      if (!clientId) return
                      setProposal({ ...proposal, client_id: clientId })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Scope of Work</label>
              <textarea
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[200px] text-gray-900 transition-colors"
                value={proposal.content?.scope_of_work || ""}
                onChange={(e) =>
                  setProposal({
                    ...proposal,
                    content: {
                      ...proposal.content,
                      scope_of_work: e.target.value
                    }
                  })
                }
                readOnly={!isEditing}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <DeliverablesInputList
                  value={parseDeliverables(proposal.content?.deliverables)}
                  onChange={handleDeliverablesChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <DateRangePicker
                  value={{
                    start: proposal.content?.timeline_start || "",
                    end: proposal.content?.timeline_end || ""
                  }}
                  onChange={handleTimelineChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <BudgetInputList
                  value={proposal.content?.pricing ? JSON.parse(proposal.content.pricing) : []}
                  onChange={handlePricingChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Schedule</label>
              <textarea
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[200px] text-gray-900 transition-colors"
                value={proposal.content?.payment_schedule 
                  ? Object.entries(JSON.parse(proposal.content.payment_schedule))
                      .map(([key, value]) => `${key}: ${value}`)
                      .join('\n')
                  : ""}
                onChange={handlePaymentScheduleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature Section</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <SignatureBlock
                  value={proposal.content?.signature ? JSON.parse(proposal.content.signature) : { provider: "", client: "" }}
                  onChange={handleSignatureChange}
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