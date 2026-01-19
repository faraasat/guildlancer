import { auth } from '@/lib/auth';
import ProfileClient from '../profile-client';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  return <ProfileClient user={session?.user as any} userId={id} />;
}
