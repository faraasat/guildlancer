import { NextRequest, NextResponse } from 'next/server';
import { reviewBountySubmission } from '@/lib/actions/bounties';
import { auth } from '@/lib/auth';

// POST /api/bounties/[id]/review - Review bounty submission (Client)
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

    const { accept } = await req.json();
    
    if (typeof accept !== 'boolean') {
      return NextResponse.json({ error: 'Accept boolean is required' }, { status: 400 });
    }

    const result = await reviewBountySubmission(id, accept);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
