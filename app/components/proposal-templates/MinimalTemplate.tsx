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

export function MinimalTemplate({
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
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-5xl mx-auto py-16 px-8">
        {/* Issue Number and Title */}
        <div className="mb-12">
          <div className="text-sm text-gray-500 mb-2">PROPOSAL {String(proposal.id).padStart(2, '0')}</div>
          <div className="text-2xl text-gray-500 mb-8 max-w-3xl">
            {proposal.title.toUpperCase()}
          </div>
        </div>

        {/* Large Reference Number */}
        <div className="flex gap-8 mb-16">
          <div className="text-[180px] leading-none font-light text-gray-300">
            PR:{String(proposal.id).padStart(2, '0')}
          </div>
          <div className="text-[180px] leading-none font-light text-gray-300">
            '{new Date().getFullYear().toString().slice(-2)}
          </div>
        </div>

        {/* Description */}
        <div className="text-xl text-gray-600 leading-relaxed mb-24 max-w-3xl">
          A detailed proposal prepared for {proposal.client?.name}, outlining the scope, deliverables, and terms for the {proposal.project?.name} project.
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Image/Info */}
          <div className="col-span-5 space-y-8">
            <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-4"></div>
            <div className="text-sm text-gray-500">CLIENT REFERENCE</div>
            <div className="space-y-1">
              <div>{proposal.client?.name}</div>
              <div className="text-gray-500">{proposal.client?.email}</div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="col-span-7">
            <div className="space-y-12">
              {/* Project Overview */}
              <div>
                <div className="text-2xl text-gray-500 mb-4">
                  SCOPE OF WORK
                </div>
                <div className="prose prose-lg text-gray-600">
                  {proposal.content.scope_of_work}
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <div className="text-2xl text-gray-500 mb-4">
                  DELIVERABLES
                </div>
                <div className="space-y-4">
                  {parsedContent.deliverables.map((item, index) => (
                    <div key={index} className="flex items-baseline gap-4">
                      <div className="text-gray-400 font-mono w-6">{String(index + 1).padStart(2, '0')}</div>
                      <div className="text-lg">{item}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment */}
              <div>
                <div className="text-2xl text-gray-500 mb-4">
                  INVESTMENT
                </div>
                <div className="space-y-4">
                  {parsedContent.pricing.map((item, index) => (
                    <div key={index} className="flex justify-between items-baseline border-b border-gray-100 pb-4">
                      <div className="text-lg">{item.item}</div>
                      <div className="text-xl font-mono">${item.amount.toLocaleString()}</div>
                    </div>
                  ))}
                  {parsedContent.pricing.length > 0 && (
                    <div className="flex justify-between items-baseline pt-4">
                      <div className="text-lg font-medium">TOTAL</div>
                      <div className="text-2xl font-mono">
                        ${parsedContent.pricing.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <div className="text-2xl text-gray-500 mb-4">
                  TIMELINE
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">START</div>
                    <div className="text-xl font-mono">
                      {format(new Date(proposal.content.timeline_start), "dd.MM.yy")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">END</div>
                    <div className="text-xl font-mono">
                      {format(new Date(proposal.content.timeline_end), "dd.MM.yy")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div>
                <div className="text-2xl text-gray-500 mb-4">
                  PAYMENT SCHEDULE
                </div>
                <div className="space-y-6">
                  {parsedContent.payment_schedule.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-6">
                      <div className="flex justify-between items-baseline mb-2">
                        <div className="text-lg font-mono">{format(new Date(item.due_date), "dd.MM.yy")}</div>
                        <div className="text-xl font-mono">${item.amount.toLocaleString()}</div>
                      </div>
                      <div className="text-gray-600">{item.milestone}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Responsibilities */}
              <div>
                <div className="text-2xl text-gray-500 mb-4">
                  CLIENT RESPONSIBILITIES
                </div>
                <div className="space-y-4">
                  {parsedContent.client_responsibilities.map((item, index) => (
                    <div key={index} className="flex items-baseline gap-4 border-b border-gray-100 pb-4">
                      <div className="text-gray-400 font-mono w-6">{String(index + 1).padStart(2, '0')}</div>
                      <div className="text-lg">{item}</div>
                    </div>
                  ))}
                  {parsedContent.client_responsibilities.length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                      No client responsibilities defined
                    </div>
                  )}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <div className="text-2xl text-gray-500 mb-4">
                  TERMS & CONDITIONS
                </div>
                <div className="space-y-6">
                  {Object.entries(parsedContent.terms_and_conditions).map(([key, value], index) => (
                    <div key={index} className="border-b border-gray-100 pb-6">
                      <div className="flex items-baseline gap-4 mb-2">
                        <div className="text-gray-400 font-mono w-6">{String(index + 1).padStart(2, '0')}</div>
                        <div>
                          <div className="text-lg font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-gray-600 mt-1">{value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {Object.keys(parsedContent.terms_and_conditions).length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                      No terms and conditions defined
                    </div>
                  )}
                </div>
              </div>

              {/* Signatures */}
              <div>
                <div className="text-2xl text-gray-500 mb-4">
                  SIGNATURES
                </div>
                <div className="space-y-8">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">PROVIDER</div>
                    <div className="p-4 border border-gray-200 rounded bg-gray-50">
                      <div className="font-mono text-lg">
                        {parsedContent.signature.provider || "Not signed"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">CLIENT</div>
                    {isSigning ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={clientSignature}
                          onChange={(e) => onSignatureChange(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full p-4 border border-gray-200 rounded font-mono text-lg focus:outline-none focus:border-gray-400"
                        />
                        <div className="flex gap-4">
                          <button
                            onClick={handleSign}
                            disabled={!clientSignature.trim()}
                            className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Sign Proposal
                          </button>
                          <button
                            onClick={onCancelSign}
                            className="px-6 py-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="p-4 border border-gray-200 rounded bg-gray-50">
                          <div className="font-mono text-lg">
                            {parsedContent.signature.client || "Not signed"}
                          </div>
                        </div>
                        {!parsedContent.signature.client && (
                          <button
                            onClick={onSign}
                            className="mt-4 px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
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
              {showActionButtons && (
                <div className="flex gap-6">
                  <button
                    onClick={onAccept}
                    disabled={!parsedContent.signature.client}
                    className="flex-1 px-6 py-4 bg-gray-900 text-white rounded text-xl font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Accept Proposal
                  </button>
                  <button
                    onClick={onReject}
                    className="flex-1 px-6 py-4 border border-gray-200 rounded text-xl font-light hover:bg-gray-50 transition-colors"
                  >
                    Reject Proposal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-8 text-sm text-gray-500">
            <div>
              <div className="font-mono mb-2">REFERENCE</div>
              <div>Proposal Preview</div>
            </div>
            <div>
              <div className="font-mono mb-2">DATE</div>
              <div>{format(new Date(), "dd.MM.yyyy")}</div>
            </div>
            <div>
              <div className="font-mono mb-2">VERSION</div>
              <div>{proposal.current_version || "1.0"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 