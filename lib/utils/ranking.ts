import { User } from '@/lib/db/models/User';
import Guild from '@/lib/db/models/Guild';
import Bounty from '@/lib/db/models/Bounty';
import Dispute from '@/lib/db/models/Dispute';
import Activity from '@/lib/db/models/Activity';
import { connectDB } from '@/lib/db/mongodb';

// User rank thresholds
export const USER_RANK_THRESHOLDS = {
  Legendary: 900,
  Master: 750,
  Elite: 600,
  Veteran: 400,
  Rookie: 0,
} as const;

// Guild rank thresholds
export const GUILD_RANK_THRESHOLDS = {
  Legendary: 900,
  Elite: 750,
  Veteran: 600,
  Established: 400,
  Developing: 0,
} as const;

export type UserRank = keyof typeof USER_RANK_THRESHOLDS;
export type GuildRank = keyof typeof GUILD_RANK_THRESHOLDS;

/**
 * Calculate user trust score based on multiple factors
 * Formula: (SuccessRate×300) + (CompletionCount/100×200) + (AvgClientRating×100) + 
 *          (DisputeWinRate×200) + (ActivityBonus×100) + (GuildContribution×100) - DisputeLossPenalty
 */
export async function calculateUserTrustScore(userId: string): Promise<number> {
  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) return 0;

    // Get bounties where user was assigned as hunter
    const completedBounties = await Bounty.countDocuments({
      assignedHunterIds: userId,
      status: 'Completed',
    });

    const totalBounties = await Bounty.countDocuments({
      assignedHunterIds: userId,
      status: { $in: ['Completed', 'Failed', 'Cancelled'] },
    });

    // Success rate (0-100%)
    const successRate = totalBounties > 0 ? (completedBounties / totalBounties) * 100 : 50; // Default 50% for new users

    // Completion count bonus (scales with experience)
    const completionBonus = Math.min(completedBounties / 100, 1); // Max at 100 completions

    // Average client rating (assuming stored in user model, default 70%)
    const avgClientRating = user.clientRating || 0.7;

    // Dispute stats
    const disputesInvolved = await Dispute.countDocuments({
      $or: [
        { clientId: userId },
        { guildId: user.guildId },
      ],
    });

    const disputesWon = await Dispute.countDocuments({
      $or: [
        { clientId: userId, finalRuling: 'ClientWins' },
        { guildId: user.guildId, finalRuling: 'GuildWins' },
      ],
    });

    const disputeWinRate = disputesInvolved > 0 ? disputesWon / disputesInvolved : 0.5; // Default 50%

    // Activity bonus (based on recent activity)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivities = await Activity.countDocuments({
      userId: userId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    const activityBonus = Math.min(recentActivities / 50, 1); // Max at 50 activities per month

    // Guild contribution (if in a guild)
    let guildContribution = 0.5;
    if (user.guildId) {
      const guild = await Guild.findById(user.guildId);
      if (guild) {
        // Contribution based on role and guild success
        if (guild.masterId.toString() === userId) {
          guildContribution = 1.0; // Guild Master
        } else if (guild.officerIds.some(id => id.toString() === userId)) {
          guildContribution = 0.8; // Officer
        } else {
          guildContribution = 0.6; // Member
        }
      }
    }

    // Dispute loss penalty
    const disputesLost = disputesInvolved - disputesWon;
    const disputeLossPenalty = disputesLost * 20; // -20 points per dispute lost

    // Calculate final score
    const trustScore = Math.round(
      (successRate * 3) +           // Max 300 points
      (completionBonus * 200) +     // Max 200 points
      (avgClientRating * 100) +     // Max 100 points
      (disputeWinRate * 200) +      // Max 200 points
      (activityBonus * 100) +       // Max 100 points
      (guildContribution * 100) -   // Max 100 points
      disputeLossPenalty            // Penalty
    );

    // Clamp between 0 and 1000
    return Math.max(0, Math.min(1000, trustScore));
  } catch (error) {
    console.error('Calculate user trust score error:', error);
    return 0;
  }
}

/**
 * Calculate guild trust score
 * Formula: (MissionSuccessRate×300) + (AvgHunterTrust×0.3×250) + (DisputeWinRate×200) +
 *          (TotalValueCleared/10000×150) + (CommunityParticipation×100) - FailurePenalty
 */
export async function calculateGuildTrustScore(guildId: string): Promise<number> {
  try {
    await connectDB();

    const guild = await Guild.findById(guildId);
    if (!guild) return 0;

    // Mission success rate
    const completedBounties = await Bounty.countDocuments({
      acceptedByGuildId: guildId,
      status: 'Completed',
    });

    const totalBounties = await Bounty.countDocuments({
      acceptedByGuildId: guildId,
      status: { $in: ['Completed', 'Failed', 'Cancelled', 'Disputed'] },
    });

    const missionSuccessRate = totalBounties > 0 ? (completedBounties / totalBounties) * 100 : 50;

    // Average hunter trust (average trust of all guild members)
    const allMemberIds = [
      guild.masterId,
      ...guild.officerIds,
      ...guild.memberIds,
    ];

    const members = await User.find({ _id: { $in: allMemberIds } });
    const avgHunterTrust = members.length > 0
      ? members.reduce((sum, m) => sum + (m.trustScore || 0), 0) / members.length
      : 100;

    // Dispute win rate
    const disputesInvolved = await Dispute.countDocuments({
      guildId: guildId,
    });

    const disputesWon = await Dispute.countDocuments({
      guildId: guildId,
      finalRuling: 'GuildWins',
    });

    const disputeWinRate = disputesInvolved > 0 ? disputesWon / disputesInvolved : 0.5;

    // Total value cleared (normalized)
    const totalValueCleared = guild.totalValueCleared || 0;
    const valueBonus = Math.min(totalValueCleared / 10000, 1); // Max at 10,000 credits cleared

    // Community participation (based on activity)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivities = await Activity.countDocuments({
      relatedGuildId: guildId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    const communityParticipation = Math.min(recentActivities / 100, 1); // Max at 100 activities

    // Failure penalty
    const failedBounties = await Bounty.countDocuments({
      acceptedByGuildId: guildId,
      status: { $in: ['Failed', 'Cancelled'] },
    });

    const failurePenalty = failedBounties * 15; // -15 points per failed bounty

    // Calculate final score
    const trustScore = Math.round(
      (missionSuccessRate * 3) +         // Max 300 points
      (avgHunterTrust * 0.3 * 2.5) +     // Max 250 points (scaled from 0-1000)
      (disputeWinRate * 200) +           // Max 200 points
      (valueBonus * 150) +               // Max 150 points
      (communityParticipation * 100) -   // Max 100 points
      failurePenalty                     // Penalty
    );

    // Clamp between 0 and 1000
    return Math.max(0, Math.min(1000, trustScore));
  } catch (error) {
    console.error('Calculate guild trust score error:', error);
    return 0;
  }
}

/**
 * Update user rank based on trust score
 */
export async function updateUserRank(userId: string): Promise<UserRank> {
  try {
    await connectDB();

    const trustScore = await calculateUserTrustScore(userId);
    
    let newRank: UserRank = 'Rookie';
    
    if (trustScore >= USER_RANK_THRESHOLDS.Legendary) {
      newRank = 'Legendary';
    } else if (trustScore >= USER_RANK_THRESHOLDS.Master) {
      newRank = 'Master';
    } else if (trustScore >= USER_RANK_THRESHOLDS.Elite) {
      newRank = 'Elite';
    } else if (trustScore >= USER_RANK_THRESHOLDS.Veteran) {
      newRank = 'Veteran';
    }

    // Update user
    const user = await User.findById(userId);
    if (user) {
      const oldRank = user.rank;
      user.trustScore = trustScore;
      user.rank = newRank;
      await user.save();

      // Record activity if rank changed
      if (oldRank !== newRank) {
        const rankUp = USER_RANK_THRESHOLDS[newRank] > USER_RANK_THRESHOLDS[oldRank as UserRank];
        
        await Activity.create({
          userId: userId,
          type: rankUp ? 'RankUp' : 'RankDown',
          description: `Rank ${rankUp ? 'promoted' : 'demoted'} to ${newRank}`,
          impactOnTrust: rankUp ? 10 : -10,
          impactOnCredits: 0,
        });
      }
    }

    return newRank;
  } catch (error) {
    console.error('Update user rank error:', error);
    return 'Rookie';
  }
}

/**
 * Update guild rank based on trust score
 */
export async function updateGuildRank(guildId: string): Promise<GuildRank> {
  try {
    await connectDB();

    const trustScore = await calculateGuildTrustScore(guildId);
    
    let newRank: GuildRank = 'Developing';
    
    if (trustScore >= GUILD_RANK_THRESHOLDS.Legendary) {
      newRank = 'Legendary';
    } else if (trustScore >= GUILD_RANK_THRESHOLDS.Elite) {
      newRank = 'Elite';
    } else if (trustScore >= GUILD_RANK_THRESHOLDS.Veteran) {
      newRank = 'Veteran';
    } else if (trustScore >= GUILD_RANK_THRESHOLDS.Established) {
      newRank = 'Established';
    }

    // Update guild
    const guild = await Guild.findById(guildId);
    if (guild) {
      guild.trustScore = trustScore;
      guild.rank = newRank;
      await guild.save();
    }

    return newRank;
  } catch (error) {
    console.error('Update guild rank error:', error);
    return 'Developing';
  }
}

/**
 * Apply trust decay for inactive users
 * Every 7 days of inactivity: -1% trust (max -20% over 6 months)
 */
export async function applyTrustDecay(userId: string): Promise<void> {
  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) return;

    // Get last activity
    const lastActivity = await Activity.findOne({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!lastActivity) return;

    const now = new Date();
    const daysSinceActivity = Math.floor(
      (now.getTime() - new Date(lastActivity.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Apply decay if inactive for 7+ days
    if (daysSinceActivity >= 7) {
      const weeksInactive = Math.floor(daysSinceActivity / 7);
      const decayPercent = Math.min(weeksInactive * 0.01, 0.20); // Max 20% decay
      
      const currentTrust = user.trustScore || 100;
      const newTrust = Math.round(currentTrust * (1 - decayPercent));
      
      user.trustScore = Math.max(0, newTrust);
      await user.save();
    }
  } catch (error) {
    console.error('Apply trust decay error:', error);
  }
}

/**
 * Batch update all user ranks (can be run periodically)
 */
export async function batchUpdateUserRanks(): Promise<void> {
  try {
    await connectDB();

    const users = await User.find({}).select('_id');
    
    for (const user of users) {
      await updateUserRank(user._id.toString());
    }

    console.log(`Updated ranks for ${users.length} users`);
  } catch (error) {
    console.error('Batch update user ranks error:', error);
  }
}

/**
 * Batch update all guild ranks (can be run periodically)
 */
export async function batchUpdateGuildRanks(): Promise<void> {
  try {
    await connectDB();

    const guilds = await Guild.find({}).select('_id');
    
    for (const guild of guilds) {
      await updateGuildRank(guild._id.toString());
    }

    console.log(`Updated ranks for ${guilds.length} guilds`);
  } catch (error) {
    console.error('Batch update guild ranks error:', error);
  }
}
