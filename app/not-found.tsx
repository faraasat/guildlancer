import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="relative z-10 max-w-2xl w-full">
        <Card className="glass-strong border-2 border-primary/30 p-12 text-center military-corners">
          {/* Icon */}
          <div className="relative mb-8">
            <FileQuestion className="h-24 w-24 text-primary mx-auto animate-pulse-glow" />
            <div className="absolute inset-0 blur-xl bg-primary/30 animate-glow-pulse" />
          </div>

          {/* 404 Code */}
          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-black font-heading text-gradient-primary mb-2">
              404
            </h1>
            <div className="h-1 w-32 mx-auto bg-linear-to-r from-transparent via-primary to-transparent" />
          </div>

          {/* Message */}
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground/70 mb-8">
            It might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="glow-primary military-corners"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-accent/30 military-corners"
            >
              <Link href="/guilds">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Browse Guilds
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
