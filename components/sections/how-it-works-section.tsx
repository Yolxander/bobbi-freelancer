'use client'

import { useState } from 'react'
import { FileText, LayoutDashboard, Users, FolderGit2, ChevronRight } from 'lucide-react'

const features = [
  {
    id: '01',
    title: 'Proposals That Set the Stage',
    Icon: FileText,
    description: 'Create beautiful, structured proposals in minutes. Pull in client details, set timelines, deliverables, pricing, and even collect digital signatures—no PDFs or back-and-forth needed.'
  },
  {
    id: '02',
    title: 'Smart Project Management',
    Icon: LayoutDashboard,
    description: 'Plan, assign, and track tasks across projects with dynamic boards. Freelancers stay focused. Clients see real progress. Automated updates keep everyone aligned—without chasing emails.'
  },
  {
    id: '03',
    title: 'Client Dashboard Built In',
    Icon: Users,
    description: 'Clients get a clean, real-time view of their project: timelines, tasks, approvals, payments—all in one place. No sign-up hassles. Just one link to stay in the loop.'
  },
  {
    id: '04',
    title: 'File & Version Control',
    Icon: FolderGit2,
    description: 'Upload, preview, and organize files by project or task. Share drafts, lock final versions, and keep everything searchable. Goodbye cluttered Drive folders.'
  }
]

export function HowItWorksSection() {
  const [selectedFeature, setSelectedFeature] = useState(features[0])

  return (
    <div className="bg-[#0A0A0A] rounded-3xl p-16">
      <div className="mb-16">
        <h2 className="text-6xl font-light mb-6">
          <span className="text-[#ACFF3D]">How</span>{" "}
          <span className="text-white">It Works</span>
        </h2>
        <p className="text-gray-400 text-xl max-w-2xl">
          A smarter way to manage projects, clients, and communication — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-16">
        {/* Left Column - Feature List */}
        <div>
          <div className="space-y-6">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className={`w-full text-left group rounded-3xl px-8 py-6 transition-all duration-300 ${
                  selectedFeature.id === feature.id
                    ? 'bg-[#202020] shadow-lg shadow-[#ACFF3D]/5'
                    : 'bg-[#151515] hover:bg-[#1A1A1A] hover:shadow-lg hover:shadow-black/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <feature.Icon 
                      className={`w-6 h-6 ${
                        selectedFeature.id === feature.id
                          ? 'text-[#ACFF3D]'
                          : 'text-white group-hover:text-[#ACFF3D]'
                      } transition-colors`}
                    />
                    <span className={`text-xl font-light ${
                      selectedFeature.id === feature.id
                        ? 'text-[#ACFF3D]'
                        : 'text-white group-hover:text-[#ACFF3D]'
                    } transition-colors`}>
                      {feature.title}
                    </span>
                  </div>
                  {selectedFeature.id === feature.id && (
                    <ChevronRight className="w-5 h-5 text-[#ACFF3D]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Feature Description */}
        <div className="bg-[#151515] rounded-3xl p-12">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#202020] flex items-center justify-center">
                <selectedFeature.Icon className="w-8 h-8 text-[#ACFF3D]" />
              </div>
            </div>
            <p className="text-white text-xl font-light leading-relaxed">
              {selectedFeature.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 