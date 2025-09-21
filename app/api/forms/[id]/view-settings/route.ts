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
        { error: "User not authenticated" },
        { status: 401 }
      )
    }

    // Get view settings for the form
    const viewSettings = await prisma.formViewSettings.findFirst({
      where: { 
        form_id: id,
        user_id: user.id,
        deleted_at: null 
      }
    })

    if (!viewSettings) {
      // Return default settings if none exist
      return NextResponse.json({
        success: true,
        settings: {
          visibleFields: [],
          tableSortField: null,
          tableSortOrder: null
        }
      })
    }

    return NextResponse.json({
      success: true,
      settings: {
        visibleFields: JSON.parse(viewSettings.visible_fields),
        tableSortField: viewSettings.table_sort_field,
        tableSortOrder: viewSettings.table_sort_order
      }
    })
  } catch (error) {
    console.error("Error fetching view settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch view settings" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { visibleFields, tableSortField, tableSortOrder } = body
    
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      )
    }

    // Verify form ownership
    const form = await prisma.form.findFirst({
      where: { 
        id,
        user_id: user.id,
        deleted_at: null 
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: "Form not found or not owned by user" },
        { status: 404 }
      )
    }

    // Upsert view settings
    const viewSettings = await prisma.formViewSettings.upsert({
      where: {
        form_id: id
      },
      update: {
        visible_fields: JSON.stringify(visibleFields || []),
        table_sort_field: tableSortField || null,
        table_sort_order: tableSortOrder || null,
        updated_at: new Date()
      },
      create: {
        form_id: id,
        user_id: user.id,
        visible_fields: JSON.stringify(visibleFields || []),
        table_sort_field: tableSortField || null,
        table_sort_order: tableSortOrder || null
      }
    })

    return NextResponse.json({
      success: true,
      settings: {
        visibleFields: JSON.parse(viewSettings.visible_fields),
        tableSortField: viewSettings.table_sort_field,
        tableSortOrder: viewSettings.table_sort_order
      }
    })
  } catch (error) {
    console.error("Error saving view settings:", error)
    return NextResponse.json(
      { error: "Failed to save view settings" },
      { status: 500 }
    )
  }
}
