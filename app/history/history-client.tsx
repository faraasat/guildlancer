'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Filter,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  Target,
  Shield,
  Users,
  Zap,
  AlertCircle,
} from 'lucide-react';

interface HistoryClientProps {
  user: {
    id: string;
    username: string;
  };
}

// Mock activity data
const mockActivities = [
  {
    id: 1,
    type: 'joined',
    title: 'Joined GuildLancer',
    description: 'Welcome to the network!',
    date: new Date().toISOString(),
    impact: { trustScore: 0, credits: 1000 },
    status: 'success',
  },
  {
    id: 2,
    type: 'bonus',
    title: 'Welcome Bonus',
    description: 'Received 1,000 starting credits',
    date: new Date().toISOString(),
    impact: { credits: 1000 },
    status: 'success',
  },
];

export default function HistoryClient({ user }: HistoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || activity.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">
              <span className="text-gradient-primary">Activity History</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete timeline of your journey on GuildLancer
            </p>
          </div>

          {/* Filters and Search */}
          <Card className="glass-strong border-2 border-primary/30 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/30"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-primary/30 bg-background/50 px-3 py-2 text-sm"
                >
                  <option value="all">All Activities</option>
                  <option value="mission">Missions</option>
                  <option value="guild">Guild</option>
                  <option value="payment">Payments</option>
                  <option value="dispute">Disputes</option>
                  <option value="bonus">Bonuses</option>
                </select>
                <Button variant="outline" className="border-primary/30 shrink-0">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isExpanded={expandedId === activity.id}
                  onToggle={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                />
              ))
            ) : (
              <Card className="glass-strong border-2 border-primary/20 p-12 text-center">
                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Activities Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Start accepting missions to build your history'}
                </p>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {filteredActivities.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button variant="outline" className="border-primary/30" disabled>
                  Previous
                </Button>
                <Button variant="outline" className="border-primary/30 bg-primary/10">
                  1
                </Button>
                <Button variant="outline" className="border-primary/30" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity, isExpanded, onToggle }: any) {
  const getIcon = () => {
    switch (activity.type) {
      case 'mission':
        return <Target className="h-5 w-5" />;
      case 'guild':
        return <Users className="h-5 w-5" />;
      case 'payment':
        return <Zap className="h-5 w-5" />;
      case 'dispute':
        return <AlertCircle className="h-5 w-5" />;
      case 'bonus':
        return <Award className="h-5 w-5" />;
      case 'joined':
        return <Shield className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    switch (activity.status) {
      case 'success':
        return 'border-success/30 bg-success/10 text-success';
      case 'pending':
        return 'border-warning/30 bg-warning/10 text-warning';
      case 'failed':
        return 'border-destructive/30 bg-destructive/10 text-destructive';
      default:
        return 'border-primary/30 bg-primary/10 text-primary';
    }
  };

  return (
    <Card className="glass-strong border-2 border-primary/20 hover:border-primary/40 transition-all">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${getStatusColor()} shrink-0`}>
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">{activity.title}</h3>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <Badge className={getStatusColor()}>
                {activity.status}
              </Badge>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(activity.date).toLocaleDateString()}
              </span>
            </div>

            {/* Impact */}
            {activity.impact && (
              <div className="flex flex-wrap gap-3 mb-3">
                {activity.impact.trustScore !== undefined && activity.impact.trustScore !== 0 && (
                  <div className="glass px-3 py-1 rounded-full text-sm">
                    Trust Score: <span className="font-bold text-primary">
                      {activity.impact.trustScore > 0 ? '+' : ''}{activity.impact.trustScore}
                    </span>
                  </div>
                )}
                {activity.impact.credits !== undefined && activity.impact.credits !== 0 && (
                  <div className="glass px-3 py-1 rounded-full text-sm">
                    Credits: <span className="font-bold text-warning">
                      {activity.impact.credits > 0 ? '+' : ''}{activity.impact.credits?.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Expandable Details */}
            {activity.details && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-primary hover:text-primary/80"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="mr-1 h-4 w-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 h-4 w-4" />
                    View Details
                  </>
                )}
              </Button>
            )}

            {isExpanded && activity.details && (
              <div className="mt-4 pt-4 border-t border-primary/20 glass p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{activity.details}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
