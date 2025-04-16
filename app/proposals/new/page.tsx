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
import DeliverablesInputList from "@/components/proposals/DeliverablesInputList"
import DateRangePicker from "@/components/proposals/DateRangePicker"
import SignatureBlock from "@/components/proposals/SignatureBlock"
import PaymentScheduleInput from "@/components/proposals/PaymentScheduleInput"

export default function NewProposalPage() {
  const router = useRouter()
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
      payment_schedule: JSON.stringify([]),
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

  const handleSave = async () => {
    if (!user || !user.providerId) {
      setError("You must be logged in to create a proposal")
      return
    }

    // Debug all fields
    console.log('=== Proposal Data Debug ===')
    console.log('Title:', proposal.title)
    console.log('Client ID:', proposal.client_id)
    console.log('Project ID:', proposal.project_id)
    console.log('Scope of Work:', proposal.content.scope_of_work)
    
    let deliverables
    try {
      deliverables = JSON.parse(proposal.content.deliverables)
      console.log('Deliverables:', deliverables)
    } catch (e) {
      console.error('Error parsing deliverables:', e)
      setError("Invalid deliverables format")
      return
    }

    console.log('Timeline Start:', proposal.content.timeline_start)
    console.log('Timeline End:', proposal.content.timeline_end)

    let pricing
    try {
      pricing = JSON.parse(proposal.content.pricing)
      console.log('Pricing:', pricing)
    } catch (e) {
      console.error('Error parsing pricing:', e)
      setError("Invalid pricing format")
      return
    }

    let signature
    try {
      signature = JSON.parse(proposal.content.signature)
      console.log('Signature:', signature)
    } catch (e) {
      console.error('Error parsing signature:', e)
      setError("Invalid signature format")
      return
    }

    // Validate required fields
    if (!proposal.title) {
      setError("Please enter a proposal title")
      return
    }

    if (!proposal.client_id) {
      setError("Please select a client")
      return
    }

    if (!proposal.project_id) {
      setError("Please select a project")
      return
    }

    if (!proposal.content.scope_of_work) {
      setError("Please enter the scope of work")
      return
    }

    if (!Array.isArray(deliverables)) {
      console.error('Deliverables is not an array:', deliverables)
      setError("Invalid deliverables format")
      return
    }

    if (deliverables.length === 0) {
      setError("Please add at least one deliverable")
      return
    }

    if (!proposal.content.timeline_start || !proposal.content.timeline_end) {
      setError("Please select a valid timeline")
      return
    }

    if (!Array.isArray(pricing)) {
      console.error('Pricing is not an array:', pricing)
      setError("Invalid pricing format")
      return
    }

    if (pricing.length === 0) {
      setError("Please add at least one pricing item")
      return
    }

    if (!signature.provider || !signature.client) {
      setError("Please fill in both provider and client signature fields")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const newProposal = await createProposal({
        title: proposal.title,
        client_id: proposal.client_id,
        project_id: proposal.project_id,
        status: "draft",
        is_template: false,
        current_version: 1,
        content: {
          scope_of_work: proposal.content.scope_of_work,
          deliverables: proposal.content.deliverables,
          timeline_start: proposal.content.timeline_start,
          timeline_end: proposal.content.timeline_end,
          pricing: proposal.content.pricing,
          payment_schedule: "{}", // Empty payment schedule for now
          signature: proposal.content.signature
        }
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
    if (!user || !user.providerId) {
      setError("You must be logged in to send a proposal")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const newProposal = await createProposal({
        title: proposal.title,
        client_id: proposal.client_id,
        project_id: proposal.project_id,
        content: {
          scope_of_work: proposal.content.scope_of_work,
          deliverables: JSON.parse(proposal.content.deliverables),
          timeline_start: proposal.content.timeline_start,
          timeline_end: proposal.content.timeline_end,
          pricing: JSON.parse(proposal.content.pricing),
          payment_schedule: JSON.parse(proposal.content.payment_schedule),
          signature: JSON.parse(proposal.content.signature)
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
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">New Proposal</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 bg-gray-50 text-gray-700 rounded-xl px-4 py-2 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 border border-gray-200 transition-all"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">Save Draft</span>
              </button>
              <button
                className="flex items-center gap-2 bg-gray-50 text-gray-700 rounded-xl px-4 py-2 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 border border-gray-200 transition-all"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Preview</span>
              </button>
              <button
                className="flex items-center gap-2 bg-gray-50 text-gray-700 rounded-xl px-4 py-2 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 border border-gray-200 transition-all"
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export PDF</span>
              </button>
              <button
                className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 transition-colors"
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
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Project</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <ProjectSelector
                    value={proposal.project_id || ""}
                    onChange={(projectId) => setProposal({ ...proposal, project_id: projectId })}
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Client</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <ClientAutoFill
                    value={proposal.client_id || ""}
                    onChange={(clientId) => setProposal({ ...proposal, client_id: clientId })}
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <input
                type="text"
                placeholder="Enter proposal title ...."
                className="w-full text-2xl font-bold text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-700 transition-colors"
                value={proposal.title}
                onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
              />
            </div>

            {/* Scope of Work */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope of Work</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <TextEditor
                  value={proposal.content.scope_of_work}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      content: { ...proposal.content, scope_of_work: value },
                    })
                  }
                />
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deliverables</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <DeliverablesInputList
                  value={JSON.parse(proposal.content.deliverables)}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      content: { ...proposal.content, deliverables: JSON.stringify(value) },
                    })
                  }
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <DateRangePicker
                  value={{
                    start: proposal.content.timeline_start,
                    end: proposal.content.timeline_end
                  }}
                  onChange={(value: { start: string; end: string }) =>
                    setProposal({
                      ...proposal,
                      content: {
                        ...proposal.content,
                        timeline_start: value.start,
                        timeline_end: value.end
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Budget & Pricing */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget & Pricing</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <BudgetInputList
                  value={JSON.parse(proposal.content.pricing)}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      content: { ...proposal.content, pricing: JSON.stringify(value) },
                    })
                  }
                />
              </div>
            </div>

            {/* Payment Schedule */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Schedule</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <PaymentScheduleInput
                  value={JSON.parse(proposal.content.payment_schedule)}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      content: { ...proposal.content, payment_schedule: JSON.stringify(value) },
                    })
                  }
                />
              </div>
            </div>

            {/* Signature Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Signature Section</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <SignatureBlock
                  value={JSON.parse(proposal.content.signature)}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      content: { ...proposal.content, signature: JSON.stringify(value) },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 