export interface ProposalContent {
  deliverables: string[]
  pricing: Array<{ item: string; amount: number }>
  payment_schedule: PaymentScheduleItem[]
  signature: { provider: string; client: string }
  timeline_start: string
  timeline_end: string
  scope_of_work: string
}

export interface PaymentScheduleItem {
  milestone: string
  amount: number
  due_date: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
}

export interface Project {
  id: number
  name: string
  description?: string
  client_id: number
}

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected'

export interface Proposal {
  id: number
  title: string
  status: ProposalStatus
  content: ProposalContent
  client_id: number
  project_id: number
  created_at: string
  updated_at: string
  client?: Client
  project?: Project
}

export interface ParsedContent extends Omit<ProposalContent, 'pricing' | 'payment_schedule'> {
  pricing: Array<{ item: string; amount: number }>
  payment_schedule: PaymentScheduleItem[]
} 