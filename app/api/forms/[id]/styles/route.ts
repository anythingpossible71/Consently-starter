import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { FormStylingService } from "@/lib/form-styling/form-styling";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: formId } = await params;
    const tokens = await FormStylingService.getTokenStyles(formId);
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error fetching form styles:", error);
    return NextResponse.json({ error: "Failed to fetch form styles" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: formId } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const tokens = body.tokens as Record<string, string> | undefined;

    if (!tokens || typeof tokens !== "object" || Object.keys(tokens).length === 0) {
      return NextResponse.json(
        { error: "Invalid payload: expected non-empty 'tokens' object" },
        { status: 400 }
      );
    }

    await FormStylingService.updateFormTokens(formId, tokens);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating form styles:", error);
    return NextResponse.json({ error: "Failed to update form styles" }, { status: 500 });
  }
}
