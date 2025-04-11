"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Briefcase,
  Users,
  Calendar,
  CheckSquare,
  ArrowLeft,
  Plus,
  Edit,
  MoreHorizontal,
  FileText,
  CheckCircle,
  X,
  Trash,
  Clock,
  Phone,
  MapPin,
  Mail,
  User,
  UserPlus,
  UserCheck,
  ChevronRight,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { getProject, updateProject, deleteProject } from "@/app/actions/project-actions"
import { getTasks, createTask } from "@/app/actions/task-actions"
import { getClient, getClients } from "@/app/actions/client-actions"
import {
  getProjectTeamMembers,
  getAvailableTeamMembersForProject,
  addTeamMemberToProject,
  removeTeamMemberFromProject,
  createTeamMember,
} from "@/app/actions/team-member-actions"
import { getSubtasks, toggleSubtaskCompletion } from "@/app/actions/subtask-actions"
// Add the import for the CompletionAnimation component
import { CompletionAnimation } from "@/components/completion-animation"
// Add these imports at the top of the file
import ProjectCollaborators from "@/components/project-collaborators"
import CollaborationInvites from "@/components/collaboration-invites"
// Add the import for the ProjectTimeline component at the top of the file
import ProjectTimeline from "@/components/project-timeline"
import { checkProjectAccess } from "@/app/actions/access-actions"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Add these interfaces at the top of the file
interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  due_date?: string;
  client_id?: string;
  start_date?: string;
  color?: string;
  // Add other project properties as needed
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  is_primary: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  project_id: string;
  completed: boolean;
  updated_at?: string;
  // Add other task properties as needed
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const projectId = params.id

  const [project, setProject] = useState<Project | null>(null)
  const [client, setClient] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: new Date().toISOString().split("T")[0],
    status: "todo",
    priority: "medium",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedProject, setEditedProject] = useState<Project | null>(null)
  const [viewType, setViewType] = useState("card") // "card" or "list"
  const [expandedTasks, setExpandedTasks] = useState({})
  const [isAddingTask, setIsAddingTask] = useState(false)

  const [subtasks, setSubtasks] = useState({})
  const [loadingSubtasks, setLoadingSubtasks] = useState({})
  const [clients, setClients] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  // Add the import for the CompletionAnimation component
  // Add state to track when to show the animation
  // Add this to the existing state declarations at the top of the component
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false)

  // State for project start date
  const [startDate, setStartDate] = useState<string | null>(null)

  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [availableTeamMembers, setAvailableTeamMembers] = useState<TeamMember[]>([])
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false)
  const [showCreateTeamMemberModal, setShowCreateTeamMemberModal] = useState(false)
  const [selectedTeamMember, setSelectedTeamMember] = useState("")
  const [isAddingTeamMember, setIsAddingTeamMember] = useState(false)
  const [newTeamMember, setNewTeamMember] = useState<TeamMember>({
    name: "",
    email: "",
    role: "",
    phone: "",
    is_primary: false,
  })
  // Add a new state for project access in the component
  const [projectAccess, setProjectAccess] = useState({
    isOwner: false,
    isCollaborator: false,
    permissions: null,
    isLoading: true,
  })

  const fetchSubtasks = useCallback(async (taskId) => {
    setLoadingSubtasks((prevState) => ({ ...prevState, [taskId]: true }))
    try {
      const result = await getSubtasks(taskId)
      if (result.success) {
        setSubtasks((prevState) => ({ ...prevState, [taskId]: result.data || [] }))
      } else {
        console.error("Error fetching subtasks:", result.error)
      }
    } catch (error) {
      console.error("Error fetching subtasks:", error)
    } finally {
      setLoadingSubtasks((prevState) => ({ ...prevState, [taskId]: false }))
    }
  }, [])

  // Fetch team members for the project
  const fetchTeamMembers = useCallback(async () => {
    if (!projectId || !user) return

    try {
      const result = await getProjectTeamMembers(projectId as string)
      if (result.success) {
        setTeamMembers(result.data || [])
      } else {
        console.error("Error fetching team members:", result.error)
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
    }
  }, [projectId, user])

  // Fetch available team members for the project
  const fetchAvailableTeamMembers = useCallback(async () => {
    if (!projectId || !project?.client_id || !user) return

    try {
      const result = await getAvailableTeamMembersForProject(projectId as string, project.client_id)
      if (result.success) {
        setAvailableTeamMembers(result.data || [])
      } else {
        console.error("Error fetching available team members:", result.error)
      }
    } catch (error) {
      console.error("Error fetching available team members:", error)
    }
  }, [projectId, project?.client_id, user])

  // Add this useEffect to check project access
  useEffect(() => {
    const checkAccess = async () => {
      if (user && projectId) {
        try {
          const result = await checkProjectAccess(projectId, user.id)
          if (result.success) {
            setProjectAccess({
              isOwner: result.isOwner,
              isCollaborator: result.isCollaborator,
              permissions: result.permissions,
              isLoading: false,
            })
          } else {
            setError(result.error || "Failed to check project access")
            setProjectAccess({
              isOwner: false,
              isCollaborator: false,
              permissions: null,
              isLoading: false,
            })
          }
        } catch (err) {
          console.error("Error checking project access:", err)
          setError("Failed to check project access")
          setProjectAccess({
            isOwner: false,
            isCollaborator: false,
            permissions: null,
            isLoading: false,
          })
        }
      }
    }

    if (user) {
      checkAccess()
    }
  }, [user, projectId])

  useEffect(() => {
    const fetchData = async () => {
      if (user && projectId) {
        setLoading(true)
        setError(null)

        try {
          // Fetch project details
          const projectResult = await getProject(projectId)
          console.log('Project Result:', projectResult)

          if (projectResult && projectResult.data) {
            console.log('Fetched Project Details:', projectResult.data)
            setProject(projectResult.data)
            setEditedProject(projectResult.data)

            // Fetch tasks
            const tasksResult = await getTasks(projectId)
            if (tasksResult && tasksResult.data) {
              setTasks(tasksResult.data)
            }

            // Fetch client
            if (projectResult.data?.client_id) {
              const clientResult = await getClient(projectResult.data.client_id)
              if (clientResult && clientResult.data) {
                setClient(clientResult.data)
              }
            }
            setError(null)
          } else {
            setError('Project not found')
          }
        } catch (error) {
          console.error('Error fetching project:', error)
          setError('Failed to fetch project details')
        } finally {
          setLoading(false)
        }
      }
    }

    if (user && projectId) {
      fetchData()
    }
  }, [user, projectId])

  // Fetch clients when user is available
  useEffect(() => {
    const fetchClients = async () => {
      if (user && user.providerId) {
        try {
          const result = await getClients(user.providerId)
          if (result.success) {
            setClients(result.data)
          } else {
            console.error("Error fetching clients:", result.error)
          }
        } catch (err) {
          console.error("Exception fetching clients:", err)
        }
      }
    }

    if (user) {
      fetchClients()
    }
  }, [user])

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTask.title.trim() || !user || !project) return

    setIsAddingTask(true)
    try {
      const result = await createTask({
        title: newTask.title,
        description: newTask.description,
        due_date: newTask.due_date,
        status: newTask.status,
        priority: newTask.priority,
        project_id: project.id,
        provider_id: user.providerId, // Ensure provider_id is included
      })

      if (result.success) {
        // Add the new task to the tasks array
        setTasks(prevTasks => [...prevTasks, result.data])
        setNewTask({
          title: "",
          description: "",
          due_date: new Date().toISOString().split("T")[0],
          status: "todo",
          priority: "medium",
        })
        setShowAddTaskModal(false)
      } else {
        setError(result.error || "Failed to add task")
      }
    } catch (error) {
      console.error("Error adding task:", error)
      setError("Failed to add task")
    } finally {
      setIsAddingTask(false)
    }
  }

  const handleUpdateProject = async () => {
    if (!editedProject || !project) return

    setIsUpdating(true)
    try {
      // Prepare the update data
      const updateData = {
        name: editedProject.name,
        description: editedProject.description,
        status: editedProject.status,
        due_date: editedProject.due_date || undefined,
        start_date: editedProject.start_date || undefined,
        // Handle client_id - use undefined for personal projects, otherwise use the selected client_id
        client_id: editedProject.client_id === "personal" ? undefined : editedProject.client_id,
      }

      console.log("Updating project with data:", updateData)

      const result = await updateProject(project.id, updateData)

      if (result.success) {
        // Update the project in state
        const updatedProject: Project = {
          ...project,
          ...updateData,
          id: project.id,
        }
        setProject(updatedProject)

        // If client changed, update client info
        if (updatedProject.client_id !== project.client_id) {
          if (updatedProject.client_id) {
            // Fetch the new client details
            const clientResult = await getClient(updatedProject.client_id)
            if (clientResult.success) {
              setClient(clientResult.data)
            }

            // Refresh team members for the new client
            fetchAvailableTeamMembers()
          } else {
            // Clear client if project is now personal
            setClient(null)
            setTeamMembers([])
            setAvailableTeamMembers([])
          }
        }

        setIsEditing(false)
      } else {
        setError(result.error || "Failed to update project")
      }
    } catch (error) {
      console.error("Error updating project:", error)
      setError("Failed to update project")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!project) return

    try {
      const result = await deleteProject(project.id)
      if (result.success) {
        router.push('/projects')
      } else {
        setError(result.error || "Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      setError("Failed to delete project")
    }
  }

  const handleAssignToClient = async () => {
    if (!project) return

    try {
      const result = await updateProject(project.id, { client_id: "1" })
      if (result.success) {
        // Fetch the new client details
        const clientResult = await getClient("1")
        if (clientResult.success) {
          setClient(clientResult.data)
        }
        // Refresh team members for the new client
        fetchAvailableTeamMembers()
      } else {
        setError(result.error || "Failed to assign client")
      }
    } catch (error) {
      console.error("Error assigning client:", error)
      setError("Failed to assign client")
    }
  }

  // Handle adding a team member to the project
  const handleAddTeamMember = async () => {
    if (!selectedTeamMember || !user || !project) return

    setIsAddingTeamMember(true)
    try {
      const result = await addTeamMemberToProject({
        project_id: project.id,
        team_member_id: selectedTeamMember,
        added_by: user.id,
      })

      if (result.success) {
        // Refresh team members
        fetchTeamMembers()
        fetchAvailableTeamMembers()
        setSelectedTeamMember("")
        setShowAddTeamMemberModal(false)
      } else {
        setError(result.error || "Failed to add team member")
      }
    } catch (error) {
      console.error("Error adding team member:", error)
      setError("Failed to add team member")
    } finally {
      setIsAddingTeamMember(false)
    }
  }

  // Handle removing a team member from the project
  const handleRemoveTeamMember = async (teamMemberId) => {
    if (!teamMemberId || !project) return

    if (confirm("Are you sure you want to remove this team member from the project?")) {
      try {
        const result = await removeTeamMemberFromProject(teamMemberId, project.id)

        if (result.success) {
          // Refresh team members
          fetchTeamMembers()
          fetchAvailableTeamMembers()
        } else {
          setError(result.error || "Failed to remove team member")
        }
      } catch (error) {
        console.error("Error removing team member:", error)
        setError("Failed to remove team member")
      }
    }
  }

  // Handle creating a new team member
  const handleCreateTeamMember = async (e) => {
    e.preventDefault()

    if (!newTeamMember.name.trim() || !newTeamMember.email.trim() || !user || !project?.client_id) return

    setIsAddingTeamMember(true)
    try {
      // First create the team member
      const createResult = await createTeamMember({
        client_id: project.client_id,
        user_id: user.id,
        email: newTeamMember.email,
        name: newTeamMember.name,
        role: newTeamMember.role,
        phone: newTeamMember.phone,
        is_primary: newTeamMember.is_primary,
      })

      if (createResult.success) {
        // Then add them to the project
        const addResult = await addTeamMemberToProject({
          project_id: project.id,
          team_member_id: createResult.data.id,
          added_by: user.id,
        })

        if (addResult.success) {
          // Refresh team members
          fetchTeamMembers()

          // Reset form and close modal
          setNewTeamMember({
            name: "",
            email: "",
            role: "",
            phone: "",
            is_primary: false,
          })
          setShowCreateTeamMemberModal(false)
        } else {
          setError(addResult.error || "Failed to add team member to project")
        }
      } else {
        setError(createResult.error || "Failed to create team member")
      }
    } catch (error) {
      console.error("Error creating team member:", error)
      setError("Failed to create team member")
    } finally {
      setIsAddingTeamMember(false)
    }
  }

  // Update the useEffect that checks for project completion
  // Find the useEffect that checks if all tasks are completed and update it:

  useEffect(() => {
    // Check if all tasks are completed and update project status if needed
    if (tasks.length > 0 && project && project.status !== "Completed") {
      const allTasksCompleted = tasks.every((task) => task.status === "completed")
      if (allTasksCompleted) {
        // Update the project status in the UI immediately for better UX
        setProject({
          ...project,
          status: "Completed",
        })

        // Show the completion animation
        setShowCompletionAnimation(true)

        // Update in the database
        updateProject(project.id, { status: "Completed" })
      }
    }
  }, [tasks, project])

  // Update the handleToggleSubtask function to show a task completion animation
  // Find the handleToggleSubtask function and update it:

  const handleToggleSubtask = async (subtaskId, completed, task) => {
    if (!task) return

    try {
      const result = await toggleSubtaskCompletion(subtaskId, !completed)

      if (result.success) {
        // If marking as completed, show the animation
        if (!completed) {
          setShowCompletionAnimation(true)
        }

        setSubtasks((prevSubtasks) => {
          return Object.entries(prevSubtasks).reduce((acc, [taskId, subtaskList]) => {
            if (taskId === task.id) {
              acc[taskId] = subtaskList.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, completed: !completed } : subtask,
              )
            } else {
              acc[taskId] = subtaskList
            }
            return acc
          }, {})
        })
      } else {
        setError(result.error || "Failed to update subtask")
      }
    } catch (error) {
      console.error("Error toggling subtask:", error)
      setError("Failed to update subtask")
    }
  }

  // Update the loading check to include projectAccess.isLoading
  if (authLoading || loading || projectAccess.isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading project details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Project not found</h3>
              <p className="text-gray-500 mt-2">{error}</p>
              <Link href="/projects">
                <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                  Back to Projects
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Add the CollaborationInvites component at the top of the page content */}
          <CollaborationInvites />
          {/* Header */}
          <div className="mb-6">
            <Link href="/projects" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Projects</span>
            </Link>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
             
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-xl ${project?.color || "bg-blue-100"} flex items-center justify-center`}
                    >
                      {project?.client_id ? (
                        <Briefcase className="w-8 h-8 text-blue-600" />
                      ) : (
                        <User className="w-8 h-8 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-600">
                          {project?.client_id ? (
                            <>Client: {project.client?.name || "Unknown"}</>
                          ) : (
                            <span className="inline-flex items-center bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-sm">
                              <User className="w-3 h-3 mr-1" />
                              Personal Project
                            </span>
                          )}
                        </span>
                        <span className="text-gray-300">•</span>
                        <div
                          className={`
                            text-xs font-medium px-2 py-0.5 rounded-full
                            ${
                              project?.status === "In Progress"
                                ? "bg-green-100 text-green-700"
                                : project?.status === "Review"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                            }
                          `}
                        >
                          {project?.status}
                        </div>
                      </div>
                    </div>
                  </div>
                

                <div className="flex items-center gap-2">
                
                      {(projectAccess.isOwner || (projectAccess.isCollaborator && projectAccess.permissions?.edit)) && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setIsEditing(true)
                          setEditedProject(project)
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Project</span>
                      </button>
                      <button
                        onClick={() => setShowAddTaskModal(true)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Task</span>
                      </button>
                      {projectAccess.isOwner && (
                        <div className="relative">
                          <button
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={() => {
                              const dropdown = document.getElementById("project-actions-dropdown")
                              dropdown?.classList.toggle("hidden")
                            }}
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                          </button>
                          <div
                            id="project-actions-dropdown"
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 hidden"
                          >
                            <button
                              onClick={handleDeleteProject}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Trash className="w-4 h-4" />
                              <span>Delete Project</span>
                            </button>
                          </div>
                        </div>
                      )}
                  
                
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {tasks.length > 0
                      ? Math.round((tasks.filter((t) => t?.status === "completed").length / tasks.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-in-out"
                    style={{
                      width: `${
                        tasks.length > 0
                          ? (tasks.filter((t) => t?.status === "completed").length / tasks.length) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">START DATE</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-400">
  {project?.start_date ? new Date(project.start_date).toLocaleDateString() : "Not set"}
</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">DUE DATE</p>
                
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-400">
                        {project?.due_date ? new Date(project.due_date).toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                 
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">CLIENT</p>
                  <div className="flex items-center gap-2">
                    {project?.client_id ? (
                      <>
                        <Users className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">{project.client?.name || "Unknown"}</p>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 text-purple-600" />
                        <p className="text-sm font-medium text-purple-700">Personal</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">TASKS</p>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      {tasks.filter((t) => t?.status === "completed").length} / {tasks.length} completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "tasks" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "team" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("team")}
            >
              Team
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "files" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("files")}
            >
              Files
            </button>
            {/* Add a new "Collaborators" tab */}
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "collaborators" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("collaborators")}
            >
              Collaborators
            </button>
            {/* Add a new "Timeline" tab */}
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "timeline" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Description */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Project Description</h2>
               
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {project?.description || "No description provided."}
                  </p>
              

                {/* Recent Activity */}
                <h2 className="text-lg font-semibold mt-8 mb-4 text-gray-900">Recent Activity</h2>
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task?.status === "completed"
                            ? "bg-green-500"
                            : task?.status === "in-progress"
                              ? "bg-blue-500"
                              : task?.status === "review"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Task</span>{" "}
                          {task?.status === "completed" ? "completed" : "updated"}:{" "}
                          <Link href={`/tasks/${task.id}`} className="font-medium hover:text-blue-600">
                            {task?.title || "Untitled Task"}
                          </Link>
                        </p>
                        <p className="text-xs text-gray-500">{new Date(task.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <div className="text-center py-4 text-gray-500">No activity yet. Add tasks to get started.</div>
                  )}
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-6">
                {/* Client */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Client</h2>
                    {project?.client && (
                      <Link href={`/clients/${project.client.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                        View Details
                      </Link>
                    )}
                  </div>

                  {project?.client ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{project.client.name}</h3>
                          <p className="text-sm text-gray-600">{project.client.email || "No email"}</p>
                        </div>
                      </div>

                      {project.client.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{project.client.phone}</span>
                        </div>
                      )}

                      {project.client.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-700">{project.client.address}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-4">
                        <button className="flex-1 py-2 text-sm bg-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span >Email</span>
                        </button>
                        <button className="flex-1 py-2 text-sm bg-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Schedule</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Personal Project</h3>
                      <p className="text-gray-500 mb-4">This project is not associated with any client</p>
                    
                    </div>
                  )}
                </div>

                {/* Team Members Summary */}
                {project?.client_id && (
                  <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                      <button
                        className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm"
                        onClick={() => setShowAddTeamMemberModal(true)}
                        disabled={!project?.client_id}
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Team Member</span>
                      </button>
                    </div>

                    {teamMembers.length > 0 ? (
                      <div className="space-y-3">
                        {teamMembers.slice(0, 3).map((member) => (
                          <div key={member.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{member.name}</h3>
                              <p className="text-xs text-gray-600">{member.role || "Team Member"}</p>
                            </div>
                            {member.is_primary && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                        ))}

                        {teamMembers.length > 3 && (
                          <div className="text-center mt-2">
                            <button
                              onClick={() => setActiveTab("team")}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View all {teamMembers.length} team members
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-3">No team members added yet</p>
                        <button
                          onClick={() => {
                            setActiveTab("team")
                            setTimeout(() => setShowAddTeamMemberModal(true), 100)
                          }}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1 mx-auto"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Add Team Member</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {tasks.filter((t) => t?.status === "todo").length}
                      </p>
                      <p className="text-sm text-gray-500">To Do</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {tasks.filter((t) => t?.status === "in-progress").length}
                      </p>
                      <p className="text-sm text-gray-500">In Progress</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-yellow-600">
                        {tasks.filter((t) => t?.status === "review").length}
                      </p>
                      <p className="text-sm text-gray-500">Review</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-purple-600">
                        {tasks.filter((t) => t?.status === "completed").length}
                      </p>
                      <p className="text-sm text-gray-500">Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                {project?.client_id && (
                  <button
                    className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm"
                    onClick={() => setShowAddTeamMemberModal(true)}
                    disabled={!project?.client_id}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Team Member</span>
                  </button>
                )}
              </div>

              {!project?.client_id ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Project</h3>
                  <p className="text-gray-600 mb-4">Team members can only be added to projects with a client</p>
                  <button
                    onClick={handleAssignToClient}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    Assign to Client
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role || "Team Member"}</p>
                      </div>
                      {member.is_primary && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-lg p-1 flex">
                    <button
                      onClick={() => setViewType("card")}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        viewType === "card" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Cards
                    </button>
                    <button
                      onClick={() => setViewType("list")}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        viewType === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      List
                    </button>
                  </div>
                  <button
                    className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2"
                    onClick={() => setShowAddTaskModal(true)}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Task</span>
                  </button>
                </div>
              </div>

              {tasks.length > 0 ? (
                viewType === "card" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                      <Link href={`/tasks/${task.id}`} key={task.id}>
                        <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  task?.status === "completed"
                                    ? "bg-green-500"
                                    : task?.status === "in-progress"
                                      ? "bg-blue-500"
                                      : task?.status === "review"
                                        ? "bg-yellow-500"
                                        : "bg-gray-500"
                                }`}
                              ></div>
                              <h3 className="font-medium">{task?.title || "Untitled Task"}</h3>
                            </div>
                            <div
                              className={`
                                  text-xs font-medium px-2 py-0.5 rounded-full
                                  ${
                                    task?.priority === "high"
                                      ? "bg-red-100 text-red-700"
                                      : task?.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                  }
                                `}
                            >
                              {task?.priority}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {task?.description || "No description"}
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-xs text-gray-500">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </div>
                            <div
                              className={`text-xs font-medium ${task?.completed ? "text-green-600" : "text-gray-600"}`}
                            >
                              {task?.completed ? "Completed" : "In Progress"}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden border border-gray-200 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Task
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Priority
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Due Date
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  className={`flex-shrink-0 h-3 w-3 rounded-full ${
                                    task?.status === "completed"
                                      ? "bg-green-500"
                                      : task?.status === "in-progress"
                                        ? "bg-blue-500"
                                        : task?.status === "review"
                                          ? "bg-yellow-500"
                                          : "bg-gray-500"
                                  }`}
                                ></div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {task?.title || "Untitled Task"}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {task?.description || "No description"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  task?.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : task?.status === "in-progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : task?.status === "review"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task?.status === "completed"
                                  ? "Completed"
                                  : task?.status === "in-progress"
                                    ? "In Progress"
                                    : task?.status === "review"
                                      ? "Review"
                                      : "To Do"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  task?.priority === "high"
                                    ? "bg-red-100 text-red-800"
                                    : task?.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {task?.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(task.due_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/tasks/${task.id}`} className="text-blue-600 hover:text-blue-900">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No tasks yet</h3>
                  <p className="text-gray-500 mb-4">Add your first task to get started</p>
                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
                  >
                    Add Task
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "files" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Files</h2>
                <button className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload File</span>
                </button>
              </div>

              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
                <p className="text-gray-600 mb-4">Upload files to share with your team and client</p>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                  Upload Files
                </button>
              </div>
            </div>
          )}
          {/* Add the tab content for collaborators */}
          {activeTab === "collaborators" && (
            <ProjectCollaborators projectId={projectId} isOwner={projectAccess.isOwner} />
          )}
          {activeTab === "timeline" && (
            <ProjectTimeline
              projectId={projectId}
              isOwner={projectAccess.isOwner}
              canEdit={projectAccess.isOwner || (projectAccess.isCollaborator && projectAccess.permissions?.edit)}
            />
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
        <button
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          onClick={() => setShowAddTaskModal(false)}
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleAddTask} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            placeholder="Enter task description"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <DatePicker
            selected={newTask.due_date ? new Date(newTask.due_date) : null}
            onChange={(date) => {
              setNewTask({
                ...newTask,
                due_date: date ? date.toISOString().split("T")[0] : null,
              })
            }}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a due date"
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            onClick={() => setShowAddTaskModal(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Add Team Member Modal */}
      {showAddTeamMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add Team Member</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setShowAddTeamMemberModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {availableTeamMembers.length > 0 ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">Select a team member to add to this project:</p>
                <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                  {availableTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 ${
                        selectedTeamMember === member.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedTeamMember(member.id)}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                      {selectedTeamMember === member.id && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    onClick={() => {
                      setShowAddTeamMemberModal(false)
                      setShowCreateTeamMemberModal(true)
                    }}
                  >
                    Create new team member
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                      onClick={() => setShowAddTeamMemberModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTeamMember}
                      disabled={!selectedTeamMember || isAddingTeamMember}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isAddingTeamMember ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Add to Project</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No available team members</h3>
                <p className="text-gray-500 mb-4">Create a new team member to add to this project</p>
                <button
                  onClick={() => {
                    setShowAddTeamMemberModal(false)
                    setShowCreateTeamMemberModal(true)
                  }}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
                >
                  Create Team Member
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Team Member Modal */}
      {showCreateTeamMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create Team Member</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setShowCreateTeamMemberModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamMember}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter team member name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newTeamMember.email}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="E.g. Project Manager, Designer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newTeamMember.phone}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={newTeamMember.is_primary}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, is_primary: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-700">
                    Primary Contact
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setShowCreateTeamMemberModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingTeamMember}
                  className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isAddingTeamMember ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Create & Add</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Project Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Edit Project</h2>
              <button
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={editedProject?.name}
                  onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <select
                  value={editedProject?.client_id || "personal"}
                  onChange={(e) => {
                    const value = e.target.value
                    setEditedProject({
                      ...editedProject,
                      client_id: value === "personal" ? undefined : value,
                    })
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                >
                  <option value="personal">Personal (No Client)</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <DatePicker
                    selected={editedProject?.start_date ? new Date(editedProject.start_date) : null}
                    onChange={(date) => {
                      setEditedProject({
                        ...editedProject,
                        start_date: date ? date.toISOString() : null,
                      })
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a start date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <DatePicker
                    selected={editedProject?.due_date ? new Date(editedProject.due_date) : null}
                    onChange={(date) => {
                      setEditedProject({
                        ...editedProject,
                        due_date: date ? date.toISOString() : null,
                      })
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a due date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editedProject?.description || ""}
                  onChange={(e) => {
                    setEditedProject({
                      ...editedProject,
                      description: e.target.value,
                    })
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  placeholder="Enter project description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editedProject?.status || ""}
                  onChange={(e) => {
                    setEditedProject({
                      ...editedProject,
                      status: e.target.value,
                    })
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                  onClick={handleUpdateProject}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Completion Animation */}
      <CompletionAnimation
        type="project"
        show={showCompletionAnimation}
        onComplete={() => setShowCompletionAnimation(false)}
      />
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
  return (
    <div
      className={`bg-gray-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 cursor-pointer transition-colors ${isActive ? "bg-gray-100" : "bg-gray-50 text-gray-400"}`}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs sm:text-sm font-medium">{text}</span>
    </div>
  )
}

function RoomCard({ icon, name, devices, isActive }) {
  return (
    <Link href={`/clients/${name.replace(/\s+/g, "-").toLowerCase()}`}>
      <div
        className={`flex items-center gap-4 p-4 rounded-full cursor-pointer transition-all duration-200 
         ${isActive ? "bg-white" : ""} 
         hover:bg-white`}
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">{icon}</div>
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500">{devices} project(s)</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  )
}
