"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Twitter, AlertCircle } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"
import { CheckIcon, UserIcon } from "./icons"
import { Logo } from "@/components/ui/logo"
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'] })

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localLoading, setLocalLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLocalLoading(true)

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
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      setError(error.message || "An error occurred during authentication")
    } finally {
      setLocalLoading(false)
    }
  }

  const handleSocialAuth = async (provider: string) => {
    // Since we're using Laravel Sanctum, social login will need
    // to be handled on the server side via an API endpoint.
    // You'll need to implement this on your Laravel backend.
    setError("Social login is not yet implemented.")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-[1200px] mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className={`${orbitron.className} text-xl tracking-tight`}>Bobbi</div>
              <div className="flex items-center gap-8">
                <Link href="/" className="text-[15px] text-gray-600 hover:text-gray-900">Home</Link>
                <div className="relative group">
                  <button className="text-[15px] text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
                    Get started
                    <svg className="w-4 h-4 mt-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>
                <Link href="/about" className="text-[15px] text-gray-600 hover:text-gray-900">About</Link>
                <Link href="/forum" className="text-[15px] text-gray-600 hover:text-gray-900">Forum</Link>
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
              <button className="px-6 py-2 bg-[#D91ACC] rounded-full text-[15px] font-medium hover:bg-[#D1FF75] transition-colors">
                Login
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        <div className="min-h-[calc(100vh-5rem)] flex">
          {/* Left side */}
          <div className="w-1/2 flex flex-col items-center justify-center">
            <div className="max-w-[600px] space-y-20">
              {/* Main content */}
              <div>
              <div>
                <div className="text-sm text-gray-500 mb-4">FREELANCER & CLIENT PLATFORM</div>
                <h1 className="text-[56px] font-medium leading-[1.1] tracking-[-0.02em] mb-20">
                  DESIGNED TO
                  <br />
                  <span className="relative z-2">
                    STREAMLINE WORKFLOWS
                  </span>
                  <br />
                  AND KEEP EVERYONE IN SYNC
                  <span className="inline-flex gap-1 ml-2">
                    <span className="w-4 h-4 rounded-full bg-[#1B1B1B]"></span>
                    <span className="w-4 h-4 rounded-full bg-[#1B1B1B] opacity-60"></span>
                    <span className="w-4 h-4 rounded-full bg-[#1B1B1B] opacity-30"></span>
                    <span className="w-4 h-4 rounded-full bg-[#2BD7D7]"></span>
                  </span>
                </h1>
              </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="text-gray-500">
                    {isLogin ? "Don't have account?" : "Already have an account?"}
                  </div>
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="inline-flex items-center text-[#1B1B1B] border-b border-[#1B1B1B] pb-0.5 hover:opacity-80 transition-opacity"
                  >
                    {isLogin ? "Create account" : "Sign in"}
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8h14M8 1l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* About section */}
              {/* <div className="w-full rounded-2xl overflow-hidden bg-black text-white">
                <div className="relative aspect-[16/9]">
                  <img 
                    src="/placeholder.jpg" 
                    alt="Classic car" 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="text-xl font-medium">About us</div>
                    <div className="text-base opacity-80">
                      Over <span className="text-[#2BD7D7]">3 million</span> free high-resolution
                      images brought to you by the world's most generous community of photographers.
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right side */}
          <div className="w-1/2 bg-[url('/placeholder.jpg')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-black/20 mx-20 my-5 rounded-lg"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">
                {isLogin ? "Login to your account" : "Create your account"}
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm text-gray-600 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      required={!isLogin}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-600 mb-1.5">
                    {isLogin ? "Username" : "Email Address"}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm text-gray-600 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                      Forgot your password?
                    </Link>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={localLoading}
                  className="w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {localLoading ? "Please wait..." : (isLogin ? "Login" : "Create Account")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
