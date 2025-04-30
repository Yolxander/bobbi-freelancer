'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import Sidebar from "@/components/sidebar"
import { FileUp, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"

// Dummy data interfaces
interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  description: string
}

interface Deliverable {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed'
  dueDate: string
  description: string
  tasks: Task[]
  projectId: string
  projectName: string
  clientName: string
}

// Dummy data
const mockDeliverables: Deliverable[] = [
  {
    id: '1',
    name: 'Website Design',
    status: 'in_progress',
    dueDate: '2024-04-15',
    description: 'Complete website design with responsive layout',
    projectId: 'p1',
    projectName: 'E-commerce Platform',
    clientName: 'Acme Corp',
    tasks: [
      {
        id: 't1',
        title: 'Create wireframes',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-03-20',
        description: 'Design initial wireframes for all pages'
      },
      {
        id: 't2',
        title: 'Design UI components',
        status: 'in_progress',
        priority: 'medium',
        dueDate: '2024-03-25',
        description: 'Create reusable UI components'
      }
    ]
  },
  {
    id: '2',
    name: 'Mobile App Development',
    status: 'pending',
    dueDate: '2024-05-01',
    description: 'Develop cross-platform mobile application',
    projectId: 'p2',
    projectName: 'Fitness Tracker',
    clientName: 'FitLife Inc',
    tasks: [
      {
        id: 't3',
        title: 'Set up development environment',
        status: 'todo',
        priority: 'high',
        dueDate: '2024-04-10',
        description: 'Configure React Native and necessary tools'
      },
      {
        id: 't4',
        title: 'Design database schema',
        status: 'todo',
        priority: 'medium',
        dueDate: '2024-04-15',
        description: 'Create database structure for user data'
      }
    ]
  }
]

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(mockDeliverables)
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filteredDeliverables = deliverables.filter(deliverable => {
    const projectMatch = selectedProject === 'all' || deliverable.projectId === selectedProject
    const statusMatch = selectedStatus === 'all' || deliverable.status === selectedStatus
    return projectMatch && statusMatch
  })

  const uniqueProjects = Array.from(new Set(deliverables.map(d => d.projectId)))
    .map(id => deliverables.find(d => d.projectId === id))
    .filter(Boolean) as Deliverable[]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileUp className="w-6 h-6 text-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deliverables</h1>
                <p className="text-gray-500 mt-1">Track and manage your project deliverables</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
                <FileUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{filteredDeliverables.length} items</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="all">All Projects</option>
                {uniqueProjects.map(project => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Deliverables Grid */}
          <div className="grid gap-6">
            {filteredDeliverables.map(deliverable => (
              <div key={deliverable.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                {/* Deliverable Header */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{deliverable.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{deliverable.projectName} • {deliverable.clientName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deliverable.status)}
                      <span className={`text-sm font-medium ${
                        deliverable.status === 'completed' ? 'text-green-600' :
                        deliverable.status === 'in_progress' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {deliverable.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3">{deliverable.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due {format(new Date(deliverable.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{deliverable.tasks.filter(t => t.status === 'completed').length} of {deliverable.tasks.length} tasks completed</span>
                    </div>
                  </div>
                </div>

                {/* Tasks Section */}
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tasks</h3>
                  <div className="space-y-3">
                    {deliverable.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                            <p className="text-xs text-gray-500">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            Due {format(new Date(task.dueDate), 'MMM d')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
