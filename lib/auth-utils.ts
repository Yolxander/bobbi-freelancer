"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"

export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      const authToken = localStorage.getItem("authToken")

      if (!authToken) {
        router.push("/auth")
      }
    }
  }, [user, loading, router])

  return { user, isLoading: loading }
}
