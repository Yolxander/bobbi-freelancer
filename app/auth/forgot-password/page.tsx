"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function ForgotPasswordPage() {
  const { resetPassword, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setIsSubmitted(true)
    } catch (error) {
      console.error("Reset password error:", error)
      setError(error.message || "An error occurred while sending the reset link")
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
          <p className="text-gray-500">Enter your email address and we'll send you a link to reset your password</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-1">Check your email</h3>
            <p className="text-green-700">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <div className="mt-6">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <Mail className="w-5 h-5" />
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
                  <span>Sending reset link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
