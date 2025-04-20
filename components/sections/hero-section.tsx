import Link from 'next/link'

export function HomeHeroSection() {
  return (
    <div className="grid grid-cols-8 gap-4 mb-16 bg-white rounded-3xl p-16 border-2 border-gray-900">
      <div className="col-span-4 pt-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center bg-gray-200/50 rounded-full px-4 py-1 text-sm mb-6">
            <span className="mr-2">🤝</span>
            Freelance Collaboration, Reimagined
          </div>
          <h2 className="text-6xl font-light mb-6">
            Freelancers and
            <br />
            Clients Working
            <br />
            <span className="relative">
              Together Better
              <span className="absolute -right-12 top-0 text-[#2BD7D7]">✦</span>
            </span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Bobbi is your shared workspace to create projects, track progress, and communicate effortlessly—so freelancers stay focused and clients stay informed.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/auth" 
              className="px-8 py-3 bg-black text-white rounded-full text-[15px] font-medium hover:bg-gray-900 transition-colors"
            >
              Get Started Free
            </Link>
            <button 
              className="px-8 py-3 border border-gray-200 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-colors"
            >
              See How It Works
            </button>
          </div>
        </div>
      </div>
    
      <div className="col-span-4">
        <div className="relative">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
              <svg className="w-6 h-6 text-[#2BD7D7]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="p-8">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl p-2 relative mb-6">
              <img src="/images/dashboard-preview.png" alt="Dashboard Preview" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
