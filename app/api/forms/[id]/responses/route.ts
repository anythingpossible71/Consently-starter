import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth/permissions"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get the form to verify it exists and belongs to the user
    const form = await prisma.form.findFirst({
      where: { 
        id,
        user_id: user.id,
        deleted_at: null 
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      )
    }

    // Get all responses for this form
    const responses = await prisma.formResponse.findMany({
      where: {
        form_id: id,
        deleted_at: null
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Parse the response data
    const parsedResponses = responses.map(response => ({
      id: response.id,
      createdAt: response.created_at,
      data: JSON.parse(response.data)
    }))

    return NextResponse.json({
      success: true,
      responses: parsedResponses,
      total: parsedResponses.length
    })

  } catch (error) {
    console.error('Error fetching form responses:', error)
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    )
  }
}
