"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProviderDashboard from "@/smart-home-dashboard"
import { useAuth } from "@/lib/auth-context"

// Dummy data for the dashboard
const DUMMY_CLIENTS = [
  {
    id: "client-1",
    name: "Acme Inc",
    email: "contact@acme.com",
    phone: "555-123-4567",
    description: "E-commerce website project",
    provider_id: "provider-1",
    projects: 2,
    isActive: true,
  },
  {
    id: "client-2",
    name: "TechStart",
    email: "info@techstart.com",
    phone: "555-987-6543",
    description: "Mobile app development",
    provider_id: "provider-1",
    projects: 1,
    isActive: false,
  },
  {
    id: "client-3",
    name: "Global Solutions",
    email: "hello@globalsolutions.com",
    phone: "555-456-7890",
    description: "Enterprise software integration",
    provider_id: "provider-1",
    projects: 3,
    isActive: true,
  },
]

const DUMMY_PROJECTS = [
  {
    id: "project-1",
    name: "Website Redesign",
    description: "Complete overhaul of company website with new branding",
    status: "In Progress",
    client_id: "client-1",
    provider_id: "provider-1",
    color: "bg-blue-100",
    start_date: "2023-01-15",
    due_date: "2023-03-30",
    client: "Acme Inc",
  },
  {
    id: "project-2",
    name: "Mobile App Development",
    description: "iOS and Android app for customer engagement",
    status: "Review",
    client_id: "client-2",
    provider_id: "provider-1",
    color: "bg-green-100",
    start_date: "2023-02-01",
    due_date: "2023-05-15",
    client: "TechStart",
  },
  {
    id: "project-3",
    name: "E-commerce Integration",
    description: "Integrate payment gateway and inventory management",
    status: "Completed",
    client_id: "client-1",
    provider_id: "provider-1",
    color: "bg-purple-100",
    start_date: "2022-11-10",
    due_date: "2023-01-20",
    client: "Acme Inc",
  },
  {
    id: "project-4",
    name: "CRM Implementation",
    description: "Custom CRM solution for sales team",
    status: "In Progress",
    client_id: "client-3",
    provider_id: "provider-1",
    color: "bg-amber-100",
    start_date: "2023-03-01",
    due_date: "2023-06-30",
    client: "Global Solutions",
  },
]

const DUMMY_TASKS = [
  {
    id: "task-1",
    title: "Design Homepage Mockup",
    description: "Create wireframes and visual design for the homepage",
    status: "todo",
    priority: "high",
    category: "design",
    due_date: "2023-02-15",
    project_id: "project-1",
    provider_id: "provider-1",
    completed: false,
    project: "Website Redesign",
    client: "Acme Inc",
  },
  {
    id: "task-2",
    title: "Implement User Authentication",
    description: "Set up secure login and registration system",
    status: "in-progress",
    priority: "medium",
    category: "development",
    due_date: "2023-02-28",
    project_id: "project-1",
    provider_id: "provider-1",
    completed: false,
    project: "Website Redesign",
    client: "Acme Inc",
  },
  {
    id: "task-3",
    title: "API Integration",
    description: "Connect mobile app to backend services",
    status: "completed",
    priority: "high",
    category: "development",
    due_date: "2023-03-10",
    project_id: "project-2",
    provider_id: "provider-1",
    completed: true,
    project: "Mobile App Development",
    client: "TechStart",
  },
  {
    id: "task-4",
    title: "Database Schema Design",
    description: "Design efficient database structure for CRM",
    status: "todo",
    priority: "high",
    category: "planning",
    due_date: "2023-03-20",
    project_id: "project-4",
    provider_id: "provider-1",
    completed: false,
    project: "CRM Implementation",
    client: "Global Solutions",
  },
  {
    id: "task-5",
    title: "Payment Gateway Integration",
    description: "Implement Stripe and PayPal payment options",
    status: "completed",
    priority: "high",
    category: "development",
    due_date: "2023-01-05",
    project_id: "project-3",
    provider_id: "provider-1",
    completed: true,
    project: "E-commerce Integration",
    client: "Acme Inc",
  },
]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState(DUMMY_PROJECTS)
  const [clients, setClients] = useState(DUMMY_CLIENTS)
  const [tasks, setTasks] = useState(DUMMY_TASKS)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  // Simulate loading for a more realistic experience
  useEffect(() => {
    if (user) {
      setDataLoading(true)
      setTimeout(() => {
        setDataLoading(false)
      }, 800)
    }
  }, [user])

  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return (
    <div>
      <ProviderDashboard
        initialProjects={projects}
        initialClients={clients}
        initialTasks={tasks}
        userId={user?.id || "provider-1"}
      />
    </div>
  )
}
