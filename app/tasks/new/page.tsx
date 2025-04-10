"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { createTask } from "@/app/actions/task-actions"
import { getProjects } from "@/app/actions/project-actions"
import Sidebar from "@/components/sidebar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewTaskPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    category: "work",
    due_date: "",
    project_id: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        setIsLoading(true)

        const projectsResult = await getProjects(user.id)
        if (projectsResult.success) {
          setProjects(projectsResult.data)
          if (projectsResult.data.length > 0) {
            setTaskData((prev) => ({
              ...prev,
              project_id: projectsResult.data[0].id,
            }))
          }
        }

        setIsLoading(false)
      }
    }

    if (user) {
      fetchProjects()
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!taskData.title.trim()) {
      setError("Task title is required")
      return
    }

    if (!taskData.project_id) {
      setError("Please select a project")
      return
    }

    try {
      const result = await createTask({
        ...taskData,
        provider_id: user.id,
      })

      if (result.success) {
        router.push("/tasks")
      } else {
        setError(result.error || "Failed to create task")
      }
    } catch (error) {
      console.error("Error creating task:", error)
      setError("An unexpected error occurred")
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/tasks" className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <h1 className="text-2xl font-bold">Create New Task</h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-900"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:border-gray-900"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="project_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Project *
                  </label>
                  <select
                    id="project_id"
                    name="project_id"
                    value={taskData.project_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-900"
                    required
                  >
                    {projects.length === 0 ? (
                      <option value="" disabled>
                        No projects available
                      </option>
                    ) : (
                      projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={taskData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-900"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={taskData.priority}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-900"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={taskData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-900"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="meetings">Meetings</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={taskData.due_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link
                  href="/tasks"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
