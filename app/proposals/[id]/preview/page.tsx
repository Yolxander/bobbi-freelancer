"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getProposal, addSignature, acceptProposal, rejectProposal, sendProposal, convertToTemplate } from "@/app/actions/proposal-actions"
import { useAuth } from "@/lib/auth-context"
import { MagazineTemplate } from "@/app/components/proposal-templates/MagazineTemplate"
import { ModernTemplate } from "@/app/components/proposal-templates/ModernTemplate"
import { MinimalTemplate } from "@/app/components/proposal-templates/MinimalTemplate"
import { StudioTemplate } from "@/app/components/proposal-templates/StudioTemplate"
import { ParsedContent, Proposal, PaymentScheduleItem } from "@/types/proposals"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, Send, MoreVertical, Palette, CheckCircle2 } from "lucide-react"

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
  const [template, setTemplate] = useState<"magazine" | "modern" | "minimal" | "studio">("modern")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [proposalLink, setProposalLink] = useState<string>("")
  const [isConvertingTemplate, setIsConvertingTemplate] = useState(false)

  // Map template names to IDs
  const templateIds = {
    magazine: 1,
    modern: 2,
    minimal: 3,
    studio: 4
  }

  // Reverse mapping of IDs to template names
  const templateIdToName = {
    1: "magazine",
    2: "modern",
    3: "minimal",
    4: "studio"
  } as const

  // Initialize template state based on proposal's template_id
  useEffect(() => {
    if (proposal?.template_id) {
      const templateName = templateIdToName[proposal.template_id as keyof typeof templateIdToName]
      if (templateName) {
        setTemplate(templateName)
      }
    }
  }, [proposal?.template_id])

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
              const rawPaymentSchedule = parseJSONSafely(data.content.payment_schedule, [])
              if (Array.isArray(rawPaymentSchedule)) {
                paymentSchedule = rawPaymentSchedule.map(item => ({
                  milestone: item.milestone || '',
                  amount: Number(item.amount) || 0,
                  due_date: item.due_date || ''
                }))
              }
            } catch (e) {
              console.error("Error parsing payment schedule:", e)
            }

            // Parse client responsibilities
            let clientResponsibilities: string[] = []
            try {
              const rawResponsibilities = parseJSONSafely(data.content.client_responsibilities, {})
              if (typeof rawResponsibilities === 'object' && rawResponsibilities !== null) {
                // Convert object to array of strings
                clientResponsibilities = Object.entries(rawResponsibilities).map(([key, value]) => {
                  const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
                  return `${formattedKey}: ${value}`
                })
              } else if (Array.isArray(rawResponsibilities)) {
                clientResponsibilities = rawResponsibilities
              } else if (typeof rawResponsibilities === 'string') {
                clientResponsibilities = [rawResponsibilities]
              }
            } catch (e) {
              console.error("Error parsing client responsibilities:", e)
            }

            // Parse terms and conditions
            let termsAndConditions: { [key: string]: string } = {}
            try {
              const rawTerms = parseJSONSafely(data.content.terms_and_conditions, {})
              if (typeof rawTerms === 'object' && rawTerms !== null) {
                termsAndConditions = rawTerms
              } else if (typeof rawTerms === 'string') {
                termsAndConditions = { 'General Terms': rawTerms }
              }
            } catch (e) {
              console.error("Error parsing terms and conditions:", e)
            }

            // Parse signature
            const signature = parseJSONSafely(data.content.signature, { provider: '', client: '' })
            
            setParsedContent({
              deliverables,
              pricing,
              payment_schedule: paymentSchedule,
              signature,
              timeline_start: data.content.timeline_start || "",
              timeline_end: data.content.timeline_end || "",
              scope_of_work: data.content.scope_of_work || "",
              client_responsibilities: clientResponsibilities,
              terms_and_conditions: termsAndConditions
            })
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
      // Add the client signature
      const signature = await addSignature(proposal.id, user?.id || "", "client", clientSignature)

      // Update local state with type safety
      setParsedContent({
        ...parsedContent,
        signature: {
          ...parsedContent.signature,
          client: clientSignature
        }
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
      const result = await sendProposal(proposal.id)
      if (result.success) {
        setProposalLink(result.clientUrl)
        setShowSuccessModal(true)
      }
    } catch (err) {
      console.error("Failed to send proposal:", err)
      setError("Failed to send proposal")
    }
  }

  const handleReject = async () => {
    if (!proposal) return

    try {
      const updatedProposal = await rejectProposal(proposal.id)

    } catch (err) {
      console.error("Failed to reject proposal:", err)
      setError("Failed to reject proposal")
    }
  }

  const handleTemplateChange = async (newTemplate: "magazine" | "modern" | "minimal" | "studio") => {
    if (!proposal) return;
    
    try {
      setIsConvertingTemplate(true);
      const updatedProposal = await convertToTemplate(proposal.id, templateIds[newTemplate]);
      // Update the local proposal state with the new template_id
      setProposal(prev => prev ? { ...prev, template_id: updatedProposal.template_id } : null);
      // Update the template state immediately
      setTemplate(newTemplate);
    } catch (error) {
      console.error('Failed to convert template:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsConvertingTemplate(false);
    }
  };

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
    handleSign,
    showActionButtons: false
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm border rounded-xl transition-all ${
              template === "minimal" 
                ? "bg-black/10 hover:bg-black/20 border-black/20 text-black" 
                : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
            }`}>
              <Palette className="w-4 h-4" />
              <span>Theme</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 bg-transparent border-none z-50">
            <div className="grid grid-cols-2 gap-2 border-none">
              <button
                onClick={() => handleTemplateChange("magazine")}
                disabled={isConvertingTemplate}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all bg-[#1a237e] ${
                  template === "magazine"
                    ? "border-2 border-white"
                    : "border border-[#1a237e]/30"
                }`}
              >
                <span className="text-sm text-white">Magazine</span>
              </button>
              <button
                onClick={() => handleTemplateChange("modern")}
                disabled={isConvertingTemplate}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all bg-[#B8B2A7] ${
                  template === "modern"
                    ? "border-2 border-white"
                    : "border border-[#B8B2A7]/30"
                }`}
              >
                <span className="text-sm text-white">Modern</span>
              </button>
              <button
                onClick={() => handleTemplateChange("minimal")}
                disabled={isConvertingTemplate}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all bg-white ${
                  template === "minimal"
                    ? "border-2 border-gray-800"
                    : "border border-gray-200"
                }`}
              >
                <span className="text-sm text-gray-800">Minimal</span>
              </button>
              <button
                onClick={() => handleTemplateChange("studio")}
                disabled={isConvertingTemplate}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all bg-[#A39B8B] ${
                  template === "studio"
                    ? "border-2 border-white"
                    : "border border-[#A39B8B]/30"
                }`}
              >
                <span className="text-sm text-white">Studio</span>
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm border rounded-xl transition-all ${
              template === "minimal" 
                ? "bg-black/10 hover:bg-black/20 border-black/20 text-black" 
                : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
            }`}>
              <MoreVertical className="w-4 h-4" />
              <span>Actions</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 bg-transparent border-none z-50">
            <div className="grid grid-cols-1 gap-2 border-none">
              <button
                onClick={() => router.push(`/proposals/${params.id}`)}
                className={`flex items-center gap-2 p-3 rounded-lg transition-all backdrop-blur-sm ${
                  template === "minimal"
                    ? "bg-black/10 hover:bg-black/20 border-black/20"
                    : "bg-[#1a237e]/20 hover:bg-[#1a237e]/30 border-[#1a237e]/30"
                }`}
              >
                <ChevronLeft className={`w-4 h-4 ${template === "minimal" ? "text-black" : "text-white"}`} />
                <span className={`text-sm ${template === "minimal" ? "text-black" : "text-white"}`}>Back to Edit</span>
              </button>
              <button
                onClick={handleAccept}
                className={`flex items-center gap-2 p-3 rounded-lg transition-all backdrop-blur-sm ${
                  template === "minimal"
                    ? "bg-black/10 hover:bg-black/20 border-black/20"
                    : "bg-[#B8B2A7]/20 hover:bg-[#B8B2A7]/30 border-[#B8B2A7]/30"
                }`}
              >
                <Send className={`w-4 h-4 ${template === "minimal" ? "text-black" : "text-white"}`} />
                <span className={`text-sm ${template === "minimal" ? "text-black" : "text-white"}`}>Send to Client</span>
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

       
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-6 max-w-md w-full mx-4 rounded-xl backdrop-blur-xl ${
            template === "minimal" 
              ? "bg-white/20 border border-white/20" 
              : "bg-[#1a237e]/20 border border-white/20"
          }`}>
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className={`w-12 h-12 mb-4 ${
                template === "minimal" ? "text-gray-900" : "text-white"
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                template === "minimal" ? "text-gray-900" : "text-white"
              }`}>
                Proposal Sent Successfully!
              </h3>
              <p className={`mb-6 ${
                template === "minimal" ? "text-gray-700" : "text-white/90"
              }`}>
                The proposal link has been sent to the client. They can now review and sign it online.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => window.open(proposalLink, "_blank")}
                  className={`px-4 py-2 rounded-xl transition-all backdrop-blur-sm ${
                    template === "minimal"
                      ? "bg-gray-900/80 text-white hover:bg-gray-900 border border-gray-800/20"
                      : "bg-white/20 text-white hover:bg-white/30 border border-white/20"
                  }`}
                >
                  See Proposal
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className={`px-4 py-2 rounded-xl transition-all backdrop-blur-sm ${
                    template === "minimal"
                      ? "bg-white/20 text-gray-900 hover:bg-white/30 border border-gray-200/20"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(() => {
        const templateName = proposal?.template_id ? templateIdToName[proposal.template_id as keyof typeof templateIdToName] : template
        switch (templateName) {
          case "magazine":
            return <MagazineTemplate {...templateProps} />
          case "modern":
            return <ModernTemplate {...templateProps} />
          case "minimal":
            return <MinimalTemplate {...templateProps} />
          case "studio":
            return <StudioTemplate {...templateProps} />
          default:
            return <ModernTemplate {...templateProps} />
        }
      })()}
    </>
  )
} 