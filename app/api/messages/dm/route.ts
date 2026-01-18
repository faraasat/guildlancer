import { NextRequest, NextResponse } from 'next/server';
import { getDMConversationId } from '@/lib/actions/messages';
import { auth } from '@/lib/auth';

// POST /api/messages/dm - Create/get DM conversation ID
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { otherUserId } = await req.json();
    
    if (!otherUserId) {
      return NextResponse.json({ error: 'Other user ID is required' }, { status: 400 });
    }

    const result = await getDMConversationId(otherUserId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
