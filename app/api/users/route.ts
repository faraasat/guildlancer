import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/actions/users';

// GET /api/users - Get users/hunters with filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    const filters = {
      rank: searchParams.get('rank') as any || undefined,
      minTrustScore: searchParams.get('minTrustScore') ? Number(searchParams.get('minTrustScore')) : undefined,
      skills: searchParams.get('skills')?.split(',').filter(Boolean) || undefined,
      guildId: searchParams.get('guildId') || undefined,
      search: searchParams.get('search') || undefined,
      sort: (searchParams.get('sort') as any) || 'trust',
      page: Number(searchParams.get('page') || '1'),
      limit: Number(searchParams.get('limit') || '20'),
    };

    const result = await getUsers(filters);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
