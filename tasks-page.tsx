"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  CheckSquare,
  Search,
  ChevronRight,
  Plus,
  Users,
  Briefcase,
  CheckCircle,
  CalendarIcon,
  Tag,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  X,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react"
import tasksData from "./tasks-data.json"
import Sidebar from "./components/sidebar"

export default function TasksPage() {
  const [viewMode, setViewMode] = useState("list") // "list" or "kanban"
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeCategory, setActiveCategory] = useState("all")
  const [groupBy, setGroupBy] = useState("status") // "status", "project", "client"
  const [selectedTask, setSelectedTask] = useState(null)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    projects: [],
    clients: [],
    priorities: [],
    categories: [],
  })
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    category: "work",
    status: "todo",
    project: "",
    client: "",
  })
  const [tasks, setTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // Load data from JSON
  const { categories, filters, projects, clients } = tasksData

  useEffect(() => {
    // Initialize tasks from JSON data
    setTasks(tasksData.tasks)
  }, [])

  // Add this useEffect to handle closing dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close project filter dropdown
      const projectDropdown = document.getElementById("projectFilterDropdown")
      if (
        projectDropdown &&
        !projectDropdown.contains(event.target) &&
        !event.target.closest("button")?.getAttribute("data-dropdown") === "project"
      ) {
        projectDropdown.classList.add("hidden")
      }

      // Close client filter dropdown
      const clientDropdown = document.getElementById("clientFilterDropdown")
      if (
        clientDropdown &&
        !clientDropdown.contains(event.target) &&
        !event.target.closest("button")?.getAttribute("data-dropdown") === "client"
      ) {
        clientDropdown.classList.add("hidden")
      }

      // Close priority filter dropdown
      const priorityDropdown = document.getElementById("priorityFilterDropdown")
      if (
        priorityDropdown &&
        !priorityDropdown.contains(event.target) &&
        !event.target.closest("button")?.getAttribute("data-dropdown") === "priority"
      ) {
        priorityDropdown.classList.add("hidden")
      }

      // Close group by dropdown
      const groupByDropdown = document.getElementById("groupByDropdown")
      if (
        groupByDropdown &&
        !groupByDropdown.contains(event.target) &&
        !event.target.closest("button")?.getAttribute("data-dropdown") === "groupBy"
      ) {
        groupByDropdown.classList.add("hidden")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter tasks based on active filter, category, and other filter options
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = activeFilter === "all" || task.status === activeFilter
    const matchesCategory = activeCategory === "all" || task.category === activeCategory
    const matchesProjects = filterOptions.projects.length === 0 || filterOptions.projects.includes(task.project)
    const matchesClients = filterOptions.clients.length === 0 || filterOptions.clients.includes(task.client)
    const matchesPriorities = filterOptions.priorities.length === 0 || filterOptions.priorities.includes(task.priority)
    const matchesCategories = filterOptions.categories.length === 0 || filterOptions.categories.includes(task.category)
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.client.toLowerCase().includes(searchQuery.toLowerCase())

    return (
      matchesFilter &&
      matchesCategory &&
      matchesProjects &&
      matchesClients &&
      matchesPriorities &&
      matchesCategories &&
      matchesSearch
    )
  })

  // Group tasks based on groupBy option
  const groupedTasks = () => {
    if (groupBy === "status") {
      return {
        todo: filteredTasks.filter((task) => task.status === "todo"),
        "in-progress": filteredTasks.filter((task) => task.status === "in-progress"),
        review: filteredTasks.filter((task) => task.status === "review"),
        completed: filteredTasks.filter((task) => task.status === "completed"),
      }
    } else if (groupBy === "project") {
      const grouped = {}
      projects.forEach((project) => {
        grouped[project] = filteredTasks.filter((task) => task.project === project)
      })
      return grouped
    } else if (groupBy === "client") {
      const grouped = {}
      clients.forEach((client) => {
        grouped[client] = filteredTasks.filter((task) => task.client === client)
      })
      return grouped
    }
  }

  // Get task priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <div className="flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
            <ArrowUp className="w-3 h-3" /> High
          </div>
        )
      case "medium":
        return (
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
            <ArrowRight className="w-3 h-3" /> Medium
          </div>
        )
      case "low":
        return (
          <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
            <ArrowDown className="w-3 h-3" /> Low
          </div>
        )
      default:
        return null
    }
  }

  // Get task status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "todo":
        return <div className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">To Do</div>
      case "in-progress":
        return <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">In Progress</div>
      case "review":
        return <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Review</div>
      case "completed":
        return <div className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Completed</div>
      default:
        return null
    }
  }

  // Get category color
  const getCategoryColor = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.color : "bg-gray-100 text-gray-700"
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Calculate days remaining
  const getDaysRemaining = (dateString) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)

    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return <span className="text-red-500">Overdue by {Math.abs(diffDays)} days</span>
    } else if (diffDays === 0) {
      return <span className="text-orange-500">Due today</span>
    } else {
      return <span className="text-gray-500">{diffDays} days remaining</span>
    }
  }

  // Handle task selection
  const handleTaskSelect = (task) => {
    setSelectedTask(task)
  }

  // Handle task status change
  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, status: newStatus })
    }
  }

  // Handle drag and drop
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    const taskId = Number.parseInt(e.dataTransfer.getData("taskId"))
    handleStatusChange(taskId, status)
  }

  // Handle subtask toggle
  const handleSubtaskToggle = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
          )
          return { ...task, subtasks: updatedSubtasks }
        }
        return task
      }),
    )

    if (selectedTask && selectedTask.id === taskId) {
      const updatedSubtasks = selectedTask.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
      )
      setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks })
    }
  }

  // Handle add task
  const handleAddTask = (e) => {
    e.preventDefault()

    const newTaskObj = {
      id: tasks.length + 1,
      ...newTask,
      subtasks: [],
    }

    setTasks([...tasks, newTaskObj])
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      category: "work",
      status: "todo",
      project: "",
      client: "",
    })
    setIsAddTaskModalOpen(false)
  }

  // Handle filter change
  const handleFilterChange = (type, value) => {
    setFilterOptions((prev) => {
      const newOptions = { ...prev }

      if (newOptions[type].includes(value)) {
        newOptions[type] = newOptions[type].filter((item) => item !== value)
      } else {
        newOptions[type] = [...newOptions[type], value]
      }

      return newOptions
    })
  }

  // Get icon for category
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case "work":
        return <Briefcase className="w-4 h-4" />
      case "personal":
        return <Users className="w-4 h-4" />
      case "meetings":
        return <CalendarIcon className="w-4 h-4" />
      default:
        return <Tag className="w-4 h-4" />
    }
  }

  // Render task card
  // Modify the renderTaskCard function to make cards more compact in Kanban view
  const renderTaskCard = (task) => {
    return (
      <div
        key={task.id}
        className={`bg-white rounded-xl shadow-sm p-3 hover:shadow transition-shadow cursor-pointer ${
          selectedTask && selectedTask.id === task.id ? "border border-blue-500" : "border border-gray-100"
        }`}
        onClick={() => handleTaskSelect(task)}
        draggable={viewMode === "kanban"}
        onDragStart={(e) => handleDragStart(e, task.id)}
      >
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-lg ${
              task.category === "work" ? "bg-blue-100" : task.category === "meetings" ? "bg-green-100" : "bg-purple-100"
            } flex items-center justify-center mr-2 flex-shrink-0`}
          >
            <CheckSquare
              className={`w-4 h-4 ${
                task.category === "work"
                  ? "text-blue-600"
                  : task.category === "meetings"
                    ? "text-green-600"
                    : "text-purple-600"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={`font-medium text-sm truncate ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
            >
              {task.title}
            </h4>
            <p className="text-xs text-gray-500 truncate">
              {task.project} - Due {formatDate(task.dueDate)}
            </p>
          </div>
          <div
            className={`
          text-xs font-medium px-2 py-0.5 rounded ml-1 flex-shrink-0
          ${
            task.status === "todo"
              ? "bg-gray-100 text-gray-700"
              : task.status === "in-progress"
                ? "bg-green-100 text-green-700"
                : task.status === "review"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
          }
        `}
          >
            {task.status === "todo"
              ? "To Do"
              : task.status === "in-progress"
                ? "In Progress"
                : task.status === "review"
                  ? "Review"
                  : "Completed"}
          </div>
        </div>
        {viewMode === "kanban" && (
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1 truncate max-w-[60%]">
              <Users className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{task.client}</span>
            </div>
            <div>
              {task.subtasks.length > 0 && (
                <div className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3" />
                  <span>
                    {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Get column title based on groupBy
  const getColumnTitle = (key) => {
    if (groupBy === "status") {
      switch (key) {
        case "todo":
          return "To Do"
        case "in-progress":
          return "In Progress"
        case "review":
          return "Review"
        case "completed":
          return "Completed"
        default:
          return key
      }
    } else {
      return key
    }
  }

  // Get column color based on groupBy
  const getColumnColor = (key) => {
    if (groupBy === "status") {
      switch (key) {
        case "todo":
          return "bg-gray-50"
        case "in-progress":
          return "bg-green-50"
        case "review":
          return "bg-yellow-50"
        case "completed":
          return "bg-blue-50"
        default:
          return "bg-gray-50"
      }
    } else {
      return "bg-gray-50"
    }
  }

  // Quick filter buttons for Kanban view
  const renderQuickFilters = () => {
    return (
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500">Quick Filters:</span>

        {/* Project Filter Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 text-sm bg-gray-100 rounded-lg px-3 py-1.5"
            onClick={() => document.getElementById("projectFilterDropdown").classList.toggle("hidden")}
            data-dropdown="project"
          >
            <Briefcase className="w-3 h-3" />
            <span>Project</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <div
            id="projectFilterDropdown"
            className="absolute left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-md p-2 z-10 hidden w-48"
          >
            {projects.map((project) => (
              <div key={project} className="flex items-center px-2 py-1 hover:bg-gray-50 rounded-md">
                <input
                  type="checkbox"
                  id={`quick-project-${project}`}
                  checked={filterOptions.projects.includes(project)}
                  onChange={() => handleFilterChange("projects", project)}
                  className="mr-2"
                />
                <label htmlFor={`quick-project-${project}`} className="text-sm truncate">
                  {project}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Client Filter Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 text-sm bg-gray-100 rounded-lg px-3 py-1.5"
            onClick={() => document.getElementById("clientFilterDropdown").classList.toggle("hidden")}
            data-dropdown="client"
          >
            <Users className="w-3 h-3" />
            <span>Client</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <div
            id="clientFilterDropdown"
            className="absolute left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-md p-2 z-10 hidden w-48"
          >
            {clients.map((client) => (
              <div key={client} className="flex items-center px-2 py-1 hover:bg-gray-50 rounded-md">
                <input
                  type="checkbox"
                  id={`quick-client-${client}`}
                  checked={filterOptions.clients.includes(client)}
                  onChange={() => handleFilterChange("clients", client)}
                  className="mr-2"
                />
                <label htmlFor={`quick-client-${client}`} className="text-sm truncate">
                  {client}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Filter Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 text-sm bg-gray-100 rounded-lg px-3 py-1.5"
            onClick={() => document.getElementById("priorityFilterDropdown").classList.toggle("hidden")}
            data-dropdown="priority"
          >
            <ArrowUp className="w-3 h-3" />
            <span>Priority</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <div
            id="priorityFilterDropdown"
            className="absolute left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-md p-2 z-10 hidden"
          >
            {["high", "medium", "low"].map((priority) => (
              <div key={priority} className="flex items-center px-2 py-1 hover:bg-gray-50 rounded-md">
                <input
                  type="checkbox"
                  id={`quick-priority-${priority}`}
                  checked={filterOptions.priorities.includes(priority)}
                  onChange={() => handleFilterChange("priorities", priority)}
                  className="mr-2"
                />
                <label htmlFor={`quick-priority-${priority}`} className="text-sm capitalize">
                  {priority}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filterOptions.projects.length > 0 ||
          filterOptions.clients.length > 0 ||
          filterOptions.priorities.length > 0 ||
          filterOptions.categories.length > 0) && (
          <button
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            onClick={() =>
              setFilterOptions({
                projects: [],
                clients: [],
                priorities: [],
                categories: [],
              })
            }
          >
            <X className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        )}
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-64 bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setIsFilterModalOpen(true)}>
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
              </button>
              <button
                className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2"
                onClick={() => setIsAddTaskModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Task</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`text-sm font-medium pb-2 border-b-2 ${
                    activeCategory === category.id
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {/* View Toggle - Make it more prominent */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 z-10">
                <button
                  className={`p-1.5 rounded-md flex items-center gap-1 ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                  <span className="text-xs font-medium">List</span>
                </button>
                <button
                  className={`p-1.5 rounded-md flex items-center gap-1 ${viewMode === "kanban" ? "bg-white shadow-sm" : ""}`}
                  onClick={() => setViewMode("kanban")}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="text-xs font-medium">Kanban</span>
                </button>
              </div>

              {/* Group By Dropdown - Only show in Kanban mode */}
              {viewMode === "kanban" && (
                <div className="relative">
                  <button
                    className="flex items-center gap-1 text-sm bg-gray-100 rounded-lg px-3 py-1.5"
                    onClick={() => document.getElementById("groupByDropdown").classList.toggle("hidden")}
                    data-dropdown="groupBy"
                  >
                    <span>Group by: {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div
                    id="groupByDropdown"
                    className="absolute right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-md p-2 z-10 hidden"
                  >
                    <button
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md ${groupBy === "status" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                      onClick={() => {
                        setGroupBy("status")
                        document.getElementById("groupByDropdown").classList.add("hidden")
                      }}
                    >
                      Status
                    </button>
                    <button
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md ${groupBy === "project" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                      onClick={() => {
                        setGroupBy("project")
                        document.getElementById("groupByDropdown").classList.add("hidden")
                      }}
                    >
                      Project
                    </button>
                    <button
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md ${groupBy === "client" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                      onClick={() => {
                        setGroupBy("client")
                        document.getElementById("groupByDropdown").classList.add("hidden")
                      }}
                    >
                      Client
                    </button>
                  </div>
                </div>
              )}

              {/* Status Filter (List View) */}
              {viewMode === "list" && (
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      className={`px-3 py-1 rounded-md text-sm ${activeFilter === filter.id ? "bg-white shadow-sm" : ""}`}
                      onClick={() => setActiveFilter(filter.id)}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* List View */}
          {viewMode === "list" && (
            <>
              <div className="w-2/3 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckSquare className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700">No tasks found</h3>
                      <p className="text-gray-500 mt-2">Try changing your filters or create a new task</p>
                      <button
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
                        onClick={() => setIsAddTaskModalOpen(true)}
                      >
                        Create New Task
                      </button>
                    </div>
                  ) : (
                    filteredTasks.map((task) => renderTaskCard(task))
                  )}
                </div>
              </div>

              {/* Task Details Sidebar (List View Only) */}
              <div className="w-1/3 border-l border-gray-100 overflow-y-auto">
                {selectedTask ? (
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-lg font-bold">{selectedTask.title}</h2>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Description */}
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 mb-1">DESCRIPTION</h3>
                        <p className="text-sm bg-white rounded-xl p-3 border border-gray-100">
                          {selectedTask.description}
                        </p>
                      </div>

                      {/* Details */}
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 mb-1">DETAILS</h3>
                        <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">Status</div>
                            <div
                              className={`
                text-xs font-medium px-2 py-0.5 rounded
                ${
                  selectedTask.status === "todo"
                    ? "bg-gray-100 text-gray-700"
                    : selectedTask.status === "in-progress"
                      ? "bg-green-100 text-green-700"
                      : selectedTask.status === "review"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                }
              `}
                            >
                              {selectedTask.status === "todo"
                                ? "To Do"
                                : selectedTask.status === "in-progress"
                                  ? "In Progress"
                                  : selectedTask.status === "review"
                                    ? "Review"
                                    : "Completed"}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">Priority</div>
                            <div
                              className={`
                text-xs font-medium px-2 py-0.5 rounded
                ${
                  selectedTask.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : selectedTask.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : selectedTask.priority === "green"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                }
              `}
                            >
                              {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">Category</div>
                            <div
                              className={`
                text-xs font-medium px-2 py-0.5 rounded
                ${
                  selectedTask.category === "work"
                    ? "bg-blue-100 text-blue-700"
                    : selectedTask.category === "meetings"
                      ? "bg-green-100 text-green-700"
                      : selectedTask.category === "purple"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                }
              `}
                            >
                              {selectedTask.category.charAt(0).toUpperCase() + selectedTask.category.slice(1)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">Due Date</div>
                            <div className="text-xs font-medium">{formatDate(selectedTask.dueDate)}</div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">Project</div>
                            <div className="text-xs font-medium">{selectedTask.project}</div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">Client</div>
                            <div className="text-xs font-medium">{selectedTask.client}</div>
                          </div>
                        </div>
                      </div>

                      {/* Subtasks */}
                      {selectedTask.subtasks.length > 0 && (
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 mb-1">SUBTASKS</h3>
                          <div className="bg-white rounded-xl p-3 border border-gray-100">
                            <div className="space-y-1">
                              {selectedTask.subtasks.map((subtask) => (
                                <div
                                  key={subtask.id}
                                  className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg"
                                >
                                  <button
                                    className={`w-4 h-4 rounded-full border ${
                                      subtask.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                                    } flex items-center justify-center`}
                                    onClick={() => handleSubtaskToggle(selectedTask.id, subtask.id)}
                                  >
                                    {subtask.completed && <CheckCircle className="w-3 h-3" />}
                                  </button>
                                  <span className={`text-xs ${subtask.completed ? "line-through text-gray-500" : ""}`}>
                                    {subtask.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-3 border-t border-gray-100">
                        <h3 className="text-xs font-medium text-gray-500 mb-1">ACTIONS</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.status !== "completed" && (
                            <button
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1"
                              onClick={() => handleStatusChange(selectedTask.id, "completed")}
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Mark Complete</span>
                            </button>
                          )}
                          {selectedTask.status === "todo" && (
                            <button
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1"
                              onClick={() => handleStatusChange(selectedTask.id, "in-progress")}
                            >
                              <ArrowRight className="w-3 h-3" />
                              <span>Start Task</span>
                            </button>
                          )}
                          {selectedTask.status === "in-progress" && (
                            <button
                              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium flex items-center gap-1"
                              onClick={() => handleStatusChange(selectedTask.id, "review")}
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>Submit for Review</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <CheckSquare className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-700">No task selected</h3>
                    <p className="text-xs text-gray-500 mt-1">Select a task to view details</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Kanban View (Full Width) */}
          {viewMode === "kanban" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                    <span>Switch to List View</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 text-sm bg-gray-100 rounded-lg px-3 py-1.5"
                    onClick={() => setIsAddTaskModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 max-w-[90vw] overflow-x-auto flex flex-col">
                {renderQuickFilters()}
                <div className="flex gap-4 overflow-x-auto pb-4 min-w-max h-full">
                  {Object.entries(groupedTasks()).map(([key, tasks]) => {
                    const columnCount = Object.keys(groupedTasks()).length
                    // Calculate column width based on number of columns
                    const columnWidth = columnCount <= 4 ? `calc(100% / ${columnCount})` : "300px"

                    return (
                      <div
                        key={key}
                        className="flex-shrink-0"
                        style={{ width: columnWidth, minWidth: "280px", maxWidth: "350px" }}
                      >
                        <div
                          className={`rounded-xl ${getColumnColor(key)} p-3 h-full flex flex-col max-h-full`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => (groupBy === "status" ? handleDrop(e, key) : null)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium truncate">
                              {getColumnTitle(key)} ({tasks.length})
                            </h3>
                            {groupBy === "status" && key === "todo" && (
                              <button
                                className="p-1 rounded-full hover:bg-white/50 flex-shrink-0"
                                onClick={() => setIsAddTaskModalOpen(true)}
                              >
                                <Plus className="w-4 h-4 text-gray-500" />
                              </button>
                            )}
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                            {tasks.map((task) => (
                              <div key={task.id} className="cursor-grab">
                                {renderTaskCard(task)}
                              </div>
                            ))}
                            {tasks.length === 0 && (
                              <div className="flex items-center justify-center h-24 border border-dashed border-gray-300 rounded-xl bg-white/50">
                                <p className="text-sm text-gray-500">No tasks</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Task Details Modal (Kanban View Only) */}
        {viewMode === "kanban" && selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold">{selectedTask.title}</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setSelectedTask(null)}>
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">DESCRIPTION</h3>
                  <p className="text-sm bg-white rounded-xl p-3 border border-gray-100">{selectedTask.description}</p>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">DETAILS</h3>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Status</div>
                      <div
                        className={`
                text-xs font-medium px-2 py-0.5 rounded
                ${
                  selectedTask.status === "todo"
                    ? "bg-gray-100 text-gray-700"
                    : selectedTask.status === "in-progress"
                      ? "bg-green-100 text-green-700"
                      : selectedTask.status === "review"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                }
              `}
                      >
                        {selectedTask.status === "todo"
                          ? "To Do"
                          : selectedTask.status === "in-progress"
                            ? "In Progress"
                            : selectedTask.status === "review"
                              ? "Review"
                              : "Completed"}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Priority</div>
                      <div
                        className={`
                text-xs font-medium px-2 py-0.5 rounded
                ${
                  selectedTask.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : selectedTask.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : selectedTask.priority === "green"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                }
              `}
                      >
                        {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Category</div>
                      <div
                        className={`
                text-xs font-medium px-2 py-0.5 rounded
                ${
                  selectedTask.category === "work"
                    ? "bg-blue-100 text-blue-700"
                    : selectedTask.category === "meetings"
                      ? "bg-green-100 text-green-700"
                      : selectedTask.category === "purple"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                }
              `}
                      >
                        {selectedTask.category.charAt(0).toUpperCase() + selectedTask.category.slice(1)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Due Date</div>
                      <div className="text-sm font-medium">{formatDate(selectedTask.dueDate)}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Project</div>
                      <div className="text-sm font-medium">{selectedTask.project}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Client</div>
                      <div className="text-sm font-medium">{selectedTask.client}</div>
                    </div>
                  </div>
                </div>

                {/* Subtasks */}
                {selectedTask.subtasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">SUBTASKS</h3>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="space-y-2">
                        {selectedTask.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                            <button
                              className={`w-5 h-5 rounded-full border ${
                                subtask.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                              } flex items-center justify-center`}
                              onClick={() => handleSubtaskToggle(selectedTask.id, subtask.id)}
                            >
                              {subtask.completed && <CheckCircle className="w-4 h-4" />}
                            </button>
                            <span className={`text-sm ${subtask.completed ? "line-through text-gray-500" : ""}`}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">ACTIONS</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.status !== "completed" && (
                      <button
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1"
                        onClick={() => handleStatusChange(selectedTask.id, "completed")}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </button>
                    )}
                    {selectedTask.status === "todo" && (
                      <button
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1"
                        onClick={() => handleStatusChange(selectedTask.id, "in-progress")}
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Start Task</span>
                      </button>
                    )}
                    {selectedTask.status === "in-progress" && (
                      <button
                        className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium flex items-center gap-1"
                        onClick={() => handleStatusChange(selectedTask.id, "review")}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Submit for Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add a floating "Add Task" button that's visible in both views */}
      <div className="fixed bottom-6 right-6">
        <button
          className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          onClick={() => setIsAddTaskModalOpen(true)}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Task</h2>
              <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setIsAddTaskModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                    <select
                      value={newTask.project}
                      onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="" disabled>
                        Select project
                      </option>
                      {projects.map((project) => (
                        <option key={project} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <select
                      value={newTask.client}
                      onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="" disabled>
                        Select client
                      </option>
                      {clients.map((client) => (
                        <option key={client} value={client}>
                          {client}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="meetings">Meetings</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
                  onClick={() => setIsAddTaskModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filter Tasks</h2>
              <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setIsFilterModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Projects Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Projects</h3>
                <div className="grid grid-cols-2 gap-2">
                  {projects.map((project) => (
                    <div key={project} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`project-${project}`}
                        checked={filterOptions.projects.includes(project)}
                        onChange={() => handleFilterChange("projects", project)}
                        className="mr-2"
                      />
                      <label htmlFor={`project-${project}`} className="text-sm">
                        {project}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clients Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Clients</h3>
                <div className="grid grid-cols-2 gap-2">
                  {clients.map((client) => (
                    <div key={client} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`client-${client}`}
                        checked={filterOptions.clients.includes(client)}
                        onChange={() => handleFilterChange("clients", client)}
                        className="mr-2"
                      />
                      <label htmlFor={`client-${client}`} className="text-sm">
                        {client}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
                <div className="flex gap-4">
                  {["high", "medium", "low"].map((priority) => (
                    <div key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`priority-${priority}`}
                        checked={filterOptions.priorities.includes(priority)}
                        onChange={() => handleFilterChange("priorities", priority)}
                        className="mr-2"
                      />
                      <label htmlFor={`priority-${priority}`} className="text-sm capitalize">
                        {priority}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                <div className="flex gap-4">
                  {["work", "meetings", "personal"].map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={filterOptions.categories.includes(category)}
                        onChange={() => handleFilterChange("categories", category)}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category}`} className="text-sm capitalize">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
                onClick={() => {
                  setFilterOptions({
                    projects: [],
                    clients: [],
                    priorities: [],
                    categories: [],
                  })
                }}
              >
                Clear Filters
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Logo() {
  return (
    <Link href="/">
      <div className="flex flex-col cursor-pointer">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-black rounded-sm"></div>
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-5 h-5 bg-black rounded-sm"></div>
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
      </div>
    </Link>
  )
}

function ArrowRight({ className }) {
  return <ChevronRight className={className} />
}
