'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, Role } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export function RequireAuth({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}&role=${role}`);
    } else if (user?.role !== role) {
      router.replace('/login?error=unauthorized');
    }
  }, [isAuthenticated, user, role, router]);

  if (!isAuthenticated || user?.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return <>{children}</>;
}
