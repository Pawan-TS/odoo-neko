import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getProjectById, addProjectMember, getProjectMemberRole, isProjectMember } from "@/lib/data"
import { findUserById } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const projectId = Number.parseInt(params.id)
    const project = getProjectById(projectId)

    if (!project) {
      return NextResponse.json({ status: "error", message: "Project not found" }, { status: 404 })
    }

    // Check if user has permission to add members (owner or admin)
    const userRole = getProjectMemberRole(projectId, auth.user.user_id)
    if (userRole !== "owner" && auth.user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Insufficient permissions" }, { status: 403 })
    }

    const { user_id, role = "member" } = await request.json()

    if (!user_id) {
      return NextResponse.json({ status: "error", message: "User ID is required" }, { status: 400 })
    }

    // Check if user exists
    const targetUser = findUserById(user_id)
    if (!targetUser) {
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 })
    }

    // Check if user is already a member
    if (isProjectMember(projectId, user_id)) {
      return NextResponse.json(
        { status: "error", message: "User is already a member of this project" },
        { status: 409 },
      )
    }

    const newMember = addProjectMember(projectId, user_id, role)

    return NextResponse.json(
      {
        status: "success",
        message: "Member added to project",
        data: newMember,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
