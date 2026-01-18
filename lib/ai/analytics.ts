// lib/ai/analytics.ts
// Analytics Agent - Personalized insights and recommendations

import { callGroqJSON, GroqModels, truncateToTokens } from "./groq";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models/User";
import Bounty from "@/lib/db/models/Bounty";
import Guild from "@/lib/db/models/Guild";
import Activity from "@/lib/db/models/Activity";
import Dispute from "@/lib/db/models/Dispute";

export interface SkillRecommendation {
  skill: string;
  priority: "high" | "medium" | "low";
  reasoning: string;
}

export interface BountyRecommendation {
  category: string;
  reasoning: string;
  potentialReward: number;
}

export interface ImprovementArea {
  area: string;
  currentLevel: string;
  targetLevel: string;
  actionItems: string[];
}

export interface RankProgression {
  currentRank: string;
  nextRank: string;
  progressPercentage: number;
  estimatedTimeToNextRank: string;
  requiredActions: string[];
}

export interface PersonalizedInsights {
  skillRecommendations: SkillRecommendation[];
  bountyRecommendations: BountyRecommendation[];
  improvementAreas: ImprovementArea[];
  rankProgression: RankProgression;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  analysisTime: number;
  model: string;
}

/**
 * Generate personalized recommendations and insights for a user
 * @param userId - User to analyze
 * @returns Personalized insights and recommendations
 */
export async function generatePersonalizedRecommendations(
  userId: string
): Promise<PersonalizedInsights> {
  const startTime = Date.now();

  await connectDB();

  // Fetch user profile
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new Error("User not found");
  }

  // Fetch user's activity history
  const recentActivities = await Activity.find({ userId })
    .sort({ timestamp: -1 })
    .limit(50)
    .lean();

  // Fetch user's guild (if any)
  let guild = null;
  if (user.guildId) {
    guild = await Guild.findById(user.guildId)
      .select("name rank trustScore categories")
      .lean();
  }

  // Fetch bounties user worked on
  const userBounties = await Bounty.find({
    $or: [
      { clientId: userId },
      { assignedHunterId: userId },
      { acceptedByGuildId: user.guildId },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // Categorize bounties
  const completedBounties = userBounties.filter(
    (b: any) => b.status === "Completed"
  );
  const failedBounties = userBounties.filter(
    (b: any) => b.status === "Disputed" || b.status === "Cancelled"
  );

  // Fetch disputes
  const userDisputes = await Dispute.find({
    $or: [{ clientId: userId }, { guildId: user.guildId }],
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Build user performance summary
  const performanceSummary = {
    trustScore: user.trustScore,
    rank: user.rank,
    totalBounties: userBounties.length,
    completedBounties: completedBounties.length,
    successRate:
      userBounties.length > 0
        ? (completedBounties.length / userBounties.length) * 100
        : 0,
    totalDisputes: userDisputes.length,
    averageReward:
      completedBounties.length > 0
        ? completedBounties.reduce(
            (sum: number, b: any) => sum + (b.rewardCredits || 0),
            0
          ) / completedBounties.length
        : 0,
    categories: [...new Set(userBounties.map((b: any) => b.category))],
    guildInfo: guild
      ? {
          name: guild.name,
          rank: guild.rank,
          trustScore: guild.trustScore,
        }
      : null,
  };

  // Construct AI prompt
  const prompt = `You are an expert career advisor for freelancers on a bounty platform. Analyze this user's performance and provide personalized recommendations.

**User Profile:**
- Username: ${user.username}
- Current Rank: ${user.rank}
- Trust Score: ${user.trustScore}/1000
- Credits: ${user.credits}
- Account Age: ${Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days

**Performance Summary:**
- Total Bounties: ${performanceSummary.totalBounties}
- Completed: ${performanceSummary.completedBounties}
- Success Rate: ${performanceSummary.successRate.toFixed(1)}%
- Average Reward: ${Math.round(performanceSummary.averageReward)} credits
- Total Disputes: ${performanceSummary.totalDisputes}
- Categories Worked In: ${performanceSummary.categories.join(", ")}
${performanceSummary.guildInfo ? `- Guild: ${performanceSummary.guildInfo.name} (${performanceSummary.guildInfo.rank})` : "- Guild: Not in a guild"}

**Recent Activity:**
${truncateToTokens(JSON.stringify(recentActivities.slice(0, 10), null, 2), 800)}

**Instructions:**
Provide personalized recommendations to help this user improve their performance and advance to the next rank.

Respond with JSON in this exact format:
{
  "skillRecommendations": [
    {
      "skill": "string",
      "priority": "high" | "medium" | "low",
      "reasoning": "1-2 sentence explanation"
    }
  ],
  "bountyRecommendations": [
    {
      "category": "string",
      "reasoning": "Why this category?",
      "potentialReward": number (estimated credits)
    }
  ],
  "improvementAreas": [
    {
      "area": "string (e.g., Communication, Technical Skills)",
      "currentLevel": "string",
      "targetLevel": "string",
      "actionItems": ["action 1", "action 2"]
    }
  ],
  "rankProgression": {
    "currentRank": "${user.rank}",
    "nextRank": "string",
    "progressPercentage": number (0-100),
    "estimatedTimeToNextRank": "string (e.g., 2-3 weeks)",
    "requiredActions": ["action 1", "action 2", "action 3"]
  },
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "summary": "2-3 sentence overall assessment"
}

Provide 3-5 items for each array. Be specific, actionable, and encouraging.`;

  try {
    const aiResponse = await callGroqJSON<Omit<PersonalizedInsights, "analysisTime" | "model">>(
      prompt,
      {
        model: GroqModels.MIXTRAL,
        temperature: 0.6,
        maxTokens: 3072,
      }
    );

    return {
      ...aiResponse,
      analysisTime: Date.now() - startTime,
      model: GroqModels.MIXTRAL,
    };
  } catch (error) {
    console.error("Analytics AI error:", error);

    // Fallback: Basic algorithmic recommendations
    const fallbackInsights = generateFallbackInsights(
      user,
      performanceSummary
    );

    return {
      ...fallbackInsights,
      analysisTime: Date.now() - startTime,
      model: "fallback",
    };
  }
}

/**
 * Fallback recommendations when AI is unavailable
 */
function generateFallbackInsights(
  user: any,
  performance: any
): Omit<PersonalizedInsights, "analysisTime" | "model"> {
  const rankHierarchy = ["Rookie", "Veteran", "Elite", "Master", "Legendary"];
  const currentRankIndex = rankHierarchy.indexOf(user.rank);
  const nextRank =
    currentRankIndex < rankHierarchy.length - 1
      ? rankHierarchy[currentRankIndex + 1]
      : "Legendary";

  return {
    skillRecommendations: [
      {
        skill: "Communication",
        priority: "high",
        reasoning:
          "Clear communication reduces disputes and improves client satisfaction",
      },
      {
        skill: "Time Management",
        priority: "medium",
        reasoning: "Meeting deadlines consistently improves trust score",
      },
    ],
    bountyRecommendations: [
      {
        category: performance.categories[0] || "General",
        reasoning: "Continue in your strongest category to build expertise",
        potentialReward: Math.round(performance.averageReward * 1.2),
      },
    ],
    improvementAreas: [
      {
        area: "Success Rate",
        currentLevel: `${performance.successRate.toFixed(1)}%`,
        targetLevel: "90%+",
        actionItems: [
          "Take on bounties within your skill level",
          "Communicate early if you face challenges",
          "Document all work thoroughly",
        ],
      },
    ],
    rankProgression: {
      currentRank: user.rank,
      nextRank,
      progressPercentage: Math.min(
        90,
        (user.trustScore / 1000) * 100 + performance.successRate * 0.5
      ),
      estimatedTimeToNextRank: "2-4 weeks",
      requiredActions: [
        "Complete 5+ bounties successfully",
        "Maintain trust score above 700",
        "Avoid disputes",
      ],
    },
    strengths: [
      `${performance.completedBounties} completed bounties`,
      `Trust score: ${user.trustScore}/1000`,
    ],
    weaknesses: [
      performance.successRate < 80
        ? "Success rate could be improved"
        : "Consider taking on higher-value bounties",
    ],
    summary: `You're performing ${performance.successRate >= 80 ? "well" : "adequately"} with ${performance.completedBounties} completed bounties. Focus on ${performance.successRate < 80 ? "improving success rate" : "taking on more challenging work"} to reach ${nextRank} rank.`,
  };
}

/**
 * Get trending bounty categories
 * @returns Top 5 trending categories with stats
 */
export async function getTrendingCategories(): Promise<
  Array<{ category: string; count: number; avgReward: number }>
> {
  await connectDB();

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const trending = await Bounty.aggregate([
    { $match: { createdAt: { $gte: last30Days }, status: { $in: ["Open", "Assigned", "InProgress"] } } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        avgReward: { $avg: "$rewardCredits" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  return trending.map((t) => ({
    category: t._id,
    count: t.count,
    avgReward: Math.round(t.avgReward),
  }));
}
