import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getTaskById, assignTask, isProjectMember } from "@/lib/data"
import { findUserById } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { user_id } = await request.json()

    if (!user_id) {
      return NextResponse.json({ status: "error", message: "User ID is required" }, { status: 400 })
    }

    // Check if target user exists
    const targetUser = findUserById(user_id)
    if (!targetUser) {
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 })
    }

    // Check if target user is a member of the project
    if (!isProjectMember(task.project_id, user_id)) {
      return NextResponse.json({ status: "error", message: "User is not a member of this project" }, { status: 403 })
    }

    const assignment = assignTask(taskId, user_id)

    return NextResponse.json(
      {
        status: "success",
        message: "Task assigned successfully",
        data: assignment,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
