'use client'

import * as React from "react"
import { useState } from "react"
import {
  X,
  Info,
  List,
  Calendar,
  Settings,
  Share2,
  Wand2,
  PenTool,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import TextEditor from './TextEditor'
import DeliverablesInputList from './DeliverablesInputList'
import TimelineInput from './TimelineInput'
import PricingInput from './PricingInput'
import PaymentScheduleInput from './PaymentScheduleInput'
import ClientResponsibilitiesInput from './ClientResponsibilitiesInput'
import TermsAndConditionsInput from './TermsAndConditionsInput'
import { useRouter } from 'next/navigation'

interface ProposalBuilderModalProps {
  proposal: any
  sections: any[]
  onUpdateProposal: (updates: any) => void
  onClose: () => void
}

export default function ProposalBuilderModal({ 
  proposal, 
  sections: initialSections,
  onUpdateProposal,
  onClose 
}: ProposalBuilderModalProps) {
  const router = useRouter()
  const [creationMode, setCreationMode] = useState<'choice' | 'manual' | 'generate'>('choice')
  const [projectDescription, setProjectDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingSection, setGeneratingSection] = useState<string | null>(null)

  // Define sections based on creation mode
  const sections = creationMode === 'generate' 
    ? [
        { 
          id: 'client_request', 
          title: 'Enter Client Request', 
          description: 'Describe your project or client request in detail.', 
          isOpen: true 
        },
        ...initialSections
      ]
    : initialSections

  const [activeSection, setActiveSection] = useState(sections[0])

  const handleClose = () => {
    onClose()
    router.push('/proposals')
  }

  const handleGenerateProposal = async () => {
    setIsGenerating(true)
    setGeneratingSection('all')
    // Dummy generation - in real implementation, this would call an API
    setTimeout(() => {
      // Simulate API response
      const generatedContent = {
        scope_of_work: "Generated scope of work based on your description...",
        deliverables: JSON.stringify([
          { title: "Deliverable 1", description: "Generated deliverable 1" },
          { title: "Deliverable 2", description: "Generated deliverable 2" }
        ]),
        timeline_start: new Date().toISOString(),
        timeline_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        pricing: JSON.stringify({
          total: 5000,
          currency: "USD",
          breakdown: [
            { item: "Service 1", amount: 2500 },
            { item: "Service 2", amount: 2500 }
          ]
        }),
        payment_schedule: JSON.stringify([
          { milestone: "Initial Payment", amount: 2500, due: "Upon signing" },
          { milestone: "Final Payment", amount: 2500, due: "Upon completion" }
        ]),
        client_responsibilities: JSON.stringify([
          "Provide necessary information",
          "Review and approve deliverables"
        ]),
        terms_and_conditions: "Generated terms and conditions...",
        signature: JSON.stringify({
          providerName: "",
          agreementDate: ""
        })
      }

      onUpdateProposal({
        content: generatedContent
      })
      setIsGenerating(false)
      setGeneratingSection(null)
    }, 2000)
  }

  const handleGenerateSection = async (sectionId: string) => {
    setGeneratingSection(sectionId)
    // Dummy generation for specific section
    setTimeout(() => {
      let generatedContent = {}
      switch (sectionId) {
        case 'scope':
          generatedContent = { scope_of_work: "Generated scope of work for this section..." }
          break
        case 'deliverables':
          generatedContent = { 
            deliverables: JSON.stringify([
              { title: "Generated Deliverable", description: "Generated description" }
            ])
          }
          break
        case 'timeline':
          generatedContent = {
            timeline_start: new Date().toISOString(),
            timeline_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
          break
        case 'pricing':
          generatedContent = {
            pricing: JSON.stringify({
              total: 3000,
              currency: "USD",
              breakdown: [{ item: "Generated Service", amount: 3000 }]
            })
          }
          break
        case 'payment':
          generatedContent = {
            payment_schedule: JSON.stringify([
              { milestone: "Generated Milestone", amount: 1500, due: "Upon completion" }
            ])
          }
          break
        case 'client':
          generatedContent = {
            client_responsibilities: JSON.stringify([
              "Generated responsibility 1",
              "Generated responsibility 2"
            ])
          }
          break
        case 'terms':
          generatedContent = { terms_and_conditions: "Generated terms and conditions for this section..." }
          break
      }

      onUpdateProposal({
        content: { ...proposal.content, ...generatedContent }
      })
      setGeneratingSection(null)
    }, 1000)
  }

  const renderContent = () => {
    if (creationMode === 'choice') {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Choose Creation Method</h2>
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setCreationMode('generate')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <Wand2 className="h-12 w-12 text-purple-600" />
                <h3 className="text-lg font-medium">Generate Proposal</h3>
                <p className="text-gray-600">Let AI help you create a proposal based on your project description</p>
              </div>
            </Card>
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setCreationMode('manual')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <PenTool className="h-12 w-12 text-blue-600" />
                <h3 className="text-lg font-medium">Create Manually</h3>
                <p className="text-gray-600">Build your proposal step by step with full control</p>
              </div>
            </Card>
          </div>
        </div>
      )
    }

    const renderGenerateButton = (sectionId: string) => {
      if (creationMode !== 'generate' || sectionId === 'client_request') return null
      
      return (
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3"
          onClick={() => handleGenerateSection(sectionId)}
          disabled={generatingSection === sectionId}
        >
          {generatingSection === sectionId ? (
            <div className="w-5 h-5 border-2 border-purple-600 rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Generate</span>
            </>
          )}
        </Button>
      )
    }

    return (
      <>
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-lg font-medium">{activeSection.title}</h2>
              {activeSection.description && (
                <p className="text-sm text-gray-600 mt-2">{activeSection.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {renderGenerateButton(activeSection.id)}
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            {renderSectionContent()}
          </div>
        </div>

        <div className="p-6 border-t bg-white">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            {activeSection.id === 'client_request' ? (
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleGenerateProposal}
                disabled={!projectDescription.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Proposal
                  </>
                )}
              </Button>
            ) : (
              <Button 
                className="bg-black text-white hover:bg-black/90"
                onClick={() => {
                  const nextIndex = sections.findIndex(s => s.id === activeSection.id) + 1
                  if (nextIndex < sections.length) {
                    setActiveSection(sections[nextIndex])
                  } else {
                    handleClose()
                  }
                }}
              >
                {currentStep === sections.length ? 'Finish' : 'Save & Continue'}
              </Button>
            )}
          </div>
        </div>
      </>
    )
  }

  const renderSectionContent = () => {
    switch (activeSection.id) {
      case 'client_request':
        return (
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Project Description</h3>
              <p className="text-sm text-gray-600">
                Describe your project or client request in detail. Bobbi will use this information to automatically generate all the proposal content, including scope of work, deliverables, timeline, pricing, and more.
              </p>
            </div>
            <Textarea
              placeholder="Enter your project description here..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        )
      case 'scope':
        return (
          <TextEditor
            value={proposal.content.scope_of_work}
            onChange={(value) =>
              onUpdateProposal({
                content: { ...proposal.content, scope_of_work: value },
              })
            }
          />
        )
      case 'deliverables':
        return (
          <DeliverablesInputList
            value={JSON.parse(proposal.content.deliverables)}
            onChange={(value) =>
              onUpdateProposal({
                content: { ...proposal.content, deliverables: JSON.stringify(value) },
              })
            }
          />
        )
      case 'timeline':
        return (
          <TimelineInput
            startDate={proposal.content.timeline_start}
            endDate={proposal.content.timeline_end}
            onChange={(value) =>
              onUpdateProposal({
                content: {
                  ...proposal.content,
                  timeline_start: value.start,
                  timeline_end: value.end
                },
              })
            }
          />
        )
      case 'pricing':
        return (
          <PricingInput
            value={JSON.parse(proposal.content.pricing)}
            onChange={(value) =>
              onUpdateProposal({
                content: { ...proposal.content, pricing: JSON.stringify(value) },
              })
            }
          />
        )
      case 'payment':
        return (
          <PaymentScheduleInput
            value={JSON.parse(proposal.content.payment_schedule)}
            onChange={(value) =>
              onUpdateProposal({
                content: { ...proposal.content, payment_schedule: JSON.stringify(value) },
              })
            }
          />
        )
      case 'client':
        return (
          <ClientResponsibilitiesInput
            value={proposal.content.client_responsibilities}
            onChange={(value) =>
              onUpdateProposal({
                content: { ...proposal.content, client_responsibilities: value },
              })
            }
          />
        )
      case 'terms':
        return (
          <TermsAndConditionsInput
            value={proposal.content.terms_and_conditions}
            onChange={(value) =>
              onUpdateProposal({
                content: { ...proposal.content, terms_and_conditions: value },
              })
            }
          />
        )
      case 'signature':
        return (
          <TextEditor
            value={proposal.content.signature}
            onChange={(value) =>
              onUpdateProposal({
                content: { ...proposal.content, signature: value },
              })
            }
          />
        )
      default:
        return null
    }
  }

  const currentStep = sections.findIndex(section => section.id === activeSection.id) + 1

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="flex w-full max-w-5xl h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Panel */}
        {creationMode !== 'choice' && (
          <div className="w-2/5 flex flex-col border-r">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <List className="h-5 w-5" />
                <h2 className="text-lg font-medium">Proposal Builder</h2>
                <Info className="h-5 w-5 text-gray-400" />
              </div>

              <p className="text-gray-600 mb-8">
                Build your proposal section by section. Click on each section to edit its content.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-2">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition-colors ${
                      activeSection.id === section.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveSection(section)}
                  >
                    <List className="h-5 w-5" />
                    <div className="flex-1">
                      <span className="font-medium">{section.title}</span>
                      {section.description && (
                        <p className="text-sm text-gray-500">{section.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t bg-white">
              <div className="flex items-center">
                <span className="text-sm text-gray-600">Step {currentStep} of {sections.length}</span>
              </div>
              <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-1 bg-purple-600 rounded-full transition-all" 
                  style={{ width: `${(currentStep / sections.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Panel */}
        <div className={`flex flex-col ${creationMode === 'choice' ? 'w-full' : 'w-3/5'}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
} 