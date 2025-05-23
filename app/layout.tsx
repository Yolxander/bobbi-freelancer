import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Orbitron } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bobbi',
  description: 'Freelancer and client best friend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
