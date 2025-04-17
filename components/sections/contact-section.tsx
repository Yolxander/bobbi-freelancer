"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, FileUp, Calendar, FileText } from "lucide-react"

const services = [
  "Transparent Progress View",
  "Less Back-and-Forth",
  "Confidence at Every Step",
  "One Link, All Updates",
]

export function BenefitsSection() {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Transparent Progress View",
    "Less Back-and-Forth",
    "Confidence at Every Step",
    "One Link, All Updates",
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
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Clear Project Timelines</h3>
                <p className="text-gray-600 mb-2">Always know what's next, what's due, and what's done.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Organized Conversations</h3>
                <p className="text-gray-600 mb-2">Messages tied to projects and tasks — never lose context again.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Easy Payment Tracking</h3>
                <p className="text-gray-600 mb-2">Track invoices, payments, and upcoming milestones in one place.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <FileUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Proposals and Contracts in Minutes</h3>
                <p className="text-gray-600 mb-2">Send structured, signable proposals without juggling tools.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Client Benefits */}
        <div className="bg-[#ACFF3D] p-8 md:p-12 lg:p-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium mb-4">For your clients</h2>

            <div className="space-y-6">
              <div>
                <p className="w-full border-b-2 border-black bg-transparent py-2 text-sm">
                  Clients can see real-time updates without needing to ask.
                </p>
              </div>

              <div>
                <p className="w-full border-b-2 border-black bg-transparent py-2 text-sm">
                  Everything important is centralized, no messy email chains.
                </p>
              </div>

              <div>
                <p className="w-full border-b-2 border-black bg-transparent py-2 text-sm">
                  Clients stay informed and feel secure about project status.
                </p>
              </div>

              <div>
                <p className="w-full border-b-2 border-black bg-transparent py-2 text-sm">
                  Clients access everything through a clean, simple dashboard.
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
                Let's get started!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
