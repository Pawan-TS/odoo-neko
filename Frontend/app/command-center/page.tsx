"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CommandCenterPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">TEAM OVERVIEW</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">23</div>
                <div className="text-xs text-neutral-500">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">12</div>
                <div className="text-xs text-neutral-500">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">47</div>
                <div className="text-xs text-neutral-500">Tasks</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: "PM-001", name: "Sarah Chen", role: "Project Manager", status: "active" },
                { id: "DEV-002", name: "Alex Rodriguez", role: "Lead Developer", status: "active" },
                { id: "DES-003", name: "Maya Patel", role: "UI/UX Designer", status: "busy" },
                { id: "QA-004", name: "Jordan Kim", role: "QA Engineer", status: "offline" },
              ].map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        member.status === "active"
                          ? "bg-green-500"
                          : member.status === "busy"
                            ? "bg-orange-500"
                            : "bg-neutral-500"
                      }`}
                    ></div>
                    <div>
                      <div className="text-xs text-white font-mono">{member.name}</div>
                      <div className="text-xs text-neutral-500">{member.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PROJECT ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {[
                {
                  time: "06/09/2025 14:29",
                  user: "Sarah Chen",
                  action: "completed task in",
                  project: "Mobile App Redesign",
                  task: "User Research",
                },
                {
                  time: "06/09/2025 13:12",
                  user: "Alex Rodriguez",
                  action: "deployed feature to",
                  project: "E-commerce Platform",
                  task: null,
                },
                {
                  time: "06/09/2025 11:55",
                  user: "Maya Patel",
                  action: "updated designs for",
                  project: "Dashboard Redesign",
                  task: null,
                },
                {
                  time: "06/09/2025 10:33",
                  user: "Jordan Kim",
                  action: "reported bug in",
                  project: "API Integration",
                  task: null,
                },
                {
                  time: "06/09/2025 09:45",
                  user: "David Wilson",
                  action: "started working on",
                  project: "Data Analytics",
                  task: "Database Schema",
                },
              ].map((log, index) => (
                <div
                  key={index}
                  className="text-xs border-l-2 border-orange-500 pl-3 hover:bg-neutral-800 p-2 rounded transition-colors"
                >
                  <div className="text-neutral-500 font-mono">{log.time}</div>
                  <div className="text-white">
                    <span className="text-orange-500 font-mono">{log.user}</span> {log.action}{" "}
                    <span className="text-white font-mono">{log.project}</span>
                    {log.task && (
                      <span>
                        {" "}
                        - <span className="text-neutral-400">{log.task}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">TEAM COMMUNICATION</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Communication Hub Visual */}
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 border-2 border-orange-500 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute inset-2 border border-orange-500 rounded-full opacity-40"></div>
              <div className="absolute inset-4 border border-orange-500 rounded-full opacity-20"></div>
              {/* Grid lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-orange-500 opacity-30"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-full bg-orange-500 opacity-30"></div>
              </div>
            </div>

            <div className="text-xs text-neutral-500 space-y-1 w-full font-mono">
              <div className="flex justify-between">
                <span># 2025-09-06 14:23 UTC</span>
              </div>
              <div className="text-white">{"> [Sarah Chen] joined #mobile-redesign"}</div>
              <div className="text-orange-500">{"> New message in #general"}</div>
              <div className="text-white">{"> 3 active discussions"}</div>
              <div className="text-neutral-400">{'> Latest: "Sprint planning meeting at 3 PM"'}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              PROJECT PROGRESS OVERVIEW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative">
              {/* Chart Grid */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-neutral-700"></div>
                ))}
              </div>

              {/* Chart Line */}
              <svg className="absolute inset-0 w-full h-full">
                <polyline
                  points="0,120 50,100 100,110 150,90 200,95 250,85 300,100 350,80"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                <polyline
                  points="0,140 50,135 100,130 150,125 200,130 250,135 300,125 350,120"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500 -ml-5 font-mono">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-neutral-500 -mb-6 font-mono">
                <span>Aug 2025</span>
                <span>Sep 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PROJECT STATISTICS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-500 font-medium">Completed Projects</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">High Priority</span>
                    <span className="text-white font-bold font-mono">8</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Medium Priority</span>
                    <span className="text-white font-bold font-mono">15</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Low Priority</span>
                    <span className="text-white font-bold font-mono">23</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-orange-500 font-medium">In Progress</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">High Priority</span>
                    <span className="text-white font-bold font-mono">3</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Medium Priority</span>
                    <span className="text-white font-bold font-mono">6</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Low Priority</span>
                    <span className="text-white font-bold font-mono">3</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
