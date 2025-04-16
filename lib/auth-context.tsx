"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string // Assuming Laravel Sanctum will provide a user ID
  email?: string
  name?: string
  providerId?: string // Add field to store the provider ID
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, confirmPassword: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const API_BASE_URL = "http://127.0.0.1:8000/api" // Local development server
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // Helper function to handle API requests
  const apiRequest = async (endpoint: string, method = "GET", body?: any, headers?: any) => {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": APP_URL,
        ...headers,
      },
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json()
        console.error(`API Request Failed: Status: ${response.status}, Body: ${JSON.stringify(errorData)}`)
        throw new Error(`HTTP error! status: ${response.status}, body: ${JSON.stringify(errorData)}`)
      }

      if (response.status === 204) {
        // No content
        return null
      }

      return await response.json()
    } catch (error: any) {
      console.error("API Request Error:", error)
      throw new Error(error.message || "An error occurred during the API request")
    }
  }

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("authToken")

    async function initializeAuth() {
      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)

          // Check if provider profile exists for the stored user
          // Only proceed if we're not already on the onboarding or auth pages
          const currentPath = pathname
          if (currentPath !== "/onboarding" && currentPath !== "/auth" && currentPath !== "/") {
            // Don't redirect if we're on a valid page like /clients, /projects, etc.
            const validPaths = ["/clients", "/projects", "/tasks", "/messaging", "/calendar", "/files", "/profile", "/proposals"]
            const isValidPath = validPaths.some((path) => currentPath.startsWith(path))

            if (!isValidPath) {
              await checkProviderProfile(parsedUser.id, storedToken)
            }
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error)
          localStorage.removeItem("user")
          localStorage.removeItem("authToken")
          router.push("/auth")
        }
      } else if (window.location.pathname !== "/auth" && window.location.pathname !== "/") {
        // If no user is stored and we're not on the auth page or landing page, redirect to auth
        router.push("/auth")
      }
      setLoading(false)
    }

    initializeAuth()
  }, [router, pathname])

  // Function to check if a provider profile exists
  const checkProviderProfile = async (userId: string, token: string) => {
    try {
      console.log("Checking provider profile for user:", userId)

      // Update to use path parameter instead of query parameter
      const requestUrl = `${API_BASE_URL}/providers/by-user/${userId}`
      console.log("Making request to:", requestUrl)
      console.log("With headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      })

      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Provider check response status:", response.status)

      // Log the raw response
      const responseText = await response.text()
      console.log("Raw response:", responseText)

      // Parse the response if it's valid JSON
      let data
      try {
        data = JSON.parse(responseText)
        console.log("Parsed provider response:", data)
      } catch (e) {
        console.error("Failed to parse response as JSON:", e)
        // Continue with the text response
        data = responseText
      }

      if (response.status === 200) {
        // Check if we have a valid provider
        const hasProvider = data && data.provider && Array.isArray(data.provider) && data.provider.length > 0

        console.log("Has provider:", hasProvider)

        if (hasProvider) {
          // Store the provider ID in the user object
          const providerId = data.provider[0].id
          console.log("Found provider ID:", providerId)

          // Get the current user from state or create a new one
          setUser((prevUser) => {
            if (!prevUser) {
              // If no user exists yet, create one with the userId
              const newUser = { id: userId, providerId: providerId }
              localStorage.setItem("user", JSON.stringify(newUser))
              return newUser
            } else {
              // Update existing user with provider ID
              const updatedUser = { ...prevUser, providerId: providerId }
              localStorage.setItem("user", JSON.stringify(updatedUser))
              return updatedUser
            }
          })

          // Provider exists, go to dashboard
          console.log("Provider profile found, redirecting to dashboard")
          router.push("/dashboard")
          return true
        } else {
          // No provider found in the response
          console.log("No provider found in response, redirecting to onboarding")
          router.push("/onboarding")
          return false
        }
      } else if (response.status === 404) {
        // 404 is expected when a provider doesn't exist - redirect to onboarding
        console.log("Provider profile not found (404), redirecting to onboarding")
        router.push("/onboarding")
        return false
      } else {
        // Unexpected error
        console.error("Unexpected error checking provider profile:", responseText)
        // Default to onboarding on error to ensure user setup completes
        router.push("/onboarding")
        return false
      }
    } catch (error) {
      console.error("Error checking provider profile:", error)
      // Default to onboarding on error to ensure user setup completes
      router.push("/onboarding")
      return false
    }
  }

  const signIn = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const data = await apiRequest("/login", "POST", { email, password })

      if (data && data.access_token && data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        }
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("authToken", data.access_token)

        // Check if provider profile exists and redirect accordingly
        const hasProvider = await checkProviderProfile(user.id, data.access_token)

        return { error: null }
      } else {
        const message = data?.message || "Login failed"
        console.error("Sign-in error:", message, data)
        throw new Error(message)
      }
    } catch (error: any) {
      console.error("Sign-in error:", error)
      setError(error.message)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, confirmPassword: string) => {
    setError(null)
    setLoading(true)
    try {
      const data = await apiRequest("/register", "POST", {
        name: fullName,
        email,
        password,
        password_confirmation: confirmPassword,
      })

      if (data && data.user && data.access_token) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        }
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("authToken", data.access_token)

        // New users should go to onboarding
        router.push("/onboarding")

        return { error: null, message: null }
      } else {
        const message = data?.message || "Registration failed"
        throw new Error(message)
      }
    } catch (error: any) {
      console.error("Sign-up error:", error)
      setError(error.message)
      return { error, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setError(null)
    setLoading(true)
    try {
      const token = localStorage.getItem("authToken")
      await apiRequest("/logout", "POST", undefined, {
        Authorization: `Bearer ${token}`,
      })
      localStorage.removeItem("user")
      localStorage.removeItem("authToken")
      setUser(null)
      router.push("/auth")
    } catch (error: any) {
      console.error("Sign-out error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
