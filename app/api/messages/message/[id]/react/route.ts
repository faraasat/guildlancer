import { NextRequest, NextResponse } from 'next/server';
import { addReaction } from '@/lib/actions/messages';
import { auth } from '@/lib/auth';

// POST /api/messages/message/[id]/react - Add/remove reaction
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

    const { emoji } = await req.json();
    
    if (!emoji) {
      return NextResponse.json({ error: 'Emoji is required' }, { status: 400 });
    }

    const result = await addReaction(id, emoji);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
