"use client"

import { useState, useEffect } from "react"
import {
  Star,
  Search,
  Folder,
  File,
  MoreHorizontal,
  Download,
  Share2,
  Plus,
  Filter,
  FileText,
  ImageIcon,
  FileCode,
  FileIcon as FilePdf,
  Clock,
  GridIcon,
  ListFilter,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import UploadModal from "../components/UploadModal"
import CreateFolderModal from "../components/CreateFolderModal"
import { useAuth } from "@/lib/auth-context"
import { getFolders } from "@/app/actions/folder-actions"
import { getAllProviderFiles } from "@/app/actions/file-actions"

interface Folder {
  id: number
  name: string
  files?: Array<{
    id: number
    name: string
    type: string
    size: string
    modified: string
  }>
  color: string
  created: string
  created_at?: string
}

export default function FilesPage() {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [folders, setFolders] = useState<Folder[]>([])
  const [allFiles, setAllFiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fileCategories = [
    { id: "all", name: "All Files", count: 43 },
    { id: "shared", name: "Shared with Me", count: 15 },
    { id: "recent", name: "Recent", count: 8 },
    { id: "starred", name: "Starred", count: 5 },
    { id: "trash", name: "Trash", count: 2 },
  ]

  // Fetch folders when the component mounts or when the user changes
  useEffect(() => {
    const fetchFolders = async () => {
      if (user && user.providerId) {
        setIsLoading(true)
        setError(null)
        
        try {
          const data = await getFolders(user.providerId)
          setFolders(data)
        } catch (err) {
          console.error("Error fetching folders:", err)
          setError("Failed to load folders. Please try again later.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchFolders()
  }, [user])

  // Fetch all files for the user's provider ID
  useEffect(() => {
    const fetchFiles = async () => {
      if (user && user.providerId) {
        setIsLoading(true)
        setError(null)
        
        try {
          const response = await getAllProviderFiles(user.providerId)
          if (response.success) {
            setAllFiles(response.data)
            // console.log("All files:", response.data)
          } else {
            throw new Error("Failed to fetch files")
          }
        } catch (err) {
          console.error("Error fetching files:", err)
          setError("Failed to load files. Please try again later.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchFiles()
  }, [user])

  // Replace the hardcoded recentFiles with the actual files from the API
  const recentFiles = allFiles.slice(0, 8).map(file => ({
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.size,
    modified: file.modified,
    client: "Client", // This might need to be updated based on your data structure
    shared: false, // This might need to be updated based on your data structure
    starred: false, // This might need to be updated based on your data structure
  }))

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="w-6 h-6 text-red-500" />
      case "image":
        return <ImageIcon className="w-6 h-6 text-purple-500" />
      case "xlsx":
        return <FileText className="w-6 h-6 text-green-500" />
      case "docx":
        return <FileText className="w-6 h-6 text-blue-500" />
      case "sketch":
        return <FileCode className="w-6 h-6 text-orange-500" />
      case "zip":
        return <File className="w-6 h-6 text-gray-500" />
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Files</h1>
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
                  aria-label="Grid view"
                >
                  <GridIcon className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  className={`p-2 ${viewMode === "list" ? "bg-white" : "bg-gray-100"} transition-colors`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <ListFilter className="w-5 h-5 text-gray-500" />
                </button>
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

          {/* Filter dropdown */}
          {isFilterOpen && (
            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    File Type
                  </label>
                  <select
                    id="type-filter"
                    className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                  >
                    <option value="">All Types</option>
                    <option value="document">Documents</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                    onClick={() => {
                      setSearchQuery("")
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 shadow-sm">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="mb-10 flex justify-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Folders Section */}
          {!isLoading && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Folders</h2>
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {/* Create New Folder Card */}
                <div
                  className={`
                    bg-white border border-dashed border-gray-200 rounded-xl p-6 
                    flex flex-col items-center justify-center text-center 
                    hover:bg-gray-50 transition-colors cursor-pointer shadow-sm hover:shadow-md
                    ${viewMode === "grid" ? "h-full" : "py-8"}
                  `}
                  onClick={() => setIsCreateFolderModalOpen(true)}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                    <Plus className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Create New Folder</h3>
                  <p className="text-sm text-gray-500">Organize your files in a new folder</p>
                </div>

                {/* Existing Folders */}
                {folders.length > 0 ? (
                  folders.map((folder) => (
                    <Link href={`/files/folders/${folder.id}`} key={folder.id}>
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 ${folder.color} rounded-lg flex items-center justify-center shadow-sm`}>
                              <Folder className="w-6 h-6 text-gray-700" />
                            </div>
                            <div>
                              <h3 className="font-medium text-lg text-gray-900">{folder.name}</h3>
                              <p className="text-sm text-gray-500">{folder.files?.length || 0} files</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">Created {formatDate(folder.created_at || "")}</div>
                            <div className="text-sm text-gray-500">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Folder className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No folders found</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first folder</p>
                    <button
                      className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-5 py-2 hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                      onClick={() => setIsCreateFolderModalOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Create Folder</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Files Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Files</h2>
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {recentFiles.map((file) => (
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
                      <div className="text-xs text-gray-500">Modified {file.modified}</div>
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
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        folders={folders.map(folder => ({ id: folder.id, name: folder.name }))}
      />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
      />
    </div>
  )
}
