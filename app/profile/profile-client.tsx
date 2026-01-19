'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Award, Target, Settings, Zap, Star, Clock, Crown } from 'lucide-react';

interface ProfileClientProps {
  user?: {
    id: string;
    email?: string;
    username: string;
    avatar?: string;
    rank?: string;
    trustScore?: number;
  };
  userId?: string; // Optional user ID to fetch profile data for
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  rank: string;
  trustScore: number;
  completedQuests: number;
  hunterReputation: number;
  credits: number;
  skills: string[];
  bio?: string;
  avatar?: string;
  guildId?: any;
  achievements?: {
    achievementId: string;
    name: string;
    icon: string;
    description: string;
    earnedAt: string;
  }[];
  joinedAt: string;
  lastActive: string;
}

export default function ProfileClient({ user, userId }: ProfileClientProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;
  const isOwnProfile = user?.id === profile?._id || (!userId && user?.id === targetUserId);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const [profileRes, activitiesRes] = await Promise.all([
          fetch(`/api/users/${targetUserId}`),
          fetch(`/api/activities?userId=${targetUserId}&limit=5`)
        ]);

        if (!profileRes.ok) throw new Error('Failed to fetch profile');
        
        const profileData = await profileRes.json();
        setProfile(profileData);

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.activities || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [targetUserId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Card className="glass-strong border-2 border-destructive/30 p-8 max-w-md">
          <p className="text-center text-destructive">{error || 'Profile not found'}</p>
        </Card>
      </div>
    );
  }

  const stats = {
    completedQuests: profile.completedQuests || 0,
    activeQuests: (profile as any).activeQuests || 0,
    credits: profile.credits || 0,
    hunterReputation: profile.hunterReputation || 0,
    trustScore: profile.trustScore || 0,
    joinDate: new Date(profile.joinedAt || (profile as any).createdAt).toLocaleDateString(),
    lastActive: new Date(profile.lastActive).toLocaleDateString(),
  };

  const achievements = profile.achievements || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'BountyPosted': return '💰';
      case 'BountyAccepted': return '⚔️';
      case 'BountyCompleted': return '🏆';
      case 'GuildJoined': return '🏯';
      case 'AchievementUnlocked': return '🌟';
      case 'RankUp': return '👑';
      default: return '✨';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Card className="glass-strong border-2 border-primary/30 p-8 mb-8 military-corners">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="text-7xl animate-float">{profile.avatar || '👤'}</div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black font-heading text-gradient-primary">
                      {profile.username}
                    </h1>
                    <Badge className={`text-primary border-primary/40 bg-primary/10 font-bold`}>
                      {profile.rank}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Member since {stats.joinDate}
                  </p>                    {profile.guildId && (
                      <Link 
                        href={`/guilds/${profile.guildId._id || profile.guildId}`}
                        className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors inline-flex"
                      >
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold text-primary">
                          {profile.guildId.name || 'View Guild'}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({(profile as any).guildRole || 'Member'})
                        </span>
                      </Link>
                    )}                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        Trust Score: <span className="font-bold text-success">{profile.trustScore}%</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-warning" />
                      <span className="text-sm">
                        Credits: <span className="font-bold text-warning">{stats.credits?.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {isOwnProfile && (
                <Button asChild className="glow-primary">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Overview */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Performance Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={<Target />}
                    label="Completed"
                    value={stats.completedQuests.toString()}
                    color="primary"
                  />
                  <StatCard
                    icon={<Zap />}
                    label="Active"
                    value={stats.activeQuests.toString()}
                    color="secondary"
                  />
                  <StatCard
                    icon={<Award />}
                    label="Success Rate"
                    value={`${(profile as any).successRate || 100}%`}
                    color="success"
                  />
                  <StatCard
                    icon={<Clock />}
                    label="Avg Response"
                    value="N/A"
                    color="accent"
                  />
                </div>
              </div>

              {/* Trust Score Details */}
              <Card className="glass-strong border-2 border-primary/30 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Trust Score Breakdown
                </h3>
                <div className="space-y-4">
                  <TrustMetric label="Quest Completion" value={profile.trustScore || 0} max={100} />
                  <TrustMetric label="Communication" value={50} max={100} />
                  <TrustMetric label="Quality" value={50} max={100} />
                  <TrustMetric label="Timeliness" value={50} max={100} />
                </div>
              </Card>

              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <Card className="glass-strong border-2 border-primary/30 p-6">
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="text-3xl">{getActivityIcon(activity.type)}</div>
                          <div>
                            <div className="font-medium">{activity.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No activity yet. Start accepting quests to build your history!
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Achievements */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-warning" />
                  Achievements
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.length > 0 ? (
                    achievements.map((achievement) => (
                      <Card
                        key={achievement.achievementId}
                        className="glass-strong border-2 p-4 text-center transition-all border-warning/40 hover:border-warning/60"
                      >
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <div className="text-sm font-bold mb-1">{achievement.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {achievement.description}
                        </div>
                        <div className="text-[10px] mt-2 text-muted-foreground opacity-60">
                          Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground glass-strong border-2 border-dashed border-muted/20 rounded-xl">
                      No achievements yet. Keep growing to unlock them!
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <Card className="glass-strong border-2 border-secondary/30 p-6">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/bounties">
                      <Target className="mr-2 h-4 w-4" />
                      Browse Bounties
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/guilds">
                      <Crown className="mr-2 h-4 w-4" />
                      Find a Guild
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/dashboard">
                      <Star className="mr-2 h-4 w-4" />
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Getting Started - Only show on own profile */}
              {isOwnProfile && (
                <Card className="glass-strong border-2 border-accent/30 p-6">
                  <h3 className="text-xl font-bold mb-4">Getting Started</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-success">✓</span>
                      <span>Create your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`text-${profile.skills?.length > 0 ? 'success' : 'muted-foreground'}`}>
                        {profile.skills?.length > 0 ? '✓' : '○'}
                      </span>
                      <span className={profile.skills?.length > 0 ? '' : 'text-muted-foreground'}>Complete your profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`text-${profile.guildId ? 'success' : 'muted-foreground'}`}>
                        {profile.guildId ? '✓' : '○'}
                      </span>
                      <span className={profile.guildId ? '' : 'text-muted-foreground'}>Join or create a guild</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`text-${stats.completedQuests > 0 ? 'success' : 'muted-foreground'}`}>
                        {stats.completedQuests > 0 ? '✓' : '○'}
                      </span>
                      <span className={stats.completedQuests > 0 ? '' : 'text-muted-foreground'}>Accept your first quest</span>
                    </li>
                  </ul>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses = {
    primary: 'text-primary border-primary/30 bg-primary/5',
    secondary: 'text-secondary border-secondary/30 bg-secondary/5',
    accent: 'text-accent border-accent/30 bg-accent/5',
    success: 'text-success border-success/30 bg-success/5',
  };

  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <Card className="glass-strong border-2 border-primary/20 p-4 group hover:border-primary/40 transition-all">
      <div className={`inline-flex p-2 rounded-lg ${classes} mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-black text-gradient-primary mb-1">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </Card>
  );
}

function TrustMetric({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = (value / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-primary">{value}%</span>
      </div>
      <div className="h-2 bg-background/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-primary to-secondary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
