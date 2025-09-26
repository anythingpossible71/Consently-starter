import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { FormStylingService } from "@/lib/form-styling/form-styling";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: formId } = await params;

    await FormStylingService.resetFormStyles(formId);
    await FormStylingService.resetFormTokens(formId);
    await FormStylingService.initializeFormTokens(formId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting form styles:", error);
    return NextResponse.json({ error: "Failed to reset form styles" }, { status: 500 });
  }
}
