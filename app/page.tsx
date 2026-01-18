'use client';

import Link from 'next/link';
import { ArrowRight, Users, Target, Shield, Zap, Sparkles, TrendingUp, Hexagon, Terminal, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            {/* Animated Badge - Enhanced */}
            <div className="inline-flex items-center gap-3 mt-10 px-8 py-4 rounded-full glass-strong border-2 border-primary/50 text-sm font-medium animate-slide-in-up hud-border text-foreground">
              <Zap className="h-6 w-6 text-primary animate-glow-pulse" />
              <span className="font-semibold tracking-wide">COMMUNITY-GOVERNED</span>
              <span className="text-primary/60">•</span>
              <span className="font-semibold tracking-wide">TRUST-DRIVEN</span>
              <span className="text-primary/60">•</span>
              <span className="font-semibold tracking-wide">AI-ASSISTED</span>
            </div>

            {/* Main Heading - Enhanced with Neon */}
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-7xl md:text-9xl font-black font-heading tracking-tighter leading-none">
                <span className="text-neon-primary animate-neon-flicker">GUILDIFIED</span>
                <br />
                <span className="text-gradient-primary">TRUST PROTOCOL</span>
              </h1>
              <div className="flex items-center justify-center gap-6">
                <div className="h-0.5 w-24 bg-linear-to-r from-transparent via-primary to-transparent" />
                <Sparkles className="text-primary h-8 w-8 animate-pulse-glow" />
                <div className="h-0.5 w-24 bg-linear-to-r from-transparent via-primary to-transparent" />
              </div>
            </div>

            {/* Enhanced Subheading */}
            <p className="text-2xl md:text-4xl text-foreground/90 max-w-4xl mx-auto leading-relaxed font-light animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              Join elite <span className="text-gradient-primary font-bold">guilds</span>, solve real-world{' '}
              <span className="text-gradient-accent font-bold">bounties</span>, and earn legendary{' '}
              <span className="text-gradient-success font-bold">reputation</span> in the network
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                asChild 
                className="relative group btn-anime text-xl h-20 px-14 overflow-hidden border-2 border-primary/50 bg-primary/10 hover:bg-primary/20 transition-cyber"
              >
                <Link href="/register" className="relative z-10">
                  <span className="relative z-10 font-black tracking-wider">ENTER NETWORK</span>
                  <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="border-2 border-secondary/50 hover:border-secondary bg-secondary/5 hover:bg-secondary/20 text-xl h-20 px-14 transition-cyber hologram-card"
              >
                <Link href="/guilds">
                  <Terminal className="mr-4 h-6 w-6" />
                  <span className="font-bold tracking-wider">EXPLORE GUILDS</span>
                </Link>
              </Button>
            </div>

            {/* Live Stats - Enhanced */}
            <LiveStats />
          </div>
        </div>

      </section>

      {/* Features Section with Enhanced Cards */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-strong hud-border border-2 border-primary/40 text-sm font-bold tracking-wider mb-4">
              <Crosshair className="h-5 w-5 text-primary animate-radar-sweep" />
              <span className="text-primary">HOW IT WORKS</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black font-heading tracking-tight">
              <span className="text-neon-secondary">BOUNTY</span>{' '}
              <span className="text-gradient-accent">SYSTEM</span>
            </h2>
            <p className="text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              A revolutionary platform where <span className="text-gradient-primary font-bold">trust</span> is earned through <span className="text-gradient-success font-bold">results</span>
            </p>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="h-0.5 w-32 bg-linear-to-r from-transparent via-primary to-primary" />
              <Terminal className="text-primary h-6 w-6 animate-pulse-glow" />
              <div className="h-0.5 w-32 bg-linear-to-r from-primary via-primary to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Users className="h-12 w-12" />}
              title="JOIN A GUILD"
              description="Form specialized teams with other hunters. Collective reputation, shared treasury, and coordinated task resolution."
              color="primary"
              step="01"
            />
            <FeatureCard
              icon={<Target className="h-12 w-12" />}
              title="ACCEPT BOUNTIES"
              description="Stake resources to secure tasks. Higher trust unlocks premium contracts and exclusive opportunities."
              color="secondary"
              step="02"
            />
            <FeatureCard
              icon={<Shield className="h-12 w-12" />}
              title="BUILD TRUST"
              description="Complete tasks, resolve conflicts fairly, and climb the ranks. Reputation is everything."
              color="accent"
              step="03"
            />
          </div>
        </div>
      </section>

      {/* Enhanced Stats Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-5xl font-black font-heading tracking-tight">
              <span className="text-neon-primary">NETWORK</span>{' '}
              <span className="text-gradient-accent">STATISTICS</span>
            </h3>
            <div className="flex items-center justify-center gap-4">
              <div className="h-0.5 w-24 bg-linear-to-r from-transparent via-success to-transparent" />
              <Crosshair className="text-success h-6 w-6 animate-radar-sweep" />
              <div className="h-0.5 w-24 bg-linear-to-r from-transparent via-success to-transparent" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <StatCard label="ACTIVE GUILDS" value="127" icon={<Users className="h-6 w-6" />} trend="+12" />
            <StatCard label="TOTAL BOUNTIES" value="2,543" icon={<Target className="h-6 w-6" />} trend="+156" />
            <StatCard label="SUCCESS RATE" value="94.2%" icon={<TrendingUp className="h-6 w-6" />} trend="+2.3" />
            <StatCard label="CREDITS STAKED" value="1.2M" icon={<Sparkles className="h-6 w-6" />} trend="+45K" />
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 relative z-10">
          <Card className="relative overflow-hidden nft-card border-2 border-primary/30 p-12 md:p-20 hud-border">
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-secondary/20" />
            
            <div className="relative z-10 text-center space-y-10">
              <div className="inline-block">
                <div className="relative">
                  <Sparkles className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse-glow" />
                  <div className="absolute -inset-4 bg-primary/30 rounded-full blur-xl animate-pulse-glow" />
                </div>
              </div>
              
              <h2 className="text-6xl md:text-7xl font-black font-heading tracking-tight leading-tight">
                <span className="text-neon-primary animate-neon-flicker">READY TO</span>
                <br />
                <span className="text-gradient-primary">JOIN THE NETWORK?</span>
              </h2>
              
              <p className="text-2xl md:text-3xl text-foreground/90 max-w-3xl mx-auto leading-relaxed font-light">
                Start building your <span className="text-gradient-success font-bold">legendary reputation</span> today.<br />
                <span className="text-sm text-muted-foreground">No blockchain required for MVP.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Button size="lg" asChild className="btn-anime border-2 border-primary/50 text-xl h-20 px-14">
                  <Link href="/register">
                    <span className="font-black tracking-wider">GET STARTED NOW</span>
                    <ArrowRight className="ml-4 h-7 w-7" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="hologram-card border-2 border-accent/50 hover:border-accent text-xl h-20 px-14 transition-cyber">
                  <Link href="/about">
                    <Terminal className="mr-4 h-6 w-6" />
                    <span className="font-bold tracking-wider">LEARN MORE</span>
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
      <div className="relative group">
        <div className="relative nft-card glass-strong p-6 rounded-2xl border-2 border-primary/40 group-hover:border-primary/70 transition-cyber hud-border">
          <div className="text-5xl font-black text-neon-primary mb-2 animate-hologram-glitch">{stats.guilds}</div>
          <div className="text-sm text-foreground/70 font-bold tracking-wider uppercase">Active Guilds</div>
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="relative group">
        <div className="relative nft-card glass-strong p-6 rounded-2xl border-2 border-secondary/40 group-hover:border-secondary/70 transition-cyber hud-border">
          <div className="text-5xl font-black text-neon-secondary mb-2 animate-hologram-glitch">{stats.bounties.toLocaleString()}</div>
          <div className="text-sm text-foreground/70 font-bold tracking-wider uppercase">Total Bounties</div>
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 bg-secondary rounded-full" />
          </div>
        </div>
        </div>
      <div className="relative group">
        <div className="relative nft-card glass-strong p-6 rounded-2xl border-2 border-accent/40 group-hover:border-accent/70 transition-cyber hud-border">
          <div className="text-5xl font-black text-neon-accent mb-2 animate-hologram-glitch">{stats.hunters.toLocaleString()}</div>
          <div className="text-sm text-foreground/70 font-bold tracking-wider uppercase">Active Hunters</div>
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 bg-accent rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="relative group">
        <div className="relative nft-card glass-strong p-6 rounded-2xl border-2 border-success/40 group-hover:border-success/70 transition-cyber hud-border">
          <div className="text-5xl font-black text-neon-success mb-2 animate-hologram-glitch">{(stats.staked / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-foreground/70 font-bold tracking-wider uppercase">Credits Staked</div>
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 bg-success rounded-full" />
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
      border: 'border-primary/40 hover:border-primary/80',
      glow: 'from-primary/40',
      text: 'text-neon-primary',
      bg: 'bg-primary/10',
      neon: 'text-neon-primary',
    },
    secondary: {
      border: 'border-secondary/40 hover:border-secondary/80',
      glow: 'from-secondary/40',
      text: 'text-neon-secondary',
      bg: 'bg-secondary/10',
      neon: 'text-neon-secondary',
    },
    accent: {
      border: 'border-accent/40 hover:border-accent/80',
      glow: 'from-accent/40',
      text: 'text-neon-accent',
      bg: 'bg-accent/10',
      neon: 'text-neon-accent',
    },
  };

  const classes = colorClasses[color];

  return (
    <Card className={`relative group overflow-hidden nft-card glass-strong border-2 ${classes.border} transition-cyber hover:-translate-y-3 hover:scale-105 animate-slide-in-up hud-border`}>
      {/* Step Number Badge - Enhanced */}
      <div className="absolute top-6 right-6 z-10">
        <div className={`relative w-16 h-16 rounded-full ${classes.bg} border-2 ${classes.border} flex items-center justify-center font-mono font-black text-xl ${classes.neon} animate-pulse-glow`}>
          <span className="relative z-10">{step}</span>
          <div className={`absolute inset-0 rounded-full ${classes.bg} blur-lg animate-glow-pulse`} />
        </div>
      </div>

      {/* Static Background Overlay */}
      <div className={`absolute inset-0 ${classes.bg} opacity-10`} />

      <div className="relative p-10 space-y-6">
        {/* Icon - Enhanced */}
        <div className={`inline-flex p-5 rounded-2xl ${classes.bg} border-2 ${classes.border} ${classes.neon} group-hover:scale-125 group-hover:rotate-3 transition-cyber glow-${color}`}>
          {icon}
        </div>

        {/* Title - Enhanced */}
        <h3 className="text-3xl font-black font-heading tracking-tight leading-tight">{title}</h3>

        {/* Description - Enhanced */}
        <p className="text-foreground/80 text-lg leading-relaxed font-light">
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
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-cyber animate-pulse-glow" />
      
      <Card className="relative nft-card glass-strong border-2 border-primary/30 group-hover:border-primary/60 p-10 transition-cyber hover:-translate-y-2 hover:scale-105 animate-slide-in-up hud-border">
        <div className="flex items-start justify-between mb-6">
          <div className="p-4 rounded-xl bg-primary/20 border-2 border-primary/40 text-primary glow-primary group-hover:scale-110 transition-cyber">
            {icon}
          </div>
          <div className="flex items-center gap-2 text-success text-sm font-bold tracking-wider uppercase border border-success/30 px-3 py-1 rounded-full bg-success/10 animate-pulse-glow">
            <TrendingUp className="h-4 w-4" />
            {trend}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-6xl font-black text-gradient-primary font-heading animate-hologram-glitch">
            {value}
          </div>
          <div className="text-sm text-foreground/70 font-bold tracking-widest uppercase">
            {label}
          </div>
        </div>
      </Card>
    </div>
  );
}
