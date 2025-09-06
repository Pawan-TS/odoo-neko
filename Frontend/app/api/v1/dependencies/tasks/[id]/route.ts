import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getTaskDependencies, getTaskById, isProjectMember } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const taskId = Number.parseInt(params.id)
    const task = getTaskById(taskId)

    if (!task) {
      return NextResponse.json({ status: "error", message: "Task not found" }, { status: 404 })
    }

    // Check if user is a member of the project
    if (!isProjectMember(task.project_id, auth.user.user_id)) {
      return NextResponse.json({ status: "error", message: "Access denied" }, { status: 403 })
    }

    const dependencies = getTaskDependencies(taskId)

    return NextResponse.json({
      status: "success",
      data: dependencies,
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
