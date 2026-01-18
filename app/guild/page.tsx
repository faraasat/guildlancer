import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import GuildClient from './guild-client';

export default async function GuildPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <GuildClient user={session.user} />;
}
