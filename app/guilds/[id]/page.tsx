'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Target, TrendingUp, Shield, Star, Award, Zap, Activity, Calendar, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';

interface Guild {
  _id: string;
  name: string;
  description: string;
  avatar: string;
  banner?: string;
  rank: string;
  trustScore: number;
  successRate: number;
  totalBountiesCompleted: number;
  categories: string[];
  treasuryBalance: number;
  masterId: any;
  memberIds: any[];
  officerIds: any[];
  foundersIds: any[];
  createdAt: string;
}

export default function GuildDetailPage() {
  const params = useParams();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuildData = async () => {
      try {
        setLoading(true);
        const guildId = params.id as string;
        
        const [guildRes, membersRes] = await Promise.all([
          fetch(`/api/guilds/${guildId}`),
          fetch(`/api/guilds/${guildId}/members`)
        ]);

        if (!guildRes.ok) {
          throw new Error('Guild not found');
        }

        const guildData = await guildRes.json();
        const membersData = membersRes.ok ? await membersRes.json() : [];

        setGuild(guildData);
        setMembers(membersData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGuildData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <h3 className="text-2xl font-bold mb-2">Loading Guild...</h3>
        </div>
      </div>
    );
  }

  if (error || !guild) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Card className="glass-strong border-destructive/30 p-8 max-w-md">
          <div className="text-5xl mb-4 text-center">⚠️</div>
          <h3 className="text-2xl font-bold mb-2 text-destructive text-center">Guild Not Found</h3>
          <p className="text-muted-foreground text-center mb-4">{error || 'This guild does not exist'}</p>
          <Link href="/guilds">
            <Button className="w-full">Back to Guilds</Button>
          </Link>
        </Card>
      </div>
    );
  }

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
                    <span className="font-bold text-success">{guild.successRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-bold text-secondary">{guild.totalBountiesCompleted}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Users />} label="Members" value={(1 + guild.officerIds.length + guild.memberIds.length).toString()} color="primary" />
          <StatCard icon={<Target />} label="Categories" value={guild.categories.length.toString()} color="secondary" />
          <StatCard icon={<Award />} label="Completed" value={guild.totalBountiesCompleted.toString()} color="accent" />
          <StatCard icon={<Zap />} label="Treasury" value={`${guild.treasuryBalance?.toLocaleString()} C`} color="success" />
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="members" className="space-y-8">
          <TabsList className="glass-strong border border-primary/30 p-7">
            <TabsTrigger value="members" className="data-[state=active]:bg-white/20 w-auto h-full p-5 my-2 mr-2 data-[state=active]:text-primary">
              <Users className="mr-2 h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white/20 w-auto h-full p-5 my-2 mr-2 data-[state=active]:text-primary">
              <Activity className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-white/20 w-auto h-full p-5 my-2 mr-2 data-[state=active]:text-primary">
              <TrendingUp className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member: any) => (
                <Card key={member._id} className="glass-strong border-2 border-primary/20 hover:border-primary/40 p-6 group transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{member.avatar}</div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {member.username}
                        </h3>
                        <p className="text-sm text-muted-foreground">{member.guildRole || 'Member'}</p>
                      </div>
                    </div>
                    {member.guildRole === 'Guild Master' && (
                      <Crown className="h-5 w-5 text-warning animate-pulse-glow" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Trust Score</div>
                      <div className="text-lg font-bold text-primary">{member.trustScore.toFixed(1)}%</div>
                    </div>
                    <div className="glass p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Quests</div>
                      <div className="text-lg font-bold text-secondary">{member.completedQuests}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <p className="text-muted-foreground text-center py-8">Activity feed coming soon...</p>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="stats">
            <p className="text-muted-foreground text-center py-8">Performance analytics coming soon...</p>
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
