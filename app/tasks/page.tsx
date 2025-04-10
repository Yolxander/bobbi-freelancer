"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getTasks, toggleTaskCompletion, updateTask } from "@/app/actions/task-actions"
import Sidebar from "@/components/sidebar"
import {
  CheckSquare,
  Square,
  Plus,
  Search,
  List,
  Columns,
  Filter,
  ArrowUp,
  ArrowDown,
  Calendar,
  Tag,
  Clock,
  Briefcase,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [clientFilter, setClientFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [viewMode, setViewMode] = useState("kanban") // "list" or "kanban"
  const [draggedTask, setDraggedTask] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        setIsLoading(true)
        setError(null)

        try {
          const result = await getTasks(user.id)

          if (result.success) {
            setTasks(result.data)

            // Extract unique clients and projects
            const uniqueClients = Array.from(
              new Set(
                result.data
                  .filter((task) => task.client)
                  .map((task) => JSON.stringify({ id: task.client_id, name: task.client })),
              ),
            ).map((str) => JSON.parse(str))

            const uniqueProjects = Array.from(
              new Set(
                result.data
                  .filter((task) => task.project)
                  .map((task) => JSON.stringify({ id: task.project_id, name: task.project })),
              ),
            ).map((str) => JSON.parse(str))

            setClients(uniqueClients)
            setProjects(uniqueProjects)
          } else {
            setError(result.error || "Failed to load tasks")
          }
        } catch (err) {
          console.error("Error fetching tasks:", err)
          setError("Failed to load tasks")
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchTasks()
    }
  }, [user])

  const handleToggleTask = async (taskId, completed) => {
    try {
      const result = await toggleTaskCompletion(taskId, !completed)

      if (result.success) {
        // Update the task in the local state
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !completed } : task)))
      } else {
        setError(result.error || "Failed to update task")
      }
    } catch (err) {
      console.error("Error toggling task:", err)
      setError("Failed to update task")
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    setIsDragging(true)

    // Set a ghost image for better UX
    const ghostElement = document.createElement("div")
    ghostElement.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "w-64")
    ghostElement.textContent = task.title
    ghostElement.style.position = "absolute"
    ghostElement.style.top = "-1000px"
    document.body.appendChild(ghostElement)

    e.dataTransfer.setDragImage(ghostElement, 0, 0)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", task.id)

    // Add a timeout to remove the ghost element
    setTimeout(() => {
      document.body.removeChild(ghostElement)
    }, 0)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDraggedTask(null)
  }

  const handleDragOver = (e, status) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()

    if (!draggedTask || draggedTask.status === newStatus) return

    try {
      // Optimistically update the UI
      setTasks(tasks.map((task) => (task.id === draggedTask.id ? { ...task, status: newStatus } : task)))

      // Update in the database
      const result = await updateTask(draggedTask.id, { status: newStatus })

      if (!result.success) {
        // Revert if failed
        setTasks(tasks)
        setError(result.error || "Failed to update task status")
      }
    } catch (err) {
      console.error("Error updating task status:", err)
      // Revert on error
      setTasks(tasks)
      setError("Failed to update task status")
    }

    setDraggedTask(null)
    setIsDragging(false)
  }

  const filteredTasks = tasks.filter((task) => {
    // Apply status filter
    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false
    }

    // Apply priority filter
    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false
    }

    // Apply client filter
    if (clientFilter !== "all" && task.client_id !== clientFilter) {
      return false
    }

    // Apply project filter
    if (projectFilter !== "all" && task.project_id !== projectFilter) {
      return false
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.project && task.project.toLowerCase().includes(query)) ||
        (task.client && task.client.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Group tasks by status for Kanban view
  const tasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    "in-progress": filteredTasks.filter((task) => task.status === "in-progress"),
    review: filteredTasks.filter((task) => task.status === "review"),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading tasks...</p>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-2 rounded-lg ${viewMode === "kanban" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                aria-label="Kanban view"
              >
                <Columns className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`p-2 rounded-lg flex items-center gap-1 ${isFiltersOpen ? "bg-gray-200" : "hover:bg-gray-100"}`}
                aria-label="Toggle filters"
              >
                <Filter className="w-5 h-5" />
                <span className="sr-only md:not-sr-only md:text-sm">Filters</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${isFiltersOpen ? "rotate-180" : ""} hidden md:block`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <Link
                href="/tasks/new"
                className="flex items-center gap-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" /> New Task
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>

          {isFiltersOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn">
              <div className="relative">
                <label htmlFor="status-filter" className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 appearance-none pr-8 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
                <Filter className="absolute right-2 bottom-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                  Priority
                </label>
                <select
                  id="priority-filter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 appearance-none pr-8 text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <Filter className="absolute right-2 bottom-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <label htmlFor="client-filter" className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                  Client
                </label>
                <select
                  id="client-filter"
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 appearance-none pr-8 text-sm"
                >
                  <option value="all">All Clients</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <Users className="absolute right-2 bottom-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <label htmlFor="project-filter" className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                  Project
                </label>
                <select
                  id="project-filter"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 appearance-none pr-8 text-sm"
                >
                  <option value="all">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <Briefcase className="absolute right-2 bottom-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Tasks Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="mt-2 text-sm underline">
                Try again
              </button>
            </div>
          )}

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-700">No tasks found</h3>
              <p className="text-gray-500 mt-2">
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first task to get started"}
              </p>
              <Link
                href="/tasks/new"
                className="mt-4 inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
              >
                <Plus className="inline-block w-4 h-4 mr-1" /> New Task
              </Link>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <button onClick={() => handleToggleTask(task.id, task.completed)} className="mt-1 mr-3 flex-shrink-0">
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-green-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-300" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <Link href={`/tasks/${task.id}`} className="block">
                      <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {task.project && (
                          <div className="flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            <Briefcase className="w-3 h-3" />
                            <span>{task.project}</span>
                          </div>
                        )}
                        <div
                          className={`
                            flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                            ${
                              task.status === "todo"
                                ? "bg-gray-100 text-gray-700"
                                : task.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : task.status === "review"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                            }
                          `}
                        >
                          <Tag className="w-3 h-3" />
                          <span>
                            {task.status === "todo"
                              ? "To Do"
                              : task.status === "in-progress"
                                ? "In Progress"
                                : task.status === "review"
                                  ? "Review"
                                  : "Completed"}
                          </span>
                        </div>
                        {task.priority && (
                          <div
                            className={`
                              flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                              ${
                                task.priority === "low"
                                  ? "bg-green-100 text-green-700"
                                  : task.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }
                            `}
                          >
                            {task.priority === "low" ? (
                              <ArrowDown className="w-3 h-3" />
                            ) : task.priority === "high" ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <MinusIcon className="w-3 h-3" />
                            )}
                            <span>{task.priority}</span>
                          </div>
                        )}
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
              {/* To Do Column */}
              <div
                className="flex flex-col"
                onDragOver={(e) => handleDragOver(e, "todo")}
                onDrop={(e) => handleDrop(e, "todo")}
              >
                <h3 className="font-medium text-gray-700 mb-3 px-2 flex items-center gap-2">
                  <CircleIcon className="w-4 h-4 text-gray-400" />
                  <span>To Do</span>
                  <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                    {tasksByStatus.todo.length}
                  </span>
                </h3>
                <div
                  className={`bg-gray-50 rounded-lg p-2 flex-1 min-h-[200px] ${isDragging ? "border-2 border-dashed border-gray-300" : ""}`}
                >
                  {tasksByStatus.todo.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">No tasks to do</div>
                  ) : (
                    <div className="space-y-2">
                      {tasksByStatus.todo.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          className={`p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm cursor-grab ${draggedTask?.id === task.id ? "opacity-50" : ""}`}
                        >
                          <Link href={`/tasks/${task.id}`}>
                            <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                                </span>
                              </div>
                              <div
                                className={`
                                  text-xs font-medium px-2 py-0.5 rounded-full
                                  ${
                                    task.priority === "low"
                                      ? "bg-green-100 text-green-700"
                                      : task.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                  }
                                `}
                              >
                                {task.priority}
                              </div>
                            </div>
                            {task.project && (
                              <div className="mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full inline-block">
                                {task.project}
                              </div>
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div
                className="flex flex-col"
                onDragOver={(e) => handleDragOver(e, "in-progress")}
                onDrop={(e) => handleDrop(e, "in-progress")}
              >
                <h3 className="font-medium text-gray-700 mb-3 px-2 flex items-center gap-2">
                  <CircleIcon className="w-4 h-4 text-blue-500" />
                  <span>In Progress</span>
                  <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {tasksByStatus["in-progress"].length}
                  </span>
                </h3>
                <div
                  className={`bg-blue-50 rounded-lg p-2 flex-1 min-h-[200px] ${isDragging ? "border-2 border-dashed border-blue-300" : ""}`}
                >
                  {tasksByStatus["in-progress"].length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">No tasks in progress</div>
                  ) : (
                    <div className="space-y-2">
                      {tasksByStatus["in-progress"].map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          className={`p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm cursor-grab ${draggedTask?.id === task.id ? "opacity-50" : ""}`}
                        >
                          <Link href={`/tasks/${task.id}`}>
                            <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                                </span>
                              </div>
                              <div
                                className={`
                                  text-xs font-medium px-2 py-0.5 rounded-full
                                  ${
                                    task.priority === "low"
                                      ? "bg-green-100 text-green-700"
                                      : task.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                  }
                                `}
                              >
                                {task.priority}
                              </div>
                            </div>
                            {task.project && (
                              <div className="mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full inline-block">
                                {task.project}
                              </div>
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Review Column */}
              <div
                className="flex flex-col"
                onDragOver={(e) => handleDragOver(e, "review")}
                onDrop={(e) => handleDrop(e, "review")}
              >
                <h3 className="font-medium text-gray-700 mb-3 px-2 flex items-center gap-2">
                  <CircleIcon className="w-4 h-4 text-yellow-500" />
                  <span>Review</span>
                  <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                    {tasksByStatus.review.length}
                  </span>
                </h3>
                <div
                  className={`bg-yellow-50 rounded-lg p-2 flex-1 min-h-[200px] ${isDragging ? "border-2 border-dashed border-yellow-300" : ""}`}
                >
                  {tasksByStatus.review.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">No tasks in review</div>
                  ) : (
                    <div className="space-y-2">
                      {tasksByStatus.review.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          className={`p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm cursor-grab ${draggedTask?.id === task.id ? "opacity-50" : ""}`}
                        >
                          <Link href={`/tasks/${task.id}`}>
                            <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                                </span>
                              </div>
                              <div
                                className={`
                                  text-xs font-medium px-2 py-0.5 rounded-full
                                  ${
                                    task.priority === "low"
                                      ? "bg-green-100 text-green-700"
                                      : task.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                  }
                                `}
                              >
                                {task.priority}
                              </div>
                            </div>
                            {task.project && (
                              <div className="mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full inline-block">
                                {task.project}
                              </div>
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Column */}
              <div
                className="flex flex-col"
                onDragOver={(e) => handleDragOver(e, "completed")}
                onDrop={(e) => handleDrop(e, "completed")}
              >
                <h3 className="font-medium text-gray-700 mb-3 px-2 flex items-center gap-2">
                  <CircleIcon className="w-4 h-4 text-green-500" />
                  <span>Completed</span>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {tasksByStatus.completed.length}
                  </span>
                </h3>
                <div
                  className={`bg-green-50 rounded-lg p-2 flex-1 min-h-[200px] ${isDragging ? "border-2 border-dashed border-green-300" : ""}`}
                >
                  {tasksByStatus.completed.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">No completed tasks</div>
                  ) : (
                    <div className="space-y-2">
                      {tasksByStatus.completed.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          className={`p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm cursor-grab ${draggedTask?.id === task.id ? "opacity-50" : ""}`}
                        >
                          <Link href={`/tasks/${task.id}`}>
                            <h4 className="font-medium line-through text-gray-500 line-clamp-2">{task.title}</h4>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <CheckSquare className="w-3 h-3 text-green-500" />
                                <span>Completed</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(task.updated_at).toLocaleDateString()}
                              </div>
                            </div>
                            {task.project && (
                              <div className="mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full inline-block">
                                {task.project}
                              </div>
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MinusIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function CircleIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}
