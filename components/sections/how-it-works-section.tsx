'use client'

import { useState } from 'react'

const features = [
  {
    id: '01',
    title: 'Proposals That Set the Stage',
    emoji: '📝',
    description: 'Create beautiful, structured proposals in minutes. Pull in client details, set timelines, deliverables, pricing, and even collect digital signatures—no PDFs or back-and-forth needed.'
  },
  {
    id: '02',
    title: 'Smart Project Management',
    emoji: '📋',
    description: 'Plan, assign, and track tasks across projects with dynamic boards. Freelancers stay focused. Clients see real progress. Automated updates keep everyone aligned—without chasing emails.'
  },
  {
    id: '03',
    title: 'Client Dashboard Built In',
    emoji: '👤',
    description: 'Clients get a clean, real-time view of their project: timelines, tasks, approvals, payments—all in one place. No sign-up hassles. Just one link to stay in the loop.'
  },
  {
    id: '04',
    title: 'File & Version Control',
    emoji: '📁',
    description: 'Upload, preview, and organize files by project or task. Share drafts, lock final versions, and keep everything searchable. Goodbye cluttered Drive folders.'
  }
]

export function HowItWorksSection() {
  const [selectedFeature, setSelectedFeature] = useState(features[0])

  return (
    <div className="bg-[#0A0A0A] rounded-3xl p-16 mb-32">
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
                    <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">{feature.emoji}</span>
                    <span className={`text-xl font-light ${
                      selectedFeature.id === feature.id
                        ? 'text-[#ACFF3D]'
                        : 'text-white group-hover:text-[#ACFF3D]'
                    } transition-colors`}>
                      {feature.title}
                    </span>
                  </div>
                  {selectedFeature.id === feature.id && (
                    <svg className="w-5 h-5 text-[#ACFF3D]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
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
              <span className="text-4xl">{selectedFeature.emoji}</span>
              <h3 className="text-[#ACFF3D] text-2xl font-light">{selectedFeature.title}</h3>
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