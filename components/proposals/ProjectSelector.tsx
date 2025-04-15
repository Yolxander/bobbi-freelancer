"use client"

import { useState, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"
import { getProjects } from "@/app/actions/project-actions"
import { useAuth } from "@/lib/auth-context"

interface ProjectSelectorProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}

export default function ProjectSelector({ value, onChange, readOnly = false }: ProjectSelectorProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.providerId) return

      try {
        setIsLoading(true)
        const result = await getProjects(user.providerId)
        if (result.success) {
          setProjects(result.data || [])
        } else {
          setError(result.error || "Failed to load projects")
        }
      } catch (err) {
        setError("Failed to load projects")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [user?.providerId])

  const selectedProject = projects?.find((project) => project.id === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !readOnly && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-2 border border-gray-200 rounded-lg ${
          readOnly ? "bg-gray-50" : "hover:border-gray-300"
        }`}
      >
        <span className="text-gray-700">
          {selectedProject ? selectedProject.name : "Select a project"}
        </span>
        {!readOnly && <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {!readOnly && isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading projects...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : projects?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No projects found</div>
          ) : (
            <div className="py-1">
              {projects?.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    onChange(project.id)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedProject && !readOnly && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-8 top-2 p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
} 