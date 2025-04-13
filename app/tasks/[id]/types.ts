export interface TaskData {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string
  project_id: string
  project_name: string
  project_color: string
  project: Project | undefined
  completed: boolean
  tech_stack: string[]
  component_name: string
  category: string
  github_repo: {
    owner: string
    repo: string
    fullName: string
  }
  code_snippet: string
  created_at: string
  updated_at: string
  provider_id: string
  subtasks: Subtask[]
}

export interface Subtask {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  completed: boolean
  task_id: string
  provider_id: string
  created_at: string
  updated_at: string
}

export interface Issue {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved'
  fix?: string
  code_snippet?: string
  task_id: string
  provider_id: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'archived'
  client?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'developer' | 'manager'
  created_at: string
  updated_at: string
}
