import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { findUserById } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  const user = findUserById(auth.user.user_id)
  if (!user) {
    return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 })
  }

  const { password, ...userWithoutPassword } = user

  return NextResponse.json({
    status: "success",
    data: userWithoutPassword,
  })
}
