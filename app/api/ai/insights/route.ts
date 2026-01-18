// app/api/ai/insights/route.ts
// API route for AI Analytics Agent (Personalized Insights)

import { NextRequest, NextResponse } from "next/server";
import { getPersonalizedInsights } from "@/lib/actions/ai";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    const result = await getPersonalizedInsights(userId || undefined);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("AI insights API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    const result = await getPersonalizedInsights(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("AI insights API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
