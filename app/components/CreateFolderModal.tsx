"use client"

import { useState, useRef, useEffect } from "react"
import { X, Folder, Check } from "lucide-react"
import { createFolder } from "@/app/actions/folder-actions"
import { useAuth } from "@/lib/auth-context"

interface CreateFolderModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
  const { user } = useAuth()
  const [folderName, setFolderName] = useState("")
  const [folderDescription, setFolderDescription] = useState("")
  const [folderColor, setFolderColor] = useState("bg-blue-100")
  const [creating, setCreating] = useState(false)
  const [createComplete, setCreateComplete] = useState(false)
  const [error, setError] = useState("")
  const folderNameInputRef = useRef<HTMLInputElement>(null)

  const colorOptions = [
    { name: "Blue", value: "bg-blue-100" },
    { name: "Green", value: "bg-green-100" },
    { name: "Purple", value: "bg-purple-100" },
    { name: "Yellow", value: "bg-yellow-100" },
    { name: "Red", value: "bg-red-100" },
    { name: "Pink", value: "bg-pink-100" },
  ]

  useEffect(() => {
    if (isOpen && folderNameInputRef.current) {
      folderNameInputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      setError("Folder name is required")
      return
    }

    if (!user || !user.providerId) {
      setError("You must be logged in to create a folder")
      return
    }

    setCreating(true)
    setError("")

    try {
      await createFolder({
        name: folderName,
        description: folderDescription,
        color: folderColor,
        provider_id: user.providerId,
      })

      setCreateComplete(true)
      
      // Reset after showing completion
      setTimeout(() => {
        setCreateComplete(false)
        setFolderName("")
        setFolderDescription("")
        setFolderColor("bg-blue-100")
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error creating folder:", error)
      setError("Failed to create folder. Please try again.")
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Folder</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={creating}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createComplete ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Folder Created!</h3>
            <p className="text-sm text-gray-500">Your new folder has been created successfully.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name
              </label>
              <input
                id="folder-name"
                ref={folderNameInputRef}
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="text-gray-900 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Enter folder name"
                disabled={creating}
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="folder-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="folder-description"
                value={folderDescription}
                onChange={(e) => setFolderDescription(e.target.value)}
                className="text-gray-900 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Enter folder description"
                rows={3}
                disabled={creating}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full ${color.value} ${
                      folderColor === color.value ? "ring-2 ring-offset-2 ring-gray-900" : ""
                    }`}
                    onClick={() => setFolderColor(color.value)}
                    disabled={creating}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={onClose}
                disabled={creating}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                onClick={handleCreateFolder}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Folder className="w-4 h-4" />
                    Create Folder
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 