'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserSummary, LoginRequest, RegisterRequest } from '@/types';
import { api, getStoredToken, setStoredToken } from '@/lib/api';

interface AuthContextType {
  user: UserSummary | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (req: LoginRequest) => Promise<UserSummary>;
  demoLogin: () => Promise<UserSummary>;
  register: (req: RegisterRequest) => Promise<UserSummary>;
  logout: () => void;
  updateGoal: (dailyGoalXp: number) => Promise<UserSummary>;
  refreshUser: () => Promise<void>;
  setUser: (user: UserSummary | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const summary = await api.getUserSummary();
      setUser(summary);
    } catch (err) {
      console.error('Failed to refresh user summary:', err);
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      const savedToken = getStoredToken();
      if (savedToken) {
        setToken(savedToken);
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.warn('Saved token invalid or expired, resetting session');
          setStoredToken(null);
          setToken(null);
          setUser(null);
        }
      } else {
        // Fetch default/guest summary
        try {
          const summary = await api.getUserSummary();
          setUser(summary);
        } catch (err) {
          console.warn('Could not fetch initial summary', err);
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const login = async (req: LoginRequest): Promise<UserSummary> => {
    setIsLoading(true);
    try {
      const res = await api.login(req);
      setStoredToken(res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (): Promise<UserSummary> => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin();
      setStoredToken(res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (req: RegisterRequest): Promise<UserSummary> => {
    setIsLoading(true);
    try {
      const res = await api.register(req);
      setStoredToken(res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    api.logout().catch(() => {});
  };

  const updateGoal = async (dailyGoalXp: number): Promise<UserSummary> => {
    const updated = await api.updateDailyGoal(dailyGoalXp);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        demoLogin,
        register,
        logout,
        updateGoal,
        refreshUser,
        setUser,
      }}
    >
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
