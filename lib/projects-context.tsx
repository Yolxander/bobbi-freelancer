'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Project {
  id: string
  name: string
  client_id: string
  description?: string
  status?: 'active' | 'completed' | 'on_hold'
  created_at?: string
  updated_at?: string
}

interface ProjectsContextType {
  projects: Project[]
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  deleteProject: (id: string) => void
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])

  const addProject = (project: Project) => {
    setProjects([...projects, project])
  }

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ))
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id))
  }

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
} 