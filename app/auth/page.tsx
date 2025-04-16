"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Twitter, AlertCircle } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"
import { CheckIcon, UserIcon } from "./icons"
import { Logo } from "@/components/ui/logo"

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp, isLoading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localLoading, setLocalLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      if (isLogin) {
        // Sign in
        const result = await signIn(email, password)
        if (result?.error) {
          setError(result.error.message || "Authentication failed")
        }
      } else {
        // Sign up - Direct API call for better debugging
        setLocalLoading(true)
        const API_BASE_URL = "http://127.0.0.1:8000/api"
        console.log("Sending registration request with data:", { name, email, password, password_confirmation: confirmPassword })
        
        try {
          const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
              password_confirmation: confirmPassword
            })
          });
          
          console.log("Registration response status:", response.status);
          console.log("Response OK?", response.ok);
          
          const data = await response.json();
          console.log("Registration response data:", data);
          console.log("data.user exists?", !!data.user);
          console.log("data.access_token exists?", !!data.access_token);
          
          // Force success path for debugging
          if (response.status >= 200 && response.status < 300) {
            // Success - store user data and token
            console.log("Registration successful, storing user data and token");
            const user = {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
            };
            
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("authToken", data.access_token);
            
            // Redirect to onboarding
            console.log("Redirecting to onboarding page");
            router.push("/onboarding");
            return; // Exit early to avoid error message
          } else {
            // API returned an error
            const errorMessage = data.message || data.error || "Registration failed";
            console.error("Registration error:", errorMessage, data);
            setError(errorMessage);
          }
        } catch (apiError) {
          console.error("API request error:", apiError);
          setError("Network error during registration. Please try again.");
        } finally {
          setLocalLoading(false);
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      setError(error.message || "An error occurred during authentication")
      setLocalLoading(false);
    }
  }

  const handleSocialAuth = async (provider: string) => {
    // Since we're using Laravel Sanctum, social login will need
    // to be handled on the server side via an API endpoint.
    // You'll need to implement this on your Laravel backend.
    setError("Social login is not yet implemented.")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 md:p-16 flex flex-col">
        <div className="mb-8">
          <Logo />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Provider Dashboard</h1>
          <p className="text-gray-300 text-lg mb-12 leading-relaxed">
            Manage your clients, projects, and tasks all in one place. Streamline your workflow and boost productivity.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors">
                <CheckIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-white">Client Management</h3>
                <p className="text-gray-300 mt-1">Keep track of all your clients and their projects</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors">
                <CheckIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-white">Project Tracking</h3>
                <p className="text-gray-300 mt-1">Monitor progress and stay on top of deadlines</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 transition-colors">
                <CheckIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-white">Task Management</h3>
                <p className="text-gray-300 mt-1">Organize and prioritize your daily tasks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-400">© 2024 Provider Dashboard. All rights reserved.</div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-gray-600 text-lg">
              {isLogin ? "Sign in to access your dashboard" : "Sign up to get started with Provider Dashboard"}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-11 transition-all duration-200 group-hover:border-gray-300 text-gray-900 placeholder-gray-400"
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                  <div className="absolute left-3.5 top-3.5 text-gray-400 group-hover:text-gray-500 transition-colors">
                    <UserIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-11 transition-all duration-200 group-hover:border-gray-300 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute left-3.5 top-3.5 text-gray-400 group-hover:text-gray-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-11 transition-all duration-200 group-hover:border-gray-300 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute left-3.5 top-3.5 text-gray-400 group-hover:text-gray-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-11 transition-all duration-200 group-hover:border-gray-300 text-gray-900 placeholder-gray-400"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                  <div className="absolute left-3.5 top-3.5 text-gray-400 group-hover:text-gray-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!isLogin && password !== confirmPassword && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl px-4 py-3.5 font-medium hover:from-gray-800 hover:to-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              disabled={isLoading || localLoading}
            >
              {isLoading || localLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white">{isLogin ? "Signing in..." : "Creating account..."}</span>
                </>
              ) : (
                <>
                  <span className="text-white">{isLogin ? "Sign In" : "Create Account"}</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center my-8">
              <div className="border-t border-gray-200 absolute w-full"></div>
              <div className="bg-white px-4 relative z-10 text-sm text-gray-500">or continue with</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md text-gray-700"
                onClick={() => handleSocialAuth("github")}
              >
                <Github className="w-5 h-5 text-gray-700" />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md text-gray-700"
                onClick={() => handleSocialAuth("twitter")}
              >
                <Twitter className="w-5 h-5 text-gray-700" />
                <span>Twitter</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="ml-1 text-blue-600 hover:text-blue-500 font-medium transition-colors"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
            <Link 
              href="/auth/forgot-password" 
              className="inline-block text-sm text-blue-600 hover:text-blue-500 mt-3 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
