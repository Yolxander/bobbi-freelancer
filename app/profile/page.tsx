"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getProviderProfile, updateProviderProfile, getProviderTypes } from "../actions/provider-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, Upload, User, ChevronLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import Sidebar from "@/components/sidebar"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [providerTypes, setProviderTypes] = useState<any[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [needsMigration, setNeedsMigration] = useState(false)
  const [otherProviderType, setOtherProviderType] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch provider profile
          const profileResult = await getProviderProfile(user.id)
          if (profileResult.success) {
            setProfile(profileResult.data)

            // If the user has a custom provider type, set it
            if (profileResult.data.custom_provider_type) {
              setOtherProviderType(profileResult.data.custom_provider_type)
            }
          } else {
            setError(`Error fetching profile: ${profileResult.error}`)
            // Check if the error is about missing bio column
            if (profileResult.error && profileResult.error.includes("bio")) {
              setNeedsMigration(true)
            }
          }

          // Fetch provider types
          const typesResult = await getProviderTypes()
          if (typesResult.success) {
            setProviderTypes(typesResult.data)
          } else {
            setError(`Error fetching provider types: ${typesResult.error}`)
          }
        } catch (err) {
          setError(`Error: ${err.message}`)
          // Check if the error is about missing bio column
          if (err.message && err.message.includes("bio")) {
            setNeedsMigration(true)
          }
        } finally {
          setIsLoaded(true)
        }
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile({ ...profile, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setProfile({ ...profile, [name]: value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    setError(null)
    setSuccess(null)

    try {
      // Update profile with only the fields we want to change
      const updateData: any = {}

      if (profile.full_name !== undefined) updateData.full_name = profile.full_name
      if (profile.email !== undefined) updateData.email = profile.email
      if (profile.provider_type_id !== undefined) updateData.provider_type_id = profile.provider_type_id

      // Only include bio if the column exists
      if (!needsMigration && profile.bio !== undefined) {
        updateData.bio = profile.bio
      }

      // Add custom provider type if "Other" is selected
      const otherType = providerTypes.find((type) => type.name === "Other")
      if (profile.provider_type_id === otherType?.id) {
        updateData.custom_provider_type = otherProviderType
      } else {
        // Clear custom provider type if not "Other"
        updateData.custom_provider_type = null
      }

      const result = await updateProviderProfile(user.id, updateData)

      if (result.success) {
        setSuccess("Profile updated successfully!")
      } else {
        setError(`Failed to update profile: ${result.error}`)
        // Check if the error is about missing columns
        if (result.error && (result.error.includes("bio") || result.error.includes("custom_provider_type"))) {
          setNeedsMigration(true)
        }
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
      // Check if the error is about missing columns
      if (err.message && (err.message.includes("bio") || err.message.includes("custom_provider_type"))) {
        setNeedsMigration(true)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const runBioMigration = async () => {
    setIsUpdating(true)
    setError(null)

    try {
      const supabase = createClientComponentClient()

      // SQL to add bio and custom_provider_type columns
      const sql = `
        -- Add bio column to providers table if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'providers' AND column_name = 'bio'
          ) THEN
            ALTER TABLE providers ADD COLUMN bio TEXT;
          END IF;
          
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'providers' AND column_name = 'custom_provider_type'
          ) THEN
            ALTER TABLE providers ADD COLUMN custom_provider_type TEXT;
          END IF;
        END
        $$;
        
        -- Insert "Other" provider type if it doesn't exist
        INSERT INTO provider_types (name, description)
        VALUES ('Other', 'Other professional services not listed in the categories above')
        ON CONFLICT (name) DO NOTHING;
      `

      // Execute the SQL
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) {
        throw error
      }

      setNeedsMigration(false)
      setSuccess("Database updated successfully! You can now update your profile.")

      // Refresh the page to reload data
      window.location.reload()
    } catch (error) {
      console.error("Migration error:", error)
      setError(`Migration error: ${error.message || "Unknown error occurred"}`)
    } finally {
      setIsUpdating(false)
    }
  }

  // Find the "Other" provider type
  const otherType = providerTypes.find((type) => type.name === "Other")
  const isOtherSelected = profile?.provider_type_id === otherType?.id

  if (isLoading || !isLoaded) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (needsMigration) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Database Update Required</CardTitle>
              <CardDescription>We need to update the database to support new profile features.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Your profile needs a database update to add new fields. This is a one-time update.
              </p>

              {error && <div className="p-3 rounded-md mt-4 bg-red-50 text-red-700">{error}</div>}

              {success && <div className="p-3 rounded-md mt-4 bg-green-50 text-green-700">{success}</div>}
            </CardContent>
            <CardFooter>
              <Button onClick={runBioMigration} disabled={isUpdating} className="w-full">
                {isUpdating ? "Updating Database..." : "Update Database"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-semibold text-gray-800">Provider Profile</h1>
            </div>
            <Button type="button" onClick={handleSubmit} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">{success}</div>
          )}
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Avatar Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Upload a professional photo</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview || "/placeholder.svg"}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url || "/placeholder.svg"}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("avatar")?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    {avatarFile && <p className="text-sm text-gray-500 mt-2 truncate max-w-full">{avatarFile.name}</p>}
                  </CardContent>
                </Card>

                {/* Provider Type Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Type</CardTitle>
                    <CardDescription>Select your specialization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select
                      value={profile?.provider_type_id || ""}
                      onValueChange={(value) => handleSelectChange("provider_type_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your provider type" />
                      </SelectTrigger>
                      <SelectContent>
                        {providerTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Show custom provider type input if "Other" is selected */}
                    {isOtherSelected && (
                      <div className="space-y-2 pt-2">
                        <Label htmlFor="custom_provider_type">Specify your provider type</Label>
                        <Input
                          id="custom_provider_type"
                          value={otherProviderType}
                          onChange={(e) => setOtherProviderType(e.target.value)}
                          placeholder="e.g., Marketing, Consulting, Education"
                        />
                      </div>
                    )}

                    <p className="text-xs text-gray-500">This helps clients find you for relevant projects</p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column (wider) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={profile?.full_name || ""}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile?.email || ""}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bio Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Bio</CardTitle>
                    <CardDescription>Tell clients about your expertise and experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profile?.bio || ""}
                      onChange={handleInputChange}
                      placeholder="Describe your professional background, skills, and the services you offer..."
                      rows={6}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Additional Information Card - Can be expanded later */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                    <CardDescription>Highlight your key professional skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 italic">
                      This section will be available soon. You'll be able to add specific skills and expertise levels to
                      showcase to potential clients.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mobile Save Button (visible on small screens) */}
            <div className="lg:hidden">
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
