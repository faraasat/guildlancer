// app/api/cron/oracle/route.ts
// Cron endpoint for Oracle monitoring

import { runOracleMonitor } from "@/lib/cron/oracle-monitor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (prevents unauthorized access)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const report = await runOracleMonitor();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      anomaliesDetected: report?.anomalies.length || 0,
      platformHealth: report?.platformHealth.overallScore || 0,
    });
  } catch (error: any) {
    console.error("Oracle cron error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to run Oracle monitor" },
      { status: 500 }
    );
  }
}
