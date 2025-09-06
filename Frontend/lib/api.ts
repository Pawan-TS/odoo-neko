// API client for SynergySphere backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1"

interface ApiResponse<T = any> {
  status: "success" | "error"
  message?: string
  data?: T
  token?: string
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    const auth = localStorage.getItem("synergysphere_auth")
    if (!auth) return null

    try {
      const parsed = JSON.parse(auth)
      return parsed.token || null
    } catch {
      return null
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getAuthToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      // Check if response is ok and has JSON content type
      if (!response.ok) {
        // Try to parse as JSON, but handle cases where it's not JSON
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // Response is not JSON, use status text
        }

        return {
          status: "error",
          message: errorMessage,
        }
      }

      // Check content type to ensure it's JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response received:", text)
        return {
          status: "error",
          message: "Server returned invalid response format",
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{ user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(name: string, email: string, password: string, role?: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    })
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  // Projects
  async getProjects() {
    return this.request<{ projects: any[] }>("/projects")
  }

  async getProject(id: number) {
    return this.request<{ project: any }>(`/projects/${id}`)
  }

  async createProject(name: string, description: string) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    })
  }

  async updateProject(id: number, updates: { name?: string; description?: string }) {
    return this.request(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  async addProjectMember(projectId: number, userId: number, role: string) {
    return this.request(`/projects/${projectId}/members`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId, role }),
    })
  }

  // Tasks
  async getProjectTasks(projectId: number) {
    return this.request<{ tasks: any[] }>(`/projects/${projectId}/tasks`)
  }

  async getTask(id: number) {
    return this.request<{ task: any }>(`/tasks/${id}`)
  }

  async createTask(projectId: number, title: string, description: string, status?: string, dueDate?: string) {
    return this.request("/tasks", {
      method: "POST",
      body: JSON.stringify({
        project_id: projectId,
        title,
        description,
        status,
        due_date: dueDate,
      }),
    })
  }

  async updateTask(id: number, updates: { title?: string; description?: string; status?: string; due_date?: string }) {
    return this.request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  async assignTask(taskId: number, userId: number) {
    return this.request(`/tasks/${taskId}/assignments`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    })
  }

  // Comments
  async getTaskComments(taskId: number) {
    return this.request<{ comments: any[] }>(`/tasks/${taskId}/comments`)
  }

  async addTaskComment(taskId: number, content: string) {
    return this.request(`/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  }

  async updateComment(commentId: number, content: string) {
    return this.request(`/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    })
  }

  async deleteComment(commentId: number) {
    return this.request(`/comments/${commentId}`, {
      method: "DELETE",
    })
  }

  // Users
  async getUsers() {
    return this.request<{ users: any[] }>("/users")
  }

  async getUser(id: number) {
    return this.request<{ user: any }>(`/users/${id}`)
  }

  async updateUser(id: number, updates: { name?: string; email?: string }) {
    return this.request(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  // Workload
  async getUserWorkload(userId: number) {
    return this.request<{ workload: any[] }>(`/workload/users/${userId}`)
  }

  async updateWorkload(workloadId: number, estimatedHours: number) {
    return this.request(`/workload/${workloadId}`, {
      method: "PATCH",
      body: JSON.stringify({ estimated_hours: estimatedHours }),
    })
  }

  // Mood Pulse
  async submitMoodPulse(projectId: number, moodValue: number, comment?: string) {
    return this.request("/mood", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId, mood_value: moodValue, comment }),
    })
  }

  async getProjectMoodPulses(projectId: number) {
    return this.request(`/mood/projects/${projectId}`)
  }

  // Dependencies
  async createDependency(taskId: number, blockedBy: number) {
    return this.request("/dependencies", {
      method: "POST",
      body: JSON.stringify({ task_id: taskId, blocked_by: blockedBy }),
    })
  }

  async updateDependency(dependencyId: number, status: string) {
    return this.request(`/dependencies/${dependencyId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  async getTaskDependencies(taskId: number) {
    return this.request(`/dependencies/tasks/${taskId}`)
  }

  async deleteDependency(dependencyId: number) {
    return this.request(`/dependencies/${dependencyId}`, {
      method: "DELETE",
    })
  }

  // Tunnels
  async getTunnels(sourceType: string, sourceId: number) {
    return this.request<{ tunnels: any[] }>(`/tunnels?source_type=${sourceType}&source_id=${sourceId}`)
  }

  async generateTunnels(sourceType: string, sourceId: number, threshold?: number) {
    return this.request("/tunnels/generate", {
      method: "POST",
      body: JSON.stringify({ source_type: sourceType, source_id: sourceId, threshold }),
    })
  }
}

export const apiClient = new ApiClient()
