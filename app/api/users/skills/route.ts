import { NextRequest, NextResponse } from 'next/server';
import { getTopSkills } from '@/lib/actions/users';

// GET /api/users/skills - Get top skills in the network
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = Number(searchParams.get('limit') || '10');

    const result = await getTopSkills(limit);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
