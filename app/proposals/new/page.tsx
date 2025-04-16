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
    { 
      id: 'scope', 
      title: 'Scope of Work', 
      description: 'Detailed description of the project work and objectives.',
      isOpen: true 
    },
    { 
      id: 'deliverables', 
      title: 'Deliverables', 
      description: 'List of all items and outcomes to be delivered to the client.',
      isOpen: true 
    },
    { 
      id: 'timeline', 
      title: 'Timeline', 
      description: 'Project start and end dates, including key milestones.',
      isOpen: true 
    },
    { 
      id: 'pricing', 
      title: 'Pricing', 
      description: 'Breakdown of project costs and pricing structure.',
      isOpen: true 
    },
    { 
      id: 'payment', 
      title: 'Payment Schedule', 
      description: 'Payment milestones and terms for the project.',
      isOpen: true 
    },
    { 
      id: 'client', 
      title: 'Client Responsibilities', 
      description: 'What the client must provide and their responsibilities.',
      isOpen: true 
    },
    { 
      id: 'terms', 
      title: 'Terms & Conditions', 
      description: 'Legal and business policies for transparency.',
      isOpen: true 
    },
    { 
      id: 'signature', 
      title: 'Signature', 
      description: 'For formal acceptance of the proposal.',
      isOpen: true 
    }
  ])

  const handleSectionToggle = (id: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, isOpen: !section.isOpen } : section
    ))
  }

  const handleSave = async () => {
    try {
      if (!user) {
        showToast('error', 'Please log in to save proposals')
        return
      }

      // Validate required fields
      if (!proposal.title) {
        showToast('error', 'Please enter a title')
        return
      }

      if (!proposal.client_id) {
        showToast('error', 'Please select a client')
        return
      }

      if (!proposal.project_id) {
        showToast('error', 'Please select a project')
        return
      }

      // Log all field values for debugging
      console.log('Title:', proposal.title)
      console.log('Client ID:', proposal.client_id)
      console.log('Project ID:', proposal.project_id)
      console.log('Scope of Work:', proposal.content.scope_of_work)
      console.log('Deliverables:', proposal.content.deliverables)
      console.log('Timeline Start:', proposal.content.timeline_start)
      console.log('Timeline End:', proposal.content.timeline_end)
      console.log('Pricing:', proposal.content.pricing)
      console.log('Payment Schedule:', proposal.content.payment_schedule)
      console.log('Signature:', proposal.content.signature)

      // Parse deliverables to ensure it's valid JSON
      let parsedDeliverables: string[] = []
      try {
        parsedDeliverables = JSON.parse(proposal.content.deliverables)
        if (!Array.isArray(parsedDeliverables)) {
          showToast('error', 'Deliverables must be an array')
          return
        }
      } catch (error) {
        showToast('error', 'Invalid deliverables format')
        return
      }

      // Parse pricing to ensure it's valid JSON
      let parsedPricing: Record<string, any> = {}
      try {
        parsedPricing = JSON.parse(proposal.content.pricing)
        if (typeof parsedPricing !== 'object') {
          showToast('error', 'Invalid pricing format')
          return
        }
      } catch (error) {
        showToast('error', 'Invalid pricing format')
        return
      }

      // Parse signature to ensure it's valid JSON
      let parsedSignature: Record<string, any> = {}
      try {
        parsedSignature = JSON.parse(proposal.content.signature)
        if (typeof parsedSignature !== 'object') {
          showToast('error', 'Invalid signature format')
          return
        }
      } catch (error) {
        showToast('error', 'Invalid signature format')
        return
      }

      const newProposal = await createProposal({
        ...proposal,
        content: {
          ...proposal.content,
          deliverables: JSON.stringify(parsedDeliverables),
          pricing: JSON.stringify(parsedPricing),
          signature: JSON.stringify(parsedSignature)
        }
      })

      addProposal(newProposal)
      showToast('success', 'Proposal saved successfully')
      router.push('/proposals')
    } catch (error) {
      console.error('Error saving proposal:', error)
      showToast('error', 'Failed to save proposal')
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
                    onChange={handleProjectChange}
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Client</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <ClientAutoFill
                    value={proposal.client_id || ""}
                    onChange={handleClientChange}
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

            {/* Project Overview */}
            <ProposalSectionToggle
              title={sections[0].title}
              description={sections[0].description}
              isOpen={sections[0].isOpen}
              onToggle={() => handleSectionToggle('scope')}
            >
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
            </ProposalSectionToggle>

            {/* Scope of Work */}
            <ProposalSectionToggle
              title={sections[1].title}
              description={sections[1].description}
              isOpen={sections[1].isOpen}
              onToggle={() => handleSectionToggle('deliverables')}
            >
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
            </ProposalSectionToggle>

            {/* Timeline */}
            <ProposalSectionToggle
              title={sections[2].title}
              description={sections[2].description}
              isOpen={sections[2].isOpen}
              onToggle={() => handleSectionToggle('timeline')}
            >
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <TimelineInput
                  startDate={proposal.content.timeline_start}
                  endDate={proposal.content.timeline_end}
                  onChange={(value) =>
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
            </ProposalSectionToggle>

            {/* Budget & Pricing */}
            <ProposalSectionToggle
              title={sections[3].title}
              description={sections[3].description}
              isOpen={sections[3].isOpen}
              onToggle={() => handleSectionToggle('pricing')}
            >
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <PricingInput
                  value={JSON.parse(proposal.content.pricing)}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      content: { ...proposal.content, pricing: JSON.stringify(value) },
                    })
                  }
                />
              </div>
            </ProposalSectionToggle>

            {/* Payment Schedule */}
            <ProposalSectionToggle
              title={sections[4].title}
              description={sections[4].description}
              isOpen={sections[4].isOpen}
              onToggle={() => handleSectionToggle('payment')}
            >
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
            </ProposalSectionToggle>

            {/* Client Responsibilities */}
            <ProposalSectionToggle
              title={sections[5].title}
              description={sections[5].description}
              isOpen={sections[5].isOpen}
              onToggle={() => handleSectionToggle('client')}
            >
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ClientResponsibilitiesInput
                  value={proposal.content.client_responsibilities}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      content: { ...proposal.content, client_responsibilities: value },
                    })
                  }
                />
              </div>
            </ProposalSectionToggle>

            {/* Terms & Conditions */}
            <ProposalSectionToggle
              title={sections[6].title}
              description={sections[6].description}
              isOpen={sections[6].isOpen}
              onToggle={() => handleSectionToggle('terms')}
            >
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <TermsAndConditionsInput
                  value={proposal.content.terms_and_conditions}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      content: { ...proposal.content, terms_and_conditions: value },
                    })
                  }
                />
              </div>
            </ProposalSectionToggle>

            {/* Signature Section */}
            <ProposalSectionToggle
              title={sections[7].title}
              description={sections[7].description}
              isOpen={sections[7].isOpen}
              onToggle={() => handleSectionToggle('signature')}
            >
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <TextEditor
                  value={proposal.content.signature}
                  onChange={(value) =>
                    setProposal({
                      ...proposal,
                      content: { ...proposal.content, signature: value },
                    })
                  }
                />
              </div>
            </ProposalSectionToggle>
          </div>
        </div>
      </div>
    </div>
  )
} 