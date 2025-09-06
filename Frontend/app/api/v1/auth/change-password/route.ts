import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { findUserById, verifyPassword, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { status: "error", message: "Current password and new password are required" },
        { status: 400 },
      )
    }

    const user = findUserById(auth.user.user_id)
    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password!)
    if (!isValidPassword) {
      return NextResponse.json({ status: "error", message: "Current password is incorrect" }, { status: 401 })
    }

    // Hash new password and update (in real app, update database)
    user.password = await hashPassword(newPassword)

    return NextResponse.json({
      status: "success",
      message: "Password updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
