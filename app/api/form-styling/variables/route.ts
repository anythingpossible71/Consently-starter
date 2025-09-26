import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { FormStylingService } from "@/lib/form-styling/form-styling"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get available styling variables
    const variables = await FormStylingService.getAvailableVariables()
    const variablesByCategory = await FormStylingService.getVariablesByCategory()
    
    return NextResponse.json({ 
      variables,
      variablesByCategory 
    })
  } catch (error) {
    console.error("Error fetching styling variables:", error)
    return NextResponse.json(
      { error: "Failed to fetch styling variables" },
      { status: 500 }
    )
  }
}
