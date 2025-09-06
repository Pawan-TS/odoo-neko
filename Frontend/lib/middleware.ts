import type { NextRequest } from "next/server"
import { verifyToken } from "./auth"

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}

export function authenticateRequest(request: NextRequest) {
  const token = getAuthToken(request)
  if (!token) {
    return { error: "No token provided", status: 401 }
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return { error: "Invalid token", status: 401 }
  }

  return { user: decoded, status: 200 }
}
