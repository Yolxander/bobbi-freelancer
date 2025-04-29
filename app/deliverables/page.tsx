"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getProposals, Proposal } from "@/app/actions/proposal-actions"
import { toast } from "sonner"

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500"
    case "in-progress":
      return "bg-blue-500"
    case "pending":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export default function DeliverablesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const fetchedProposals = await getProposals()
        setProposals(fetchedProposals)
        setError(null)
      } catch (err) {
        setError("Failed to load proposals")
        toast.error("Failed to load proposals")
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchProposals()
    }
  }, [authLoading, user])

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth")
      }
    }
  }, [user, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading deliverables...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Deliverables</h1>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              New Deliverable
            </Button>
          </div>

          <div className="grid gap-6">
            {proposals.map((proposal) => {
              const content = JSON.parse(proposal.content.deliverables)
              return (
                <Card key={proposal.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{proposal.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          From proposal: {proposal.title}
                        </p>
                      </div>
                      <Badge className={getStatusColor(proposal.status || "pending")}>
                        {proposal.status || "pending"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{proposal.content.scope_of_work}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        Due: {new Date(proposal.content.timeline_end).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {content.length} deliverables
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Deliverables</h3>
                      {content.map((deliverable: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            <span>{deliverable}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 