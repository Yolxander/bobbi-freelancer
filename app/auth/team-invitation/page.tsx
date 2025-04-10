"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { verifyTeamMemberInvitation, markInvitationAsUsed } from "@/app/actions/email-actions"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function TeamInvitationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [invitationData, setInvitationData] = useState(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid invitation link. No token provided.")
        setIsLoading(false)
        return
      }

      try {
        const result = await verifyTeamMemberInvitation(token)
        if (result.success) {
          setInvitationData(result.data)
        } else {
          setError(result.error || "Invalid invitation link.")
        }
      } catch (err) {
        console.error("Error verifying invitation:", err)
        setError("An error occurred while verifying your invitation.")
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const supabase = getSupabaseBrowserClient()

      // Sign up the user with their email and password
      const { error: signUpError } = await supabase.auth.signUp({
        email: invitationData.email,
        password,
        options: {
          data: {
            full_name: invitationData.name,
            team_member_id: invitationData.teamMemberId,
          },
        },
      })

      if (signUpError) throw signUpError

      // Mark the invitation as used
      await markInvitationAsUsed(invitationData.invitationId)

      setSuccess(true)

      // Redirect to the project page after a delay
      setTimeout(() => {
        router.push(`/projects/${invitationData.projectId}`)
      }, 3000)
    } catch (err) {
      console.error("Error setting up account:", err)
      setError(err.message || "An error occurred while setting up your account.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Verifying invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
            <p className="text-gray-600">{error}</p>
          </div>
          <div className="text-center">
            <Link href="/auth">
              <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium">Go to Login</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h1>
            <p className="text-gray-600">
              Your account has been successfully created. You will be redirected to the project page shortly.
            </p>
          </div>
          <div className="text-center">
            <Link href={`/projects/${invitationData.projectId}`}>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium">Go to Project</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Account</h1>
          <p className="text-gray-600">
            You've been invited to join the project "{invitationData.projectName}". Create a password to complete your
            account setup.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={invitationData.email}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Create Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                placeholder="Enter a secure password"
                required
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
                placeholder="Confirm your password"
                required
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/auth" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
