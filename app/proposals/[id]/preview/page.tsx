"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getProposal } from "@/app/actions/proposal-actions"
import { useAuth } from "@/lib/auth-context"
import { MagazineTemplate } from "@/app/components/proposal-templates/MagazineTemplate"
import { ModernTemplate } from "@/app/components/proposal-templates/ModernTemplate"
import { ParsedContent, Proposal, PaymentScheduleItem } from "@/types/proposals"

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
  const [template, setTemplate] = useState<"magazine" | "modern">("modern")

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
            
            // Helper function to parse JSON string or return existing object
            const parseJSONSafely = (value: any, defaultValue: any) => {
              if (typeof value === 'string') {
                try {
                  return JSON.parse(value)
                } catch (e) {
                  console.error("Error parsing JSON:", e)
                  return defaultValue
                }
              }
              return value || defaultValue
            }

            // Parse all content fields
            const deliverables = parseJSONSafely(data.content.deliverables, [])
            
            // Special handling for double-escaped pricing data
            let pricing: Array<{ item: string; amount: number }> = []
            try {
              // First parse to get the string
              const firstParse = parseJSONSafely(data.content.pricing, '{}')
              // Second parse to get the object
              const rawPricing = parseJSONSafely(firstParse, null)
              console.log("Double parsed pricing:", rawPricing)

              if (rawPricing) {
                const amount = Number(rawPricing.amount) || 0
                pricing = [{
                  item: `Project Fee`,
                  amount: amount
                }]
              }
            } catch (e) {
              console.error("Error parsing pricing:", e)
            }
            
            console.log("Processed pricing:", pricing)
            
            // Parse payment schedule
            let paymentSchedule: PaymentScheduleItem[] = []
            try {
              const parsedSchedule = parseJSONSafely(data.content.payment_schedule, [])
              if (Array.isArray(parsedSchedule)) {
                paymentSchedule = parsedSchedule.map(item => ({
                  milestone: item.milestone || '',
                  amount: Number(item.amount) || 0,
                  due_date: item.due_date || ''
                }))
              }
            } catch (e) {
              console.error("Error parsing payment schedule:", e)
            }

            const signature = parseJSONSafely(data.content.signature, { provider: "", client: "" })

            // Create the parsed content object
            const parsed: ParsedContent = {
              deliverables,
              pricing,
              payment_schedule: paymentSchedule,
              signature,
              timeline_start: data.content.timeline_start || "",
              timeline_end: data.content.timeline_end || "",
              scope_of_work: data.content.scope_of_work || ""
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

  const templateProps = {
    proposal,
    parsedContent,
    onSign: () => setIsSigning(true),
    onAccept: handleAccept,
    onReject: handleReject,
    isSigning,
    clientSignature,
    onSignatureChange: (value: string) => setClientSignature(value),
    onCancelSign: () => {
      setIsSigning(false)
      setClientSignature("")
    },
    handleSign
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setTemplate("magazine")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            template === "magazine"
              ? "bg-white text-black"
              : "bg-black/20 text-white hover:bg-black/30"
          }`}
        >
          Magazine
        </button>
        <button
          onClick={() => setTemplate("modern")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            template === "modern"
              ? "bg-white text-black"
              : "bg-black/20 text-white hover:bg-black/30"
          }`}
        >
          Modern
        </button>
      </div>
      {template === "magazine" ? (
        <MagazineTemplate {...templateProps} />
      ) : (
        <ModernTemplate {...templateProps} />
      )}
    </>
  )
} 