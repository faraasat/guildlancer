'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="relative z-10 max-w-2xl w-full">
        <Card className="glass-strong border-2 border-destructive/30 p-12 text-center military-corners">
          {/* Icon */}
          <div className="relative mb-8">
            <AlertTriangle className="h-24 w-24 text-destructive mx-auto animate-pulse-glow" />
            <div className="absolute inset-0 blur-xl bg-destructive/30 animate-glow-pulse" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">
            <span className="text-gradient-accent">System Error</span>
          </h1>

          {/* Message */}
          <p className="text-xl text-muted-foreground mb-2">
            Something went wrong!
          </p>
          <p className="text-sm text-muted-foreground/70 mb-8">
            An unexpected error occurred. Please try again or return to the homepage.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 glass rounded-lg border border-destructive/20 text-left">
              <p className="text-xs text-muted-foreground mb-2 font-mono">Error Details:</p>
              <p className="text-sm text-destructive font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              size="lg"
              className="glow-primary military-corners"
            >
              <RefreshCcw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-accent/30 military-corners"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Return Home
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
