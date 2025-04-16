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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TextEditor from './TextEditor'
import DeliverablesInputList from './DeliverablesInputList'
import TimelineInput from './TimelineInput'
import PricingInput from './PricingInput'
import PaymentScheduleInput from './PaymentScheduleInput'
import ClientResponsibilitiesInput from './ClientResponsibilitiesInput'
import TermsAndConditionsInput from './TermsAndConditionsInput'

interface ProposalBuilderModalProps {
  proposal: any
  sections: any[]
  onUpdateProposal: (updates: any) => void
  onClose: () => void
}

export default function ProposalBuilderModal({ 
  proposal, 
  sections,
  onUpdateProposal,
  onClose 
}: ProposalBuilderModalProps) {
  const [activeSection, setActiveSection] = useState(sections[0])

  const renderSectionContent = () => {
    switch (activeSection.id) {
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

        {/* Right Panel */}
        <div className="w-3/5 flex flex-col">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">{activeSection.title}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {activeSection.description && (
              <p className="text-sm text-gray-600 mt-2">{activeSection.description}</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderSectionContent()}
            </div>
          </div>

          <div className="p-6 border-t bg-white">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                className="bg-black text-white hover:bg-black/90"
                onClick={() => {
                  const nextIndex = sections.findIndex(s => s.id === activeSection.id) + 1
                  if (nextIndex < sections.length) {
                    setActiveSection(sections[nextIndex])
                  } else {
                    onClose()
                  }
                }}
              >
                {currentStep === sections.length ? 'Finish' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 