import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import MessagesClient from './messages-client';

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <MessagesClient user={session.user} />;
}
