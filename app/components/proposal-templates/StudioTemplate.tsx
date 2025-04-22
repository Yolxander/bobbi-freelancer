import { format } from "date-fns"
import { ParsedContent, Proposal } from "@/types/proposals"

interface ProposalTemplateProps {
  proposal: Proposal
  parsedContent: ParsedContent
  onSign: () => void
  onAccept: () => void
  onReject: () => void
  isSigning: boolean
  clientSignature: string
  onSignatureChange: (value: string) => void
  onCancelSign: () => void
  handleSign: () => void
}

export function StudioTemplate({
  proposal,
  parsedContent,
  onSign,
  onAccept,
  onReject,
  isSigning,
  clientSignature,
  onSignatureChange,
  onCancelSign,
  handleSign
}: ProposalTemplateProps) {
  return (
    <div className="min-h-screen bg-[#A39B8B] text-white">
      {/* Hero Section */}
      <div className="h-screen relative">
        <div className="absolute inset-0 p-12 flex flex-col">
          {/* Top Bar */}
          <div className="flex justify-between items-start mb-auto">
            <div>
              <div className="text-sm opacity-80 mb-1">PROPOSAL {String(proposal.id).padStart(2, '0')}</div>
              <div className="text-sm opacity-80">{format(new Date(), "dd.MM.yyyy")}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80 mb-1">{proposal.client?.name}</div>
              <div className="text-sm opacity-80">{proposal.project?.name}</div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-7xl font-light leading-tight mb-8">
              {proposal.title}
            </h1>
            <div className="grid grid-cols-2 gap-24">
              <div className="text-xl opacity-80 leading-relaxed">
                {proposal.content.scope_of_work}
              </div>
              <div className="space-y-8">
                <div>
                  <div className="text-sm opacity-60 mb-2">Timeline</div>
                  <div className="text-lg">
                    {format(new Date(proposal.content.timeline_start), "dd.MM.yy")} —{" "}
                    {format(new Date(proposal.content.timeline_end), "dd.MM.yy")}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-60 mb-2">Investment</div>
                  <div className="text-lg">
                    ${parsedContent.pricing.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-12 py-24 space-y-24">
        {/* Deliverables */}
        <section>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <div className="text-sm opacity-60 sticky top-12">01 Deliverables</div>
            </div>
            <div className="col-span-9">
              <div className="space-y-4">
                {parsedContent.deliverables.map((item, index) => (
                  <div key={index} className="pb-4 border-b border-white/10">
                    <div className="flex items-baseline gap-8">
                      <div className="font-mono opacity-40">{String(index + 1).padStart(2, '0')}</div>
                      <div className="text-xl">{item}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Investment Breakdown */}
        <section>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <div className="text-sm opacity-60 sticky top-12">02 Investment</div>
            </div>
            <div className="col-span-9">
              <div className="space-y-4">
                {parsedContent.pricing.map((item, index) => (
                  <div key={index} className="pb-4 border-b border-white/10">
                    <div className="flex justify-between items-baseline">
                      <div className="text-xl">{item.item}</div>
                      <div className="font-mono text-xl">${item.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-8 flex justify-between items-baseline">
                  <div className="text-xl">Total Investment</div>
                  <div className="font-mono text-2xl">
                    ${parsedContent.pricing.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Schedule */}
        <section>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <div className="text-sm opacity-60 sticky top-12">03 Payment Schedule</div>
            </div>
            <div className="col-span-9">
              <div className="space-y-8">
                {parsedContent.payment_schedule.map((item, index) => (
                  <div key={index} className="pb-8 border-b border-white/10">
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="text-xl">{item.milestone}</div>
                      <div className="font-mono text-xl">${item.amount.toLocaleString()}</div>
                    </div>
                    <div className="font-mono opacity-60">
                      Due {format(new Date(item.due_date), "dd.MM.yy")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Client Responsibilities */}
        <section>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <div className="text-sm opacity-60 sticky top-12">04 Client Responsibilities</div>
            </div>
            <div className="col-span-9">
              <div className="space-y-8">
                {parsedContent.client_responsibilities.map((item, index) => (
                  <div key={index} className="pb-8 border-b border-white/10">
                    <div className="flex items-baseline gap-8">
                      <div className="font-mono opacity-40">{String(index + 1).padStart(2, '0')}</div>
                      <div className="text-xl">{item}</div>
                    </div>
                  </div>
                ))}
                {parsedContent.client_responsibilities.length === 0 && (
                  <div className="text-center py-8 opacity-60">
                    No client responsibilities defined
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Terms & Conditions */}
        <section>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <div className="text-sm opacity-60 sticky top-12">05 Terms & Conditions</div>
            </div>
            <div className="col-span-9">
              <div className="space-y-8">
                {Object.entries(parsedContent.terms_and_conditions).map(([key, value], index) => (
                  <div key={index} className="pb-8 border-b border-white/10">
                    <div className="flex items-baseline gap-8">
                      <div className="font-mono opacity-40">{String(index + 1).padStart(2, '0')}</div>
                      <div>
                        <div className="text-xl mb-2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="opacity-80">{value}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {Object.keys(parsedContent.terms_and_conditions).length === 0 && (
                  <div className="text-center py-8 opacity-60">
                    No terms and conditions defined
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Signatures */}
        <section>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <div className="text-sm opacity-60 sticky top-12">06 Signatures</div>
            </div>
            <div className="col-span-9">
              <div className="grid grid-cols-2 gap-16">
                <div>
                  <div className="text-sm opacity-60 mb-4">Provider</div>
                  <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                    <div className="font-mono text-lg">
                      {parsedContent.signature.provider || "Not signed"}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-60 mb-4">Client</div>
                  {isSigning ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={clientSignature}
                        onChange={(e) => onSignatureChange(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full p-6 bg-white/5 border border-white/10 rounded-lg font-mono text-lg focus:outline-none focus:border-white/30"
                      />
                      <div className="flex gap-4">
                        <button
                          onClick={handleSign}
                          disabled={!clientSignature.trim()}
                          className="px-6 py-3 bg-white text-[#A39B8B] rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sign Proposal
                        </button>
                        <button
                          onClick={onCancelSign}
                          className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                        <div className="font-mono text-lg">
                          {parsedContent.signature.client || "Not signed"}
                        </div>
                      </div>
                      {!parsedContent.signature.client && (
                        <button
                          onClick={onSign}
                          className="mt-4 px-6 py-3 bg-white text-[#A39B8B] rounded-lg hover:bg-white/90 transition-colors"
                        >
                          Add Signature
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3"></div>
            <div className="col-span-9">
              <div className="flex gap-6">
                <button
                  onClick={onAccept}
                  disabled={!parsedContent.signature.client}
                  className="flex-1 px-8 py-4 bg-white text-[#A39B8B] rounded-lg text-xl font-light hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept Proposal
                </button>
                <button
                  onClick={onReject}
                  className="flex-1 px-8 py-4 border border-white/10 rounded-lg text-xl font-light hover:bg-white/5 transition-colors"
                >
                  Reject Proposal
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 