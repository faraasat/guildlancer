'use server';

import { connectDB } from '@/lib/db/mongodb';
import Guild from '@/lib/db/models/Guild';
import { User } from '@/lib/db/models/User';
import Bounty from '@/lib/db/models/Bounty';
import Transaction from '@/lib/db/models/Transaction';
import Activity from '@/lib/db/models/Activity';
import { createGuildSchema, updateGuildSchema, guildMemberActionSchema, guildFiltersSchema, type CreateGuildInput, type UpdateGuildInput, type GuildMemberAction, type GuildFilters } from '@/lib/validations/backend';
import { auth } from '@/lib/auth';
import mongoose from 'mongoose';

// Create a new guild
export async function createGuild(data: CreateGuildInput) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    const validated = createGuildSchema.parse(data);
    
    // Check if user already has a guild
    const user = await User.findById(session.user.id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.guildId) {
      return { success: false, error: 'You are already in a guild' };
    }

    // Check if user has enough credits
    if (user.credits < validated.foundingStake) {
      return { success: false, error: 'Insufficient credits to create guild' };
    }

    // Create guild
    const guild = await Guild.create({
      name: validated.name,
      description: validated.description,
      avatar: validated.avatar,
      banner: validated.banner,
      foundersIds: [session.user.id],
      masterId: session.user.id,
      officerIds: [],
      memberIds: [],
      rank: 'Developing',
      trustScore: 100, // Starting trust score
      successRate: 0,
      totalBountiesCompleted: 0,
      totalValueCleared: 0,
      disputeWinRate: 0,
      treasuryBalance: validated.foundingStake,
      stakedAmount: 0,
      categories: validated.categories,
    });

    // Deduct founding stake from user
    user.credits -= validated.foundingStake;
    user.guildId = guild._id;
    await user.save();

    // Record transaction
    await Transaction.create({
      userId: session.user.id,
      guildId: guild._id,
      type: 'GuildDeposit',
      amount: -validated.foundingStake,
      balanceAfter: user.credits,
      description: `Founded guild: ${validated.name}`,
    });

    // Record activity
    await Activity.create({
      userId: session.user.id,
      type: 'GuildJoined',
      relatedGuildId: guild._id,
      description: `Founded guild: ${validated.name}`,
      impactOnTrust: 0,
      impactOnCredits: -validated.foundingStake,
    });

    return { success: true, data: { guildId: guild._id.toString() } };
  } catch (error: any) {
    console.error('Create guild error:', error);
    return { success: false, error: error.message || 'Failed to create guild' };
  }
}

// Get guilds with filters
export async function getGuilds(filters: GuildFilters) {
  try {
    await connectDB();
    
    const validated = guildFiltersSchema.parse(filters);
    
    // Build query
    const query: any = {};
    
    if (validated.rank) {
      const rankOrder = ['Developing', 'Established', 'Veteran', 'Elite', 'Legendary'];
      const minIndex = rankOrder.indexOf(validated.rank);
      query.rank = { $in: rankOrder.slice(minIndex) };
    }
    
    if (validated.minTrustScore) {
      query.trustScore = { $gte: validated.minTrustScore };
    }
    
    if (validated.category) {
      query.categories = validated.category;
    }
    
    if (validated.search) {
      query.$or = [
        { name: { $regex: validated.search, $options: 'i' } },
        { description: { $regex: validated.search, $options: 'i' } },
      ];
    }
    
    // Sort options
    let sort: any = {};
    switch (validated.sort) {
      case 'trust':
        sort = { trustScore: -1 };
        break;
      case 'rank':
        sort = { rank: -1 };
        break;
      case 'members':
        // Sort by member count (calculated field)
        sort = { memberIds: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
    }
    
    const skip = (validated.page - 1) * validated.limit;
    
    const [guilds, total] = await Promise.all([
      Guild.find(query)
        .sort(sort)
        .skip(skip)
        .limit(validated.limit)
        .populate('masterId', 'username avatar')
        .lean(),
      Guild.countDocuments(query),
    ]);
    
    // Calculate member counts
    const guildsWithCounts = guilds.map(guild => ({
      ...guild,
      memberCount: 1 + guild.officerIds.length + guild.memberIds.length, // Master + officers + members
    }));
    
    return {
      success: true,
      data: {
        guilds: JSON.parse(JSON.stringify(guildsWithCounts)),
        total,
        page: validated.page,
        pages: Math.ceil(total / validated.limit),
      },
    };
  } catch (error: any) {
    console.error('Get guilds error:', error);
    return { success: false, error: error.message || 'Failed to fetch guilds' };
  }
}

// Join a guild (application)
export async function applyToGuild(guildId: string) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.guildId) {
      return { success: false, error: 'You are already in a guild' };
    }

    const guild = await Guild.findById(guildId);
    if (!guild) {
      return { success: false, error: 'Guild not found' };
    }

    // For now, auto-accept (in Phase 6, we'll add application system)
    guild.memberIds.push(new mongoose.Types.ObjectId(session.user.id));
    await guild.save();

    user.guildId = guild._id;
    await user.save();

    // Record activity
    await Activity.create({
      userId: session.user.id,
      type: 'GuildJoined',
      relatedGuildId: guild._id,
      description: `Joined guild: ${guild.name}`,
      impactOnTrust: 0,
      impactOnCredits: 0,
    });

    return { success: true, message: 'Joined guild successfully' };
  } catch (error: any) {
    console.error('Join guild error:', error);
    return { success: false, error: error.message || 'Failed to join guild' };
  }
}

// Leave guild
export async function leaveGuild() {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await User.findById(session.user.id);
    if (!user || !user.guildId) {
      return { success: false, error: 'You are not in a guild' };
    }

    const guild = await Guild.findById(user.guildId);
    if (!guild) {
      return { success: false, error: 'Guild not found' };
    }

    // Cannot leave if you're the Guild Master
    if (guild.masterId.toString() === session.user.id) {
      return { success: false, error: 'Guild Master cannot leave. Transfer leadership first.' };
    }

    // Remove from guild
    guild.memberIds = guild.memberIds.filter(id => id.toString() !== session.user.id);
    guild.officerIds = guild.officerIds.filter(id => id.toString() !== session.user.id);
    await guild.save();

    user.guildId = undefined;
    await user.save();

    // Record activity
    await Activity.create({
      userId: session.user.id,
      type: 'GuildLeft',
      relatedGuildId: guild._id,
      description: `Left guild: ${guild.name}`,
      impactOnTrust: 0,
      impactOnCredits: 0,
    });

    return { success: true, message: 'Left guild successfully' };
  } catch (error: any) {
    console.error('Leave guild error:', error);
    return { success: false, error: error.message || 'Failed to leave guild' };
  }
}

// Manage guild members (promote, demote, kick)
export async function manageGuildMember(data: GuildMemberAction) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = guildMemberActionSchema.parse(data);
    
    const user = await User.findById(session.user.id);
    if (!user || !user.guildId) {
      return { success: false, error: 'You are not in a guild' };
    }

    const guild = await Guild.findById(user.guildId);
    if (!guild) {
      return { success: false, error: 'Guild not found' };
    }

    // Check permissions
    const isMaster = guild.masterId.toString() === session.user.id;
    const isOfficer = guild.officerIds.some(id => id.toString() === session.user.id);

    if (!isMaster && !isOfficer) {
      return { success: false, error: 'Insufficient permissions' };
    }

    const targetUserId = new mongoose.Types.ObjectId(validated.userId);

    switch (validated.action) {
      case 'promote':
        // Only Master can promote to Officer
        if (!isMaster) {
          return { success: false, error: 'Only Guild Master can promote members' };
        }
        
        // Check if member exists
        const memberIndex = guild.memberIds.findIndex(id => id.toString() === validated.userId);
        if (memberIndex === -1) {
          return { success: false, error: 'User is not a member of this guild' };
        }
        
        // Promote to officer
        guild.memberIds.splice(memberIndex, 1);
        guild.officerIds.push(targetUserId);
        await guild.save();
        
        return { success: true, message: 'Member promoted to Officer' };

      case 'demote':
        // Only Master can demote
        if (!isMaster) {
          return { success: false, error: 'Only Guild Master can demote officers' };
        }
        
        const officerIndex = guild.officerIds.findIndex(id => id.toString() === validated.userId);
        if (officerIndex === -1) {
          return { success: false, error: 'User is not an officer' };
        }
        
        // Demote to member
        guild.officerIds.splice(officerIndex, 1);
        guild.memberIds.push(targetUserId);
        await guild.save();
        
        return { success: true, message: 'Officer demoted to Member' };

      case 'kick':
        // Officers and Master can kick members
        if (validated.userId === guild.masterId.toString()) {
          return { success: false, error: 'Cannot kick Guild Master' };
        }
        
        // Remove from guild
        guild.memberIds = guild.memberIds.filter(id => id.toString() !== validated.userId);
        guild.officerIds = guild.officerIds.filter(id => id.toString() !== validated.userId);
        await guild.save();
        
        // Update target user
        const targetUser = await User.findById(validated.userId);
        if (targetUser) {
          targetUser.guildId = undefined;
          await targetUser.save();
        }
        
        return { success: true, message: 'Member kicked from guild' };

      default:
        return { success: false, error: 'Invalid action' };
    }
  } catch (error: any) {
    console.error('Manage member error:', error);
    return { success: false, error: error.message || 'Failed to manage member' };
  }
}

// Get guild by ID with full details
export async function getGuildById(guildId: string) {
  try {
    await connectDB();
    
    const guild = await Guild.findById(guildId)
      .populate('masterId', 'username avatar trustScore rank')
      .populate('officerIds', 'username avatar trustScore rank')
      .populate('memberIds', 'username avatar trustScore rank')
      .populate('foundersIds', 'username avatar')
      .lean();
    
    if (!guild) {
      return { success: false, error: 'Guild not found' };
    }

    // Dynamic stats: Count from bounties
    const [completedBounties, allActiveBounties] = await Promise.all([
      Bounty.find({ acceptedByGuildId: guild._id, status: 'Completed' }),
      Bounty.countDocuments({ 
        acceptedByGuildId: guild._id, 
        status: { $in: ['Accepted', 'InProgress', 'Submitted', 'UnderReview'] } 
      })
    ]);

    const totalValueCleared = completedBounties.reduce((sum, b) => sum + (b.rewardCredits || 0), 0);
    const totalBountiesCompleted = completedBounties.length;
    
    // Simple success rate calculation for demo: (completed / (completed + failed/cancelled))
    // For now we'll just use (completed / (total assigned)) if possible, or keep it simple
    const successRate = totalBountiesCompleted > 0 
      ? (totalBountiesCompleted / (totalBountiesCompleted + (guild.totalBountiesFailed || 0))) * 100 
      : guild.successRate;

    const guildData = {
      ...JSON.parse(JSON.stringify(guild)),
      totalBountiesCompleted,
      totalValueCleared,
      successRate: Math.min(100, successRate),
      activeBountiesCount: allActiveBounties,
      performance: {
        totalEarnings: totalValueCleared,
        completedCount: totalBountiesCompleted,
        activeCount: allActiveBounties,
        successRate: Math.min(100, successRate)
      },
      members: [
        ...(guild.masterId ? [guild.masterId] : []),
        ...(guild.officerIds || []),
        ...(guild.memberIds || [])
      ]
    };
    
    return { success: true, data: guildData };
  } catch (error: any) {
    console.error('Get guild error:', error);
    return { success: false, error: error.message || 'Failed to fetch guild' };
  }
}


// Get guild stats and analytics
export async function getGuildStats(guildId: string) {
  try {
    await connectDB();
    
    const guild = await Guild.findById(guildId);
    if (!guild) {
      return { success: false, error: 'Guild not found' };
    }

    // Get bounty stats
    const bountyStats = await Bounty.aggregate([
      { $match: { acceptedByGuildId: guild._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRewards: { $sum: '$rewardCredits' },
        },
      },
    ]);

    // Get recent activities
    const activities = await Activity.find({ relatedGuildId: guild._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'username avatar')
      .lean();

    // Get member count
    const memberCount = 1 + guild.officerIds.length + guild.memberIds.length;

    return {
      success: true,
      data: {
        guild: JSON.parse(JSON.stringify(guild)),
        bountyStats: bountyStats,
        recentActivities: JSON.parse(JSON.stringify(activities)),
        memberCount,
      },
    };
  } catch (error: any) {
    console.error('Get guild stats error:', error);
    return { success: false, error: error.message || 'Failed to fetch guild stats' };
  }
}

// Update guild (Master only)
export async function updateGuild(guildId: string, data: UpdateGuildInput) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = updateGuildSchema.parse(data);
    
    const guild = await Guild.findById(guildId);
    if (!guild) {
      return { success: false, error: 'Guild not found' };
    }

    // Check if user is Guild Master
    if (guild.masterId.toString() !== session.user.id) {
      return { success: false, error: 'Only Guild Master can update guild info' };
    }

    // Update fields
    if (validated.description) guild.description = validated.description;
    if (validated.avatar) guild.avatar = validated.avatar;
    if (validated.banner) guild.banner = validated.banner;
    if (validated.categories) guild.categories = validated.categories;

    await guild.save();

    return { success: true, message: 'Guild updated successfully' };
  } catch (error: any) {
    console.error('Update guild error:', error);
    return { success: false, error: error.message || 'Failed to update guild' };
  }
}

// Get my guild (current user's guild)
export async function getMyGuild() {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await User.findById(session.user.id);
    if (!user || !user.guildId) {
      return { success: false, data: null };
    }

    return getGuildById(user.guildId.toString());
  } catch (error: any) {
    console.error('Get my guild error:', error);
    return { success: false, error: error.message || 'Failed to fetch guild' };
  }
}
