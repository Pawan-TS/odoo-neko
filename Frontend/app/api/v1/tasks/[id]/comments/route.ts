import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getTaskById, getTaskComments, addTaskComment, isProjectMember } from "@/lib/data"
import { findUserById } from "@/lib/auth"

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

    const comments = getTaskComments(taskId).map((comment) => {
      const user = findUserById(comment.user_id)
      return {
        ...comment,
        user_name: user?.name || "Unknown User",
      }
    })

    return NextResponse.json({
      status: "success",
      data: {
        comments,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}

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

    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ status: "error", message: "Content is required" }, { status: 400 })
    }

    const newComment = addTaskComment(taskId, auth.user.user_id, content)

    return NextResponse.json(
      {
        status: "success",
        message: "Comment added successfully",
        data: newComment,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
