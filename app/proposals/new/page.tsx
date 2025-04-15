"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Download,
  Send,
  Plus,
  X,
  AlertCircle,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { createProposal, type Proposal } from "@/app/actions/proposal-actions"
import ProjectSelector from "@/components/proposals/ProjectSelector"
import ClientAutoFill from "@/components/proposals/ClientAutoFill"
import TextEditor from "@/components/proposals/TextEditor"
import BudgetInputList from "@/components/proposals/BudgetInputList"
import DateRangePicker from "@/components/proposals/DateRangePicker"
import SignatureBlock from "@/components/proposals/SignatureBlock"

export default function NewProposalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proposal, setProposal] = useState<Partial<Proposal>>({
    title: "",
    client_id: "",
    project_id: null,
    status: "draft",
    content: {
      scopeOfWork: "",
      deliverables: "",
      timeline: {
        start: "",
        end: "",
      },
      budget: [],
      terms: "",
      signature: {
        provider: "",
        client: "",
      },
    },
  })

  const handleSave = async () => {
    if (!user || !user.providerId) {
      setError("You must be logged in to create a proposal")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const newProposal = await createProposal({
        ...proposal,
        provider_id: user.providerId,
      })
      router.push(`/proposals/${newProposal.id}`)
    } catch (error) {
      console.error("Error creating proposal:", error)
      setError("Failed to create proposal. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    // This would open a preview modal or navigate to a preview page
    console.log("Preview proposal")
  }

  const handleExportPDF = async () => {
    // This would generate and download the PDF
    console.log("Export PDF")
  }

  const handleSend = async () => {
    // This would send the proposal to the client
    console.log("Send proposal")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">New Proposal</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full px-4 py-2 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">Save Draft</span>
              </button>
              <button
                className="flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full px-4 py-2 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Preview</span>
              </button>
              <button
                className="flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full px-4 py-2 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export PDF</span>
              </button>
              <button
                className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-colors"
                onClick={handleSend}
              >
                <Send className="w-4 h-4" />
                <span className="text-sm font-medium">Send to Client</span>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 shadow-sm">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Proposal Builder */}
          <div className="space-y-6">
            {/* Project & Client Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProjectSelector
                value={proposal.project_id || ""}
                onChange={(projectId) => setProposal({ ...proposal, project_id: projectId })}
              />
              <ClientAutoFill
                value={proposal.client_id || ""}
                onChange={(clientId) => setProposal({ ...proposal, client_id: clientId })}
              />
            </div>

            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <input
                type="text"
                placeholder="Proposal Title"
                className="w-full text-2xl font-bold text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-700"
                value={proposal.title}
                onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
              />
            </div>

            {/* Scope of Work */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope of Work</h2>
              <TextEditor
                value={proposal.content?.scopeOfWork || ""}
                onChange={(value) =>
                  setProposal({
                    ...proposal,
                    content: { ...proposal.content, scopeOfWork: value },
                  })
                }
              />
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deliverables</h2>
              <TextEditor
                value={proposal.content?.deliverables || ""}
                onChange={(value) =>
                  setProposal({
                    ...proposal,
                    content: { ...proposal.content, deliverables: value },
                  })
                }
              />
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <DateRangePicker
                value={proposal.content?.timeline || { start: "", end: "" }}
                onChange={(value) =>
                  setProposal({
                    ...proposal,
                    content: { ...proposal.content, timeline: value },
                  })
                }
              />
            </div>

            {/* Budget & Pricing */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget & Pricing</h2>
              <BudgetInputList
                value={proposal.content?.budget || []}
                onChange={(value) =>
                  setProposal({
                    ...proposal,
                    content: { ...proposal.content, budget: value },
                  })
                }
              />
            </div>

            {/* Terms & Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms & Notes</h2>
              <TextEditor
                value={proposal.content?.terms || ""}
                onChange={(value) =>
                  setProposal({
                    ...proposal,
                    content: { ...proposal.content, terms: value },
                  })
                }
              />
            </div>

            {/* Signature Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Signature Section</h2>
              <SignatureBlock
                value={proposal.content?.signature || { provider: "", client: "" }}
                onChange={(value) =>
                  setProposal({
                    ...proposal,
                    content: { ...proposal.content, signature: value },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 