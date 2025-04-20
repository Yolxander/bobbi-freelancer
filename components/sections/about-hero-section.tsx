import { ArrowRight } from 'lucide-react'

export function AboutHeroSection() {
  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] rounded-3xl">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#965EF5]/20 via-transparent to-[#2BD7D7]/20" />
        <div className="absolute w-[500px] h-[500px] -right-48 -top-48 bg-[#2BD7D7]/10 rounded-full blur-3xl" />
        <div className="absolute w-[500px] h-[500px] -left-48 -bottom-48 bg-[#965EF5]/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative px-8 py-24 md:px-16 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-[#D1FF75] rounded-full px-4 py-1 text-sm text-black mb-8">
            <span className="mr-2">✦</span>
            Our Mission
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light text-white mb-8">
            Making Freelance Work
            <br />
            <span className="relative inline-block">
              More Human
              <svg className="absolute h-3 md:h-4 -bottom-4 left-0 right-0 text-[#2BD7D7]" viewBox="0 0 172 16" fill="none">
                <path d="M80.0502 0.599609C80.0502 0.599609 158.05 -0.400391 171.05 15.5996" stroke="currentColor" strokeWidth="2"/>
                <path d="M91.0498 0.599609C91.0498 0.599609 13.0498 -0.400391 0.0498047 15.5996" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
            We're building tools that help freelancers and clients work together with more trust, transparency, and meaningful collaboration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-8 py-3 bg-[#D1FF75] text-black rounded-full text-[15px] font-medium hover:bg-[#D1FF75]/90 transition-colors">
              Join Our Team
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button className="inline-flex items-center px-8 py-3 bg-[#965EF5] text-white rounded-full text-[15px] font-medium hover:bg-[#965EF5]/90 transition-colors">
              Read Our Story
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 