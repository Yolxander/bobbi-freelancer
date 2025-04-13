import { ArrowLeft, CheckSquare, Square, Trash } from "lucide-react"
import Link from "next/link"

interface TaskHeaderProps {
  task: any
  completionPercentage: number
  onToggleTaskCompletion: () => void
  onDeleteTask: () => void
}

export default function TaskHeader({ task, completionPercentage, onToggleTaskCompletion, onDeleteTask }: TaskHeaderProps) {
  return (
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
              onClick={onToggleTaskCompletion}
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
              onClick={onDeleteTask}
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
      </div>
    </div>
  )
} 