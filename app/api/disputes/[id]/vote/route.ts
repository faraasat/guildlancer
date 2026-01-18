import { NextRequest, NextResponse } from 'next/server';
import { castTribunalVote } from '@/lib/actions/disputes';
import { auth } from '@/lib/auth';

// POST /api/disputes/[id]/vote - Cast tribunal vote (Guild Master)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const voteData = await req.json();
    const result = await castTribunalVote(id, voteData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
