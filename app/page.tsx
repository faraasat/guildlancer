'use client';

import Link from 'next/link';
import { ArrowRight, Users, Target, Shield, Zap, Sparkles, TrendingUp, Hexagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        
        {/* Radial Gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Hexagon className="absolute w-20 h-20 text-primary/20 animate-float" style={{ top: '15%', left: '8%', animationDuration: '8s' }} />
          <Hexagon className="absolute w-16 h-16 text-secondary/20 animate-float" style={{ top: '70%', right: '10%', animationDuration: '10s', animationDelay: '1s' }} />
          <Hexagon className="absolute w-24 h-24 text-accent/20 animate-float" style={{ bottom: '20%', left: '85%', animationDuration: '12s', animationDelay: '2s' }} />
          <Sparkles className="absolute w-12 h-12 text-success/30 animate-float" style={{ top: '40%', right: '15%', animationDuration: '7s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-strong border border-primary/40 text-sm animate-shimmer">
              <Zap className="h-5 w-5 text-primary animate-glow-pulse" />
              <span className="font-medium">Community-Governed • Trust-Driven • AI-Assisted</span>
            </div>

            {/* Main Heading with Enhanced Typography */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black font-heading tracking-tighter">
                <span className="text-neon-primary">Decentralized</span>
                <br />
                <span className="text-gradient-primary">Trust Platform</span>
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <Sparkles className="text-primary h-6 w-6" />
                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>
            </div>

            {/* Enhanced Subheading */}
            <p className="text-xl md:text-3xl text-foreground/80 max-w-3xl mx-auto leading-relaxed font-light">
              Join <span className="text-gradient-primary font-semibold">guilds</span>, solve{' '}
              <span className="text-gradient-accent font-semibold">bounties</span>, and earn{' '}
              <span className="text-gradient-success font-semibold">reputation</span> where trust is earned through action
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
              <Button 
                size="lg" 
                asChild 
                className="relative group glow-primary text-lg h-16 px-10 overflow-hidden border-2 border-primary/50 bg-primary/10 hover:bg-primary/20 transition-all duration-300"
              >
                <Link href="/register" className="relative z-10">
                  <span className="relative z-10 font-bold">Enter Network</span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-shimmer" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="border-2 border-secondary/50 hover:border-secondary hover:bg-secondary/10 text-lg h-16 px-10 transition-all duration-300"
              >
                <Link href="/guilds">
                  <Sparkles className="mr-3 h-5 w-5" />
                  Explore Guilds
                </Link>
              </Button>
            </div>

            {/* Live Stats with Enhanced Design */}
            <LiveStats />
          </div>
        </div>

        {/* Scan Line Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent h-1 animate-scan" />
        </div>
      </section>

      {/* Features Section with Enhanced Cards */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full glass border border-primary/30 text-sm font-medium mb-4">
              <span className="text-primary">◆</span> Platform Features
            </div>
            <h2 className="text-5xl md:text-6xl font-bold font-heading">
              How It <span className="text-gradient-primary">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A revolutionary approach to task resolution with skin in the game
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Users className="h-12 w-12" />}
              title="Join a Guild"
              description="Form or join guilds with other hunters. Collective reputation, shared treasury, and coordinated missions."
              color="primary"
              step="01"
            />
            <FeatureCard
              icon={<Target className="h-12 w-12" />}
              title="Accept Bounties"
              description="Guilds stake funds to accept bounties. Higher stakes unlock higher rewards and exclusive missions."
              color="secondary"
              step="02"
            />
            <FeatureCard
              icon={<Shield className="h-12 w-12" />}
              title="Build Trust"
              description="Complete missions, resolve disputes fairly, and climb the rankings. Reputation is everything."
              color="accent"
              step="03"
            />
          </div>
        </div>
      </section>

      {/* Enhanced Stats Grid */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <StatCard label="Active Guilds" value="127" icon={<Users className="h-6 w-6" />} trend="+12" />
            <StatCard label="Total Bounties" value="2,543" icon={<Target className="h-6 w-6" />} trend="+156" />
            <StatCard label="Success Rate" value="94.2%" icon={<TrendingUp className="h-6 w-6" />} trend="+2.3" />
            <StatCard label="Credits Staked" value="1.2M" icon={<Sparkles className="h-6 w-6" />} trend="+45K" />
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-gradient-primary p-12 md:p-20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-grid-small opacity-20" />
            
            <div className="relative z-10 text-center space-y-8">
              <div className="inline-block">
                <Sparkles className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse-glow" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold font-heading">
                Ready to <span className="text-gradient-primary">Join the Network?</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Start building your reputation today. No blockchain required for MVP.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" asChild className="glow-primary text-lg h-16 px-10">
                  <Link href="/register">
                    Get Started Now
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-2 border-primary/30 text-lg h-16 px-10">
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function LiveStats() {
  const [stats, setStats] = useState({
    guilds: 127,
    bounties: 2543,
    hunters: 1834,
    staked: 1200000,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        guilds: prev.guilds + Math.floor(Math.random() * 2),
        bounties: prev.bounties + Math.floor(Math.random() * 5),
        hunters: prev.hunters + Math.floor(Math.random() * 3),
        staked: prev.staked + Math.floor(Math.random() * 10000),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative glass-strong p-6 rounded-2xl border border-primary/30 group-hover:border-primary/50 transition-all">
          <div className="text-4xl font-black text-primary mb-2">{stats.guilds}</div>
          <div className="text-sm text-muted-foreground font-medium">Active Guilds</div>
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse" />
          </div>
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative glass-strong p-6 rounded-2xl border border-secondary/30 group-hover:border-secondary/50 transition-all">
          <div className="text-4xl font-black text-secondary mb-2">{stats.bounties.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground font-medium">Total Bounties</div>
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 bg-secondary rounded-full animate-glow-pulse" />
          </div>
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative glass-strong p-6 rounded-2xl border border-accent/30 group-hover:border-accent/50 transition-all">
          <div className="text-4xl font-black text-accent mb-2">{stats.hunters.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground font-medium">Active Hunters</div>
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 bg-accent rounded-full animate-glow-pulse" />
          </div>
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative glass-strong p-6 rounded-2xl border border-success/30 group-hover:border-success/50 transition-all">
          <div className="text-4xl font-black text-success mb-2">{(stats.staked / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-muted-foreground font-medium">Credits Staked</div>
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 bg-success rounded-full animate-glow-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
  step: string;
}

function FeatureCard({ icon, title, description, color, step }: FeatureCardProps) {
  const colorClasses = {
    primary: {
      border: 'border-primary/30 hover:border-primary/60',
      glow: 'from-primary/30',
      text: 'text-primary',
      bg: 'bg-primary/5',
    },
    secondary: {
      border: 'border-secondary/30 hover:border-secondary/60',
      glow: 'from-secondary/30',
      text: 'text-secondary',
      bg: 'bg-secondary/5',
    },
    accent: {
      border: 'border-accent/30 hover:border-accent/60',
      glow: 'from-accent/30',
      text: 'text-accent',
      bg: 'bg-accent/5',
    },
  };

  const classes = colorClasses[color];

  return (
    <Card className={`relative group overflow-hidden glass-strong border-2 ${classes.border} transition-all duration-500 hover:-translate-y-2`}>
      {/* Step Number Badge */}
      <div className="absolute top-6 right-6">
        <div className={`w-12 h-12 rounded-full ${classes.bg} border ${classes.border} flex items-center justify-center font-mono font-bold ${classes.text}`}>
          {step}
        </div>
      </div>

      {/* Gradient Glow on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${classes.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative p-8 space-y-4">
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-xl ${classes.bg} border ${classes.border} ${classes.text} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold font-heading">{title}</h3>

        {/* Description */}
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>

        {/* Animated Line */}
        <div className="pt-4">
          <div className={`h-1 w-0 group-hover:w-full ${classes.bg} rounded-full transition-all duration-700`} />
        </div>
      </div>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      <Card className="relative glass-strong border-2 border-primary/20 group-hover:border-primary/40 p-8 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-primary">
            {icon}
          </div>
          <div className="flex items-center gap-1 text-success text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            {trend}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-5xl font-black text-gradient-primary font-heading">
            {value}
          </div>
          <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
            {label}
          </div>
        </div>
      </Card>
    </div>
  );
}
