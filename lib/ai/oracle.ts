// lib/ai/oracle.ts
// Oracle Agent - Platform integrity monitoring and anomaly detection

import { callGroqJSON, GroqModels } from "./groq";
import { connectDB } from "@/lib/db";
import Guild from "@/lib/db/models/Guild";
import { User } from "@/lib/db/models/User";
import Dispute from "@/lib/db/models/Dispute";
import Activity from "@/lib/db/models/Activity";
import Transaction from "@/lib/db/models/Transaction";

export interface AnomalyDetection {
  entityId: string;
  entityType: "user" | "guild";
  entityName: string;
  anomalyType: string;
  riskScore: number; // 0-100
  description: string;
  evidence: string[];
  recommendedAction: string;
}

export interface OracleReport {
  anomalies: AnomalyDetection[];
  platformHealth: {
    overallScore: number; // 0-100
    trustScoreTrend: "increasing" | "stable" | "decreasing";
    disputeRate: number;
    averageResolutionTime: number;
  };
  analysisTime: number;
  analyzedEntities: number;
  model: string;
}

/**
 * Detect platform anomalies and potential fraud
 * @param options - Analysis options
 * @returns Anomaly detection report
 */
export async function detectAnomalies(options: {
  days?: number;
  minRiskScore?: number;
} = {}): Promise<OracleReport> {
  const startTime = Date.now();
  const { days = 7, minRiskScore = 60 } = options;

  await connectDB();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Gather suspicious patterns
  const suspiciousPatterns = await analyzeSuspiciousPatterns(cutoffDate);

  if (suspiciousPatterns.length === 0) {
    return {
      anomalies: [],
      platformHealth: await calculatePlatformHealth(),
      analysisTime: Date.now() - startTime,
      analyzedEntities: 0,
      model: GroqModels.MIXTRAL,
    };
  }

  // Construct AI prompt
  const prompt = `You are a platform integrity monitor for a freelance marketplace. Analyze the following user and guild behaviors to identify potential fraud, collusion, or gaming of the system.

**Analysis Period:** Last ${days} days

**Suspicious Patterns Detected:**
${JSON.stringify(suspiciousPatterns, null, 2)}

**Instructions:**
Identify anomalies and assign risk scores based on:
1. Trust score manipulation (rapid spikes, vote trading)
2. Collusion indicators (same entities always interacting)
3. Dispute patterns (review bombing, coordinated disputes)
4. Transaction anomalies (circular payments, wash trading)
5. Voting patterns (tribunal members always voting together)

Respond with JSON in this exact format:
{
  "anomalies": [
    {
      "entityId": "string",
      "entityType": "user" | "guild",
      "entityName": "string",
      "anomalyType": "string (e.g., Trust Score Manipulation, Collusion)",
      "riskScore": number (0-100),
      "description": "Brief description of the anomaly",
      "evidence": ["evidence point 1", "evidence point 2"],
      "recommendedAction": "Suggested action (Monitor, Investigate, Suspend, etc.)"
    }
  ]
}

Only include anomalies with risk score >= ${minRiskScore}. Be conservative - only flag clear suspicious patterns.`;

  try {
    const aiResponse = await callGroqJSON<{ anomalies: AnomalyDetection[] }>(
      prompt,
      {
        model: GroqModels.MIXTRAL,
        temperature: 0.3,
        maxTokens: 3072,
      }
    );

    // Filter and validate anomalies
    const validAnomalies = aiResponse.anomalies
      .filter((a) => a.riskScore >= minRiskScore)
      .map((a) => ({
        ...a,
        riskScore: Math.min(100, Math.max(0, a.riskScore)),
      }))
      .sort((a, b) => b.riskScore - a.riskScore);

    return {
      anomalies: validAnomalies,
      platformHealth: await calculatePlatformHealth(),
      analysisTime: Date.now() - startTime,
      analyzedEntities: suspiciousPatterns.length,
      model: GroqModels.MIXTRAL,
    };
  } catch (error) {
    console.error("Oracle AI error:", error);

    // Fallback: Rule-based anomaly detection
    const fallbackAnomalies = detectAnomaliesRuleBased(
      suspiciousPatterns,
      minRiskScore
    );

    return {
      anomalies: fallbackAnomalies,
      platformHealth: await calculatePlatformHealth(),
      analysisTime: Date.now() - startTime,
      analyzedEntities: suspiciousPatterns.length,
      model: "fallback",
    };
  }
}

/**
 * Analyze patterns to find suspicious behavior
 */
async function analyzeSuspiciousPatterns(cutoffDate: Date): Promise<any[]> {
  const patterns: any[] = [];

  // 1. Check for rapid trust score changes
  const recentActivities = await Activity.find({
    timestamp: { $gte: cutoffDate },
    type: { $in: ["TrustScoreChanged", "DisputeResolved", "BountyCompleted"] },
  })
    .sort({ timestamp: -1 })
    .limit(100)
    .lean();

  // Group by userId and check for unusual patterns
  const userActivityMap = new Map<string, any[]>();
  recentActivities.forEach((activity: any) => {
    const userId = activity.userId?.toString();
    if (userId) {
      if (!userActivityMap.has(userId)) {
        userActivityMap.set(userId, []);
      }
      userActivityMap.get(userId)!.push(activity);
    }
  });

  // Check for rapid score changes
  for (const [userId, activities] of userActivityMap) {
    if (activities.length >= 10) {
      const user = await User.findById(userId).select("username trustScore").lean();
      patterns.push({
        type: "HighActivityVolume",
        entityId: userId,
        entityType: "user",
        entityName: user?.username || "Unknown",
        data: {
          activityCount: activities.length,
          currentTrustScore: user?.trustScore || 0,
        },
      });
    }
  }

  // 2. Check for guilds with unusual dispute patterns
  const guildsWithDisputes = await Dispute.aggregate([
    { $match: { createdAt: { $gte: cutoffDate } } },
    {
      $group: {
        _id: "$guildId",
        disputeCount: { $sum: 1 },
        lossCount: {
          $sum: { $cond: [{ $eq: ["$outcome", "ClientWins"] }, 1, 0] },
        },
      },
    },
    { $match: { disputeCount: { $gte: 3 } } },
  ]);

  for (const guildData of guildsWithDisputes) {
    const guild = await Guild.findById(guildData._id)
      .select("name trustScore")
      .lean();
    patterns.push({
      type: "HighDisputeRate",
      entityId: guildData._id.toString(),
      entityType: "guild",
      entityName: guild?.name || "Unknown",
      data: {
        disputeCount: guildData.disputeCount,
        lossCount: guildData.lossCount,
        lossRate: (guildData.lossCount / guildData.disputeCount) * 100,
        trustScore: guild?.trustScore || 0,
      },
    });
  }

  // 3. Check for circular transaction patterns
  const recentTransactions = await Transaction.find({
    timestamp: { $gte: cutoffDate },
  })
    .sort({ timestamp: -1 })
    .limit(200)
    .lean();

  // Build transaction graph to detect cycles
  const transactionGraph = new Map<string, Set<string>>();
  recentTransactions.forEach((tx: any) => {
    const from = tx.fromId?.toString();
    const to = tx.toId?.toString();
    if (from && to) {
      if (!transactionGraph.has(from)) {
        transactionGraph.set(from, new Set());
      }
      transactionGraph.get(from)!.add(to);
    }
  });

  // Simple cycle detection (A->B and B->A within 7 days)
  for (const [userA, recipients] of transactionGraph) {
    for (const userB of recipients) {
      if (transactionGraph.get(userB)?.has(userA)) {
        const userADoc = await User.findById(userA)
          .select("username")
          .lean();
        const userBDoc = await User.findById(userB)
          .select("username")
          .lean();
        patterns.push({
          type: "CircularTransactions",
          entityId: userA,
          entityType: "user",
          entityName: userADoc?.username || "Unknown",
          data: {
            counterparty: userBDoc?.username || "Unknown",
            counterpartyId: userB,
          },
        });
      }
    }
  }

  return patterns;
}

/**
 * Calculate overall platform health metrics
 */
async function calculatePlatformHealth() {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last14Days = new Date();
  last14Days.setDate(last14Days.getDate() - 14);

  // Trust score trend
  const avgTrustLast7 = await User.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    { $group: { _id: null, avgTrust: { $avg: "$trustScore" } } },
  ]);

  const avgTrustLast14 = await User.aggregate([
    { $match: { createdAt: { $gte: last14Days, $lt: last7Days } } },
    { $group: { _id: null, avgTrust: { $avg: "$trustScore" } } },
  ]);

  const trustCurrent = avgTrustLast7[0]?.avgTrust || 500;
  const trustPrevious = avgTrustLast14[0]?.avgTrust || 500;
  const trustDiff = trustCurrent - trustPrevious;

  let trustScoreTrend: "increasing" | "stable" | "decreasing" = "stable";
  if (trustDiff > 20) trustScoreTrend = "increasing";
  else if (trustDiff < -20) trustScoreTrend = "decreasing";

  // Dispute rate
  const totalDisputes = await Dispute.countDocuments({
    createdAt: { $gte: last7Days },
  });

  // Resolution time
  const resolvedDisputes = await Dispute.find({
    createdAt: { $gte: last7Days },
    status: "Resolved",
  }).lean();

  const avgResolutionTime =
    resolvedDisputes.length > 0
      ? resolvedDisputes.reduce((sum, d: any) => {
          const created = new Date(d.createdAt).getTime();
          const resolved = new Date(d.resolvedAt || d.updatedAt).getTime();
          return sum + (resolved - created) / (1000 * 60 * 60); // hours
        }, 0) / resolvedDisputes.length
      : 0;

  return {
    overallScore: Math.min(100, Math.max(0, trustCurrent / 10)),
    trustScoreTrend,
    disputeRate: totalDisputes,
    averageResolutionTime: Math.round(avgResolutionTime * 10) / 10,
  };
}

/**
 * Rule-based fallback anomaly detection
 */
function detectAnomaliesRuleBased(
  patterns: any[],
  minRiskScore: number
): AnomalyDetection[] {
  const anomalies: AnomalyDetection[] = [];

  patterns.forEach((pattern) => {
    let riskScore = 0;
    let description = "";
    let evidence: string[] = [];
    let recommendedAction = "Monitor";

    switch (pattern.type) {
      case "HighActivityVolume":
        riskScore = pattern.data.activityCount >= 20 ? 80 : 65;
        description = `Unusually high activity volume (${pattern.data.activityCount} actions in 7 days)`;
        evidence = [
          `${pattern.data.activityCount} activities in analysis period`,
          `Current trust score: ${pattern.data.currentTrustScore}`,
        ];
        recommendedAction = riskScore >= 80 ? "Investigate" : "Monitor";
        break;

      case "HighDisputeRate":
        riskScore = pattern.data.lossRate >= 66 ? 85 : 70;
        description = `High dispute loss rate (${pattern.data.lossRate.toFixed(1)}%)`;
        evidence = [
          `${pattern.data.disputeCount} disputes in 7 days`,
          `${pattern.data.lossCount} disputes lost`,
          `Trust score: ${pattern.data.trustScore}`,
        ];
        recommendedAction = "Investigate";
        break;

      case "CircularTransactions":
        riskScore = 90;
        description = "Circular transaction pattern detected (potential wash trading)";
        evidence = [
          `Mutual transactions with ${pattern.data.counterparty}`,
          "Possible collusion or vote trading",
        ];
        recommendedAction = "Suspend";
        break;

      default:
        riskScore = 50;
        description = "Unusual pattern detected";
        evidence = [JSON.stringify(pattern.data)];
    }

    if (riskScore >= minRiskScore) {
      anomalies.push({
        entityId: pattern.entityId,
        entityType: pattern.entityType,
        entityName: pattern.entityName,
        anomalyType: pattern.type,
        riskScore,
        description,
        evidence,
        recommendedAction,
      });
    }
  });

  return anomalies.sort((a, b) => b.riskScore - a.riskScore);
}
