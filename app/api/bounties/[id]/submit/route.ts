import { NextRequest, NextResponse } from 'next/server';
import { submitBountyProof } from '@/lib/actions/bounties';
import { auth } from '@/lib/auth';

// POST /api/bounties/[id]/submit - Submit proof of work
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

    const proof = await req.json();
    const result = await submitBountyProof(id, proof);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
