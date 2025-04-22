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
  Eye,
  MoreVertical,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { getProposal, updateProposal, sendProposal, type Proposal } from "@/app/actions/proposal-actions"
import ProjectSelector from "@/components/proposals/ProjectSelector"
import ClientAutoFill from "@/components/proposals/ClientAutoFill"
import DateRangePicker from "@/components/proposals/DateRangePicker"
import BudgetInputList from "@/components/proposals/BudgetInputList"
import SignatureBlock from "@/components/proposals/SignatureBlock"
import DeliverablesInputList from "@/components/proposals/DeliverablesInputList"
import PaymentScheduleInput from "@/components/proposals/PaymentScheduleInput"
import TextEditor from '@/components/proposals/TextEditor'
import TermsAndConditionsInput from '@/components/proposals/TermsAndConditionsInput'
import ClientResponsibilitiesInput from '@/components/proposals/ClientResponsibilitiesInput'

interface BudgetItem {
  item: string;
  amount: number;
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address?: string
}

interface Project {
  id: string
  name: string
  description: string
  status?: string
  start_date?: string
}

interface DeliverablesList {
  value: string;  // JSON string
  onChange: (value: string[]) => void;
}

interface PricingList {
  value: string;  // JSON string
  onChange: (value: string) => void;
}

interface PaymentSchedule {
  value: PaymentMilestone[]
  onChange: (value: PaymentMilestone[]) => void
}

interface PaymentMilestone {
  milestone: string
  amount: number
  due_date: string
}

interface SignatureData {
  value: string;  // JSON string
  onChange: (value: { provider: string; client: string }) => void;
}

interface ProposalContent {
  id?: string;
  scope_of_work: string;
  deliverables: string;  // JSON string
  timeline_start: string;
  timeline_end: string;
  pricing: string;  // JSON string
  payment_schedule: string;  // JSON string
  terms_and_conditions: string;
  client_responsibilities: string;  // JSON string
  signature: string;  // JSON string
}

interface ProposalData {
  id: string;
  title: string;
  client_id: string;
  project_id: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  is_template?: boolean;
  current_version?: number;
  content: ProposalContent;
  created_at: string;
  updated_at: string;
}

export default function ProposalPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proposal, setProposal] = useState<Omit<ProposalData, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    client_id: '',
    project_id: '',
    status: 'draft',
    is_template: false,
    current_version: 1,
    content: {
      scope_of_work: '',
      deliverables: '[]',
      timeline_start: '',
      timeline_end: '',
      pricing: '[]',
      payment_schedule: '{}',
      terms_and_conditions: '',
      client_responsibilities: '{}',
      signature: '{}'
    }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentMilestone[]>(() => {
    try {
      return JSON.parse(proposal.content.payment_schedule || '[]')
    } catch {
      return []
    }
  })

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

        const parsedData = {
          title: fetchedProposal.title,
          client_id: fetchedProposal.client_id,
          project_id: fetchedProposal.project_id,
          status: fetchedProposal.status as 'draft' | 'sent' | 'accepted' | 'rejected',
          is_template: fetchedProposal.is_template,
          current_version: fetchedProposal.current_version,
          content: {
            scope_of_work: fetchedProposal.content.scope_of_work || '',
            deliverables: typeof fetchedProposal.content.deliverables === 'string' 
              ? fetchedProposal.content.deliverables 
              : JSON.stringify(fetchedProposal.content.deliverables || []),
            timeline_start: fetchedProposal.content.timeline_start,
            timeline_end: fetchedProposal.content.timeline_end,
            pricing: typeof fetchedProposal.content.pricing === 'string'
              ? fetchedProposal.content.pricing
              : JSON.stringify(fetchedProposal.content.pricing || []),
            payment_schedule: typeof fetchedProposal.content.payment_schedule === 'string'
              ? fetchedProposal.content.payment_schedule
              : JSON.stringify(fetchedProposal.content.payment_schedule || []),
            terms_and_conditions: fetchedProposal.content.terms_and_conditions || '',
            client_responsibilities: typeof fetchedProposal.content.client_responsibilities === 'string'
              ? fetchedProposal.content.client_responsibilities
              : JSON.stringify(fetchedProposal.content.client_responsibilities || {}),
            signature: typeof fetchedProposal.content.signature === 'string'
              ? fetchedProposal.content.signature
              : JSON.stringify(fetchedProposal.content.signature || { provider: '', client: '' })
          }
        }

        setProposal(parsedData)
        
        // Check if we're in edit mode from the URL
        const searchParams = new URLSearchParams(window.location.search)
        if (searchParams.get('edit') === 'true') {
          setIsEditing(true)
        }
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
      const updatedProposal = await updateProposal(params.id as string, {
        title: proposal.title,
        client_id: proposal.client_id,
        project_id: proposal.project_id,
        content: {
          scope_of_work: proposal.content.scope_of_work,
          deliverables: proposal.content.deliverables,
          timeline_start: proposal.content.timeline_start,
          timeline_end: proposal.content.timeline_end,
          pricing: proposal.content.pricing,
          payment_schedule: proposal.content.payment_schedule,
          terms_and_conditions: proposal.content.terms_and_conditions,
          client_responsibilities: proposal.content.client_responsibilities,
          signature: proposal.content.signature
        }
      })

      // Convert the response to match our state type
      const convertedProposal = {
        title: updatedProposal.title,
        client_id: updatedProposal.client_id,
        project_id: updatedProposal.project_id,
        status: updatedProposal.status as 'draft' | 'sent' | 'accepted' | 'rejected',
        is_template: updatedProposal.is_template,
        current_version: updatedProposal.current_version,
        content: {
          scope_of_work: updatedProposal.content.scope_of_work || '',
          deliverables: updatedProposal.content.deliverables,
          timeline_start: updatedProposal.content.timeline_start,
          timeline_end: updatedProposal.content.timeline_end,
          pricing: updatedProposal.content.pricing,
          payment_schedule: updatedProposal.content.payment_schedule,
          terms_and_conditions: updatedProposal.content.terms_and_conditions || '',
          client_responsibilities: updatedProposal.content.client_responsibilities || '{}',
          signature: updatedProposal.content.signature
        }
      }
      
      setProposal(convertedProposal)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating proposal:", error)
      setError("Failed to update proposal. Please try again.")
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
      const result = await sendProposal(params.id as string)
      if (result.success) {
        // Show success message with the client URL
        alert(`Proposal sent successfully! Client URL: ${result.clientUrl}`)
        router.push(`/proposals/${params.id}`)
      }
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

  const handleDeliverablesChange: DeliverablesList['onChange'] = (value) => {
    setProposal(prev => ({
      ...prev,
      content: {
        ...prev.content,
        deliverables: typeof value === 'string' ? value : JSON.stringify(value)
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

  const handlePricingChange: PricingList['onChange'] = (value) => {
    if (isEditing) {
      setProposal(prev => ({
        ...prev,
        content: {
          ...prev.content,
          pricing: value
        }
      }))
    }
  }

  const handlePaymentScheduleChange: PaymentSchedule['onChange'] = (value) => {
    if (isEditing) {
      setPaymentSchedule(value)
      setProposal({
        ...proposal,
        content: {
          ...proposal.content,
          payment_schedule: JSON.stringify(value)
        }
      })
    }
  }

  const handleSignatureChange: SignatureData['onChange'] = (value) => {
    setProposal(prev => ({
      ...prev,
      content: {
        ...prev.content,
        signature: typeof value === 'string' ? value : JSON.stringify(value)
      }
    }))
  }

  const handleScopeOfWorkChange = (value: string) => {
    setProposal(prev => ({
      ...prev,
      content: {
        ...prev.content,
        scope_of_work: value
      }
    }))
  }

  const handleTermsAndConditionsChange = (value: string) => {
    if (isEditing) {
      setProposal(prev => ({
        ...prev,
        content: {
          ...prev.content,
          terms_and_conditions: value
        }
      }))
    }
  }

  const handleClientResponsibilitiesChange = (value: string) => {
    setProposal(prev => ({
      ...prev,
      content: {
        ...prev.content,
        client_responsibilities: value
      }
    }))
  }

  const parseDeliverables = (value: any): string[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'object') return value
    try {
      return JSON.parse(value)
    } catch (e) {
      console.error('Error parsing deliverables:', e)
      return []
    }
  }

  const parsePaymentSchedule = (value: any): PaymentMilestone[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('Error parsing payment schedule:', e)
      return []
    }
  }

  const parsePricing = (value: any): BudgetItem[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.error('Error parsing pricing:', e)
        return []
      }
    }
    return []
  }

  const parseSignature = (value: any) => {
    if (!value) return { provider: '', client: '' }
    if (typeof value === 'object') return value
    try {
      return JSON.parse(value)
    } catch (e) {
      console.error('Error parsing signature:', e)
      return { provider: '', client: '' }
    }
  }

  const parseTermsAndConditions = (value: any) => {
    if (!value) return {
      revisionLimits: '',
      intellectualProperty: '',
      confidentiality: '',
      termination: '',
      liability: '',
      governingLaw: ''
    }
    try {
      return JSON.parse(value)
    } catch (e) {
      console.error('Error parsing terms and conditions:', e)
      return {
        revisionLimits: '',
        intellectualProperty: '',
        confidentiality: '',
        termination: '',
        liability: '',
        governingLaw: ''
      }
    }
  }

  const parseClientResponsibilities = (value: any): string[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'object') return Object.values(value)
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
      if (typeof parsed === 'object') return Object.values(parsed)
      return []
    } catch (e) {
      console.error('Error parsing client responsibilities:', e)
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/proposals')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Proposals</span>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isEditing ? 'Edit Proposal' : 'View Proposal'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={handleSend}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send to Client</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Project</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <ProjectSelector
                    value={proposal.project_id}
                    onChange={(projectId) => {
                      if (!projectId) return
                      setProposal({ ...proposal, project_id: projectId })
                    }}
                    readOnly={!isEditing}
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
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Proposal Content */}
            <div className="mt-8 space-y-6">
              {/* Scope of Work */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Scope of Work</h3>
                {isEditing ? (
                  <TextEditor
                    value={proposal.content.scope_of_work}
                    onChange={handleScopeOfWorkChange}
                  />
                ) : (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: proposal.content.scope_of_work }} />
                )}
              </div>

              {/* Deliverables */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Deliverables</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <DeliverablesInputList
                    value={parseDeliverables(proposal.content.deliverables)}
                    onChange={handleDeliverablesChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Timeline</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  {isEditing ? (
                    <DateRangePicker
                      value={{
                        start: proposal.content.timeline_start,
                        end: proposal.content.timeline_end
                      }}
                      onChange={handleTimelineChange}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span>{new Date(proposal.content.timeline_start).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span>{new Date(proposal.content.timeline_end).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  {isEditing ? (
                    <BudgetInputList
                      value={typeof proposal.content.pricing === 'string' ? proposal.content.pricing : JSON.stringify(proposal.content.pricing)}
                      onChange={handlePricingChange}
                    />
                  ) : (
                    <div className="space-y-2">
                      {parsePricing(proposal.content.pricing).map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.item}</span>
                          <span>${item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 font-semibold">
                        <div className="flex justify-between">
                          <span>Total</span>
                          <span>${parsePricing(proposal.content.pricing).reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Schedule</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  {isEditing ? (
                    <PaymentScheduleInput
                      value={parsePaymentSchedule(proposal.content.payment_schedule)}
                      onChange={(value) => {
                        if (isEditing) {
                          setProposal({
                            ...proposal,
                            content: {
                              ...proposal.content,
                              payment_schedule: JSON.stringify(value)
                            }
                          })
                        }
                      }}
                    />
                  ) : (
                    <div className="space-y-2">
                      {parsePaymentSchedule(proposal.content.payment_schedule).map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.milestone}</span>
                          <div className="flex flex-col items-end">
                            <span>${item.amount.toLocaleString()}</span>
                            <span className="text-sm text-gray-500">Due: {new Date(item.due_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Client Responsibilities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Client Responsibilities</h3>
                {isEditing ? (
                  <ClientResponsibilitiesInput
                    value={proposal.content.client_responsibilities}
                    onChange={handleClientResponsibilitiesChange}
                  />
                ) : (
                  <div className="prose max-w-none">
                    {parseClientResponsibilities(proposal.content.client_responsibilities).map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Terms & Conditions</h3>
                {isEditing ? (
                  <TermsAndConditionsInput
                    value={proposal.content.terms_and_conditions}
                    onChange={handleTermsAndConditionsChange}
                  />
                ) : (
                  <div className="prose max-w-none space-y-4">
                    {Object.entries(parseTermsAndConditions(proposal.content.terms_and_conditions)).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p>{value as string}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Signature */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Signature</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <SignatureBlock
                    value={parseSignature(proposal.content.signature)}
                    onChange={handleSignatureChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 