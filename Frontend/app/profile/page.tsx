"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api"
import { User, Settings, Key } from "lucide-react"

interface UserProfile {
  user_id: number
  name: string
  email: string
  role: string
  projects: Array<{
    project_id: number
    name: string
    role: string
  }>
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await apiClient.getCurrentUser()
      setProfile(response.data)
    } catch (err: any) {
      setError(err.message || "Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsUpdating(true)
    try {
      await apiClient.updateUser(profile.user_id, {
        name: profile.name,
        email: profile.email,
      })
      setError("")
      // Show success message
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setIsUpdating(true)
    try {
      await apiClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setError("")
      // Show success message
    } catch (err: any) {
      setError(err.message || "Failed to change password")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="text-orange-500 font-mono">LOADING PROFILE...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="text-red-400 font-mono">PROFILE NOT FOUND</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-mono text-orange-500 mb-2">USER PROFILE</h1>
          <p className="text-neutral-400">Manage your account settings and preferences</p>
        </div>

        {error && (
          <div className="mb-6 text-red-400 text-sm font-mono bg-red-900/20 p-3 rounded border border-red-500/30">
            {error}
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-neutral-900 border-orange-500/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
              <Key className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-neutral-900 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-orange-500 font-mono">PROFILE INFORMATION</CardTitle>
                <CardDescription className="text-neutral-400">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-orange-500 font-mono">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-neutral-800 border-orange-500/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-orange-500 font-mono">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="bg-neutral-800 border-orange-500/30 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-orange-500 font-mono">Role</Label>
                    <div className="text-white bg-neutral-800 p-2 rounded border border-orange-500/30">
                      {profile.role.toUpperCase()}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-mono"
                  >
                    {isUpdating ? "UPDATING..." : "UPDATE PROFILE"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-neutral-900 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-orange-500 font-mono">CHANGE PASSWORD</CardTitle>
                <CardDescription className="text-neutral-400">Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-orange-500 font-mono">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="bg-neutral-800 border-orange-500/30 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-orange-500 font-mono">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="bg-neutral-800 border-orange-500/30 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-orange-500 font-mono">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="bg-neutral-800 border-orange-500/30 text-white"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-mono"
                  >
                    {isUpdating ? "CHANGING..." : "CHANGE PASSWORD"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="bg-neutral-900 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-orange-500 font-mono">PROJECT MEMBERSHIPS</CardTitle>
                <CardDescription className="text-neutral-400">Projects you are a member of</CardDescription>
              </CardHeader>
              <CardContent>
                {profile.projects.length === 0 ? (
                  <div className="text-neutral-400 text-center py-8">No project memberships found</div>
                ) : (
                  <div className="space-y-3">
                    {profile.projects.map((project) => (
                      <div
                        key={project.project_id}
                        className="flex items-center justify-between p-3 bg-neutral-800 rounded border border-orange-500/20"
                      >
                        <div>
                          <h3 className="text-white font-mono">{project.name}</h3>
                          <p className="text-neutral-400 text-sm">Role: {project.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
