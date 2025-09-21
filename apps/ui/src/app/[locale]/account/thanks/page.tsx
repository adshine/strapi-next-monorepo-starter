"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Crown,
  Heart,
  Play,
  Star,
  Users,
} from "lucide-react"

import { plansAPI } from "@/lib/api/plans"
import { useAuth } from "@/lib/auth-context"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Confetti animation component
function ConfettiAnimation() {
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; y: number; color: string; delay: number }>
  >([])

  useEffect(() => {
    // Generate confetti pieces
    const colors = ["#5B8CFF", "#4CD0A5", "#FFC56D", "#FF6B6B", "#AA7DFF"]
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      delay: Math.random() * 2,
    }))

    setConfetti(pieces)

    // Clean up after animation
    const timer = setTimeout(() => setConfetti([]), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="animate-confetti absolute h-2 w-2 rounded-full opacity-80"
          style={{
            left: `${piece.x}vw`,
            top: `${piece.y}vh`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animation: "confetti-fall 3s ease-in-out forwards",
          }}
        />
      ))}
    </div>
  )
}

export default function ThanksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()

  const [showConfetti, setShowConfetti] = useState(true)
  const [purchasedPlan, setPurchasedPlan] = useState<any>(null)

  // Extract success parameters
  const sessionId = searchParams.get("session_id") // eslint-disable-line @typescript-eslint/no-unused-vars
  const planId = searchParams.get("plan")
  const billing = searchParams.get("billing") as "month" | "year" | null
  const amount = searchParams.get("amount")

  // Fetch plan details
  useEffect(() => {
    if (profile?.plan) {
      setPurchasedPlan(profile.plan)
    } else if (planId) {
      plansAPI.getPlanById(planId).then(setPurchasedPlan)
    }
  }, [profile, planId])

  // Auto-hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (!user || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  if (!purchasedPlan && !loading) {
    router.push("/pricing")
    return null
  }

  const quickActions = [
    {
      title: "Browse Templates",
      description: "Discover and remix templates",
      href: "/templates",
      icon: Play,
      color: "bg-accent-primary hover:bg-accent-primary/90",
    },
    {
      title: "Template History",
      description: "View your recent template access",
      href: "/account",
      icon: Clock,
      color: "bg-elevated border border-border-neutral hover:bg-subtle",
    },
    {
      title: "Add Favorites",
      description: "Save templates for later",
      href: "/templates",
      icon: Heart,
      color: "bg-elevated border border-border-neutral hover:bg-subtle",
    },
  ]

  return (
    <div className="bg-primary min-h-screen">
      {showConfetti && <ConfettiAnimation />}

      {/* Success Hero */}
      <div className="relative overflow-hidden">
        <div className="from-accent-primary/10 via-primary to-accent-success/5 absolute inset-0 bg-gradient-to-br" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          {/* Success Icon */}
          <div className="bg-accent-success/20 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <CheckCircle className="text-accent-success h-12 w-12" />
          </div>

          {/* Main Message */}
          <h1 className="text-text-primary mb-4 text-4xl font-bold md:text-5xl">
            Welcome to {purchasedPlan.name}!
          </h1>

          <p className="text-text-muted mx-auto mb-6 max-w-2xl text-xl">
            Your payment was successful and your plan is now active. Start
            creating amazing websites with premium templates.
          </p>

          {/* Plan Summary */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <Badge
              variant="secondary"
              className="bg-accent-success/20 text-accent-success border-accent-success/30 px-4 py-2"
            >
              <Crown className="mr-2 h-4 w-4" />
              {purchasedPlan.name} Plan Activated
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              {billing === "year" ? "Yearly" : "Monthly"} Billing
            </Badge>
          </div>
        </div>
      </div>

      {/* Plan Benefits */}
      <div className="bg-elevated py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-text-primary mb-4 text-3xl font-bold">
              Your {purchasedPlan.name} Benefits
            </h2>
            <p className="text-text-muted text-xl">
              Everything you need to create stunning websites
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Quota Summary */}
            <Card className="bg-primary border-border-neutral">
              <CardContent className="p-6 text-center">
                <div className="bg-accent-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Play className="text-accent-primary h-6 w-6" />
                </div>
                <div className="text-text-primary mb-2 text-3xl font-bold">
                  {purchasedPlan?.dailyRemixLimit === -1 ||
                  purchasedPlan?.dailyRemixLimit === 0
                    ? "∞"
                    : purchasedPlan?.dailyRemixLimit || 0}
                </div>
                <div className="text-text-muted mb-4">Daily Remixes</div>
                <Badge
                  variant="secondary"
                  className="bg-accent-success/20 text-accent-success"
                >
                  Ready to use
                </Badge>
              </CardContent>
            </Card>

            {/* Requests */}
            <Card className="bg-primary border-border-neutral">
              <CardContent className="p-6 text-center">
                <div className="bg-accent-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Star className="text-accent-primary h-6 w-6" />
                </div>
                <div className="text-text-primary mb-2 text-3xl font-bold">
                  {purchasedPlan?.templateRequestLimit === -1 ||
                  purchasedPlan?.templateRequestLimit === 0
                    ? "∞"
                    : purchasedPlan?.templateRequestLimit || 0}
                </div>
                <div className="text-text-muted mb-4">Monthly Requests</div>
                <Badge
                  variant="secondary"
                  className="bg-accent-success/20 text-accent-success"
                >
                  Custom templates
                </Badge>
              </CardContent>
            </Card>

            {/* Priority Support */}
            <Card className="bg-primary border-border-neutral">
              <CardContent className="p-6 text-center">
                <div className="bg-accent-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Users className="text-accent-primary h-6 w-6" />
                </div>
                <div className="text-text-primary mb-2 text-xl font-bold">
                  {purchasedPlan?.hasPrioritySupport ? "Priority" : "Community"}{" "}
                  Support
                </div>
                <div className="text-text-muted mb-4">
                  {purchasedPlan?.hasPrioritySupport
                    ? "Direct access to our team"
                    : "Community forum access"}
                </div>
                <Badge
                  variant="secondary"
                  className="bg-accent-success/20 text-accent-success"
                >
                  Included
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(purchasedPlan?.features || []).map(
              (feature: string, index: number) => (
                <div
                  key={index}
                  className="bg-primary border-border-neutral flex items-center gap-3 rounded-lg border p-4"
                >
                  <CheckCircle className="text-accent-success h-5 w-5 flex-shrink-0" />
                  <span className="text-text-primary font-medium">
                    {feature}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-text-primary mb-4 text-3xl font-bold">
              Ready to get started?
            </h2>
            <p className="text-text-muted text-xl">
              Choose what you&apos;d like to do next
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="group bg-elevated border-border-neutral cursor-pointer transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${action.color} transition-colors group-hover:scale-110`}
                    >
                      <action.icon className="text-text-primary h-6 w-6" />
                    </div>
                    <h3 className="text-text-primary mb-2 text-lg font-semibold">
                      {action.title}
                    </h3>
                    <p className="text-text-muted mb-4">{action.description}</p>
                    <Button
                      variant="ghost"
                      className="group-hover:bg-accent-primary group-hover:text-text-inverse transition-colors"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-elevated border-border-neutral border-t py-16">
        <div className="mx-auto max-w-4xl px-6">
          <Card className="bg-primary border-border-neutral">
            <CardHeader>
              <CardTitle className="text-text-primary">
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-text-primary font-semibold">
                    {purchasedPlan.name} Plan
                  </div>
                  <div className="text-text-muted text-sm">
                    Billed {billing === "year" ? "annually" : "monthly"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-text-primary font-semibold">
                    ${amount || "0.00"}
                  </div>
                  <div className="text-text-muted text-sm">
                    One-time payment
                  </div>
                </div>
              </div>

              {/* Add-ons would be displayed here if implemented */}

              <div className="border-border-neutral border-t pt-4">
                <div className="text-text-muted flex items-center gap-2 text-sm">
                  <CheckCircle className="text-accent-success h-4 w-4" />
                  <span>Payment completed successfully</span>
                </div>
                <div className="text-text-muted mt-1 flex items-center gap-2 text-sm">
                  <CheckCircle className="text-accent-success h-4 w-4" />
                  <span>Plan activated immediately</span>
                </div>
                <div className="text-text-muted mt-1 flex items-center gap-2 text-sm">
                  <CheckCircle className="text-accent-success h-4 w-4" />
                  <span>Confirmation email sent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-border-neutral border-t py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="text-text-primary mb-4 text-2xl font-bold">
            Questions about your plan?
          </h3>
          <p className="text-text-muted mb-6">
            Our support team is here to help you get the most out of your Framer
            Template Platform subscription.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              variant="outline"
              className="border-border-neutral text-text-primary hover:bg-elevated"
            >
              <Link href="/support">View Help Center</Link>
            </Button>
            <Button
              asChild
              className="bg-accent-primary hover:bg-accent-primary/90 text-text-inverse"
            >
              <Link href="/account">Manage Subscription</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
