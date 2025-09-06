"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Users, Calendar, Target, Eye, Edit, MoreHorizontal, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Project {
  project_id: number
  name: string
  description: string
  created_by: number
  created_at: string
  members?: Array<{
    user_id: number
    name: string
    role: string
  }>
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  })
  const router = useRouter()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await apiClient.getProjects()
      setProjects(response.data.projects)
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      await apiClient.createProject(newProject)
      setNewProject({ name: "", description: "" })
      setIsCreateDialogOpen(false)
      await loadProjects() // Reload projects
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to create project")
    } finally {
      setIsCreating(false)
    }
  }

  const handleViewProject = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  const activeProjects = projects.length
  const completedProjects = 0 // This would come from project status in real implementation
  const totalMembers = projects.reduce((acc, project) => acc + (project.members?.length || 1), 0)

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-orange-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-mono">LOADING PROJECTS...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-2 break-words">PROJECT MANAGEMENT</h1>
          <p className="text-neutral-400 text-sm md:text-base">Manage and track all active research projects</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black font-mono flex-shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-900 border-orange-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-orange-500 font-mono">CREATE NEW PROJECT</DialogTitle>
              <DialogDescription className="text-neutral-400">
                Create a new project to start collaborating with your team
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-orange-500 font-mono">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                  className="bg-neutral-800 border-orange-500/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription" className="text-orange-500 font-mono">
                  Description
                </Label>
                <Textarea
                  id="projectDescription"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                  className="bg-neutral-800 border-orange-500/30 text-white min-h-[100px]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-mono"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="text-red-400 text-sm font-mono bg-red-900/20 p-3 rounded border border-red-500/30">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-neutral-400 truncate">Total Projects</p>
                <p className="text-xl md:text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <Target className="w-6 h-6 md:w-8 md:h-8 text-orange-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-neutral-400 truncate">Active</p>
                <p className="text-xl md:text-2xl font-bold text-green-400">{activeProjects}</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-neutral-400 truncate">Completed</p>
                <p className="text-xl md:text-2xl font-bold text-blue-400">{completedProjects}</p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-neutral-400 truncate">Team Members</p>
                <p className="text-xl md:text-2xl font-bold text-white">{totalMembers}</p>
              </div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-orange-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {projects.length === 0 ? (
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-mono text-neutral-400 mb-2">No Projects Found</h3>
            <p className="text-neutral-500 mb-4">Create your first project to get started with team collaboration</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-black font-mono"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project) => (
            <Card
              key={project.project_id}
              className="bg-neutral-800 border-neutral-700 hover:border-orange-500/50 transition-colors"
            >
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <CardTitle className="text-white text-base md:text-lg break-words flex-1">
                        {project.name}
                      </CardTitle>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex-shrink-0">Active</Badge>
                    </div>
                    <CardDescription className="text-neutral-400 text-sm mb-2 break-words">
                      {project.description}
                    </CardDescription>
                    <p className="text-xs text-orange-500 break-words">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white flex-shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-neutral-800 border-neutral-700">
                      <DropdownMenuItem
                        className="text-neutral-300 hover:text-white hover:bg-neutral-700"
                        onClick={() => handleViewProject(project.project_id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-neutral-300 hover:text-white hover:bg-neutral-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6 pt-0">
                {/* Team & Created Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-neutral-700">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    <span className="text-sm text-neutral-400 truncate">
                      {project.members?.length || 1} member{(project.members?.length || 1) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    <span className="text-sm text-neutral-400 truncate">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
