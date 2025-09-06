import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getTunnelsForSource } from "@/lib/data"

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const sourceType = searchParams.get("source_type") as "task" | "project"
    const sourceId = searchParams.get("source_id")

    if (!sourceType || !sourceId) {
      return NextResponse.json({ status: "error", message: "Source type and source ID are required" }, { status: 400 })
    }

    const tunnels = getTunnelsForSource(sourceType, Number.parseInt(sourceId))

    return NextResponse.json({
      status: "success",
      data: {
        tunnels,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
