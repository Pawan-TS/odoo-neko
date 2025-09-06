import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getProjectMoodPulses, isProjectMember } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const projectId = Number.parseInt(params.id)

    // Check if user is a member of the project
    if (!isProjectMember(projectId, auth.user.user_id)) {
      return NextResponse.json({ status: "error", message: "Access denied" }, { status: 403 })
    }

    const moodData = getProjectMoodPulses(projectId)

    return NextResponse.json({
      status: "success",
      data: moodData,
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
