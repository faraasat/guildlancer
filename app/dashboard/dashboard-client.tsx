'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  TrendingUp,
  Award,
  Target,
  Zap,
  Star,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Activity
} from 'lucide-react';

interface DashboardClientProps {
  user: {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    rank: string;
    trustScore: number;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">
              Welcome back, <span className="text-gradient-primary">{user.username}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your command center for all quest activities
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Shield />}
              label="Trust Score"
              value={`${user.trustScore}%`}
              change="+0%"
              trend="up"
              color="primary"
            />
            <StatCard
              icon={<Target />}
              label="Active Quests"
              value="0"
              change="—"
              trend="neutral"
              color="secondary"
            />
            <StatCard
              icon={<Award />}
              label="Completed"
              value="0"
              change="—"
              trend="neutral"
              color="success"
            />
            <StatCard
              icon={<Zap />}
              label="Credits"
              value="1,000"
              change="+1,000"
              trend="up"
              color="warning"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Quests */}
              <Card className="glass-strong border-2 border-primary/30 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Activity className="h-6 w-6 text-primary" />
                    Active Quests
                  </h2>
                  <Button asChild variant="outline" className="border-primary/30">
                    <Link href="/bounties">
                      Browse All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold mb-2">No Active Quests</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your journey by accepting a quest
                  </p>
                  <Button asChild className="glow-primary">
                    <Link href="/bounties">
                      <Target className="mr-2 h-4 w-4" />
                      Find Quests
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-strong border-2 border-secondary/30 p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-secondary" />
                  Recent Activity
                </h2>
                
                <div className="space-y-4">
                  <ActivityItem
                    icon="✨"
                    title="Joined GuildLancer"
                    time="Today"
                    color="success"
                  />
                  <ActivityItem
                    icon="🎁"
                    title="Received 1,000 welcome credits"
                    time="Today"
                    color="warning"
                  />
                </div>
              </Card>

              {/* Getting Started */}
              <Card className="glass-strong border-2 border-accent/30 p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                  Getting Started Guide
                </h2>
                
                <div className="space-y-4">
                  <GuidanceStep
                    number={1}
                    title="Complete Your Profile"
                    description="Add your skills and bio to stand out"
                    completed={false}
                    href="/settings"
                  />
                  <GuidanceStep
                    number={2}
                    title="Join a Guild"
                    description="Team up with other hunters for better opportunities"
                    completed={false}
                    href="/guilds"
                  />
                  <GuidanceStep
                    number={3}
                    title="Accept Your First Quest"
                    description="Browse available bounties and start earning"
                    completed={false}
                    href="/bounties"
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Profile Summary */}
              <Card className="glass-strong border-2 border-primary/30 p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3 animate-float">{user.avatar || '👤'}</div>
                  <h3 className="text-xl font-bold mb-1">{user.username}</h3>
                  <Badge className="text-primary border-primary/40 bg-primary/10">
                    {user.rank}
                  </Badge>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-primary/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trust Score</span>
                    <span className="font-bold text-primary">{user.trustScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed Quests</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Guild</span>
                    <span className="font-bold text-muted-foreground">None</span>
                  </div>
                </div>

                <Button asChild className="w-full mt-4" variant="outline">
                  <Link href="/profile">
                    View Full Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>

              {/* Recommendations */}
              <Card className="glass-strong border-2 border-secondary/30 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-warning" />
                  Recommended
                </h3>
                
                <div className="space-y-4">
                  <RecommendationCard
                    title="Join Cyber Syndicate"
                    description="Elite security guild accepting new members"
                    badge="Top Guild"
                    href="/guilds/1"
                  />
                  <RecommendationCard
                    title="Explore Top Hunters"
                    description="Learn from the best in the network"
                    badge="Inspiration"
                    href="/hunters"
                  />
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="glass-strong border-2 border-accent/30 p-6">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                
                <div className="space-y-2">
                  <QuickLink href="/bounties" icon={<Target />} label="Browse Bounties" />
                  <QuickLink href="/guilds" icon={<Users />} label="Find Guilds" />
                  <QuickLink href="/hunters" icon={<Award />} label="Top Hunters" />
                  <QuickLink href="/about" icon={<Sparkles />} label="How It Works" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, trend, color }: any) {
  const colorClasses = {
    primary: 'text-primary border-primary/30',
    secondary: 'text-secondary border-secondary/30',
    success: 'text-success border-success/30',
    warning: 'text-warning border-warning/30',
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card className="glass-strong border-2 border-primary/20 p-6 hover:border-primary/40 transition-all">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} bg-${color}/5 mb-3`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-gradient-primary mb-1">{value}</div>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className={`text-xs font-medium ${trendColors[trend]}`}>{change}</div>
    </Card>
  );
}

function ActivityItem({ icon, title, time, color }: any) {
  return (
    <div className="flex items-center gap-4 p-3 glass rounded-lg">
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{time}</div>
      </div>
    </div>
  );
}

function GuidanceStep({ number, title, description, completed, href }: any) {
  return (
    <Link href={href}>
      <div className="flex gap-4 p-4 glass rounded-lg hover:border-accent/30 border border-transparent transition-all group">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
          completed ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
        }`}>
          {completed ? '✓' : number}
        </div>
        <div className="flex-1">
          <div className="font-bold mb-1 group-hover:text-accent transition-colors">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

function RecommendationCard({ title, description, badge, href }: any) {
  return (
    <Link href={href}>
      <div className="glass p-4 rounded-lg hover:border-secondary/30 border border-transparent transition-all group">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-bold group-hover:text-secondary transition-colors">{title}</h4>
          <Badge variant="outline" className="text-xs border-warning/30 text-warning">
            {badge}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

function QuickLink({ href, icon, label }: any) {
  return (
    <Button asChild variant="ghost" className="w-full justify-start group">
      <Link href={href}>
        <span className="mr-2 group-hover:text-primary transition-colors">{icon}</span>
        {label}
        <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </Link>
    </Button>
  );
}
