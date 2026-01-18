'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Target, TrendingUp, Shield, Star, Award, Zap, Activity, Calendar, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock guild data
const mockGuild = {
  id: 1,
  name: 'Cyber Syndicate',
  tagline: 'Elite coders & security experts',
  avatar: '🛡️',
  description: 'We are a collective of elite security researchers, penetration testers, and infrastructure engineers. Our mission is to build secure, scalable systems while maintaining the highest trust scores in the network.',
  founded: '2024-03-15',
  members: 47,
  activeQuests: 12,
  completedQuests: 156,
  trustScore: 98.5,
  powerLevel: 2847,
  rank: 'Platinum',
  specialization: 'Security & Infrastructure',
  treasury: 458000,
  successRate: 97.8,
  avgResponseTime: '2.4 hours',
  members_list: [
    { id: 1, name: 'CipherMaster', avatar: '👤', role: 'Guild Master', trustScore: 99.2, quests: 43 },
    { id: 2, name: 'NeonSamurai', avatar: '⚔️', role: 'Elite Hunter', trustScore: 98.8, quests: 38 },
    { id: 3, name: 'ByteNinja', avatar: '🥷', role: 'Elite Hunter', trustScore: 98.5, quests: 35 },
    { id: 4, name: 'QuantumHawk', avatar: '🦅', role: 'Senior Hunter', trustScore: 97.1, quests: 29 },
    { id: 5, name: 'CodeViper', avatar: '🐍', role: 'Senior Hunter', trustScore: 96.8, quests: 27 },
  ],
  recentActivity: [
    { type: 'quest_completed', quest: 'Missing Person Case', reward: 15000, time: '2 hours ago' },
    { type: 'member_joined', member: 'QuantumHawk', time: '1 day ago' },
    { type: 'quest_accepted', quest: 'Background Verification', stake: 8000, time: '2 days ago' },
    { type: 'dispute_won', quest: 'Asset Recovery', time: '3 days ago' },
  ],
  stats: {
    trustEvolution: [95, 96, 96.5, 97, 97.8, 98, 98.5],
    questsPerMonth: [8, 12, 15, 18, 14, 16, 12],
  }
};

export default function GuildDetailPage() {
  const params = useParams();
  const guild = mockGuild; // In real app, fetch by params.id

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/guilds" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Guilds
        </Link>

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <Card className="glass-strong border-2 border-primary/30 p-8 military-corners tactical-scan">
              <div className="flex items-start gap-6">
                <div className="text-7xl animate-float">{guild.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black font-heading text-gradient-primary">
                      {guild.name}
                    </h1>
                    <Badge className="text-primary border-primary/40 bg-primary/10 font-bold text-lg px-4 py-1">
                      {guild.rank}
                    </Badge>
                  </div>
                  <p className="text-xl text-muted-foreground mb-4">{guild.tagline}</p>
                  <p className="text-foreground/80 leading-relaxed mb-6">{guild.description}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="glow-primary">
                      <Users className="mr-2 h-5 w-5" />
                      Request to Join
                    </Button>
                    <Button size="lg" variant="outline" className="border-primary/30">
                      <Target className="mr-2 h-5 w-5" />
                      View Quests
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Trust Score Highlight */}
          <div>
            <Card className="glass-strong border-2 border-primary/30 p-8 holographic">
              <div className="text-center space-y-4">
                <Shield className="h-16 w-16 text-primary mx-auto animate-pulse-glow" />
                <div>
                  <div className="text-sm text-muted-foreground mb-2">TRUST SCORE</div>
                  <div className="text-6xl font-black text-gradient-primary mb-2">
                    {guild.trustScore}%
                  </div>
                  <div className="flex items-center justify-center gap-2 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+2.3% this month</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-primary/20 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-bold text-success">{guild.successRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-bold text-secondary">{guild.avgResponseTime}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Users />} label="Members" value={guild.members.toString()} color="primary" />
          <StatCard icon={<Target />} label="Active Quests" value={guild.activeQuests.toString()} color="secondary" />
          <StatCard icon={<Award />} label="Completed" value={guild.completedQuests.toString()} color="accent" />
          <StatCard icon={<Zap />} label="Power Level" value={guild.powerLevel.toLocaleString()} color="success" />
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="members" className="space-y-8">
          <TabsList className="glass-strong border border-primary/30 p-1">
            <TabsTrigger value="members" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Users className="mr-2 h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Activity className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <TrendingUp className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guild.members_list.map((member) => (
                <Card key={member.id} className="glass-strong border-2 border-primary/20 hover:border-primary/40 p-6 group transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{member.avatar}</div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    {member.role === 'Guild Master' && (
                      <Crown className="h-5 w-5 text-warning animate-pulse-glow" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Trust Score</div>
                      <div className="text-lg font-bold text-primary">{member.trustScore}%</div>
                    </div>
                    <div className="glass p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Quests</div>
                      <div className="text-lg font-bold text-secondary">{member.quests}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            {guild.recentActivity.map((activity, idx) => (
              <Card key={idx} className="glass-strong border-2 border-primary/20 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ActivityIcon type={activity.type} />
                    <div>
                      <div className="font-medium">
                        {activity.type === 'quest_completed' && `Completed: ${activity.quest}`}
                        {activity.type === 'member_joined' && `${activity.member} joined the guild`}
                        {activity.type === 'quest_accepted' && `Accepted: ${activity.quest}`}
                        {activity.type === 'dispute_won' && `Won dispute: ${activity.quest}`}
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                  {activity.type === 'quest_completed' && (
                    <Badge className="bg-success/10 text-success border-success/30">
                      +{activity.reward?.toLocaleString()} credits
                    </Badge>
                  )}
                  {activity.type === 'quest_accepted' && (
                    <Badge className="bg-warning/10 text-warning border-warning/30">
                      {activity.stake?.toLocaleString()} staked
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-strong border-2 border-primary/30 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trust Score Evolution
                </h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {guild.stats.trustEvolution.map((score, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-linear-to-t from-primary to-secondary rounded-t-lg relative group"
                        style={{ height: `${(score / 100) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                          {score}%
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">W{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-strong border-2 border-primary/30 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Monthly Quest Volume
                </h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {guild.stats.questsPerMonth.map((quests, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-linear-to-t from-secondary to-accent rounded-t-lg relative group"
                        style={{ height: `${(quests / 20) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded text-xs font-bold">
                          {quests}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">M{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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
    <Card className="glass-strong border-2 border-primary/20 p-6 group hover:border-primary/40 transition-all">
      <div className={`p-3 rounded-lg ${classes} inline-flex mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-gradient-primary mb-1">{value}</div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">{label}</div>
    </Card>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const iconClass = "h-10 w-10 p-2 rounded-lg";
  
  switch (type) {
    case 'quest_completed':
      return <div className={`${iconClass} bg-success/10 text-success border border-success/30`}><Award className="h-full w-full" /></div>;
    case 'member_joined':
      return <div className={`${iconClass} bg-primary/10 text-primary border border-primary/30`}><Users className="h-full w-full" /></div>;
    case 'quest_accepted':
      return <div className={`${iconClass} bg-warning/10 text-warning border border-warning/30`}><Target className="h-full w-full" /></div>;
    case 'dispute_won':
      return <div className={`${iconClass} bg-accent/10 text-accent border border-accent/30`}><Shield className="h-full w-full" /></div>;
    default:
      return <div className={`${iconClass} bg-muted/10 text-muted-foreground border border-muted/30`}><Activity className="h-full w-full" /></div>;
  }
}
