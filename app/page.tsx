import { Orbitron } from 'next/font/google'
import Link from 'next/link'
import { Navigation } from "@/components/ui/navigation"

const orbitron = Orbitron({ subsets: ['latin'] })

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        {/* Hero Section */}
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-5xl font-bold leading-tight">
                  Smart Home Control
                  <br />
                  <span className="text-[#9E14D9]">At Your Fingertips</span>
                </h1>
                <p className="text-xl text-gray-600">
                  Manage your entire smart home ecosystem from one intuitive dashboard. Control lights, temperature, security, and more with a single app.
                </p>
                <div className="flex gap-4">
                  <Link href="/auth" className="px-8 py-3 bg-[#9E14D9] rounded-full text-white font-medium hover:bg-[#D1FF75] transition-colors">
                    Start Free Trial
                  </Link>
                  <Link href="#demo" className="px-8 py-3 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                    Watch Demo
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9E14D9]/20 to-[#D1FF75]/20 rounded-3xl"></div>
                <img 
                  src="/dashboard-preview.png" 
                  alt="Smart Home Dashboard Preview" 
                  className="relative z-10 rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 bg-[#9E14D9]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#9E14D9]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Control</h3>
                <p className="text-gray-600">Control your devices instantly with our responsive interface.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 bg-[#9E14D9]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#9E14D9]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Enhanced Security</h3>
                <p className="text-gray-600">Monitor and control your home security system from anywhere.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 bg-[#9E14D9]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#9E14D9]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Energy Analytics</h3>
                <p className="text-gray-600">Track and optimize your home's energy consumption.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#9E14D9] text-white">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Home?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of smart homeowners who have already upgraded their living experience.
            </p>
            <Link href="/auth" className="inline-block px-8 py-3 bg-white text-[#9E14D9] rounded-full font-medium hover:bg-gray-100 transition-colors">
              Get Started Now
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-gray-400">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <div className={`${orbitron.className} text-xl text-white mb-4`}>SmartHome</div>
                <p className="text-sm">Making smart living accessible to everyone.</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="#features" className="hover:text-white">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                  <li><Link href="#demo" className="hover:text-white">Demo</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="#about" className="hover:text-white">About</Link></li>
                  <li><Link href="#careers" className="hover:text-white">Careers</Link></li>
                  <li><Link href="#contact" className="hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="#privacy" className="hover:text-white">Privacy</Link></li>
                  <li><Link href="#terms" className="hover:text-white">Terms</Link></li>
                  <li><Link href="#cookies" className="hover:text-white">Cookies</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
              © 2024 SmartHome. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
