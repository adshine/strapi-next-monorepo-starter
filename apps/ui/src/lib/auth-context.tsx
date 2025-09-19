'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthModal } from '@/components/auth/auth-modal';
import { clearMockUser, getMockUser, type User } from '@/lib/mock-data';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  showAuthModal: (mode?: 'login' | 'signup' | 'forgot-password') => void;
  logout: () => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot-password'>('login');

  // Load user on mount
  useEffect(() => {
    const loadedUser = getMockUser();
    setUser(loadedUser);
  }, []);

  const showAuthModal = (mode: 'login' | 'signup' | 'forgot-password' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const logout = () => {
    clearMockUser();
    setUser(null);
  };

  const refreshUser = () => {
    const updatedUser = getMockUser();
    setUser(updatedUser);
  };

  const handleAuthSuccess = () => {
    refreshUser();
    // You could redirect to intended page here
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        showAuthModal,
        logout,
        refreshUser,
      }}
    >
      {children}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </AuthContext.Provider>
  );
}
