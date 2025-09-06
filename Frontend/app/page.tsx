"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Monitor,
  Settings,
  Users,
  Bell,
  RefreshCw,
  FolderOpen,
  CheckSquare,
  MessageSquare,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"
import CommandCenterPage from "./command-center/page"
import ProjectsPage from "./projects/page"
import TasksPage from "./tasks/page"
import TeamPage from "./team/page"
import SystemsPage from "./systems/page"

export default function ProjectManagementDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    team: 0,
    uptime: "99.5%",
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const authData = localStorage.getItem("synergysphere_auth")
      if (!authData) {
        router.push("/login")
        return
      }

      try {
        const parsed = JSON.parse(authData)
        if (!parsed.token) {
          router.push("/login")
          return
        }

        const response = await apiClient.getCurrentUser()
        if (response.status === "success" && response.data) {
          setUser(response.data)
          setIsAuthenticated(true)
          await loadDashboardStats()
        } else {
          localStorage.removeItem("synergysphere_auth")
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("synergysphere_auth")
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadDashboardStats = async () => {
    try {
      const [projectsResponse, usersResponse] = await Promise.all([
        apiClient.getProjects(),
        apiClient
          .getUsers()
          .catch(() => ({ data: { users: [] } })), // Non-admin users can't access this
      ])

      if (projectsResponse.status === "success" && projectsResponse.data) {
        const projects = projectsResponse.data.projects || []
        setStats((prev) => ({
          ...prev,
          projects: projects.length,
          team: usersResponse.data?.users?.length || 2, // Fallback to known users
        }))

        // Get tasks count from all projects
        let totalTasks = 0
        for (const project of projects) {
          try {
            const tasksResponse = await apiClient.getProjectTasks(project.project_id)
            if (tasksResponse.status === "success" && tasksResponse.data) {
              totalTasks += tasksResponse.data.tasks.length
            }
          } catch (error) {
            console.error(`Failed to load tasks for project ${project.project_id}:`, error)
          }
        }
        setStats((prev) => ({ ...prev, tasks: totalTasks }))
      }
    } catch (error) {
      console.error("Failed to load dashboard stats:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-500 font-mono">AUTHENTICATING...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem("synergysphere_auth")
    router.push("/login")
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:hidden bg-neutral-900 border-b border-neutral-700 p-3 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-orange-500 font-bold text-base sm:text-lg tracking-wider truncate">SYNERGYSPHERE</h1>
          <p className="text-neutral-500 text-xs truncate">v1.0 PROJECT MANAGEMENT</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-neutral-400 hover:text-orange-500 flex-shrink-0 ml-2"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-700 p-4">
          <nav className="space-y-2">
            {[
              { id: "overview", icon: Monitor, label: "DASHBOARD" },
              { id: "projects", icon: FolderOpen, label: "PROJECTS" },
              { id: "tasks", icon: CheckSquare, label: "TASKS" },
              { id: "team", icon: Users, label: "TEAM MEMBERS" },
              { id: "communication", icon: MessageSquare, label: "DISCUSSIONS" },
              { id: "systems", icon: Settings, label: "SETTINGS" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors text-left ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 p-4 bg-neutral-800 border border-neutral-700 rounded">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-xs text-white">SYSTEM ONLINE</span>
            </div>
            <div className="text-xs text-neutral-500 grid grid-cols-2 gap-2">
              <div className="truncate">UPTIME: {stats.uptime}</div>
              <div className="truncate">PROJECTS: {stats.projects}</div>
              <div className="truncate">TASKS: {stats.tasks}</div>
              <div className="truncate">TEAM: {stats.team}</div>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block w-64 lg:w-72 bg-neutral-900 border-r border-neutral-700 flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="min-w-0 flex-1">
              <h1 className="text-orange-500 font-bold text-lg tracking-wider truncate">SYNERGYSPHERE</h1>
              <p className="text-neutral-500 text-xs truncate">v1.0 PROJECT MANAGEMENT</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: "overview", icon: Monitor, label: "DASHBOARD" },
              { id: "projects", icon: FolderOpen, label: "PROJECTS" },
              { id: "tasks", icon: CheckSquare, label: "TASKS" },
              { id: "team", icon: Users, label: "TEAM MEMBERS" },
              { id: "communication", icon: MessageSquare, label: "DISCUSSIONS" },
              { id: "systems", icon: Settings, label: "SETTINGS" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors text-left ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-xs text-white">SYSTEM ONLINE</span>
            </div>
            <div className="text-xs text-neutral-500 space-y-1">
              <div className="flex justify-between">
                <span>UPTIME:</span>
                <span className="text-white font-mono">{stats.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span>PROJECTS:</span>
                <span className="text-white font-mono">{stats.projects} ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>TASKS:</span>
                <span className="text-white font-mono">{stats.tasks} IN PROGRESS</span>
              </div>
              <div className="flex justify-between">
                <span>TEAM:</span>
                <span className="text-white font-mono">{stats.team} MEMBERS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <div className="hidden md:flex h-16 bg-neutral-800 border-b border-neutral-700 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="text-sm text-neutral-400 truncate">
              SYNERGYSPHERE / <span className="text-orange-500">{activeSection.toUpperCase()}</span>
            </div>
            {user && (
              <div className="text-xs text-neutral-500 truncate">
                USER: <span className="text-orange-500">{user.name}</span> ({user.role.toUpperCase()})
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <div className="text-xs text-neutral-500 hidden lg:block">LAST UPDATE: {new Date().toLocaleString()}</div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-orange-500"
              onClick={loadDashboardStats}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-neutral-400 hover:text-orange-500 font-mono text-xs"
            >
              LOGOUT
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-0">
          {activeSection === "overview" && <CommandCenterPage />}
          {activeSection === "projects" && <ProjectsPage />}
          {activeSection === "tasks" && <TasksPage />}
          {activeSection === "team" && <TeamPage />}
          {activeSection === "communication" && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-orange-500 break-words">DISCUSSIONS</h2>
              <p className="text-neutral-400 mt-4">Project communication system coming soon...</p>
            </div>
          )}
          {activeSection === "systems" && <SystemsPage />}
        </div>
      </div>
    </div>
  )
}
