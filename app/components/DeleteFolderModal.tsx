import { useState } from "react"
import { X, AlertCircle, Trash2 } from "lucide-react"
import { deleteFolder } from "@/app/actions/folder-actions"
import { useRouter } from "next/navigation"

interface DeleteFolderModalProps {
  isOpen: boolean
  onClose: () => void
  folder: any
}

export default function DeleteFolderModal({ isOpen, onClose, folder }: DeleteFolderModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteFolder = async () => {
    if (!folder) return

    setIsLoading(true)
    setError(null)

    try {
      await deleteFolder(folder.id)
      onClose()
      router.push("/files")
    } catch (err) {
      console.error("Error deleting folder:", err)
      setError("Failed to delete folder. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Delete Folder</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete this folder? This action cannot be undone.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            onClick={handleDeleteFolder}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Folder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 