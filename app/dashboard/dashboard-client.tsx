'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Award,
  Target,
  Zap,
  Star,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Activity,
  Briefcase,
  Bell,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Timer
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

// Mock data for missions
const mockActiveMissions = [
  {
    id: 1,
    title: 'Smart Contract Security Audit',
    client: 'CryptoDAO',
    reward: 15000,
    deadline: '2 days',
    progress: 65,
    status: 'in-progress',
  },
  {
    id: 2,
    title: 'Mobile App UI Redesign',
    client: 'TechCorp',
    reward: 8500,
    deadline: '5 days',
    progress: 30,
    status: 'in-progress',
  },
];

const mockPostedBounties = [
  {
    id: 1,
    title: 'Backend API Development',
    applications: 5,
    reward: 12000,
    status: 'reviewing',
    posted: '3 days ago',
  },
  {
    id: 2,
    title: 'Database Migration',
    applications: 2,
    reward: 6000,
    status: 'active',
    posted: '1 day ago',
  },
];

export default function DashboardClient({ user }: DashboardClientProps) {
  const [mode, setMode] = useState<'hunter' | 'client'>('hunter');
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with Mode Toggle */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-heading mb-2">
                Welcome back, <span className="text-gradient-primary">{user.username}</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Your command center for all quest activities
              </p>
            </div>
            
            {/* Mode Toggle */}
            <Card className="glass-strong border-2 border-primary/30 p-1 inline-flex">
              <Button
                variant={mode === 'hunter' ? 'default' : 'ghost'}
                className={mode === 'hunter' ? 'glow-primary' : ''}
                onClick={() => setMode('hunter')}
              >
                <Target className="mr-2 h-4 w-4" />
                Hunter Mode
              </Button>
              <Button
                variant={mode === 'client' ? 'default' : 'ghost'}
                className={mode === 'client' ? 'glow-primary' : ''}
                onClick={() => setMode('client')}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Client Mode
              </Button>
            </Card>
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
              {/* Hunter Mode Content */}
              {mode === 'hunter' && (
                <>
                  {/* Active Missions */}
                  <Card className="glass-strong border-2 border-primary/30 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Active Missions
                      </h2>
                      <Button asChild variant="outline" className="border-primary/30">
                        <Link href="/bounties">
                          Browse All
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    {mockActiveMissions.length > 0 ? (
                      <div className="space-y-4">
                        {mockActiveMissions.map((mission) => (
                          <MissionCard key={mission.id} mission={mission} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold mb-2">No Active Missions</h3>
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
                    )}
                  </Card>

                  {/* Available Opportunities */}
                  <Card className="glass-strong border-2 border-secondary/30 p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-secondary" />
                      Recommended for You
                    </h2>
                    <p className="text-muted-foreground">
                      AI-powered recommendations coming soon...
                    </p>
                  </Card>
                </>
              )}

              {/* Client Mode Content */}
              {mode === 'client' && (
                <>
                  {/* Posted Bounties */}
                  <Card className="glass-strong border-2 border-primary/30 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Briefcase className="h-6 w-6 text-primary" />
                        My Posted Bounties
                      </h2>
                      <Button asChild className="glow-primary">
                        <Link href="/bounties/create">
                          Post New Bounty
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    {mockPostedBounties.length > 0 ? (
                      <div className="space-y-4">
                        {mockPostedBounties.map((bounty) => (
                          <BountyCard key={bounty.id} bounty={bounty} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-bold mb-2">No Bounties Posted</h3>
                        <p className="text-muted-foreground mb-6">
                          Post your first bounty to find skilled hunters
                        </p>
                        <Button asChild className="glow-primary">
                          <Link href="/bounties/create">
                            <Target className="mr-2 h-4 w-4" />
                            Post Bounty
                          </Link>
                        </Button>
                      </div>
                    )}
                  </Card>

                  {/* Applications */}
                  <Card className="glass-strong border-2 border-accent/30 p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Users className="h-6 w-6 text-accent" />
                      Recent Applications
                    </h2>
                    <p className="text-muted-foreground text-center py-8">
                      No pending applications
                    </p>
                  </Card>
                </>
              )}

              {/* Guild Status - Shared */}
              <Card className="glass-strong border-2 border-success/30 p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="h-6 w-6 text-success" />
                  Guild Status
                </h2>
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">⚔️</div>
                  <p className="text-muted-foreground mb-4">
                    You're not part of any guild yet
                  </p>
                  <Button asChild variant="outline" className="border-success/30">
                    <Link href="/guilds">
                      Find a Guild
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                  />
                  <ActivityItem
                    icon="🎁"
                    title="Received 1,000 welcome credits"
                    time="Today"
                  />
                  {mode === 'hunter' && mockActiveMissions.length > 0 && (
                    <ActivityItem
                      icon="⚔️"
                      title={`Started mission: ${mockActiveMissions[0].title}`}
                      time="2 hours ago"
                    />
                  )}
                </div>
              </Card>

              {/* Getting Started */}
              {mode === 'hunter' && mockActiveMissions.length === 0 && (
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
              )}
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

              {/* Notifications */}
              <Card className="glass-strong border-2 border-warning/30 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-warning" />
                  Notifications
                  <Badge className="ml-auto bg-warning/20 text-warning border-warning/30">2</Badge>
                </h3>
                
                <div className="space-y-3">
                  <div className="glass p-3 rounded-lg text-sm">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Welcome to GuildLancer!</p>
                        <p className="text-xs text-muted-foreground">Check out the getting started guide</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass p-3 rounded-lg text-sm">
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Bonus Credits Added</p>
                        <p className="text-xs text-muted-foreground">1,000 credits added to your account</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full mt-4 text-xs">
                  View All Notifications
                </Button>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-strong border-2 border-accent/30 p-6">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                
                <div className="space-y-2">
                  <QuickLink href={mode === 'hunter' ? '/bounties' : '/bounties/create'} icon={<Target />} label={mode === 'hunter' ? 'Browse Bounties' : 'Post Bounty'} />
                  <QuickLink href="/guilds" icon={<Users />} label="Find Guilds" />
                  <QuickLink href="/analytics" icon={<TrendingUp />} label="View Analytics" />
                  <QuickLink href="/payments" icon={<Zap />} label="Manage Credits" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mission Card Component
function MissionCard({ mission }: { mission: any }) {
  return (
    <div className="glass p-6 rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
            {mission.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {mission.client}
            </span>
            <span className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              {mission.deadline} left
            </span>
          </div>
        </div>
        <Badge className="bg-warning/20 text-warning border-warning/30 shrink-0">
          {mission.reward.toLocaleString()} credits
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-bold text-primary">{mission.progress}%</span>
        </div>
        <div className="h-2 bg-background/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
            style={{ width: `${mission.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex gap-3 mt-4">
        <Button variant="outline" className="flex-1 border-primary/30" size="sm">
          View Details
        </Button>
        <Button className="flex-1 glow-primary" size="sm">
          Continue Work
        </Button>
      </div>
    </div>
  );
}

// Bounty Card Component
function BountyCard({ bounty }: { bounty: any }) {
  const statusColors = {
    reviewing: 'text-warning border-warning/30 bg-warning/10',
    active: 'text-success border-success/30 bg-success/10',
    completed: 'text-primary border-primary/30 bg-primary/10',
  };

  return (
    <div className="glass p-6 rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
            {bounty.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Posted {bounty.posted}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {bounty.applications} applications
            </span>
          </div>
        </div>
        <Badge className={statusColors[bounty.status as keyof typeof statusColors]}>
          {bounty.status}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-primary/20">
        <div className="text-sm">
          <span className="text-muted-foreground">Reward:</span>{' '}
          <span className="font-bold text-warning">{bounty.reward.toLocaleString()} credits</span>
        </div>
        <Button variant="outline" className="border-primary/30" size="sm">
          Manage
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, trend, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'primary' | 'secondary' | 'success' | 'warning';
}) {
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

function ActivityItem({ icon, title, time }: { icon: string; title: string; time: string }) {
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

function GuidanceStep({ number, title, description, completed, href }: {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  href: string;
}) {
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
        <ArrowRight className="h-5 w-5 text-muted-foreground grou{
  title: string;
  description: string;
  badge: string;
  href: string;
}over:text-accent group-hover:translate-x-1 transition-all" />
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
        <p className="text-sm text-muted-f{ href: string; icon: React.ReactNode; label: string }ground">{description}</p>
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
