import { NextRequest, NextResponse } from 'next/server';
import { createBounty, getOpenBounties } from '@/lib/actions/bounties';
import { auth } from '@/lib/auth';

// GET /api/bounties - Get bounties with filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    // Helper to capitalize first letter
    const capitalize = (str: string | null) => {
      if (!str) return undefined;
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    
    const filters = {
      category: searchParams.get('category') || undefined,
      minReward: searchParams.get('minReward') ? Number(searchParams.get('minReward')) : undefined,
      maxReward: searchParams.get('maxReward') ? Number(searchParams.get('maxReward')) : undefined,
      urgency: capitalize(searchParams.get('urgency')) as any,
      minHunterRank: capitalize(searchParams.get('minHunterRank')) as any,
      status: capitalize(searchParams.get('status')) as any,
      search: searchParams.get('search') || undefined,
      sort: (searchParams.get('sort') as any) || 'newest',
      page: Number(searchParams.get('page') || '1'),
      limit: Number(searchParams.get('limit') || '20'),
    };

    const result = await getOpenBounties(filters);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bounties - Create a new bounty
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = await createBounty(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
