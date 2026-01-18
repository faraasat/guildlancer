import { NextRequest, NextResponse } from 'next/server';
import { getMyPostedBounties } from '@/lib/actions/bounties';
import { auth } from '@/lib/auth';

// GET /api/bounties/my-posted - Get current user's posted bounties
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await getMyPostedBounties();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
