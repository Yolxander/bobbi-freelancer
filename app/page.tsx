import { Navigation } from "@/components/ui/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { ServicesSection } from "@/components/sections/services-section"
import { WorkflowSteps } from "@/components/sections/workflow-steps"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      {/* Main Content */}
      <div className="pt-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <HeroSection />
          <WorkflowSteps />
          <HowItWorksSection />
        </div>
      </div>
    </div>
  )
}
