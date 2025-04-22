export interface Proposal {
  id: string
  title: string
  content: {
    deliverables: string | Array<any>
    pricing: string | { amount: number }
    payment_schedule: string | Array<PaymentScheduleItem>
    signature: string | { provider: string; client: string }
    timeline_start: string
    timeline_end: string
    scope_of_work: string
  }
  template_id?: number
}

export interface PaymentScheduleItem {
  milestone: string
  amount: number
  due_date: string
}

export interface ParsedContent {
  deliverables: Array<any>
  pricing: Array<{ item: string; amount: number }>
  payment_schedule: PaymentScheduleItem[]
  signature: { provider: string; client: string }
  timeline_start: string
  timeline_end: string
  scope_of_work: string
} 