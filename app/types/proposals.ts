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
  id: string
  proposal_id: string
  scope_of_work: string
  deliverables: string
  timeline_start: string
  timeline_end: string
  pricing: string
  payment_schedule: string
  terms_and_conditions: string
  client_responsibilities: string
  signature: string
  created_at: string
  updated_at: string
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