import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { FormStylingService } from "@/lib/form-styling/form-styling";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: formId } = await params;
    const mode = (request.nextUrl.searchParams.get("mode") as "legacy" | "tokens") ?? "tokens";
    const css = await FormStylingService.getFormCSS(formId, mode);

    return new NextResponse(css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error fetching form CSS:", error);
    return NextResponse.json({ error: "Failed to fetch form CSS" }, { status: 500 });
  }
}
