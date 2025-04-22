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

export function ModernTemplate({
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
    <div className="min-h-screen bg-[#B8B2A7] text-[#2A2A2A]">
      <div className="max-w-6xl mx-auto py-16 px-8">
        {/* Header with Large Letters */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-1 text-8xl font-light">P</div>
          <div className="col-span-11">
            <h1 className="text-6xl font-light mb-4">{proposal.title}</h1>
            <p className="text-xl text-[#2A2A2A]/70">
              A proposal prepared for {proposal.client.name}
            </p>
          </div>
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-1 text-8xl font-light">1</div>
          <div className="col-span-11 grid grid-cols-2 gap-16">
            <div>
              <h2 className="text-sm uppercase tracking-wider mb-4">Project Details</h2>
              <div className="space-y-2">
                <p className="text-2xl font-light">{proposal.project.name}</p>
                <p className="text-[#2A2A2A]/70">{proposal.client.email}</p>
              </div>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-wider mb-4">Timeline</h2>
              <div className="space-y-2">
                <p className="text-2xl font-light">
                  {format(new Date(proposal.content.timeline_start), "MMMM d, yyyy")} -
                  {format(new Date(proposal.content.timeline_end), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-1 text-8xl font-light">2</div>
          <div className="col-span-11">
            <h2 className="text-sm uppercase tracking-wider mb-8">Scope of Work</h2>
            <div className="prose prose-xl max-w-none">
              <div className="text-xl leading-relaxed">
                {proposal.content.scope_of_work || "No scope of work defined"}
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-1 text-8xl font-light">3</div>
          <div className="col-span-11">
            <h2 className="text-sm uppercase tracking-wider mb-8">Deliverables</h2>
            <div className="grid grid-cols-2 gap-x-16 gap-y-6">
              {parsedContent.deliverables.map((item, index) => (
                <div key={index} className="flex items-baseline gap-4">
                  <span className="text-[#2A2A2A]/40 text-xl">0{index + 1}</span>
                  <span className="text-xl">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investment */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-1 text-8xl font-light">4</div>
          <div className="col-span-11">
            <h2 className="text-sm uppercase tracking-wider mb-8">Investment</h2>
            <div className="space-y-6">
              {parsedContent.pricing.map((item, index) => (
                <div key={index} className="flex justify-between items-baseline border-b border-[#2A2A2A]/10 pb-4">
                  <span className="text-xl">{item.item}</span>
                  <span className="text-2xl font-light">${item.amount.toLocaleString()}</span>
                </div>
              ))}
              {parsedContent.pricing.length > 0 && (
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-xl font-medium">Total Investment</span>
                  <span className="text-3xl font-light">
                    ${parsedContent.pricing.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-1 text-8xl font-light">5</div>
          <div className="col-span-11">
            <h2 className="text-sm uppercase tracking-wider mb-8">Payment Schedule</h2>
            <div className="space-y-8">
              {parsedContent.payment_schedule.map((item, index) => (
                <div key={index} className="border-b border-[#2A2A2A]/10 pb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xl">{format(new Date(item.due_date), "MMMM d, yyyy")}</span>
                    <span className="text-2xl font-light">${item.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-[#2A2A2A]/70">{item.milestone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Responsibilities */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-1 text-8xl font-light">6</div>
          <div className="col-span-11">
            <h2 className="text-sm uppercase tracking-wider mb-8">Client Responsibilities</h2>
            <div className="space-y-6">
              {parsedContent.client_responsibilities.map((item: string, index: number) => (
                <div key={index} className="flex items-baseline gap-4 border-b border-[#2A2A2A]/10 pb-4">
                  <span className="text-[#2A2A2A]/40 text-xl">0{index + 1}</span>
                  <span className="text-xl">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-1 text-8xl font-light">7</div>
          <div className="col-span-11">
            <h2 className="text-sm uppercase tracking-wider mb-8">Terms & Conditions</h2>
            <div className="space-y-8">
              {Object.entries(parsedContent.terms_and_conditions).map(([key, value], index: number) => (
                <div key={index} className="border-b border-[#2A2A2A]/10 pb-6">
                  <h3 className="text-xl font-light mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-[#2A2A2A]/70">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-1 text-8xl font-light">8</div>
          <div className="col-span-11">
            <h2 className="text-sm uppercase tracking-wider mb-8">Signatures</h2>
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-4">
                <h3 className="text-sm text-[#2A2A2A]/70">Provider Signature</h3>
                <div className="p-6 border border-[#2A2A2A]/10 rounded-lg bg-white/50">
                  <p className="text-xl font-light">{parsedContent.signature.provider || "Not signed"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm text-[#2A2A2A]/70">Client Signature</h3>
                {isSigning ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={clientSignature}
                        onChange={(e) => onSignatureChange(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-6 py-4 bg-white/50 border border-[#2A2A2A]/10 rounded-lg text-xl font-light focus:outline-none focus:border-[#2A2A2A]/30"
                      />
                      <p className="text-sm text-[#2A2A2A]/70">
                        By entering your name above, you agree that this represents your electronic signature.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleSign}
                        disabled={!clientSignature.trim()}
                        className="px-6 py-3 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#2A2A2A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sign Proposal
                      </button>
                      <button
                        onClick={onCancelSign}
                        className="px-6 py-3 border border-[#2A2A2A]/10 rounded-lg hover:bg-white/50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 border border-[#2A2A2A]/10 rounded-lg bg-white/50">
                      <p className="text-xl font-light">
                        {parsedContent.signature.client || "Not signed"}
                      </p>
                      {parsedContent.signature.client && (
                        <p className="text-sm text-[#2A2A2A]/70 mt-2">
                          Signed electronically
                        </p>
                      )}
                    </div>
                    {!parsedContent.signature.client && (
                      <button
                        onClick={onSign}
                        className="px-6 py-3 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#2A2A2A]/90 transition-colors"
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

        {/* Action Buttons */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-1"></div>
          <div className="col-span-11">
            <div className="flex gap-6">
              <button
                onClick={onAccept}
                disabled={!parsedContent.signature.client}
                className="flex-1 px-6 py-4 bg-[#2A2A2A] text-white rounded-lg text-xl font-light hover:bg-[#2A2A2A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept Proposal
              </button>
              <button
                onClick={onReject}
                className="flex-1 px-6 py-4 border border-[#2A2A2A]/10 rounded-lg text-xl font-light hover:bg-white/50 transition-colors"
              >
                Reject Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 