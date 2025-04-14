"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
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
} from "lucide-react"
import Sidebar from "../../../../components/sidebar"
import UploadModal from "../../../components/UploadModal"

interface FileType {
  id: number
  name: string
  type: string
  size: string
  modified: string
  starred: boolean
}

interface FolderType {
  id: number
  name: string
  color: string
  description: string
  created: string
  files: FileType[]
}

interface FolderData {
  [key: string]: FolderType
}

interface FolderOption {
  id: number
  name: string
}

export default function FolderDetailsPage() {
  const params = useParams()
  const folderId = params.id as string
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Dummy folder data based on ID
  const folderData: FolderData = {
    1: {
      id: 1,
      name: "Website Projects",
      color: "bg-blue-100",
      description: "All website design and development projects",
      created: "Mar 15, 2023",
      files: [
        {
          id: 101,
          name: "Homepage Redesign.sketch",
          type: "sketch",
          size: "4.2 MB",
          modified: "Today, 11:30 AM",
          starred: true,
        },
        {
          id: 102,
          name: "Color Palette.pdf",
          type: "pdf",
          size: "1.8 MB",
          modified: "Yesterday, 3:45 PM",
          starred: false,
        },
        {
          id: 103,
          name: "Wireframes.png",
          type: "image",
          size: "2.7 MB",
          modified: "Mar 20, 2023",
          starred: false,
        },
        {
          id: 104,
          name: "Client Feedback.docx",
          type: "docx",
          size: "0.5 MB",
          modified: "Mar 18, 2023",
          starred: true,
        },
      ],
    },
    2: {
      id: 2,
      name: "Brand Assets",
      color: "bg-green-100",
      description: "Logo files and brand guidelines",
      created: "Feb 28, 2023",
      files: [
        {
          id: 201,
          name: "Logo - Dark.png",
          type: "image",
          size: "1.2 MB",
          modified: "Mar 10, 2023",
          starred: true,
        },
        {
          id: 202,
          name: "Logo - Light.png",
          type: "image",
          size: "1.1 MB",
          modified: "Mar 10, 2023",
          starred: true,
        },
        {
          id: 203,
          name: "Brand Guidelines.pdf",
          type: "pdf",
          size: "3.5 MB",
          modified: "Mar 5, 2023",
          starred: false,
        },
      ],
    },
    3: {
      id: 3,
      name: "Client Presentations",
      color: "bg-purple-100",
      description: "Presentation files for client meetings",
      created: "Jan 15, 2023",
      files: [
        {
          id: 301,
          name: "Q1 Progress Report.pptx",
          type: "pptx",
          size: "5.8 MB",
          modified: "Mar 15, 2023",
          starred: false,
        },
        {
          id: 302,
          name: "Project Proposal.pdf",
          type: "pdf",
          size: "2.3 MB",
          modified: "Feb 28, 2023",
          starred: true,
        },
      ],
    },
    4: {
      id: 4,
      name: "Contracts & Agreements",
      color: "bg-yellow-100",
      description: "Legal documents and contracts",
      created: "Dec 10, 2022",
      files: [
        {
          id: 401,
          name: "Service Agreement.pdf",
          type: "pdf",
          size: "1.5 MB",
          modified: "Mar 1, 2023",
          starred: true,
        },
        {
          id: 402,
          name: "NDA.docx",
          type: "docx",
          size: "0.7 MB",
          modified: "Feb 15, 2023",
          starred: false,
        },
        {
          id: 403,
          name: "Terms of Service.pdf",
          type: "pdf",
          size: "0.9 MB",
          modified: "Jan 20, 2023",
          starred: false,
        },
      ],
    },
  }

  const folder = folderData[folderId] || {
    id: parseInt(folderId),
    name: `Folder ${folderId}`,
    color: "bg-gray-100",
    description: "Folder description",
    created: "Unknown date",
    files: [],
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
          {/* Header */}
          <div className="mb-6">
            <Link href="/files" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Files</span>
            </Link>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${folder.color} rounded-xl flex items-center justify-center`}>
                    <Folder className="w-8 h-8 text-gray-700" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{folder.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-600">
                        Created {folder.created} • {folder.files.length} files
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search in folder..."
                      className="w-64 bg-white rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100 shadow-sm">
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
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Files Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Files</h2>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {folder.files.map((file) => (
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
                      {folder.files.map((file) => (
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
                          <td className="py-3 px-4 text-sm text-gray-500">{file.modified}</td>
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
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        folders={[
          { id: parseInt(folderId), name: folder.name },
        ]}
      />
    </div>
  )
} 