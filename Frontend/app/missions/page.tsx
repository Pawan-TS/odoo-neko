"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Eye, Edit, Download, Calendar, MapPin, Users, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function MissionsPage() {
  const [selectedMission, setSelectedMission] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const missions = [
    {
      id: "energy-monitor",
      title: "Smart Energy Monitoring System",
      department: "Electrical & Electronics Engineering",
      status: "active",
      progress: 75,
      description:
        "A comprehensive real-time energy monitoring system that tracks consumption patterns across campus buildings, identifies efficiency opportunities, and helps reduce overall energy usage through smart automation.",
      leaders: ["Dr. Priya Sharma", "Aditya Patel"],
      location: "Main Campus - Engineering Block",
      timeline: "Jan 2025 - Dec 2025",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-06%20at%2011-36-39%20Nitte%20R%26D%20Club-persxHd5PZey3HZXJ26j2qBom23uI9.png",
    },
    {
      id: "crop-analysis",
      title: "AI-Powered Crop Analysis",
      department: "Artificial Intelligence & Data Science",
      status: "active",
      progress: 60,
      description:
        "Advanced machine learning system for crop health monitoring and yield prediction using satellite imagery and IoT sensors.",
      leaders: ["Dr. Sarah Chen", "Marcus Rodriguez"],
      location: "Research Lab Alpha",
      timeline: "Mar 2025 - Nov 2025",
    },
    {
      id: "delivery-robot",
      title: "Autonomous Delivery Robot",
      department: "Mechanical Engineering",
      status: "active",
      progress: 45,
      description:
        "Fully autonomous delivery system for campus-wide package and document distribution using advanced navigation algorithms.",
      leaders: ["Dr. James Wilson", "Elena Vasquez"],
      location: "Robotics Lab",
      timeline: "Feb 2025 - Oct 2025",
    },
    {
      id: "construction-materials",
      title: "Sustainable Construction Materials",
      department: "Civil Engineering",
      status: "completed",
      progress: 100,
      description:
        "Development of eco-friendly construction materials using recycled components and bio-based additives.",
      leaders: ["Dr. Michael Brown", "Lisa Zhang"],
      location: "Materials Lab",
      timeline: "Sep 2024 - Dec 2024",
    },
    {
      id: "energy-storage",
      title: "Renewable Energy Storage Solutions",
      department: "Electrical & Electronics Engineering",
      status: "pending",
      progress: 15,
      description: "Next-generation battery technology for efficient renewable energy storage and grid integration.",
      leaders: ["Dr. Anna Kowalski", "David Kim"],
      location: "Power Systems Lab",
      timeline: "May 2025 - Dec 2025",
    },
  ]

  const teamMembers = [
    { name: "Dr. Sumitha Manoj", role: "Mission Commander", initials: "DSM", type: "lead" },
    { name: "Arjun Kumar", role: "Field Operative", initials: "AK", type: "agent" },
    { name: "Priya Desai", role: "Intelligence Analyst", initials: "PD", type: "agent" },
    { name: "Nikhil Shah", role: "Systems Specialist", initials: "NS", type: "agent" },
  ]

  const reports = [
    { title: "Initial Mission Proposal", type: "Milestone", date: "Jan 15, 2025", size: "1.2 MB" },
    { title: "Q1 Progress Report", type: "Quarterly", date: "Mar 30, 2025", size: "3.4 MB" },
    { title: "System Architecture Documentation", type: "Milestone", date: "Apr 12, 2025", size: "5.7 MB" },
    { title: "Prototype Testing Results", type: "Milestone", date: "Jun 5, 2025", size: "8.1 MB" },
    { title: "Q2 Progress Report", type: "Quarterly", date: "Jun 30, 2025", size: "4.2 MB" },
    { title: "Mid-Year Mission Presentation", type: "Presentation", date: "Jul 15, 2025", size: "12.5 MB" },
  ]

  const milestones = [
    {
      title: "Mission Initiation",
      description: "Define mission scope, objectives, and requirements",
      status: "completed",
      date: "Jan 2025",
    },
    {
      title: "System Design",
      description: "Complete hardware and software architecture design",
      status: "completed",
      date: "Mar 2025",
    },
    {
      title: "Prototype Development",
      description: "Build and test initial sensor network and dashboard",
      status: "completed",
      date: "May 2025",
    },
    {
      title: "Campus Integration",
      description: "Install sensors across campus buildings and integrate with main system",
      status: "in-progress",
      date: "Jul 2025",
    },
    {
      title: "Data Analysis Platform",
      description: "Develop and implement machine learning algorithms for energy optimization",
      status: "pending",
      date: "Sep 2025",
    },
    {
      title: "Final Deployment & Documentation",
      description: "Complete system deployment and prepare final documentation",
      status: "pending",
      date: "Nov 2025",
    },
  ]

  if (selectedMission) {
    const mission = missions.find((m) => m.id === selectedMission)
    if (!mission) return null

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedMission(null)}
            className="text-neutral-400 hover:text-orange-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Missions
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Header */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
              {mission.image && (
                <div className="relative h-48 bg-neutral-800">
                  <img
                    src={mission.image || "/placeholder.svg"}
                    alt={mission.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`${
                        mission.status === "active"
                          ? "bg-green-500"
                          : mission.status === "completed"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                      } text-white`}
                    >
                      {mission.status === "active"
                        ? "ONGOING"
                        : mission.status === "completed"
                          ? "COMPLETED"
                          : "PENDING"}
                    </Badge>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-orange-500 border-orange-500">
                    {mission.department}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{mission.title}</h1>
                <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {mission.timeline}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {mission.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
              <div className="border-b border-neutral-700">
                <div className="flex">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "objectives", label: "Objectives" },
                    { id: "team", label: "Team" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-orange-500 text-orange-500"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <p className="text-neutral-300 leading-relaxed">{mission.description}</p>
                    <div>
                      <h3 className="text-white font-medium mb-2">Mission Leaders:</h3>
                      <p className="text-neutral-400">{mission.leaders.join(", ")}</p>
                    </div>
                  </div>
                )}
                {activeTab === "team" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-4">Mission Commander</h3>
                      <div className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg">
                        <Avatar className="w-12 h-12 bg-orange-500">
                          <AvatarFallback className="text-white font-medium">DSM</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">Dr. Sumitha Manoj</div>
                          <div className="text-neutral-400 text-sm">Principal Investigator</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Field Operatives
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teamMembers
                          .filter((m) => m.type === "agent")
                          .map((member) => (
                            <div
                              key={member.initials}
                              className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg"
                            >
                              <Avatar className="w-10 h-10 bg-neutral-600">
                                <AvatarFallback className="text-white text-sm">{member.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-white font-medium">{member.name}</div>
                                <div className="text-neutral-400 text-sm">{member.role}</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracking */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
              <h3 className="text-white font-medium mb-4">Progress Tracking</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-400">Mission Progress</span>
                    <span className="text-sm font-medium text-orange-500">{mission.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mission.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-3">Milestones</h4>
                  <div className="space-y-3">
                    {milestones.slice(0, 4).map((milestone, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            milestone.status === "completed"
                              ? "bg-green-500"
                              : milestone.status === "in-progress"
                                ? "bg-orange-500"
                                : "bg-neutral-600"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="text-sm text-white">{milestone.title}</div>
                          <div className="text-xs text-neutral-400">{milestone.description}</div>
                          <div className="text-xs text-neutral-500 mt-1">{milestone.date}</div>
                          {milestone.status === "completed" && (
                            <Badge className="bg-green-500 text-white text-xs mt-1">Completed</Badge>
                          )}
                          {milestone.status === "in-progress" && (
                            <Badge className="bg-orange-500 text-white text-xs mt-1">In Progress</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Reports */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Mission Reports
              </h3>
              <div className="space-y-3">
                {reports.slice(0, 4).map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-800 rounded">
                    <div className="flex-1">
                      <div className="text-sm text-white">{report.title}</div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            report.type === "Milestone"
                              ? "text-green-400 border-green-400"
                              : report.type === "Quarterly"
                                ? "text-blue-400 border-blue-400"
                                : "text-yellow-400 border-yellow-400"
                          }`}
                        >
                          {report.type}
                        </Badge>
                        <span>{report.date}</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-400 hover:text-orange-500">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-400 hover:text-orange-500">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Mission Control</h1>
          <p className="text-neutral-400">Welcome back, Dr. Aditya Sharma</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-neutral-400 hover:text-orange-500">
            <Users className="w-4 h-4 mr-2" />
            Manage Operatives
          </Button>
          <Button variant="ghost" className="text-neutral-400 hover:text-orange-500">
            <Activity className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Mission
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
          <h3 className="text-white font-medium mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start text-neutral-400 hover:text-orange-500">
              <Activity className="w-4 h-4 mr-2" />
              My Missions
            </Button>
            <Button variant="ghost" className="w-full justify-start text-neutral-400 hover:text-orange-500">
              <Edit className="w-4 h-4 mr-2" />
              Update Mission
            </Button>
            <Button variant="ghost" className="w-full justify-start text-neutral-400 hover:text-orange-500">
              <Plus className="w-4 h-4 mr-2" />
              Add New Mission
            </Button>
            <Button variant="ghost" className="w-full justify-start text-neutral-400 hover:text-orange-500">
              <Users className="w-4 h-4 mr-2" />
              Admin Settings
            </Button>
          </div>

          <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
            <h4 className="text-white font-medium mb-3">User Information</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-neutral-400">Name:</span>
                <div className="text-white">Dr. Aditya Sharma</div>
              </div>
              <div>
                <span className="text-neutral-400">Email:</span>
                <div className="text-white">faculty@nmit.ac.in</div>
              </div>
              <div>
                <span className="text-neutral-400">Role:</span>
                <div className="text-white">Faculty</div>
              </div>
              <div>
                <span className="text-neutral-400">Department:</span>
                <div className="text-white">Computer Science</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Your Missions</h2>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Mission
            </Button>
          </div>

          <div className="space-y-4">
            {missions.map((mission) => (
              <div key={mission.id} className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-white">{mission.title}</h3>
                    <Badge
                      className={`${
                        mission.status === "active"
                          ? "bg-green-500"
                          : mission.status === "completed"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                      } text-white`}
                    >
                      {mission.status === "active"
                        ? "Active"
                        : mission.status === "completed"
                          ? "Completed"
                          : "Pending"}
                    </Badge>
                    {mission.status === "pending" && (
                      <Badge variant="outline" className="text-neutral-400 border-neutral-600">
                        Hidden
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMission(mission.id)}
                      className="text-neutral-400 hover:text-orange-500"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-orange-500">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm mb-2">{mission.department}</p>
                <p className="text-neutral-300 text-sm mb-4">{mission.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-500">Leaders: {mission.leaders.join(", ")}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-neutral-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${mission.progress}%` }}></div>
                    </div>
                    <span className="text-xs text-orange-500">{mission.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
