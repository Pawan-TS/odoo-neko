"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Loader2, UserPlus } from "lucide-react"
import { apiClient } from "@/lib/api"

interface ProjectDetails {
  project_id: number
  name: string
  description: string
  created_by: number
  created_at: string
  members: Array<{
    user_id: number
    name: string
    role: string
  }>
}

interface Task {
  task_id: number
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
  due_date?: string
  created_at: string
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.id)

  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    user_id: "",
    role: "member",
  })
  const [isAddingMember, setIsAddingMember] = useState(false)

  useEffect(() => {
    if (projectId) {
      loadProjectDetails()
      loadProjectTasks()
    }
  }, [projectId])

  const loadProjectDetails = async () => {
    try {
      const response = await apiClient.getProject(projectId)
      setProject(response.data.project)
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to load project details")
    } finally {
      setIsLoading(false)
    }
  }

  const loadProjectTasks = async () => {
    try {
      const response = await apiClient.getProjectTasks(projectId)
      setTasks(response.data.tasks)
    } catch (err: any) {
      console.error("Failed to load tasks:", err)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingMember(true)

    try {
      await apiClient.addProjectMember(projectId, {
        user_id: Number(newMember.user_id),
        role: newMember.role,
      })
      setNewMember({ user_id: "", role: "member" })
      setIsAddMemberDialogOpen(false)
      await loadProjectDetails() // Reload project details
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to add member")
    } finally {
      setIsAddingMember(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "done":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do"
      case "in_progress":
        return "In Progress"
      case "done":
        return "Done"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-orange-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-mono">LOADING PROJECT...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-mono text-red-400 mb-2">PROJECT NOT FOUND</h2>
            <p className="text-neutral-400 mb-4">The requested project could not be found.</p>
            <Button
              onClick={() => router.push("/projects")}
              className="bg-orange-500 hover:bg-orange-600 text-black font-mono"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/projects")}
          className="text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-1">{project.name}</h1>
          <p className="text-neutral-400">{project.description}</p>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm font-mono bg-red-900/20 p-3 rounded border border-red-500/30">{error}</div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-neutral-900 border-orange-500/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
            Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
            Members ({project.members.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{tasks.length}</div>
                  <div className="text-sm text-neutral-400">Total Tasks</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {tasks.filter((t) => t.status === "done").length}
                  </div>
                  <div className="text-sm text-neutral-400">Completed</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{project.members.length}</div>
                  <div className="text-sm text-neutral-400">Team Members</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-orange-500 font-mono">PROJECT DETAILS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-orange-500 font-mono">Description</Label>
                <p className="text-white mt-1">{project.description}</p>
              </div>
              <div>
                <Label className="text-orange-500 font-mono">Created</Label>
                <p className="text-white mt-1">{new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-mono text-orange-500">PROJECT TASKS</h3>
            <Button
              onClick={() => router.push(`/tasks?project=${projectId}`)}
              className="bg-orange-500 hover:bg-orange-600 text-black font-mono"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-mono text-neutral-400 mb-2">No Tasks Found</h3>
                <p className="text-neutral-500 mb-4">Create your first task to get started</p>
                <Button
                  onClick={() => router.push(`/tasks?project=${projectId}`)}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-mono"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.task_id} className="bg-neutral-800 border-neutral-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{task.title}</h4>
                        <p className="text-neutral-400 text-sm mb-2">{task.description}</p>
                        {task.due_date && (
                          <p className="text-xs text-orange-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(task.status)}>{getStatusLabel(task.status)}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-mono text-orange-500">TEAM MEMBERS</h3>
            <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black font-mono">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-neutral-900 border-orange-500/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-orange-500 font-mono">ADD TEAM MEMBER</DialogTitle>
                  <DialogDescription className="text-neutral-400">Add a new member to this project</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-orange-500 font-mono">
                      User ID
                    </Label>
                    <Input
                      id="userId"
                      type="number"
                      value={newMember.user_id}
                      onChange={(e) => setNewMember({ ...newMember, user_id: e.target.value })}
                      placeholder="Enter user ID"
                      className="bg-neutral-800 border-orange-500/30 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-orange-500 font-mono">
                      Role
                    </Label>
                    <Select
                      value={newMember.role}
                      onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                    >
                      <SelectTrigger className="bg-neutral-800 border-orange-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-orange-500/30">
                        <SelectItem value="member" className="text-white">
                          Member
                        </SelectItem>
                        <SelectItem value="admin" className="text-white">
                          Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddMemberDialogOpen(false)}
                      className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isAddingMember}
                      className="bg-orange-500 hover:bg-orange-600 text-black font-mono"
                    >
                      {isAddingMember ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Member"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.members.map((member) => (
              <Card key={member.user_id} className="bg-neutral-800 border-neutral-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-black font-mono font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{member.name}</h4>
                      <p className="text-neutral-400 text-sm capitalize">{member.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
