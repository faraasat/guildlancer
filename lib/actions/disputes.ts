'use server';

import { connectDB } from '@/lib/db/mongodb';
import Dispute from '@/lib/db/models/Dispute';
import Bounty from '@/lib/db/models/Bounty';
import Guild from '@/lib/db/models/Guild';
import { User } from '@/lib/db/models/User';
import Transaction from '@/lib/db/models/Transaction';
import Activity from '@/lib/db/models/Activity';
import { raiseDisputeSchema, submitDisputeEvidenceSchema, tribunalVoteSchema, type RaiseDisputeInput, type SubmitDisputeEvidenceInput, type TribunalVoteInput } from '@/lib/validations/backend';
import { auth } from '@/lib/auth';
import mongoose from 'mongoose';

// Raise a dispute
export async function raiseDispute(bountyId: string, data: RaiseDisputeInput) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = raiseDisputeSchema.parse(data);

    // Find bounty
    const bounty = await Bounty.findById(bountyId);
    if (!bounty) {
      return { success: false, error: 'Bounty not found' };
    }

    // Check if user is the client
    if (bounty.clientId.toString() !== session.user.id) {
      return { success: false, error: 'Only the client can raise a dispute' };
    }

    if (bounty.status !== 'Submitted' && bounty.status !== 'UnderReview') {
      return { success: false, error: 'Bounty is not in a disputable state' };
    }

    // Check if dispute already exists
    if (bounty.disputeId) {
      return { success: false, error: 'Dispute already exists for this bounty' };
    }

    // Get guild
    const guild = await Guild.findById(bounty.acceptedByGuildId);
    if (!guild) {
      return { success: false, error: 'Guild not found' };
    }

    // Calculate stakes at risk
    const clientStakeAtRisk = bounty.clientStake || 0;
    const guildStakeAtRisk = bounty.guildStakeLocked || 0;

    // Create dispute
    const dispute = await Dispute.create({
      bountyId: bounty._id,
      clientId: session.user.id,
      guildId: bounty.acceptedByGuildId,
      tier: 'Negotiation',
      status: 'Open',
      clientEvidence: {
        text: validated.evidenceText,
        images: validated.evidenceImages || [],
        links: validated.evidenceLinks || [],
      },
      guildEvidence: {
        text: '',
        images: [],
        links: [],
      },
      clientStakeAtRisk,
      guildStakeAtRisk,
    });

    // Update bounty
    bounty.status = 'Disputed';
    bounty.disputeId = dispute._id;
    await bounty.save();

    // Record activity
    await Activity.create({
      userId: session.user.id,
      type: 'DisputeRaised',
      relatedBountyId: bounty._id,
      relatedDisputeId: dispute._id,
      description: `Raised dispute for bounty: ${bounty.title}`,
      impactOnTrust: 0,
      impactOnCredits: 0,
    });

    return { success: true, data: { disputeId: dispute._id.toString() } };
  } catch (error: any) {
    console.error('Raise dispute error:', error);
    return { success: false, error: error.message || 'Failed to raise dispute' };
  }
}

// Submit additional evidence
export async function submitDisputeEvidence(disputeId: string, data: SubmitDisputeEvidenceInput) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = submitDisputeEvidenceSchema.parse(data);

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return { success: false, error: 'Dispute not found' };
    }

    // Check if user is involved in the dispute
    const isClient = dispute.clientId.toString() === session.user.id;
    
    // Check if user is a guild member
    const user = await User.findById(session.user.id);
    const isGuildMember = user?.guildId?.toString() === dispute.guildId.toString();

    if (!isClient && !isGuildMember) {
      return { success: false, error: 'You are not involved in this dispute' };
    }

    // Add evidence to appropriate party
    if (isClient) {
      dispute.clientEvidence.text += '\n\n' + validated.evidenceText;
      if (validated.evidenceImages) {
        dispute.clientEvidence.images.push(...validated.evidenceImages);
      }
      if (validated.evidenceLinks) {
        dispute.clientEvidence.links.push(...validated.evidenceLinks);
      }
    } else {
      dispute.guildEvidence.text += validated.evidenceText;
      if (validated.evidenceImages) {
        dispute.guildEvidence.images.push(...validated.evidenceImages);
      }
      if (validated.evidenceLinks) {
        dispute.guildEvidence.links.push(...validated.evidenceLinks);
      }
    }

    await dispute.save();

    return { success: true, message: 'Evidence submitted successfully' };
  } catch (error: any) {
    console.error('Submit evidence error:', error);
    return { success: false, error: error.message || 'Failed to submit evidence' };
  }
}

// Request AI analysis (move to Tier 2)
export async function requestAIAnalysis(disputeId: string) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return { success: false, error: 'Dispute not found' };
    }

    // Check if user is involved
    const user = await User.findById(session.user.id);
    const isClient = dispute.clientId.toString() === session.user.id;
    const isGuildMember = user?.guildId?.toString() === dispute.guildId.toString();

    if (!isClient && !isGuildMember) {
      return { success: false, error: 'You are not involved in this dispute' };
    }

    if (dispute.tier !== 'Negotiation') {
      return { success: false, error: 'Dispute is not in negotiation phase' };
    }

    // Move to AI Arbiter tier
    dispute.tier = 'AIArbiter';
    dispute.status = 'AIAnalysis';
    await dispute.save();

    // In Phase 6, this will trigger actual AI analysis
    // For now, just update status
    
    return { success: true, message: 'AI analysis requested' };
  } catch (error: any) {
    console.error('Request AI analysis error:', error);
    return { success: false, error: error.message || 'Failed to request AI analysis' };
  }
}

// Escalate to Tribunal (move to Tier 3)
export async function escalateToTribunal(disputeId: string) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return { success: false, error: 'Dispute not found' };
    }

    // Check if user is involved
    const user = await User.findById(session.user.id);
    const isClient = dispute.clientId.toString() === session.user.id;
    const isGuildMember = user?.guildId?.toString() === dispute.guildId.toString();

    if (!isClient && !isGuildMember) {
      return { success: false, error: 'You are not involved in this dispute' };
    }

    if (dispute.tier !== 'AIArbiter') {
      return { success: false, error: 'Dispute must be in AI Arbiter phase first' };
    }

    // Select random eligible guilds as jurors
    // Exclude dispute parties and low-trust guilds
    const eligibleGuilds = await Guild.find({
      _id: { $ne: dispute.guildId },
      trustScore: { $gte: 500 }, // Only trustworthy guilds
      rank: { $in: ['Veteran', 'Elite', 'Legendary'] }, // Experienced guilds only
    })
      .limit(10)
      .lean();

    if (eligibleGuilds.length < 5) {
      return { success: false, error: 'Not enough eligible guilds for tribunal' };
    }

    // Randomly select 5 jurors
    const shuffled = eligibleGuilds.sort(() => 0.5 - Math.random());
    const selectedJurors = shuffled.slice(0, 5);

    // Move to Tribunal
    dispute.tier = 'Tribunal';
    dispute.status = 'InTribunal';
    dispute.tribunalJurors = selectedJurors.map(g => g._id);
    await dispute.save();

    return { success: true, message: 'Dispute escalated to tribunal' };
  } catch (error: any) {
    console.error('Escalate to tribunal error:', error);
    return { success: false, error: error.message || 'Failed to escalate dispute' };
  }
}

// Cast tribunal vote
export async function castTribunalVote(disputeId: string, data: TribunalVoteInput) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = tribunalVoteSchema.parse(data);

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return { success: false, error: 'Dispute not found' };
    }

    if (dispute.tier !== 'Tribunal') {
      return { success: false, error: 'Dispute is not in tribunal phase' };
    }

    // Check if user's guild is a juror
    const user = await User.findById(session.user.id);
    if (!user?.guildId) {
      return { success: false, error: 'You must be in a guild to vote' };
    }

    const guild = await Guild.findById(user.guildId);
    if (!guild) {
      return { success: false, error: 'Guild not found' };
    }

    if (!dispute.tribunalJurors || dispute.tribunalJurors.length === 0) {
      return { success: false, error: 'No jurors assigned to this dispute' };
    }

    const isJuror = dispute.tribunalJurors.some(
      id => id.toString() === guild._id.toString()
    );

    if (!isJuror) {
      return { success: false, error: 'Your guild is not a juror for this dispute' };
    }

    // Check if already voted
    if (!dispute.tribunalVotes) {
      dispute.tribunalVotes = [];
    }
    
    const hasVoted = dispute.tribunalVotes.some(
      v => v.guildId.toString() === guild._id.toString()
    );

    if (hasVoted) {
      return { success: false, error: 'Your guild has already voted' };
    }

    // Check if guild Master
    if (guild.masterId.toString() !== session.user.id) {
      return { success: false, error: 'Only Guild Master can cast tribunal votes' };
    }

    // Check if guild has enough treasury for stake
    if (guild.treasuryBalance < validated.stakeAmount) {
      return { success: false, error: 'Insufficient guild treasury for stake' };
    }

    // Lock stake
    guild.treasuryBalance -= validated.stakeAmount;
    guild.stakedAmount += validated.stakeAmount;
    await guild.save();

    // Record vote
    dispute.tribunalVotes.push({
      guildId: guild._id,
      vote: validated.vote,
      stakedAmount: validated.stakeAmount,
    });

    // Check if all jurors have voted
    if (dispute.tribunalVotes.length === dispute.tribunalJurors.length) {
      // Resolve dispute
      await resolveDisputeByTribunal(dispute);
    } else {
      await dispute.save();
    }

    // Record transaction
    await Transaction.create({
      guildId: guild._id,
      disputeId: dispute._id,
      type: 'TribunalStake',
      amount: -validated.stakeAmount,
      balanceAfter: guild.treasuryBalance,
      description: `Tribunal vote stake for dispute #${dispute._id}`,
    });

    // Record activity
    await Activity.create({
      userId: session.user.id,
      type: 'TribunalVote',
      relatedDisputeId: dispute._id,
      relatedGuildId: guild._id,
      description: `Cast tribunal vote`,
      impactOnTrust: 0,
      impactOnCredits: -validated.stakeAmount,
    });

    return { success: true, message: 'Vote cast successfully' };
  } catch (error: any) {
    console.error('Cast vote error:', error);
    return { success: false, error: error.message || 'Failed to cast vote' };
  }
}

// Resolve dispute by tribunal votes
async function resolveDisputeByTribunal(dispute: any) {
  // Count votes
  const clientVotes = dispute.tribunalVotes.filter((v: any) => v.vote === 'ClientWins').length;
  const guildVotes = dispute.tribunalVotes.filter((v: any) => v.vote === 'GuildWins').length;
  const splitVotes = dispute.tribunalVotes.filter((v: any) => v.vote === 'Split').length;

  let finalRuling: 'ClientWins' | 'GuildWins' | 'Split';

  if (clientVotes > guildVotes && clientVotes > splitVotes) {
    finalRuling = 'ClientWins';
  } else if (guildVotes > clientVotes && guildVotes > splitVotes) {
    finalRuling = 'GuildWins';
  } else {
    finalRuling = 'Split';
  }

  // Update dispute
  dispute.finalRuling = finalRuling;
  dispute.status = 'Resolved';
  dispute.resolvedAt = new Date();
  await dispute.save();

  // Get bounty and guild
  const bounty = await Bounty.findById(dispute.bountyId);
  const guild = await Guild.findById(dispute.guildId);
  const client = await User.findById(dispute.clientId);

  if (!bounty || !guild || !client) return;

  // Distribute stakes based on ruling
  const totalStakes = dispute.clientStakeAtRisk + dispute.guildStakeAtRisk;

  if (finalRuling === 'ClientWins') {
    // Client gets both stakes
    client.credits += totalStakes;
    await client.save();

    await Transaction.create({
      userId: client._id,
      disputeId: dispute._id,
      type: 'DisputeWin',
      amount: totalStakes,
      balanceAfter: client.credits,
      description: `Won dispute for bounty: ${bounty.title}`,
    });

    // Update trust scores
    guild.trustScore = Math.max(0, guild.trustScore - 50);
    await guild.save();

  } else if (finalRuling === 'GuildWins') {
    // Guild gets both stakes
    guild.treasuryBalance += totalStakes;
    guild.stakedAmount -= dispute.guildStakeAtRisk;
    await guild.save();

    await Transaction.create({
      guildId: guild._id,
      disputeId: dispute._id,
      type: 'DisputeWin',
      amount: totalStakes,
      balanceAfter: guild.treasuryBalance,
      description: `Won dispute for bounty: ${bounty.title}`,
    });

    // Update bounty as completed
    bounty.status = 'Completed';
    bounty.completedAt = new Date();
    await bounty.save();

  } else {
    // Split - each gets their stake back + reward split
    client.credits += dispute.clientStakeAtRisk + bounty.rewardCredits / 2;
    guild.treasuryBalance += dispute.guildStakeAtRisk + bounty.rewardCredits / 2;
    guild.stakedAmount -= dispute.guildStakeAtRisk;
    await client.save();
    await guild.save();
  }

  // Distribute rewards to winning jurors
  const winningVotes = dispute.tribunalVotes.filter((v: any) => v.vote === finalRuling);
  const totalWinningStake = winningVotes.reduce((sum: number, v: any) => sum + v.stakedAmount, 0);
  const losingStakes = dispute.tribunalVotes
    .filter((v: any) => v.vote !== finalRuling)
    .reduce((sum: number, v: any) => sum + v.stakedAmount, 0);

  for (const vote of winningVotes) {
    const jurorGuild = await Guild.findById(vote.guildId);
    if (jurorGuild) {
      const reward = vote.stakedAmount + (losingStakes * vote.stakedAmount / totalWinningStake);
      jurorGuild.treasuryBalance += reward;
      jurorGuild.stakedAmount -= vote.stakedAmount;
      await jurorGuild.save();
    }
  }

  // Record activity
  await Activity.create({
    userId: dispute.clientId,
    type: 'DisputeResolved',
    relatedBountyId: bounty._id,
    relatedDisputeId: dispute._id,
    description: `Dispute resolved: ${finalRuling}`,
    impactOnTrust: finalRuling === 'ClientWins' ? 10 : -5,
    impactOnCredits: 0,
  });
}

// Get dispute by ID
export async function getDisputeById(disputeId: string) {
  try {
    await connectDB();
    
    const dispute = await Dispute.findById(disputeId)
      .populate('clientId', 'username avatar')
      .populate('guildId', 'name avatar')
      .populate('bountyId')
      .populate('tribunalJurors', 'name avatar trustScore')
      .lean();
    
    if (!dispute) {
      return { success: false, error: 'Dispute not found' };
    }
    
    return { success: true, data: JSON.parse(JSON.stringify(dispute)) };
  } catch (error: any) {
    console.error('Get dispute error:', error);
    return { success: false, error: error.message || 'Failed to fetch dispute' };
  }
}

// Get my disputes (user involved)
export async function getMyDisputes() {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await User.findById(session.user.id);
    
    const query: any = {
      $or: [{ clientId: session.user.id }],
    };

    if (user?.guildId) {
      query.$or.push({ guildId: user.guildId });
    }

    const disputes = await Dispute.find(query)
      .sort({ createdAt: -1 })
      .populate('clientId', 'username avatar')
      .populate('guildId', 'name avatar')
      .populate('bountyId', 'title')
      .lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(disputes)) };
  } catch (error: any) {
    console.error('Get my disputes error:', error);
    return { success: false, error: error.message || 'Failed to fetch disputes' };
  }
}
