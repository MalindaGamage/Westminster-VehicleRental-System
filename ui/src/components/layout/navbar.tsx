'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Car, Shield, Menu, X, Zap, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', public: true },
    { href: '/customer', label: 'Browse Vehicles', public: true },
    ...(isAuthenticated ? [{ href: '/reservations', label: 'My Reservations', public: false }] : []),
    ...(isAdmin ? [{ href: '/admin', label: 'Admin Portal', public: false }] : []),
  ];

  function handleLogout() {
    logout();
    setProfileOpen(false);
    router.push('/');
  }

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-40 border-b transition-all duration-300',
        scrolled
          ? 'border-slate-700/60 bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-black/20'
          : 'border-slate-700/30 bg-slate-950/70 backdrop-blur-md'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30"
            >
              <Car className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-base">Gamage</span>
              <span className="text-blue-400 text-xs font-medium tracking-wider">VEHICLE RENTAL</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
                  pathname === link.href
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                {link.href === '/admin' && <Shield className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />}
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl bg-blue-600/20 border border-blue-600/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700/60 text-slate-200 text-sm font-medium transition-colors"
                >
                  <div className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                    isAdmin ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  )}>
                    {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  {user?.displayName}
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', profileOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-white text-sm font-semibold">{user?.displayName}</p>
                        <p className={cn('text-xs font-medium capitalize mt-0.5', isAdmin ? 'text-amber-400' : 'text-blue-400')}>
                          {user?.role} account
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
                  <Zap className="w-3 h-3" />
                  <span>Fleet Ready</span>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/customer">Book Now</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-700/50 bg-slate-950/95 backdrop-blur-xl px-4 py-3 space-y-1 overflow-hidden"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
