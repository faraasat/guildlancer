'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
} from 'lucide-react';

interface GuildClientProps {
  user: {
    id: string;
    username: string;
  };
}

// Mock data - user not in a guild
const mockGuildData = null;

// Mock guild members
const mockMembers = [
  {
    id: 1,
    username: 'guildmaster',
    avatar: '👑',
    role: 'Guild Master',
    rank: 'Master',
    trustScore: 95,
    contribution: 15000,
    status: 'online',
  },
  {
    id: 2,
    username: 'elitehunter',
    avatar: '⚔️',
    role: 'Elite Hunter',
    rank: 'Elite',
    trustScore: 88,
    contribution: 8500,
    status: 'online',
  },
];

// Mock chat messages
const mockMessages = [
  {
    id: 1,
    username: 'guildmaster',
    avatar: '👑',
    message: 'Welcome to the guild! Check the missions tab for active bounties.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function GuildClient({ user: _user }: GuildClientProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // If user is not in a guild, show join/create interface
  if (!mockGuildData) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-strong border-2 border-primary/30 mb-6">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">
                <span className="text-gradient-primary">Join a Guild</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Guilds are elite teams that collaborate on high-value missions. Join an existing guild or create your own.
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="glass-strong border-2 border-primary/30 p-8 text-center hover:border-primary/60 transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/30 mb-6">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Browse Guilds</h3>
                <p className="text-muted-foreground mb-6">
                  Explore existing guilds and request to join one that matches your skills and interests.
                </p>
                <Button className="w-full" size="lg">
                  Browse Guilds
                </Button>
              </Card>

              <Card className="glass-strong border-2 border-primary/30 p-8 text-center hover:border-primary/60 transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/30 mb-6">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Create Guild</h3>
                <p className="text-muted-foreground mb-6">
                  Start your own guild and recruit skilled hunters to join your team.
                </p>
                <Button className="w-full" size="lg" variant="outline">
                  Create New Guild
                </Button>
              </Card>
            </div>

            {/* Benefits */}
            <Card className="glass-strong border-2 border-primary/30 p-8">
              <h3 className="text-xl font-bold mb-6 text-center">Guild Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BenefitCard
                  icon={<Target className="h-6 w-6" />}
                  title="Team Missions"
                  description="Access exclusive high-value bounties that require guild coordination"
                />
                <BenefitCard
                  icon={<TrendingUp className="h-6 w-6" />}
                  title="Shared Growth"
                  description="Level up faster with guild bonuses and shared experience"
                />
                <BenefitCard
                  icon={<Shield className="h-6 w-6" />}
                  title="Protection"
                  description="Guild backing in disputes and support during conflicts"
                />
              </div>
            </Card>
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
          <Card className="glass-strong border-2 border-primary/30 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-lg glass border-2 border-primary/30 flex items-center justify-center text-4xl shrink-0">
                🛡️
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black font-heading mb-2">
                  <span className="text-gradient-primary">Shadow Syndicate</span>
                </h1>
                <p className="text-muted-foreground mb-4">
                  Elite cybersecurity specialists hunting high-value targets
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Users className="mr-1 h-3 w-3" />
                    {mockMembers.length} Members
                  </Badge>
                  <Badge className="bg-success/20 text-success border-success/30">
                    <Star className="mr-1 h-3 w-3" />
                    Level 5
                  </Badge>
                  <Badge className="bg-warning/20 text-warning border-warning/30">
                    <Award className="mr-1 h-3 w-3" />
                    Top 10%
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="border-primary/30">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="glass-strong border-2 border-primary/30 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="comms">
                Comm-Link
                <Badge className="ml-2 bg-primary/20 text-primary border-none">3</Badge>
              </TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="missions">Missions</TabsTrigger>
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
                            <span className="text-sm">{member.contribution.toLocaleString()}</span>
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
