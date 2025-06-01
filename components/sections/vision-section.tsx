'use client'

import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'] })

export function VisionSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-display mb-12">The Future of <span className={orbitron.className}>Freelancing</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <div className="bg-[#2BD7D7] transition-colors rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium px-3 py-1 bg-white rounded-full">COMING SOON</span>
              </div>
              <h3 className="text-2xl mb-4">AI Business Assistant</h3>
              <p className="text-gray-600">
                Your personal AI co-pilot that helps with client communication, project planning, and business decisions — making you more efficient and professional.
              </p>
            </div>

            {/* Smart Workflow Card */}
            <div className="bg-[#D1FF75] transition-colors rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-8">
                <span className="text-xs font-medium px-3 py-1 bg-black text-white rounded-full">AUTOMATION</span>
                <span className="text-xs font-medium px-3 py-1 bg-black text-white rounded-full">INTELLIGENCE</span>
              </div>
              <div>
                <h3 className="text-2xl mb-4">Predictive Workflows</h3>
                <p className="text-sm text-gray-600">
                  Smart templates that learn from your best projects, automated client onboarding, and AI-powered project health monitoring to prevent issues before they happen.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Vision Card */}
          <div className="bg-[#965EF5] transition-colors rounded-3xl p-12 flex flex-col justify-between">
            <div>
              <p className="text-lg mb-4 text-white">Building the future of work.</p>
              <h3 className="text-3xl font-light mb-6 text-white">
                We're creating a world where every freelancer has the tools, intelligence, and support they need to build a thriving business — on their own terms.
              </h3>
              <p className="text-lg mb-4 text-white">
                Join us in shaping the future of independent work.
              </p>
            </div>
            <div>
              <button className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 transition-colors">
                JOIN THE MOVEMENT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 