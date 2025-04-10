"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if we have the access_token in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get("access_token")
    const refreshToken = hashParams.get("refresh_token")

    if (accessToken) {
      // If you have a backend set up with Laravel, send the token
      // to a backend API route to get user details.
      // For example, you could have /api/auth/callback
      // In this example, we will skip calling a backend for brevity and just redirect
      // to dashboard (you'll need to implement the backend!)
      localStorage.setItem("authToken", accessToken) // Save token

      router.push("/dashboard")
    } else {
      router.push("/auth") // Redirect to login if no token
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Completing authentication...</p>
      </div>
    </div>
  )
}
