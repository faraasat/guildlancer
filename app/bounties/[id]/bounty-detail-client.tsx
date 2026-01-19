'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Target, Shield, Zap, Clock, Users, Star, 
  Award, AlertCircle, CheckCircle2, FileText, Send, 
  ChevronRight, Bookmark, Share2, MoreVertical, Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';

interface BountyDetailClientProps {
  bounty: any;
  user: any;
}

export default function BountyDetailClient({ bounty, user }: BountyDetailClientProps) {
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const daysLeft = Math.ceil((new Date(bounty.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const isAssigned = bounty.assignedHunterIds?.some((h: any) => 
    (h._id || h).toString() === user?.id
  );

  const canSubmit = isAssigned && bounty.status === 'InProgress';
  
  const handleApply = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!user.guildId) {
      setToast({ message: 'You must be in a guild and a Guild Master to accept missions.', type: 'error' });
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bounties/${bounty._id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: user.guildId })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply');
      
      setToast({ message: 'Successfully applied to bounty!', type: 'success' });
      // Refresh page or update state
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      {/* Background patterns could go here */}
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/bounties" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Marketplace
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="glass hover:bg-white/10">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="glass hover:bg-white/10">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-strong border-2 border-primary/30 p-8 military-corners overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target className="h-32 w-32" />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="outline" className="border-secondary/50 bg-secondary/10 text-secondary">
                    {bounty.category}
                  </Badge>
                  <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary uppercase tracking-tighter">
                    {bounty.urgency} URGENCY
                  </Badge>
                  {bounty.status === 'Open' && (
                    <Badge className="bg-success/20 text-success border-success/40 ml-auto">
                      ● ACTIVE
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-black font-heading mb-6 tracking-tight">
                  {bounty.title}
                </h1>

                <div className="flex flex-wrap gap-6 mb-8 text-sm text-muted-foreground border-y border-primary/10 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Posted {new Date(bounty.postedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Deadline: {new Date(bounty.deadline).toLocaleDateString()} ({daysLeft} days left)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{bounty.assignedHunterIds?.length || 0} Hunters Assigned</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none mb-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Mission Briefing
                  </h3>
                  <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {bounty.description}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-secondary" />
                    Requirements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RequirementItem 
                      icon={<Shield className="h-4 w-4" />} 
                      label="Minimum Hunter Rank" 
                      value={bounty.minHunterRank} 
                    />
                    <RequirementItem 
                      icon={<Star className="h-4 w-4" />} 
                      label="Minimum Guild Trust" 
                      value={`${bounty.minGuildTrust} / 1000`} 
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-3">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {bounty.requiredSkills?.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="glass border-primary/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Evidence & Submission Tab */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full ${isAssigned ? 'grid-cols-3' : 'grid-cols-2'} glass p-1`}>
                <TabsTrigger value="overview">Evidence Requirements</TabsTrigger>
                <TabsTrigger value="activity">Updates & Activity</TabsTrigger>
                {isAssigned && <TabsTrigger value="submit">Submit Evidence</TabsTrigger>}
              </TabsList>
              <TabsContent value="overview">
                <Card className="glass-strong border-2 border-primary/20 p-6 mt-4">
                  <h4 className="font-bold mb-4">Proof of Completion Requirements</h4>
                  <div className="text-muted-foreground text-sm leading-relaxed p-4 bg-background/40 rounded-lg border border-primary/10">
                    {bounty.evidenceRequirements || "Detailed report of findings and action taken. Include links to relevant pull requests or commits if applicable."}
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="activity">
                <Card className="glass-strong border-2 border-primary/20 p-6 mt-4 flex items-center justify-center min-h-32">
                  <p className="text-muted-foreground text-sm italic">No updates recorded yet for this mission.</p>
                </Card>
              </TabsContent>
              {isAssigned && (
                <TabsContent value="submit">
                  <Card className="glass-strong border-2 border-primary/20 p-6 mt-4">
                    <h4 className="font-bold mb-4">Submit Mission Evidence</h4>
                    {bounty.status === 'InProgress' ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Submission Details</label>
                          <textarea 
                            className="w-full bg-background/50 border border-primary/20 rounded-lg p-3 text-sm min-h-32 focus:border-primary/50 outline-none"
                            placeholder="Describe what you've completed..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Evidence Links (GitHub, Demo, etc.)</label>
                          <input 
                            type="text"
                            className="w-full bg-background/50 border border-primary/20 rounded-lg p-3 text-sm focus:border-primary/50 outline-none"
                            placeholder="https://..."
                          />
                        </div>
                        <Button className="w-full glow-primary">
                          <Send className="mr-2 h-4 w-4" />
                          Submit for Review
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground italic">
                        {bounty.status === 'UnderReview' ? 'Mission is currently under review.' : 
                         bounty.status === 'Completed' ? 'Mission has been completed successfully.' : 
                         'Mission must be accepted before submission.'}
                      </div>
                    )}
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="space-y-6">
            {/* Reward Card */}
            <Card className="glass-strong border-2 border-primary/50 military-corners p-8 text-center relative overflow-hidden holographic">
              <div className="relative z-10">
                <div className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Total Reward</div>
                <div className="text-6xl font-black text-gradient-primary mb-4">
                  {bounty.rewardCredits.toLocaleString()}
                  <span className="text-2xl ml-1">C</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-success mb-6">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">+{bounty.reputationBonus || 50} Rep Bonus</span>
                </div>
                
                <div className="space-y-3 pt-6 border-t border-primary/20">
                  {canSubmit ? (
                    <Button 
                      className="w-full h-14 text-lg font-bold bg-success/20 text-success border-2 border-success/50 hover:bg-success/30" 
                      onClick={() => setActiveTab('submit')}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      SUBMIT MISSION EVIDENCE
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-14 text-lg font-bold glow-primary" 
                      onClick={handleApply}
                      disabled={submitting || bounty.status !== 'Open'}
                    >
                      {submitting ? 'PROCESSING...' : 
                       bounty.status === 'Open' ? 'ACCEPT MISSION' : 
                       bounty.status === 'InProgress' ? 'MISSION IN PROGRESS' : 
                       bounty.status === 'Completed' ? 'MISSION COMPLETE' : 'MISSION UNAVAILABLE'}
                    </Button>
                  )}
                  <p className="text-[10px] text-muted-foreground uppercase">
                    {bounty.status === 'Open' ? `Requires ${bounty.guildStakeRequired.toLocaleString()} C Guild Stake` : `Mission Status: ${bounty.status}`}
                  </p>
                </div>
              </div>
            </Card>

            {/* Client Info */}
            <Card className="glass-strong border-2 border-primary/20 p-6 military-corners">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Contracting Client</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass border border-primary/30 flex items-center justify-center text-xl">
                  {bounty.clientId?.avatar || bounty.clientId?.username?.[0] || 'U'}
                </div>
                <div>
                  <h5 className="font-bold text-lg">{bounty.clientId?.username || 'Anonymous'}</h5>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-warning fill-warning" />
                    <span className="text-xs text-muted-foreground">Client Score: {bounty.clientId?.trustScore || 100}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between">
                <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                  <Link href={`/profile/${bounty.clientId?._id}`}>View User Dossier</Link>
                </Button>
              </div>
            </Card>

            {/* Safety Notice */}
            <Card className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-sm font-bold mb-1">Nexora Escrow Protected</h4>
                  <p className="text-xs text-muted-foreground">
                    Rewards are held in escrow. Funds are released automatically upon verification of proof of work.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 military-corners border-2 ${
          toast.type === 'success' ? 'bg-success/20 border-success/50 text-success' : 'bg-destructive/20 border-destructive/50 text-destructive'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-bold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100 italic text-xs">DISMISS</button>
        </div>
      )}
    </div>
  );
}

function RequirementItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 glass-strong rounded-lg border border-primary/10">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase leading-none mb-1">{label}</p>
        <p className="font-bold text-sm">{value}</p>
      </div>
    </div>
  );
}
