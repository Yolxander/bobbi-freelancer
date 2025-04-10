"use client"

import { useState, useEffect } from "react"
import { isWebDeveloperProvider } from "@/lib/provider-utils"

/**
 * Custom hook to check if a user is a web developer
 * @param userId The ID of the user to check
 * @returns A boolean indicating if the user is a web developer and a loading state
 */
export function useWebDeveloper(userId: string | undefined) {
  const [isWebDeveloper, setIsWebDeveloper] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkWebDeveloper = async () => {
      if (!userId) {
        setIsWebDeveloper(false)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        // Check if the provider is a web developer
        const isWebDev = await isWebDeveloperProvider(userId)
        setIsWebDeveloper(isWebDev)
      } catch (error) {
        console.error("Error checking if provider is web developer:", error)
        setIsWebDeveloper(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkWebDeveloper()
  }, [userId])

  return { isWebDeveloper, isLoading }
}
