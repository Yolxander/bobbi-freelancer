"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  MessageSquare,
  FileUp,
  Calendar,
  CheckSquare,
  Folder,
  LogOut,
  User,
  Users,
  Menu,
  X,
  Settings,
  FileText,
  LayoutGrid,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import NotificationCenter from "./notification-center"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/ui/logo"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Determine active link based on current path
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth")
  }

  // Mobile menu toggle button
  const MobileMenuButton = () => (
    <button
      className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  )

  return (
    <>
      <MobileMenuButton />

      <div
        className={`
  ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"} 
  fixed md:static top-0 right-0 h-screen z-40
  w-[160px] flex flex-col items-center py-6 bg-white
  transition-transform duration-300 ease-in-out
`}
      >
        <div className="mb-12 mt-8 md:mt-0">
          <Link 
            href="/dashboard" 
            className="p-3 bg-gray-100 rounded-xl inline-block"
          >
            <div className="flex items-center">
              <Image
                src="/platform-logo.png"
                alt="Platform Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
          </Link>
        </div>

        <div className="flex flex-col items-start gap-10 mt-4 w-full px-4">
          {/* Work Management Group */}
          <div className="w-full">
            <div className="mb-2 px-3">
              <span className="text-xs font-medium text-gray-500">Work Management</span>
            </div>
            <div className="space-y-2 w-full">
              <Link 
                href="/dashboard"
                className={`p-3 ${isActive("/dashboard") ? "bg-gray-100" : "hover:bg-gray-100"} rounded-xl transition-colors w-full flex items-center gap-3`}
              >
                <LayoutGrid className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900">Dashboard</span>
              </Link>
              <Link 
                href="/proposals"
                className={`p-3 ${isActive("/proposals") ? "bg-gray-100" : "hover:bg-gray-100"} rounded-xl transition-colors w-full flex items-center gap-3`}
              >
                <FileText className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-900">Proposals</span>
              </Link>
              <Link 
                href="/deliverables"
                className={`p-3 ${isActive("/deliverables") ? "bg-gray-100" : "hover:bg-gray-100"} rounded-xl transition-colors w-full flex items-center gap-3`}
              >
                <FileUp className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-900">Deliveries</span>
              </Link>
              <Link 
                href="/projects"
                className={`p-3 ${isActive("/projects") ? "bg-gray-100" : "hover:bg-gray-100"} rounded-xl transition-colors w-full flex items-center gap-3`}
              >
                <Folder className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900">Projects</span>
              </Link>
              <Link 
                href="/tasks"
                className={`p-3 ${isActive("/tasks") ? "bg-gray-100" : "hover:bg-gray-100"} rounded-xl transition-colors w-full flex items-center gap-3`}
              >
                <CheckSquare className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-900">Tasks</span>
              </Link>
            </div>
          </div>

          {/* Communication Group */}
          <div className="w-full">
            <div className="mb-2 px-3">
              <span className="text-xs font-medium text-gray-500">Communication</span>
            </div>
            <div className="space-y-2 w-full">
              <Link href="/messaging">
                <button
                  className={`p-3 ${isActive("/messaging") ? "bg-gray-100" : "hover:bg-gray-100"} rounded-xl transition-colors w-full flex items-center gap-3`}
                >
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">Messages</span>
                </button>
              </Link>
              <Link href="/calendar">
                <button
                  className={`p-3 ${isActive("/calendar") ? "bg-gray-100" : "hover:bg-gray-100"} rounded-xl transition-colors w-full flex items-center gap-3`}
                >
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-gray-900">Calendar</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Resources Group */}
          <div className="w-full">
            <div className="mb-2 px-3">
              <span className="text-xs font-medium text-gray-500">Resources</span>
            </div>
            <div className="space-y-2 w-full">
              <Link href="/clients" passHref>
                <button
                  onClick={() => router.push("/clients")}
                  className={`p-3 ${isActive("/clients") ? "bg-gray-100" : "hover:bg-gray-100"} rounded-xl transition-colors w-full flex items-center gap-3`}
                >
                  <Users className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-900">Clients</span>
                </button>
              </Link>
              <Link href="/files">
                <button
                  className={`p-3 ${isActive("/files") ? "bg-gray-100" : "hover:bg-gray-100"} rounded-xl transition-colors w-full flex items-center gap-3`}
                >
                  <FileUp className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900">Files</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-auto w-full px-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-3 w-full hover:bg-gray-100 rounded-xl transition-colors mt-6">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate text-gray-900">My Account</p>
                  <p className="text-xs text-gray-500 truncate">Dashboard</p>
                </div>
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="w-full">
                  <NotificationCenter />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 px-4 py-2">
        <div className="flex justify-around">
          <Link href="/dashboard">
            <button className={`p-2 ${isActive("/dashboard") ? "text-blue-500" : "text-gray-500"}`}>
              <User className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/projects">
            <button className={`p-2 ${isActive("/projects") ? "text-blue-500" : "text-gray-500"}`}>
              <Folder className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/tasks">
            <button className={`p-2 ${isActive("/tasks") ? "text-blue-500" : "text-gray-500"}`}>
              <CheckSquare className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/clients" passHref>
            <button
              onClick={() => router.push("/clients")}
              className={`p-2 ${isActive("/clients") ? "text-blue-500" : "text-gray-500"}`}
            >
              <Users className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
