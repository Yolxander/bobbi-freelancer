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
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center mb-6">
            <Link href="/files" className="mr-4">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div className={`w-10 h-10 ${folder.color} rounded-lg flex items-center justify-center mr-3`}>
              <Folder className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{folder.name}</h1>
              <p className="text-sm text-gray-700">
                Created {folder.created} • {folder.files.length} files
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in folder..."
                  className="w-64 bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none text-gray-700"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Filter className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Upload</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">{folder.description}</p>
            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "hover:bg-gray-100 text-gray-700"}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "hover:bg-gray-100 text-gray-700"}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <ListFilter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {folder.files.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {folder.files.map((file: FileType) => (
                  <div
                    key={file.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow relative"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-12 h-12 ${getFileTypeColor(file.type).split(" ")[0]} rounded-lg flex items-center justify-center`}
                      >
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex items-center">
                        {file.starred && (
                          <button className="p-1 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </button>
                        )}
                        <button
                          ref={(el) => setButtonRef(file.id)(el)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={(e) => toggleDropdown(file.id, e)}
                          aria-label="More options"
                          aria-expanded={activeDropdown === file.id}
                          aria-haspopup="true"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-700" />
                        </button>
                        {activeDropdown === file.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-4 top-8 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              onClick={(e) => handleFileAction("download", file.id, e)}
                            >
                              <Download className="w-4 h-4" /> Download
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              onClick={(e) => handleFileAction("share", file.id, e)}
                            >
                              <Share2 className="w-4 h-4" /> Share
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              onClick={(e) => handleFileAction(file.starred ? "unstar" : "star", file.id, e)}
                            >
                              <Star className="w-4 h-4" /> {file.starred ? "Unfavorite" : "Favorite"}
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                              onClick={(e) => handleFileAction("delete", file.id, e)}
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-medium mb-1 truncate text-gray-900">{file.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getFileTypeColor(file.type)}`}>
                        {file.type.toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-700">{file.size}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-700">{file.modified}</p>
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
                ))}
              </div>
            ) : (
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider w-1/2">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Modified
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {folder.files.map((file: FileType) => (
                      <tr key={file.id} className="hover:bg-gray-50 relative">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 ${getFileTypeColor(file.type).split(" ")[0]} rounded-lg flex items-center justify-center mr-3`}
                            >
                              {getFileIcon(file.type)}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900">{file.name}</span>
                                {file.starred && <Star className="w-4 h-4 ml-2 fill-yellow-400 text-yellow-400" />}
                              </div>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${getFileTypeColor(file.type)} inline-block mt-1 w-fit`}
                              >
                                {file.type.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{file.size}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{file.modified}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1 rounded-full hover:bg-gray-100">
                              <Download className="w-4 h-4 text-gray-700" />
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-100">
                              <Share2 className="w-4 h-4 text-gray-700" />
                            </button>
                            <button
                              ref={(el) => setButtonRef(file.id)(el)}
                              className="p-1 rounded-full hover:bg-gray-100"
                              onClick={(e) => toggleDropdown(file.id, e)}
                              aria-label="More options"
                              aria-expanded={activeDropdown === file.id}
                              aria-haspopup="true"
                            >
                              <MoreHorizontal className="w-4 h-4 text-gray-700" />
                            </button>
                            {activeDropdown === file.id && (
                              <div
                                ref={dropdownRef}
                                className="absolute right-4 top-12 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  onClick={(e) => handleFileAction("download", file.id, e)}
                                >
                                  <Download className="w-4 h-4" /> Download
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  onClick={(e) => handleFileAction("share", file.id, e)}
                                >
                                  <Share2 className="w-4 h-4" /> Share
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  onClick={(e) => handleFileAction(file.starred ? "unstar" : "star", file.id, e)}
                                >
                                  <Star className="w-4 h-4" /> {file.starred ? "Unfavorite" : "Favorite"}
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  onClick={(e) => handleFileAction("rename", file.id, e)}
                                >
                                  <Edit className="w-4 h-4" /> Rename
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                  onClick={(e) => handleFileAction("delete", file.id, e)}
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Folder className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">This folder is empty</h3>
              <p className="text-gray-700 mb-6 max-w-md">
                Upload files to this folder or create new content to get started.
              </p>
              <button 
                className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Files</span>
              </button>
            </div>
          )}
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