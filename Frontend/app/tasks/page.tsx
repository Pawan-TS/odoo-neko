"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Calendar, User, CheckSquare, Clock, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TasksPage() {
  const [tasks] = useState([
    {
      id: 1,
      title: "Design IoT sensor network architecture",
      description: "Create comprehensive architecture for campus-wide energy monitoring sensors",
      status: "In Progress",
      priority: "High",
      assignee: "Aditya Patel",
      project: "Smart Energy Monitoring System",
      dueDate: "2025-09-15",
      createdDate: "2025-08-20",
    },
    {
      id: 2,
      title: "Implement machine learning model",
      description: "Develop and train crop health assessment ML algorithms",
      status: "To-Do",
      priority: "High",
      assignee: "Maya Singh",
      project: "AI-Powered Crop Analysis",
      dueDate: "2025-09-20",
      createdDate: "2025-08-25",
    },
    {
      id: 3,
      title: "Test autonomous navigation system",
      description: "Conduct field tests for robot navigation in various campus environments",
      status: "In Progress",
      priority: "Medium",
      assignee: "David Kim",
      project: "Autonomous Delivery Robot",
      dueDate: "2025-09-18",
      createdDate: "2025-08-15",
    },
    {
      id: 4,
      title: "Prepare final project documentation",
      description: "Compile comprehensive project report and technical documentation",
      status: "Done",
      priority: "Medium",
      assignee: "Anna Rodriguez",
      project: "Sustainable Construction Materials",
      dueDate: "2025-08-30",
      createdDate: "2025-08-10",
    },
    {
      id: 5,
      title: "Research battery chemistry options",
      description: "Investigate advanced battery technologies for energy storage applications",
      status: "To-Do",
      priority: "Low",
      assignee: "Sophie Turner",
      project: "Renewable Energy Storage Solutions",
      dueDate: "2025-10-01",
      createdDate: "2025-08-28",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "To-Do":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckSquare className="w-4 h-4 text-green-400" />
      case "In Progress":
        return <Clock className="w-4 h-4 text-yellow-400" />
      case "To-Do":
        return <AlertTriangle className="w-4 h-4 text-blue-400" />
      default:
        return <CheckSquare className="w-4 h-4 text-neutral-400" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">TASK MANAGEMENT</h1>
          <p className="text-neutral-400">Track and manage all project tasks</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{tasks.length}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {tasks.filter((t) => t.status === "In Progress").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Completed</p>
                <p className="text-2xl font-bold text-green-400">{tasks.filter((t) => t.status === "Done").length}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">To-Do</p>
                <p className="text-2xl font-bold text-blue-400">{tasks.filter((t) => t.status === "To-Do").length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
          />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-48 bg-neutral-800 border-neutral-700 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To-Do</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-48 bg-neutral-800 border-neutral-700 text-white">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700">
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="bg-neutral-800 border-neutral-700 hover:border-orange-500/50 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-1">{task.title}</CardTitle>
                    <CardDescription className="text-neutral-400 text-sm mb-2">{task.description}</CardDescription>
                    <p className="text-xs text-orange-500">{task.project}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-300">{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-300">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-neutral-500 text-xs">
                  Created: {new Date(task.createdDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
