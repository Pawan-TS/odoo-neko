import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { createTaskDependency, getTaskById, isProjectMember } from "@/lib/data"

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const { task_id, blocked_by, status = "blocked" } = await request.json()

    if (!task_id || !blocked_by) {
      return NextResponse.json(
        { status: "error", message: "Task ID and blocked by task ID are required" },
        { status: 400 },
      )
    }

    const task = getTaskById(task_id)
    const blockingTask = getTaskById(blocked_by)

    if (!task || !blockingTask) {
      return NextResponse.json({ status: "error", message: "One or both tasks not found" }, { status: 404 })
    }

    // Check if user is a member of both projects
    if (
      !isProjectMember(task.project_id, auth.user.user_id) ||
      !isProjectMember(blockingTask.project_id, auth.user.user_id)
    ) {
      return NextResponse.json({ status: "error", message: "Access denied" }, { status: 403 })
    }

    const dependency = createTaskDependency(task_id, blocked_by)

    return NextResponse.json(
      {
        status: "success",
        message: "Dependency created successfully",
        data: dependency,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
