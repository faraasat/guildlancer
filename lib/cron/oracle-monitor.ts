// lib/cron/oracle-monitor.ts
// Daily Oracle monitoring for anomaly detection

import { detectAnomalies } from "@/lib/ai/oracle";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { sendNotification } from "@/lib/actions/notifications";

/**
 * Run daily Oracle monitoring
 * Detects platform-wide anomalies and notifies admins
 */
export async function runOracleMonitor() {
  try {
    console.log("[Oracle Monitor] Starting daily anomaly detection...");

    await connectDB();

    // Run anomaly detection
    const report = await detectAnomalies({
      days: 7,
      minRiskScore: 70,
    });

    if (!report) {
      console.log("[Oracle Monitor] Failed to generate report");
      return;
    }

    console.log(`[Oracle Monitor] Detected ${report.anomalies.length} anomalies`);
    console.log(`[Oracle Monitor] Platform health: ${report.platformHealth.overallScore}`);

    // If critical anomalies found, notify admins
    const criticalAnomalies = report.anomalies.filter((a) => a.riskScore >= 80);

    if (criticalAnomalies.length > 0) {
      // Find admin users (trust score > 800 or rank Master+)
      const adminUsers = await User.find({
        $or: [{ trustScore: { $gt: 800 } }, { rank: { $in: ["Master", "Legend"] } }],
      });

      console.log(`[Oracle Monitor] Notifying ${adminUsers.length} admins of ${criticalAnomalies.length} critical anomalies`);

      // Send notifications to admins
      for (const admin of adminUsers) {
        await sendNotification(admin._id.toString(), "platform_announcement", {
          title: "Critical Anomalies Detected",
          message: `Oracle detected ${criticalAnomalies.length} critical anomalies requiring attention`,
          anomalyCount: criticalAnomalies.length,
          platformHealth: report.platformHealth.overallScore,
          reportId: Date.now().toString(),
        });
      }
    }

    console.log("[Oracle Monitor] Monitoring complete");
    return report;
  } catch (error) {
    console.error("[Oracle Monitor] Error:", error);
    throw error;
  }
}

/**
 * Run trust score decay (weekly)
 * Gradually decreases trust scores based on inactivity
 */
export async function runTrustDecay() {
  try {
    console.log("[Trust Decay] Starting weekly trust decay...");

    await connectDB();

    // Find users who haven't been active in 30+ days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const inactiveUsers = await User.find({
      lastActive: { $lt: thirtyDaysAgo },
      trustScore: { $gt: 500 }, // Only decay scores above 500
    });

    console.log(`[Trust Decay] Found ${inactiveUsers.length} inactive users`);

    let decayedCount = 0;

    for (const user of inactiveUsers) {
      const daysSinceActive = Math.floor(
        (Date.now() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Decay rate: 1 point per day of inactivity after 30 days
      const decayAmount = Math.min(daysSinceActive - 30, 50); // Max 50 points decay

      if (decayAmount > 0) {
        const newScore = Math.max(user.trustScore - decayAmount, 500);

        if (newScore !== user.trustScore) {
          user.trustScore = newScore;
          await user.save();
          decayedCount++;

          console.log(`[Trust Decay] ${user.username}: ${user.trustScore + decayAmount} → ${newScore}`);
        }
      }
    }

    console.log(`[Trust Decay] Decayed trust scores for ${decayedCount} users`);
    return { processed: inactiveUsers.length, decayed: decayedCount };
  } catch (error) {
    console.error("[Trust Decay] Error:", error);
    throw error;
  }
}
