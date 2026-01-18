// app/api/ai/status/route.ts
// API route to check AI service status

import { NextResponse } from "next/server";
import { checkAIStatus } from "@/lib/actions/ai";

export async function GET() {
  try {
    const status = await checkAIStatus();
    return NextResponse.json(status);
  } catch (error: any) {
    console.error("AI status API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
