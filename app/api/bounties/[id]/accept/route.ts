import { NextRequest, NextResponse } from 'next/server';
import { acceptBounty } from '@/lib/actions/bounties';
import { auth } from '@/lib/auth';

// POST /api/bounties/[id]/accept - Accept a bounty (Guild Master)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId } = await req.json();
    
    if (!guildId) {
      return NextResponse.json({ error: 'Guild ID is required' }, { status: 400 });
    }

    const { id } = await params;
    const result = await acceptBounty(id, guildId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
