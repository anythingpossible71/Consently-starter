import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateId } from "@/lib/utils/ulid"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { formData, language = 'en' } = body

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

    // Create the form response
    const response = await prisma.formResponse.create({
      data: {
        id: generateId(),
        form_id: id,
        data: JSON.stringify({
          formData,
          language,
          submittedAt: new Date().toISOString(),
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
        })
      }
    })

    // Update the response count on the form
    await prisma.form.update({
      where: { id },
      data: {
        response_count: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      responseId: response.id,
      message: "Form submitted successfully"
    })

  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    )
  }
}
