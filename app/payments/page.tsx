import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PaymentsClient from './payments-client';

export default async function PaymentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <PaymentsClient user={session.user} />;
}
