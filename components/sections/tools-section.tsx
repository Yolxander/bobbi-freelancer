'use client'

import { User, FileText, Calendar, CreditCard, Clock, MessageSquare, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const mainCategories = [
  {
    title: 'Profile & Portfolio\nBuilder',
    description: 'SHOWCASE YOUR\nEXPERTISE',
    bgColor: 'bg-[#0A0A0A]',
    steps: [
      'Create professional profile',
      'Add portfolio items',
      'Set your rates',
      'Collect testimonials'
    ],
    Icon: User
  },
  {
    title: 'Client Intake &\nProposals',
    description: 'MANAGE CLIENT\nREQUESTS',
    bgColor: 'bg-[#965EF5]',
    steps: [
      'Custom client form',
      'AI proposal assistance',
      'Scope & pricing',
      'Digital signatures'
    ],
    Icon: FileText
  },
  {
    title: 'Project &\nPayment Tools',
    description: 'HANDLE PROJECTS\nAND PAYMENTS',
    bgColor: 'bg-[#D1FF75]',
    steps: [
      'Task management',
      'File sharing',
      'Invoice creation',
      'Payment tracking'
    ],
    Icon: CreditCard
  }
]

const subCategories = [
  {
    name: 'Profile Builder',
    Icon: User,
    bgColor: 'bg-[#EBF3FF]'
  },
  {
    name: 'Client Intake',
    Icon: FileText,
    bgColor: 'bg-[#EBFFE7]'
  },
  {
    name: 'Project Tools',
    Icon: Calendar,
    bgColor: 'bg-[#FFF8E7]'
  },
  {
    name: 'Payment Tools',
    Icon: CreditCard,
    bgColor: 'bg-[#FFE7E7]'
  }
]

export function ToolsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 w-full">
        {/* Main Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {mainCategories.map((category, index) => {
            const isBlackBg = category.bgColor === 'bg-[#0A0A0A]';
            return (
              <div
                key={index}
                className={`${category.bgColor} rounded-3xl p-8 relative min-h-[200px] group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${
                  activeIndex === index ? 'ring-2 ring-black' : ''
                }`}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Content */}
                <div className="flex flex-col h-full relative z-10">
                  <h3 className={`text-3xl font-medium mb-4 whitespace-pre-line ${isBlackBg ? 'text-white' : 'text-black'}`}>
                    {category.title}
                  </h3>
                  <div className="mt-4">
                    <p className={`text-sm font-mono whitespace-pre-line tracking-tight ${isBlackBg ? 'text-white/80' : 'text-black'}`}>
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Icon Display */}
                <div className="absolute right-8 bottom-8 w-40 h-40 flex items-center justify-center">
                  <category.Icon className={`w-24 h-24 stroke-1 ${isBlackBg ? 'text-white' : 'text-black'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainCategories[activeIndex].steps.map((step, index) => {
            const isBlackBg = mainCategories[activeIndex].bgColor === 'bg-[#0A0A0A]';
            return (
              <div
                key={index}
                className={`${mainCategories[activeIndex].bgColor} rounded-2xl p-6 flex items-center gap-4 group cursor-pointer transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-8 h-8 rounded-full border-2 ${isBlackBg ? 'border-white text-white' : 'border-black text-black'} flex items-center justify-center shrink-0`}>
                  {index + 1}
                </div>
                <span className={`text-lg ${isBlackBg ? 'text-white' : 'text-black'}`}>{step}</span>
                <ArrowRight className={`w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${isBlackBg ? 'text-white' : 'text-black'}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
} 