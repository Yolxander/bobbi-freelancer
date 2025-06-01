'use client'

import { useRef } from 'react'

const workflowSteps = [
  {
    id: 'profile',
    name: 'How It Works',
    description: 'A complete platform for managing your freelance business — from profile to payment',
    color: 'bg-[#D1FF75]',
    sectionId: 'how-it-works'
  },
  {
    id: 'client',
    name: 'Benefits',
    description: 'Professional tools for freelancers and their clients',
    color: 'bg-[#965EF5]',
    sectionId: 'benefits'
  },
  {
    id: 'project',
    name: 'Use Cases',
    description: "Adapts to your workflow, whether you're a designer, developer, or content creator",
    color: 'bg-black',
    sectionId: 'use-cases'
  }
]

export function WorkflowSteps() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 80 // Approximate height of navigation
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="flex gap-4 mb-16">
      {workflowSteps.map((step, index) => (
        <div 
          key={step.id}
          onClick={() => scrollToSection(step.sectionId)}
          className={`flex-1 ${step.color} rounded-2xl p-6 text-lg font-medium ${
            step.color === 'bg-black' ? 'text-white' : 'text-black'
          } flex flex-col group hover:opacity-90 transition-opacity cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-2">
            <span>{step.name}</span>
            <svg 
              className={`w-6 h-6 ${index === workflowSteps.length - 1 ? 'opacity-0' : ''}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path d="M5 12h14m-7-7l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={`text-sm ${step.color === 'bg-black' ? 'text-white/80' : 'text-black/80'}`}>
            {step.description}
          </p>
        </div>
      ))}
    </div>
  )
}
 