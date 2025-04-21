"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { use } from "react"
import {
  FileText,
  Download,
  Check,
  X,
  PenLine,
  Building,
  User,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react"
import { getProposal } from "@/app/actions/proposal-actions"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"

interface ProposalContent {
  deliverables: string
  pricing: string
  payment_schedule: string
  signature: string
  timeline_start: string
  timeline_end: string
  scope_of_work: string
}

interface Proposal {
  id: string
  title: string
  status: "draft" | "sent" | "accepted" | "rejected"
  content: ProposalContent
  client_id: string
  project_id: string
  created_at: string
  updated_at: string
  client: {
    id: string
    name: string
    email: string
  }
  project: {
    id: string
    name: string
  }
}

interface PaymentScheduleItem {
  milestone: string
  amount: number
  due_date: string
}

interface ParsedContent {
  deliverables: string[]
  pricing: Array<{ item: string; amount: number }>
  payment_schedule: PaymentScheduleItem[]
  signature: { provider: string; client: string }
}

export default function ProposalPreviewPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const [clientSignature, setClientSignature] = useState("")
  const [parsedContent, setParsedContent] = useState<ParsedContent | null>(null)

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const proposalId = params.id as string
        const data = await getProposal(proposalId)
        
        if (data) {
          setProposal(data as Proposal)
          
          try {
            console.log("Raw proposal data:", data)
            console.log("Raw pricing data:", data.content.pricing)

            // Parse the pricing data
            let pricingData: Array<{ item: string; amount: number }> = []
            if (data.content.pricing) {
              try {
                const parsed = JSON.parse(data.content.pricing)
                // Ensure we have an array of objects with item and amount
                if (Array.isArray(parsed)) {
                  pricingData = parsed.map(item => ({
                    item: item.item || "",
                    amount: typeof item.amount === 'number' ? item.amount : 0
                  }))
                } else if (typeof parsed === 'object' && parsed !== null) {
                  // If it's an object, convert it to an array
                  pricingData = Object.entries(parsed).map(([item, amount]) => ({
                    item,
                    amount: typeof amount === 'number' ? amount : 0
                  }))
                }
              } catch (e) {
                console.error("Error parsing pricing:", e)
                // If parsing fails, use an empty array
                pricingData = []
              }
            }

            // Parse other content with fallbacks
            const deliverables = data.content.deliverables 
              ? JSON.parse(data.content.deliverables) 
              : []

            // Parse payment schedule with new format
            let paymentSchedule: PaymentScheduleItem[] = []
            if (data.content.payment_schedule) {
              try {
                const parsed = JSON.parse(data.content.payment_schedule)
                if (Array.isArray(parsed)) {
                  paymentSchedule = parsed.map(item => ({
                    milestone: item.milestone || '',
                    amount: typeof item.amount === 'number' ? item.amount : Number(item.amount) || 0,
                    due_date: item.due_date || ''
                  }))
                }
              } catch (e) {
                console.error("Error parsing payment schedule:", e)
                paymentSchedule = []
              }
            }

            const signature = data.content.signature 
              ? JSON.parse(data.content.signature) 
              : { provider: "", client: "" }

            // Validate the parsed data
            if (!Array.isArray(deliverables)) {
              throw new Error("Deliverables must be an array")
            }
            if (typeof signature !== 'object' || signature === null) {
              throw new Error("Signature must be an object")
            }

            const parsed: ParsedContent = {
              deliverables,
              pricing: pricingData,
              payment_schedule: paymentSchedule,
              signature
            }

            console.log("Parsed content:", parsed)
            setParsedContent(parsed)
          } catch (err) {
            console.error("Error parsing proposal content:", err)
            setError("Invalid proposal data format")
          }
        }
      } catch (err) {
        setError("Failed to load proposal")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProposal()
  }, [params.id])

  const handleAccept = async () => {
    if (!proposal) return

    try {
      // TODO: Implement accept proposal API call
      console.log("Accepting proposal:", proposal.id)
      // After successful acceptance, redirect to success page
      router.push(`/proposals/${proposal.id}/accepted`)
    } catch (err) {
      console.error("Failed to accept proposal:", err)
      setError("Failed to accept proposal")
    }
  }

  const handleReject = async () => {
    if (!proposal) return

    try {
      // TODO: Implement reject proposal API call
      console.log("Rejecting proposal:", proposal.id)
      // After successful rejection, redirect to rejection page
      router.push(`/proposals/${proposal.id}/rejected`)
    } catch (err) {
      console.error("Failed to reject proposal:", err)
      setError("Failed to reject proposal")
    }
  }

  const handleSign = async () => {
    if (!proposal || !parsedContent || !clientSignature) return

    try {
      // Create updated signature object
      const updatedSignature = {
        ...parsedContent.signature,
        client: clientSignature
      }

      // Convert to string for storage
      const signatureString = JSON.stringify(updatedSignature)

      // Update the proposal with new signature
      const response = await fetch(`/api/proposals/${proposal.id}/signature`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signature: signatureString
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save signature')
      }

      // Update local state with type safety
      setParsedContent({
        ...parsedContent,
        signature: updatedSignature
      } as ParsedContent)
      
      setIsSigning(false)
      setClientSignature("")
    } catch (err) {
      console.error("Failed to sign proposal:", err)
      setError("Failed to save signature. Please try again.")
    }
  }

  const handleDownloadPDF = async () => {
    if (!proposal) return

    try {
      // TODO: Implement PDF download
      console.log("Downloading PDF for proposal:", proposal.id)
    } catch (err) {
      console.error("Failed to download PDF:", err)
      setError("Failed to download PDF")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !proposal || !parsedContent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || "Proposal not found"}</div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

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
                      onChange={(e) => setClientSignature(e.target.value)}
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
                      onClick={() => {
                        setIsSigning(false)
                        setClientSignature("")
                      }}
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
                      onClick={() => setIsSigning(true)}
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
        <div className="flex gap-6">
          <button
            onClick={handleAccept}
            disabled={!parsedContent.signature.client}
            className="flex-1 px-6 py-4 bg-white text-[#1a237e] rounded text-xl font-light hover:bg-[#9fa8da] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept Proposal
          </button>
          <button
            onClick={handleReject}
            className="flex-1 px-6 py-4 border border-[#9fa8da]/20 rounded text-xl font-light hover:bg-[#9fa8da]/10 transition-colors"
          >
            Reject Proposal
          </button>
        </div>
      </div>
    </div>
  )
} 