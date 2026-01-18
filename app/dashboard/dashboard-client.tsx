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
  Timer,
  Crosshair,
  Terminal,
  Radar
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
    title: 'Missing Person Investigation',
    client: 'FamilyAdvocate',
    reward: 15000,
    deadline: '2 days',
    progress: 65,
    status: 'in-progress',
  },
  {
    id: 2,
    title: 'Background Verification Check',
    client: 'LawFirm Partners',
    reward: 8500,
    deadline: '5 days',
    progress: 30,
    status: 'in-progress',
  },
];

const mockPostedBounties = [
  {
    id: 1,
    title: 'Lost Property Recovery',
    applications: 5,
    reward: 12000,
    status: 'reviewing',
    posted: '3 days ago',
  },
  {
    id: 2,
    title: 'Document Research & Analysis',
    applications: 2,
    reward: 6000,
    status: 'active',
    posted: '1 day ago',
  },
];

export default function DashboardClient({ user }: DashboardClientProps) {
  const [mode, setMode] = useState<'hunter' | 'client'>('hunter');
  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with Mode Toggle */}
          <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-slide-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-2 border-primary/40 text-sm font-bold tracking-wider mb-2">
                <Radar className="h-5 w-5 text-primary animate-radar-sweep" />
                <span className="text-primary">COMMAND CENTER</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-heading">
                <span className="text-neon-primary animate-neon-flicker">WELCOME BACK,</span>{' '}
                <span className="text-gradient-primary">{user.username}</span>
              </h1>
              <p className="text-foreground/80 text-xl font-light">
                Your <span className="text-gradient-primary font-bold">tactical operations</span> command center
              </p>
            </div>
            
            {/* Mode Toggle - Enhanced */}
            <Card className="nft-card glass-strong border-2 border-primary/40 p-1 inline-flex hud-border">
              <Button
                variant={mode === 'hunter' ? 'default' : 'ghost'}
                className={mode === 'hunter' ? 'btn-anime border-2 border-primary/50' : 'transition-cyber'}
                onClick={() => setMode('hunter')}
              >
                <Crosshair className="mr-2 h-5 w-5" />
                <span className="font-bold tracking-wider">HUNTER MODE</span>
              </Button>
              <Button
                variant={mode === 'client' ? 'default' : 'ghost'}
                className={mode === 'client' ? 'btn-anime border-2 border-primary/50' : 'transition-cyber'}
                onClick={() => setMode('client')}
              >
                <Terminal className="mr-2 h-5 w-5" />
                <span className="font-bold tracking-wider">CLIENT MODE</span>
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
                  <Card className="relative nft-card glass-strong border-2 border-primary/40 p-8 hud-border overflow-hidden">
                    {/* Scan Line Effect */}
                    
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-black flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/20 border-2 border-primary/40 glow-primary">
                          <Activity className="h-7 w-7 text-primary" />
                        </div>
                        <span className="text-neon-primary tracking-tight">ACTIVE MISSIONS</span>
                      </h2>
                      <Button asChild variant="outline" className="hologram-card border-2 border-primary/50 hover:border-primary transition-cyber">
                        <Link href="/bounties">
                          <span className="font-bold tracking-wider">BROWSE ALL</span>
                          <ArrowRight className="ml-2 h-5 w-5" />
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
                      <div className="text-center py-16 relative">
                        <div className="relative inline-block mb-6">
                          <Crosshair className="h-24 w-24 text-primary mx-auto animate-pulse-glow" />
                          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
                        </div>
                        <h3 className="text-2xl font-black mb-3 text-gradient-primary">NO ACTIVE MISSIONS</h3>
                        <p className="text-foreground/70 mb-8 text-lg">
                          Deploy to the field and secure your first <span className="text-gradient-success font-bold">objective</span>
                        </p>
                        <Button asChild className="btn-anime border-2 border-primary/50 text-lg h-14 px-10">
                          <Link href="/bounties">
                            <Target className="mr-3 h-5 w-5" />
                            <span className="font-black tracking-wider">FIND MISSIONS</span>
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
              <Card className="nft-card glass-strong border-2 border-primary/40 p-6 hud-border overflow-hidden">
                {/* Scan Line */}
                
                <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-neon-primary tracking-wider">
                  <Shield className="h-5 w-5" />
                  OPERATOR PROFILE
                </h3>
                
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/40 to-secondary/40 flex items-center justify-center border-2 border-primary/50 glow-primary">
                      <span className="text-4xl font-black text-neon-primary">{user.username[0].toUpperCase()}</span>
                    </div>
                    <div className="absolute -inset-2 border-2 border-primary/30 rounded-full animate-pulse-glow" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background animate-glow-pulse" />
                  </div>
                  <h3 className="text-xl font-black mb-1 text-gradient-primary">{user.username}</h3>
                  <Badge className="text-primary border-2 border-primary/50 bg-primary/20 font-bold tracking-wider">
                    {user.rank}
                  </Badge>
                </div>
                
                <div className="space-y-4 pt-4 border-t-2 border-primary/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70 font-bold tracking-wider uppercase">Trust Score</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-primary to-success rounded-full" style={{ width: `${user.trustScore}%` }} />
                      </div>
                      <span className="font-black text-neon-primary">{user.trustScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70 font-bold tracking-wider uppercase">Completed Ops</span>
                    <span className="font-black text-success">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70 font-bold tracking-wider uppercase">Guild Status</span>
                    <span className="font-black text-muted-foreground">SOLO</span>
                  </div>
                </div>

                <Button asChild className="w-full mt-6 btn-anime border-2 border-primary/50" variant="outline">
                  <Link href="/profile">
                    <span className="font-bold tracking-wider">VIEW PROFILE</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>

              {/* Notifications */}
              <Card className="nft-card glass-strong border-2 border-warning/40 p-6 hud-border overflow-hidden">
                {/* Scan Line */}
                
                <h3 className="text-lg font-black mb-4 flex items-center gap-2 tracking-wider">
                  <div className="p-1.5 rounded-lg bg-warning/20 border-2 border-warning/40 animate-pulse-glow">
                    <Bell className="h-4 w-4 text-warning" />
                  </div>
                  <span className="text-neon-warning">ALERTS</span>
                  <Badge className="ml-auto bg-warning/30 text-warning border-2 border-warning/50 font-black px-3 animate-glow-pulse">2</Badge>
                </h3>
                
                <div className="space-y-3">
                  <div className="glass-strong p-3 rounded-lg text-sm border-l-2 border-primary/50 hover:border-primary transition-cyber">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-gradient-primary">Welcome to GuildLancer!</p>
                        <p className="text-xs text-foreground/60 mt-1">Check out the getting started guide</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-strong p-3 rounded-lg text-sm border-l-2 border-success/50 hover:border-success transition-cyber">
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-success mt-0.5 shrink-0 animate-pulse-glow" />
                      <div>
                        <p className="font-bold text-gradient-success">Bonus Credits Added</p>
                        <p className="text-xs text-foreground/60 mt-1">1,000 credits deployed to account</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full mt-4 text-xs font-bold tracking-wider hover:bg-warning/10 transition-cyber">
                  VIEW ALL TRANSMISSIONS
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
    <div className="nft-card glass-strong p-6 rounded-lg border-2 border-primary/30 hover:border-primary/60 transition-cyber group hud-border overflow-hidden">
      {/* Scan Line */}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-black group-hover:text-gradient-primary transition-colors mb-2">
            {mission.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-foreground/70">
            <span className="flex items-center gap-2 font-bold tracking-wider uppercase">
              <Briefcase className="h-4 w-4 text-primary" />
              {mission.client}
            </span>
            <span className="flex items-center gap-2 font-bold tracking-wider uppercase text-warning">
              <Timer className="h-4 w-4 animate-pulse-glow" />
              {mission.deadline} LEFT
            </span>
          </div>
        </div>
        <Badge className="bg-warning/30 text-warning border-2 border-warning/50 shrink-0 font-black px-4 py-2 text-sm animate-pulse-glow">
          {mission.reward.toLocaleString()} CR
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70 font-bold tracking-wider uppercase">Progress</span>
          <span className="font-black text-neon-primary">{mission.progress}%</span>
        </div>
        <div className="h-3 bg-background/50 rounded-full overflow-hidden border border-primary/30">
          <div
            className="h-full bg-linear-to-r from-primary via-accent to-secondary"
            style={{ width: `${mission.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button variant="outline" className="flex-1 hologram-card border-2 border-primary/50 hover:border-primary transition-cyber" size="sm">
          <span className="font-bold tracking-wider">VIEW DETAILS</span>
        </Button>
        <Button className="flex-1 btn-anime border-2 border-success/50" size="sm">
          <span className="font-bold tracking-wider">CONTINUE OPS</span>
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
    primary: { text: 'text-neon-primary', border: 'border-primary/40', bg: 'bg-primary/20', glow: 'glow-primary' },
    secondary: { text: 'text-neon-secondary', border: 'border-secondary/40', bg: 'bg-secondary/20', glow: 'glow-secondary' },
    success: { text: 'text-neon-success', border: 'border-success/40', bg: 'bg-success/20', glow: 'glow-success' },
    warning: { text: 'text-warning', border: 'border-warning/40', bg: 'bg-warning/20', glow: 'glow-warning' },
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  const classes = colorClasses[color];

  return (
    <Card className={`nft-card glass-strong border-2 ${classes.border} p-6 hover:border-${color}/60 transition-cyber hud-border group overflow-hidden animate-slide-in-up`}>
      {/* Scan Line */}
      
      <div className={`inline-flex p-3 rounded-lg ${classes.bg} border-2 ${classes.border} ${classes.glow} mb-4 group-hover:scale-110 transition-cyber`}>
        {icon}
      </div>
      <div className={`text-4xl font-black ${classes.text} mb-2 animate-hologram-glitch`}>{value}</div>
      <div className="text-sm text-foreground/70 font-bold tracking-wider uppercase mb-2">{label}</div>
      <div className={`text-xs font-bold ${trendColors[trend]} flex items-center gap-1 border ${classes.border} px-2 py-1 rounded-full ${classes.bg} w-fit`}>
        {trend === 'up' && <TrendingUp className="h-3 w-3" />}
        {change}
      </div>
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
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
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
