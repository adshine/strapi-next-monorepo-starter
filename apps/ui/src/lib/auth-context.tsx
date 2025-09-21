"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

import type { User } from "@/types/auth"

import { AuthModal } from "@/components/auth/auth-modal"

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  showAuthModal: (mode?: "login" | "signup" | "forgot-password") => void // eslint-disable-line @typescript-eslint/no-unused-vars
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<
    "login" | "signup" | "forgot-password"
  >("login")

  // Load user on mount
  useEffect(() => {
    // Check for authenticated user from session/localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
      }
    }
  }, [])

  const showAuthModal = (
    mode: "login" | "signup" | "forgot-password" = "login"
  ) => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const refreshUser = () => {
    // Refresh user from API or session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to refresh user:", error)
      }
    }
  }

  const handleAuthSuccess = () => {
    refreshUser()
    // You could redirect to intended page here
  }

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
  )
}
