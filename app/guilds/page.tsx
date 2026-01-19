'use client';

import Link from 'next/link';
import { Search, Filter, TrendingUp, Users, Shield, Star, Sparkles, Zap, Award, Swords, Crown, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface Guild {
  _id: string;
  name: string;
  description: string;
  avatar: string;
  memberIds: string[];
  rank: string;
  trustScore: number;
  successRate: number;
  totalBountiesCompleted: number;
  categories: string[];
  activeBountyCount?: number;
}

export default function GuildsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRank, setSelectedRank] = useState('all');
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          sort: 'trust',
          limit: '50'
        });
        
        if (selectedRank !== 'all') {
          params.append('rank', selectedRank);
        }

        const res = await fetch(`/api/guilds?${params}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch guilds');
        }

        const data = await res.json();
        setGuilds(data.guilds || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuilds();
  }, [selectedRank]);

  const filteredGuilds = guilds.filter(guild =>
    guild.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guild.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guild.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Floating Particles Background */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header - Anime Style */}
        <div className="mb-16 text-center space-y-8 animate-slide-in-up">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-strong border-2 border-accent/40 text-sm font-black tracking-wider mb-4 hud-border text-foreground">
            <Crown className="h-5 w-5 text-accent animate-pulse-glow" />
            <span className="text-accent">GUILD REGISTRY</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="h-0.5 w-32 bg-linear-to-r from-transparent via-accent to-accent" />
            <Swords className="text-accent h-8 w-8" />
            <div className="h-0.5 w-32 bg-linear-to-r from-accent via-accent to-transparent" />
          </div>
          <p className="text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed font-light">
            Join forces with <span className="text-gradient-primary font-bold">legendary warriors</span>. Higher trust unlocks <span className="text-gradient-success font-bold">epic missions</span>.
          </p>
        </div>

        {/* Search & Filters - Anime Enhanced */}
        <div className="mb-16 max-w-5xl mx-auto">
          <Card className="nft-card glass-strong p-8 border-2 border-accent/40 hud-border overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search - Anime Style */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-accent animate-pulse-glow" />
                <Input
                  placeholder="Search for your destiny..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-14 bg-background/50 border-2 border-accent/40 focus:border-accent text-lg font-bold transition-cyber hologram-card"
                />
              </div>

              {/* Rank Filter - Enhanced */}
              <div className="flex gap-3">
                {['all', 'Legendary', 'Master', 'Developing'].map((rank, index) => (
                  <Button
                    key={rank}
                    variant={selectedRank === rank ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setSelectedRank(rank)}
                    className={selectedRank === rank ? 'btn-anime border-2 border-accent/50 font-black tracking-wider' : 'hologram-card border-2 border-accent/30 hover:border-accent font-bold tracking-wider transition-cyber'}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {rank === 'all' ? 'ALL' : rank.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Leaderboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Users />} label="Total Guilds" value="127" color="primary" />
          <StatCard icon={<Shield />} label="Active Quests" value="342" color="secondary" />
          <StatCard icon={<Star />} label="Avg Trust Score" value="94.2%" color="accent" />
          <StatCard icon={<Award />} label="Total Members" value="1,834" color="success" />
        </div>

        {/* Guilds Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h3 className="text-2xl font-bold mb-2">Loading Guilds...</h3>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <Card className="glass-strong border-destructive/30 p-8 max-w-md mx-auto">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2 text-destructive">Error Loading Data</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </Card>
          </div>
        ) : filteredGuilds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-slide-in-up">
            {filteredGuilds.map((guild) => (
              <GuildCard key={guild._id} guild={guild} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No guilds found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Empty State */}
        {filteredGuilds.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No guilds found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* CTA Section - Epic Anime Style */}
        <div className="mt-20">
          <Card className="relative overflow-hidden nft-card border-2 border-accent/40 p-16 md:p-20 hud-border">
            <div className="relative z-10 text-center space-y-10">
              <div className="relative inline-block">
                <Flame className="h-24 w-24 text-accent mx-auto animate-pulse-glow" />
                <div className="absolute -inset-6 bg-accent/30 rounded-full blur-2xl animate-pulse-glow" />
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black font-heading leading-tight">
                <span className="text-neon-accent animate-neon-flicker">READY TO</span>
                <br />
                <span className="text-gradient-accent">FORGE YOUR GUILD?</span>
              </h2>
              
              <p className="text-2xl md:text-3xl text-foreground/90 max-w-3xl mx-auto leading-relaxed font-light">
                Assemble your <span className="text-gradient-accent font-bold">legendary team</span>, build <span className="text-gradient-success font-bold">unstoppable reputation</span>, and conquer <span className="text-gradient-primary font-bold">mythic bounties</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Button size="lg" asChild className="btn-anime border-2 border-accent/50 text-xl h-20 px-14">
                  <Link href="/guild">
                    <span className="font-black tracking-wider text-accent">CREATE GUILD</span>
                    <Zap className="ml-3 h-7 w-7 text-accent" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="hologram-card border-2 border-primary/50 hover:border-primary text-xl h-20 px-14 transition-cyber">
                  <Link href="/about">
                    <Crown className="mr-3 h-6 w-6" />
                    <span className="font-bold tracking-wider">LEARN MORE</span>
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface Guild {
  id: number;
  name: string;
  tagline: string;
  avatar: string;
  members: number;
  activeQuests: number;
  trustScore: number;
  powerLevel: number;
  rank: string;
  specialization: string;
  color: string;
}

function GuildCard({ guild }: { guild: Guild }) {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Legendary': return 'from-warning/30 to-warning/10';
      case 'Master': return 'from-primary/30 to-primary/10';
      case 'Developing': return 'from-muted/30 to-muted/10';
      default: return 'from-primary/20 to-transparent';
    }
  };

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'Legendary': return 'text-warning border-warning/40 bg-warning/10';
      case 'Master': return 'text-primary border-primary/40 bg-primary/10';
      case 'Developing': return 'text-muted-foreground border-muted/40 bg-muted/10';
      default: return 'text-primary border-primary/40';
    }
  };

  return (
    <Link href={`/guilds/${guild._id}`}>
      <Card className={`relative group overflow-hidden glass-strong border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 tactical-scan military-corners`}>
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-linear-to-br ${getRankColor(guild.rank)} opacity-50 group-hover:opacity-70 transition-opacity`} />
        
        {/* Content */}
        <div className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-float">{guild.avatar}</div>
              <div>
                <h3 className="text-2xl font-bold font-heading group-hover:text-primary transition-colors">
                  {guild.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {guild.description || 'Elite Guild'}
                </p>
              </div>
            </div>
            <Badge className={`${getRankBadgeColor(guild.rank)} font-bold`}>
              {guild.rank}
            </Badge>
          </div>

          {/* Trust Score - Prominent */}
          <div className="relative glass p-4 rounded-xl border border-primary/30 group-hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Trust Score</div>
                <div className="text-3xl font-black text-gradient-primary">
                  {guild.trustScore.toFixed(1)}%
                </div>
              </div>
              <div className="relative">
                <Shield className="h-12 w-12 text-primary animate-pulse-glow" />
                <div className="absolute inset-0 blur-xl bg-primary/50 animate-glow-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass p-3 rounded-lg border border-secondary/20">
              <div className="text-xs text-muted-foreground mb-1">Members</div>
              <div className="text-xl font-bold text-secondary">
                {guild.memberIds?.length || 0}
              </div>
            </div>
            <div className="glass p-3 rounded-lg border border-accent/20">
              <div className="text-xs text-muted-foreground mb-1">Completed</div>
              <div className="text-xl font-bold text-accent">
                {guild.totalBountiesCompleted || 0}
              </div>
            </div>
          </div>

          {/* Categories */}
          {guild.categories && guild.categories.length > 0 && (
            <div className="pt-3 border-t border-primary/20">
              <div className="text-xs text-muted-foreground mb-2">CATEGORIES</div>
              <div className="flex flex-wrap gap-2">
                {guild.categories.slice(0, 2).map((cat: string) => (
                  <Badge key={cat} variant="outline" className="text-xs border-primary/30">
                    {cat}
                  </Badge>
                ))}
                {guild.categories.length > 2 && (
                  <Badge variant="outline" className="text-xs border-primary/30">
                    +{guild.categories.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Success Rate */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">SUCCESS RATE</span>
            <span className="text-lg font-black text-neon-primary">
              {guild.successRate?.toFixed(1) || '0'}%
            </span>
          </div>

          {/* Hover Effect Arrow */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <TrendingUp className="h-6 w-6 text-primary animate-float" />
          </div>
        </div>
      </Card>
    </Link>
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
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${classes} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="text-4xl font-black text-gradient-primary mb-1">{value}</div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">{label}</div>
    </Card>
  );
}
