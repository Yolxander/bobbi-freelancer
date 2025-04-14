"use client"

import { useState, useRef } from "react"
import { X, Upload, Folder, File, Check, Plus, ChevronDown } from "lucide-react"
import { createFile } from "@/app/actions/file-actions"
import { useAuth } from "@/lib/auth-context"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  folders: { id: number; name: string }[]
}

export default function UploadModal({ isOpen, onClose, folders }: UploadModalProps) {
  const { user } = useAuth()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [customFolders, setCustomFolders] = useState<{ id: number; name: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const newFolderInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !selectedFolder || !user?.providerId) return

    setUploading(true)
    setError(null)
    
    try {
      // Create FormData for each file
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder_id', selectedFolder.toString())
        formData.append('provider_id', user.providerId)
        
        // Upload the file
        const result = await createFile(selectedFolder.toString(), formData)
        
        if (!result.success) {
          throw new Error(result.error || "Failed to upload file")
        }
      }
      
      setUploadComplete(true)
      
      // Reset after showing completion
      setTimeout(() => {
        setUploadComplete(false)
        setSelectedFiles([])
        setSelectedFolder(null)
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error uploading files:", error)
      setError(error instanceof Error ? error.message : "Failed to upload files")
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") return
    
    const newFolder = {
      id: Date.now(), // Use timestamp as a unique ID
      name: newFolderName.trim()
    }
    
    setCustomFolders([...customFolders, newFolder])
    setSelectedFolder(newFolder.id)
    setNewFolderName("")
    setShowNewFolderInput(false)
  }

  const allFolders = [...folders, ...customFolders]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upload Files</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {!uploadComplete ? (
            <>
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <X className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {/* Folder Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Folder
                  </label>
                  <button
                    onClick={() => {
                      setShowNewFolderInput(!showNewFolderInput)
                      if (!showNewFolderInput) {
                        setTimeout(() => {
                          newFolderInputRef.current?.focus()
                        }, 100)
                      }
                    }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Folder</span>
                  </button>
                </div>
                
                {showNewFolderInput && (
                  <div className="mb-3 flex items-center gap-2">
                    <input
                      ref={newFolderInputRef}
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      className="bg-gray-50 text-gray-700 flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateFolder()
                        } else if (e.key === 'Escape') {
                          setShowNewFolderInput(false)
                          setNewFolderName("")
                        }
                      }}
                    />
                    <button
                      onClick={handleCreateFolder}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowNewFolderInput(false)
                        setNewFolderName("")
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  {allFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        selectedFolder === folder.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Folder className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{folder.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* File Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-blue-500" />
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {selectedFiles.length > 0 
                      ? `${selectedFiles.length} file(s) selected` 
                      : "Drag and drop files here"}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    {selectedFiles.length > 0 
                      ? "Click the upload button to continue" 
                      : "or click to browse files"}
                  </p>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Browse Files
                  </button>
                </div>
              </div>
              
              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Upload Complete</h3>
              <p className="text-sm text-gray-500 text-center">
                Your files have been successfully uploaded to the selected folder.
              </p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading || !selectedFolder}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                selectedFiles.length === 0 || uploading || !selectedFolder
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 