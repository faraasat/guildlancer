import { NextRequest, NextResponse } from 'next/server';
import { submitDisputeEvidence } from '@/lib/actions/disputes';
import { auth } from '@/lib/auth';

// POST /api/disputes/[id]/evidence - Submit additional evidence
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const evidenceData = await req.json();
    const result = await submitDisputeEvidence(params.id, evidenceData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
