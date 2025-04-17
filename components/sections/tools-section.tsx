'use client'

import { FileText, GitBranch, Calendar, FileUp, Clock, Users } from 'lucide-react'

const mainCategories = [
  {
    title: 'Proposal\nBuilder',
    description: 'CREATE PROFESSIONAL\nPROPOSALS IN MINUTES',
    bgColor: 'bg-[#EBF3FF]',
    image: '/images/proposal.png'
  },
  {
    title: 'File & Version\nControl',
    description: 'MANAGE YOUR FILES WITH\nSEAMLESS VERSION TRACKING',
    bgColor: 'bg-[#EBFFE7]',
    image: '/images/version-control.png'
  },
  {
    title: 'Timeline\nEvents',
    description: 'TRACK PROGRESS AND\nMILESTONES EFFORTLESSLY',
    bgColor: 'bg-[#FFF8E7]',
    image: '/images/timeline.png'
  }
]

const subCategories = [
  {
    name: 'Proposal Builder',
    Icon: FileText,
    bgColor: 'bg-[#EBF3FF]'
  },
  {
    name: 'File & Version Control',
    Icon: GitBranch,
    bgColor: 'bg-[#EBFFE7]'
  },
  {
    name: 'Timeline Events',
    Icon: Calendar,
    bgColor: 'bg-[#FFF8E7]'
  },
  {
    name: 'Team Collaboration',
    Icon: Users,
    bgColor: 'bg-[#FFE7E7]'
  }
]

export function ToolsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Main Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {mainCategories.map((category, index) => (
            <div
              key={index}
              className={`${category.bgColor} rounded-3xl p-8 relative min-h-[400px] group cursor-pointer transition-transform hover:-translate-y-2`}
            >
              {/* Content */}
              <div className="flex flex-col h-full">
                <h3 className="text-3xl font-medium mb-auto whitespace-pre-line">
                  {category.title}
                </h3>
                <div className="mt-4">
                  <p className="text-sm font-mono whitespace-pre-line tracking-tight">
                    {category.description}
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 transform -rotate-45"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Icon Display instead of Image */}
              <div className="absolute right-8 bottom-8 w-40 h-40 flex items-center justify-center">
                {index === 0 && <FileText className="w-24 h-24 stroke-1 opacity-20" />}
                {index === 1 && <GitBranch className="w-24 h-24 stroke-1 opacity-20" />}
                {index === 2 && <Calendar className="w-24 h-24 stroke-1 opacity-20" />}
              </div>
            </div>
          ))}
        </div>

        {/* Sub Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subCategories.map((category, index) => (
            <div
              key={index}
              className={`${category.bgColor} rounded-2xl p-6 flex items-center justify-between group cursor-pointer transition-transform hover:-translate-y-1`}
            >
              <span className="text-lg font-medium">{category.name}</span>
              <category.Icon className="w-6 h-6 stroke-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 