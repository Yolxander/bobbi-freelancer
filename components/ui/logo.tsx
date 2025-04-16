"use client"

import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center">
        <Image
          src="/platform-logo.png"
          alt="Platform Logo"
          width={48}
          height={48}
          className="w-12 h-12"
        />
      </div>
    </Link>
  )
} 