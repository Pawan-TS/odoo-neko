import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getProjectById, updateProject, getProjectMembers, isProjectMember, getProjectMemberRole } from "@/lib/data"
import { findUserById } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user is a member of this project
    if (!isProjectMember(projectId, auth.user.user_id)) {
      return NextResponse.json({ status: "error", message: "Access denied" }, { status: 403 })
    }

    // Get project members with user details
    const members = getProjectMembers(projectId).map((member) => {
      const user = findUserById(member.user_id)
      return {
        user_id: member.user_id,
        name: user?.name || "Unknown User",
        role: member.role,
      }
    })

    return NextResponse.json({
      status: "success",
      data: {
        project: {
          ...project,
          members,
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
    const projectId = Number.parseInt(params.id)
    const project = getProjectById(projectId)

    if (!project) {
      return NextResponse.json({ status: "error", message: "Project not found" }, { status: 404 })
    }

    // Check if user has permission to update (owner or admin)
    const userRole = getProjectMemberRole(projectId, auth.user.user_id)
    if (userRole !== "owner" && auth.user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Insufficient permissions" }, { status: 403 })
    }

    const { name, description } = await request.json()
    const updates: any = {}

    if (name) updates.name = name
    if (description) updates.description = description

    const updatedProject = updateProject(projectId, updates)

    if (!updatedProject) {
      return NextResponse.json({ status: "error", message: "Failed to update project" }, { status: 500 })
    }

    return NextResponse.json({
      status: "success",
      message: "Project updated successfully",
      data: {
        project_id: updatedProject.project_id,
        name: updatedProject.name,
        description: updatedProject.description,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
