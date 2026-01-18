'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Award, Target, Settings, Zap, Star, Clock, Crown } from 'lucide-react';

interface ProfileClientProps {
  user: {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    rank: string;
    trustScore: number;
  };
}

// Mock data for profile
const mockStats = {
  completedQuests: 0,
  activeQuests: 0,
  credits: 1000,
  stakedCredits: 0,
  successRate: 0,
  avgResponseTime: 'N/A',
  joinDate: new Date().toLocaleDateString(),
};

const mockAchievements = [
  { id: 1, name: 'First Steps', icon: '🎯', description: 'Joined GuildLancer', unlocked: true },
  { id: 2, name: 'Quest Master', icon: '⚔️', description: 'Complete 10 quests', unlocked: false },
  { id: 3, name: 'Trusted', icon: '🛡️', description: 'Reach 80% trust score', unlocked: false },
  { id: 4, name: 'Elite Hunter', icon: '👑', description: 'Reach Elite rank', unlocked: false },
];

const mockActivity = [
  { type: 'joined', text: 'Joined GuildLancer', time: 'Today', icon: '✨' },
];

export default function ProfileClient({ user }: ProfileClientProps) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Card className="glass-strong border-2 border-primary/30 p-8 mb-8 military-corners">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="text-7xl animate-float">{user.avatar || '👤'}</div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black font-heading text-gradient-primary">
                      {user.username}
                    </h1>
                    <Badge className={`text-primary border-primary/40 bg-primary/10 font-bold`}>
                      {user.rank}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Member since {mockStats.joinDate}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        Trust Score: <span className="font-bold text-success">{user.trustScore}%</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-warning" />
                      <span className="text-sm">
                        Credits: <span className="font-bold text-warning">{mockStats.credits.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button asChild className="glow-primary">
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
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
                    value={mockStats.completedQuests.toString()}
                    color="primary"
                  />
                  <StatCard
                    icon={<Zap />}
                    label="Active"
                    value={mockStats.activeQuests.toString()}
                    color="secondary"
                  />
                  <StatCard
                    icon={<Award />}
                    label="Success Rate"
                    value={mockStats.successRate ? `${mockStats.successRate}%` : 'N/A'}
                    color="success"
                  />
                  <StatCard
                    icon={<Clock />}
                    label="Avg Response"
                    value={mockStats.avgResponseTime}
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
                  <TrustMetric label="Quest Completion" value={user.trustScore} max={100} />
                  <TrustMetric label="Communication" value={50} max={100} />
                  <TrustMetric label="Quality" value={50} max={100} />
                  <TrustMetric label="Timeliness" value={50} max={100} />
                </div>
              </Card>

              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <Card className="glass-strong border-2 border-primary/30 p-6">
                  {mockActivity.length > 0 ? (
                    <div className="space-y-4">
                      {mockActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="text-3xl">{activity.icon}</div>
                          <div>
                            <div className="font-medium">{activity.text}</div>
                            <div className="text-sm text-muted-foreground">{activity.time}</div>
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
                  {mockAchievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`glass-strong border-2 p-4 text-center transition-all ${
                        achievement.unlocked
                          ? 'border-warning/40 hover:border-warning/60'
                          : 'border-muted/20 opacity-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <div className="text-sm font-bold mb-1">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                    </Card>
                  ))}
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

              {/* Getting Started */}
              <Card className="glass-strong border-2 border-accent/30 p-6">
                <h3 className="text-xl font-bold mb-4">Getting Started</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Create your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">○</span>
                    <span className="text-muted-foreground">Complete your profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">○</span>
                    <span className="text-muted-foreground">Join or create a guild</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">○</span>
                    <span className="text-muted-foreground">Accept your first quest</span>
                  </li>
                </ul>
              </Card>
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
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
