import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { createTask, isProjectMember } from "@/lib/data"

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const { project_id, title, description, status = "todo", due_date } = await request.json()

    if (!project_id || !title || !description) {
      return NextResponse.json(
        { status: "error", message: "Project ID, title, and description are required" },
        { status: 400 },
      )
    }

    // Check if user is a member of the project
    if (!isProjectMember(project_id, auth.user.user_id)) {
      return NextResponse.json({ status: "error", message: "Access denied" }, { status: 403 })
    }

    const newTask = createTask({
      project_id,
      title,
      description,
      status,
      due_date,
      created_by: auth.user.user_id,
    })

    return NextResponse.json(
      {
        status: "success",
        message: "Task created successfully",
        data: newTask,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
