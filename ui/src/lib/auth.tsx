'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type Role = 'admin' | 'customer';

interface AuthUser {
  username: string;
  role: Role;
  displayName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  isCustomer: boolean;
  isAuthenticated: boolean;
}

const CREDENTIALS: Record<string, { password: string; role: Role; displayName: string }> = {
  admin: { password: 'admin@2024', role: 'admin', displayName: 'Malinda Gamage' },
  customer: { password: 'cust@2024', role: 'customer', displayName: 'Customer' },
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gvr-auth');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const cred = CREDENTIALS[username.toLowerCase()];
    if (!cred || cred.password !== password) return false;
    const authUser: AuthUser = { username, role: cred.role, displayName: cred.displayName };
    setUser(authUser);
    localStorage.setItem('gvr-auth', JSON.stringify(authUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('gvr-auth');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isCustomer: user?.role === 'customer',
      isAuthenticated: user !== null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
