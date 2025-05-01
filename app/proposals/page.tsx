"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Download,
  Send,
  Trash2,
  Eye,
  Pencil,
  ChevronDown,
  Plus,
  AlertCircle,
  Clock,
  Building,
  User,
  CheckCircle2,
  LayoutGrid,
  List,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { getProposals, deleteProposal, sendProposal } from "@/app/actions/proposal-actions"
import { useAuth } from "@/lib/auth-context"

export default function ProposalsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [proposals, setProposals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [proposalLink, setProposalLink] = useState<string>("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getProposals("1")
        setProposals(data)
      } catch (err) {
        setError("Failed to load proposals")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProposals()
  }, [])

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.client_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter
    const matchesDateRange = (!dateRange.start || new Date(proposal.created_at) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(proposal.created_at) <= new Date(dateRange.end))
    return matchesSearch && matchesStatus && matchesDateRange
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSend = async (proposalId: string) => {
    if (!user || !user.providerId) {
      setError("You must be logged in to send a proposal")
      return
    }

    // Validate required fields
    const proposal = proposals.find(p => p.id === proposalId)
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
      const result = await sendProposal(proposalId)
      if (result.success) {
        setProposalLink(result.clientUrl)
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error("Error sending proposal:", error)
      setError("Failed to send proposal. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Proposal Sent Successfully!</h3>
                <p className="text-gray-600 mb-6">
                  The proposal link has been sent to the client. They can now review and sign it online.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => window.open(proposalLink, "_blank")}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    See Proposal
                  </button>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-xl">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Proposals</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
              <Link
                href="/proposals/new"
                className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Proposal</span>
              </Link>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  className="w-full bg-gray-50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 border border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-50 rounded-xl pl-4 pr-10 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 border border-gray-200"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      className="appearance-none bg-gray-50 rounded-xl pl-4 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 border border-gray-200"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                  </div>
                  <span className="text-gray-700">to</span>
                  <div className="relative">
                    <input
                      type="date"
                      className="appearance-none bg-gray-50 rounded-xl pl-4 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 border border-gray-200"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                  </div>
                </div>
              </div>
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
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals.map((proposal) => (
                <div key={proposal.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <FileText className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                          <p className="text-sm text-gray-500">{proposal.client?.name || 'N/A'}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building className="w-4 h-4" />
                        <span>{proposal.project?.name || 'No project'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {proposal.content?.timeline_end 
                            ? new Date(proposal.content.timeline_end).toLocaleDateString()
                            : 'No end date'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/proposals/${proposal.id}/preview`)}
                          className="p-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/proposals/${proposal.id}?edit=true`)}
                          className="p-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(proposal.pdf_url || "#", "_blank")}
                          className="p-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSend(proposal.id)}
                          className="p-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                          title="Send"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this proposal?")) {
                              try {
                                await deleteProposal(proposal.id);
                                const data = await getProposals();
                                setProposals(data);
                              } catch (err) {
                                setError("Failed to delete proposal");
                                console.error(err);
                              }
                            }
                          }}
                          className="p-2 text-gray-700 hover:text-red-700 rounded-xl hover:bg-gray-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Proposals table */
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valid Until
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{proposal.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{proposal.client?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{proposal.project?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {proposal.content?.timeline_end 
                            ? new Date(proposal.content.timeline_end).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(proposal.status)}`}>
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/proposals/${proposal.id}/preview`)}
                            className="p-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/proposals/${proposal.id}?edit=true`)}
                            className="p-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(proposal.pdf_url || "#", "_blank")}
                            className="p-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSend(proposal.id)}
                            className="p-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                            title="Send"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Are you sure you want to delete this proposal?")) {
                                try {
                                  await deleteProposal(proposal.id);
                                  // Refresh the proposals list
                                  const data = await getProposals();
                                  setProposals(data);
                                } catch (err) {
                                  setError("Failed to delete proposal");
                                  console.error(err);
                                }
                              }
                            }}
                            className="p-2 text-gray-700 hover:text-red-700 rounded-xl hover:bg-gray-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 