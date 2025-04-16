"use client"

import { useState, useEffect } from "react"
import {
  ChevronRight,
  Calendar,
  CheckSquare,
  Circle,
  Send,
  Info,
  Plus,
  Users,
  Clock,
  CheckCircle,
  ChevronDown,
  Briefcase,
  X,
  User,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Sidebar from "./components/sidebar"
import { createClient } from "./app/actions/client-actions"
import { createProject } from "./app/actions/project-actions"
import { createTask } from "./app/actions/task-actions"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "./components/ui/logo"

export default function ProviderDashboard({ initialProjects = [], initialClients = [], initialTasks = [], userId }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [clients, setClients] = useState(initialClients)
  const [isAddingClient, setIsAddingClient] = useState(false)
  const [providerStatus, setProviderStatus] = useState("online") // online, busy, offline

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)
  const [projects, setProjects] = useState(initialProjects)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    client_id: "",
    status: "In Progress",
  })

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project_id: "",
    due_date: new Date().toISOString().split("T")[0],
    status: "todo",
  })
  const [tasks, setTasks] = useState(initialTasks)

  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  })

  const [activePills, setActivePills] = useState({
    projects: true,
    tasks: true,
    pending: true,
    clients: true,
  })

  // Update state when props change
  useEffect(() => {
    setProjects(initialProjects)
    setClients(initialClients)
    setTasks(initialTasks)
  }, [initialProjects, initialClients, initialTasks])

  const handleAddClient = async (e) => {
    e.preventDefault()
    if (newClient.name.trim() === "") return

    setIsAddingClient(true)

    try {
      const result = await createClient({
        ...newClient,
        provider_id: userId,
      })

      if (result.success) {
        // Refresh clients from the server or add optimistically
        setClients([
          ...clients,
          {
            id: "temp-" + Date.now(), // This will be replaced when we refresh
            name: newClient.name,
            email: newClient.email,
            phone: newClient.phone,
            description: newClient.description,
            provider_id: userId,
            projects: 0,
            isActive: false,
          },
        ])

        // Set up the project modal with the new client
        setNewProject({
          ...newProject,
          client_id: result.data?.id || "",
        })

        // Close client modal and open project modal
        setIsAddClientModalOpen(false)
        setIsAddProjectModalOpen(true)
      } else {
        alert("Failed to create client: " + result.error)
      }
    } catch (error) {
      console.error("Error creating client:", error)
      alert("An error occurred while creating the client")
    } finally {
      setIsAddingClient(false)
    }
  }

  const handleAddProject = async (e) => {
    e.preventDefault()
    if (newProject.name.trim() === "") return

    try {
      // Set client_id to null if "personal" is selected
      const projectData = {
        ...newProject,
        client_id: newProject.client_id === "personal" ? null : newProject.client_id,
        provider_id: userId,
      }

      const result = await createProject(projectData)

      if (result.success) {
        // Update the client name display logic
        const clientName = projectData.client_id
          ? clients.find((c) => c.id === projectData.client_id)?.name || "Unknown"
          : "Personal"

        // When creating the new project object
        const newProjectObj = {
          id: result.data?.id,
          name: newProject.name,
          description: newProject.description,
          client_id: projectData.client_id, // This can now be null
          status: newProject.status,
          provider_id: userId,
          color: "bg-blue-100",
          client: clientName, // Use the client name we determined above
        }

        setProjects([...projects, newProjectObj])

        // Set up the task modal with the new project
        setNewTask({
          ...newTask,
          project_id: result.data?.id, // Use the actual ID from the database
        })

        // Close project modal and open task modal
        setIsAddProjectModalOpen(false)
        setIsAddTaskModalOpen(true)
      } else {
        alert("Failed to create project: " + result.error)
      }
    } catch (error) {
      console.error("Error creating project:", error)
      alert("An error occurred while creating the project")
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (newTask.title.trim() === "" || !newTask.project_id) return

    try {
      const result = await createTask({
        ...newTask,
        provider_id: userId,
      })

      if (result.success) {
        // Refresh tasks from the server or add optimistically
        const project = projects.find((p) => p.id === newTask.project_id)
        const newTaskObj = {
          id: result.data?.id || "temp-" + Date.now(), // Use the actual ID if available
          title: newTask.title,
          description: newTask.description,
          project_id: newTask.project_id,
          due_date: newTask.due_date,
          status: newTask.status,
          provider_id: userId,
          completed: false,
          project: project?.name || "Unknown",
          client: project?.client || "Unknown",
        }

        setTasks([...tasks, newTaskObj])

        // Reset form and close modal
        setNewTask({
          title: "",
          description: "",
          project_id: "",
          due_date: new Date().toISOString().split("T")[0],
          status: "todo",
        })
        setIsAddTaskModalOpen(false)
      } else {
        alert("Failed to create task: " + result.error)
      }
    } catch (error) {
      console.error("Error creating task:", error)
      alert("An error occurred while creating the task")
    }
  }

  const handleTaskClick = (taskId, e) => {
    // Prevent navigation if clicking on the checkbox
    if (e.target.closest(".task-checkbox") || e.target.tagName === "svg" || e.target.tagName === "path") {
      return
    }

    console.log("User object when task clicked:", user)

    router.push(`/tasks/${taskId}`)
  }

  // Add a function to calculate task progress based on subtasks
  const calculateTaskProgress = (taskId) => {
    // Find the task's subtasks in the database
    // For now, we'll return a placeholder value
    return Math.floor(Math.random() * 100)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 md:p-6 flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 pb-16 md:pb-6">
          {/* Main View */}
          <div className="col-span-12 md:col-span-8 flex flex-col gap-4 md:gap-6">
            {/* Status Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-2 sm:mb-0">
              <div className="relative">
                <button
                  onClick={() => {
                    const dropdown = document.getElementById("status-dropdown")
                    dropdown.classList.toggle("hidden")
                  }}
                  className="bg-white rounded-full border border-gray-200 px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Circle
                    className={`w-3 h-3 fill-current ${
                      providerStatus === "online"
                        ? "text-green-500"
                        : providerStatus === "busy"
                          ? "text-amber-500"
                          : "text-gray-400"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-900 capitalize">{providerStatus}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <div
                  id="status-dropdown"
                  className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 w-36 hidden"
                >
                  <div
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setProviderStatus("online")
                      document.getElementById("status-dropdown").classList.add("hidden")
                    }}
                  >
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">Online</span>
                  </div>
                  <div
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setProviderStatus("busy")
                      document.getElementById("status-dropdown").classList.add("hidden")
                    }}
                  >
                    <Circle className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-medium text-gray-900">Busy</span>
                  </div>
                  <div
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setProviderStatus("offline")
                      document.getElementById("status-dropdown").classList.add("hidden")
                    }}
                  >
                    <Circle className="w-3 h-3 fill-gray-400 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">Offline</span>
                  </div>
                </div>
              </div>

            <div className="ml-0 sm:ml-auto flex flex-wrap items-center gap-2 md:gap-3 mt-2 sm:mt-0">
        <StatusPill
          icon={
            <Briefcase
              className={`w-4 h-4 ${activePills.projects ? "text-gray-900" : "text-gray-400"}`}
            />
          }
          text={`${projects.length} Projects`}
          isActive={activePills.projects}
          onClick={() =>
            setActivePills({ ...activePills, projects: !activePills.projects })
          }
        />
        <StatusPill
          icon={
            <CheckCircle
              className={`w-4 h-4 ${activePills.tasks ? "text-gray-900" : "text-gray-400"}`}
            />
          }
          text={`${tasks.length} Tasks`}
          isActive={activePills.tasks}
          onClick={() =>
            setActivePills({ ...activePills, tasks: !activePills.tasks })
          }
        />
        <StatusPill
          icon={
            <Clock
              className={`w-4 h-4 ${activePills.pending ? "text-gray-900" : "text-gray-400"}`}
            />
          }
          text={`${tasks.filter((t) => !t.completed && new Date(t.due_date) < new Date()).length} Pending`}
          isActive={activePills.pending}
          onClick={() =>
            setActivePills({ ...activePills, pending: !activePills.pending })
          }
        />
        <StatusPill
          icon={
            <Users
              className={`w-4 h-4 ${activePills.clients ? "text-gray-900" : "text-gray-400"}`}
            />
          }
          text={`${clients.length} Clients`}
          isActive={activePills.clients}
          onClick={() =>
            setActivePills({ ...activePills, clients: !activePills.clients })
          }
        />
      </div>

            </div>

            {/* Projects Overview */}
            {activePills.projects && (
              <div className="flex-1 rounded-3xl overflow-hidden relative bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Projects Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <h3 className="text-gray-500 text-sm mb-1">Active Projects</h3>
                    <p className="text-3xl font-bold text-gray-900">{projects.filter((p) => p.status !== "Completed").length}</p>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-700 ease-in-out"
                        style={{
                          width: `${projects.length ? (projects.filter((p) => p.status !== "Completed").length / projects.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <h3 className="text-gray-500 text-sm mb-1">Completed Projects</h3>
                    <p className="text-3xl font-bold text-gray-900">{projects.filter((p) => p.status === "Completed").length}</p>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-in-out"
                        style={{
                          width: `${projects.length ? (projects.filter((p) => p.status === "Completed").length / projects.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Recent Projects</h3>
                    <button
                      className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
                      onClick={() => setIsAddProjectModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {projects.slice(0, 4).map((project) => (
                      <Link href={`/projects/${project.id}`} key={project.id}>
                        <div className="p-4 flex items-center hover:bg-white transition-colors cursor-pointer">
                          <div
                            className={`w-10 h-10 rounded-lg ${project.color || "bg-blue-100"} flex items-center justify-center mr-3 shadow-sm`}
                          >
                            {project.client_id ? (
                              <Briefcase className="w-5 h-5 text-blue-600" />
                            ) : (
                              <User className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                            {project.client_id ? (
                              <p className="text-sm text-gray-500">Client: {project.client}</p>
                            ) : (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                Personal
                              </span>
                            )}
                          </div>
                          <div
                            className={`
                              text-xs font-medium px-2.5 py-0.5 rounded
                              ${
                                project.status === "In Progress"
                                  ? "bg-green-100 text-green-700"
                                  : project.status === "Review"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                              }
                            `}
                          >
                            {project.status}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                        </div>
                      </Link>
                    ))}

                    {projects.length > 0 && (
                      <div className="p-4 flex justify-center">
                        <Link href="/projects">
                          <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 transition-colors">
                            <span>See all projects</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    )}

                    {projects.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <Briefcase className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No projects yet</h3>
                        <p className="text-gray-500 mb-4">Create your first project to get started</p>
                        <button
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                          onClick={() => setIsAddClientModalOpen(true)}
                        >
                          Create Project
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Task and Appointment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {/* Tasks Card */}
              {activePills.tasks && (
                <div className="bg-white rounded-3xl p-6 relative shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-gray-900">Tasks</h3>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">Today's priorities</p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                      onClick={() => setIsAddTaskModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3 my-4 max-h-[300px] overflow-y-auto">
                    {tasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-50 rounded-lg p-3 flex items-start hover:bg-gray-100 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                        onClick={(e) => handleTaskClick(task.id, e)}
                      >
                        <div className="p-1 mr-2 task-checkbox">
                          <CheckSquare className={`w-5 h-5 ${task.completed ? "text-green-500" : "text-gray-300"}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                            {task.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {task.project} - Due {new Date(task.due_date).toLocaleDateString()}
                          </p>
                          {/* Add mini progress bar for task */}
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-in-out"
                              style={{
                                width: `${task.completed ? 100 : calculateTaskProgress(task.id)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}

                    {tasks.length === 0 && (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                          <CheckSquare className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No tasks yet</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-6 px-4">
                    <StatusCard
                      icon={<CheckCircle className="w-4 h-4 text-blue-500" />}
                      title={`${tasks.length} Total`}
                      subtitle="Tasks"
                    />
                    <StatusCard
                      icon={<CheckSquare className="w-4 h-4 text-green-500" />}
                      title={`${tasks.filter((t) => t.completed).length} Done`}
                      subtitle="Today"
                    />
                    <StatusCard
                      icon={<Clock className="w-4 h-4 text-amber-500" />}
                      title={`${tasks.filter((t) => !t.completed && new Date(t.due_date) < new Date()).length} Pending`}
                      subtitle="Reviews"
                    />
                  </div>
                </div>
              )}

              {/* Appointments Card */}
              {activePills.pending && (
                <div className="bg-white rounded-3xl p-6 relative shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-gray-900">Appointments</h3>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                      <Info className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Client Meeting</h4>
                          <p className="text-xs text-gray-500">TechStart - Mobile App</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">2:00 PM</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors shadow-sm hover:shadow-md">
                        Join Call
                      </button>
                      <button className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md">
                        Reschedule
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 shadow-sm">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Project Review</h4>
                          <p className="text-xs text-gray-500">Acme Inc. - Website</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">Tomorrow</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md">
                        View Details
                      </button>
                      <button className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md">
                        Prepare Notes
                      </button>
                    </div>
                  </div>

                  <button
                    className="w-full mt-4 bg-gray-900 text-white rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    <span className="text-white">Schedule New Appointment</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-3xl p-4 md:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Clients</h2>
              <Info className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {clients.map((client) => (
                <RoomCard
                  key={client.id}
                  icon={<Users className="w-5 h-5" />}
                  name={client.name}
                  devices={client.projects || 0}
                  isActive={client.isActive}
                />
              ))}

              {clients.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No clients yet</h3>
                  <p className="text-gray-500 mb-4">Add your first client to get started</p>
                </div>
              )}
            </div>

            <button
              className="w-full mt-6 bg-gray-900 text-white rounded-full py-3 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-800"
              onClick={() => {
                setIsAddingClient(true)
                // Simulate checking for existing clients or other pre-validation
                setTimeout(() => {
                  setIsAddingClient(false)
                  setIsAddClientModalOpen(true)
                }, 500)
              }}
              disabled={isAddingClient}
            >
              {isAddingClient ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium text-white">PROCESSING...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-white" />
                  <span className="font-medium text-white">ADD CLIENT</span>
                </>
              )}
            </button>

            {/* Messages Card */}
            <div className="mt-8 bg-gray-50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-500">{clients.length > 0 ? clients[0].name : "No clients"}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                  <Circle className="w-3 h-3 fill-white text-white" />
                </div>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                <div className="bg-white rounded-lg p-3 ml-6 shadow-sm">
                  <p className="text-sm text-gray-900">Can we get an update on the website redesign progress?</p>
                  <p className="text-xs text-gray-500 mt-1">John (Client) - 10:34 AM</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 mr-6 shadow-sm">
                  <p className="text-sm text-gray-900">Yes, we're finalizing the mockups today. I'll send them over for review.</p>
                  <p className="text-xs text-gray-500 mt-1">You - 11:15 AM</p>
                </div>

                <div className="bg-white rounded-lg p-3 ml-6 shadow-sm">
                  <p className="text-sm text-gray-900">Great! Looking forward to seeing them.</p>
                  <p className="text-xs text-gray-500 mt-1">John (Client) - 11:20 AM</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                />
                <button className="p-2 bg-blue-500 text-gray-900 rounded-full shadow-sm hover:shadow-md hover:bg-blue-600 transition-all duration-200">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-4 sm:p-6 w-[calc(100%-2rem)] max-w-md shadow-xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Client</h2>
                <p className="text-sm text-gray-500 mt-1">Create a new client to start working with</p>
              </div>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={() => setIsAddClientModalOpen(false)}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddClient}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    placeholder="Enter client email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    placeholder="Enter client phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newClient.description}
                    onChange={(e) => setNewClient({ ...newClient, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    placeholder="Enter client description"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
                  onClick={() => setIsAddClientModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-gray-900 text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-4 sm:p-6 w-[calc(100%-2rem)] max-w-md shadow-xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Project</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={() => setIsAddProjectModalOpen(false)}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddProject}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <select
                    value={newProject.client_id}
                    onChange={(e) => setNewProject({ ...newProject, client_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    required
                  >
                    <option value="" disabled>
                      Select a client
                    </option>
                    <option value="personal">Personal (No Client)</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
                  onClick={() => setIsAddProjectModalOpen(false)}
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-gray-900 text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-4 sm:p-6 w-[calc(100%-2rem)] max-w-md shadow-xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Task to Project</h2>
                <p className="text-sm text-gray-500 mt-1">Create at least one task for your new project</p>
              </div>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={() => setIsAddTaskModalOpen(false)}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddTask}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    value={newTask.project_id}
                    onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    required
                  >
                    <option value="" disabled>
                      Select project
                    </option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
                  onClick={() => setIsAddTaskModalOpen(false)}
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-gray-900 text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                >
                  Add Task
                </button>
              </div>
            </form>
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
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
      </div>
    </Link>
  )
}

function StatusPill({ icon, text, onClick, isActive = true }) {
  const color = isActive ? "text-gray-900" : "text-gray-400"

  return (
    <div
      className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 cursor-pointer transition-colors shadow-sm hover:shadow-md ${
        isActive ? "bg-gray-100 hover:bg-gray-200 border border-gray-200" : "bg-gray-50 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <div className={`flex items-center gap-1 sm:gap-2 ${color}`}>
        {icon}
        <span className="text-xs sm:text-sm font-medium">{text}</span>
      </div>
    </div>
  )
}


function StatusCard({ icon, title, subtitle }) {
  return (
    <div className="group relative">
      {/* Compact view (default) */}
      <div className="bg-white rounded-full p-3 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50">
        {icon}
      </div>
      {/* Expanded view (on hover) */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-white rounded-lg p-2 shadow-lg">
          <div className="text-xs font-medium text-gray-900">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
    </div>
  )
}

function RoomCard({ icon, name, devices, isActive }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500">{devices} projects</p>
        </div>
      </div>
      <div
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-300"
        }`}
      ></div>
    </div>
  )
}
