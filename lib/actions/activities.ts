'use server';

import { connectDB } from '@/lib/db/mongodb';
import Activity from '@/lib/db/models/Activity';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Activity filters schema
const activityFiltersSchema = z.object({
  userId: z.string().optional(),
  type: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type ActivityFilters = z.infer<typeof activityFiltersSchema>;

// Get user activities
export async function getUserActivities(filters: ActivityFilters = {}) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = activityFiltersSchema.parse(filters);
    const userId = validated.userId || session.user.id;
    
    const query: any = { userId };
    
    if (validated.type) {
      query.type = validated.type;
    }
    
    const page = validated.page || 1;
    const limit = validated.limit || 50;
    const skip = (page - 1) * limit;
    
    const [activities, total] = await Promise.all([
      Activity.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('relatedBountyId', 'title')
        .populate('relatedGuildId', 'name avatar')
        .populate('relatedDisputeId', 'title')
        .lean(),
      Activity.countDocuments(query),
    ]);
    
    return {
      success: true,
      data: {
        activities,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error: any) {
    console.error('Get activities error:', error);
    return { success: false, error: error.message || 'Failed to fetch activities' };
  }
}

// Get user transactions
export async function getUserTransactions(filters: { page?: number; limit?: number } = {}) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const Transaction = (await import('@/lib/db/models/Transaction')).default;
    
    const [transactions, total] = await Promise.all([
      Transaction.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('bountyId', 'title')
        .populate('guildId', 'name avatar')
        .lean(),
      Transaction.countDocuments({ userId: session.user.id }),
    ]);
    
    return {
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return { success: false, error: error.message || 'Failed to fetch transactions' };
  }
}
