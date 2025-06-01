'use client'

import { Orbitron } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const orbitron = Orbitron({ subsets: ['latin'] })

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-[1200px] mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className={`${orbitron.className} text-xl tracking-tight`}>Bobbi</div>
            <div className="flex items-center gap-8">
              <Link 
                href="/" 
                className={`text-[15px] text-gray-600 hover:text-gray-900 relative ${
                  pathname === '/' ? 'after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#D1FF75]' : ''
                }`}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`text-[15px] text-gray-600 hover:text-gray-900 relative ${
                  pathname === '/about' ? 'after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#D1FF75]' : ''
                }`}
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gray-100 rounded-full py-1.5 px-4 flex items-center flex-1 min-w-[420px]">
              <div className="flex items-center gap-3 w-full">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none">
                  <path d="M14.6666 14.6666L11.2916 11.2916M11.2916 11.2916C12.375 10.2083 13 8.75 13 7.16667C13 3.94454 10.3887 1.33333 7.16667 1.33333C3.94454 1.33333 1.33333 3.94454 1.33333 7.16667C1.33333 10.3888 3.94454 13 7.16667 13C8.75 13 10.2083 12.375 11.2916 11.2916Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text"
                  placeholder="Try 'Lotus GT 430'"
                  className="w-full bg-transparent text-[15px] placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
            <Link href="/auth" className="px-6 py-2 bg-[#D1FF75] rounded-full text-[15px] text-black font-medium hover:bg-[#D1FF75]/90 transition-colors">
              Login
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
} 