// Core Types for GuildLancer

export type UserRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export type GuildRank = 'Legendary' | 'Elite' | 'Veteran' | 'Established' | 'Developing';
export type GuildRole = 'Master' | 'Officer' | 'Veteran' | 'Member' | 'Initiate';
export type BountyStatus = 'Open' | 'Matched' | 'Accepted' | 'InProgress' | 'Submitted' | 'UnderReview' | 'Disputed' | 'Completed' | 'Failed' | 'Cancelled';
export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type DisputeTier = 'Negotiation' | 'AIArbiter' | 'Tribunal';
export type DisputeStatus = 'Open' | 'Negotiating' | 'AIAnalysis' | 'InTribunal' | 'Resolved';
export type DisputeRuling = 'ClientWins' | 'GuildWins' | 'Split';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  rank: UserRank;
  trustScore: number;
  credits: number;
  stakedCredits: number;
  guildId?: string;
  guildRole?: GuildRole;
  clientReputation: number;
  hunterReputation: number;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
}

export interface Guild {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  description: string;
  foundedAt: Date;
  founderIds: string[];
  masterId: string;
  officerIds: string[];
  memberIds: string[];
  rank: GuildRank;
  trustScore: number;
  successRate: number;
  totalBountiesCompleted: number;
  totalValueCleared: number;
  disputeWinRate: number;
  treasuryBalance: number;
  stakedAmount: number;
  categories: string[];
  updatedAt: Date;
}

export interface Bounty {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  location?: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  urgency: UrgencyLevel;
  rewardCredits: number;
  reputationBonus: number;
  clientStake: number;
  guildStakeRequired: number;
  minHunterRank: UserRank;
  minGuildTrust: number;
  requiredSkills: string[];
  evidenceRequirements: string;
  acceptedByGuildId?: string;
  assignedHunterIds: string[];
  guildStakeLocked: number;
  proofOfWork?: {
    text: string;
    images: string[];
    links: string[];
  };
  submittedAt?: Date;
  status: BountyStatus;
  disputeId?: string;
  deadline: Date;
  postedAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

export interface Dispute {
  id: string;
  bountyId: string;
  clientId: string;
  guildId: string;
  clientEvidence: {
    text: string;
    images: string[];
    links: string[];
  };
  guildEvidence: {
    text: string;
    images: string[];
    links: string[];
  };
  tier: DisputeTier;
  status: DisputeStatus;
  aiSuggestion?: {
    ruling: DisputeRuling;
    confidenceScore: number;
    reasoning: string;
    generatedAt: Date;
    aiStake: number;
  };
  tribunalJurors?: string[];
  tribunalVotes?: {
    guildId: string;
    vote: DisputeRuling;
    stakedAmount: number;
  }[];
  finalRuling?: DisputeRuling;
  resolvedAt?: Date;
  clientStakeAtRisk: number;
  guildStakeAtRisk: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  replyTo?: string;
  reactions: {
    emoji: string;
    userIds: string[];
  }[];
  sentAt: Date;
  editedAt?: Date;
}

export interface Transaction {
  id: string;
  userId?: string;
  guildId?: string;
  bountyId?: string;
  disputeId?: string;
  type: 'BountyReward' | 'BountyStake' | 'TribunalStake' | 'DisputeWin' | 'DisputeLoss' | 'GuildDeposit' | 'GuildWithdrawal' | 'PassiveYield';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'BountyPosted' | 'BountyAccepted' | 'BountyCompleted' | 'DisputeRaised' | 'DisputeResolved' | 'GuildJoined' | 'GuildLeft' | 'TribunalVote' | 'RankUp' | 'RankDown';
  relatedBountyId?: string;
  relatedGuildId?: string;
  relatedDisputeId?: string;
  description: string;
  impactOnTrust: number;
  impactOnCredits: number;
  createdAt: Date;
}

// UI Helper Types
export interface GuildWithMembers extends Guild {
  master: User;
  officers: User[];
  members: User[];
}

export interface BountyWithDetails extends Bounty {
  client: User;
  guild?: Guild;
  hunters: User[];
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}
