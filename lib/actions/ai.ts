// lib/actions/ai.ts
// Server actions for AI Agents

"use server";

import { matchBountyToGuilds, MatchmakerResponse } from "@/lib/ai/matchmaker";
import { analyzeDispute, ArbiterAnalysis } from "@/lib/ai/arbiter";
import { detectAnomalies, OracleReport } from "@/lib/ai/oracle";
import {
  generatePersonalizedRecommendations,
  PersonalizedInsights,
  getTrendingCategories,
} from "@/lib/ai/analytics";
import { isGroqConfigured } from "@/lib/ai/groq";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Bounty from "@/lib/models/Bounty";
import Dispute from "@/lib/models/Dispute";
import User from "@/lib/models/User";

/**
 * Match bounty to top guilds using AI
 */
export async function matchBounty(
  bountyId: string
): Promise<{ success: boolean; data?: MatchmakerResponse; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!isGroqConfigured()) {
      return {
        success: false,
        error:
          "AI service is not configured. Please contact administrator to set up GROQ_API_KEY.",
      };
    }

    await connectDB();

    // Verify bounty exists and user is the client
    const bounty = await Bounty.findById(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }

    if (bounty.clientId.toString() !== session.user.id) {
      return { success: false, error: "You can only match your own bounties" };
    }

    const matches = await matchBountyToGuilds(bountyId);

    return { success: true, data: matches };
  } catch (error: any) {
    console.error("Match bounty error:", error);
    return {
      success: false,
      error: error.message || "Failed to match bounty to guilds",
    };
  }
}

/**
 * Analyze dispute using AI Arbiter
 */
export async function requestAIAnalysis(
  disputeId: string
): Promise<{ success: boolean; data?: ArbiterAnalysis; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!isGroqConfigured()) {
      return {
        success: false,
        error:
          "AI service is not configured. Please contact administrator to set up GROQ_API_KEY.",
      };
    }

    await connectDB();

    // Verify dispute exists and user is involved
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return { success: false, error: "Dispute not found" };
    }

    // Check if user is client or guild member
    const user = await User.findById(session.user.id);
    const isClient = dispute.clientId.toString() === session.user.id;
    const isGuildMember = user?.guildId?.toString() === dispute.guildId.toString();

    if (!isClient && !isGuildMember) {
      return {
        success: false,
        error: "You are not authorized to view this dispute",
      };
    }

    // Check if dispute is at AI tier
    if (dispute.tier !== "AIArbiter") {
      return {
        success: false,
        error: "Dispute must be escalated to AI Arbiter tier first",
      };
    }

    const analysis = await analyzeDispute(disputeId);

    // Store AI suggestion in dispute
    await Dispute.findByIdAndUpdate(disputeId, {
      $set: {
        aiSuggestion: {
          ruling: analysis.ruling,
          splitPercentage:
            analysis.splitDetails?.clientPercentage || undefined,
          confidenceScore: analysis.confidenceScore,
          reasoning: analysis.reasoning,
          analyzedAt: new Date(),
        },
        status: "AIAnalysis",
      },
    });

    return { success: true, data: analysis };
  } catch (error: any) {
    console.error("AI analysis error:", error);
    return {
      success: false,
      error: error.message || "Failed to analyze dispute",
    };
  }
}

/**
 * Detect platform anomalies (Admin only)
 */
export async function runAnomalyDetection(options?: {
  days?: number;
  minRiskScore?: number;
}): Promise<{ success: boolean; data?: OracleReport; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user is admin (you can add admin role to User model)
    await connectDB();
    const user = await User.findById(session.user.id);
    
    // For MVP, allow users with trust score > 800 or rank Master+
    if (user && user.trustScore < 800 && !["Master", "Legendary"].includes(user.rank)) {
      return {
        success: false,
        error: "Insufficient permissions. Admin access required.",
      };
    }

    if (!isGroqConfigured()) {
      return {
        success: false,
        error:
          "AI service is not configured. Please contact administrator to set up GROQ_API_KEY.",
      };
    }

    const report = await detectAnomalies(options);

    return { success: true, data: report };
  } catch (error: any) {
    console.error("Anomaly detection error:", error);
    return {
      success: false,
      error: error.message || "Failed to detect anomalies",
    };
  }
}

/**
 * Generate personalized insights for user
 */
export async function getPersonalizedInsights(
  targetUserId?: string
): Promise<{ success: boolean; data?: PersonalizedInsights; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Default to current user if no target specified
    const userId = targetUserId || session.user.id;

    // Only allow viewing own insights (unless admin)
    if (userId !== session.user.id) {
      await connectDB();
      const currentUser = await User.findById(session.user.id);
      if (
        currentUser &&
        currentUser.trustScore < 800 &&
        !["Master", "Legendary"].includes(currentUser.rank)
      ) {
        return {
          success: false,
          error: "You can only view your own insights",
        };
      }
    }

    if (!isGroqConfigured()) {
      return {
        success: false,
        error:
          "AI service is not configured. Please contact administrator to set up GROQ_API_KEY.",
      };
    }

    const insights = await generatePersonalizedRecommendations(userId);

    return { success: true, data: insights };
  } catch (error: any) {
    console.error("Generate insights error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate insights",
    };
  }
}

/**
 * Get trending bounty categories
 */
export async function getTrendingBountyCategories(): Promise<{
  success: boolean;
  data?: Array<{ category: string; count: number; avgReward: number }>;
  error?: string;
}> {
  try {
    const trending = await getTrendingCategories();
    return { success: true, data: trending };
  } catch (error: any) {
    console.error("Get trending categories error:", error);
    return {
      success: false,
      error: error.message || "Failed to get trending categories",
    };
  }
}

/**
 * Check if AI services are configured
 */
export async function checkAIStatus(): Promise<{
  configured: boolean;
  services: {
    matchmaker: boolean;
    arbiter: boolean;
    oracle: boolean;
    analytics: boolean;
  };
}> {
  const configured = isGroqConfigured();
  return {
    configured,
    services: {
      matchmaker: configured,
      arbiter: configured,
      oracle: configured,
      analytics: configured,
    },
  };
}
