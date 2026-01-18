// app/api/ai/match/route.ts
// API route for AI Matchmaker Agent

import { NextRequest, NextResponse } from "next/server";
import { matchBounty } from "@/lib/actions/ai";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bountyId } = body;

    if (!bountyId) {
      return NextResponse.json(
        { error: "Bounty ID is required" },
        { status: 400 }
      );
    }

    const result = await matchBounty(bountyId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("AI match API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
