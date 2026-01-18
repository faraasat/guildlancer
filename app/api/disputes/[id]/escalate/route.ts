import { NextRequest, NextResponse } from 'next/server';
import { requestAIAnalysis, escalateToTribunal } from '@/lib/actions/disputes';
import { auth } from '@/lib/auth';

// POST /api/disputes/[id]/escalate - Escalate dispute to next tier
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await req.json();

    let result;
    if (tier === 'ai') {
      // Escalate to AI Arbiter (Tier 2)
      result = await requestAIAnalysis(params.id);
    } else if (tier === 'tribunal') {
      // Escalate to Tribunal (Tier 3)
      result = await escalateToTribunal(params.id);
    } else {
      return NextResponse.json({ error: 'Invalid tier. Use "ai" or "tribunal"' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
