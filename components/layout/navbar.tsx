'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles, Zap, User, LogOut, LayoutDashboard, TrendingUp, Clock, Wallet, Users, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 border-b border-border/60 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-black text-foreground font-heading">
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
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && session?.user ? (
              <>
                <div className="relative group">
                  <Button variant="ghost" className="border border-primary/20 hover:border-primary/40 gap-2">
                    <div className="text-2xl">{session.user.avatar || '👤'}</div>
                    <span className="max-w-25 truncate">{session.user.username}</span>
                  </Button>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card/95 border border-border/60 rounded-lg p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/analytics"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Analytics
                    </Link>
                    <Link
                      href="/history"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors"
                    >
                      <Clock className="h-4 w-4" />
                      History
                    </Link>
                    <Link
                      href="/payments"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors"
                    >
                      <Wallet className="h-4 w-4" />
                      Payments
                    </Link>
                    <Link
                      href="/guild"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors"
                    >
                      <Users className="h-4 w-4" />
                      Guild
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Messages
                    </Link>
                    <div className="my-1 border-t border-border/60" />
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <div className="my-1 border-t border-border/60" />
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-warning/10 rounded transition-colors w-full text-left text-warning"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="border border-border/60 hover:border-primary/60">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="border border-primary/50 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/register" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Enter Network
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
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
              
              {isAuthenticated && session?.user && (
                <>
                  <div className="border-t border-primary/20 pt-3" />
                  <Link
                    href="/dashboard"
                    className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all py-3 px-4 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/analytics"
                    className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all py-3 px-4 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/history"
                    className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all py-3 px-4 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    History
                  </Link>
                  <Link
                    href="/payments"
                    className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all py-3 px-4 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Payments
                  </Link>
                  <Link
                    href="/guild"
                    className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all py-3 px-4 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Guild
                  </Link>
                  <Link
                    href="/messages"
                    className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all py-3 px-4 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                </>
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
                    <Button variant="outline" asChild className="border-primary/30">
                      <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
