import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Target, Sparkles, Zap } from 'lucide-react';

export default function BountiesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 rounded-full glass border border-accent/30 text-sm font-medium mb-4">
            <span className="text-accent">◆</span> Bounties
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading">
            <span className="text-gradient-primary">Bounty Marketplace</span>
          </h1>
          <p className="text-2xl text-muted-foreground">
            Coming Soon in Phase 3
          </p>

          <Card className="glass-strong border-2 border-accent/30 p-16 relative overflow-hidden military-corners">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
            <div className="relative z-10 space-y-6">
              <Target className="h-24 w-24 text-accent mx-auto animate-pulse-glow" />
              <h2 className="text-3xl font-bold">
                Bounty system under development
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Soon you'll be able to post bounties, accept quests, and earn rewards based on your guild's trust score.
              </p>
              <div className="flex gap-4 justify-center pt-6">
                <Button size="lg" asChild className="glow-primary">
                  <Link href="/guilds">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Explore Guilds
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-accent/30">
                  <Link href="/register">
                    <Zap className="mr-2 h-5 w-5" />
                    Get Early Access
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
