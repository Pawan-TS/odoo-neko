"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("[v0] Login attempt for:", email)

    try {
      const response = await apiClient.login(email, password)
      console.log("[v0] Login response:", response)

      if (response.status === "success" && response.token && response.data?.user) {
        // Store auth token and user info
        localStorage.setItem(
          "synergysphere_auth",
          JSON.stringify({
            token: response.token,
            user: response.data.user,
            timestamp: Date.now(),
          }),
        )
        console.log("[v0] Login successful, redirecting...")
        router.push("/")
      } else {
        console.log("[v0] Login failed:", response.message)
        setError(response.message || "Login failed")
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      setError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-2 font-mono">SYNERGYSPHERE LOGIN</h1>
          <p className="text-neutral-400 text-lg">Access your dashboard to manage projects</p>
        </div>

        <Card className="bg-neutral-900 border-orange-500/20 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-orange-500 font-mono">SIGN IN</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded font-mono text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-300 font-mono">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-orange-500 focus:ring-orange-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-300 font-mono">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-orange-500 focus:ring-orange-500/20"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-mono font-bold py-3 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-800">
              <p className="text-center text-neutral-400 text-sm mb-4 font-mono">For demo purposes:</p>
              <div className="space-y-2 text-sm">
                <div className="text-center">
                  <span className="text-orange-500 font-mono">Admin:</span>{" "}
                  <span className="text-neutral-300">admin@synergysphere.com / password123</span>
                </div>
                <div className="text-center">
                  <span className="text-orange-500 font-mono">Member:</span>{" "}
                  <span className="text-neutral-300">member@synergysphere.com / password123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
