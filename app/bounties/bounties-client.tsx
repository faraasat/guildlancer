'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Target,
  Sparkles,
  Zap,
  Search,
  Clock,
  Users,
  AlertCircle,
  Star,
  Plus,
} from 'lucide-react';

interface BountiesClientProps {
  user?: {
    id: string;
    username: string;
  };
}

interface Bounty {
  _id: string;
  title: string;
  description: string;
  category: string;
  reward: number;
  urgency: string;
  deadline: string;
  client: any;
  requiredRank: string;
  status: string;
}

const categories = ['All', 'Missing Persons', 'Lost & Found', 'Verification', 'Forensics', 'Local Tasks', 'Research'];
const urgencyLevels = ['All', 'High', 'Medium', 'Low'];
const rankRequirements = ['All', 'Rookie', 'Veteran', 'Elite', 'Master', 'Legendary'];

export default function BountiesClient({ user }: BountiesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [selectedRank, setSelectedRank] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBounties = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const res = await fetch('/api/bounties?status=open&limit=50');
        if (!res.ok) throw new Error('Failed to fetch bounties');
        const data = await res.json();
        setBounties(data.bounties || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, [user]);
  
  // If user is not authenticated, show public view
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 relative">
        {/* Background Effects */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 rounded-full glass-strong border border-accent/40 text-sm font-bold tracking-wide mb-4 animate-glow-pulse military-corners">
              <span className="text-accent">⬡</span> BOUNTY MARKETPLACE
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-heading">
              <span className="text-gradient-accent">High-Value Missions</span>
            </h1>
            <p className="text-2xl text-muted-foreground">
              Sign in to access the full marketplace
            </p>

            <Card className="glass-strong border-2 border-accent/30 p-16 relative overflow-hidden military-corners">
              <div className="absolute inset-0 bg-linear-to-br from-accent/10 to-transparent" />
              <div className="relative z-10 space-y-6">
                <Target className="h-24 w-24 text-accent mx-auto animate-pulse-glow" />
                <h2 className="text-3xl font-bold">Join GuildLancer to Access Bounties</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Sign in to browse high-value missions, apply for bounties, and earn rewards.
                </p>
                <div className="flex gap-4 justify-center pt-6">
                  <Button size="lg" asChild className="glow-primary">
                    <Link href="/login">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Sign In
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-accent/30">
                    <Link href="/register">
                      <Zap className="mr-2 h-5 w-5" />
                      Create Account
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading bounties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Card className="glass-strong border-2 border-destructive/30 p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-bold text-center mb-2">Error Loading Bounties</h3>
          <p className="text-muted-foreground text-center">{error}</p>
        </Card>
      </div>
    );
  }

  // Filter bounties
  const filteredBounties = bounties.filter((bounty) => {
    const matchesSearch =
      bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || bounty.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'All' || bounty.urgency === selectedUrgency.toLowerCase();
    const matchesRank = selectedRank === 'All' || bounty.requiredRank === selectedRank;
    return matchesSearch && matchesCategory && matchesUrgency && matchesRank;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      {/* Background Effects */}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="inline-block px-3 py-1 rounded-full glass border border-accent/30 text-xs font-bold tracking-wider mb-3">
                <span className="text-accent">⬡</span> MISSION BOARD
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-heading mb-2">
                <span className="text-gradient-accent">Active Bounties</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                <span className="text-primary font-bold">{filteredBounties.length}</span> high-value missions available
              </p>
            </div>
            <Button size="lg" className="glow-primary military-corners">
              <Plus className="mr-2 h-5 w-5" />
              Post Bounty
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="glass-strong border-2 border-primary/30 p-6 mb-8 military-corners tactical-scan">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bounties by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/30"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-primary/30 bg-background/50 px-3 py-2 text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Urgency</label>
                  <select
                    value={selectedUrgency}
                    onChange={(e) => setSelectedUrgency(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-primary/30 bg-background/50 px-3 py-2 text-sm"
                  >
                    {urgencyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rank Required</label>
                  <select
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-primary/30 bg-background/50 px-3 py-2 text-sm"
                  >
                    {rankRequirements.map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-primary/30 bg-background/50 px-3 py-2 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="reward-high">Highest Reward</option>
                    <option value="reward-low">Lowest Reward</option>
                    <option value="deadline">Deadline Soon</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Bounties Grid */}
          {filteredBounties.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBounties.map((bounty) => (
                <BountyCard key={bounty._id} bounty={bounty} />
              ))}
            </div>
          ) : (
            <Card className="glass-strong border-2 border-primary/20 p-12 text-center">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Bounties Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

interface BountyCardProps {
  bounty: Bounty;
}

function BountyCard({ bounty }: BountyCardProps) {
  const getUrgencyColor = () => {
    switch (bounty.urgency) {
      case 'high':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'low':
        return 'bg-success/20 text-success border-success/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getRankColor = () => {
    switch (bounty.requiredRank) {
      case 'Legendary':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'Master':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Elite':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Veteran':
        return 'bg-success/20 text-success border-success/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const daysLeft = Math.ceil(
    (new Date(bounty.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="relative group glass-strong border-2 border-primary/30 hover:border-primary/60 transition-all duration-500 hover:-translate-y-1 p-6 military-corners tactical-scan overflow-hidden">
      {/* Card Shimmer Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getUrgencyColor()}>{bounty.urgency}</Badge>
            <Badge className={getRankColor()}>{bounty.requiredRank}+</Badge>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {bounty.category}
            </Badge>
          </div>
          <h3 className="text-xl font-bold mb-2">{bounty.title}</h3>
        </div>
        <div className="text-right shrink-0 ml-4">
          <div className="text-3xl font-black font-heading text-neon-primary">
            {bounty.reward?.toLocaleString()}
          </div>
          <div className="text-xs text-accent font-bold tracking-wider">CREDITS</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bounty.description}</p>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {daysLeft} days left
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {(bounty as any).applications || 0} applicants
        </span>
        {(bounty as any).clientRating && (
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-warning fill-warning" />
            {(bounty as any).clientRating}
          </span>
        )}
      </div>

      {/* Client Info */}
      <div className="flex items-center justify-between pt-4 border-t border-primary/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full glass border border-primary/30 flex items-center justify-center text-sm">
            {typeof bounty.client === 'string' 
              ? bounty.client[0].toUpperCase() 
              : (bounty.client?.username || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">
              {typeof bounty.client === 'string' ? bounty.client : bounty.client?.username || 'Unknown'}
            </p>
            <p className="text-xs text-muted-foreground">Client</p>
          </div>
        </div>
        <Button className="glow-primary military-corners" asChild>
          <Link href={`/bounties/${bounty._id}`}>
            <Target className="mr-2 h-4 w-4" />
            Apply
          </Link>
        </Button>
      </div>
      </div>
    </Card>
  );
}
