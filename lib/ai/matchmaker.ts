// lib/ai/matchmaker.ts
// Matchmaker Agent - AI-powered bounty-guild matching

import { callGroqJSON, GroqModels, truncateToTokens } from "./groq";
import { connectDB } from "@/lib/db";
import Bounty from "@/lib/db/models/Bounty";
import Guild from "@/lib/db/models/Guild";
import { User } from "@/lib/db/models/User";

export interface GuildMatch {
  guildId: string;
  guildName: string;
  matchScore: number; // 0-100
  reasoning: string;
  trustScore: number;
  rank: string;
  successRate: number;
}

export interface MatchmakerResponse {
  matches: GuildMatch[];
  analysisTime: number;
  model: string;
}

/**
 * Match bounty to top guilds using AI analysis
 * @param bountyId - Bounty to match
 * @returns Top 5 guild matches with reasoning
 */
export async function matchBountyToGuilds(
  bountyId: string
): Promise<MatchmakerResponse> {
  const startTime = Date.now();

  await connectDB();

  // Fetch bounty details
  const bounty = await Bounty.findById(bountyId)
    .populate("clientId", "username trustScore")
    .lean();

  if (!bounty) {
    throw new Error("Bounty not found");
  }

  // Fetch eligible guilds (meeting minimum requirements)
  const eligibleGuilds = await Guild.find({
    trustScore: { $gte: bounty.minGuildTrust || 0 },
    status: "Active",
  })
    .populate("masterId", "username rank trustScore")
    .lean();

  if (eligibleGuilds.length === 0) {
    return {
      matches: [],
      analysisTime: Date.now() - startTime,
      model: GroqModels.MIXTRAL,
    };
  }

  // Prepare guild data for AI
  const guildSummaries = eligibleGuilds.slice(0, 20).map((guild: any) => ({
    id: guild._id.toString(),
    name: guild.name,
    trustScore: guild.trustScore,
    rank: guild.rank,
    categories: guild.categories,
    successRate: guild.successRate || 0,
    completedBounties: guild.completedBounties || 0,
    disputeLossRate: guild.disputeLossRate || 0,
    memberCount: guild.memberIds?.length || 0,
    avgCompletionTime: guild.avgCompletionTime || "N/A",
    treasury: guild.treasury || 0,
  }));

  // Construct AI prompt
  const prompt = `You are an expert bounty-guild matchmaker for a freelance platform. Analyze the bounty and rank the top 5 guilds most suitable to complete it.

**Bounty Details:**
- Title: ${bounty.title}
- Category: ${bounty.category}
- Description: ${truncateToTokens(bounty.description, 500)}
- Required Skills: ${bounty.requiredSkills?.join(", ") || "Not specified"}
- Reward: ${bounty.rewardCredits} credits
- Urgency: ${bounty.urgency}
- Minimum Hunter Rank: ${bounty.minHunterRank}
- Minimum Guild Trust: ${bounty.minGuildTrust}
- Deadline: ${bounty.deadline ? new Date(bounty.deadline).toLocaleDateString() : "Not set"}
- Evidence Requirements: ${truncateToTokens(bounty.evidenceRequirements || "Standard", 200)}

**Available Guilds:**
${JSON.stringify(guildSummaries, null, 2)}

**Instructions:**
Rank the top 5 guilds based on:
1. Category alignment (does guild specialize in this work?)
2. Trust score and reliability
3. Success rate and completion history
4. Member count and capacity
5. Dispute history (lower loss rate = better)
6. Treasury reserves (can they stake?)

Respond with JSON in this exact format:
{
  "matches": [
    {
      "guildId": "string",
      "guildName": "string",
      "matchScore": number (0-100),
      "reasoning": "2-3 sentence explanation"
    }
  ]
}

Provide exactly 5 matches (or fewer if less than 5 guilds available). Order by matchScore descending.`;

  try {
    const aiResponse = await callGroqJSON<{ matches: Array<{
      guildId: string;
      guildName: string;
      matchScore: number;
      reasoning: string;
    }> }>(prompt, {
      model: GroqModels.MIXTRAL,
      temperature: 0.4,
      maxTokens: 2048,
    });

    // Enrich AI matches with guild data
    const enrichedMatches: GuildMatch[] = aiResponse.matches.map((match) => {
      const guild = eligibleGuilds.find(
        (g: any) => g._id.toString() === match.guildId
      );

      return {
        guildId: match.guildId,
        guildName: match.guildName,
        matchScore: Math.min(100, Math.max(0, match.matchScore)), // Clamp 0-100
        reasoning: match.reasoning,
        trustScore: guild?.trustScore || 0,
        rank: guild?.rank || "Unknown",
        successRate: guild?.successRate || 0,
      };
    });

    return {
      matches: enrichedMatches.slice(0, 5),
      analysisTime: Date.now() - startTime,
      model: GroqModels.MIXTRAL,
    };
  } catch (error) {
    console.error("Matchmaker AI error:", error);
    
    // Fallback: Basic algorithmic matching
    const fallbackMatches = eligibleGuilds
      .slice(0, 5)
      .map((guild: any) => ({
        guildId: guild._id.toString(),
        guildName: guild.name,
        matchScore: calculateBasicMatchScore(bounty, guild),
        reasoning: "AI unavailable - using basic algorithmic matching based on trust score and success rate",
        trustScore: guild.trustScore,
        rank: guild.rank,
        successRate: guild.successRate || 0,
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    return {
      matches: fallbackMatches,
      analysisTime: Date.now() - startTime,
      model: "fallback",
    };
  }
}

/**
 * Basic algorithmic match score (fallback)
 */
function calculateBasicMatchScore(bounty: any, guild: any): number {
  let score = 0;

  // Trust score (0-40 points)
  score += (guild.trustScore / 1000) * 40;

  // Success rate (0-30 points)
  score += (guild.successRate || 0) * 0.3;

  // Category match (0-20 points)
  if (guild.categories?.includes(bounty.category)) {
    score += 20;
  }

  // Rank bonus (0-10 points)
  const rankBonus: Record<string, number> = {
    Legendary: 10,
    Elite: 8,
    Veteran: 6,
    Established: 4,
    Developing: 2,
  };
  score += rankBonus[guild.rank] || 0;

  return Math.min(100, Math.round(score));
}
