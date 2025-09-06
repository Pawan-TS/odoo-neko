import { type NextRequest, NextResponse } from "next/server"
import { createUser, hashPassword, findUserByEmail } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = "member" } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ status: "error", message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
      return NextResponse.json({ status: "error", message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUser = createUser({
      name,
      email,
      password: hashedPassword,
      role: role as "admin" | "member",
    })

    // Remove password from response
    const { password: _, ...userResponse } = newUser

    return NextResponse.json(
      {
        status: "success",
        message: "User registered successfully",
        data: userResponse,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
