import { NextRequest, NextResponse } from 'next/server';
import { getGuildStats } from '@/lib/actions/guilds';

// GET /api/guilds/[id]/stats - Get guild statistics and analytics
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getGuildStats(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
