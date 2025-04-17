import Link from 'next/link'

const services = [
  { id: '01', name: 'UI/UX Design', href: '/services/design' },
  { id: '02', name: 'Web Development', href: '/services/development' },
  { id: '03', name: '3D Designs', href: '/services/3d' },
  { id: '04', name: 'Motion Graphics', href: '/services/motion' },
]

export function ServicesSection() {
  return (
    <div className="bg-[#0A0A0A] rounded-3xl p-16 mb-32">
      <div className="grid grid-cols-2 gap-16">
        {/* Left Column - Services List */}
        <div>
          <div className="mb-12">
            <h2 className="inline-flex items-center">
              <span className="text-[#ACFF3D] text-xl font-medium mr-3">Our</span>
              <span className="text-white text-3xl font-medium">Services</span>
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              We offer a range of creative and digital services
              <br />designed to help your brand stand out.
            </p>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <Link
                key={service.id}
                href={service.href}
                className="group flex items-center justify-between bg-[#151515] hover:bg-[#202020] rounded-full px-8 py-4 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <span className="text-[#ACFF3D] text-sm font-medium">{service.id}</span>
                  <span className="text-white text-lg">{service.name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-[#ACFF3D]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column - Expert Profile */}
        <div className="relative">
          <div className="relative">
            <img
              src="/images/expert-profile.jpg"
              alt="Expert Profile"
              className="w-full h-[400px] object-cover rounded-2xl grayscale"
            />
            {/* Decorative Elements */}
            <div className="absolute inset-0">
              <svg className="absolute top-8 right-8 w-32 h-32 text-[#ACFF3D]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 6" />
              </svg>
              <div className="absolute bottom-8 left-8 text-[#ACFF3D] text-sm">
                Ever wondered how
                <br />things magic happen?
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute -right-6 bottom-8 flex flex-col gap-4">
            <Link
              href="/process"
              className="flex items-center gap-2 bg-[#151515] hover:bg-[#202020] text-white px-6 py-3 rounded-full transition-all duration-300"
            >
              <span>See how we work</span>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M4 12l4-4-4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/team"
              className="flex items-center gap-2 bg-[#ACFF3D] hover:bg-[#9EFF1A] text-black px-6 py-3 rounded-full transition-all duration-300"
            >
              <span>Meet our expert</span>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M4 12l4-4-4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 