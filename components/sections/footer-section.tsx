'use client'

import { ArrowUpRight, Mail, Twitter, Linkedin, Github } from 'lucide-react'
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'] })

const footerLinks = {
  product: [
    { name: 'Features', href: '#' },
    { name: 'Use Cases', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Book a Demo', href: '#' }
  ],
  solutions: [
    { name: 'Design Feedback', href: '#' },
    { name: 'Project Timeline', href: '#' },
    { name: 'Asset Management', href: '#' },
    { name: 'Client Collaboration', href: '#' }
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' }
  ],
  social: [
    { name: 'Twitter', href: '#', Icon: Twitter },
    { name: 'LinkedIn', href: '#', Icon: Linkedin },
    { name: 'GitHub', href: '#', Icon: Github },
    { name: 'Email', href: 'mailto:hello@bobbi.app', Icon: Mail }
  ]
}

export function FooterSection() {
  return (
    <footer className="bg-black text-white py-24">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-16">
          {/* Brand Section */}
          <div className="md:w-1/3">
            <h3 className={`text-2xl font-medium mb-4 ${orbitron.className}`}>Bobbi</h3>
            <p className="text-gray-400 mb-6">
              Streamline your workflow with smart file sharing and effortless client collaboration, all in one place.
            </p>
            <button className="flex items-center gap-2 bg-[#2BD7D7] text-black px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors">
              Get Started
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>

          {/* Links Sections */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Links */}
            <div>
              <h4 className="text-lg font-medium mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions Links */}
            <div>
              <h4 className="text-lg font-medium mb-4">Solutions</h4>
              <ul className="space-y-3">
                {footerLinks.solutions.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-medium mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 <span className={orbitron.className}>Bobbi</span>. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-6">
            {footerLinks.social.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={link.name}
              >
                <link.Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
} 