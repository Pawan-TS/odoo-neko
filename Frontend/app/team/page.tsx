"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Plus, Search, Mail, Phone, MapPin, Calendar, Target } from "lucide-react"

export default function TeamPage() {
  const [teamMembers] = useState([
    {
      id: 1,
      name: "Dr. Priya Sharma",
      role: "Project Lead",
      department: "Electrical & Electronics Engineering",
      email: "priya.sharma@university.edu",
      phone: "+1 (555) 123-4567",
      location: "Engineering Block A",
      joinDate: "2023-01-15",
      activeProjects: ["Smart Energy Monitoring System"],
      completedTasks: 45,
      activeTasks: 3,
      status: "Active",
    },
    {
      id: 2,
      name: "Aditya Patel",
      role: "Senior Researcher",
      department: "Electrical & Electronics Engineering",
      email: "aditya.patel@university.edu",
      phone: "+1 (555) 234-5678",
      location: "Engineering Block A",
      joinDate: "2023-03-20",
      activeProjects: ["Smart Energy Monitoring System"],
      completedTasks: 32,
      activeTasks: 5,
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Rajesh Kumar",
      role: "Project Lead",
      department: "Artificial Intelligence & Data Science",
      email: "rajesh.kumar@university.edu",
      phone: "+1 (555) 345-6789",
      location: "CS Block B",
      joinDate: "2022-09-10",
      activeProjects: ["AI-Powered Crop Analysis"],
      completedTasks: 67,
      activeTasks: 4,
      status: "Active",
    },
    {
      id: 4,
      name: "Maya Singh",
      role: "ML Engineer",
      department: "Artificial Intelligence & Data Science",
      email: "maya.singh@university.edu",
      phone: "+1 (555) 456-7890",
      location: "CS Block B",
      joinDate: "2023-06-01",
      activeProjects: ["AI-Powered Crop Analysis"],
      completedTasks: 28,
      activeTasks: 6,
      status: "Active",
    },
    {
      id: 5,
      name: "Dr. Michael Brown",
      role: "Project Lead",
      department: "Mechanical Engineering",
      email: "michael.brown@university.edu",
      phone: "+1 (555) 567-8901",
      location: "Mechanical Block C",
      joinDate: "2022-11-15",
      activeProjects: ["Autonomous Delivery Robot"],
      completedTasks: 52,
      activeTasks: 7,
      status: "Active",
    },
    {
      id: 6,
      name: "Dr. Emily Davis",
      role: "Project Lead",
      department: "Civil Engineering",
      email: "emily.davis@university.edu",
      phone: "+1 (555) 678-9012",
      location: "Civil Block D",
      joinDate: "2022-08-20",
      activeProjects: [],
      completedTasks: 89,
      activeTasks: 0,
      status: "Available",
    },
  ])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Project Lead":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "Senior Researcher":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "ML Engineer":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Available":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Busy":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">TEAM MEMBERS</h1>
          <p className="text-neutral-400">Manage project team members and assignments</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Total Members</p>
                <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{teamMembers.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Project Leads</p>
                <p className="text-2xl font-bold text-orange-400">
                  {teamMembers.filter((m) => m.role === "Project Lead").length}
                </p>
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
                  {teamMembers.filter((m) => m.status === "Active").length}
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
                <p className="text-sm text-neutral-400">Available</p>
                <p className="text-2xl font-bold text-blue-400">
                  {teamMembers.filter((m) => m.status === "Available").length}
                </p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
        <Input
          placeholder="Search team members..."
          className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
        />
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card
            key={member.id}
            className="bg-neutral-800 border-neutral-700 hover:border-orange-500/50 transition-colors"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 bg-orange-500">
                  <AvatarFallback className="bg-orange-500 text-white font-bold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-1">{member.name}</CardTitle>
                  <CardDescription className="text-neutral-400 text-sm mb-2">{member.department}</CardDescription>
                  <div className="flex gap-2">
                    <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                    <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-300">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-300">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-300">{member.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-300">Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Task Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-700">
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">{member.completedTasks}</div>
                  <div className="text-neutral-500 text-xs">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold text-lg">{member.activeTasks}</div>
                  <div className="text-neutral-500 text-xs">Active</div>
                </div>
              </div>

              {/* Active Projects */}
              {member.activeProjects.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-neutral-400 mb-2">Active Projects:</p>
                  {member.activeProjects.map((project, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-orange-400 border-orange-500/30 mr-1">
                      {project}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
