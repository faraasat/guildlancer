import { NextRequest, NextResponse } from 'next/server';
import { getUserTransactions } from '@/lib/actions/activities';

// GET /api/transactions - Get user transactions
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    const filters = {
      page: Number(searchParams.get('page') || '1'),
      limit: Number(searchParams.get('limit') || '50'),
    };

    const result = await getUserTransactions(filters);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
