'use client'

import { ArrowRight } from "lucide-react"
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'] })

const pillars = [
  {
    name: "AI-Powered Workflow",
    description: `Smart automation that helps you draft proposals, break down projects, and manage client communication — all while maintaining your personal touch.`,
    color: "bg-[#2BD7D7]",
    textColor: "text-black"
  },
  {
    name: "Professional Branding",
    description: "Present yourself with a polished profile, branded proposals, and seamless client onboarding that builds trust from day one.",
    color: "bg-[#D1FF75]",
    textColor: "text-black"
  },
  {
    name: "Unified Workspace",
    description: "One platform for everything: proposals, contracts, project management, file sharing, and client communication — no more scattered tools.",
    color: "bg-black",
    textColor: "text-white"
  },
  {
    name: "Smart Project Management",
    description: `AI-assisted task breakdown, milestone tracking, and automated updates keep your projects on track and clients informed.`,
    color: "bg-[#965EF5]",
    textColor: "text-white"
  },
  {
    name: "Client Experience",
    description: "Give clients a professional portal to view progress, provide feedback, and manage deliverables — all while maintaining your control.",
    color: "bg-[#D1FF75]",
    textColor: "text-black"
  },
  {
    name: "Business Growth",
    description: "Turn completed projects into testimonials, track your success metrics, and build a portfolio that attracts better clients.",
    color: "bg-black",
    textColor: "text-white"
  },
  {
    name: "Payment Integration",
    description: `Seamless invoicing, payment tracking, and automated reminders — get paid faster and keep your finances organized.`,
    color: "bg-[#965EF5]",
    textColor: "text-white"
  },
  {
    name: "Smart Analytics",
    description: `Track your performance, identify growth opportunities, and make data-driven decisions to scale your freelance business.`,
    color: "bg-[#2BD7D7]",
    textColor: "text-black"
  }
]

export function PillarsSection() {
  return (
    <section className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-[#D1FF75] rounded-full px-4 py-1 text-sm text-black mb-6">
              <span className="mr-2">✦</span>
              Core Features
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-black mb-12">Everything You Need to <span className={orbitron.className}>Succeed</span></h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Row */}
          {pillars.slice(0, 3).map((pillar) => (
            <div 
              key={pillar.name} 
              className={`group relative rounded-2xl p-12 transition-all hover:-translate-y-1 ${pillar.color} hover:opacity-90 shadow-lg`}
            >
              <div className="relative">
                <h3 className={`text-xl font-medium mb-4 ${pillar.textColor}`}>{pillar.name}</h3>
                <p className={`${pillar.textColor} line-clamp-3 opacity-80`}>{pillar.description}</p>
              </div>
            </div>
          ))}

          {/* Second Row */}
          {pillars.slice(3, 4).map((pillar) => (
            <div 
              key={pillar.name} 
              className={`group relative rounded-2xl p-12 transition-all hover:-translate-y-1 ${pillar.color} hover:opacity-90 shadow-lg`}
            >
              <div className="relative">
                <h3 className={`text-xl font-medium mb-4 ${pillar.textColor}`}>{pillar.name}</h3>
                <p className={`${pillar.textColor} line-clamp-3 opacity-80`}>{pillar.description}</p>
              </div>
            </div>
          ))}

          {/* Center Button */}
          <div className="flex flex-col justify-center items-center text-black border border-black rounded-2xl p-12">
            <h3 className="text-2xl font-semibold text-center mb-6">Ready to Transform Your <span className={orbitron.className}>Workflow</span>?</h3>
            <button className="inline-flex items-center px-8 py-3 bg-[#D1FF75] text-black rounded-full text-[15px] font-medium hover:bg-[#D1FF75]/90 transition-colors">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {pillars.slice(4, 5).map((pillar) => (
            <div 
              key={pillar.name} 
              className={`group relative rounded-2xl p-12 transition-all hover:-translate-y-1 ${pillar.color} hover:opacity-90 shadow-lg`}
            >
              <div className="relative">
                <h3 className={`text-xl font-medium mb-4 ${pillar.textColor}`}>{pillar.name}</h3>
                <p className={`${pillar.textColor} line-clamp-3 opacity-80`}>{pillar.description}</p>
              </div>
            </div>
          ))}

          {/* Third Row */}
          {pillars.slice(5).map((pillar) => (
            <div 
              key={pillar.name} 
              className={`group relative rounded-2xl p-12 transition-all hover:-translate-y-1 ${pillar.color} hover:opacity-90 shadow-lg`}
            >
              <div className="relative">
                <h3 className={`text-xl font-medium mb-4 ${pillar.textColor}`}>{pillar.name}</h3>
                <p className={`${pillar.textColor} line-clamp-3 opacity-80`}>{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 