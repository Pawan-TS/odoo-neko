import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { getAllUsers } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    // Only admins can view all users
    if (auth.user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Insufficient permissions" }, { status: 403 })
    }

    const users = getAllUsers()

    return NextResponse.json({
      status: "success",
      data: {
        users,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
