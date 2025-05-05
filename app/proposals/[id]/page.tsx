"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
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
  CheckCircle2,
  List,
  LayoutGrid,
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
import ProposalBuilderModal from "@/components/proposals/ProposalBuilderModal"

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
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  is_template?: boolean;
  current_version?: number;
  content: ProposalContent;
  created_at: string;
  updated_at: string;
}

interface ProposalSection {
  id: string
  title: string
  description?: string
  isOpen: boolean
}

export default function ProposalPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [proposalLink, setProposalLink] = useState<string>("")
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
  const isEditMode = searchParams.get('edit') === 'true'
  const [viewMode, setViewMode] = useState<'list' | 'modal'>(isEditMode ? 'modal' : 'list')
  const [sections, setSections] = useState<ProposalSection[]>([
    { id: 'scope', title: 'Scope of Work', description: 'Detailed description of the project work and objectives.', isOpen: false },
    { id: 'deliverables', title: 'Deliverables', description: 'List of all items and outcomes to be delivered to the client.', isOpen: true },
    { id: 'timeline', title: 'Timeline', description: 'Project start and end dates.', isOpen: true },
    { id: 'pricing', title: 'Pricing', description: 'Total cost and payment details.', isOpen: true },
    { id: 'payment', title: 'Payment Schedule', description: 'Breakdown of payment milestones.', isOpen: true },
    { id: 'client', title: 'Client Responsibilities', description: 'What the client needs to provide.', isOpen: true },
    { id: 'terms', title: 'Terms & Conditions', description: 'Legal terms and conditions.', isOpen: true },
    { id: 'signature', title: 'Signature', description: 'Provider signature and agreement date.', isOpen: true },
  ])

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
          status: fetchedProposal.status as 'draft' | 'sent' | 'approved' | 'rejected',
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
        if (isEditMode) {
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
  }, [params.id, isEditMode])

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
        status: updatedProposal.status as 'draft' | 'sent' | 'approved' | 'rejected',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "sent":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "approved":
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

  const handlePreview = () => {
    // This would open a preview modal or navigate to a preview page
    console.log("Preview proposal")
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
                {isEditMode ? 'Edit Proposal' : 'Proposal Details'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mr-4">
                <button
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  className={`p-2 rounded ${viewMode === 'modal' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setViewMode('modal')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
              {!isEditMode && (
                <>
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-gray-50 text-gray-700 rounded-xl px-4 py-2 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 border border-gray-200 transition-all"
                    onClick={handlePreview}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Preview</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-gray-50 text-gray-700 rounded-xl px-4 py-2 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 border border-gray-200 transition-all"
                    onClick={handleExportPDF}
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Export PDF</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-gray-50 text-gray-700 rounded-xl px-4 py-2 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 border border-gray-200 transition-all"
                    onClick={handleSend}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-700 rounded-full animate-spin" />
                        <span className="text-sm font-medium">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span className="text-sm font-medium">Send</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 shadow-sm">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {viewMode === 'modal' ? (
            <ProposalBuilderModal
              proposal={proposal}
              sections={sections}
              onUpdateProposal={(updates) => setProposal((prev) => prev ? { ...prev, ...updates } : null)}
              onClose={() => setViewMode('list')}
              isEditMode={isEditMode}
            />
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              {/* Your existing list view content */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 