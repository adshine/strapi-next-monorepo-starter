"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Download, Star, Users, Zap } from "lucide-react"

import { plansAPI } from "@/lib/api/plans"
import { projectsAPI } from "@/lib/api/projects"
import { cn } from "@/lib/styles"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function FeaturedTemplates() {
  const [featuredTemplates, setFeaturedTemplates] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesData, plansData] = await Promise.all([
          projectsAPI.getAllProjects({ pagination: { pageSize: 6 } }),
          plansAPI.getAllPlans(),
        ])
        setFeaturedTemplates(templatesData.slice(0, 6))
        setPlans(plansData)
      } catch (error) {
        console.error("Failed to fetch featured templates:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getPlanBadge = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    return plan?.displayName || "PRO"
  }

  if (loading) {
    return (
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              Featured Templates
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--text-muted)]">
              Loading templates...
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-24">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
            Featured Templates
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--text-muted)]">
            Start your next project with professionally crafted templates that
            are ready to customize and deploy.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden border-[var(--border-neutral)] bg-[var(--bg-elevated)] transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={template.thumbnailUrl}
                  alt={template.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 rounded-full bg-[var(--bg-primary)]/90 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  {getPlanBadge(template.planId)}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {template.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-[var(--text-muted)]">
                    <Star className="h-4 w-4 fill-[var(--accent-warning)] text-[var(--accent-warning)]" />
                    <span>{template.rating}</span>
                  </div>
                </div>

                <p className="mb-3 line-clamp-3 text-sm text-[var(--text-muted)]">
                  {template.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    by {template.creator}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">
                    {template.downloadCount.toLocaleString()} downloads
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/templates">
            <Button variant="outline" size="lg">
              View All Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="bg-[var(--bg-elevated)]/30 px-4 py-24">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              Why Choose FramerDojo?
            </h2>

            <div className="space-y-6">
              {[
                {
                  title: "Production Ready",
                  description:
                    "Every template is thoroughly tested and optimized for performance across all devices.",
                },
                {
                  title: "Instant Download",
                  description:
                    "Secure, instant downloads with automatic verification and version tracking.",
                },
                {
                  title: "Regular Updates",
                  description:
                    "Get lifetime access to template updates and new components as they're released.",
                },
              ].map((item, index) => (
                <div key={item.title} className="flex items-start space-x-4">
                  <div
                    className={cn(
                      "mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                      index === 0
                        ? "bg-[var(--accent-success)]"
                        : index === 1
                          ? "bg-[var(--accent-primary)]"
                          : "bg-[var(--accent-support)]"
                    )}
                  >
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-muted)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Card className="border-[var(--border-neutral)] bg-[var(--bg-elevated)] p-8 shadow-xl">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
                    Start Free Today
                  </h3>
                  <p className="mb-6 text-[var(--text-muted)]">
                    No credit card required. Get 3 downloads per day with our
                    free plan.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "3 downloads per day",
                    "1 request per month",
                    "Community support",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 flex-shrink-0 text-[var(--accent-success)]" />
                      <span className="text-[var(--text-primary)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link href="/pricing" className="w-full">
                  <Button className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90">
                    View All Plans
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingHighlights() {
  const [paidPlans, setPaidPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const allPlans = await plansAPI.getAllPlans()
        setPaidPlans(
          allPlans.filter((plan: any) => plan.slug !== "solo" && plan.isActive)
        )
      } catch (error) {
        console.error("Failed to fetch plans:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  if (loading) {
    return (
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              Plans for Every Team
            </h2>
            <p className="text-lg text-[var(--text-muted)]">Loading plans...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
            Plans for Every Team
          </h2>
          <p className="text-lg text-[var(--text-muted)]">
            Flexible pricing that scales with your workflow. Pay monthly or save
            with annual billing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {paidPlans.map((plan) => (
            <Card
              key={plan.id}
              className="border-[var(--border-neutral)] bg-[var(--bg-elevated)] p-8 transition-colors hover:border-[var(--accent-primary)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  {plan.name}
                </h3>
                <span className="text-sm text-[var(--accent-primary)]">
                  {plan.badge}
                </span>
              </div>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[var(--accent-primary)]">
                  ${plan.price}
                </span>
                <span className="text-[var(--text-muted)]">/month</span>
              </div>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--accent-success)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/pricing?plan=${plan.slug}`} className="mt-8 block">
                <Button className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90">
                  Choose {plan.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function CallToAction() {
  return (
    <section className="px-4 py-24">
      <div className="container mx-auto max-w-4xl text-center">
        <Card className="border-[var(--border-neutral)] bg-gradient-to-r from-[var(--accent-primary)]/10 via-[var(--accent-support)]/10 to-[var(--accent-success)]/10 p-12">
          <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
            Ready to Supercharge Your Workflow?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--text-muted)]">
            Join thousands of designers and developers using professional Framer
            templates to build faster and better.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg">
                Browse Templates
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  )
}

export function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <section
        className={cn(
          "relative overflow-hidden",
          "bg-gradient-to-br from-[var(--bg-primary)] via-[rgba(91,140,255,0.05)] to-[var(--bg-primary)]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(91,140,255,0.35)] via-transparent to-[rgba(91,140,255,0.15)] opacity-40" />

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-[var(--border-neutral)] bg-[var(--bg-elevated)]/50 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-[var(--accent-primary)]" />
              <span className="text-sm font-medium">
                Framer Templates Reimagined
              </span>
            </div>

            <h1
              className={cn(
                "mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl",
                "bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--text-muted)] bg-clip-text text-transparent"
              )}
            >
              Premium Templates,
              <br />
              <span className="text-[var(--accent-primary)]">
                Unlimited Creativity
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
              Professional Framer templates designed for developers and
              designers. Skip the design phase and focus on what matters:
              building amazing user experiences.
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/templates">
                <Button
                  size="lg"
                  className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Browse Templates
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[var(--border-neutral)] hover:bg-[var(--bg-elevated)]"
                >
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-[var(--accent-warning)] text-[var(--accent-warning)]" />
                <span className="font-medium">4.8</span>
                <span>from 2,847 reviews</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="font-medium">50K+</span>
                <span>active users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedTemplates />
      <Benefits />
      <PricingHighlights />
      <CallToAction />
    </div>
  )
}

export default MarketingLandingPage
