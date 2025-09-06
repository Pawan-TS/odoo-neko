import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { updateDependencyStatus, deleteDependency } from "@/lib/data"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const dependencyId = Number.parseInt(params.id)
    const { status } = await request.json()

    if (!status || !["blocked", "resolved"].includes(status)) {
      return NextResponse.json({ status: "error", message: "Valid status is required" }, { status: 400 })
    }

    const updatedDependency = updateDependencyStatus(dependencyId, status)

    if (!updatedDependency) {
      return NextResponse.json({ status: "error", message: "Dependency not found" }, { status: 404 })
    }

    return NextResponse.json({
      status: "success",
      message: "Dependency status updated",
      data: {
        dependency_id: updatedDependency.dependency_id,
        status: updatedDependency.status,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const dependencyId = Number.parseInt(params.id)
    const deleted = deleteDependency(dependencyId)

    if (!deleted) {
      return NextResponse.json({ status: "error", message: "Dependency not found" }, { status: 404 })
    }

    return NextResponse.json({
      status: "success",
      message: "Dependency deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
