'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Shield, Mail, Lock, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setError('');

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-strong border-2 border-primary/40 mb-4">
              <Shield className="h-10 w-10 text-primary animate-pulse-glow" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-heading">
              <span className="text-gradient-primary">Welcome Back</span>
            </h1>
            <p className="text-muted-foreground">
              Enter the network and continue your journey
            </p>
          </div>

          {/* Login Form */}
          <Card className="glass-strong border-2 border-primary/30 p-8 military-corners">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="glass p-4 rounded-lg border border-destructive/30 bg-destructive/10">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hunter@guildlancer.io"
                  className="bg-background/50 border-primary/30 focus:border-primary"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-background/50 border-primary/30 focus:border-primary"
                  {...register('password')}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full glow-primary text-lg h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entering Network...
                  </>
                ) : (
                  <>
                    Enter Network
                    <Zap className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                  Register now
                </Link>
              </p>
            </div>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Your data is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
