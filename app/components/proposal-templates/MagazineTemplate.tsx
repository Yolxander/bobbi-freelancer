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
  showActionButtons?: boolean
}

export function MagazineTemplate({
  proposal,
  parsedContent,
  onSign,
  onAccept,
  onReject,
  isSigning,
  clientSignature,
  onSignatureChange,
  onCancelSign,
  handleSign,
  showActionButtons
}: ProposalTemplateProps) {
  return (
    <div className="min-h-screen bg-[#1a237e] text-white">
      <div className="max-w-6xl mx-auto py-16 px-8">
        {/* Header Section - Magazine Style */}
        <div className="mb-24">
          <div className="text-6xl font-light text-[#9fa8da] mb-4">
            {proposal.title}
          </div>
          <div className="grid grid-cols-2 gap-16 mt-16">
            <div className="space-y-2">
              <div className="text-sm text-[#9fa8da] uppercase tracking-wider">Client</div>
              <div className="text-2xl font-light">{proposal.client.name}</div>
              <div className="text-[#9fa8da]">{proposal.client.email}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-[#9fa8da] uppercase tracking-wider">Project</div>
              <div className="text-2xl font-light">{proposal.project.name}</div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-24">
          <div className="text-sm text-[#9fa8da] uppercase tracking-wider mb-8">Timeline</div>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <div className="text-4xl font-light">
                {format(new Date(proposal.content.timeline_start), "MMMM d, yyyy")}
              </div>
              <div className="text-[#9fa8da] mt-2">Start Date</div>
            </div>
            <div>
              <div className="text-4xl font-light">
                {format(new Date(proposal.content.timeline_end), "MMMM d, yyyy")}
              </div>
              <div className="text-[#9fa8da] mt-2">End Date</div>
            </div>
          </div>
        </div>

        {/* Scope of Work Section */}
        <div className="mb-24">
          <div className="text-sm text-[#9fa8da] uppercase tracking-wider mb-8">Scope of Work</div>
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="text-xl font-light leading-relaxed">
              {proposal.content.scope_of_work || "No scope of work defined"}
            </div>
          </div>
        </div>

        {/* Deliverables Section */}
        <div className="mb-24">
          <div className="text-sm text-[#9fa8da] uppercase tracking-wider mb-8">Deliverables</div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-6">
            {parsedContent.deliverables.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-[#9fa8da] text-xl">0{index + 1}</div>
                <div className="text-xl font-light">{item}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-24">
          <div className="text-sm text-[#9fa8da] uppercase tracking-wider mb-8">Pricing</div>
          <div className="space-y-6">
            {parsedContent.pricing.map((item, index) => (
              <div key={index} className="flex justify-between items-baseline border-b border-[#9fa8da]/20 pb-4">
                <div className="text-xl font-light">{item.item}</div>
                <div className="text-2xl">${item.amount.toLocaleString()}</div>
              </div>
            ))}
            {parsedContent.pricing.length > 0 && (
              <div className="flex justify-between items-baseline pt-4 border-t border-[#9fa8da]/20">
                <div className="text-xl font-semibold">Total</div>
                <div className="text-2xl font-semibold">
                  ${parsedContent.pricing.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="mb-24">
          <div className="text-sm text-[#9fa8da] uppercase tracking-wider mb-8">Payment Schedule</div>
          <div className="space-y-6">
            {parsedContent.payment_schedule.map((item, index) => (
              <div key={index} className="border-b border-[#9fa8da]/20 pb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <div className="text-xl font-light">{format(new Date(item.due_date), "MMMM d, yyyy")}</div>
                  <div className="text-2xl">${item.amount.toLocaleString()}</div>
                </div>
                <div className="text-[#9fa8da] font-light">{item.milestone}</div>
              </div>
            ))}
            {parsedContent.payment_schedule.length === 0 && (
              <div className="text-[#9fa8da] text-center py-4">
                No payment schedule defined
              </div>
            )}
            {parsedContent.payment_schedule.length > 0 && (
              <div className="flex justify-between items-baseline pt-4 border-t border-[#9fa8da]/20">
                <div className="text-xl font-semibold">Total</div>
                <div className="text-2xl font-semibold">
                  ${parsedContent.payment_schedule.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Client Responsibilities Section */}
        <div className="mb-24">
          <div className="text-sm text-[#9fa8da] uppercase tracking-wider mb-8">Client Responsibilities</div>
          <div className="space-y-6">
            {parsedContent.client_responsibilities.map((item, index) => (
              <div key={index} className="border-b border-[#9fa8da]/20 pb-6">
                <div className="flex items-start gap-4">
                  <div className="text-[#9fa8da] text-xl">0{index + 1}</div>
                  <div className="text-xl font-light">{item}</div>
                </div>
              </div>
            ))}
            {parsedContent.client_responsibilities.length === 0 && (
              <div className="text-[#9fa8da] text-center py-4">
                No client responsibilities defined
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions Section */}
        <div className="mb-24">
          <div className="text-sm text-[#9fa8da] uppercase tracking-wider mb-8">Terms & Conditions</div>
          <div className="space-y-8">
            {Object.entries(parsedContent.terms_and_conditions).map(([key, value], index) => (
              <div key={index} className="border-b border-[#9fa8da]/20 pb-6">
                <div className="text-xl font-light mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-[#9fa8da] font-light">{value}</div>
              </div>
            ))}
            {Object.keys(parsedContent.terms_and_conditions).length === 0 && (
              <div className="text-[#9fa8da] text-center py-4">
                No terms and conditions defined
              </div>
            )}
          </div>
        </div>

        {/* Signature Section */}
        <div className="mb-24">
          <div className="text-sm text-[#9fa8da] uppercase tracking-wider mb-8">Signatures</div>
          <div className="grid grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="text-[#9fa8da]">Provider Signature</div>
              <div className="p-6 border border-[#9fa8da]/20 rounded">
                <div className="font-light text-xl">{parsedContent.signature.provider || "Not signed"}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[#9fa8da]">Client Signature</div>
              {isSigning ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={clientSignature}
                      onChange={(e) => onSignatureChange(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-6 py-4 bg-transparent border border-[#9fa8da]/20 rounded text-xl font-light focus:outline-none focus:border-[#9fa8da]"
                    />
                    <p className="text-sm text-[#9fa8da]">
                      By entering your name above, you agree that this represents your electronic signature.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleSign}
                      disabled={!clientSignature.trim()}
                      className="px-6 py-3 bg-white text-[#1a237e] rounded hover:bg-[#9fa8da] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sign Proposal
                    </button>
                    <button
                      onClick={onCancelSign}
                      className="px-6 py-3 border border-[#9fa8da]/20 rounded hover:bg-[#9fa8da]/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 border border-[#9fa8da]/20 rounded">
                    <div className="font-light text-xl">
                      {parsedContent.signature.client || "Not signed"}
                    </div>
                    {parsedContent.signature.client && (
                      <div className="text-sm text-[#9fa8da] mt-2">
                        Signed electronically
                      </div>
                    )}
                  </div>
                  {!parsedContent.signature.client && (
                    <button
                      onClick={onSign}
                      className="px-6 py-3 bg-white text-[#1a237e] rounded hover:bg-[#9fa8da] transition-colors"
                    >
                      Add Signature
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActionButtons && proposal.status !== 'approved' && proposal.status !== 'rejected' && (
          <div className="flex gap-6">
            <button
              onClick={onAccept}
              disabled={!parsedContent.signature.client}
              className="flex-1 px-6 py-4 bg-white text-[#1a237e] rounded text-xl font-light hover:bg-[#9fa8da] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept Proposal
            </button>
            <button
              onClick={onReject}
              className="flex-1 px-6 py-4 border border-[#9fa8da]/20 rounded text-xl font-light hover:bg-[#9fa8da]/10 transition-colors"
            >
              Reject Proposal
            </button>
          </div>
        )}

        {/* Status Badge */}
        {proposal.status === 'accepted' && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-green-500/20 text-green-500 rounded-full">
              <span className="text-xl font-light">Proposal Accepted</span>
            </div>
          </div>
        )}
        {proposal.status === 'rejected' && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-red-500/20 text-red-500 rounded-full">
              <span className="text-xl font-light">Proposal Rejected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 