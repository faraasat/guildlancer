import { auth } from '@/lib/auth';
import ProfileClient from '../profile-client';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  // Fetch user data by ID
  const user = {
    id,
    username: 'Loading...',
  };

  return <ProfileClient user={user} userId={id} />;
}
