import { z } from 'zod';

// Bounty validation schemas
export const createBountySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  location: z.object({
    city: z.string(),
    country: z.string(),
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  urgency: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  rewardCredits: z.number().min(100, 'Minimum reward is 100 credits'),
  reputationBonus: z.number().default(0),
  clientStake: z.number().default(0),
  guildStakeRequired: z.number().min(0),
  minHunterRank: z.enum(['Rookie', 'Veteran', 'Elite', 'Master', 'Legendary']).default('Rookie'),
  minGuildTrust: z.number().min(0).max(1000).default(0),
  requiredSkills: z.array(z.string()).default([]),
  evidenceRequirements: z.string().default('Proof of work completion'),
  deadline: z.string().or(z.date()),
});

export const updateBountySchema = z.object({
  title: z.string().min(10).max(200).optional(),
  description: z.string().min(50).optional(),
  urgency: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  rewardCredits: z.number().min(100).optional(),
  deadline: z.string().or(z.date()).optional(),
});

export const submitProofSchema = z.object({
  text: z.string().min(50, 'Proof description must be at least 50 characters'),
  images: z.array(z.string().url()).default([]),
  links: z.array(z.string().url()).default([]),
});

// Guild validation schemas
export const createGuildSchema = z.object({
  name: z.string().min(3, 'Guild name must be at least 3 characters').max(50, 'Guild name too long'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description too long'),
  avatar: z.string().default('🛡️'),
  banner: z.string().url().optional(),
  categories: z.array(z.string()).min(1, 'Select at least one specialization').max(5, 'Maximum 5 specializations'),
  foundingStake: z.number().min(5000, 'Minimum founding stake is 5,000 credits'),
});

export const updateGuildSchema = z.object({
  description: z.string().min(20).max(500).optional(),
  avatar: z.string().optional(),
  banner: z.string().url().optional(),
  categories: z.array(z.string()).min(1).max(5).optional(),
});

export const guildMemberActionSchema = z.object({
  action: z.enum(['promote', 'demote', 'kick']),
  userId: z.string(), // Changed from targetUserId to userId
  newRole: z.enum(['Guild Master', 'Elite Hunter', 'Senior Hunter', 'Hunter', 'Initiate']).optional(),
});

// Dispute validation schemas
export const raiseDisputeSchema = z.object({
  bountyId: z.string(),
  evidenceText: z.string().min(100, 'Evidence description must be at least 100 characters'),
  evidenceImages: z.array(z.string().url()).optional(),
  evidenceLinks: z.array(z.string().url()).optional(),
});

export const submitDisputeEvidenceSchema = z.object({
  disputeId: z.string(),
  evidenceText: z.string().min(50),
  evidenceImages: z.array(z.string().url()).optional(),
  evidenceLinks: z.array(z.string().url()).optional(),
});

export const tribunalVoteSchema = z.object({
  disputeId: z.string(),
  vote: z.enum(['ClientWins', 'GuildWins', 'Split']),
  stakeAmount: z.number().min(1000, 'Minimum tribunal stake is 1,000 credits'),
});

// Message validation schemas
export const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1).max(2000, 'Message too long'),
  attachments: z.array(z.string().url()).optional(),
  replyTo: z.string().optional(),
});

// Filter schemas
export const bountyFiltersSchema = z.object({
  category: z.string().optional(),
  minReward: z.number().optional(),
  maxReward: z.number().optional(),
  urgency: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  minHunterRank: z.enum(['Rookie', 'Veteran', 'Elite', 'Master', 'Legendary']).optional(),
  status: z.enum(['Open', 'Matched', 'Accepted', 'InProgress', 'Submitted', 'UnderReview', 'Disputed', 'Completed', 'Failed', 'Cancelled']).optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'reward-high', 'reward-low', 'deadline']).default('newest'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const guildFiltersSchema = z.object({
  rank: z.enum(['Legendary', 'Elite', 'Veteran', 'Established', 'Developing']).optional(),
  minTrustScore: z.number().min(0).max(1000).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['trust', 'rank', 'members', 'newest']).default('trust'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

export type CreateBountyInput = z.infer<typeof createBountySchema>;
export type UpdateBountyInput = z.infer<typeof updateBountySchema>;
export type SubmitProofInput = z.infer<typeof submitProofSchema>;
export type CreateGuildInput = z.infer<typeof createGuildSchema>;
export type UpdateGuildInput = z.infer<typeof updateGuildSchema>;
export type GuildMemberAction = z.infer<typeof guildMemberActionSchema>;
export type RaiseDisputeInput = z.infer<typeof raiseDisputeSchema>;
export type SubmitDisputeEvidenceInput = z.infer<typeof submitDisputeEvidenceSchema>;
export type TribunalVoteInput = z.infer<typeof tribunalVoteSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type BountyFilters = z.infer<typeof bountyFiltersSchema>;
export type GuildFilters = z.infer<typeof guildFiltersSchema>;

// AI Agent validation schemas
export const matchBountySchema = z.object({
  bountyId: z.string().min(1, 'Bounty ID is required'),
});

export const analyzeDisputeSchema = z.object({
  disputeId: z.string().min(1, 'Dispute ID is required'),
});

export const detectAnomaliesSchema = z.object({
  days: z.number().min(1).max(30).default(7),
  minRiskScore: z.number().min(0).max(100).default(60),
});

export const generateInsightsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export type MatchBountyInput = z.infer<typeof matchBountySchema>;
export type AnalyzeDisputeInput = z.infer<typeof analyzeDisputeSchema>;
export type DetectAnomaliesInput = z.infer<typeof detectAnomaliesSchema>;
export type GenerateInsightsInput = z.infer<typeof generateInsightsSchema>;

