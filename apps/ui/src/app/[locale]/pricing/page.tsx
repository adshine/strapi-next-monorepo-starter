"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Layers, MessageSquare, Star } from "lucide-react"

import { plansAPI } from "@/lib/api/plans"
import { useAuth } from "@/lib/auth-context"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

type BillingPeriod = "month" | "year"

export default function PricingPage() {
  const router = useRouter() // eslint-disable-line @typescript-eslint/no-unused-vars
  const { user, showAuthModal } = useAuth()
  const { profile } = useUserProfile()
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("month")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [addOns, setAddOns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allPlans = await plansAPI.getAllPlans()
        // Filter out free solo plan from main pricing display
        setPlans(
          allPlans.filter((plan: any) => plan.slug !== "solo" && plan.isActive)
        )

        // Fetch add-ons from plans API
        const plansWithAddOns = allPlans.filter(
          (plan: any) => plan.addOns && plan.addOns.length > 0
        )
        if (plansWithAddOns.length > 0) {
          // Extract unique add-ons
          const uniqueAddOns = new Map()
          plansWithAddOns.forEach((plan: any) => {
            plan.addOns?.forEach((addon: any) => {
              if (!uniqueAddOns.has(addon.id)) {
                uniqueAddOns.set(addon.id, addon)
              }
            })
          })
          setAddOns(Array.from(uniqueAddOns.values()))
        } else {
          // Default add-ons if none from API
          setAddOns([
            {
              id: "fast-turnaround",
              name: "Fast Turnaround",
              description: "Priority processing for template requests",
              price: 19,
              period: "month",
            },
            {
              id: "premium-support",
              name: "Premium Support",
              description: "Direct access to our design team",
              price: 49,
              period: "month",
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const currentPlan = profile?.plan

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    if (billingPeriod === "month") return 0
    const yearlyTotal = yearlyPrice * 12
    const monthlyTotal = monthlyPrice * 12
    return monthlyTotal - yearlyTotal
  }

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    )
  }

  const getSelectedAddOnsTotal = () => {
    return addOns
      .filter((addon: any) => selectedAddOns.includes(addon.id))
      .reduce((total: number, addon: any) => total + addon.price, 0)
  }

  const handleSelectPlan = async (plan: any) => {
    if (!user) {
      showAuthModal("signup")
      return
    }

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle: billingPeriod,
          addOns: selectedAddOns,
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
    }
  }

  const totalPrice = useMemo(() => {
    const basePlanPrice =
      plans.find((p) => p.slug === "studio")?.monthlyPrice || 0 // Default to Studio
    const addOnsTotal = getSelectedAddOnsTotal()
    return billingPeriod === "year"
      ? (basePlanPrice + addOnsTotal) * 0.8
      : basePlanPrice + addOnsTotal
  }, [billingPeriod, selectedAddOns, plans, getSelectedAddOnsTotal])

  return (
    <div className="bg-primary min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="from-accent-primary/10 via-primary to-accent-support/5 absolute inset-0 bg-gradient-to-br" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="mb-16 text-center">
            <h1 className="text-text-primary mb-6 text-4xl font-bold md:text-6xl">
              Choose Your Plan
            </h1>
            <p className="text-text-muted mx-auto mb-8 max-w-3xl text-xl">
              Unlock premium Framer templates with flexible plans designed for
              designers and agencies of all sizes.
            </p>

            {/* Billing Toggle */}
            <div className="mb-8 flex items-center justify-center gap-6">
              <span
                className={`text-lg ${billingPeriod === "month" ? "text-text-primary font-semibold" : "text-text-muted"}`}
              >
                Monthly
              </span>
              <Switch
                checked={billingPeriod === "year"}
                onCheckedChange={(checked: boolean) =>
                  setBillingPeriod(checked ? "year" : "month")
                }
                className="data-[state=checked]:bg-accent-primary"
              />
              <span
                className={`text-lg ${billingPeriod === "year" ? "text-text-primary font-semibold" : "text-text-muted"}`}
              >
                Yearly
              </span>
              <Badge
                variant="secondary"
                className="bg-accent-success/20 text-accent-success border-accent-success/30"
              >
                Save 20%
              </Badge>
            </div>
          </div>

          {/* Plans Grid */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="text-text-muted">Loading plans...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
              {plans.map((plan, index) => {
                // eslint-disable-line @typescript-eslint/no-unused-vars
                const isPopular = plan.slug === "studio"
                const isCurrentPlan = currentPlan?.id === plan.id
                const monthlyPrice = plan.monthlyPrice || 0
                const yearlyPrice = plan.yearlyPrice || monthlyPrice * 12 * 0.8

                return (
                  <Card
                    key={plan.id}
                    className={`bg-elevated border-border-neutral relative transition-all duration-300 hover:shadow-xl ${
                      isCurrentPlan
                        ? "ring-accent-primary border-accent-primary ring-2"
                        : ""
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                        <Badge className="bg-accent-primary text-text-inverse px-4 py-1 text-sm font-semibold">
                          <Star className="mr-1 h-3 w-3 fill-current" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    {isCurrentPlan && (
                      <div className="absolute -top-4 right-4">
                        <Badge
                          variant="outline"
                          className="bg-accent-success/20 border-accent-success text-accent-success"
                        >
                          Current Plan
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4 text-center">
                      <CardTitle className="text-text-primary mb-2 text-2xl font-bold">
                        {plan.name}
                      </CardTitle>
                      <div className="mb-4 flex items-baseline justify-center gap-1">
                        <span className="text-accent-primary text-4xl font-bold">
                          $
                          {billingPeriod === "year"
                            ? Math.round(yearlyPrice / 12)
                            : monthlyPrice}
                        </span>
                        <span className="text-text-muted">
                          /{billingPeriod === "year" ? "month" : "month"}
                        </span>
                      </div>
                      {billingPeriod === "year" && (
                        <div className="text-accent-success mb-4 text-sm">
                          Save ${(monthlyPrice * 12 - yearlyPrice).toFixed(0)}{" "}
                          annually
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Features List */}
                      <div className="space-y-3">
                        {(plan.features || []).map(
                          (feature: string, featureIndex: number) => (
                            <div
                              key={featureIndex}
                              className="flex items-start gap-3"
                            >
                              <Check className="text-accent-success mt-0.5 h-5 w-5 flex-shrink-0" />
                              <span className="text-text-primary text-sm">
                                {feature}
                              </span>
                            </div>
                          )
                        )}

                        {/* Additional metrics */}
                        <Separator className="my-4" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center">
                            <div className="mb-1 flex items-center justify-center gap-2">
                              <Layers className="text-accent-primary h-4 w-4" />
                              <span className="font-semibold">
                                {plan.dailyDownloadLimit === -1 ||
                                plan.dailyDownloadLimit === 0
                                  ? "∞"
                                  : plan.dailyDownloadLimit}
                              </span>
                            </div>
                            <div className="text-text-muted">
                              Daily Templates
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="mb-1 flex items-center justify-center gap-2">
                              <MessageSquare className="text-accent-primary h-4 w-4" />
                              <span className="font-semibold">
                                {plan.templateRequestLimit === -1 ||
                                plan.templateRequestLimit === 0
                                  ? "∞"
                                  : plan.templateRequestLimit}
                              </span>
                            </div>
                            <div className="text-text-muted">
                              Monthly Requests
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        onClick={() => handleSelectPlan(plan)}
                        disabled={isCurrentPlan}
                        className={`w-full ${
                          isCurrentPlan
                            ? "bg-subtle text-text-muted cursor-not-allowed"
                            : "bg-accent-primary hover:bg-accent-primary/90 text-text-inverse"
                        }`}
                      >
                        {isCurrentPlan ? "Current Plan" : `Choose ${plan.name}`}
                        {!isCurrentPlan && (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="bg-elevated py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-text-primary mb-4 text-3xl font-bold">
              Enhance Your Plan
            </h2>
            <p className="text-text-muted text-xl">
              Add powerful features to supercharge your workflow
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {addOns.map((addOn: any) => (
              <Card
                key={addOn.id}
                className={`cursor-pointer border-2 transition-all duration-200 ${
                  selectedAddOns.includes(addOn.id)
                    ? "border-accent-primary bg-accent-primary/5"
                    : "border-border-neutral bg-primary hover:border-accent-primary/50"
                }`}
                onClick={() => toggleAddOn(addOn.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-text-primary mb-2 font-semibold">
                        {addOn.name}
                      </h3>
                      <p className="text-text-muted mb-4 text-sm">
                        {addOn.description}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-accent-primary text-2xl font-bold">
                          ${addOn.price}
                        </span>
                        <span className="text-text-muted text-sm">
                          /{addOn.period}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                        selectedAddOns.includes(addOn.id)
                          ? "bg-accent-primary border-accent-primary"
                          : "border-border-neutral"
                      }`}
                    >
                      {selectedAddOns.includes(addOn.id) && (
                        <Check className="text-text-inverse h-3 w-3" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          {selectedAddOns.length > 0 && (
            <Card className="bg-primary border-border-neutral">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-text-primary text-lg font-semibold">
                    Order Summary
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {billingPeriod === "year" ? "Yearly" : "Monthly"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-primary">Pro Plan</span>
                    <span className="text-text-primary">
                      ${billingPeriod === "year" ? "47.99" : "59"}
                      <span className="text-text-muted text-sm">
                        /{billingPeriod}
                      </span>
                    </span>
                  </div>

                  {selectedAddOns.map((addOnId) => {
                    const addon = addOns.find((a: any) => a.id === addOnId)!
                    return (
                      <div
                        key={addOnId}
                        className="flex items-center justify-between"
                      >
                        <span className="text-text-primary">{addon.name}</span>
                        <span className="text-text-primary">
                          +${addon.price}
                          <span className="text-text-muted text-sm">
                            /{addon.period}
                          </span>
                        </span>
                      </div>
                    )
                  })}

                  {billingPeriod === "year" && (
                    <div className="text-accent-success flex items-center justify-between">
                      <span>Yearly Savings (20%)</span>
                      <span>-${(totalPrice * 0.2).toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span className="text-text-primary">Total</span>
                    <span className="text-accent-primary">
                      ${totalPrice.toFixed(2)}/
                      {billingPeriod === "year" ? "year" : "month"}
                    </span>
                  </div>
                </div>

                <Button className="bg-accent-primary hover:bg-accent-primary/90 text-text-inverse mt-6 w-full">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-text-primary mb-4 text-3xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-text-primary mb-2 text-lg font-semibold">
                  Can I change plans anytime?
                </h3>
                <p className="text-text-muted">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes take effect immediately.
                </p>
              </div>

              <div>
                <h3 className="text-text-primary mb-2 text-lg font-semibold">
                  What happens to my templates if I downgrade?
                </h3>
                <p className="text-text-muted">
                  Your existing templates remain accessible. Future templates
                  will be subject to your new plan limits.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-text-primary mb-2 text-lg font-semibold">
                  Do you offer refunds?
                </h3>
                <p className="text-text-muted">
                  We offer a 14-day money-back guarantee on all paid plans.
                  Contact support for assistance.
                </p>
              </div>

              <div>
                <h3 className="text-text-primary mb-2 text-lg font-semibold">
                  Need help choosing a plan?
                </h3>
                <Link
                  href="/support"
                  className="text-accent-primary hover:underline"
                >
                  Contact our sales team →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-elevated border-border-neutral border-t py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-text-primary mb-4 text-2xl font-bold">
            Start Creating Amazing Websites
          </h2>
          <p className="text-text-muted mb-8">
            Join thousands of designers who trust Framer Template Platform
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              asChild
              className="bg-accent-primary hover:bg-accent-primary/90 text-text-inverse px-8"
            >
              <Link href="/templates">Browse Templates First</Link>
            </Button>
            <div className="text-text-muted text-sm">
              ✓ 14-day free trial • No credit card required • Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
