'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Target,
  Award,
  Zap,
  Shield,
  Activity,
  DollarSign,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';

interface AnalyticsClientProps {
  user: {
    id: string;
    username: string;
    rank: string;
    trustScore: number;
  };
}

// Mock data for charts
const trustScoreData = [
  { month: 'Jan', score: 45 },
  { month: 'Feb', score: 48 },
  { month: 'Mar', score: 50 },
  { month: 'Apr', score: 50 },
  { month: 'May', score: 50 },
  { month: 'Jun', score: 50 },
];

const categorySuccessData = [
  { category: 'Security', successRate: 0, missions: 0 },
  { category: 'Frontend', successRate: 0, missions: 0 },
  { category: 'Backend', successRate: 0, missions: 0 },
  { category: 'Mobile', successRate: 0, missions: 0 },
  { category: 'Design', successRate: 0, missions: 0 },
];

const earningsData = [
  { name: 'Mission Rewards', value: 0, color: '#00e6ff' },
  { name: 'Bonuses', value: 1000, color: '#ff00e5' },
  { name: 'Staking Returns', value: 0, color: '#8b00ff' },
];

const skillRadarData = [
  { skill: 'Speed', value: 50 },
  { skill: 'Quality', value: 50 },
  { skill: 'Communication', value: 50 },
  { skill: 'Reliability', value: 50 },
  { skill: 'Fairness', value: 50 },
];

const completionTimeData = [
  { range: '< 1 day', count: 0 },
  { range: '1-3 days', count: 0 },
  { range: '3-7 days', count: 0 },
  { range: '> 7 days', count: 0 },
];

const COLORS = ['#00e6ff', '#ff00e5', '#8b00ff', '#00ff94', '#ffaa00'];

export default function AnalyticsClient({ user }: AnalyticsClientProps) {
  const [mode, setMode] = useState<'hunter' | 'client'>('hunter');

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-heading mb-2">
                <span className="text-gradient-primary">Analytics</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Deep insights into your performance and growth
              </p>
            </div>

            {/* Mode Toggle */}
            <Card className="glass-strong border-2 border-primary/30 p-1 inline-flex">
              <Button
                variant={mode === 'hunter' ? 'default' : 'ghost'}
                className={mode === 'hunter' ? 'glow-primary' : ''}
                onClick={() => setMode('hunter')}
              >
                <Target className="mr-2 h-4 w-4" />
                Hunter
              </Button>
              <Button
                variant={mode === 'client' ? 'default' : 'ghost'}
                className={mode === 'client' ? 'glow-primary' : ''}
                onClick={() => setMode('client')}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Client
              </Button>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={<Shield />}
              label="Trust Score"
              value={`${user.trustScore}%`}
              change="+0%"
              trend="neutral"
            />
            <MetricCard
              icon={<Target />}
              label="Completion Rate"
              value="N/A"
              change="—"
              trend="neutral"
            />
            <MetricCard
              icon={<Zap />}
              label="Total Earned"
              value="1,000"
              change="+1,000"
              trend="up"
            />
            <MetricCard
              icon={<Clock />}
              label="Avg Response"
              value="N/A"
              change="—"
              trend="neutral"
            />
          </div>

          {mode === 'hunter' ? <HunterAnalytics user={user} /> : <ClientAnalytics user={user} />}
        </div>
      </div>
    </div>
  );
}

function HunterAnalytics({ user }: { user: any }) {
  return (
    <div className="space-y-8">
      {/* Trust Score Evolution */}
      <Card className="glass-strong border-2 border-primary/30 p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Trust Score Evolution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trustScoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" stroke="#ffffff60" />
            <YAxis stroke="#ffffff60" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a24',
                border: '1px solid #00e6ff40',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#00e6ff"
              strokeWidth={3}
              dot={{ fill: '#00e6ff', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Success Rate */}
        <Card className="glass-strong border-2 border-secondary/30 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-secondary" />
            Success by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySuccessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="category" stroke="#ffffff60" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#ffffff60" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid #ff00e540',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="successRate" fill="#ff00e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Complete missions to see category breakdown
          </p>
        </Card>

        {/* Earnings Breakdown */}
        <Card className="glass-strong border-2 border-accent/30 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <PieChartIcon className="h-6 w-6 text-accent" />
            Earnings Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={earningsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {earningsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid #8b00ff40',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Skill Radar */}
        <Card className="glass-strong border-2 border-success/30 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Activity className="h-6 w-6 text-success" />
            Performance Radar
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillRadarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="skill" stroke="#ffffff60" />
              <PolarRadiusAxis stroke="#ffffff60" domain={[0, 100]} />
              <Radar
                name="Your Performance"
                dataKey="value"
                stroke="#00ff94"
                fill="#00ff94"
                fillOpacity={0.3}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid #00ff9440',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Completion Time */}
        <Card className="glass-strong border-2 border-warning/30 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="h-6 w-6 text-warning" />
            Completion Time Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="range" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid #ffaa0040',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#ffaa00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-muted-foreground mt-4">
            No completion data yet
          </p>
        </Card>
      </div>

      {/* Comparative Stats */}
      <Card className="glass-strong border-2 border-primary/30 p-8">
        <h2 className="text-2xl font-bold mb-6">Comparative Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left py-3 px-4">Metric</th>
                <th className="text-right py-3 px-4">You</th>
                <th className="text-right py-3 px-4">Guild Avg</th>
                <th className="text-right py-3 px-4">Platform Avg</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow label="Trust Score" you={user.trustScore} guild="—" platform="85" />
              <ComparisonRow label="Missions Completed" you="0" guild="—" platform="12" />
              <ComparisonRow label="Success Rate" you="—" guild="—" platform="94%" />
              <ComparisonRow label="Avg Response Time" you="—" guild="—" platform="3.2 hrs" />
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="glass-strong border-2 border-accent/30 p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Award className="h-6 w-6 text-accent" />
          AI-Powered Insights
        </h2>
        <div className="space-y-4">
          <InsightCard
            title="Getting Started"
            description="Complete your profile and join a guild to unlock personalized insights."
            type="info"
          />
          <InsightCard
            title="Quick Win"
            description="Browse available bounties - there are {mockNumber} missions matching your rank."
            type="success"
          />
        </div>
      </Card>
    </div>
  );
}

function ClientAnalytics({ user }: { user: any }) {
  return (
    <div className="space-y-8">
      <Card className="glass-strong border-2 border-primary/30 p-8">
        <h2 className="text-2xl font-bold mb-6">Client Analytics</h2>
        <div className="text-center py-16">
          <DollarSign className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-glow" />
          <h3 className="text-2xl font-bold mb-2">Client Mode Analytics</h3>
          <p className="text-muted-foreground mb-6">
            Post your first bounty to see detailed client analytics
          </p>
          <Button className="glow-primary">Post Your First Bounty</Button>
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ icon, label, value, change, trend }: any) {
  const trendColors: Record<string, string> = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card className="glass-strong border-2 border-primary/20 p-6 hover:border-primary/40 transition-all">
      <div className="inline-flex p-3 rounded-lg text-primary border-primary/30 bg-primary/5 mb-3">
        {icon}
      </div>
      <div className="text-3xl font-black text-gradient-primary mb-1">{value}</div>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className={`text-xs font-medium ${trendColors[trend] || trendColors.neutral}`}>{change}</div>
    </Card>
  );
}

function ComparisonRow({ label, you, guild, platform }: any) {
  return (
    <tr className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
      <td className="py-3 px-4">{label}</td>
      <td className="py-3 px-4 text-right font-bold text-primary">{you}</td>
      <td className="py-3 px-4 text-right text-muted-foreground">{guild}</td>
      <td className="py-3 px-4 text-right text-muted-foreground">{platform}</td>
    </tr>
  );
}

function InsightCard({ title, description, type }: any) {
  const colors: Record<string, string> = {
    info: 'border-primary/30 bg-primary/5',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
  };

  return (
    <div className={`glass p-4 rounded-lg border-2 ${colors[type] || colors.info}`}>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
