"use client"

import { parseDeliverables, parsePricing, parsePaymentSchedule, parseSignature } from "@/app/actions/proposal-actions"

interface MagazineTemplateProps {
  proposal: any
}

export default function MagazineTemplate({ proposal }: MagazineTemplateProps) {
  const deliverables = parseDeliverables(proposal.content?.deliverables)
  const pricing = parsePricing(proposal.content?.pricing)
  const paymentSchedule = parsePaymentSchedule(proposal.content?.payment_schedule)
  const signature = parseSignature(proposal.content?.signature)

  return (
    <div className="bg-[#1a237e] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{proposal.title}</h1>
          <p className="text-xl opacity-90">Prepared for {proposal.client?.name}</p>
        </div>

        {/* Scope of Work */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Scope of Work</h2>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{proposal.content?.scope_of_work}</p>
          </div>
        </div>

        {/* Deliverables */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Deliverables</h2>
          <ul className="space-y-2">
            {deliverables.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Timeline</h2>
          <div className="flex items-center gap-2">
            <span>Start: {new Date(proposal.content?.timeline_start).toLocaleDateString()}</span>
            <span>→</span>
            <span>End: {new Date(proposal.content?.timeline_end).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg">{pricing.type === 'fixed' ? 'Fixed Rate' : 'Hourly Rate'}</span>
              <span className="text-xl font-bold">
                {pricing.currency} {pricing.amount}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Payment Schedule</h2>
          <div className="space-y-4">
            {Array.isArray(paymentSchedule) && paymentSchedule.map((item: any, index: number) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.milestone}</h3>
                    <p className="text-sm opacity-80">
                      Due: {new Date(item.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xl font-bold">
                    {pricing.currency} {item.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Provider Signature</h3>
              <div className="h-20 border border-white/30 rounded"></div>
              <p className="mt-2 text-sm opacity-80">{signature.provider}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Client Signature</h3>
              <div className="h-20 border border-white/30 rounded"></div>
              <p className="mt-2 text-sm opacity-80">{signature.client}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 