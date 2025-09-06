import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ status: "error", message: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ status: "error", message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password!)
    if (!isValidPassword) {
      return NextResponse.json({ status: "error", message: "Invalid credentials" }, { status: 401 })
    }

    // Generate token
    const { password: _, ...userWithoutPassword } = user
    const token = generateToken(userWithoutPassword)

    return NextResponse.json({
      status: "success",
      token,
      data: {
        user: userWithoutPassword,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
