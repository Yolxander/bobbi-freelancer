'use client'

import { ArrowUpRight, Target, Files, CheckCircle, Layout, Bell, ListTodo, Rocket, Film, Calendar } from 'lucide-react'

const useCases = [
  {
    title: 'Simplify Design Feedback\nand Approvals',
    description: 'Share concepts, manage revisions, and track approvals without endless emails. Bobbi ties every piece of client feedback directly to the right task or design file.',
    bgColor: 'bg-[#2BD7D7]',
    textColor: 'text-black',
    tags: [
      { text: 'Clear Revision Tracking', Icon: Target },
      { text: 'Organized File Versions', Icon: Files },
      { text: 'Faster Client Approvals', Icon: CheckCircle }
    ],
    image: '/images/usecase-design.jpg'
  },
  {
    title: 'Manage Campaigns,\nAssets, and Feedback Smoothly',
    description: "Upload deliverables, track revisions, and launch campaigns without chasing client approvals. Bobbi's dashboard keeps marketing workflows clean and client-ready.",
    bgColor: 'bg-[#965EF5]',
    textColor: 'text-black',
    tags: [
      { text: 'Quick Approvals', Icon: Rocket },
      { text: 'Asset Management', Icon: Film },
      { text: 'Campaign Timelines', Icon: Calendar }
    ],
    image: '/images/usecase-marketing.jpg'
  },
  {
    title: 'Stay on Top of\nEvery Project Timeline',
    description: 'Build websites, apps, or systems across multiple clients without missing a beat. Bobbi gives developers a structured way to manage tasks, share previews, and stay ahead.',
    bgColor: 'bg-white',
    textColor: 'text-black',
    tags: [
      { text: 'Multi-Project Boards', Icon: Layout },
      { text: 'Release Notifications', Icon: Bell },
      { text: 'Organized Task Lists', Icon: ListTodo }
    ],
    image: '/images/usecase-dev.jpg'
  }
]

export function UseCasesSection() {
  return (
    <section className="py-24">
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
                  No two projects are alike — and neither are the teams behind them. Bobbi gives freelancers and teams the flexibility to manage work the way they need it: clear timelines, smart file sharing, and effortless client collaboration, all in one place.
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