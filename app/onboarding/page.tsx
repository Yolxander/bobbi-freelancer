"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Mail, Phone, Globe, FileText, BriefcaseBusiness, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OnboardingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [providerTypes, setProviderTypes] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    provider_type_id: "",
    name: "",
    email: "",
    phone: "",
    website: "",
    description: "",
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    } else if (user) {
      // Pre-fill email and name if available
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        name: user.name || "",
      }))
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Fetch provider types from the external API
    const fetchProviderTypes = async () => {
      try {
        console.log("Fetching provider types from external API...")

        const response = await fetch(`${API_BASE_URL}/provider-types`)

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`)
        }

        const data = await response.json()
        console.log("Provider types API response:", data)

        if (Array.isArray(data)) {
          console.log("Setting provider types from API:", data)
          setProviderTypes(data)
        } else if (data && Array.isArray(data.data)) {
          console.log("Setting provider types from API data property:", data.data)
          setProviderTypes(data.data)
        } else {
          console.error("Unexpected API response format:", data)
          // Add some fallback provider types for testing
          setProviderTypes([
            { id: "1", name: "Web Developer" },
            { id: "2", name: "Designer" },
            { id: "3", name: "Consultant" },
          ])
          setError("Using fallback provider types. API returned unexpected format.")
        }
      } catch (err) {
        console.error("Error fetching provider types from API:", err)
        // Add some fallback provider types for testing
        setProviderTypes([
          { id: "1", name: "Web Developer" },
          { id: "2", name: "Designer" },
          { id: "3", name: "Consultant" },
        ])
        setError("Failed to load provider types from API. Using fallback data.")
      }
    }

    fetchProviderTypes()
  }, [API_BASE_URL])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")

      // Include the user ID in the data being sent
      const dataWithUserId = {
        ...formData,
        user_id: user.id, // Add the user ID to the form data
      }

      console.log("Submitting provider data:", dataWithUserId)

      const response = await fetch(`${API_BASE_URL}/providers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithUserId),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create provider profile")
      }

      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (err) {
      console.error("Error creating provider profile:", err)
      setError(err.message || "Failed to create provider profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            1
          </div>
          <div className={`w-12 h-1 ${currentStep >= 2 ? "bg-gray-900" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            2
          </div>
          <div className={`w-12 h-1 ${currentStep >= 3 ? "bg-gray-900" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            3
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-xl mr-2">
                <div className="w-5 h-5 flex items-center justify-center font-bold text-gray-800">JT</div>
              </div>
              <span className="font-medium text-gray-800">Jointri</span>
            </Link>
            <div className="text-sm text-gray-500">Complete Your Profile</div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-8">
              <CardTitle className="text-2xl font-bold text-center">Set Up Your Provider Profile</CardTitle>
              <CardDescription className="text-center text-gray-500 mt-2">
                Complete your profile to start managing clients and projects
              </CardDescription>
              {renderStepIndicator()}
            </CardHeader>
            <CardContent className="p-8">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="pl-10 py-6 bg-gray-50 border-gray-200 rounded-xl focus:ring-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="pl-10 py-6 bg-gray-50 border-gray-200 rounded-xl focus:ring-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(123) 456-7890"
                          className="pl-10 py-6 bg-gray-50 border-gray-200 rounded-xl focus:ring-gray-200"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 px-8 rounded-xl transition-colors"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-gray-700 font-medium">
                        Website
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com"
                          className="pl-10 py-6 bg-gray-50 border-gray-200 rounded-xl focus:ring-gray-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provider_type_id" className="text-gray-700 font-medium">
                        Provider Type
                      </Label>
                      <div className="relative">
                        <div className="absolute top-0 left-0 bottom-0 pl-3 flex items-center pointer-events-none">
                          <BriefcaseBusiness className="h-5 w-5 text-gray-400" />
                        </div>
                        {providerTypes.length === 0 && (
                          <div className="text-sm text-amber-600 mb-2">
                            Loading provider types... If this persists, please refresh the page.
                          </div>
                        )}
                        <Select
                          value={formData.provider_type_id}
                          onValueChange={(value) => handleSelectChange("provider_type_id", value)}
                        >
                          <SelectTrigger className="pl-10 py-6 bg-gray-50 border-gray-200 rounded-xl focus:ring-gray-200 h-[50px]">
                            <SelectValue
                              placeholder={`Select your provider type (${providerTypes.length} available)`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {providerTypes.length > 0 ? (
                              providerTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                  {type.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="loading" disabled>
                                Loading provider types...
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="font-medium py-6 px-8 rounded-xl transition-colors"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 px-8 rounded-xl transition-colors"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-700 font-medium">
                        Description
                      </Label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your services and expertise..."
                          className="pl-10 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-gray-200 min-h-[150px]"
                          rows={5}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start space-x-3 mt-4">
                      <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-1">Almost there!</p>
                        <p>
                          By completing this profile, you'll be able to manage clients and projects through our
                          platform. Your information will be used to match you with potential clients.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="font-medium py-6 px-8 rounded-xl transition-colors"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 px-8 rounded-xl transition-colors"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Setting Up Your Profile...
                          </>
                        ) : (
                          "Complete Profile"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="bg-gray-50 py-4 px-8 text-center border-t">
              <p className="text-sm text-gray-500">Need help? Contact our support team at support@jointri.com</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
