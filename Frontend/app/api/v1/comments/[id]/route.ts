import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"
import { updateTaskComment, deleteTaskComment } from "@/lib/data"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const commentId = Number.parseInt(params.id)
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ status: "error", message: "Content is required" }, { status: 400 })
    }

    const updatedComment = updateTaskComment(commentId, content)

    if (!updatedComment) {
      return NextResponse.json({ status: "error", message: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({
      status: "success",
      message: "Comment updated successfully",
      data: {
        comment_id: updatedComment.comment_id,
        content: updatedComment.content,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = authenticateRequest(request)

  if (auth.error) {
    return NextResponse.json({ status: "error", message: auth.error }, { status: auth.status })
  }

  try {
    const commentId = Number.parseInt(params.id)
    const deleted = deleteTaskComment(commentId)

    if (!deleted) {
      return NextResponse.json({ status: "error", message: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({
      status: "success",
      message: "Comment deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
  }
}
