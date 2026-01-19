'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';

import {
  Users,
  Shield,
  MessageSquare,
  Target,
  Wallet,
  Settings,
  Search,
  Send,
  Crown,
  Star,
  TrendingUp,
  Award,
  Plus,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react';

interface GuildClientProps {
  user: {
    id: string;
    username: string;
  };
}

export default function GuildClient({ user }: GuildClientProps) {
  const [guild, setGuild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreating, setIsCreating] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildDesc, setNewGuildDesc] = useState('');

  // Fetch guild data
  useEffect(() => {
    const fetchGuild = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/guilds/my-guild');
        const data = await res.json();
        
        if (data && !data.error) {
          setGuild(data);
          // Fetch guild activity if joined
          const activityRes = await fetch(`/api/activities?relatedGuildId=${data._id}`);
          const activityData = await activityRes.json();
          setActivities(activityData.activities || []);
        }
      } catch (err) {
        console.error('Failed to fetch guild:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuild();
  }, []);

  const handleCreateGuild = async () => {
    try {
      setIsCreating(true);
      const res = await fetch('/api/guilds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGuildName,
          description: newGuildDesc,
          categories: ['General'],
          avatar: '🛡️'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setGuild(data);
      } else {
        alert(data.error || 'Failed to create guild');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not in a guild, show join/create interface
  if (!guild) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full glass-strong border-2 border-primary/30 mb-8 animate-pulse">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-heading mb-6 tracking-tighter">
                <span className="text-gradient-primary">UNALIGNED OPERATIVE</span>
              </h1>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-light">
                Secure your legacy. Join a syndicate to dominate high-stakes bounties or establish your own faction.
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card className="glass-strong border-2 border-primary/30 p-10 text-center hover:border-primary/60 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-6 group-hover:scale-110 transition-transform">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 font-heading italic tracking-tight">BROWSE REGISTRY</h3>
                  <p className="text-muted-foreground mb-8">
                    Scan active channels for established syndicates matching your specialized profile.
                  </p>
                  <Button asChild className="w-full glow-primary" size="lg">
                    <Link href="/guilds">
                      ENTER REGISTRY <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="glass-strong border-2 border-primary/30 p-10 text-center hover:border-primary/60 transition-all group relative overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-6 group-hover:scale-110 transition-transform">
                        <Plus className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-3xl font-black mb-4 font-heading italic tracking-tight">FOUND GUILD</h3>
                      <p className="text-muted-foreground mb-8">
                        Initialize a new faction. Recruit elite talent and control your own territory.
                      </p>
                      <Button className="w-full" size="lg" variant="outline">
                        INITIALIZE SEQUENCE
                      </Button>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="glass-strong border-2 border-primary/30">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-heading italic">INITIALIZE NEW SYNDICATE</DialogTitle>
                    <DialogDescription> Define your faction's identity. This process is irreversible.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-primary">Syndicate Name</label>
                      <Input 
                        placeholder="e.g. Shadow Vanguard" 
                        value={newGuildName}
                        onChange={(e) => setNewGuildName(e.target.value)}
                        className="bg-background/50 border-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-primary">Mission Statement</label>
                      <Input 
                        placeholder="Brief description of your goals..." 
                        value={newGuildDesc}
                        onChange={(e) => setNewGuildDesc(e.target.value)}
                        className="bg-background/50 border-primary/30"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleCreateGuild} 
                      disabled={!newGuildName || isCreating}
                      className="w-full glow-primary"
                    >
                      {isCreating ? 'INITIALIZING...' : 'ESTABLISH SYNDICATE'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BenefitItem 
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="SYNERGY"
                desc="Bonus credits on multi-operative missions."
              />
              <BenefitItem 
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="DEFENSE"
                desc="Collective backing during arbitration phases."
              />
              <BenefitItem 
                icon={<TrendingUp className="h-10 w-10 text-primary" />}
                title="ASCENSION"
                desc="Access to Legendary-tier bounty channels."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is in a guild, show guild management interface
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Guild Header */}
          <Card className="glass-strong border-2 border-primary/30 p-8 mb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield className="h-40 w-40 text-primary" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-28 h-28 rounded-2xl glass border-2 border-primary/30 flex items-center justify-center text-5xl shrink-0 shadow-2xl glow-primary/20">
                {guild.avatar || '🛡️'}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center gap-4 mb-3 justify-center md:justify-start">
                  <h1 className="text-4xl font-black font-heading italic tracking-tighter">
                    <span className="text-gradient-primary uppercase">{guild.name}</span>
                  </h1>
                  <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1 font-black italic">
                    {guild.rank || 'DEVELOPING'}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg mb-6 max-w-2xl font-light">
                  {guild.description || 'No specialized profile data available.'}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Badge className="bg-background/80 border-primary/20 text-foreground px-4 py-1.5 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    {guild.memberIds?.length || 0} OPERATIVES
                  </Badge>
                  <Badge className="bg-background/80 border-success/20 text-success px-4 py-1.5 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-success" />
                    TRUST: {guild.trustScore}%
                  </Badge>
                  <Badge className="bg-background/80 border-warning/20 text-warning px-4 py-1.5 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    SUCCESS: {guild.successRate}%
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <Button variant="outline" className="border-primary/30 h-12 px-6 font-black uppercase tracking-wider">
                  <Settings className="mr-2 h-4 w-4" />
                  CONFIG
                </Button>
                <Button className="glow-primary h-12 px-6 font-black uppercase tracking-wider">
                  INVITE
                </Button>
              </div>
            </div>
          </Card>

          {/* Performance Summary (Dynamic Performance Stats) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <PerformanceStat 
              label="TOTAL EARNINGS"
              value={`${(guild.performance?.totalEarnings || 0).toLocaleString()} ¢`}
              sub="COMMUNAL POOL"
            />
            <PerformanceStat 
              label="COMPLETED"
              value={guild.performance?.completedCount || 0}
              sub="ACTIVE MISSIONS"
            />
            <PerformanceStat 
              label="AVG TRUST"
              value={`${guild.trustScore}%`}
              sub="AGGREGATE"
            />
            <PerformanceStat 
              label="GLOBAL RANK"
              value="#12"
              sub="REGISTRY LISTING"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="glass-strong border-2 border-primary/30 p-1 bg-background/50">
              <TabsTrigger value="overview" className="px-8 py-3 font-black uppercase tracking-tighter">OVERVIEW</TabsTrigger>
              <TabsTrigger value="activity" className="px-8 py-3 font-black uppercase tracking-tighter">ACTIVITY</TabsTrigger>
              <TabsTrigger value="members" className="px-8 py-3 font-black uppercase tracking-tighter">ROSTER</TabsTrigger>
              <TabsTrigger value="treasury" className="px-8 py-3 font-black uppercase tracking-tighter">TREASURY</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="glass-strong border-2 border-primary/30 p-8">
                    <h3 className="text-xl font-black font-heading italic mb-6 text-primary tracking-widest">SYNDICATE ANNOUNCEMENTS</h3>
                    <div className="space-y-6">
                      <div className="p-5 border-l-4 border-primary bg-primary/5 rounded-r-xl">
                        <h4 className="font-bold mb-2 uppercase text-foreground">Welcome to Headquarters</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">System initialized. Secure your communication channels and begin mission acquisition.</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="glass-strong border-2 border-primary/30 p-8">
                    <h3 className="text-xl font-black font-heading italic mb-6 text-primary tracking-widest">PRIMARY OBJECTIVES</h3>
                     <div className="flex flex-col items-center justify-center py-10 opacity-30">
                        <Target className="h-16 w-16 mb-4" />
                        <p className="font-bold tracking-widest">NO ACTIVE DIRECTIVES</p>
                     </div>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="activity">
                <Card className="glass-strong border-2 border-primary/30 p-8">
                  <h3 className="text-xl font-black font-heading italic mb-6 text-primary tracking-widest uppercase">SYNCHRONIZED TIMELINE</h3>
                  <div className="space-y-6">
                    {activities.length > 0 ? (
                      activities.map((act, i) => (
                        <div key={i} className="flex gap-4 p-4 hover:bg-primary/5 transition-colors rounded-xl border border-transparent hover:border-primary/20">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-foreground">{act.title}</h4>
                              <span className="text-[10px] text-muted-foreground uppercase">{new Date(act.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{act.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 opacity-40 italic">No faction records localized.</div>
                    )}
                  </div>
                </Card>
            </TabsContent>

            <TabsContent value="members">
               <Card className="glass-strong border-2 border-primary/30 p-8">
                  <h3 className="text-xl font-black font-heading italic mb-8 text-primary tracking-widest uppercase">OPERATIVE ROSTER</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/20 text-left">
                          <th className="pb-4 font-black uppercase text-xs tracking-widest opacity-60">OPERATIVE</th>
                          <th className="pb-4 font-black uppercase text-xs tracking-widest opacity-60">ROLE</th>
                          <th className="pb-4 font-black uppercase text-xs tracking-widest opacity-60 text-right">TRUST</th>
                          <th className="pb-4 font-black uppercase text-xs tracking-widest opacity-60 text-right">CREDITS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/10">
                        {guild.members?.map((m: any, i: number) => (
                          <tr key={i} className="group hover:bg-primary/5 transition-colors">
                            <td className="py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg glass border border-primary/20 flex items-center justify-center text-xl">
                                  {m.avatar || '👤'}
                                </div>
                                <span className="font-bold group-hover:text-primary transition-colors">{m.username}</span>
                                {m._id === guild.masterId && <Crown className="h-4 w-4 text-warning" />}
                              </div>
                            </td>
                            <td className="py-5">
                              <Badge variant="outline" className="border-primary/30 uppercase text-[10px] font-black tracking-tighter">
                                {m._id === guild.masterId ? 'GUILD MASTER' : 'OPERATIVE'}
                              </Badge>
                            </td>
                            <td className="py-5 text-right font-black text-primary">{m.trustScore || 100}</td>
                            <td className="py-5 text-right font-black">{(m.totalEarnings || 0).toLocaleString()} ¢</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </Card>
            </TabsContent>

            <TabsContent value="treasury">
              <Card className="glass-strong border-2 border-primary/30 p-12 text-center">
                <Wallet className="h-20 w-20 text-primary/40 mx-auto mb-6 animate-bounce-slow" />
                <h3 className="text-3xl font-black font-heading italic mb-2 tracking-tighter uppercase">FACTION RESERVES</h3>
                <p className="text-6xl font-black font-heading mb-4 text-primary glow-primary-text">
                  {(guild.performance?.totalEarnings || 0).toLocaleString()} <span className="text-2xl text-foreground">¢</span>
                </p>
                <div className="flex justify-center gap-4 mt-8">
                   <Button variant="outline" className="border-primary/30 px-8">DEPOSIT</Button>
                   <Button className="glow-primary px-8">ALLOCATE FUNDS</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function PerformanceStat({ label, value, sub }: { label: string; value: any; sub: string }) {
  return (
    <Card className="glass-strong border-2 border-primary/20 p-6 hover:border-primary/50 transition-all group">
      <h4 className="text-[10px] font-black text-primary tracking-[0.2em] mb-2">{label}</h4>
      <p className="text-3xl font-black font-heading mb-1 tracking-tighter group-hover:scale-105 transition-transform">{value}</p>
      <p className="text-[10px] font-bold text-muted-foreground uppercase">{sub}</p>
    </Card>
  );
}

function BenefitItem({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="text-center group">
       <div className="mb-4 inline-flex group-hover:scale-110 transition-transform">{icon}</div>
       <h4 className="text-lg font-black font-heading italic tracking-wider mb-2">{title}</h4>
       <p className="text-sm text-muted-foreground font-light">{desc}</p>
    </div>
  );
}
              <TabsTrigger value="treasury">Treasury</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={<Target className="h-6 w-6" />}
                  label="Missions Completed"
                  value="47"
                  trend="+12 this month"
                />
                <StatCard
                  icon={<Wallet className="h-6 w-6" />}
                  label="Guild Treasury"
                  value="125,000"
                  trend="Available"
                />
                <StatCard
                  icon={<TrendingUp className="h-6 w-6" />}
                  label="Success Rate"
                  value="94%"
                  trend="Above average"
                />
              </div>

              <Card className="glass-strong border-2 border-primary/30 p-6">
                <h3 className="text-xl font-bold mb-4">Recent Announcements</h3>
                <div className="space-y-4">
                  <AnnouncementItem
                    title="New High-Value Mission Available"
                    message="Guild Master has posted a new $10,000 bounty. Check the Missions tab."
                    author="guildmaster"
                    timestamp="2 hours ago"
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Comm-Link Tab */}
            <TabsContent value="comms" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Chat Area */}
                <Card className="glass-strong border-2 border-primary/30 lg:col-span-3 flex flex-col h-150">
                  <div className="p-4 border-b border-primary/20">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="font-bold">#general</h3>
                      <Badge className="ml-auto bg-success/20 text-success border-success/30">
                        {mockMembers.filter(m => m.status === 'online').length} online
                      </Badge>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <div className="text-2xl shrink-0">{msg.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm">{msg.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-primary/20">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="bg-background/50 border-primary/30"
                      />
                      <Button>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Online Members Sidebar */}
                <Card className="glass-strong border-2 border-primary/30 p-4">
                  <h3 className="font-bold mb-4">Online Members</h3>
                  <div className="space-y-3">
                    {mockMembers
                      .filter(m => m.status === 'online')
                      .map((member) => (
                        <div key={member.id} className="flex items-center gap-2">
                          <div className="relative">
                            <div className="text-xl">{member.avatar}</div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{member.username}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <Card className="glass-strong border-2 border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Guild Roster</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 bg-background/50 border-primary/30"
                    />
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Invite
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="px-4 py-3 text-left text-sm font-bold">Member</th>
                        <th className="px-4 py-3 text-left text-sm font-bold">Rank</th>
                        <th className="px-4 py-3 text-left text-sm font-bold">Role</th>
                        <th className="px-4 py-3 text-right text-sm font-bold">Trust Score</th>
                        <th className="px-4 py-3 text-right text-sm font-bold">Contribution</th>
                        <th className="px-4 py-3 text-center text-sm font-bold">Status</th>
                        <th className="px-4 py-3 text-center text-sm font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockMembers.map((member) => (
                        <tr key={member.id} className="border-b border-primary/10 hover:bg-primary/5">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{member.avatar}</div>
                              <span className="font-medium">{member.username}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge>{member.rank}</Badge>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm">{member.role}</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-bold text-primary">{member.trustScore}</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-sm">{member.contribution?.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge className={
                              member.status === 'online'
                                ? 'bg-success/20 text-success border-success/30'
                                : 'bg-muted/20 text-muted-foreground border-muted/30'
                            }>
                              {member.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Missions Tab */}
            <TabsContent value="missions">
              <Card className="glass-strong border-2 border-primary/30 p-12 text-center">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-bold mb-2">No Active Guild Missions</h3>
                <p className="text-muted-foreground mb-6">
                  Guild Master can assign missions from the bounties marketplace
                </p>
                <Button>Browse Bounties</Button>
              </Card>
            </TabsContent>

            {/* Treasury Tab */}
            <TabsContent value="treasury">
              <Card className="glass-strong border-2 border-primary/30 p-12 text-center">
                <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-bold mb-2">Guild Treasury</h3>
                <p className="text-4xl font-black font-heading mb-2">125,000</p>
                <p className="text-muted-foreground">Available Credits</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}

function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <Card className="glass-strong border-2 border-primary/30 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-primary">
          {icon}
        </div>
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{label}</h3>
      <p className="text-3xl font-black font-heading mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </Card>
  );
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 text-primary mb-4">
        {icon}
      </div>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

interface AnnouncementItemProps {
  title: string;
  message: string;
  author: string;
  timestamp: string;
}

function AnnouncementItem({ title, message, author, timestamp }: AnnouncementItemProps) {
  return (
    <div className="glass p-4 rounded-lg">
      <div className="flex items-start gap-3">
        <Crown className="h-5 w-5 text-warning shrink-0 mt-1" />
        <div className="flex-1">
          <h4 className="font-bold mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{message}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>By {author}</span>
            <span>•</span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
