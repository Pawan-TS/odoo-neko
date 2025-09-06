import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Welcome to SynergySphere API",
    version: "1.0.0",
    documentation: "/api/docs",
  })
}
