"use client"

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
  Check,
  Edit2,
  Trash2,
} from "lucide-react"
import { createSubtask, updateSubtask, toggleSubtaskCompletion, deleteSubtask } from "@/app/actions/subtask-actions"
import { toast } from "sonner"

interface TaskSubtasksTabProps {
  taskId: string
  subtasks: Array<{
    id: string
    title: string
    completed: boolean
  }>
  onSubtasksChange: (subtasks: Array<{ id: string; title: string; completed: boolean }>) => void
}

export default function TaskSubtasksTab({ taskId, subtasks, onSubtasksChange }: TaskSubtasksTabProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return

    try {
      const result = await createSubtask({
        title: newSubtaskTitle.trim(),
        task_id: taskId,
        completed: false,
      })

      if (result.success && result.data) {
        onSubtasksChange([...subtasks, result.data])
        setNewSubtaskTitle("")
        setIsAddingSubtask(false)
        toast.success("Subtask added successfully")
      } else {
        toast.error(result.error || "Failed to add subtask")
      }
    } catch (error) {
      console.error("Error adding subtask:", error)
      toast.error("An error occurred while adding the subtask")
    }
  }

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      const result = await toggleSubtaskCompletion(subtaskId, !completed)

      if (result.success) {
        const updatedSubtasks = subtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, completed: !completed } : subtask
        )
        onSubtasksChange(updatedSubtasks)
        toast.success("Subtask status updated")
      } else {
        toast.error(result.error || "Failed to update subtask status")
      }
    } catch (error) {
      console.error("Error toggling subtask:", error)
      toast.error("An error occurred while updating the subtask")
    }
  }

  const handleEditSubtask = (subtaskId: string, currentTitle: string) => {
    setEditingSubtaskId(subtaskId)
    setEditingTitle(currentTitle)
  }

  const handleSaveEdit = async (subtaskId: string) => {
    if (!editingTitle.trim()) return

    try {
      const result = await updateSubtask(subtaskId, { title: editingTitle.trim() })

      if (result.success) {
        const updatedSubtasks = subtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, title: editingTitle.trim() } : subtask
        )
        onSubtasksChange(updatedSubtasks)
        setEditingSubtaskId(null)
        setEditingTitle("")
        toast.success("Subtask updated successfully")
      } else {
        toast.error(result.error || "Failed to update subtask")
      }
    } catch (error) {
      console.error("Error saving subtask:", error)
      toast.error("An error occurred while saving the subtask")
    }
  }

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      const result = await deleteSubtask(subtaskId)

      if (result.success) {
        const updatedSubtasks = subtasks.filter((subtask) => subtask.id !== subtaskId)
        onSubtasksChange(updatedSubtasks)
        toast.success("Subtask deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete subtask")
      }
    } catch (error) {
      console.error("Error deleting subtask:", error)
      toast.error("An error occurred while deleting the subtask")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Subtasks</h3>
        <button
          onClick={() => setIsAddingSubtask(true)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Subtask
        </button>
      </div>

      {isAddingSubtask && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleAddSubtask)}
            placeholder="Enter subtask title..."
            className="bg-50-gray flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleAddSubtask}
            className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setIsAddingSubtask(false)
              setNewSubtaskTitle("")
            }}
            className="rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {subtasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">No subtasks yet. Add one to get started!</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
            >
              <button
                className="cursor-grab text-gray-400 hover:text-gray-600"
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleToggleSubtask(subtask.id, subtask.completed)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {editingSubtaskId === subtask.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(subtask.id))}
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(subtask.id)}
                    className="rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingSubtaskId(null)
                      setEditingTitle("")
                    }}
                    className="rounded-md bg-gray-200 p-1 text-gray-700 hover:bg-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 text-sm ${
                      subtask.completed ? "text-gray-500 line-through" : "text-gray-900"
                    }`}
                  >
                    {subtask.title}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditSubtask(subtask.id, subtask.title)}
                      className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 