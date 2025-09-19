"use client"

import {
  Calendar,
  Clock,
  Download,
  FileText,
  Heart,
  TrendingUp,
} from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { getMockPlanById, MOCK_PLANS } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const userPlan = getMockPlanById(user.planId)
  const isProOrAbove = userPlan && ["pro", "lifetime"].includes(userPlan.slug)

  // Calculate quota usage
  const dailyQuotaUsed = user.downloadsToday
  const dailyQuotaLimit =
    userPlan?.dailyDownloads === -1 ? 100 : userPlan?.dailyDownloads || 0
  const dailyQuotaPercent =
    dailyQuotaLimit > 0 ? (dailyQuotaUsed / dailyQuotaLimit) * 100 : 0

  const monthlyRequestsUsed = user.requestsThisMonth
  const monthlyRequestsLimit =
    userPlan?.monthlyRequests === -1 ? 100 : userPlan?.monthlyRequests || 0
  const monthlyRequestsPercent =
    monthlyRequestsLimit > 0
      ? (monthlyRequestsUsed / monthlyRequestsLimit) * 100
      : 0

  const downloadsResetDate = new Date(user.downloadsReset)
  const requestsResetDate = new Date(user.requestsReset)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="from-accent-primary/10 to-accent-secondary/10 border-border-neutral rounded-2xl border bg-gradient-to-r p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-text-primary mb-2 text-3xl font-bold">
              Welcome back, {user.name}!
            </h1>
            <p className="text-text-muted mb-4">
              Here's an overview of your account and activity.
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
                <Download className="text-accent-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-text-muted text-sm">Downloads Today</p>
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
                  {user.favorites.length}
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
                <p className="text-text-muted text-sm">Plan Expires</p>
                <p className="text-text-primary text-2xl font-bold">
                  {userPlan?.slug === "lifetime" ? "Never" : "Next Bill"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Daily Downloads */}
        <Card className="bg-elevated border-border-neutral">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="text-accent-primary h-5 w-5" />
              <span>Daily Download Quota</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-sm">
                {dailyQuotaUsed} of{" "}
                {dailyQuotaLimit === -1 ? "Unlimited" : dailyQuotaLimit}{" "}
                downloads used
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
                    (downloadsResetDate.getTime() - Date.now()) /
                      (1000 * 60 * 60)
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
                <Download className="h-4 w-4" />
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
              <a href="/dashboard/downloads">
                <Download className="h-4 w-4" />
                <span>Download History</span>
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
              Upgrade your plan for unlimited downloads, priority support, and
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
