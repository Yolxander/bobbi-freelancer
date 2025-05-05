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
  LayoutGrid,
  List,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useProposals } from '@/lib/proposals-context'
import { useClients } from '@/lib/clients-context'
import { useProjects } from '@/lib/projects-context'
import { useToast } from '@/lib/toast-context'
import { createProposal } from "@/app/actions/proposal-actions"
import ProjectSelector from "@/components/proposals/ProjectSelector"
import ClientAutoFill from "@/components/proposals/ClientAutoFill"
import TextEditor from '@/components/proposals/TextEditor'
import DeliverablesInputList from '@/components/proposals/DeliverablesInputList'
import TimelineInput from '@/components/proposals/TimelineInput'
import PricingInput from '@/components/proposals/PricingInput'
import PaymentScheduleInput from '@/components/proposals/PaymentScheduleInput'
import ProposalSectionToggle from '@/components/proposals/ProposalSectionToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import TermsAndConditionsInput from '@/components/proposals/TermsAndConditionsInput'
import SignatureInput from '@/components/proposals/SignatureInput'
import ClientResponsibilitiesInput from '@/components/proposals/ClientResponsibilitiesInput'
import ProposalBuilderModal from "@/components/proposals/ProposalBuilderModal"

interface Proposal {
  id?: string
  title: string
  client_id: string
  project_id: string
  content: {
    id?: string
    proposal_id?: string
    scope_of_work: string
    deliverables: string
    timeline_start: string
    timeline_end: string
    pricing: string
    payment_schedule: string
    terms_and_conditions: string
    client_responsibilities: string
    signature: string
    created_at?: string
    updated_at?: string
  }
  status?: 'draft' | 'sent' | 'accepted' | 'rejected'
  is_template?: boolean
  current_version?: number
}

interface ProposalSection {
  id: string
  title: string
  description?: string
  isOpen: boolean
}

export default function NewProposalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addProposal } = useProposals()
  const { clients } = useClients()
  const { projects } = useProjects()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proposal, setProposal] = useState<Proposal>({
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
      pricing: '{}',
      payment_schedule: '{}',
      terms_and_conditions: '',
      client_responsibilities: '{}',
      signature: '{}'
    }
  })

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

  const [viewMode, setViewMode] = useState<'list' | 'modal'>('modal')

  const handleSectionToggle = (id: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, isOpen: !section.isOpen } : section
    ))
  }

  const handleSave = async () => {
    console.log('handleSave function called');
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        console.log('No user found');
        showToast('error', 'Please log in to save proposals');
        return;
      }

      // Validate required fields
      if (!proposal.title) {
        console.log('No title provided');
        showToast('error', 'Please enter a title');
        return;
      }

      if (!proposal.client_id) {
        console.log('No client selected');
        showToast('error', 'Please select a client');
        return;
      }

      if (!proposal.project_id) {
        console.log('No project selected');
        showToast('error', 'Please select a project');
        return;
      }

      // Send raw proposal data to API
      console.log('Sending proposal data to API:', JSON.stringify(proposal, null, 2));
      const newProposal = await createProposal(proposal);
      console.log('Proposal saved successfully:', JSON.stringify(newProposal, null, 2));

      addProposal(newProposal);
      showToast('success', 'Proposal saved successfully');
      router.push('/proposals');
    } catch (error) {
      console.error('Error saving proposal:', error);
      setError('Failed to save proposal. Please try again.');
      showToast('error', 'Failed to save proposal');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleClientChange = (value: string) => {
    setProposal(prev => ({
      ...prev,
      client_id: value,
      project_id: ''
    }))
  }

  const handleProjectChange = (value: string) => {
    setProposal(prev => ({
      ...prev,
      project_id: value
    }))
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
              <button
                type="button"
                className="flex items-center gap-2 bg-gray-50 text-gray-700 rounded-xl px-4 py-2 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 border border-gray-200 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Save Draft button clicked');
                  handleSave();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-700 rounded-full animate-spin" />
                    <span className="text-sm font-medium">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="text-sm font-medium">Save Draft</span>
                  </>
                )}
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

     
            <ProposalBuilderModal
              proposal={proposal}
              sections={sections}
              onUpdateProposal={(updates) => setProposal((prev) => ({ ...prev, ...updates }))}
              onClose={() => setViewMode('list')}
            />
         
        </div>
      </div>
    </div>
  )
} 