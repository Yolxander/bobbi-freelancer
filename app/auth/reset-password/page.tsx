"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Lock, AlertCircle } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Check if we have the hash fragment in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    if (!hashParams.get("access_token")) {
      // If no access token, redirect to login
      router.push("/auth")
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setIsSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth")
      }, 3000)
    } catch (error) {
      console.error("Error resetting password:", error)
      setError(error.message || "An error occurred while resetting your password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
        <Link href="/auth" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to login</span>
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
          <p className="text-gray-500">Enter your new password below</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-1">Password reset successful</h3>
            <p className="text-green-700">
              Your password has been reset successfully. You will be redirected to the login page.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>

                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-gray-800 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting password...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
