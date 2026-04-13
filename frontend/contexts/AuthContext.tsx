'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Post } from '@/utils/apiService';

export interface AuthUser {
  email: string;
  name: string;
  picture?: string;
  googleSub: string;
  employeeId: number | null;
  role: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithPin: (pin: string) => Promise<void>;
  logout: () => void;
  isManager: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const response = await Post('/api/auth/google', { idToken });
    const { accessToken, user: userData } = response;
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  const loginWithPin = useCallback(async (pin: string) => {
    const response = await Post('/api/auth/pin', { pin });
    const { accessToken, user: userData } = response;
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const isManager = user?.role?.toLowerCase() === 'manager';
  const isEmployee = !!user?.employeeId;

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithGoogle, loginWithPin, logout, isManager, isEmployee }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
