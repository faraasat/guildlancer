'use client';

import Link from 'next/link';
import { Search, Filter, TrendingUp, Users, Shield, Star, Sparkles, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Mock data for guilds
const mockGuilds = [
  {
    id: 1,
    name: 'Cyber Syndicate',
    tagline: 'Elite coders & security experts',
    avatar: '🛡️',
    members: 47,
    activeQuests: 12,
    trustScore: 98.5,
    powerLevel: 2847,
    rank: 'Platinum',
    specialization: 'Security & Infrastructure',
    color: 'primary'
  },
  {
    id: 2,
    name: 'Neon Knights',
    tagline: 'Full-stack warriors',
    avatar: '⚔️',
    members: 52,
    activeQuests: 18,
    trustScore: 96.2,
    powerLevel: 2654,
    rank: 'Platinum',
    specialization: 'Web Development',
    color: 'secondary'
  },
  {
    id: 3,
    name: 'Data Dragons',
    tagline: 'AI/ML specialists',
    avatar: '🐉',
    members: 38,
    activeQuests: 9,
    trustScore: 97.8,
    powerLevel: 2512,
    rank: 'Gold',
    specialization: 'AI & Machine Learning',
    color: 'accent'
  },
  {
    id: 4,
    name: 'Quantum Collective',
    tagline: 'Blockchain & DeFi experts',
    avatar: '⚡',
    members: 41,
    activeQuests: 14,
    trustScore: 95.4,
    powerLevel: 2389,
    rank: 'Gold',
    specialization: 'Blockchain Development',
    color: 'success'
  },
  {
    id: 5,
    name: 'Shadow Protocol',
    tagline: 'Stealth operations team',
    avatar: '👤',
    members: 29,
    activeQuests: 7,
    trustScore: 94.1,
    powerLevel: 2156,
    rank: 'Gold',
    specialization: 'Penetration Testing',
    color: 'primary'
  },
  {
    id: 6,
    name: 'Phoenix Rising',
    tagline: 'Mobile app specialists',
    avatar: '🔥',
    members: 44,
    activeQuests: 11,
    trustScore: 93.7,
    powerLevel: 2098,
    rank: 'Silver',
    specialization: 'Mobile Development',
    color: 'warning'
  }
];

export default function GuildsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRank, setSelectedRank] = useState('all');

  const filteredGuilds = mockGuilds.filter(guild => {
    const matchesSearch = guild.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guild.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRank = selectedRank === 'all' || guild.rank === selectedRank;
    return matchesSearch && matchesRank;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center space-y-6">
          <div className="inline-block px-4 py-2 rounded-full glass border border-primary/30 text-sm font-medium mb-4 military-corners">
            <span className="text-primary">◆</span> Guild Directory
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading">
            <span className="text-gradient-primary">Elite Guilds</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join forces with the best hunters. Higher trust scores unlock premium bounties.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-12 max-w-4xl mx-auto">
          <Card className="glass-strong p-6 border-2 border-primary/30 tactical-scan">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  placeholder="Search guilds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/30 focus:border-primary"
                />
              </div>

              {/* Rank Filter */}
              <div className="flex gap-2">
                {['all', 'Platinum', 'Gold', 'Silver'].map((rank) => (
                  <Button
                    key={rank}
                    variant={selectedRank === rank ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRank(rank)}
                    className={selectedRank === rank ? 'glow-primary' : 'border-primary/30'}
                  >
                    {rank === 'all' ? 'All' : rank}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuilds.map((guild) => (
            <GuildCard key={guild.id} guild={guild} />
          ))}
        </div>

        {/* Empty State */}
        {filteredGuilds.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No guilds found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16">
          <Card className="relative overflow-hidden border-gradient-primary p-12 holographic">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            
            <div className="relative z-10 text-center space-y-6">
              <Sparkles className="h-16 w-16 text-primary mx-auto animate-pulse-glow" />
              <h2 className="text-4xl md:text-5xl font-bold font-heading">
                Ready to <span className="text-gradient-primary">Form Your Guild?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Gather your team, build reputation, and unlock exclusive high-value bounties.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild className="glow-primary text-lg h-14 px-8">
                  <Link href="/register">
                    Create Guild
                    <Zap className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-2 border-primary/30 text-lg h-14 px-8">
                  <Link href="/about">
                    Learn More
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
      case 'Platinum': return 'from-primary/30 to-primary/10';
      case 'Gold': return 'from-warning/30 to-warning/10';
      case 'Silver': return 'from-muted/30 to-muted/10';
      default: return 'from-primary/20 to-transparent';
    }
  };

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'Platinum': return 'text-primary border-primary/40 bg-primary/10';
      case 'Gold': return 'text-warning border-warning/40 bg-warning/10';
      case 'Silver': return 'text-muted-foreground border-muted/40 bg-muted/10';
      default: return 'text-primary border-primary/40';
    }
  };

  return (
    <Link href={`/guilds/${guild.id}`}>
      <Card className={`relative group overflow-hidden glass-strong border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 tactical-scan military-corners`}>
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getRankColor(guild.rank)} opacity-50 group-hover:opacity-70 transition-opacity`} />
        
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
                <p className="text-sm text-muted-foreground">{guild.tagline}</p>
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
                  {guild.trustScore}%
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
              <div className="text-xl font-bold text-secondary">{guild.members}</div>
            </div>
            <div className="glass p-3 rounded-lg border border-accent/20">
              <div className="text-xs text-muted-foreground mb-1">Active Quests</div>
              <div className="text-xl font-bold text-accent">{guild.activeQuests}</div>
            </div>
          </div>

          {/* Specialization */}
          <div className="pt-3 border-t border-primary/20">
            <div className="text-xs text-muted-foreground mb-2">SPECIALIZATION</div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">{guild.specialization}</span>
            </div>
          </div>

          {/* Power Level */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">POWER LEVEL</span>
            <span className="text-lg font-black text-neon-primary">{guild.powerLevel.toLocaleString()}</span>
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
