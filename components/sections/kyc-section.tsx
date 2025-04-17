import Link from 'next/link'

export function KycSection() {
  return (
    <div className="grid grid-cols-12 gap-8 mb-32">
      <div className="col-span-6 pt-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center bg-gray-200/50 rounded-full px-4 py-1 text-sm mb-6">
            <span className="mr-2">•••</span>
            Identity Verification
          </div>
          <h2 className="text-6xl font-light mb-6">
            Individual and
            <br />
            Corporate KYC
            <br />
            <span className="relative">
              Software
              <span className="absolute -right-12 top-0 text-[#9E14D9]">•••</span>
            </span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            A versatile solution for verifying customer identity,
            simplifying the KYC registration process and
            managing the entire customer lifecycle.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/auth" 
              className="px-8 py-3 bg-black text-white rounded-full text-[15px] font-medium hover:bg-gray-900 transition-colors"
            >
              Book a Demo
            </Link>
            <button 
              className="px-8 py-3 border border-gray-200 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-colors"
            >
              Use Cases
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-6">
        <div className="relative">
          {/* ID Card Design */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
              <svg className="w-6 h-6 text-[#D1FF75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl p-6 relative mb-6">
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D1FF75]"></div>
                <div className="w-8 h-8 rounded-full bg-[#9E14D9]"></div>
                <div className="w-8 h-8 rounded-full bg-black"></div>
              </div>
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="font-medium">Ralph Edwards</div>
                    <div className="text-sm text-gray-500">05/18/1984</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">VERIFICATION DATE</div>
                  <div className="font-mono text-sm">02/23/2022</div>
                  <div className="font-mono text-xs text-gray-400">AB-07-443YFY3-XF34-4•MR•</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 