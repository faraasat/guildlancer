// app/api/cron/trust-decay/route.ts
// Cron endpoint for trust score decay

import { runTrustDecay } from "@/lib/cron/oracle-monitor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await runTrustDecay();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      usersProcessed: result.processed,
      usersDecayed: result.decayed,
    });
  } catch (error: any) {
    console.error("Trust decay cron error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to run trust decay" },
      { status: 500 }
    );
  }
}
