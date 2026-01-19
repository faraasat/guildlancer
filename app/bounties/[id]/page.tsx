import { auth } from '@/lib/auth';
import { getBountyById } from '@/lib/actions/bounties';
import BountyDetailClient from './bounty-detail-client';
import { notFound } from 'next/navigation';

export default async function BountyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  const result = await getBountyById(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  return <BountyDetailClient bounty={result.data} user={session?.user} />;
}
