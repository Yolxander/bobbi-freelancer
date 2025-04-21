'use client'

import { ArrowRight } from "lucide-react"
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'] })

const pillars = [
  {
    name: "Simplicity First",
    description: `No complicated setups or bloated features. <span class="${orbitron.className}">Bobbi</span> makes collaboration easy, right out of the box.`,
    color: "bg-[#2BD7D7]",
    textColor: "text-black"
  },
  {
    name: "Client-Centric Design",
    description: "Clients see only what they need — clean updates, clear files, transparent progress — no confusion.",
    color: "bg-[#D1FF75]",
    textColor: "text-black"
  },
  {
    name: "Built-In Project Tools",
    description: "Proposals, tasks, file sharing, timelines, messaging — all integrated, no extra subscriptions needed.",
    color: "bg-black",
    textColor: "text-white"
  },
  {
    name: "Designed for Growth",
    description: `Whether you're managing 1 project or scaling a freelance team, <span class="${orbitron.className}">Bobbi</span> grows with you at every step.`,
    color: "bg-[#965EF5]",
    textColor: "text-white"
  },
  {
    name: "Automation Where It Matters",
    description: "Smart progress updates, automatic reminders, and project tracking — without adding more work.",
    color: "bg-[#D1FF75]",
    textColor: "text-black"
  },
  {
    name: "Clear Client Collaboration",
    description: "No more confusing email chains. Clients always know what's happening and what's expected next.",
    color: "bg-black",
    textColor: "text-white"
  },
  {
    name: "Effortless File Management",
    description: `Organize, preview, version, and share project files without leaving <span class="${orbitron.className}">Bobbi</span>'s workspace.`,
    color: "bg-[#965EF5]",
    textColor: "text-white"
  },
  {
    name: "Ready for Every Stage",
    description: `From first proposal to final delivery, <span class="${orbitron.className}">Bobbi</span> supports every part of the freelancer-client relationship.`,
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
              Our Features
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-black mb-12">What Makes <span className={orbitron.className}>Bobbi</span> Different?</h2>
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
                <p className={`${pillar.textColor} line-clamp-3 opacity-80`} dangerouslySetInnerHTML={{ __html: pillar.description }}></p>
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
                <p className={`${pillar.textColor} line-clamp-3 opacity-80`} dangerouslySetInnerHTML={{ __html: pillar.description }}></p>
              </div>
            </div>
          ))}

          {/* Center Button */}
          <div className="flex flex-col justify-center items-center text-black border border-black rounded-2xl p-12">
            <h3 className="text-2xl font-semibold text-center mb-6">Discover Everything <span className={orbitron.className}>Bobbi</span> Offers</h3>
            <button className="inline-flex items-center px-8 py-3 bg-[#D1FF75] text-black rounded-full text-[15px] font-medium hover:bg-[#D1FF75]/90 transition-colors">
              Explore Features
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
                <p className={`${pillar.textColor} line-clamp-3 opacity-80`} dangerouslySetInnerHTML={{ __html: pillar.description }}></p>
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
                <p className={`${pillar.textColor} line-clamp-3 opacity-80`} dangerouslySetInnerHTML={{ __html: pillar.description }}></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 