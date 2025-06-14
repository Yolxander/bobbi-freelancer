'use client'

import { ArrowUpRight, Target, Files, CheckCircle, Layout, Bell, ListTodo, Rocket, Film, Calendar } from 'lucide-react'
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'] })

const useCases = [
  {
    title: 'Design & Creative\nFreelancers',
    description: `Manage design projects, share concepts, and collect feedback seamlessly. Bobbi helps you showcase your portfolio and handle client revisions efficiently.`,
    bgColor: 'bg-[#D1FF75]',
    textColor: 'text-black',
    tags: [
      { text: 'Portfolio Showcase', Icon: Target },
      { text: 'Design Feedback', Icon: Files },
      { text: 'Client Approvals', Icon: CheckCircle }
    ],
    image: '/images/usecase-design.jpg'
  },
  {
    title: 'Marketing &\nContent Creators',
    description: `Streamline your content creation workflow and client communication. Bobbi makes it easy to manage campaigns, track deliverables, and maintain client relationships.`,
    bgColor: 'bg-[#965EF5]',
    textColor: 'text-black',
    tags: [
      { text: 'Campaign Management', Icon: Rocket },
      { text: 'Content Calendar', Icon: Film },
      { text: 'Client Reporting', Icon: Calendar }
    ],
    image: '/images/usecase-marketing.jpg'
  },
  {
    title: 'Development &\nTechnical Freelancers',
    description: `Keep your development projects organized and clients informed. Bobbi provides the tools to manage tasks, share progress, and handle technical documentation.`,
    bgColor: 'bg-white',
    textColor: 'text-black',
    tags: [
      { text: 'Project Tracking', Icon: Layout },
      { text: 'Code Reviews', Icon: Bell },
      { text: 'Technical Docs', Icon: ListTodo }
    ],
    image: '/images/usecase-dev.jpg'
  }
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-24 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Intro Container */}
            <div
              className="bg-black rounded-3xl p-8 relative min-h-[400px] group cursor-pointer overflow-hidden md:basis-[60%]"
            >
              <div className="flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start">
                  <h2 className="text-6xl font-light mb-4 text-white">Use Cases</h2>
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
                <p className="text-lg text-white mt-4">
                  Every freelancer has unique needs. <span className={orbitron.className}>Bobbi</span> adapts to your workflow, whether you're a designer, developer, or content creator. Manage your clients, showcase your work, and grow your business—all in one place.
                </p>
              </div>
            </div>

            {/* First Use Case */}
            <div
              className={`${useCases[0].bgColor} ${useCases[0].bgColor === 'bg-white' ? 'border-2 border-black' : ''} rounded-3xl p-8 relative min-h-[400px] group cursor-pointer overflow-hidden md:basis-[40%]`}
            >
              <div className="flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start">
                  <h3 className={`text-2xl font-medium whitespace-pre-line mb-4 ${useCases[0].textColor}`}>
                    {useCases[0].title}
                  </h3>
                  <ArrowUpRight className={`w-6 h-6 ${useCases[0].textColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>

                <p className={`text-sm whitespace-pre-line mt-4 ${useCases[0].textColor} opacity-80`}>
                  {useCases[0].description}
                </p>

                <div className="mt-8 space-y-3">
                  {useCases[0].tags.map((tag, tagIndex) => (
                    <div key={tagIndex} className="flex items-center gap-2">
                      <tag.Icon className={`w-5 h-5 ${useCases[0].textColor}`} />
                      <span className={`text-sm ${useCases[0].textColor}`}>{tag.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row gap-6">
            {useCases.slice(1).map((useCase, index) => (
              <div
                key={index}
                className={`${useCase.bgColor} ${useCase.bgColor === 'bg-white' ? 'border-2 border-black' : ''} rounded-3xl p-8 relative min-h-[400px] group cursor-pointer overflow-hidden md:basis-1/2`}
              >
                <div className="flex flex-col h-full relative z-10">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-2xl font-medium whitespace-pre-line mb-4 ${useCase.textColor}`}>
                      {useCase.title}
                    </h3>
                    <ArrowUpRight className={`w-6 h-6 ${useCase.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>

                  <p className={`text-sm whitespace-pre-line mt-4 ${useCase.textColor} opacity-80`}>
                    {useCase.description}
                  </p>

                  <div className="mt-8 space-y-3">
                    {useCase.tags.map((tag, tagIndex) => (
                      <div key={tagIndex} className="flex items-center gap-2">
                        <tag.Icon className={`w-5 h-5 ${useCase.textColor}`} />
                        <span className={`text-sm ${useCase.textColor}`}>{tag.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 