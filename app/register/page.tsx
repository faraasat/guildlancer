'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Shield, Mail, Lock, User, Sparkles, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Registration failed');
        return;
      }

      // Redirect to login with success message
      router.push('/login?registered=true');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-strong border-2 border-secondary/40 mb-4">
              <Sparkles className="h-10 w-10 text-secondary animate-pulse-glow" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-heading">
              <span className="text-gradient-primary">Join the Network</span>
            </h1>
            <p className="text-muted-foreground">
              Start your journey as a trusted hunter
            </p>
          </div>

          {/* Registration Form */}
          <Card className="glass-strong border-2 border-secondary/30 p-8 military-corners">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="glass p-4 rounded-lg border border-destructive/30 bg-destructive/10">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary" />
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="CyberHunter"
                  className="bg-background/50 border-secondary/30 focus:border-secondary"
                  {...register('username')}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-secondary" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hunter@guildlancer.io"
                  className="bg-background/50 border-secondary/30 focus:border-secondary"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-secondary" />
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-background/50 border-secondary/30 focus:border-secondary"
                  {...register('password')}
                  disabled={isLoading}
                />
                {password && (
                  <div className="glass p-3 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground mb-2">Password must contain:</p>
                    <PasswordCheck label="8+ characters" isValid={passwordChecks.length} />
                    <PasswordCheck label="Uppercase letter" isValid={passwordChecks.uppercase} />
                    <PasswordCheck label="Lowercase letter" isValid={passwordChecks.lowercase} />
                    <PasswordCheck label="Number" isValid={passwordChecks.number} />
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-secondary" />
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-background/50 border-secondary/30 focus:border-secondary"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full glow-primary text-lg h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <Shield className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>

            <div className="mt-6 pt-6 border-t border-secondary/20 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-secondary hover:text-secondary/80 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </Card>

          {/* Starting Bonus Notice */}
          <div className="mt-6 text-center glass p-4 rounded-lg border border-success/30">
            <p className="text-sm text-success font-medium">
              🎁 New hunters receive 1,000 credits to start their journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordCheck({ label, isValid }: { label: string; isValid: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {isValid ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
      )}
      <span className={isValid ? 'text-success' : 'text-muted-foreground'}>{label}</span>
    </div>
  );
}
