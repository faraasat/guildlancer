'use client';

import Link from 'next/link';
import { ArrowRight, Users, Target, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-2 h-2 bg-primary rounded-full animate-float" style={{ top: '20%', left: '10%' }} />
          <div className="absolute w-3 h-3 bg-secondary rounded-full animate-float" style={{ top: '60%', right: '15%', animationDelay: '1s' }} />
          <div className="absolute w-2 h-2 bg-accent rounded-full animate-float" style={{ bottom: '30%', left: '80%', animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Community-Governed • Trust-Driven • AI-Assisted</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold font-heading">
              <span className="text-gradient-primary">Decentralized Trust.</span>
              <br />
              <span className="text-foreground">Community Governance.</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Join guilds, solve bounties, and earn reputation in a platform where trust is earned, not given.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="glow-primary text-lg h-14 px-8">
                <Link href="/register">
                  Enter Network
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary/30 text-lg h-14 px-8">
                <Link href="/guilds">
                  Explore Guilds
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <LiveStats />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              How It <span className="text-gradient-primary">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A revolutionary approach to task resolution with skin in the game
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Join a Guild"
              description="Form or join guilds with other hunters. Collective reputation and shared treasury."
              color="primary"
            />
            <FeatureCard
              icon={<Target className="h-10 w-10" />}
              title="Accept Bounties"
              description="Guilds stake funds to accept bounties. Higher stakes, higher rewards."
              color="secondary"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title="Build Trust"
              description="Complete missions, resolve disputes fairly, and climb the rankings."
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-20 bg-surface/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard label="Active Guilds" value="127" />
            <StatCard label="Total Bounties" value="2,543" />
            <StatCard label="Success Rate" value="94.2%" />
            <StatCard label="Credits Staked" value="1.2M" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary/30 p-12">
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold font-heading">
                Ready to <span className="text-gradient-primary">Join the Network?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start building your reputation today. No blockchain required for MVP.
              </p>
              <Button size="lg" asChild className="glow-primary text-lg h-14 px-8">
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
      <div className="glass p-4 rounded-lg border border-primary/20">
        <div className="text-3xl font-bold text-primary">{stats.guilds}</div>
        <div className="text-sm text-muted-foreground">Active Guilds</div>
      </div>
      <div className="glass p-4 rounded-lg border border-secondary/20">
        <div className="text-3xl font-bold text-secondary">{stats.bounties}</div>
        <div className="text-sm text-muted-foreground">Total Bounties</div>
      </div>
      <div className="glass p-4 rounded-lg border border-accent/20">
        <div className="text-3xl font-bold text-accent">{stats.hunters}</div>
        <div className="text-sm text-muted-foreground">Active Hunters</div>
      </div>
      <div className="glass p-4 rounded-lg border border-success/20">
        <div className="text-3xl font-bold text-success">{stats.staked.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">Credits Staked</div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    primary: 'text-primary border-primary/30',
    secondary: 'text-secondary border-secondary/30',
    accent: 'text-accent border-accent/30',
  };

  return (
    <Card className="glass p-6 border hover:border-primary/50 transition-all group">
      <div className={`inline-flex p-3 rounded-lg mb-4 border ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold font-heading mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gradient-primary font-heading mb-2">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
