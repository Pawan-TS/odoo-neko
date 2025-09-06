// Mock database for projects and related data
export interface Project {
  project_id: number
  name: string
  description: string
  created_by: number
  created_at: string
  updated_at?: string
}

export interface ProjectMember {
  member_id: number
  project_id: number
  user_id: number
  role: "owner" | "member" | "viewer"
  joined_at: string
}

// Mock data storage
const projects: Project[] = [
  {
    project_id: 1,
    name: "Smart Energy Monitoring System",
    description:
      "A comprehensive real-time energy monitoring system that tracks consumption patterns across campus buildings",
    created_by: 1,
    created_at: "2025-09-06T10:30:00.000Z",
  },
  {
    project_id: 2,
    name: "AI-Powered Crop Analysis",
    description: "Machine learning system for analyzing crop health and predicting yield optimization",
    created_by: 1,
    created_at: "2025-09-06T11:00:00.000Z",
  },
]

const projectMembers: ProjectMember[] = [
  {
    member_id: 1,
    project_id: 1,
    user_id: 1,
    role: "owner",
    joined_at: "2025-09-06T10:30:00.000Z",
  },
  {
    member_id: 2,
    project_id: 2,
    user_id: 1,
    role: "owner",
    joined_at: "2025-09-06T11:00:00.000Z",
  },
  {
    member_id: 3,
    project_id: 1,
    user_id: 2,
    role: "member",
    joined_at: "2025-09-06T12:00:00.000Z",
  },
]

// Task management data structures
export interface Task {
  task_id: number
  project_id: number
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
  due_date?: string
  created_by: number
  created_at: string
  updated_at?: string
}

export interface TaskAssignment {
  assignment_id: number
  task_id: number
  user_id: number
  assigned_at: string
}

export interface TaskComment {
  comment_id: number
  task_id: number
  user_id: number
  content: string
  created_at: string
  updated_at?: string
}

// Workload management data structures
export interface Workload {
  workload_id: number
  user_id: number
  project_id: number
  task_count: number
  estimated_hours: number
  updated_at: string
}

// Mood pulse data structures
export interface MoodPulse {
  mood_id: number
  user_id: number
  project_id: number
  mood_value: number // 1-5 scale
  comment?: string
  created_at: string
}

// Task dependency data structures
export interface TaskDependency {
  dependency_id: number
  task_id: number
  blocked_by: number
  status: "blocked" | "resolved"
  created_at: string
}

// Tunnel (AI-powered connection) data structures
export interface Tunnel {
  tunnel_id: number
  source_type: "task" | "project"
  source_id: number
  target_type: "task" | "project"
  target_id: number
  similarity: number
  created_at: string
}

// Mock task data
const tasks: Task[] = [
  {
    task_id: 1,
    project_id: 1,
    title: "Design User Interface",
    description: "Create wireframes and mockups for the energy monitoring dashboard",
    status: "in_progress",
    due_date: "2025-09-20",
    created_by: 1,
    created_at: "2025-09-06T11:00:00.000Z",
  },
  {
    task_id: 2,
    project_id: 1,
    title: "Setup Database Schema",
    description: "Design and implement the database structure for energy data storage",
    status: "todo",
    due_date: "2025-09-25",
    created_by: 1,
    created_at: "2025-09-06T11:30:00.000Z",
  },
  {
    task_id: 3,
    project_id: 2,
    title: "Data Collection Module",
    description: "Implement crop image data collection and preprocessing",
    status: "done",
    due_date: "2025-09-15",
    created_by: 1,
    created_at: "2025-09-06T12:00:00.000Z",
  },
]

const taskAssignments: TaskAssignment[] = [
  {
    assignment_id: 1,
    task_id: 1,
    user_id: 1,
    assigned_at: "2025-09-06T11:00:00.000Z",
  },
  {
    assignment_id: 2,
    task_id: 2,
    user_id: 2,
    assigned_at: "2025-09-06T11:30:00.000Z",
  },
  {
    assignment_id: 3,
    task_id: 3,
    user_id: 1,
    assigned_at: "2025-09-06T12:00:00.000Z",
  },
]

const taskComments: TaskComment[] = [
  {
    comment_id: 1,
    task_id: 1,
    user_id: 1,
    content: "Started working on the wireframes. Initial mockups are looking good.",
    created_at: "2025-09-06T13:00:00.000Z",
  },
  {
    comment_id: 2,
    task_id: 1,
    user_id: 2,
    content: "Great progress! The dashboard layout looks intuitive.",
    created_at: "2025-09-06T14:00:00.000Z",
  },
]

// Mock advanced features data
const workloads: Workload[] = [
  {
    workload_id: 1,
    user_id: 1,
    project_id: 1,
    task_count: 2,
    estimated_hours: 15,
    updated_at: "2025-09-06T12:00:00.000Z",
  },
  {
    workload_id: 2,
    user_id: 2,
    project_id: 1,
    task_count: 1,
    estimated_hours: 8,
    updated_at: "2025-09-06T12:00:00.000Z",
  },
]

const moodPulses: MoodPulse[] = [
  {
    mood_id: 1,
    user_id: 1,
    project_id: 1,
    mood_value: 4,
    comment: "Making good progress but feeling a bit stressed",
    created_at: "2025-09-06T12:30:00.000Z",
  },
  {
    mood_id: 2,
    user_id: 2,
    project_id: 1,
    mood_value: 5,
    comment: "Team collaboration is excellent",
    created_at: "2025-09-06T13:00:00.000Z",
  },
]

const taskDependencies: TaskDependency[] = [
  {
    dependency_id: 1,
    task_id: 2,
    blocked_by: 1,
    status: "blocked",
    created_at: "2025-09-06T13:00:00.000Z",
  },
]

const tunnels: Tunnel[] = [
  {
    tunnel_id: 1,
    source_type: "task",
    source_id: 1,
    target_type: "task",
    target_id: 3,
    similarity: 0.85,
    created_at: "2025-09-06T13:30:00.000Z",
  },
]

export function getAllProjects(): Project[] {
  return projects
}

export function getProjectById(id: number): Project | undefined {
  return projects.find((p) => p.project_id === id)
}

export function createProject(projectData: Omit<Project, "project_id" | "created_at">): Project {
  const newProject: Project = {
    project_id: projects.length + 1,
    ...projectData,
    created_at: new Date().toISOString(),
  }
  projects.push(newProject)

  // Add creator as owner
  const newMember: ProjectMember = {
    member_id: projectMembers.length + 1,
    project_id: newProject.project_id,
    user_id: projectData.created_by,
    role: "owner",
    joined_at: new Date().toISOString(),
  }
  projectMembers.push(newMember)

  return newProject
}

export function updateProject(
  id: number,
  updates: Partial<Omit<Project, "project_id" | "created_by" | "created_at">>,
): Project | null {
  const projectIndex = projects.findIndex((p) => p.project_id === id)
  if (projectIndex === -1) return null

  projects[projectIndex] = {
    ...projects[projectIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  return projects[projectIndex]
}

export function getProjectMembers(projectId: number): ProjectMember[] {
  return projectMembers.filter((pm) => pm.project_id === projectId)
}

export function addProjectMember(
  projectId: number,
  userId: number,
  role: "owner" | "member" | "viewer",
): ProjectMember {
  const newMember: ProjectMember = {
    member_id: projectMembers.length + 1,
    project_id: projectId,
    user_id: userId,
    role,
    joined_at: new Date().toISOString(),
  }
  projectMembers.push(newMember)
  return newMember
}

export function getUserProjects(userId: number): Project[] {
  const userProjectIds = projectMembers.filter((pm) => pm.user_id === userId).map((pm) => pm.project_id)

  return projects.filter((p) => userProjectIds.includes(p.project_id))
}

export function isProjectMember(projectId: number, userId: number): boolean {
  return projectMembers.some((pm) => pm.project_id === projectId && pm.user_id === userId)
}

export function getProjectMemberRole(projectId: number, userId: number): string | null {
  const member = projectMembers.find((pm) => pm.project_id === projectId && pm.user_id === userId)
  return member ? member.role : null
}

// Task management functions
export function getAllTasks(): Task[] {
  return tasks
}

export function getTaskById(id: number): Task | undefined {
  return tasks.find((t) => t.task_id === id)
}

export function getTasksByProject(projectId: number): Task[] {
  return tasks.filter((t) => t.project_id === projectId)
}

export function createTask(taskData: Omit<Task, "task_id" | "created_at">): Task {
  const newTask: Task = {
    task_id: tasks.length + 1,
    ...taskData,
    created_at: new Date().toISOString(),
  }
  tasks.push(newTask)
  return newTask
}

export function updateTask(
  id: number,
  updates: Partial<Omit<Task, "task_id" | "project_id" | "created_by" | "created_at">>,
): Task | null {
  const taskIndex = tasks.findIndex((t) => t.task_id === id)
  if (taskIndex === -1) return null

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  return tasks[taskIndex]
}

export function getTaskAssignments(taskId: number): TaskAssignment[] {
  return taskAssignments.filter((ta) => ta.task_id === taskId)
}

export function assignTask(taskId: number, userId: number): TaskAssignment {
  const newAssignment: TaskAssignment = {
    assignment_id: taskAssignments.length + 1,
    task_id: taskId,
    user_id: userId,
    assigned_at: new Date().toISOString(),
  }
  taskAssignments.push(newAssignment)
  return newAssignment
}

export function getTaskComments(taskId: number): TaskComment[] {
  return taskComments.filter((tc) => tc.task_id === taskId)
}

export function addTaskComment(taskId: number, userId: number, content: string): TaskComment {
  const newComment: TaskComment = {
    comment_id: taskComments.length + 1,
    task_id: taskId,
    user_id: userId,
    content,
    created_at: new Date().toISOString(),
  }
  taskComments.push(newComment)
  return newComment
}

export function updateTaskComment(commentId: number, content: string): TaskComment | null {
  const commentIndex = taskComments.findIndex((tc) => tc.comment_id === commentId)
  if (commentIndex === -1) return null

  taskComments[commentIndex] = {
    ...taskComments[commentIndex],
    content,
    updated_at: new Date().toISOString(),
  }

  return taskComments[commentIndex]
}

export function deleteTaskComment(commentId: number): boolean {
  const commentIndex = taskComments.findIndex((tc) => tc.comment_id === commentId)
  if (commentIndex === -1) return false

  taskComments.splice(commentIndex, 1)
  return true
}

export function getUserTasks(userId: number): Task[] {
  const userTaskIds = taskAssignments.filter((ta) => ta.user_id === userId).map((ta) => ta.task_id)
  return tasks.filter((t) => userTaskIds.includes(t.task_id))
}

// Workload management functions
export function getUserWorkload(userId: number): Workload[] {
  return workloads.filter((w) => w.user_id === userId)
}

export function updateWorkload(workloadId: number, estimatedHours: number): Workload | null {
  const workloadIndex = workloads.findIndex((w) => w.workload_id === workloadId)
  if (workloadIndex === -1) return null

  workloads[workloadIndex] = {
    ...workloads[workloadIndex],
    estimated_hours: estimatedHours,
    updated_at: new Date().toISOString(),
  }

  return workloads[workloadIndex]
}

export function createOrUpdateWorkload(userId: number, projectId: number): Workload {
  const existingWorkload = workloads.find((w) => w.user_id === userId && w.project_id === projectId)
  const userTasks = getUserTasks(userId).filter((t) => t.project_id === projectId)

  if (existingWorkload) {
    existingWorkload.task_count = userTasks.length
    existingWorkload.updated_at = new Date().toISOString()
    return existingWorkload
  }

  const newWorkload: Workload = {
    workload_id: workloads.length + 1,
    user_id: userId,
    project_id: projectId,
    task_count: userTasks.length,
    estimated_hours: userTasks.length * 5, // Default 5 hours per task
    updated_at: new Date().toISOString(),
  }

  workloads.push(newWorkload)
  return newWorkload
}

// Mood pulse functions
export function submitMoodPulse(userId: number, projectId: number, moodValue: number, comment?: string): MoodPulse {
  const newMoodPulse: MoodPulse = {
    mood_id: moodPulses.length + 1,
    user_id: userId,
    project_id: projectId,
    mood_value: moodValue,
    comment,
    created_at: new Date().toISOString(),
  }

  moodPulses.push(newMoodPulse)
  return newMoodPulse
}

export function getProjectMoodPulses(projectId: number): any {
  const projectMoods = moodPulses.filter((mp) => mp.project_id === projectId)
  const project = getProjectById(projectId)

  // Group by date and calculate averages
  const moodData = projectMoods.reduce((acc: any, mood) => {
    const date = mood.created_at.split("T")[0]
    if (!acc[date]) {
      acc[date] = { moods: [], comments: [] }
    }
    acc[date].moods.push(mood.mood_value)
    if (mood.comment) acc[date].comments.push(mood.comment)
    return acc
  }, {})

  const formattedData = Object.entries(moodData).map(([date, data]: [string, any]) => ({
    date,
    average_mood: data.moods.reduce((sum: number, mood: number) => sum + mood, 0) / data.moods.length,
    mood_count: data.moods.length,
    comments: data.comments,
  }))

  return {
    project_id: projectId,
    project_name: project?.name || "Unknown Project",
    mood_data: formattedData,
  }
}

// Task dependency functions
export function createTaskDependency(taskId: number, blockedBy: number): TaskDependency {
  const newDependency: TaskDependency = {
    dependency_id: taskDependencies.length + 1,
    task_id: taskId,
    blocked_by: blockedBy,
    status: "blocked",
    created_at: new Date().toISOString(),
  }

  taskDependencies.push(newDependency)
  return newDependency
}

export function updateDependencyStatus(dependencyId: number, status: "blocked" | "resolved"): TaskDependency | null {
  const dependencyIndex = taskDependencies.findIndex((td) => td.dependency_id === dependencyId)
  if (dependencyIndex === -1) return null

  taskDependencies[dependencyIndex] = {
    ...taskDependencies[dependencyIndex],
    status,
  }

  return taskDependencies[dependencyIndex]
}

export function getTaskDependencies(taskId: number): any {
  const task = getTaskById(taskId)
  if (!task) return null

  const blockedBy = taskDependencies
    .filter((td) => td.task_id === taskId)
    .map((dependency) => {
      const blockingTask = getTaskById(dependency.blocked_by)
      return {
        dependency_id: dependency.dependency_id,
        task_id: dependency.blocked_by,
        title: blockingTask?.title || "Unknown Task",
        status: dependency.status,
      }
    })

  const blocking = taskDependencies
    .filter((td) => td.blocked_by === taskId)
    .map((dependency) => {
      const blockedTask = getTaskById(dependency.task_id)
      return {
        dependency_id: dependency.dependency_id,
        task_id: dependency.task_id,
        title: blockedTask?.title || "Unknown Task",
        status: dependency.status,
      }
    })

  return {
    task_id: taskId,
    title: task.title,
    blocked_by: blockedBy,
    blocking,
  }
}

export function deleteDependency(dependencyId: number): boolean {
  const dependencyIndex = taskDependencies.findIndex((td) => td.dependency_id === dependencyId)
  if (dependencyIndex === -1) return false

  taskDependencies.splice(dependencyIndex, 1)
  return true
}

// Tunnel functions
export function createTunnel(
  sourceType: "task" | "project",
  sourceId: number,
  targetType: "task" | "project",
  targetId: number,
  similarity: number,
): Tunnel {
  const newTunnel: Tunnel = {
    tunnel_id: tunnels.length + 1,
    source_type: sourceType,
    source_id: sourceId,
    target_type: targetType,
    target_id: targetId,
    similarity,
    created_at: new Date().toISOString(),
  }

  tunnels.push(newTunnel)
  return newTunnel
}

export function getTunnelsForSource(sourceType: "task" | "project", sourceId: number): any[] {
  return tunnels
    .filter((t) => t.source_type === sourceType && t.source_id === sourceId)
    .map((tunnel) => {
      let targetInfo: any = {}

      if (tunnel.target_type === "task") {
        const task = getTaskById(tunnel.target_id)
        targetInfo = {
          title: task?.title || "Unknown Task",
          project_id: task?.project_id,
        }
      } else if (tunnel.target_type === "project") {
        const project = getProjectById(tunnel.target_id)
        targetInfo = {
          title: project?.name || "Unknown Project",
        }
      }

      return {
        ...tunnel,
        target_info: targetInfo,
      }
    })
}

export function generateTunnelsAutomatically(
  sourceType: "task" | "project",
  sourceId: number,
  threshold = 0.7,
): Tunnel[] {
  // Mock AI-powered tunnel generation
  const generatedTunnels: Tunnel[] = []

  if (sourceType === "task") {
    // Find similar tasks based on mock similarity
    const allTasks = getAllTasks().filter((t) => t.task_id !== sourceId)
    const sourceTask = getTaskById(sourceId)

    if (sourceTask) {
      allTasks.forEach((task) => {
        // Mock similarity calculation based on title/description keywords
        const similarity = Math.random() * 0.4 + 0.6 // Random between 0.6-1.0
        if (similarity >= threshold) {
          const tunnel = createTunnel("task", sourceId, "task", task.task_id, similarity)
          generatedTunnels.push(tunnel)
        }
      })
    }
  }

  return generatedTunnels
}
