// lib/ai/arbiter.ts
// Arbiter Agent - AI-powered dispute analysis and resolution

import { callGroqJSON, GroqModels, truncateToTokens } from "./groq";
import { connectDB } from "@/lib/db";
import Dispute from "@/lib/db/models/Dispute";
import Bounty from "@/lib/db/models/Bounty";
import Guild from "@/lib/db/models/Guild";
import { User } from "@/lib/db/models/User";

export type DisputeRuling = "ClientWins" | "GuildWins" | "Split";

export interface SplitDetails {
  clientPercentage: number;
  guildPercentage: number;
}

export interface ArbiterAnalysis {
  ruling: DisputeRuling;
  splitDetails?: SplitDetails;
  confidenceScore: number; // 0-100
  summary: string;
  keyPoints: string[];
  evidenceEvaluation: {
    clientEvidenceStrength: number; // 0-100
    guildEvidenceStrength: number; // 0-100
  };
  reasoning: string;
  analysisTime: number;
  model: string;
}

/**
 * Analyze dispute using AI and provide ruling suggestion
 * @param disputeId - Dispute to analyze
 * @returns AI analysis with ruling suggestion
 */
export async function analyzeDispute(
  disputeId: string
): Promise<ArbiterAnalysis> {
  const startTime = Date.now();

  await connectDB();

  // Fetch dispute with all related data
  const dispute = await Dispute.findById(disputeId)
    .populate("clientId", "username trustScore rank")
    .populate("guildId", "name trustScore rank successRate")
    .populate("bountyId")
    .lean();

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  const bounty: any = dispute.bountyId;

  // Construct comprehensive AI prompt
  const prompt = `You are an impartial dispute arbiter for a freelance platform. Analyze this conflict between a client and a guild, then provide a fair ruling suggestion.

**Bounty Details:**
- Title: ${bounty.title}
- Category: ${bounty.category}
- Description: ${truncateToTokens(bounty.description, 400)}
- Requirements: ${truncateToTokens(bounty.evidenceRequirements || "Standard proof of work", 200)}
- Reward: ${bounty.rewardCredits} credits
- Deadline: ${bounty.deadline ? new Date(bounty.deadline).toLocaleDateString() : "Not set"}

**Client Profile:**
- Username: ${(dispute.clientId as any).username}
- Trust Score: ${(dispute.clientId as any).trustScore}/1000
- Rank: ${(dispute.clientId as any).rank}

**Guild Profile:**
- Name: ${(dispute.guildId as any).name}
- Trust Score: ${(dispute.guildId as any).trustScore}/1000
- Rank: ${(dispute.guildId as any).rank}
- Success Rate: ${((dispute.guildId as any).successRate || 0).toFixed(1)}%

**Guild's Submission:**
${truncateToTokens(bounty.submissionProof?.text || "No submission text provided", 500)}
${bounty.submissionProof?.images?.length ? `\n- Images Provided: ${bounty.submissionProof.images.length}` : ""}
${bounty.submissionProof?.links?.length ? `\n- Links Provided: ${bounty.submissionProof.links.join(", ")}` : ""}

**Client's Dispute Claim:**
${truncateToTokens(dispute.clientEvidence?.text || "No dispute reasoning provided", 400)}
${dispute.clientEvidence?.images?.length ? `\n- Evidence Images: ${dispute.clientEvidence.images.length}` : ""}

**Guild's Defense:**
${truncateToTokens(dispute.guildEvidence?.text || "No defense submitted yet", 400)}
${dispute.guildEvidence?.images?.length ? `\n- Defense Images: ${dispute.guildEvidence.images.length}` : ""}

**Instructions:**
Analyze this dispute objectively considering:
1. Did the guild fulfill the stated requirements?
2. Is the client's rejection reasonable?
3. Quality and completeness of evidence from both sides
4. Historical trust scores and behavior patterns
5. Industry standards for this type of work

Respond with JSON in this exact format:
{
  "ruling": "ClientWins" | "GuildWins" | "Split",
  "splitDetails": {
    "clientPercentage": number (0-100, only if ruling is Split),
    "guildPercentage": number (0-100, only if ruling is Split)
  },
  "confidenceScore": number (0-100),
  "summary": "1-2 sentence summary of the dispute",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "evidenceEvaluation": {
    "clientEvidenceStrength": number (0-100),
    "guildEvidenceStrength": number (0-100)
  },
  "reasoning": "2-4 sentence explanation for the ruling"
}

**Ruling Guidelines:**
- ClientWins: Guild clearly failed to meet requirements
- GuildWins: Guild met requirements, client's rejection is unfair
- Split: Partial fulfillment or ambiguous situation (suggest fair percentage split)

Be objective, fair, and base your decision on evidence quality and requirement fulfillment.`;

  try {
    const aiResponse = await callGroqJSON<{
      ruling: DisputeRuling;
      splitDetails?: SplitDetails;
      confidenceScore: number;
      summary: string;
      keyPoints: string[];
      evidenceEvaluation: {
        clientEvidenceStrength: number;
        guildEvidenceStrength: number;
      };
      reasoning: string;
    }>(prompt, {
      model: GroqModels.MIXTRAL,
      temperature: 0.3, // Lower temp for consistency
      maxTokens: 2048,
    });

    // Validate and normalize response
    const ruling = aiResponse.ruling || "Split";
    const confidenceScore = Math.min(100, Math.max(0, aiResponse.confidenceScore || 50));

    // Ensure split percentages add to 100
    if (ruling === "Split" && aiResponse.splitDetails) {
      const client = aiResponse.splitDetails.clientPercentage;
      const guild = aiResponse.splitDetails.guildPercentage;
      if (Math.abs(client + guild - 100) > 1) {
        // Normalize if they don't add up
        const total = client + guild;
        aiResponse.splitDetails.clientPercentage = Math.round((client / total) * 100);
        aiResponse.splitDetails.guildPercentage = 100 - aiResponse.splitDetails.clientPercentage;
      }
    }

    return {
      ruling,
      splitDetails: ruling === "Split" ? aiResponse.splitDetails : undefined,
      confidenceScore,
      summary: aiResponse.summary || "Dispute analysis completed",
      keyPoints: aiResponse.keyPoints || [],
      evidenceEvaluation: {
        clientEvidenceStrength: Math.min(100, Math.max(0, aiResponse.evidenceEvaluation?.clientEvidenceStrength || 50)),
        guildEvidenceStrength: Math.min(100, Math.max(0, aiResponse.evidenceEvaluation?.guildEvidenceStrength || 50)),
      },
      reasoning: aiResponse.reasoning || "Based on evidence analysis and requirement fulfillment",
      analysisTime: Date.now() - startTime,
      model: GroqModels.MIXTRAL,
    };
  } catch (error) {
    console.error("Arbiter AI error:", error);

    // Fallback: Basic algorithmic analysis
    const fallbackAnalysis = generateFallbackAnalysis(dispute, bounty);

    return {
      ...fallbackAnalysis,
      analysisTime: Date.now() - startTime,
      model: "fallback",
    };
  }
}

/**
 * Fallback analysis when AI is unavailable
 */
function generateFallbackAnalysis(dispute: any, bounty: any): Omit<ArbiterAnalysis, "analysisTime" | "model"> {
  // Basic logic: favor party with higher trust score if evidence is unclear
  const clientTrust = (dispute.clientId as any).trustScore || 500;
  const guildTrust = (dispute.guildId as any).trustScore || 500;
  const trustDiff = Math.abs(clientTrust - guildTrust);

  // Check if submission exists
  const hasSubmission = bounty.submissionProof?.text || bounty.submissionProof?.images?.length > 0;

  let ruling: DisputeRuling = "Split";
  let splitDetails: SplitDetails | undefined = { clientPercentage: 50, guildPercentage: 50 };
  let confidenceScore = 50;

  if (!hasSubmission) {
    ruling = "ClientWins";
    confidenceScore = 80;
    splitDetails = undefined;
  } else if (trustDiff > 200) {
    // Significant trust difference
    if (guildTrust > clientTrust) {
      ruling = "GuildWins";
      confidenceScore = 60;
      splitDetails = undefined;
    } else {
      ruling = "ClientWins";
      confidenceScore = 60;
      splitDetails = undefined;
    }
  }

  return {
    ruling,
    splitDetails,
    confidenceScore,
    summary: "AI analysis unavailable - using basic algorithmic evaluation based on trust scores and submission completeness",
    keyPoints: [
      `Client trust score: ${clientTrust}/1000`,
      `Guild trust score: ${guildTrust}/1000`,
      `Submission ${hasSubmission ? "provided" : "missing"}`,
    ],
    evidenceEvaluation: {
      clientEvidenceStrength: dispute.clientEvidence?.text ? 70 : 30,
      guildEvidenceStrength: hasSubmission ? 70 : 30,
    },
    reasoning: "Fallback analysis based on trust scores and submission completeness. Human review recommended.",
  };
}
