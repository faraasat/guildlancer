'use client';

import Link from 'next/link';
import { Search, TrendingUp, Award, Target, Shield, Star, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Mock data for hunters - Diverse real-world bounty hunters
const mockHunters = [
  {
    id: 1,
    name: 'Tracker Morgan',
    avatar: '🔍',
    tagline: 'Missing Persons & Asset Recovery Specialist',
    guild: 'Apex Trackers',
    trustScore: 99.2,
    rank: 'Legendary',
    completedQuests: 143,
    specialties: ['Missing Persons', 'Asset Recovery', 'Investigation'],
    powerLevel: 3456,
    color: 'primary'
  },
  {
    id: 2,
    name: 'Agent Cipher',
    avatar: '🕵️',
    tagline: 'Digital Forensics Expert',
    guild: 'Digital Forensics Unit',
    trustScore: 98.8,
    rank: 'Legendary',
    completedQuests: 128,
    specialties: ['Forensic Analysis', 'Cyber Crime', 'Evidence Recovery'],
    powerLevel: 3287,
    color: 'secondary'
  },
  {
    id: 3,
    name: 'Veritas',
    avatar: '⚖️',
    tagline: 'Fact Checker & Verification Specialist',
    guild: 'Truth Seekers',
    trustScore: 98.5,
    rank: 'Master',
    completedQuests: 115,
    specialties: ['Fact Verification', 'Background Checks', 'Due Diligence'],
    powerLevel: 3142,
    color: 'accent'
  },
  {
    id: 4,
    name: 'Shadow Wolf',
    avatar: '🐺',
    tagline: 'Fugitive Recovery Agent',
    guild: 'Shadow Stalkers',
    trustScore: 97.9,
    rank: 'Master',
    completedQuests: 98,
    specialties: ['Fugitive Recovery', 'Surveillance', 'Skip Tracing'],
    powerLevel: 2956,
    color: 'success'
  },
  {
    id: 5,
    name: 'Neighborhood Hero',
    avatar: '🦸',
    tagline: 'Local Task & Assistance Expert',
    guild: 'Local Heroes',
    trustScore: 97.4,
    rank: 'Master',
    completedQuests: 92,
    specialties: ['Local Errands', 'Community Help', 'Delivery'],
    powerLevel: 2843,
    color: 'warning'
  },
  {
    id: 6,
    name: 'InfoHawk',
    avatar: '🦅',
    tagline: 'OSINT & Intelligence Gatherer',
    guild: 'InfoHawks',
    trustScore: 96.8,
    rank: 'Expert',
    completedQuests: 87,
    specialties: ['OSINT', 'Research', 'Intelligence Gathering'],
    powerLevel: 2714,
    color: 'primary'
  }
];

const topSkills = [
  { skill: 'Investigation', count: 234, color: 'primary' },
  { skill: 'Verification', count: 189, color: 'secondary' },
  { skill: 'Surveillance', count: 156, color: 'accent' },
  { skill: 'Research', count: 142, color: 'success' },
  { skill: 'Local Tasks', count: 128, color: 'warning' },
  { skill: 'Forensics', count: 98, color: 'primary' },
];

export default function HuntersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHunters = mockHunters.filter(hunter =>
    hunter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hunter.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <Sparkles className="inline h-6 w-6 text-primary mr-2" />
            Top Skills in Network
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {topSkills.map((item) => (
              <Badge 
                key={item.skill}
                className={`text-${item.color} border-${item.color}/40 bg-${item.color}/10 px-6 py-3 text-lg font-bold hover:scale-110 transition-transform cursor-pointer`}
              >
                {item.skill} <span className="ml-2 text-muted-foreground">({item.count})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <Crown className="inline h-8 w-8 text-warning animate-pulse-glow mr-2" />
            Top Ranked Hunters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mockHunters.slice(0, 3).map((hunter, idx) => (
              <PodiumCard key={hunter.id} hunter={hunter} position={idx + 1} />
            ))}
          </div>
        </div>

        {/* All Hunters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHunters.map((hunter) => (
            <HunterCard key={hunter.id} hunter={hunter} />
          ))}
        </div>

        {/* Empty State */}
        {filteredHunters.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No hunters found</h3>
            <p className="text-muted-foreground">Try adjusting your search</p>
          </div>
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

function PodiumCard({ hunter, position }: { hunter: any; position: number }) {
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
          <h3 className="text-2xl font-bold text-gradient-primary">{hunter.name}</h3>
          <p className="text-sm text-muted-foreground">{hunter.guild}</p>
        </div>
        
        <div className="glass p-4 rounded-xl border border-primary/30">
          <div className="text-sm text-muted-foreground mb-1">Trust Score</div>
          <div className="text-4xl font-black text-gradient-primary">{hunter.trustScore}%</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="glass p-3 rounded-lg">
            <div className="text-muted-foreground mb-1">Quests</div>
            <div className="text-xl font-bold text-secondary">{hunter.completedQuests}</div>
          </div>
          <div className="glass p-3 rounded-lg">
            <div className="text-muted-foreground mb-1">Power</div>
            <div className="text-xl font-bold text-accent">{hunter.powerLevel}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function HunterCard({ hunter }: { hunter: any }) {
  return (
    <Link href={`/hunters/${hunter.id}`}>
      <Card className="relative group overflow-hidden glass-strong border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 tactical-scan">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 group-hover:opacity-70 transition-opacity" />
        
        <div className="relative p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-float">{hunter.avatar}</div>
              <div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {hunter.name}
                </h3>
                <p className="text-sm text-muted-foreground">{hunter.tagline}</p>
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
                  {hunter.trustScore}%
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
              <div className="text-xs text-muted-foreground mb-1">Power</div>
              <div className="text-lg font-bold text-accent">{hunter.powerLevel}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-primary/20">
            <div className="text-xs text-muted-foreground mb-2">SPECIALTIES</div>
            <div className="flex flex-wrap gap-2">
              {hunter.specialties.map((skill: string) => (
                <Badge key={skill} variant="outline" className="text-xs border-primary/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-muted-foreground">Guild</span>
            <span className="text-success font-medium">{hunter.guild}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
