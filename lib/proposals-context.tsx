'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

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
    signature: string
    created_at?: string
    updated_at?: string
  }
  status?: 'draft' | 'sent' | 'accepted' | 'rejected'
  is_template?: boolean
  current_version?: number
}

interface ProposalsContextType {
  proposals: Proposal[]
  addProposal: (proposal: Proposal) => void
  updateProposal: (proposal: Proposal) => void
  deleteProposal: (id: string) => void
}

const ProposalsContext = createContext<ProposalsContextType | undefined>(undefined)

export function ProposalsProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<Proposal[]>([])

  const addProposal = (proposal: Proposal) => {
    setProposals([...proposals, proposal])
  }

  const updateProposal = (updatedProposal: Proposal) => {
    setProposals(proposals.map(proposal => 
      proposal.id === updatedProposal.id ? updatedProposal : proposal
    ))
  }

  const deleteProposal = (id: string) => {
    setProposals(proposals.filter(proposal => proposal.id !== id))
  }

  return (
    <ProposalsContext.Provider value={{ proposals, addProposal, updateProposal, deleteProposal }}>
      {children}
    </ProposalsContext.Provider>
  )
}

export function useProposals() {
  const context = useContext(ProposalsContext)
  if (context === undefined) {
    throw new Error('useProposals must be used within a ProposalsProvider')
  }
  return context
} 