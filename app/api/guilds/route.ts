import { NextRequest, NextResponse } from 'next/server';
import { createGuild, getGuilds } from '@/lib/actions/guilds';
import { auth } from '@/lib/auth';

// GET /api/guilds - Get guilds with filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    const filters = {
      rank: searchParams.get('rank') as any || undefined,
      minTrustScore: searchParams.get('minTrustScore') ? Number(searchParams.get('minTrustScore')) : undefined,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sort: (searchParams.get('sort') as any) || 'trust',
      page: Number(searchParams.get('page') || '1'),
      limit: Number(searchParams.get('limit') || '20'),
    };

    const result = await getGuilds(filters);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST /api/guilds - Create a new guild
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = await createGuild(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
