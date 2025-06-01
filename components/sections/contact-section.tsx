"use client"

import type React from "react"
import { useState } from "react"
import { User, FileText, Calendar, CreditCard } from "lucide-react"

const services = [
  "Professional Profile",
  "Client Intake Form",
  "Project Management",
  "Payment Processing",
]

export function BenefitsSection() {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Professional Profile",
    "Client Intake Form",
    "Project Management",
    "Payment Processing",
  ])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
  })

  const toggleService = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ ...formData, services: selectedServices })
  }

  return (
    <div className="bg-white rounded-[32px] overflow-hidden border-2 border-black shadow-lg w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Column - Freelancer Benefits */}
        <div className="p-8 md:p-12 lg:p-16">
          <div className="mb-8">
            <h2 className="text-3xl font-medium mb-2">For Freelancers</h2>
          </div>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Professional Profile</h3>
                <p className="text-gray-600 mb-2">Showcase your expertise, portfolio, and rates to attract the right clients.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Client Intake</h3>
                <p className="text-gray-600 mb-2">Receive project requests and generate professional proposals with AI assistance.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Project Management</h3>
                <p className="text-gray-600 mb-2">Keep projects organized with built-in task lists, messaging, and file sharing.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Payment Processing</h3>
                <p className="text-gray-600 mb-2">Create invoices, track payments, and manage your finances in one place.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Client Benefits */}
        <div className="bg-[#965EF5] p-8 md:p-12 lg:p-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium mb-4">For your clients</h2>

            <div className="space-y-6">
              <div>
                <p className="w-full border-b-2 border-black bg-transparent py-2 text-sm">
                  Easy project submission through your custom intake form.
                </p>
              </div>

              <div>
                <p className="w-full border-b-2 border-black bg-transparent py-2 text-sm">
                  Clear project scope and pricing in professional proposals.
                </p>
              </div>

              <div>
                <p className="w-full border-b-2 border-black bg-transparent py-2 text-sm">
                  Real-time project updates and milestone tracking.
                </p>
              </div>

              <div>
                <p className="w-full border-b-2 border-black bg-transparent py-2 text-sm">
                  Secure payment processing and invoice management.
                </p>
              </div>

              <div className="pt-4">
                <p className="mb-4 font-medium">What matters to your clients?</p>
                <div className="grid grid-cols-1 gap-3">
                  {services.map((service) => (
                    <label key={service} className="flex items-center space-x-2">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service)}
                          onChange={() => toggleService(service)}
                          className="peer sr-only"
                        />
                        <div className="h-5 w-5 border-2 border-black flex items-center justify-center bg-transparent peer-checked:bg-black">
                          {selectedServices.includes(service) && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#111827] text-white py-3 rounded-3xl mt-8 hover:bg-black transition-colors"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
