'use client'

export function VisionSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-display mb-12">Where We're Headed</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Smart Features Card */}
            <div className="bg-[#2BD7D7] transition-colors rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium px-3 py-1 bg-white rounded-full">COMING SOON</span>
              </div>
              <h3 className="text-2xl mb-4">Smart Recommendations</h3>
              <p className="text-gray-600">
                Intelligent project health monitoring and automated next steps suggestions to keep your projects on track.
              </p>
            </div>

            {/* Automation Card */}
            <div className="bg-[#D1FF75] transition-colors rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-8">
                <span className="text-xs font-medium px-3 py-1 bg-black text-white rounded-full">AUTOMATION</span>
                <span className="text-xs font-medium px-3 py-1 bg-black text-white rounded-full">PAYMENTS</span>
              </div>
              <div>
                <h3 className="text-2xl mb-4">Deeper Integration</h3>
                <p className="text-sm text-gray-600">
                  Automated updates, smart file reminders, integrated payments, and seamless contract management all in one place.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Vision Card */}
          <div className="bg-[#965EF5] transition-colors rounded-3xl p-12 flex flex-col justify-between">
            <div>
              <p className="text-lg mb-4 text-white">We're just getting started.</p>
              <h3 className="text-3xl font-light mb-6 text-white">
                Our vision is to make Bobbi the trusted workspace for every freelancer-client collaboration — whether it's managing one project or building a business.
              </h3>
              <p className="text-lg mb-4 text-white">
                Join our community of freelancers connecting and collaborating together.
              </p>
            </div>
            <div>
              <button className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 transition-colors">
                JOIN THE COMMUNITY
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 