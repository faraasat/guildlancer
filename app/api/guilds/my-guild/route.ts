import { NextRequest, NextResponse } from 'next/server';
import { getMyGuild } from '@/lib/actions/guilds';
import { auth } from '@/lib/auth';

// GET /api/guilds/my-guild - Get current user's guild
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await getMyGuild();

    if (!result.success) {
      return NextResponse.json({ data: null }); // No guild
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
