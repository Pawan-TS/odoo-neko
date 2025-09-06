import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { findUserById } from "@/lib/auth"
import { getUserProjects } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const userId = Number.parseInt(params.id)
    const user = findUserById(userId)

    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 })
    }

    // Users can only view their own profile unless they're admin
    if (auth.user.user_id !== userId && auth.user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Insufficient permissions" }, { status: 403 })
    }

    // Get user's projects
    const projects = getUserProjects(userId).map((project) => ({
      project_id: project.project_id,
      name: project.name,
      role: "member", // This would come from project_members table in real implementation
    }))

    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      status: "success",
      data: {
        user: {
          ...userWithoutPassword,
          projects,
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
    const userId = Number.parseInt(params.id)
    const user = findUserById(userId)

    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 })
    }

    // Users can only update their own profile unless they're admin
    if (auth.user.user_id !== userId && auth.user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Insufficient permissions" }, { status: 403 })
    }

    const { name, email } = await request.json()

    // Update user data (in real implementation, this would update the database)
    if (name) user.name = name
    if (email) user.email = email

    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      status: "success",
      message: "User updated successfully",
      data: {
        user_id: userWithoutPassword.user_id,
        name: userWithoutPassword.name,
        email: userWithoutPassword.email,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
