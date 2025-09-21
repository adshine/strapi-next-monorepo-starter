"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Download, Heart, Layers, Menu, User, X } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/styles"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user, showAuthModal } = useAuth()

  const handleAuthClick = () => {
    showAuthModal("signup")
  }

  const { profile } = useUserProfile()
  const userPlan = profile?.plan

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[var(--bg-primary)]/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold text-[var(--text-primary)] sm:inline-block">
              FramerDojo
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/templates"
            className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            Dashboard
          </Link>
        </nav>

        {/* User Actions - Desktop */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* User info */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Plan indicator */}
                {userPlan && (
                  <div className="hidden items-center space-x-2 rounded-full bg-[var(--bg-elevated)] px-3 py-1 text-xs md:flex">
                    <span className="font-medium text-[var(--accent-primary)]">
                      {userPlan.name}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {userPlan.dailyDownloads === -1
                        ? "∞ templates"
                        : `${userPlan.dailyDownloads} templates`}
                    </span>
                  </div>
                )}

                {/* Quick actions */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  onClick={() => router.push("/dashboard/favorites")}
                >
                  <Heart className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  onClick={() => router.push("/dashboard/remixes")}
                >
                  <Layers className="h-4 w-4" />
                </Button>

                {/* User menu trigger */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  onClick={() => router.push("/dashboard")}
                >
                  <User className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={handleAuthClick}>
                  Sign In
                </Button>
                <Button onClick={handleAuthClick}>Get Started</Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t bg-[var(--bg-primary)] p-4 md:hidden">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/templates"
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>

            {user ? (
              <div className="space-y-2 border-t pt-3">
                {userPlan && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--accent-primary)]">
                      {userPlan.name}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {userPlan.dailyDownloads === -1
                        ? "∞ templates"
                        : `${userPlan.dailyDownloads} templates`}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push("/dashboard/favorites")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push("/dashboard/remixes")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  My Templates
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 border-t pt-3">
                <Button variant="outline" onClick={handleAuthClick}>
                  Sign In
                </Button>
                <Button onClick={handleAuthClick}>Get Started</Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
