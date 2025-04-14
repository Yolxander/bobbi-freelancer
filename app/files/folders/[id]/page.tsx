"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  File,
  FileCode,
  FileText,
  Filter,
  Folder,
  GridIcon,
  ImageIcon,
  ListFilter,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Star,
  Trash2,
  Edit,
  X,
  AlertCircle,
} from "lucide-react"
import Sidebar from "../../../../components/sidebar"
import UploadModal from "../../../components/UploadModal"
import { useAuth } from "@/lib/auth-context"
import { updateFolder, deleteFolder, getFolder, getFolderFiles, type FolderData, type FileData } from "@/app/actions/folder-actions"

interface FolderOption {
  id: number
  name: string
}

export default function FolderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const folderId = params.id as string
  const { user } = useAuth()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [folderDescription, setFolderDescription] = useState("")
  const [folderColor, setFolderColor] = useState("bg-blue-100")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [folder, setFolder] = useState<FolderData | null>(null)
  const [files, setFiles] = useState<FileData[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const folderDropdownRef = useRef<HTMLDivElement>(null)

  const colorOptions = [
    { name: "Blue", value: "bg-blue-100" },
    { name: "Green", value: "bg-green-100" },
    { name: "Purple", value: "bg-purple-100" },
    { name: "Yellow", value: "bg-yellow-100" },
    { name: "Red", value: "bg-red-100" },
    { name: "Pink", value: "bg-pink-100" },
  ]

  // Fetch folder data and files
  useEffect(() => {
    const fetchFolderData = async () => {
      if (!user || !user.providerId) {
        setError("You must be logged in to view this folder")
        setIsInitialLoading(false)
        return
      }

      try {
        setIsInitialLoading(true)
        setError("")

        // Fetch folder details
        const folderData = await getFolder(folderId)
        setFolder(folderData)
        
        // Set form values
        setFolderName(folderData.name)
        setFolderDescription(folderData.description || "")
        setFolderColor(folderData.color || "bg-blue-100")

        // Fetch folder files
        const folderFiles = await getFolderFiles(folderId)
        setFiles(folderFiles)
      } catch (error) {
        console.error("Error fetching folder data:", error)
        setError("Failed to load folder data. Please try again.")
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchFolderData()
  }, [folderId, user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (folderDropdownRef.current && !folderDropdownRef.current.contains(event.target as Node)) {
        setIsFolderDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleEditFolder = async () => {
    if (!user || !user.providerId) {
      setError("You must be logged in to edit a folder")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await updateFolder(folderId, {
        name: folderName,
        description: folderDescription,
        color: folderColor,
        provider_id: user.providerId,
      })

      // Refresh folder data
      const updatedFolder = await getFolder(folderId)
      setFolder(updatedFolder)
      
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating folder:", error)
      setError("Failed to update folder. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFolder = async () => {
    if (!user || !user.providerId) {
      setError("You must be logged in to delete a folder")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await deleteFolder(folderId)
      router.push("/files")
    } catch (error) {
      console.error("Error deleting folder:", error)
      setError("Failed to delete folder. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <File className="w-6 h-6 text-red-500" />
      case "image":
      case "png":
      case "jpg":
      case "jpeg":
        return <ImageIcon className="w-6 h-6 text-purple-500" />
      case "pptx":
      case "ppt":
        return <FileText className="w-6 h-6 text-orange-500" />
      case "docx":
      case "doc":
        return <FileText className="w-6 h-6 text-blue-500" />
      case "sketch":
        return <FileCode className="w-6 h-6 text-yellow-500" />
      case "xlsx":
      case "xls":
        return <FileText className="w-6 h-6 text-green-500" />
      case "zip":
      case "rar":
        return <File className="w-6 h-6 text-gray-600" />
      default:
        return <File className="w-6 h-6 text-gray-500" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-700"
      case "image":
      case "png":
      case "jpg":
      case "jpeg":
        return "bg-purple-100 text-purple-700"
      case "pptx":
      case "ppt":
        return "bg-orange-100 text-orange-700"
      case "docx":
      case "doc":
        return "bg-blue-100 text-blue-700"
      case "sketch":
        return "bg-yellow-100 text-yellow-700"
      case "xlsx":
      case "xls":
        return "bg-green-100 text-green-700"
      case "zip":
      case "rar":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Format date to be more user-friendly
  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently"
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Recently"
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    // Less than a minute ago
    if (diffInSeconds < 60) return "Just now"
    
    // Less than an hour ago
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    
    // Less than a day ago
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }
    
    // Less than a week ago
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }
    
    // Format as date
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const [viewMode, setViewMode] = useState("grid")
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({})

  const setButtonRef = (id: number) => (el: HTMLButtonElement | null) => {
    buttonRefs.current[id] = el
  }

  const toggleDropdown = (fileId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === fileId ? null : fileId)
  }

  // Handle file actions
  const handleFileAction = (action: string, fileId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(`Action: ${action} on file ID: ${fileId}`)
    // Close dropdown after action
    setActiveDropdown(null)

    // Here you would implement the actual functionality
    // For example:
    // if (action === 'delete') {
    //   deleteFile(fileId)
    // }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on the button that opened the dropdown
      const clickedButton = Object.entries(buttonRefs.current).find(
        ([id, ref]) => ref && ref.contains(event.target as Node),
      )

      if (clickedButton) {
        return
      }

      // Close if clicking outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Loading State */}
          {isInitialLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Link
                    href="/files"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{folder?.name}</h1>
                    <p className="text-sm text-gray-500">{folder?.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search files..."
                      className="w-64 bg-white rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    className={`p-2 rounded-full ${isFilterOpen ? "bg-gray-200" : "hover:bg-gray-100"} transition-colors shadow-sm`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="flex border border-gray-200 rounded-lg shadow-sm">
                    <button
                      className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "bg-white"} transition-colors`}
                      onClick={() => setViewMode("grid")}
                    >
                      <GridIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <button
                      className={`p-2 ${viewMode === "list" ? "bg-white" : "bg-gray-100"} transition-colors`}
                      onClick={() => setViewMode("list")}
                    >
                      <ListFilter className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="relative" ref={folderDropdownRef}>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => setIsFolderDropdownOpen(!isFolderDropdownOpen)}
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                    {isFolderDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => {
                            setIsEditModalOpen(true)
                            setIsFolderDropdownOpen(false)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                          Edit Folder
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => {
                            setIsDeleteModalOpen(true)
                            setIsFolderDropdownOpen(false)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Folder
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Upload</span>
                  </button>
                </div>
              </div>

              {/* Files Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Files</h2>
                  {files.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Folder className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No files in this folder</h3>
                      <p className="text-gray-500 mb-6">Upload files to get started</p>
                      <button
                        className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-5 py-2 hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                        onClick={() => setIsUploadModalOpen(true)}
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Upload Files</span>
                      </button>
                    </div>
                  ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {files.map((file: FileData) => (
                        <div key={file.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                                {getFileIcon(file.type)}
                              </div>
                              <div>
                                <h3 className="font-medium text-lg text-gray-900">{file.name}</h3>
                                <p className="text-sm text-gray-500">{file.size}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500">Modified {formatDate(file.modified)}</div>
                              <div className="flex items-center gap-2">
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                  <Download className="w-4 h-4 text-gray-700" />
                                </button>
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                  <Share2 className="w-4 h-4 text-gray-700" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Size</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Modified</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {files.map((file: FileData) => (
                            <tr key={file.id} className="border-b border-gray-200 last:border-0">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    {getFileIcon(file.type)}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{file.name}</div>
                                    <div className="text-sm text-gray-500">{file.type.toUpperCase()}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-500">{file.size}</td>
                              <td className="py-3 px-4 text-sm text-gray-500">{formatDate(file.modified)}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button className="p-1 rounded-full hover:bg-gray-100">
                                    <Download className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <button className="p-1 rounded-full hover:bg-gray-100">
                                    <Share2 className="w-4 h-4 text-gray-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        folders={[
          { id: parseInt(folderId), name: folder?.name || "" },
        ]}
      />

      {/* Edit Folder Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Edit Folder</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name
              </label>
              <input
                id="folder-name"
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="text-gray-900 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Enter folder name"
                disabled={isLoading}
              />
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
                disabled={isLoading}
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
                    onClick={(e) => {
                      e.stopPropagation()
                      setFolderColor(color.value)
                    }}
                    disabled={isLoading}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
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
                onClick={() => setIsEditModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                onClick={handleEditFolder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Folder className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Folder Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Delete Folder</h2>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
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
                onClick={() => setIsDeleteModalOpen(false)}
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
      )}
    </div>
  )
} 