import Link from 'next/link';
import { Shield, Users, Target, Zap, TrendingUp, Award, Brain, Scale, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-20 text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full glass border border-primary/30 text-sm font-medium mb-4">
            <span className="text-primary">◆</span> About GuildLancer
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading">
            <span className="text-gradient-primary">Trust-Driven</span>
            <br />
            Bounty Resolution
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A revolutionary platform where reputation is earned through action, guilds govern disputes,
            and every participant has skin in the game.
          </p>
        </div>

        {/* The Problem */}
        <section className="mb-20">
          <Card className="glass-strong border-2 border-destructive/30 p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-destructive/10 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 text-center">
                ⚠️ The Problem with Traditional Freelancing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="text-5xl">🚫</div>
                  <h3 className="text-xl font-bold">No Accountability</h3>
                  <p className="text-muted-foreground">
                    Clients and freelancers can ghost without consequences
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-5xl">⚖️</div>
                  <h3 className="text-xl font-bold">Biased Disputes</h3>
                  <p className="text-muted-foreground">
                    Platform owners act as judges with conflicts of interest
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-5xl">📉</div>
                  <h3 className="text-xl font-bold">Reputation Silos</h3>
                  <p className="text-muted-foreground">
                    Your hard-earned reputation is trapped on one platform
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* The Solution */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-primary">The GuildLancer Way</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A platform built on trust, transparency, and collective governance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield />}
              title="Skin in the Game"
              description="Guilds stake funds to accept bounties. Higher stakes = higher rewards and trust scores."
              color="primary"
            />
            <FeatureCard
              icon={<Users />}
              title="Guild Governance"
              description="Disputes are resolved by peer guilds with proven track records, not platform owners."
              color="secondary"
            />
            <FeatureCard
              icon={<Brain />}
              title="AI-Assisted"
              description="Advanced AI analyzes evidence and suggests fair resolutions before human review."
              color="accent"
            />
            <FeatureCard
              icon={<TrendingUp />}
              title="Reputation Matters"
              description="Your trust score follows you everywhere and unlocks premium opportunities."
              color="success"
            />
            <FeatureCard
              icon={<Scale />}
              title="Fair & Transparent"
              description="All dispute resolutions are public, creating accountability for all parties."
              color="warning"
            />
            <FeatureCard
              icon={<Award />}
              title="Progressive Rewards"
              description="Higher trust scores unlock exclusive bounties with better pay and reputation gains."
              color="primary"
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-gradient-primary">Works</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <StepCard
              step="01"
              title="Join or Form a Guild"
              description="Connect with other hunters to pool reputation and resources. Guilds provide support, shared treasury, and collective bargaining power."
              icon={<Users />}
            />
            <StepCard
              step="02"
              title="Stake to Accept Bounties"
              description="Guilds stake funds to accept bounties. The stake is held in escrow and ensures both parties have skin in the game."
              icon={<Target />}
            />
            <StepCard
              step="03"
              title="Complete the Work"
              description="Deliver quality work on time. Both client and guild can track progress transparently throughout the project."
              icon={<Zap />}
            />
            <StepCard
              step="04"
              title="Build Trust Score"
              description="Successful completions increase your trust score, unlocking better opportunities and higher-value bounties."
              icon={<TrendingUp />}
            />
            <StepCard
              step="05"
              title="Fair Dispute Resolution"
              description="If issues arise, a three-tier system (negotiation → AI analysis → guild tribunal) ensures fair outcomes."
              icon={<Scale />}
            />
          </div>
        </section>

        {/* Trust Tiers */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-primary">Trust Tiers</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Progress through ranks as you build reputation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <TierCard rank="Bronze" range="0-70%" color="from-orange-800 to-orange-600" />
            <TierCard rank="Silver" range="70-85%" color="from-gray-400 to-gray-300" />
            <TierCard rank="Gold" range="85-95%" color="from-yellow-600 to-yellow-400" />
            <TierCard rank="Platinum" range="95-100%" color="from-cyan-400 to-primary" />
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card className="relative overflow-hidden border-gradient-primary p-16 holographic">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />
            
            <div className="relative z-10 text-center space-y-6">
              <Sparkles className="h-20 w-20 text-primary mx-auto animate-pulse-glow" />
              <h2 className="text-5xl md:text-6xl font-bold font-heading">
                Ready to <span className="text-gradient-primary">Join?</span>
              </h2>
              <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
                Start building trust. Unlock opportunities. Earn what you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" asChild className="glow-primary text-xl h-16 px-12">
                  <Link href="/register">
                    Get Started Now
                    <Zap className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-2 border-primary/30 text-xl h-16 px-12">
                  <Link href="/guilds">
                    Explore Guilds
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  const colorClasses = {
    primary: 'text-primary border-primary/30 bg-primary/5',
    secondary: 'text-secondary border-secondary/30 bg-secondary/5',
    accent: 'text-accent border-accent/30 bg-accent/5',
    success: 'text-success border-success/30 bg-success/5',
    warning: 'text-warning border-warning/30 bg-warning/5',
  };

  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <Card className="glass-strong border-2 border-primary/20 hover:border-primary/40 p-6 group transition-all hover:-translate-y-1">
      <div className={`inline-flex p-4 rounded-xl mb-4 ${classes} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
}

function StepCard({ step, title, description, icon }: { step: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="glass-strong border-2 border-primary/30 p-8 relative overflow-hidden group hover:border-primary/50 transition-all">
      {/* <div className="absolute top-0 right-0 text-9xl font-black text-primary/5 font-heading">
        {step}
      </div> */}
      <div className="relative z-10 flex gap-6">
        <div className="shrink-0">
          <div className="w-16 h-16 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
}

function TierCard({ rank, range, color }: { rank: string; range: string; color: string }) {
  return (
    <Card className={`glass-strong border-2 border-primary/30 p-6 text-center group hover:scale-105 transition-transform`}>
      <div className={`w-20 h-20 rounded-full bg-linear-to-br ${color} mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white shadow-lg`}>
        {rank[0]}
      </div>
      <h3 className="text-2xl font-bold mb-2">{rank}</h3>
      <p className="text-muted-foreground">{range}</p>
    </Card>
  );
}
