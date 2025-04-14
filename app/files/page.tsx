"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import UploadModal from "../components/UploadModal"

interface Folder {
  id: number
  name: string
  files: Array<{
    id: number
    name: string
    type: string
    size: string
    modified: string
  }>
  color: string
  created: string
}

export default function FilesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fileCategories = [
    { id: "all", name: "All Files", count: 43 },
    { id: "shared", name: "Shared with Me", count: 15 },
    { id: "recent", name: "Recent", count: 8 },
    { id: "starred", name: "Starred", count: 5 },
    { id: "trash", name: "Trash", count: 2 },
  ]

  const folders = [
    { 
      id: 1, 
      name: "Website Projects", 
      files: [
        { id: 1, name: "Homepage.sketch", type: "sketch", size: "2.4 MB", modified: "Today, 2:30 PM" },
        { id: 2, name: "About.sketch", type: "sketch", size: "1.8 MB", modified: "Today, 1:45 PM" }
      ],
      color: "bg-blue-100",
      created: "Today, 2:30 PM"
    },
    { 
      id: 2, 
      name: "Brand Assets", 
      files: [
        { id: 3, name: "Logo.png", type: "image", size: "1.2 MB", modified: "Yesterday" },
        { id: 4, name: "Brand Guide.pdf", type: "pdf", size: "4.7 MB", modified: "Yesterday" }
      ],
      color: "bg-green-100",
      created: "Yesterday"
    },
    { 
      id: 3, 
      name: "Client Presentations", 
      files: [
        { id: 5, name: "Q1 Review.pptx", type: "pptx", size: "1.2 MB", modified: "Mar 20, 2023" }
      ],
      color: "bg-purple-100",
      created: "Mar 20, 2023"
    },
    { 
      id: 4, 
      name: "Contracts & Agreements", 
      files: [
        { id: 6, name: "Service Agreement.pdf", type: "pdf", size: "3.8 MB", modified: "Mar 18, 2023" }
      ],
      color: "bg-yellow-100",
      created: "Mar 18, 2023"
    }
  ]

  const recentFiles = [
    {
      id: 1,
      name: "Website Mockup v2.pdf",
      type: "pdf",
      size: "2.4 MB",
      modified: "Today, 2:30 PM",
      client: "Acme Inc.",
      shared: true,
      starred: true,
    },
    {
      id: 2,
      name: "Logo Options.zip",
      type: "zip",
      size: "4.7 MB",
      modified: "Yesterday",
      client: "GreenGrow",
      shared: true,
      starred: false,
    },
    {
      id: 3,
      name: "Project Timeline.xlsx",
      type: "xlsx",
      size: "1.2 MB",
      modified: "Mar 20, 2023",
      client: "TechStart",
      shared: false,
      starred: false,
    },
    {
      id: 4,
      name: "Homepage Design.png",
      type: "image",
      size: "3.8 MB",
      modified: "Mar 18, 2023",
      client: "Acme Inc.",
      shared: true,
      starred: true,
    },
    {
      id: 5,
      name: "Contract Draft.docx",
      type: "docx",
      size: "0.9 MB",
      modified: "Mar 15, 2023",
      client: "BlueSky Media",
      shared: false,
      starred: false,
    },
    {
      id: 6,
      name: "Social Media Assets.zip",
      type: "zip",
      size: "8.2 MB",
      modified: "Mar 12, 2023",
      client: "BlueSky Media",
      shared: true,
      starred: false,
    },
    {
      id: 7,
      name: "App Wireframes.sketch",
      type: "sketch",
      size: "5.1 MB",
      modified: "Mar 10, 2023",
      client: "TechStart",
      shared: false,
      starred: true,
    },
    {
      id: 8,
      name: "Meeting Notes.pdf",
      type: "pdf",
      size: "0.5 MB",
      modified: "Mar 8, 2023",
      client: "GreenGrow",
      shared: true,
      starred: false,
    },
  ]

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
                  className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "bg-white"} transition-colors`}
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

          {/* Folders Section */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Folders</h2>
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {folders.map((folder) => (
                <Link href={`/files/folders/${folder.id}`} key={folder.id}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 ${folder.color} rounded-lg flex items-center justify-center shadow-sm`}>
                          <Folder className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg text-gray-900">{folder.name}</h3>
                          <p className="text-sm text-gray-500">{folder.files.length} files</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Created {folder.created}</div>
                        <div className="text-sm text-gray-500">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

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
    </div>
  )
}
