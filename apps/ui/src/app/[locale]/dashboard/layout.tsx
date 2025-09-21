"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/lib/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      // Redirect to home and show auth modal if not logged in
      router.push("/")
      // Note: showAuthModal would be called here in a more complete implementation
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="bg-primary flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-text-primary mb-4 text-xl font-semibold">
            Please sign in to access your dashboard
          </h2>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-accent-primary text-text-inverse hover:bg-accent-primary/90 rounded-lg px-6 py-2"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary min-h-screen">
      {/* Dashboard Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
