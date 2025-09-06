import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { submitMoodPulse, isProjectMember } from "@/lib/data"

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const { project_id, mood_value, comment } = await request.json()

    if (!project_id || !mood_value) {
      return NextResponse.json({ status: "error", message: "Project ID and mood value are required" }, { status: 400 })
    }

    if (mood_value < 1 || mood_value > 5) {
      return NextResponse.json({ status: "error", message: "Mood value must be between 1 and 5" }, { status: 400 })
    }

    // Check if user is a member of the project
    if (!isProjectMember(project_id, auth.user.user_id)) {
      return NextResponse.json({ status: "error", message: "Access denied" }, { status: 403 })
    }

    const moodPulse = submitMoodPulse(auth.user.user_id, project_id, mood_value, comment)

    return NextResponse.json(
      {
        status: "success",
        message: "Mood pulse submitted successfully",
        data: moodPulse,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
