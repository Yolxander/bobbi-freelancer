"use client"

import { Navigation } from "@/components/ui/navigation"
import { AboutHeroSection } from "@/components/sections/about-hero-section"
import { PillarsSection } from "@/components/sections/pillars-section"
import { FooterSection } from "@/components/sections/footer-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navigation />
      <div className="pt-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <AboutHeroSection />
          <PillarsSection />
        </div>
      </div>
      <FooterSection />
    </div>
  )
} 