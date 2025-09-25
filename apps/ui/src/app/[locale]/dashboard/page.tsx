"use client"

import {
  Calendar,
  Clock,
  FileText,
  Heart,
  Layers,
  TrendingUp,
} from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()

  if (!user || loading) return <div className="p-8 text-center">Loading...</div>
  if (!profile)
    return <div className="p-8 text-center">Failed to load profile</div>

  const userPlan = profile.plan
  const isProOrAbove =
    userPlan && ["studio", "agency", "lifetime"].includes(userPlan.slug)

  // Calculate quota usage
  const dailyQuotaUsed = profile.monthlyRemixesUsed || 0
  const dailyQuotaLimit =
    profile?.monthlyRemixesLimit === -1
      ? 100
      : profile?.monthlyRemixesLimit || 0
  const dailyQuotaPercent =
    dailyQuotaLimit > 0 ? (dailyQuotaUsed / dailyQuotaLimit) * 100 : 0

  const monthlyRequestsUsed = profile.templateRequestsUsed || 0
  const monthlyRequestsLimit =
    userPlan?.templateRequestLimit === -1
      ? 100
      : userPlan?.templateRequestLimit || 0
  const monthlyRequestsPercent =
    monthlyRequestsLimit > 0
      ? (monthlyRequestsUsed / monthlyRequestsLimit) * 100
      : 0

  const remixesResetDate = profile.nextQuotaReset
    ? new Date(profile.nextQuotaReset)
    : new Date()
  const requestsResetDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  )

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="from-accent-primary/10 to-accent-secondary/10 border-border-neutral rounded-2xl border bg-gradient-to-r p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-text-primary mb-2 text-3xl font-bold">
              Welcome back, {user.name || user.email}!
            </h1>
            <p className="text-text-muted mb-4">
              Here&apos;s an overview of your account and activity.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className="bg-accent-primary/20 text-accent-primary border-accent-primary/30 px-4 py-2 text-sm"
            >
              {userPlan?.name} Plan
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-elevated border-border-neutral">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-accent-primary/10 rounded-lg p-3">
                <Layers className="text-accent-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-text-muted text-sm">Templates Today</p>
                <p className="text-text-primary text-2xl font-bold">
                  {dailyQuotaUsed}/
                  {dailyQuotaLimit === -1 ? "∞" : dailyQuotaLimit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-elevated border-border-neutral">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-accent-success/10 rounded-lg p-3">
                <FileText className="text-accent-success h-6 w-6" />
              </div>
              <div>
                <p className="text-text-muted text-sm">Requests This Month</p>
                <p className="text-text-primary text-2xl font-bold">
                  {monthlyRequestsUsed}/
                  {monthlyRequestsLimit === -1 ? "∞" : monthlyRequestsLimit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-elevated border-border-neutral">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-accent-warning/10 rounded-lg p-3">
                <Heart className="text-accent-warning h-6 w-6" />
              </div>
              <div>
                <p className="text-text-muted text-sm">Favorites</p>
                <p className="text-text-primary text-2xl font-bold">
                  {profile.favorites?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-elevated border-border-neutral">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-accent-secondary/10 rounded-lg p-3">
                <TrendingUp className="text-accent-secondary h-6 w-6" />
              </div>
              <div>
                <p className="text-text-muted text-sm">Plan Status</p>
                <p className="text-text-primary text-2xl font-bold">
                  {profile.subscriptionState === "active"
                    ? "Active"
                    : profile.subscriptionState}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Daily Templates */}
        <Card className="bg-elevated border-border-neutral">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Layers className="text-accent-primary h-5 w-5" />
              <span>Daily Template Quota</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-sm">
                {dailyQuotaUsed} of{" "}
                {dailyQuotaLimit === -1 ? "Unlimited" : dailyQuotaLimit}{" "}
                templates accessed
              </span>
              <span className="text-text-muted text-sm">
                {dailyQuotaLimit === -1
                  ? "∞"
                  : Math.max(0, dailyQuotaLimit - dailyQuotaUsed)}{" "}
                remaining
              </span>
            </div>

            {dailyQuotaLimit !== -1 && (
              <Progress
                value={dailyQuotaPercent}
                className="h-3"
                // Use color based on usage level
                style={
                  {
                    "--progress-bg":
                      dailyQuotaPercent > 90
                        ? "hsl(var(--accent-danger))"
                        : dailyQuotaPercent > 70
                          ? "hsl(var(--accent-warning))"
                          : "hsl(var(--accent-primary))",
                  } as React.CSSProperties
                }
              />
            )}

            <div className="text-text-muted flex items-center space-x-2 text-xs">
              <Clock className="h-4 w-4" />
              <span>
                Resets in{" "}
                {Math.max(
                  0,
                  Math.floor(
                    (remixesResetDate.getTime() - Date.now()) / (1000 * 60 * 60)
                  )
                )}{" "}
                hours
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Requests */}
        <Card className="bg-elevated border-border-neutral">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="text-accent-success h-5 w-5" />
              <span>Monthly Request Quota</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-sm">
                {monthlyRequestsUsed} of{" "}
                {monthlyRequestsLimit === -1
                  ? "Unlimited"
                  : monthlyRequestsLimit}{" "}
                requests used
              </span>
              <span className="text-text-muted text-sm">
                {monthlyRequestsLimit === -1
                  ? "∞"
                  : Math.max(
                      0,
                      monthlyRequestsLimit - monthlyRequestsUsed
                    )}{" "}
                remaining
              </span>
            </div>

            {monthlyRequestsLimit !== -1 && (
              <Progress
                value={monthlyRequestsPercent}
                className="h-3"
                style={
                  {
                    "--progress-bg":
                      monthlyRequestsPercent > 90
                        ? "hsl(var(--accent-danger))"
                        : monthlyRequestsPercent > 70
                          ? "hsl(var(--accent-warning))"
                          : "hsl(var(--accent-primary))",
                  } as React.CSSProperties
                }
              />
            )}

            <div className="text-text-muted flex items-center space-x-2 text-xs">
              <Calendar className="h-4 w-4" />
              <span>Resets on {requestsResetDate.toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-elevated border-border-neutral">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center space-x-2" asChild>
              <a href="/templates">
                <Layers className="h-4 w-4" />
                <span>Browse Templates</span>
              </a>
            </Button>

            <Button
              variant="outline"
              className="flex items-center space-x-2"
              asChild
            >
              <a href="/dashboard/favorites">
                <Heart className="h-4 w-4" />
                <span>View Favorites</span>
              </a>
            </Button>

            <Button
              variant="outline"
              className="flex items-center space-x-2"
              asChild
            >
              <a href="/dashboard/remixes">
                <Layers className="h-4 w-4" />
                <span>Remix History</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      {!isProOrAbove && (
        <Card className="from-accent-primary/5 to-accent-secondary/5 border-accent-primary/20 bg-gradient-to-r">
          <CardContent className="p-6 text-center">
            <h3 className="text-text-primary mb-2 text-lg font-semibold">
              Unlock More Features
            </h3>
            <p className="text-text-muted mb-4">
              Upgrade your plan for unlimited templates, priority support, and
              exclusive templates.
            </p>
            <Button asChild>
              <a href="/pricing">View Plans</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
