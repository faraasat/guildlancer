'use server';

import { connectDB } from '@/lib/db/mongodb';
import Bounty from '@/lib/db/models/Bounty';
import { User } from '@/lib/db/models/User';
import Guild from '@/lib/db/models/Guild';
import Transaction from '@/lib/db/models/Transaction';
import Activity from '@/lib/db/models/Activity';
import { createBountySchema, submitProofSchema, bountyFiltersSchema, type CreateBountyInput, type SubmitProofInput, type BountyFilters } from '@/lib/validations/backend';
import { auth } from '@/lib/auth';
import mongoose from 'mongoose';

// Create a new bounty
export async function createBounty(data: CreateBountyInput) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    const validated = createBountySchema.parse(data);
    
    // Check if user has enough credits for stake
    const user = await User.findById(session.user.id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.credits < validated.clientStake) {
      return { success: false, error: 'Insufficient credits for stake' };
    }

    // Create bounty
    const bounty = await Bounty.create({
      clientId: session.user.id,
      ...validated,
      deadline: new Date(validated.deadline),
      status: 'Open',
      postedAt: new Date(),
    });

    // Deduct client stake if any
    if (validated.clientStake > 0) {
      user.credits -= validated.clientStake;
      await user.save();

      // Record transaction
      await Transaction.create({
        userId: session.user.id,
        bountyId: bounty._id,
        type: 'BountyStake',
        amount: -validated.clientStake,
        balanceAfter: user.credits,
        description: `Staked ${validated.clientStake} credits for bounty: ${validated.title}`,
      });
    }

    // Record activity
    await Activity.create({
      userId: session.user.id,
      type: 'BountyPosted',
      relatedBountyId: bounty._id,
      description: `Posted bounty: ${validated.title}`,
      impactOnTrust: 0,
      impactOnCredits: -validated.clientStake,
    });

    return { success: true, data: { bountyId: bounty._id.toString() } };
  } catch (error: any) {
    console.error('Create bounty error:', error);
    return { success: false, error: error.message || 'Failed to create bounty' };
  }
}

// Get open bounties with filters
export async function getOpenBounties(filters: BountyFilters) {
  try {
    await connectDB();
    
    const validated = bountyFiltersSchema.parse(filters);
    
    // Build query
    const query: any = { status: validated.status || 'Open' };
    
    if (validated.category) {
      query.category = validated.category;
    }
    
    if (validated.minReward || validated.maxReward) {
      query.rewardCredits = {};
      if (validated.minReward) query.rewardCredits.$gte = validated.minReward;
      if (validated.maxReward) query.rewardCredits.$lte = validated.maxReward;
    }
    
    if (validated.urgency) {
      query.urgency = validated.urgency;
    }
    
    if (validated.minHunterRank) {
      query.minHunterRank = validated.minHunterRank;
    }
    
    if (validated.search) {
      query.$or = [
        { title: { $regex: validated.search, $options: 'i' } },
        { description: { $regex: validated.search, $options: 'i' } },
      ];
    }
    
    // Sort options
    let sort: any = {};
    switch (validated.sort) {
      case 'newest':
        sort = { postedAt: -1 };
        break;
      case 'reward-high':
        sort = { rewardCredits: -1 };
        break;
      case 'reward-low':
        sort = { rewardCredits: 1 };
        break;
      case 'deadline':
        sort = { deadline: 1 };
        break;
    }
    
    const skip = (validated.page - 1) * validated.limit;
    
    const [bounties, total] = await Promise.all([
      Bounty.find(query)
        .sort(sort)
        .skip(skip)
        .limit(validated.limit)
        .populate('clientId', 'username avatar')
        .lean(),
      Bounty.countDocuments(query),
    ]);
    
    return {
      success: true,
      data: {
        bounties: JSON.parse(JSON.stringify(bounties)),
        total,
        page: validated.page,
        pages: Math.ceil(total / validated.limit),
      },
    };
  } catch (error: any) {
    console.error('Get bounties error:', error);
    return { success: false, error: error.message || 'Failed to fetch bounties' };
  }
}

// Accept a bounty (Guild accepts)
export async function acceptBounty(bountyId: string, guildId: string) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Find bounty
    const bounty = await Bounty.findById(bountyId);
    if (!bounty) {
      return { success: false, error: 'Bounty not found' };
    }

    if (bounty.status !== 'Open') {
      return { success: false, error: 'Bounty is not available' };
    }

    // Find guild
    const guild = await Guild.findById(guildId);
    if (!guild) {
      return { success: false, error: 'Guild not found' };
    }

    // Check if user is Guild Master
    if (guild.masterId.toString() !== session.user.id) {
      return { success: false, error: 'Only Guild Master can accept bounties' };
    }

    // Check if guild meets requirements
    if (guild.trustScore < bounty.minGuildTrust) {
      return { success: false, error: 'Guild does not meet trust score requirement' };
    }

    // Check if guild has enough credits for stake
    if (guild.treasuryBalance < bounty.guildStakeRequired) {
      return { success: false, error: 'Insufficient guild treasury for stake' };
    }

    // Lock guild stake
    guild.treasuryBalance -= bounty.guildStakeRequired;
    guild.stakedAmount += bounty.guildStakeRequired;
    await guild.save();

    // Update bounty
    bounty.status = 'Accepted';
    bounty.acceptedByGuildId = new mongoose.Types.ObjectId(guildId);
    bounty.guildStakeLocked = bounty.guildStakeRequired;
    await bounty.save();

    // Record transaction
    await Transaction.create({
      guildId: guild._id,
      bountyId: bounty._id,
      type: 'BountyStake',
      amount: -bounty.guildStakeRequired,
      balanceAfter: guild.treasuryBalance,
      description: `Staked ${bounty.guildStakeRequired} credits for bounty: ${bounty.title}`,
    });

    // Record activity
    await Activity.create({
      userId: session.user.id,
      type: 'BountyAccepted',
      relatedBountyId: bounty._id,
      relatedGuildId: guild._id,
      description: `Accepted bounty: ${bounty.title}`,
      impactOnTrust: 0,
      impactOnCredits: 0,
    });

    return { success: true, message: 'Bounty accepted successfully' };
  } catch (error: any) {
    console.error('Accept bounty error:', error);
    return { success: false, error: error.message || 'Failed to accept bounty' };
  }
}

// Submit proof of work
export async function submitBountyProof(bountyId: string, proof: SubmitProofInput) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate proof
    const validated = submitProofSchema.parse(proof);

    // Find bounty
    const bounty = await Bounty.findById(bountyId);
    if (!bounty) {
      return { success: false, error: 'Bounty not found' };
    }

    if (bounty.status !== 'InProgress' && bounty.status !== 'Accepted') {
      return { success: false, error: 'Bounty is not in progress' };
    }

    // Check if user is assigned to this bounty
    const isAssigned = bounty.assignedHunterIds.some(
      (id) => id.toString() === session.user.id
    );
    
    if (!isAssigned) {
      return { success: false, error: 'You are not assigned to this bounty' };
    }

    // Update bounty with proof
    bounty.proofOfWork = validated;
    bounty.submittedAt = new Date();
    bounty.status = 'Submitted';
    await bounty.save();

    // Record activity
    await Activity.create({
      userId: session.user.id,
      type: 'BountyCompleted',
      relatedBountyId: bounty._id,
      description: `Submitted proof for bounty: ${bounty.title}`,
      impactOnTrust: 0,
      impactOnCredits: 0,
    });

    return { success: true, message: 'Proof submitted successfully' };
  } catch (error: any) {
    console.error('Submit proof error:', error);
    return { success: false, error: error.message || 'Failed to submit proof' };
  }
}

// Review bounty submission (Client reviews)
export async function reviewBountySubmission(bountyId: string, accept: boolean) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Find bounty
    const bounty = await Bounty.findById(bountyId);
    if (!bounty) {
      return { success: false, error: 'Bounty not found' };
    }

    // Check if user is the client
    if (bounty.clientId.toString() !== session.user.id) {
      return { success: false, error: 'Only the client can review submissions' };
    }

    if (bounty.status !== 'Submitted') {
      return { success: false, error: 'Bounty is not ready for review' };
    }

    if (accept) {
      // Complete bounty successfully
      bounty.status = 'Completed';
      bounty.completedAt = new Date();
      await bounty.save();

      // Get guild
      const guild = await Guild.findById(bounty.acceptedByGuildId);
      if (guild) {
        // Release stake and reward
        const totalPayout = bounty.guildStakeLocked + bounty.rewardCredits;
        guild.treasuryBalance += totalPayout;
        guild.stakedAmount -= bounty.guildStakeLocked;
        guild.totalBountiesCompleted += 1;
        guild.totalValueCleared += bounty.rewardCredits;
        
        // Update success rate
        guild.successRate = (guild.totalBountiesCompleted / (guild.totalBountiesCompleted + 0)) * 100;
        await guild.save();

        // Record transaction
        await Transaction.create({
          guildId: guild._id,
          bountyId: bounty._id,
          type: 'BountyReward',
          amount: totalPayout,
          balanceAfter: guild.treasuryBalance,
          description: `Bounty completed: ${bounty.title}`,
        });
      }

      return { success: true, message: 'Bounty completed successfully' };
    } else {
      // Reject submission - move to dispute
      bounty.status = 'Disputed';
      await bounty.save();

      return { success: true, message: 'Submission rejected. Dispute initiated.' };
    }
  } catch (error: any) {
    console.error('Review submission error:', error);
    return { success: false, error: error.message || 'Failed to review submission' };
  }
}

// Get bounty by ID
export async function getBountyById(bountyId: string) {
  try {
    await connectDB();
    
    const bounty = await Bounty.findById(bountyId)
      .populate('clientId', 'username avatar trustScore')
      .populate('acceptedByGuildId', 'name avatar trustScore')
      .populate('assignedHunterIds', 'username avatar rank')
      .lean();
    
    if (!bounty) {
      return { success: false, error: 'Bounty not found' };
    }
    
    return { success: true, data: JSON.parse(JSON.stringify(bounty)) };
  } catch (error: any) {
    console.error('Get bounty error:', error);
    return { success: false, error: error.message || 'Failed to fetch bounty' };
  }
}

// Get my posted bounties (for clients)
export async function getMyPostedBounties() {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const bounties = await Bounty.find({ clientId: session.user.id })
      .sort({ postedAt: -1 })
      .populate('acceptedByGuildId', 'name avatar')
      .lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(bounties)) };
  } catch (error: any) {
    console.error('Get my bounties error:', error);
    return { success: false, error: error.message || 'Failed to fetch bounties' };
  }
}
