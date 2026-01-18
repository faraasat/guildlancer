import { NextRequest, NextResponse } from 'next/server';
import { raiseDispute, getMyDisputes } from '@/lib/actions/disputes';
import { auth } from '@/lib/auth';

// GET /api/disputes - Get current user's disputes
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await getMyDisputes();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST /api/disputes - Raise a new dispute
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bountyId, ...evidenceData } = await req.json();
    
    if (!bountyId) {
      return NextResponse.json({ error: 'Bounty ID is required' }, { status: 400 });
    }

    const result = await raiseDispute(bountyId, evidenceData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
