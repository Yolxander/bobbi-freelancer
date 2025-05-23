import { Navigation } from "@/components/ui/navigation"
import { HomeHeroSection } from "@/components/sections/hero-section"
import { UseCasesSection } from "@/components/sections/use-cases-section"
import { WorkflowSteps } from "@/components/sections/workflow-steps"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { BenefitsSection} from "@/components/sections/contact-section"
import { ToolsSection } from "@/components/sections/tools-section"
import { FooterSection } from "@/components/sections/footer-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      {/* Main Content */}
      <div className="pt-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <HomeHeroSection />
      
          <WorkflowSteps />
          <HowItWorksSection />
          <ToolsSection />
          <BenefitsSection />
          <UseCasesSection />
        </div>
      </div>

      <FooterSection />
    </div>
  )
}
