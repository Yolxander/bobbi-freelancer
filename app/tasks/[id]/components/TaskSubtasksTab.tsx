import { useState } from "react"
import {
  CheckSquare,
  Square,
  Plus,
  Pencil,
  Trash,
  Save,
  X,
  GripVertical,
} from "lucide-react"

interface TaskSubtasksTabProps {
  subtasks: any[]
  onAddSubtask: (e: React.FormEvent) => void
  onToggleSubtask: (subtaskId: string, completed: boolean) => void
  onEditSubtask: (subtaskId: string, currentTitle: string) => void
  onSaveSubtaskEdit: (subtaskId: string) => void
  onDeleteSubtask: (subtaskId: string) => void
  onDragStart: (e: React.DragEvent, subtask: any) => void
  onDragOver: (e: React.DragEvent, subtask: any) => void
  onDragEnd: () => void
  draggedSubtask: any
  dragOverSubtask: string | null
}

export default function TaskSubtasksTab({
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onEditSubtask,
  onSaveSubtaskEdit,
  onDeleteSubtask,
  onDragStart,
  onDragOver,
  onDragEnd,
  draggedSubtask,
  dragOverSubtask,
}: TaskSubtasksTabProps) {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [newSubtask, setNewSubtask] = useState("")
  const [editingSubtaskId, setEditingSubtaskId] = useState(null)
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState("")
  const [cursorPosition, setCursorPosition] = useState(null)

  return (
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
                onAddSubtask(e)
              }
            }}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={onAddSubtask}
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
              onDragStart={(e) => onDragStart(e, subtask)}
              onDragOver={(e) => onDragOver(e, subtask)}
              onDragEnd={onDragEnd}
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
                onClick={() => onToggleSubtask(subtask.id, subtask.completed)}
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
                        onSaveSubtaskEdit(subtask.id)
                      } else if (e.key === "Escape") {
                        setEditingSubtaskId(null)
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSaveSubtaskEdit(subtask.id)}
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
                    onClick={() => onEditSubtask(subtask.id, subtask.title)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit subtask"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteSubtask(subtask.id)}
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
  )
} 