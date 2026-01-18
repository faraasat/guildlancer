import { NextRequest, NextResponse } from 'next/server';
import { applyToGuild, leaveGuild, manageGuildMember } from '@/lib/actions/guilds';
import { auth } from '@/lib/auth';

// POST /api/guilds/[id]/members - Join guild or manage members
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

    const body = await req.json();
    const { action } = body;

    if (action === 'join') {
      // Join guild
      const result = await applyToGuild(id);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ message: result.message });
    } else if (action === 'leave') {
      // Leave guild
      const result = await leaveGuild();
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ message: result.message });
    } else if (['promote', 'demote', 'kick'].includes(action)) {
      // Manage member
      const result = await manageGuildMember(body);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ message: result.message });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
