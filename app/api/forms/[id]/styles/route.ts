import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { FormStylingService } from "@/lib/form-styling/form-styling";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: formId } = await params;
    const styles = await FormStylingService.getFormStyles(formId);
    return NextResponse.json(styles);
  } catch (error) {
    console.error("Error fetching form styles:", error);
    return NextResponse.json({ error: "Failed to fetch form styles" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: formId } = await params;
    const { tokens, variables } = await request.json();

    if (variables && typeof variables === "object") {
      await FormStylingService.updateFormStyles(formId, variables);
    }

    if (tokens && typeof tokens === "object") {
      await FormStylingService.updateFormTokens(formId, tokens);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating form styles:", error);
    return NextResponse.json({ error: "Failed to update form styles" }, { status: 500 });
  }
}
