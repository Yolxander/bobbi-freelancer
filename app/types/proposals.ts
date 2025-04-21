export interface Client {
  id: string
  name: string
  email: string
  company?: string
}

export interface Project {
  id: string
  name: string
  description: string
  client_id: string
  created_at: string
  updated_at: string
}

export interface PricingItem {
  item: string
  amount: number
}

export interface ProposalContent {
  title: string
  description: string
  deliverables: string[]
  pricing: PricingItem[]
  payment_schedule: Record<string, number>
  signature: {
    provider: string
    client: string
  }
}

export interface PaymentScheduleItem {
  milestone: string
  percentage: number
}

export interface ParsedContent extends Omit<ProposalContent, 'payment_schedule'> {
  payment_schedule: PaymentScheduleItem[]
}

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected'

export interface Proposal {
  id: string
  project_id: string
  content: ProposalContent
  status: ProposalStatus
  created_at: string
  updated_at: string
} 