'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles, Zap, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { Avatar } from '@/components/ui/avatar';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const navLinks = [
    { href: '/guilds', label: 'Guilds' },
    { href: '/hunters', label: 'Hunters' },
    { href: '/bounties', label: 'Bounties' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-primary/20 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary relative z-10" />
              <div className="absolute inset-0 blur-xl bg-primary/50 animate-pulse-glow" />
            </div>
            <span className="text-2xl font-black text-gradient-primary font-heading">
              GuildLancer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <Button variant="ghost" className="border border-primary/20 hover:border-primary/40 gap-2">
                    <div className="text-2xl">{session.user.avatar || '👤'}</div>
                    <span className="max-w-[100px] truncate">{session.user.username}</span>
                  </Button>
                  <div className="absolute right-0 top-full mt-2 w-48 glass-strong border-2 border-primary/30 rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-destructive/10 rounded transition-colors w-full text-left text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="border border-primary/20 hover:border-primary/40">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="glow-primary border border-primary/50">
                  <Link href="/register" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
              
              {isAuthenticated && session?.user && (
                <Link
                  href="/dashboard"
                  className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all py-3 px-4 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <div className="flex flex-col gap-2 pt-3 border-t border-primary/20">
                {isAuthenticated && session?.user ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
                      <div className="text-2xl">{session.user.avatar || '👤'}</div>
                      <span className="font-medium">{session.user.username}</span>
                    </div>
                    <Button variant="outline" asChild className="border-primary/30">
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      variant="outline"
                      className="border-destructive/30 text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="border-primary/30">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="glow-primary">
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                        <Zap className="h-4 w-4" />
                        Enter Network
                      </Link>
                    </Button>
                  </>
                )}
            {mobileMenuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary/20">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all py-3 px-4 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-primary/20">
                <Button variant="outline" asChild className="border-primary/30">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="glow-primary">
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4" />
                    Enter Network
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
