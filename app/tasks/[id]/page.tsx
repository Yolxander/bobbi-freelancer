"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Calendar,
  CheckSquare,
  Square,
  ArrowLeft,
  Plus,
  Edit,
  MoreHorizontal,
  Circle,
  X,
  Trash,
  Save,
  AlertCircle,
  Github,
  GitBranch,
  Code,
  Server,
  GitPullRequest,
  Pencil,
  GripVertical,
  Briefcase,
  CheckCircle,
  FileText,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { getTask, updateTask, deleteTask, toggleTaskCompletion } from "@/app/actions/task-actions"
import {
  getSubtasks,
  createSubtask,
  updateSubtask,
  toggleSubtaskCompletion,
  deleteSubtask,
} from "@/app/actions/subtask-actions"
import { getProjects } from "@/app/actions/project-actions"
import { getGitHubRepoFromUrl } from "@/lib/provider-utils"
import { getIssues, createIssue, updateIssue, deleteIssue } from "@/app/actions/issue-actions"
// Add the import for the CompletionAnimation component
import { CompletionAnimation } from "@/components/completion-animation"
import { useWebDeveloper } from "@/hooks/useWebDeveloper"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './modal-animations.css';

export default function TaskDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const taskId = params.id

  const [task, setTask] = useState(null)
  const [subtasks, setSubtasks] = useState([])
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<TaskData | null>(null)
  const [newSubtask, setNewSubtask] = useState("")
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [editingSubtaskId, setEditingSubtaskId] = useState(null)
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState("")
  const [draggedSubtask, setDraggedSubtask] = useState(null)
  const [dragOverSubtask, setDragOverSubtask] = useState(null)
  const [activeAction, setActiveAction] = useState(null)
  const [cursorPosition, setCursorPosition] = useState(null)
  // Add state to track when to show the animation
  // Add this to the existing state declarations at the top of the component
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [editedStatus, setEditedStatus] = useState("")
  const commandInputRef = useRef<HTMLInputElement>(null)

  // Issues tracking state
  const [issues, setIssues] = useState([])
  const [newIssue, setNewIssue] = useState({
    task_id: taskId as string,
    title: "",
    description: "",
    status: "open",
    fix: "",
    code_snippet: "",
  })
  const [isAddingIssue, setIsAddingIssue] = useState(false)
  const [editingIssueId, setEditingIssueId] = useState(null)
  const [isEditingIssue, setIsEditingIssue] = useState(false)

  // Developer-specific state
  // Use our new hook
  const { isWebDeveloper, isLoading: isWebDevLoading } = useWebDeveloper(user?.id)
  const [githubRepo, setGithubRepo] = useState(null)
  const [branches, setBranches] = useState([])
  const [pullRequests, setPullRequests] = useState([])
  const [deployments, setDeployments] = useState([])
  const [techStack, setTechStack] = useState([])
  const [codeSnippet, setCodeSnippet] = useState("")
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [componentName, setComponentName] = useState("")

  const flattenTaskData = (taskData) => {
    if (!taskData) return null

    // Create a new object with only the necessary fields
    return {
      ...taskData,
      project_id: taskData.project?.id || taskData.project_id,
      project_name: taskData.project?.name || "Unknown Project",
      project_color: taskData.project?.color || "#4f46e5",
      project: undefined // Remove the nested project object
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true)
        setError(null)

        try {
          // Fetch task details
          const taskResult = await getTask(taskId)

          console.log('taskResult', taskResult);

          if (taskResult.success && taskResult.data) {
            const flattenedTask = flattenTaskData(taskResult.data)
            setTask(flattenedTask)
            setEditedTask(flattenedTask)

            // If task has github_repo, parse it
            if (flattenedTask.github_repo) {
              const repo = getGitHubRepoFromUrl(flattenedTask.github_repo)
              setGithubRepo(repo)

              // Load dummy data
              loadDummyDeveloperData(repo)
            }

            // Set component name if it exists
            if (flattenedTask.component_name) {
              setComponentName(flattenedTask.component_name)
            }

            // Fetch subtasks
            const subtasksResult = await getSubtasks(taskId)
            if (subtasksResult.success) {
              setSubtasks(subtasksResult.data || [])
            }

            // Fetch projects for dropdown
            const projectsResult = await getProjects(user.id)
            if (projectsResult.success) {
              setProjects(projectsResult.data || [])
            }

            // Add this to the fetchData function in the useEffect
            // After fetching task details and subtasks
            const issuesResult = await getIssues(taskId)
            if (issuesResult.success) {
              setIssues(issuesResult.data || [])
            }
          } else {
            setError(taskResult.error || "Task not found")
          }
        } catch (err) {
          console.error("Error fetching task data:", err)
          setError("Failed to load task details")
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, taskId])

  // Load dummy developer data for demonstration
  const loadDummyDeveloperData = (repo) => {
    if (!repo) return

    // Dummy branches
    setBranches([
      { name: "main", lastCommit: "Update README.md", author: "johndoe", date: "2 days ago" },
      { name: "feature/task-management", lastCommit: "Add task filtering", author: "janedoe", date: "5 hours ago" },
      { name: "bugfix/login-issue", lastCommit: "Fix authentication flow", author: "johndoe", date: "yesterday" },
    ])

    // Dummy pull requests
    setPullRequests([
      { id: "PR-123", title: "Implement task management UI", author: "janedoe", status: "open", date: "2 days ago" },
      { id: "PR-124", title: "Fix login issues", author: "johndoe", status: "merged", date: "yesterday" },
    ])

    // Dummy deployments
    setDeployments([
      { environment: "staging", status: "success", url: "https://staging.example.com", date: "yesterday" },
      { environment: "production", status: "pending", url: "https://example.com", date: "pending" },
    ])

    // Dummy tech stack
    setTechStack(["React", "Next.js", "TypeScript", "Tailwind CSS", "Supabase"])

    // Dummy code snippet
    setCodeSnippet(`function TaskComponent({ task }) {
  const [isComplete, setIsComplete] = useState(task.completed);
  
  const toggleComplete = async () => {
    try {
      await updateTaskStatus(task.id, !isComplete);
      setIsComplete(!isComplete);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }
  
  return (
    <div className="task-item">
      <input 
        type="checkbox" 
        checked={isComplete} 
        onChange={toggleComplete} 
      />
      <span className={isComplete ? "completed" : ""}>
        {task.title}
      </span>
    </div>
  );
}`)
  }

  const handleUpdateTask = async () => {
    if (!editedTask?.id || !editedTask.title) {
      setError("Task title is required");
      return;
    }

    try {
      const result = await updateTask(editedTask.id, {
        title: editedTask.title,
        description: editedTask.description,
        due_date: editedTask.due_date,
      });
      
      if (result.success) {
        // Update local state
        setTask(result.data);
        setEditedTask(null);
        setIsEditModalOpen(false);
        setError(null);
      } else {
        setError(result.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("An unexpected error occurred while updating the task");
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return

    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const result = await deleteTask(task.id)

        if (result.success) {
          router.push("/tasks")
        } else {
          setError(result.error || "Failed to delete task")
        }
      } catch (error) {
        console.error("Error deleting task:", error)
        setError("Failed to delete task")
      }
    }
  }

  // Update the handleToggleTaskCompletion function to show the animation when a task is completed
  // Find the handleToggleTaskCompletion function and update it:

  const handleToggleTaskCompletion = async () => {
    if (!task) return

    try {
      const result = await toggleTaskCompletion(task.id, !task.completed)

      if (result.success) {
        // If the task is being marked as completed, show the animation
        if (!task.completed) {
          setShowCompletionAnimation(true)
        }

        const flattenedTask = flattenTaskData({
          ...task,
          completed: !task.completed,
          status: !task.completed ? "completed" : "todo",
        })
        setTask(flattenedTask)
        setActiveAction(null)
      } else {
        setError(result.error || "Failed to update task")
      }
    } catch (error) {
      console.error("Error toggling task completion:", error)
      setError("Failed to update task")
    }
  }

  // Also update the handleUpdateTaskStatus function to show the animation when status is changed to completed
  // Find the handleUpdateTaskStatus function and update it:

  const handleUpdateTaskStatus = async () => {
    if (!editedStatus) return

    try {
      await updateTask({
        id: task.id,
        status: editedStatus,
      });
      setIsStatusModalOpen(false);
      setEditedStatus("");
      // Refresh the task data
      const updatedTask = await getTask(task.id);
      setTask(updatedTask);
    } catch (error) {
      console.error("Failed to update task status:", error);
      // You might want to show an error message to the user
    }
  };

  const handleAddSubtask = async (e) => {
    e?.preventDefault()

    if (!newSubtask.trim() || !task) return

    try {
      const result = await createSubtask({
        title: newSubtask,
        task_id: task.id,
        provider_id: task.provider_id,
      })

      if (result.success) {
        const subtasksResult = await getSubtasks(task.id)
        if (subtasksResult.success) {
          setSubtasks(subtasksResult.data || [])
        }

        setNewSubtask("")
        setIsAddingSubtask(false)
        setActiveAction(null)
      } else {
        setError(result.error || "Failed to add subtask")
      }
    } catch (error) {
      console.error("Error adding subtask:", error)
      setError("Failed to add subtask")
    }
  }

  const handleToggleSubtask = async (subtaskId, completed) => {
    if (!task) return

    try {
      const result = await toggleSubtaskCompletion(subtaskId, !completed)

      if (result.success) {
        setSubtasks(
          subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, completed: !completed } : subtask)),
        )
      } else {
        setError(result.error || "Failed to update subtask")
      }
    } catch (error) {
      console.error("Error toggling subtask:", error)
      setError("Failed to update subtask")
    }
  }

  const handleDeleteSubtask = async (subtaskId) => {
    if (!task) return

    try {
      const result = await deleteSubtask(subtaskId)

      if (result.success) {
        setSubtasks(subtasks.filter((subtask) => subtask.id !== subtaskId))
      } else {
        setError(result.error || "Failed to delete subtask")
      }
    } catch (error) {
      console.error("Error deleting subtask:", error)
      setError("Failed to delete subtask")
    }
  }

  const handleEditSubtask = (subtaskId, currentTitle) => {
    setEditingSubtaskId(subtaskId)
    setEditedSubtaskTitle(currentTitle)
  }

  const handleSaveSubtaskEdit = async (subtaskId) => {
    if (!editedSubtaskTitle.trim()) return

    try {
      const result = await updateSubtask(subtaskId, {
        title: editedSubtaskTitle,
        task_id: task.id,
      })

      if (result.success) {
        setSubtasks(
          subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, title: editedSubtaskTitle } : subtask)),
        )
        setEditingSubtaskId(null)
        setEditedSubtaskTitle("")
      } else {
        setError(result.error || "Failed to update subtask")
      }
    } catch (error) {
      console.error("Error updating subtask:", error)
      setError("Failed to update subtask")
    }
  }

  const handleDragStart = (e, subtask) => {
    setDraggedSubtask(subtask)
    e.dataTransfer.effectAllowed = "move"
    const ghostElement = document.createElement("div")
    ghostElement.classList.add("bg-white", "p-3", "rounded-lg", "shadow-md", "border", "border-blue-200")
    ghostElement.textContent = subtask.title
    ghostElement.style.position = "absolute"
    ghostElement.style.top = "-1000px"
    document.body.appendChild(ghostElement)
    e.dataTransfer.setDragImage(ghostElement, 0, 0)
    setTimeout(() => {
      document.body.removeChild(ghostElement)
    }, 0)
  }

  const handleDragOver = (e, subtask) => {
    e.preventDefault()
    if (draggedSubtask && draggedSubtask.id !== subtask.id) {
      setDragOverSubtask(subtask.id)
    }
  }

  const handleDragEnd = async () => {
    if (!draggedSubtask || !dragOverSubtask) {
      setDraggedSubtask(null)
      setDragOverSubtask(null)
      return
    }

    const draggedIndex = subtasks.findIndex((s) => s.id === draggedSubtask.id)
    const dropIndex = subtasks.findIndex((s) => s.id === dragOverSubtask)

    if (draggedIndex === dropIndex) {
      setDraggedSubtask(null)
      setDragOverSubtask(null)
      return
    }

    const newSubtasks = [...subtasks]
    const [removed] = newSubtasks.splice(draggedIndex, 1)
    newSubtasks.splice(dropIndex, 0, removed)

    setSubtasks(newSubtasks)
    setDraggedSubtask(null)
    setDragOverSubtask(null)
  }

  // Calculate completion percentage
  const completionPercentage =
    subtasks.length > 0
      ? Math.round((subtasks.filter((s) => s.completed).length / subtasks.length) * 100)
      : task?.completed
        ? 100
        : 0

  useEffect(() => {
    if (subtasks.length > 0 && task && !task.completed) {
      const allSubtasksCompleted = subtasks.every((subtask) => subtask.completed)
      if (allSubtasksCompleted) {
        const flattenedTask = flattenTaskData({
          ...task,
          completed: true,
          status: "completed",
        })
        setTask(flattenedTask)

        toggleTaskCompletion(task.id, true)
      }
    }
  }, [subtasks, task])

  const handleUpdateTaskPriority = async (priority) => {
    if (!task) return

    try {
      const result = await updateTask(task.id, {
        priority,
      })

      if (result.success) {
        const flattenedTask = flattenTaskData({
          ...task,
          priority,
        })
        setTask(flattenedTask)
        setActiveAction(null)
      } else {
        setError(result.error || "Failed to update task priority")
      }
    } catch (error) {
      console.error("Error updating task priority:", error)
      setError("Failed to update task priority")
    }
  }

  const handleCodeSnippetUpdate = (newCode) => {
    setCodeSnippet(newCode)
  }

  const handleSaveCodeSnippet = async () => {
    if (!editedTask || !editedTask.component_name) {
      alert("Please enter a component name")
      return
    }

    try {
      const result = await updateTask(task.id, {
        component_name: editedTask.component_name,
        code_snippet: codeSnippet,
      })

      if (result.success) {
        const flattenedTask = flattenTaskData({
          ...task,
          component_name: editedTask.component_name,
          code_snippet: codeSnippet,
        })
        setTask(flattenedTask)
        setComponentName(editedTask.component_name)
        setShowCodeEditor(false)
        alert("Code snippet saved successfully!")
      } else {
        setError(result.error || "Failed to save code snippet")
      }
    } catch (error) {
      console.error("Error saving code snippet:", error)
      setError("Failed to save code snippet")
    }
  }

  const handleSaveIssue = async () => {
    if (!newIssue.title.trim()) {
      alert("Issue title is required")
      return
    }

    try {
      let result

      if (isEditingIssue && editingIssueId) {
        // Update existing issue
        result = await updateIssue(editingIssueId, newIssue)
      } else {
        // Create new issue
        result = await createIssue(newIssue)
      }

      if (result.success) {
        // Refresh issues list
        const refreshedIssues = await getIssues(taskId)
        if (refreshedIssues.success) {
          setIssues(refreshedIssues.data || [])
        }

        // Reset form
        setNewIssue({
          task_id: taskId as string,
          title: "",
          description: "",
          status: "open",
          fix: "",
          code_snippet: "",
        })
        setIsAddingIssue(false)
        setIsEditingIssue(false)
        setEditingIssueId(null)
      } else {
        setError(result.error || "Failed to save issue")
      }
    } catch (err) {
      console.error("Error saving issue:", err)
      setError("Failed to save issue")
    }
  }

  const handleDeleteIssue = async (issueId) => {
    if (confirm("Are you sure you want to delete this issue?")) {
      try {
        const result = await deleteIssue(issueId, taskId)

        if (result.success) {
          // Update local state
          setIssues(issues.filter((issue) => issue.id !== issueId))
        } else {
          setError(result.error || "Failed to delete issue")
        }
      } catch (err) {
        console.error("Error deleting issue:", err)
        setError("Failed to delete issue")
      }
    }
  }

  const handleEditIssue = (issue) => {
    setNewIssue({
      task_id: taskId as string,
      title: issue.title,
      description: issue.description || "",
      status: issue.status,
      fix: issue.fix || "",
      code_snippet: issue.code_snippet || "",
    })
    setEditingIssueId(issue.id)
    setIsEditingIssue(true)
    setIsAddingIssue(true)
  }

  useEffect(() => {
    // Add global keyboard shortcut listener
    const handleGlobalKeyDown = (e) => {
      // Check for Command+Control+T (Mac) or Ctrl+Alt+T (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && (e.ctrlKey || e.altKey) && e.key === "t") {
        e.preventDefault()
        setIsAddingSubtask(true)
        // Focus on the subtask input after a short delay to ensure it's rendered
        setTimeout(() => {
          const subtaskInput = document.getElementById("new-subtask-input")
          if (subtaskInput) {
            subtaskInput.focus()
          }
        }, 100)
      }
    }

    // Add the event listener to the window
    window.addEventListener("keydown", handleGlobalKeyDown)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown)
    }
  }, [])

  const handleEditTask = () => {
    if (task) {
      setEditedTask({
        id: task.id,
        title: task.title,
        description: task.description || "",
        due_date: task.due_date || "",
        status: task.status,
        priority: task.priority,
        category: task.category,
        project_id: task.project_id,
        provider_id: task.provider_id,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setEditedTask(null);
    setIsEditModalOpen(false);
    setError(null);
  };

  if (authLoading || isLoading || isWebDevLoading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading task details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Task not found</h3>
              <p className="text-gray-500 mt-2">
                {error || "The task you're looking for doesn't exist or has been removed."}
              </p>
              <Link href="/tasks">
                <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                  Back to Tasks
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
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/tasks" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Tasks</span>
            </Link>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-xl ${
                      task.status === "todo"
                        ? "bg-gray-100"
                        : task.status === "in-progress"
                          ? "bg-blue-100"
                          : task.status === "review"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                    } flex items-center justify-center`}
                  >
                    <CheckSquare
                      className={`w-8 h-8 ${
                        task.status === "todo"
                          ? "text-gray-600"
                          : task.status === "in-progress"
                            ? "text-blue-600"
                            : task.status === "review"
                              ? "text-yellow-600"
                              : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h1 className={`text-2xl text-gray-700 font-bold ${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500">Project: {task.project || "None"}</span>
                      <span className="text-gray-300">•</span>
                      <div
                        className={`
                          text-xs font-medium px-2.5 py-0.5 rounded-full
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
                        {task.status === "todo"
                          ? "To Do"
                          : task.status === "in-progress"
                            ? "In Progress"
                            : task.status === "review"
                              ? "Review"
                              : "Completed"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleTaskCompletion}
                    className={`px-4 py-2 ${task.completed ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"} rounded-xl text-sm font-medium hover:bg-opacity-80 transition-colors flex items-center gap-2`}
                  >
                    {task.completed ? (
                      <>
                        <Square className="w-4 h-4" />
                        <span>Mark Incomplete</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </>
                    )}
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                    onClick={handleDeleteTask}
                  >
                    <Trash className="w-4 h-4" />
                    <span>Delete Task</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{completionPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-in-out"
                    style={{
                      width: `${completionPercentage}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">STATUS</p>
                  <div className="flex items-center gap-2">
                    <Circle
                      className={`w-4 h-4 ${
                        task.status === "todo"
                          ? "text-gray-400"
                          : task.status === "in-progress"
                            ? "text-blue-500"
                            : task.status === "review"
                              ? "text-yellow-500"
                              : "text-green-500"
                      }`}
                    />
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">Status</span>: {" "}
                      {task.status === "completed" ? "Completed" : task.status === "in-progress" ? "In Progress" : task.status === "review" ? "Review" : "To Do"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">DUE DATE</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">Due Date</span>: {" "}
                      {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">PRIORITY</p>
                  <div className="flex items-center gap-2">
                    <AlertCircle
                      className={`w-4 h-4 ${
                        task.priority === "low"
                          ? "text-green-500"
                          : task.priority === "medium"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    />
                    <p className="text-sm font-medium text-gray-900 capitalize">{task.priority || "Medium"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">SUBTASKS</p>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      {subtasks.filter((s) => s.completed).length} / {subtasks.length} completed
                    </p>
                  </div>
                </div>
              </div>

              {/* Development Information - Only show if provider is a web developer */}
              {isWebDeveloper && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Development Information</h3>
                    {githubRepo ? (
                      <a
                        href={`https://github.com/${githubRepo.fullName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Github className="w-4 h-4" />
                        <span>View Repository</span>
                      </a>
                    ) : null}
                  </div>

                  {githubRepo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Github className="w-4 h-4 text-gray-700" />
                          <h4 className="font-medium">Repository</h4>
                        </div>
                        <p className="text-sm">{githubRepo.fullName}</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <GitBranch className="w-4 h-4 text-gray-700" />
                          <h4 className="font-medium">Active Branch</h4>
                        </div>
                        <p className="text-sm">feature/task-management</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <Github className="w-6 h-6 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No repository linked to this task</p>
                      <p className="text-xs text-gray-400 mt-1">Edit this task to add a GitHub repository</p>
                    </div>
                  )}

                  {/* Tech Stack */}
                  {task.tech_stack ? (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {task.tech_stack.split(",").map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "subtasks" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("subtasks")}
            >
              Subtasks
            </button>
            {isWebDeveloper && (
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === "code" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("code")}
              >
                Code Snippets
              </button>
            )}
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "issues" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("issues")}
            >
              Issues
            </button>
            {githubRepo && (
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === "deployments" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("deployments")}
              >
                Deployments
              </button>
            )}
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "activity" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("activity")}
            >
              Activity
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Task Description */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{task.description || "No description provided."}</p>

                {/* Subtasks Preview */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Subtasks</h2>
                  <span className="text-xs text-gray-500">
                    Press Cmd+Ctrl+T (Mac) or Ctrl+Alt+T (Windows) to add a new subtask
                  </span>
                </div>
                <div className="space-y-2">
                  {subtasks.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No subtasks yet. Add subtasks to break down this task.
                    </div>
                  ) : (
                    subtasks.slice(0, 5).map((subtask) => (
                      <div key={subtask.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                        <button onClick={() => handleToggleSubtask(subtask.id, subtask.completed)} className="mr-3">
                          {subtask.completed ? (
                            <CheckSquare className="w-5 h-5 text-green-500" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-300" />
                          )}
                        </button>
                        <span className={`flex-1 ${subtask.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))
                  )}

                  {subtasks.length > 5 && (
                    <div className="text-center mt-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        onClick={() => setActiveTab("subtasks")}
                      >
                        View all {subtasks.length} subtasks
                      </button>
                    </div>
                  )}

                  {isAddingSubtask ? (
                    <div className="flex flex-col gap-2 mt-2 bg-gray-50 p-3 rounded-lg">
                      <textarea
                        id="new-subtask-input"
                        value={newSubtask}
                        onChange={(e) => {
                          setNewSubtask(e.target.value)
                          setCursorPosition(e.target.selectionStart)
                        }}
                        placeholder="Enter subtask title..."
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-900 text-gray-900 min-h-[80px] resize-y"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleAddSubtask()
                          }
                        }}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleAddSubtask}
                          className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingSubtask(false)
                            setNewSubtask("")
                          }}
                          className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingSubtask(true)}
                      className="flex items-center gap-1 text-sm text-gray-900 hover:text-gray-700"
                    >
                      <Plus className="w-4 h-4" /> Add Subtask
                    </button>
                  )}
                </div>
              </div>

              {/* Task Info */}
              <div className="space-y-6">
                {/* Project */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Project</h2>
                    {task.project_id && (
                      <Link href={`/projects/${task.project_id}`} className="text-sm text-blue-600 hover:text-blue-800">
                        View Project
                      </Link>
                    )}
                  </div>

                  {task.project_name ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{task.project_name}</h3>
                        <p className="text-sm text-gray-700">{task.client || "No client"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">This task is not assigned to any project.</div>
                  )}
                </div>

                {/* Task Actions */}
                <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className={`transition-colors rounded-xl p-3 text-sm font-medium flex flex-col items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900`}
                      onClick={handleEditTask}
                    >
                      <Pencil className="w-5 h-5 text-gray-700" />
                      <span>Edit Task</span>
                    </button>

                    <button
                      className={`transition-colors rounded-xl p-3 text-sm font-medium flex flex-col items-center gap-2 ${
                        task.status === "completed"
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                      }`}
                      onClick={() => setIsStatusModalOpen(true)}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Update Status</span>
                    </button>

                    <button
                      className={`transition-colors rounded-xl p-3 text-sm font-medium flex flex-col items-center gap-2 ${
                        task.completed ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-green-100 hover:bg-green-200 text-green-700"
                      }`}
                      onClick={handleToggleTaskCompletion}
                    >
                      <CheckSquare className="w-5 h-5" />
                      <span>{task.completed ? "Mark Incomplete" : "Mark Complete"}</span>
                    </button>

                    <button
                      className={`transition-colors rounded-xl p-3 text-sm font-medium flex flex-col items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900`}
                      onClick={handleDeleteTask}
                    >
                      <Trash className="w-5 h-5 text-gray-700" />
                      <span>Delete Task</span>
                    </button>
                  </div>
                </div>

                {/* Developer Actions - Only show if provider is a web developer */}
                {isWebDeveloper && (
                  <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Developer Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className={`transition-colors rounded-xl p-3 text-sm font-medium flex flex-col items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900`}
                        onClick={() => {
                          if (!githubRepo) {
                            // Show alert if no GitHub repo is linked
                            alert("Please link a GitHub repository first to access deployments.")
                            return
                          }

                          setActiveTab("deployments")
                        }}
                      >
                        <Server
                          className={`w-5 h-5 text-gray-700`}
                        />
                        <span>Deployments</span>
                      </button>

                      <button
                        className={`transition-colors rounded-xl p-3 text-sm font-medium flex flex-col items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900`}
                        onClick={() => {
                          if (!githubRepo) {
                            // Show alert if no GitHub repo is linked
                            alert("Please link a GitHub repository first to access pull requests.")
                            return
                          }

                          window.open(`https://github.com/${githubRepo.fullName}/pulls`, "_blank")
                        }}
                      >
                        <GitPullRequest
                          className={`w-5 h-5 text-gray-700`}
                        />
                        <span>Pull Requests</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code Snippets Tab */}
          {activeTab === "code" && isWebDeveloper && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Code Snippets</h2>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                    onClick={() => setShowCodeEditor(!showCodeEditor)}
                  >
                    {showCodeEditor ? (
                      <>
                        <X className="w-4 h-4" />
                        <span>Close Editor</span>
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        <span>Add Snippet</span>
                      </>
                    )}
                  </button>
                  {showCodeEditor && (
                    <button
                      className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-1"
                      onClick={handleSaveCodeSnippet}
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Snippet</span>
                    </button>
                  )}
                </div>
              </div>

              {showCodeEditor ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
                  <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Component Name (e.g., ExampleComponent)"
                      className="w-full bg-transparent border-none text-sm focus:outline-none"
                      value={editedTask?.component_name || ""}
                      onChange={(e) => setEditedTask({ ...editedTask, component_name: e.target.value })}
                    />
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-gray-500 hover:text-gray-700">Format</button>
                    </div>
                  </div>
                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full h-80 p-4 font-mono text-sm focus:outline-none"
                    style={{ fontFamily: "monospace" }}
                    placeholder="// Enter your component code here
import React from 'react';

export const ExampleComponent = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};"
                  />
                </div>
              ) : (
                <div className="mb-6">
                  {componentName ? (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-700">{componentName}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">React</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">JSX</span>
                        </div>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{codeSnippet}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Code className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-700 mb-1">No Code Snippets Yet</h3>
                      <p className="text-gray-500 mb-4">Save important code snippets for this task</p>
                      <button
                        onClick={() => setShowCodeEditor(true)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        Add First Snippet
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Related Components</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tech_stack ? (
                    task.tech_stack.split(",").map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {tech.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No related components added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Deployments Tab */}
          {activeTab === "deployments" && githubRepo && isWebDeveloper && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Deployments</h2>
                <button
                  className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-1"
                  onClick={() => {
                    alert("Deployment initiated!")
                  }}
                >
                  <Server className="w-4 h-4" />
                  <span>Deploy Now</span>
                </button>
              </div>

              <div className="space-y-4">
                {deployments.map((deployment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-gray-700" />
                        <h3 className="font-medium">{deployment.environment}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            deployment.status === "success"
                              ? "bg-green-100 text-green-700"
                              : deployment.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {deployment.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{deployment.date}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Deployment URL:</span>
                        <a
                          href={deployment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {deployment.url}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks Tab */}
          {activeTab === "subtasks" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Subtasks</h2>
                <button
                  className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => setIsAddingSubtask(true)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subtask</span>
                </button>
              </div>

              {isAddingSubtask && (
                <div className="flex flex-col gap-2 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <textarea
                    id="new-subtask-input"
                    value={newSubtask}
                    onChange={(e) => {
                      setNewSubtask(e.target.value)
                      setCursorPosition(e.target.selectionStart)
                    }}
                    placeholder="Enter subtask title..."
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-900 text-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddSubtask()
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      onClick={handleAddSubtask}
                      className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingSubtask(false)
                        setNewSubtask("")
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {subtasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No subtasks yet</h3>
                  <p className="text-gray-500 mb-4">Break down this task into smaller steps</p>
                  <button
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    onClick={() => setIsAddingSubtask(true)}
                  >
                    Add Subtask
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-2">Drag and drop to reorder subtasks</p>
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, subtask)}
                      onDragOver={(e) => handleDragOver(e, subtask)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-start p-3 rounded-lg border transition-all ${
                        dragOverSubtask === subtask.id
                          ? "border-blue-400 bg-blue-50"
                          : draggedSubtask?.id === subtask.id
                            ? "border-gray-300 bg-gray-50 opacity-50"
                            : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="cursor-grab p-1 mr-2 text-gray-400 hover:text-gray-600 mt-0.5">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <button
                        onClick={() => handleToggleSubtask(subtask.id, subtask.completed)}
                        className="mr-3 flex-shrink-0 mt-0.5"
                      >
                        {subtask.completed ? (
                          <CheckSquare className="w-5 h-5 text-green-500" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-300" />
                        )}
                      </button>

                      {editingSubtaskId === subtask.id ? (
                        <div className="flex-1 flex flex-col gap-2">
                          <textarea
                            value={editedSubtaskTitle}
                            onChange={(e) => setEditedSubtaskTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-900 text-gray-900"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSaveSubtaskEdit(subtask.id)
                              } else if (e.key === "Escape") {
                                setEditingSubtaskId(null)
                              }
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveSubtaskEdit(subtask.id)}
                              className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-1"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingSubtaskId(null)}
                              className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className={`flex-1 break-words ${subtask.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                          {subtask.title}
                        </span>
                      )}

                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        {!editingSubtaskId && (
                          <button
                            onClick={() => handleEditSubtask(subtask.id, subtask.title)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit subtask"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSubtask(subtask.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete subtask"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Issues Tab */}
          {activeTab === "issues" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Known Issues & Fixes</h2>
                <button
                  className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setIsAddingIssue(true)
                    setIsEditingIssue(false)
                    setEditingIssueId(null)
                    setNewIssue({
                      task_id: taskId as string,
                      title: "",
                      description: "",
                      status: "open",
                      fix: "",
                      code_snippet: "",
                    })
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Issue</span>
                </button>
              </div>

              {isAddingIssue && (
                <div className="flex flex-col gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                    <input
                      type="text"
                      value={newIssue.title}
                      onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                      placeholder="Enter issue title..."
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-900 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newIssue.description}
                      onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                      placeholder="Describe the issue..."
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-900 text-gray-900 min-h-[80px] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newIssue.status}
                      onChange={(e) => setNewIssue({ ...newIssue, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-900 text-gray-900"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fix Solution</label>
                    <textarea
                      value={newIssue.fix}
                      onChange={(e) => setNewIssue({ ...newIssue, fix: e.target.value })}
                      placeholder="Describe how you fixed the issue (if fixed)..."
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-900 text-gray-900 min-h-[80px] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fix Code Snippet (optional)</label>
                    <textarea
                      value={newIssue.code_snippet}
                      onChange={(e) => setNewIssue({ ...newIssue, code_snippet: e.target.value })}
                      placeholder="Paste code that fixes the issue..."
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono focus:outline-none focus:border-gray-900 text-gray-900 min-h-[120px] resize-y"
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      onClick={handleSaveIssue}
                      className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                      {isEditingIssue ? "Update Issue" : "Save Issue"}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingIssue(false)
                        setIsEditingIssue(false)
                        setEditingIssueId(null)
                        setNewIssue({
                          task_id: taskId as string,
                          title: "",
                          description: "",
                          status: "open",
                          fix: "",
                          code_snippet: "",
                        })
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {issues.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No issues reported</h3>
                  <p className="text-gray-500 mb-4">Track bugs and their fixes for this task</p>
                  <button
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    onClick={() => setIsAddingIssue(true)}
                  >
                    Report First Issue
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div key={issue.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              issue.status === "open"
                                ? "bg-red-500"
                                : issue.status === "in-progress"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          ></span>
                          <h3 className="font-medium">{issue.title}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              issue.status === "open"
                                ? "bg-red-100 text-red-700"
                                : issue.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {issue.status === "open"
                              ? "Open"
                              : issue.status === "in-progress"
                                ? "In Progress"
                                : "Fixed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(issue.created_at).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleEditIssue(issue)}
                            className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteIssue(issue.id)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{issue.description}</p>
                        </div>

                        {issue.status === "fixed" && issue.fix && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Fix Solution</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{issue.fix}</p>
                          </div>
                        )}

                        {issue.status === "fixed" && issue.code_snippet && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Fix Code</h4>
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                              <code>{issue.code_snippet}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Activity Timeline</h2>

              <div className="space-y-6">
                <div className="relative pl-8">
                  <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
                  <div className="absolute top-1 left-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">Task Created</h3>
                      <p className="text-xs text-gray-500">{new Date(task.created_at).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-gray-700">Task "{task.title}" was created</p>
                  </div>
                </div>

                {task.updated_at && task.updated_at !== task.created_at && (
                  <div className="relative pl-8">
                    <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
                    <div className="absolute top-1 left-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">Task Updated</h3>
                        <p className="text-xs text-gray-500">{new Date(task.updated_at).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-700">Task details were updated</p>
                    </div>
                  </div>
                )}

                {task.completed && (
                  <div className="relative pl-8">
                    <div className="absolute top-1 left-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">Task Completed</h3>
                        <p className="text-xs text-gray-500">{new Date(task.updated_at).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-700">Task was marked as completed</p>
                    </div>
                  </div>
                )}

                {/* GitHub related activities */}
                {githubRepo && isWebDeveloper && (
                  <>
                    <div className="relative pl-8">
                      <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
                      <div className="absolute top-1 left-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Github className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm">Repository Linked</h3>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                        <p className="text-sm text-gray-700">
                          GitHub repository <span className="font-medium">{githubRepo.fullName}</span> was linked to
                          this task
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Task Completion Animation */}
      <CompletionAnimation
        type="task"
        show={showCompletionAnimation}
        onComplete={() => setShowCompletionAnimation(false)}
      />

      {/* Edit Task Modal */}
      {isEditModalOpen && editedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-3xl p-6 w-96 shadow-lg transform ${isEditModalOpen ? 'modal-enter' : 'modal-exit'}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
                <input
                  type="text"
                  value={editedTask.title || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="bg-gray-50 w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 text-gray-900"
                  placeholder="Enter task title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                <textarea
                  value={editedTask.description || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  className="bg-gray-50 w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 text-gray-900"
                  rows={4}
                  placeholder="Enter task description..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Due Date</label>
                <DatePicker
                  selected={editedTask?.due_date ? new Date(editedTask.due_date) : new Date()}
                  onChange={(date) => {
                    if (date) {
                      setEditedTask({ ...editedTask, due_date: date.toISOString().split('T')[0] });
                    }
                  }}
                  className="bg-gray-50 w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 text-gray-900"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select due date"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCloseEditModal}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-3xl p-6 w-96 shadow-lg transform ${isStatusModalOpen ? 'modal-enter' : 'modal-exit'}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Current Status</label>
                <p className="text-gray-900">{task.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">New Status</label>
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="bg-gray-50 w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 text-gray-900"
                >
                  <option value="todo" className="text-gray-900">To Do</option>
                  <option value="in-progress" className="text-gray-900">In Progress</option>
                  <option value="review" className="text-gray-900">Review</option>
                  <option value="completed" className="text-gray-900">Completed</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTaskStatus}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
