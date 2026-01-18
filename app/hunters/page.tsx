'use client';

import Link from 'next/link';
import { Search, TrendingUp, Award, Target, Shield, Star, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface Hunter {
  _id: string;
  username: string;
  avatar: string;
  bio?: string;
  guildId?: {
    _id: string;
    name: string;
    avatar: string;
  };
  trustScore: number;
  rank: string;
  completedQuests: number;
  skills: string[];
  hunterReputation: number;
}

interface Skill {
  skill: string;
  count: number;
}

const skillColors = ['primary', 'secondary', 'accent', 'success', 'warning'];

export default function HuntersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hunters, setHunters] = useState<Hunter[]>([]);
  const [topSkills, setTopSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [huntersRes, skillsRes] = await Promise.all([
          fetch('/api/users?sort=trust&limit=50'),
          fetch('/api/users/skills?limit=10')
        ]);

        if (!huntersRes.ok || !skillsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const huntersData = await huntersRes.json();
        const skillsData = await skillsRes.json();

        setHunters(huntersData.users || []);
        setTopSkills(skillsData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredHunters = hunters.filter(hunter =>
    hunter.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hunter.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (hunter.bio && hunter.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center space-y-6">
          <div className="inline-block px-4 py-2 rounded-full glass border border-secondary/30 text-sm font-medium mb-4 military-corners">
            <span className="text-secondary">★</span> Top Hunters
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading">
            <span className="text-gradient-primary">Elite Hunters</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The most trusted and skilled professionals in the network. Reputation earned through action.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h3 className="text-2xl font-bold mb-2">Loading hunters...</h3>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
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
        )}

        {!loading && !error && (
          <>
            {/* Search */}
            <div className="mb-12 max-w-2xl mx-auto">
              <Card className="glass-strong p-4 border-2 border-secondary/30 tactical-scan">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
                  <Input
                    placeholder="Search hunters by name or skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-secondary/30 focus:border-secondary"
                  />
                </div>
              </Card>
            </div>

            {/* Skills Cloud */}
            {topSkills.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  <Sparkles className="inline h-6 w-6 text-primary mr-2" />
                  Top Skills in Network
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {topSkills.map((item, index) => (
                    <Badge 
                      key={item.skill}
                      className={`text-${skillColors[index % skillColors.length]} border-${skillColors[index % skillColors.length]}/40 bg-${skillColors[index % skillColors.length]}/10 px-6 py-3 text-lg font-bold hover:scale-110 transition-transform cursor-pointer`}
                    >
                      {item.skill} <span className="ml-2 text-muted-foreground">({item.count})</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Top 3 Podium */}
            {filteredHunters.length >= 3 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  <Crown className="inline h-8 w-8 text-warning animate-pulse-glow mr-2" />
                  Top Ranked Hunters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {filteredHunters.slice(0, 3).map((hunter, idx) => (
                    <PodiumCard key={hunter._id} hunter={hunter} position={idx + 1} />
                  ))}
                </div>
              </div>
            )}

            {/* All Hunters Grid */}
            {filteredHunters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHunters.map((hunter) => (
                  <HunterCard key={hunter._id} hunter={hunter} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No hunters found</h3>
                <p className="text-muted-foreground">Try adjusting your search</p>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="mt-16">
          <Card className="relative overflow-hidden border-gradient-primary p-12 holographic">
            <div className="absolute inset-0 bg-linear-to-br from-secondary/10 via-transparent to-accent/10" />
            
            <div className="relative z-10 text-center space-y-6">
              <Star className="h-16 w-16 text-secondary mx-auto animate-pulse-glow" />
              <h2 className="text-4xl md:text-5xl font-bold font-heading">
                Become an <span className="text-gradient-primary">Elite Hunter</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Build your reputation, earn trust, and unlock high-value opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild className="glow-primary text-lg h-14 px-8">
                  <Link href="/register">
                    Start Your Journey
                    <Zap className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-2 border-secondary/30 text-lg h-14 px-8">
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

function PodiumCard({ hunter, position }: { hunter: Hunter; position: number }) {
  const heights = ['md:translate-y-8', '', 'md:translate-y-12'];
  const medals = ['🥇', '🥈', '🥉'];
  const glows = ['glow-primary', 'glow-secondary', 'glow-accent'];

  return (
    <Card className={`relative glass-strong border-2 border-primary/30 p-6 ${heights[position - 1]} ${position === 1 ? glows[0] : ''} military-corners tactical-scan`}>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl animate-float">
        {medals[position - 1]}
      </div>
      
      <div className="text-center space-y-4 pt-8">
        <div className="text-5xl mx-auto">{hunter.avatar}</div>
        <div>
          <h3 className="text-2xl font-bold text-gradient-primary">{hunter.username}</h3>
          <p className="text-sm text-muted-foreground">
            {hunter.guildId ? hunter.guildId.name : 'Independent'}
          </p>
        </div>
        
        <div className="glass p-4 rounded-xl border border-primary/30">
          <div className="text-sm text-muted-foreground mb-1">Trust Score</div>
          <div className="text-4xl font-black text-gradient-primary">{hunter.trustScore.toFixed(1)}%</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="glass p-3 rounded-lg">
            <div className="text-muted-foreground mb-1">Quests</div>
            <div className="text-xl font-bold text-secondary">{hunter.completedQuests}</div>
          </div>
          <div className="glass p-3 rounded-lg">
            <div className="text-muted-foreground mb-1">Rep</div>
            <div className="text-xl font-bold text-accent">{hunter.hunterReputation}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function HunterCard({ hunter }: { hunter: Hunter }) {
  return (
    <Link href={`/profile/${hunter._id}`}>
      <Card className="relative group overflow-hidden glass-strong border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 tactical-scan">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 group-hover:opacity-70 transition-opacity" />
        
        <div className="relative p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-float">{hunter.avatar}</div>
              <div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {hunter.username}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {hunter.bio || 'Elite Hunter'}
                </p>
              </div>
            </div>
            <Badge className={`text-${hunter.rank === 'Legendary' ? 'warning' : 'primary'} border-${hunter.rank === 'Legendary' ? 'warning' : 'primary'}/40 bg-${hunter.rank === 'Legendary' ? 'warning' : 'primary'}/10 font-bold`}>
              {hunter.rank}
            </Badge>
          </div>

          <div className="glass p-4 rounded-xl border border-primary/30 group-hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Trust Score</div>
                <div className="text-3xl font-black text-gradient-primary">
                  {hunter.trustScore.toFixed(1)}%
                </div>
              </div>
              <Shield className="h-10 w-10 text-primary animate-pulse-glow" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Completed</div>
              <div className="text-lg font-bold text-secondary">{hunter.completedQuests}</div>
            </div>
            <div className="glass p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Reputation</div>
              <div className="text-lg font-bold text-accent">{hunter.hunterReputation}</div>
            </div>
          </div>

          {hunter.skills.length > 0 && (
            <div className="pt-3 border-t border-primary/20">
              <div className="text-xs text-muted-foreground mb-2">SKILLS</div>
              <div className="flex flex-wrap gap-2">
                {hunter.skills.slice(0, 3).map((skill: string) => (
                  <Badge key={skill} variant="outline" className="text-xs border-primary/30">
                    {skill}
                  </Badge>
                ))}
                {hunter.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs border-primary/30">
                    +{hunter.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-muted-foreground">Guild</span>
            <span className="text-success font-medium">
              {hunter.guildId ? hunter.guildId.name : 'Independent'}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
