'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Unlock,
  TrendingUp,
  Search,
  Download,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface PaymentsClientProps {
  user: {
    id: string;
    username: string;
  };
}

// Mock data
const mockBalance = {
  available: 1000,
  staked: 0,
  pending: 0,
  lifetime: 1000,
};

const mockTransactions = [
  {
    id: 'TXN001',
    type: 'credit',
    description: 'Welcome Bonus',
    amount: 1000,
    balance: 1000,
    status: 'completed',
    date: new Date().toISOString(),
  },
];

// Mock stakes data
interface Stake {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

const mockStakes: Stake[] = [];

const cashFlowData = [
  { month: 'Jan', income: 0, expenses: 0 },
  { month: 'Feb', income: 0, expenses: 0 },
  { month: 'Mar', income: 0, expenses: 0 },
  { month: 'Apr', income: 0, expenses: 0 },
  { month: 'May', income: 0, expenses: 0 },
  { month: 'Jun', income: 1000, expenses: 0 },
];

const stakingROIData = [
  { day: '1', roi: 0 },
  { day: '7', roi: 0 },
  { day: '14', roi: 0 },
  { day: '30', roi: 0 },
];

export default function PaymentsClient({ user }: PaymentsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredTransactions = mockTransactions.filter((tx) =>
    tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">
              <span className="text-gradient-primary">Vault & Payments</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your credits, stakes, and transaction history
            </p>
          </div>

          {/* Balance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <BalanceCard
              title="Available Credits"
              amount={mockBalance.available}
              icon={<Wallet className="h-6 w-6" />}
              color="text-primary"
              trend="+100%"
            />
            <BalanceCard
              title="Staked Credits"
              amount={mockBalance.staked}
              icon={<Lock className="h-6 w-6" />}
              color="text-purple-400"
              info="Earn 5% APY"
            />
            <BalanceCard
              title="Pending Earnings"
              amount={mockBalance.pending}
              icon={<Clock className="h-6 w-6" />}
              color="text-warning"
              info="Releases after mission completion"
            />
            <BalanceCard
              title="Lifetime Earned"
              amount={mockBalance.lifetime}
              icon={<TrendingUp className="h-6 w-6" />}
              color="text-success"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="glass-strong border-2 border-primary/30 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Cash Flow Chart */}
              <Card className="glass-strong border-2 border-primary/30 p-6">
                <h3 className="text-xl font-bold mb-4">Cash Flow</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a24',
                        border: '1px solid #3B82F6',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#F97316"
                      strokeWidth={2}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-strong border-2 border-primary/30 p-6 text-center hover:border-primary/60 transition-all cursor-pointer">
                  <ArrowDownLeft className="h-12 w-12 mx-auto mb-4 text-success" />
                  <h3 className="text-lg font-bold mb-2">Withdraw Credits</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Transfer credits to external wallet
                  </p>
                  <Button className="w-full">Withdraw</Button>
                </Card>
                <Card className="glass-strong border-2 border-primary/30 p-6 text-center hover:border-primary/60 transition-all cursor-pointer">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-lg font-bold mb-2">Stake Credits</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Earn 5% APY on staked credits
                  </p>
                  <Button className="w-full">Stake Now</Button>
                </Card>
                <Card className="glass-strong border-2 border-primary/30 p-6 text-center hover:border-primary/60 transition-all cursor-pointer">
                  <ArrowUpRight className="h-12 w-12 mx-auto mb-4 text-warning" />
                  <h3 className="text-lg font-bold mb-2">Purchase Credits</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add more credits to your vault
                  </p>
                  <Button className="w-full">Buy Credits</Button>
                </Card>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              {/* Search and Filters */}
              <Card className="glass-strong border-2 border-primary/30 p-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by transaction ID or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50 border-primary/30"
                    />
                  </div>
                  <Button variant="outline" className="border-primary/30">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </Card>

              {/* Transaction Table */}
              <Card className="glass-strong border-2 border-primary/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Transaction ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Description</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">Amount</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">Balance</th>
                        <th className="px-6 py-4 text-center text-sm font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-4 text-sm">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-primary">
                            {tx.id}
                          </td>
                          <td className="px-6 py-4 text-sm">{tx.description}</td>
                          <td className={`px-6 py-4 text-sm text-right font-bold ${
                            tx.type === 'credit' ? 'text-success' : 'text-destructive'
                          }`}>
                            {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            {tx.balance.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge className={
                              tx.status === 'completed'
                                ? 'bg-success/20 text-success border-success/30'
                                : tx.status === 'pending'
                                ? 'bg-warning/20 text-warning border-warning/30'
                                : 'bg-destructive/20 text-destructive border-destructive/30'
                            }>
                              {tx.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Staking Tab */}
            <TabsContent value="staking" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stake Interface */}
                <Card className="glass-strong border-2 border-primary/30 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                      <Lock className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Stake Credits</h3>
                      <p className="text-sm text-muted-foreground">Earn 5% APY</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount to Stake</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="bg-background/50 border-primary/30"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Available: {mockBalance.available.toLocaleString()} credits
                      </p>
                    </div>

                    <div className="glass p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Annual Return</span>
                        <span className="font-bold text-success">
                          {stakeAmount ? Math.floor(Number(stakeAmount) * 0.05) : 0} credits
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lock Period</span>
                        <span className="font-bold">30 days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Risk Level</span>
                        <Badge className="bg-success/20 text-success border-success/30">Low</Badge>
                      </div>
                    </div>

                    <Button className="w-full" disabled={!stakeAmount || Number(stakeAmount) <= 0}>
                      <Lock className="mr-2 h-4 w-4" />
                      Stake Credits
                    </Button>
                  </div>
                </Card>

                {/* Staking ROI Chart */}
                <Card className="glass-strong border-2 border-primary/30 p-6">
                  <h3 className="text-xl font-bold mb-4">Expected Returns</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stakingROIData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a24',
                          border: '1px solid #A855F7',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="roi"
                        stroke="#A855F7"
                        fill="url(#roiGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Active Stakes */}
              <Card className="glass-strong border-2 border-primary/30 p-6">
                <h3 className="text-xl font-bold mb-4">Active Stakes</h3>
                {mockStakes.length > 0 ? (
                  <div className="space-y-4">
                    {mockStakes.map((stake: any) => (
                      <div key={stake.id} className="glass p-4 rounded-lg">
                        {/* Stake info */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <p className="text-muted-foreground">No active stakes yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start staking to earn passive income
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function BalanceCard({ title, amount, icon, color, trend, info }: any) {
  return (
    <Card className="glass-strong border-2 border-primary/30 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-primary/10 border border-primary/30 ${color}`}>
          {icon}
        </div>
        {trend && (
          <Badge className="bg-success/20 text-success border-success/30">
            {trend}
          </Badge>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-black font-heading">{amount.toLocaleString()}</p>
      {info && <p className="text-xs text-muted-foreground mt-2">{info}</p>}
    </Card>
  );
}
