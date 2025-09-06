import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { updateWorkload } from "@/lib/data"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const workloadId = Number.parseInt(params.id)
    const { estimated_hours } = await request.json()

    if (!estimated_hours) {
      return NextResponse.json({ status: "error", message: "Estimated hours is required" }, { status: 400 })
    }

    const updatedWorkload = updateWorkload(workloadId, estimated_hours)

    if (!updatedWorkload) {
      return NextResponse.json({ status: "error", message: "Workload not found" }, { status: 404 })
    }

    return NextResponse.json({
      status: "success",
      message: "Workload updated successfully",
      data: {
        workload_id: updatedWorkload.workload_id,
        estimated_hours: updatedWorkload.estimated_hours,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
