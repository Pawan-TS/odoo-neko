import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getTaskById, updateTask, getTaskAssignments, isProjectMember } from "@/lib/data"
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

    // Get task assignees
    const assignments = getTaskAssignments(taskId)
    const assignees = assignments.map((assignment) => {
      const user = findUserById(assignment.user_id)
      return {
        user_id: assignment.user_id,
        name: user?.name || "Unknown User",
      }
    })

    return NextResponse.json({
      status: "success",
      data: {
        task: {
          ...task,
          assignees,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { title, description, status, due_date } = await request.json()
    const updates: any = {}

    if (title) updates.title = title
    if (description) updates.description = description
    if (status) updates.status = status
    if (due_date) updates.due_date = due_date

    const updatedTask = updateTask(taskId, updates)

    if (!updatedTask) {
      return NextResponse.json({ status: "error", message: "Failed to update task" }, { status: 500 })
    }

    return NextResponse.json({
      status: "success",
      message: "Task updated successfully",
      data: {
        task_id: updatedTask.task_id,
        title: updatedTask.title,
        status: updatedTask.status,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
