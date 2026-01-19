'use server';

import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import Guild from '@/lib/db/models/Guild';
import Bounty from '@/lib/db/models/Bounty';
import { z } from 'zod';

// User filters schema
const userFiltersSchema = z.object({
  rank: z.enum(['Rookie', 'Veteran', 'Elite', 'Master', 'Legendary']).optional(),
  minTrustScore: z.number().min(0).max(100).optional(),
  skills: z.array(z.string()).optional(),
  guildId: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['trust', 'reputation', 'quests', 'recent']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type UserFilters = z.infer<typeof userFiltersSchema>;

// Get users/hunters with filters
export async function getUsers(filters: UserFilters) {
  try {
    await connectDB();
    
    const validated = userFiltersSchema.parse(filters);
    
    const query: any = {};
    
    // Apply filters
    if (validated.rank) {
      query.rank = validated.rank;
    }
    
    if (validated.minTrustScore) {
      query.trustScore = { $gte: validated.minTrustScore };
    }
    
    if (validated.skills && validated.skills.length > 0) {
      query.skills = { $in: validated.skills };
    }
    
    if (validated.guildId) {
      query.guildId = validated.guildId;
    }
    
    if (validated.search) {
      query.$or = [
        { username: { $regex: validated.search, $options: 'i' } },
        { bio: { $regex: validated.search, $options: 'i' } },
        { skills: { $in: [new RegExp(validated.search, 'i')] } },
      ];
    }
    
    // Sorting
    let sort: any = {};
    switch (validated.sort) {
      case 'trust':
        sort = { trustScore: -1, hunterReputation: -1 };
        break;
      case 'reputation':
        sort = { hunterReputation: -1, trustScore: -1 };
        break;
      case 'quests':
        sort = { completedQuests: -1 };
        break;
      case 'recent':
        sort = { lastActive: -1 };
        break;
      default:
        sort = { trustScore: -1 };
    }
    
    // Pagination
    const page = validated.page || 1;
    const limit = validated.limit || 20;
    const skip = (page - 1) * limit;
    
    // Execute query
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .populate('guildId', 'name avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);
    
    return {
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error: any) {
    console.error('Get users error:', error);
    return { success: false, error: error.message || 'Failed to fetch users' };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  try {
    await connectDB();
    
    const user = await User.findById(userId)
      .select('-password')
      .populate('guildId', 'name avatar banner description')
      .lean();
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Dynamic stats: Count completed and active quests from Bounty model
    const [completedQuests, activeQuests, failedQuests] = await Promise.all([
      Bounty.countDocuments({ 
        assignedHunterIds: user._id, 
        status: 'Completed' 
      }),
      Bounty.countDocuments({ 
        assignedHunterIds: user._id, 
        status: { $in: ['Accepted', 'InProgress', 'Submitted', 'UnderReview'] } 
      }),
      Bounty.countDocuments({ 
        assignedHunterIds: user._id, 
        status: 'Failed' 
      })
    ]);

    const totalFinished = completedQuests + failedQuests;
    const successRate = totalFinished > 0 ? (completedQuests / totalFinished) * 100 : 100;

    const userData = {
      ...JSON.parse(JSON.stringify(user)),
      completedQuests: completedQuests || user.completedQuests,
      activeQuests: activeQuests,
      successRate: Math.round(successRate)
    };
    
    return { success: true, data: userData };
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    return { success: false, error: error.message || 'Failed to fetch user' };
  }
}

// Get top skills in the network
export async function getTopSkills(limit: number = 10) {
  try {
    await connectDB();
    
    // Aggregate skills across all users
    const skillsAggregation = await User.aggregate([
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $project: {
          skill: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);
    
    return { success: true, data: skillsAggregation };
  } catch (error: any) {
    console.error('Get top skills error:', error);
    return { success: false, error: error.message || 'Failed to fetch top skills' };
  }
}

// Get guild members
export async function getGuildMembers(guildId: string) {
  try {
    await connectDB();
    
    const members = await User.find({ guildId })
      .select('-password')
      .sort({ guildRole: 1, trustScore: -1 })
      .lean();
    
    return { success: true, data: members };
  } catch (error: any) {
    console.error('Get guild members error:', error);
    return { success: false, error: error.message || 'Failed to fetch guild members' };
  }
}
