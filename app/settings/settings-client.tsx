'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Lock, Bell, Shield, Palette, Eye, LogOut, Save, Loader2, X, Plus } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SettingsClientProps {
  user: {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    rank: string;
    trustScore: number;
  };
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile state
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>(['JavaScript', 'React', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  // Account state
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setMessage(null);

      // TODO: API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      router.refresh();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill) && skills.length < 10) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">
              <span className="text-gradient-primary">Settings</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your account preferences and security settings
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`glass p-4 rounded-lg border mb-6 ${
              message.type === 'success' 
                ? 'border-success/30 bg-success/10' 
                : 'border-destructive/30 bg-destructive/10'
            }`}>
              <p className={`text-sm ${message.type === 'success' ? 'text-success' : 'text-destructive'}`}>
                {message.text}
              </p>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="glass-strong border border-primary/30 p-1 grid grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20">
                <User className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-primary/20">
                <Mail className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary/20">
                <Lock className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20">
                <Bell className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-primary/20">
                <Eye className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="display" className="data-[state=active]:bg-primary/20">
                <Palette className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Display</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="glass-strong border-2 border-primary/30 p-8">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Avatar</label>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{user.avatar || '👤'}</div>
                      <Button variant="outline" className="border-primary/30">
                        Change Avatar
                      </Button>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-background/50 border-primary/30"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="bg-background/50 border-primary/30 min-h-[120px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Skills (max 10)</label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add a skill..."
                        className="bg-background/50 border-primary/30"
                        disabled={skills.length >= 10}
                      />
                      <Button
                        onClick={handleAddSkill}
                        variant="outline"
                        className="border-primary/30"
                        disabled={skills.length >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="text-primary border-primary/40 bg-primary/10 px-3 py-1 cursor-pointer"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          {skill}
                          <X className="ml-2 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats Display */}
                  <div className="pt-6 border-t border-primary/20">
                    <h3 className="text-lg font-bold mb-4">Your Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Rank</div>
                        <div className="text-xl font-bold text-primary">{user.rank}</div>
                      </div>
                      <div className="glass p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Trust Score</div>
                        <div className="text-xl font-bold text-success">{user.trustScore}%</div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="glow-primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <Card className="glass-strong border-2 border-primary/30 p-8">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-primary/30"
                    />
                  </div>

                  <div className="pt-6 border-t border-primary/20">
                    <h3 className="text-lg font-bold mb-4">Change Password</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="currentPassword" className="text-sm font-medium">
                          Current Password
                        </label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-background/50 border-primary/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium">
                          New Password
                        </label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-background/50 border-primary/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm New Password
                        </label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-background/50 border-primary/30"
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="glow-primary">
                    <Save className="mr-2 h-4 w-4" />
                    Update Account
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="glass-strong border-2 border-primary/30 p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Security Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="glass p-6 rounded-lg border border-success/30">
                    <h3 className="font-bold mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" className="border-success/30">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="glass p-6 rounded-lg border border-primary/30">
                    <h3 className="font-bold mb-2">Active Sessions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage devices where you're currently logged in
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded">
                        <div>
                          <div className="font-medium">Current Session</div>
                          <div className="text-xs text-muted-foreground">macOS • Chrome • San Francisco</div>
                        </div>
                        <Badge className="bg-success/10 text-success border-success/30">Active</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-destructive/20">
                    <h3 className="font-bold mb-2 text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      These actions are irreversible
                    </p>
                    <Button onClick={handleSignOut} variant="outline" className="border-destructive/30 text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="glass-strong border-2 border-primary/30 p-8">
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <p className="text-muted-foreground">Notification settings coming soon...</p>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card className="glass-strong border-2 border-primary/30 p-8">
                <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>
                <p className="text-muted-foreground">Privacy controls coming soon...</p>
              </Card>
            </TabsContent>

            {/* Display Tab */}
            <TabsContent value="display">
              <Card className="glass-strong border-2 border-primary/30 p-8">
                <h2 className="text-2xl font-bold mb-6">Display Preferences</h2>
                <p className="text-muted-foreground">Display customization coming soon...</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
