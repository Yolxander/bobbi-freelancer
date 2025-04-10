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
} from "lucide-react"
import Link from "next/link"
import Sidebar from "./components/sidebar"

export default function FilesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  const fileCategories = [
    { id: "all", name: "All Files", count: 43 },
    { id: "shared", name: "Shared with Me", count: 15 },
    { id: "recent", name: "Recent", count: 8 },
    { id: "starred", name: "Starred", count: 5 },
    { id: "trash", name: "Trash", count: 2 },
  ]

  const folders = [
    { id: 1, name: "Website Projects", files: 12, color: "bg-blue-100" },
    { id: 2, name: "Brand Assets", files: 8, color: "bg-green-100" },
    { id: 3, name: "Client Presentations", files: 6, color: "bg-purple-100" },
    { id: 4, name: "Contracts & Agreements", files: 4, color: "bg-yellow-100" },
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

  const getFileIcon = (type) => {
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
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Files</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-64 bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Filter className="w-5 h-5 text-gray-500" />
              </button>
              <button className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Upload</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {fileCategories.map((category) => (
                <button
                  key={category.id}
                  className={`text-sm font-medium pb-2 border-b-2 ${
                    activeTab === category.id
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(category.id)}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-100"}`}
                onClick={() => setViewMode("grid")}
              >
                <GridIcon className="w-5 h-5 text-gray-500" />
              </button>
              <button
                className={`p-2 rounded ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-100"}`}
                onClick={() => setViewMode("list")}
              >
                <ListFilter className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Folders Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${folder.color} rounded-lg flex items-center justify-center`}>
                      <Folder className="w-5 h-5 text-gray-700" />
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <h3 className="font-medium mb-1">{folder.name}</h3>
                  <p className="text-sm text-gray-500">{folder.files} files</p>
                </div>
              ))}

              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <Plus className="w-5 h-5 text-gray-500" />
                </div>
                <h3 className="font-medium mb-1">Create New Folder</h3>
                <p className="text-sm text-gray-500">Organize your files</p>
              </div>
            </div>
          </div>

          {/* Recent Files Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Files</h2>
              <button className="text-sm text-gray-500 hover:text-gray-700">View All</button>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex items-center">
                        {file.starred && (
                          <button className="p-1 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </button>
                        )}
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-medium mb-1 truncate">{file.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{file.size}</p>
                      <p className="text-xs text-gray-500">{file.modified}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {file.client.charAt(0)}
                        </div>
                        <p className="text-xs text-gray-500 ml-1">{file.client}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {file.shared && <Share2 className="w-3 h-3 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">{file.name}</span>
                              {file.starred && <Star className="w-4 h-4 ml-2 fill-yellow-400 text-yellow-400" />}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-2">
                              {file.client.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-500">{file.client}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" />
                            {file.modified}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{file.size}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1 rounded-full hover:bg-gray-100">
                              <Download className="w-4 h-4 text-gray-500" />
                            </button>
                            {file.shared && (
                              <button className="p-1 rounded-full hover:bg-gray-100">
                                <Share2 className="w-4 h-4 text-gray-500" />
                              </button>
                            )}
                            <button className="p-1 rounded-full hover:bg-gray-100">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
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
  )
}

function Logo() {
  return (
    <Link href="/">
      <div className="flex flex-col cursor-pointer">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-black rounded-sm"></div>
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-5 h-5 bg-black rounded-sm"></div>
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
      </div>
    </Link>
  )
}
