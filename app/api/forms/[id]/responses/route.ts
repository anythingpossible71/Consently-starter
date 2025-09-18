import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params

    // Get the form to verify it exists
    const form = await prisma.form.findFirst({
      where: { 
        id,
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
