// app/api/ai/oracle/route.ts
// API route for AI Oracle Agent (Anomaly Detection)

import { NextRequest, NextResponse } from "next/server";
import { runAnomalyDetection } from "@/lib/actions/ai";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { days, minRiskScore } = body;

    const result = await runAnomalyDetection({
      days: days ? parseInt(days) : undefined,
      minRiskScore: minRiskScore ? parseInt(minRiskScore) : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes("permission") ? 403 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("AI oracle API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = searchParams.get("days");
    const minRiskScore = searchParams.get("minRiskScore");

    const result = await runAnomalyDetection({
      days: days ? parseInt(days) : undefined,
      minRiskScore: minRiskScore ? parseInt(minRiskScore) : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes("permission") ? 403 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("AI oracle API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
