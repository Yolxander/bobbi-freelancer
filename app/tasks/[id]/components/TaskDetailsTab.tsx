import { useState } from "react"
import Link from "next/link"
import {
  CheckSquare,
  Square,
  Plus,
  Pencil,
  CheckCircle,
  Trash,
  Server,
  GitPullRequest,
  Briefcase,
  Calendar,
  Circle,
  AlertCircle,
} from "lucide-react"

interface TaskDetailsTabProps {
  task: any
  subtasks: any[]
  projects: any[]
  isWebDeveloper: boolean
  githubRepo: any
  onEditTask: () => void
  onUpdateStatus: () => void
  onToggleTaskCompletion: () => void
  onDeleteTask: () => void
  onAddSubtask: (e: React.FormEvent) => void
  onToggleSubtask: (subtaskId: string, completed: boolean) => void
  setActiveTab: (tab: string) => void
}

export default function TaskDetailsTab({
  task,
  subtasks,
  projects,
  isWebDeveloper,
  githubRepo,
  onEditTask,
  onUpdateStatus,
  onToggleTaskCompletion,
  onDeleteTask,
  onAddSubtask,
  onToggleSubtask,
  setActiveTab,
}: TaskDetailsTabProps) {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [newSubtask, setNewSubtask] = useState("")
  const [cursorPosition, setCursorPosition] = useState(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Task Description */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
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
                <button onClick={() => onToggleSubtask(subtask.id, subtask.completed)} className="mr-3">
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
                className="bg-50-gray w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-900 text-gray-900 min-h-[80px] resize-y"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    onAddSubtask(e)
                  }
                }}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={onAddSubtask}
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
        <div className="bg-white rounded-xl p-6 shadow-sm">
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
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`transition-colors rounded-xl p-3 text-sm font-medium flex flex-col items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900`}
              onClick={onEditTask}
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
              onClick={onUpdateStatus}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Update Status</span>
            </button>

            <button
              className={`transition-colors rounded-xl p-3 text-sm font-medium flex flex-col items-center gap-2 ${
                task.completed ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-green-100 hover:bg-green-200 text-green-700"
              }`}
              onClick={onToggleTaskCompletion}
            >
              <CheckSquare className="w-5 h-5" />
              <span>{task.completed ? "Mark Incomplete" : "Mark Complete"}</span>
            </button>

            <button
              className={`transition-colors rounded-xl p-3 text-sm font-medium flex flex-col items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900`}
              onClick={onDeleteTask}
            >
              <Trash className="w-5 h-5 text-gray-700" />
              <span>Delete Task</span>
            </button>
          </div>
        </div>

        {/* Developer Actions - Only show if provider is a web developer */}
        {isWebDeveloper && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
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
  )
} 