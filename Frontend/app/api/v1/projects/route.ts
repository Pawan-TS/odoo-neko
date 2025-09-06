import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { createProject, getUserProjects } from "@/lib/data"

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    // Get projects for the authenticated user
    const projects = getUserProjects(auth.user.user_id)

    return NextResponse.json({
      status: "success",
      data: {
        projects,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const { name, description } = await request.json()

    if (!name || !description) {
      return NextResponse.json({ status: "error", message: "Name and description are required" }, { status: 400 })
    }

    const newProject = createProject({
      name,
      description,
      created_by: auth.user.user_id,
    })

    return NextResponse.json(
      {
        status: "success",
        message: "Project created successfully",
        data: newProject,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
