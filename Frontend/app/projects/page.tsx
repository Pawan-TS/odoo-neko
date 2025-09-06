"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Users, Calendar, Target, Eye, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProjectsPage() {
  const [projects] = useState([
    {
      id: 1,
      name: "Smart Energy Monitoring System",
      description: "IoT-based energy monitoring and optimization platform for campus buildings",
      status: "Active",
      progress: 75,
      team: ["Dr. Priya Sharma", "Aditya Patel", "Sarah Chen"],
      dueDate: "Dec 2025",
      department: "Electrical & Electronics Engineering",
      tasks: { total: 24, completed: 18, inProgress: 4, todo: 2 },
    },
    {
      id: 2,
      name: "AI-Powered Crop Analysis",
      description: "Machine learning system for agricultural crop health assessment and yield prediction",
      status: "Active",
      progress: 60,
      team: ["Dr. Rajesh Kumar", "Maya Singh", "Alex Johnson"],
      dueDate: "Jan 2026",
      department: "Artificial Intelligence & Data Science",
      tasks: { total: 32, completed: 19, inProgress: 8, todo: 5 },
    },
    {
      id: 3,
      name: "Autonomous Delivery Robot",
      description: "Self-navigating delivery system for campus logistics and transportation",
      status: "Active",
      progress: 45,
      team: ["Dr. Michael Brown", "Lisa Wang", "David Kim"],
      dueDate: "Mar 2026",
      department: "Mechanical Engineering",
      tasks: { total: 28, completed: 12, inProgress: 10, todo: 6 },
    },
    {
      id: 4,
      name: "Sustainable Construction Materials",
      description: "Research and development of eco-friendly building materials from recycled waste",
      status: "Completed",
      progress: 100,
      team: ["Dr. Emily Davis", "John Smith", "Anna Rodriguez"],
      dueDate: "Nov 2025",
      department: "Civil Engineering",
      tasks: { total: 20, completed: 20, inProgress: 0, todo: 0 },
    },
    {
      id: 5,
      name: "Renewable Energy Storage Solutions",
      description: "Advanced battery technology for efficient renewable energy storage systems",
      status: "Pending",
      progress: 15,
      team: ["Dr. James Wilson", "Sophie Turner", "Mark Thompson"],
      dueDate: "Jun 2026",
      department: "Electrical & Electronics Engineering",
      tasks: { total: 35, completed: 5, inProgress: 3, todo: 27 },
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">PROJECT MANAGEMENT</h1>
          <p className="text-neutral-400">Manage and track all active research projects</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Active</p>
                <p className="text-2xl font-bold text-green-400">
                  {projects.filter((p) => p.status === "Active").length}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Completed</p>
                <p className="text-2xl font-bold text-blue-400">
                  {projects.filter((p) => p.status === "Completed").length}
                </p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Team Members</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="bg-neutral-800 border-neutral-700 hover:border-orange-500/50 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                  <CardDescription className="text-neutral-400 text-sm mb-2">{project.description}</CardDescription>
                  <p className="text-xs text-orange-500">{project.department}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-neutral-800 border-neutral-700">
                    <DropdownMenuItem className="text-neutral-300 hover:text-white hover:bg-neutral-700">
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
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Progress</span>
                  <span className="text-sm text-white font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Task Summary */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-white font-medium">{project.tasks.total}</div>
                  <div className="text-neutral-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-medium">{project.tasks.completed}</div>
                  <div className="text-neutral-500">Done</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-medium">{project.tasks.inProgress}</div>
                  <div className="text-neutral-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-neutral-400 font-medium">{project.tasks.todo}</div>
                  <div className="text-neutral-500">Todo</div>
                </div>
              </div>

              {/* Team & Due Date */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">{project.team.length} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">{project.dueDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
