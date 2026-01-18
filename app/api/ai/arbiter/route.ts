// app/api/ai/arbiter/route.ts
// API route for AI Arbiter Agent

import { NextRequest, NextResponse } from "next/server";
import { requestAIAnalysis } from "@/lib/actions/ai";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { disputeId } = body;

    if (!disputeId) {
      return NextResponse.json(
        { error: "Dispute ID is required" },
        { status: 400 }
      );
    }

    const result = await requestAIAnalysis(disputeId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("AI arbiter API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
