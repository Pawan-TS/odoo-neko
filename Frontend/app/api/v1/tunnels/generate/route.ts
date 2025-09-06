import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { generateTunnelsAutomatically } from "@/lib/data"

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const { source_type, source_id, threshold = 0.7 } = await request.json()

    if (!source_type || !source_id) {
      return NextResponse.json({ status: "error", message: "Source type and source ID are required" }, { status: 400 })
    }

    const generatedTunnels = generateTunnelsAutomatically(source_type, source_id, threshold)

    return NextResponse.json({
      status: "success",
      message: "Tunnels generated successfully",
      data: {
        generated_tunnels: generatedTunnels.length,
        tunnels: generatedTunnels,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
