import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ProposalSectionToggleProps {
  title: string
  description?: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

export default function ProposalSectionToggle({ 
  title, 
  description, 
  isOpen, 
  onToggle, 
  children 
}: ProposalSectionToggleProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      {isOpen && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
} 