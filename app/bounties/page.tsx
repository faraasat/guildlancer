import { auth } from '@/lib/auth';
import BountiesClient from './bounties-client';

export default async function BountiesPage() {
  const session = await auth();

  return <BountiesClient user={session?.user} />;
}
