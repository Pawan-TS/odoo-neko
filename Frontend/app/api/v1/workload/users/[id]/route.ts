import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getUserWorkload } from "@/lib/data"
import { getProjectById } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const userId = Number.parseInt(params.id)

    // Users can only view their own workload unless they're admin
    if (auth.user.user_id !== userId && auth.user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Insufficient permissions" }, { status: 403 })
    }

    const workload = getUserWorkload(userId).map((w) => {
      const project = getProjectById(w.project_id)
      return {
        ...w,
        project_name: project?.name || "Unknown Project",
      }
    })

    return NextResponse.json({
      status: "success",
      data: {
        workload,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
