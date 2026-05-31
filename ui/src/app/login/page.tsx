'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Car, Shield, User, Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectTo = searchParams.get('redirect') || '/';
  const roleHint = searchParams.get('role') || '';
  const isUnauthorized = searchParams.get('error') === 'unauthorized';

  const [tab, setTab] = useState<'admin' | 'customer'>(roleHint === 'admin' ? 'admin' : 'customer');
  const [username, setUsername] = useState(roleHint === 'admin' ? 'admin' : 'customer');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(isUnauthorized ? 'You do not have permission to access that page.' : '');
  const [loading, setLoading] = useState(false);

  function handleTabChange(t: 'admin' | 'customer') {
    setTab(t);
    setUsername(t === 'admin' ? 'admin' : 'customer');
    setPassword('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 400));
    const ok = login(username, password);
    setLoading(false);
    if (ok) {
      router.push(tab === 'admin' ? '/admin' : (redirectTo === '/login' ? '/' : redirectTo));
    } else {
      setError('Invalid username or password.');
    }
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xl leading-none">Gamage</p>
            <p className="text-blue-400 text-xs font-semibold tracking-widest">VEHICLE RENTAL</p>
          </div>
        </Link>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-8">
          <h1 className="text-2xl font-black text-white mb-1">Sign In</h1>
          <p className="text-slate-400 text-sm mb-6">Select your role and enter credentials</p>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-800/60 mb-6">
            {([['customer', 'Customer', User], ['admin', 'Admin', Shield]] as const).map(([role, label, Icon]) => (
              <button
                key={role}
                onClick={() => handleTabChange(role)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === role
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Demo hint */}
          <div className="mb-5 rounded-xl bg-blue-600/10 border border-blue-600/20 px-4 py-3 text-xs text-blue-300">
            <Lock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Demo — <strong>{tab}</strong> / <strong>{tab === 'admin' ? 'admin@2024' : 'cust@2024'}</strong>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in…
                </span>
              ) : `Sign in as ${tab === 'admin' ? 'Admin' : 'Customer'}`}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-5">
            <Link href="/" className="hover:text-slate-300 transition-colors">← Back to home</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
