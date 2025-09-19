"use client"

import { useState } from "react"
import { CheckCircle, Clock, FileText, PlusCircle } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { getMockPlanById, saveMockRequest } from "@/lib/mock-data"
import {
  ComposerProvider,
  TemplateRequestDraft,
  useComposerState,
} from "@/hooks/use-composer"
import { Composer } from "@/components/composer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

// Template Request Composer Component
function TemplateRequestComposer() {
  const { user } = useAuth()
  const [shouldNotifyByEmail, setShouldNotifyByEmail] = useState(true)

  const handleSubmit = async (request: TemplateRequestDraft) => {
    if (!user) throw new Error("User not authenticated")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Save to mock data
    const templateRequest = {
      id: `request-${Date.now()}`,
      title: request.title,
      description: request.description,
      category: request.category,
      priority: request.priority,
      budget: request.budget || "",
      timeline: request.timeline || "",
      submittedAt: new Date().toISOString(),
      status: "pending" as const,
      urgency: request.priority,
    }

    saveMockRequest(templateRequest)

    // In a real app, you'd upload attachments to a server here
    if (request.attachments.length > 0) {
      console.log("Would upload attachments:", request.attachments)
    }

    // Show success message
    alert(
      `Template request submitted successfully! We'll start working on your "${request.title}" project.`
    )
  }

  const composer = useComposerState(handleSubmit)

  return (
    <ComposerProvider onSubmit={handleSubmit}>
      <>
        {!composer.state.isOpen ? (
          <EmptyState onCreate={composer.actions.open} />
        ) : (
          <Composer.Frame className="mx-auto max-w-4xl">
            <Composer.Header />

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Composer.TitleInput />
                <Composer.CategorySelector />
              </div>

              <Composer.DescriptionInput />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Composer.PrioritySelector />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-text-primary text-sm font-medium">
                      Budget Range (Optional)
                    </label>
                    <select
                      className="bg-elevated border-border-neutral text-text-primary focus:ring-accent-primary w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                      value={composer.state.draft.budget || ""}
                      onChange={(e) =>
                        composer.actions.updateDraft({ budget: e.target.value })
                      }
                    >
                      <option value="">Not specified</option>
                      <option value="$500-$1,000">$500-$1,000</option>
                      <option value="$1,000-$2,500">$1,000-$2,500</option>
                      <option value="$2,500-$5,000">$2,500-$5,000</option>
                      <option value="$5,000+">$5,000+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-text-primary text-sm font-medium">
                      Desired Timeline (Optional)
                    </label>
                    <select
                      className="bg-elevated border-border-neutral text-text-primary focus:ring-accent-primary w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                      value={composer.state.draft.timeline || ""}
                      onChange={(e) =>
                        composer.actions.updateDraft({
                          timeline: e.target.value,
                        })
                      }
                    >
                      <option value="">Flexible</option>
                      <option value="ASAP">ASAP</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="2-4 weeks">2-4 weeks</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="No rush">No rush</option>
                    </select>
                  </div>
                </div>
              </div>

              <Composer.Attachments />

              <div className="bg-subtle flex items-center space-x-2 rounded-md p-4">
                <Checkbox
                  id="email-notifications"
                  checked={shouldNotifyByEmail}
                  onCheckedChange={(checked) =>
                    setShouldNotifyByEmail(checked as boolean)
                  }
                />
                <label
                  htmlFor="email-notifications"
                  className="text-text-primary cursor-pointer text-sm"
                >
                  Send me email updates about this project
                </label>
              </div>
            </div>

            <Composer.Footer>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={composer.actions.close}
                  disabled={composer.state.isSubmitting}
                >
                  Cancel
                </Button>
                <Composer.Submit label="Submit Template Request" />
              </div>
            </Composer.Footer>
          </Composer.Frame>
        )}
      </>
    </ComposerProvider>
  )
}

// Empty state when no composer is open
function EmptyState({ onCreate }: { onCreate: () => void }) {
  const { user } = useAuth()
  const userPlan = user ? getMockPlanById(user.planId) : null
  const monthlyRequests = userPlan?.monthlyRequests || 1
  const hasUnlimited = monthlyRequests === -1

  // Get current month's requests (mock)
  const thisMonthRequests = 0 // In real app, calculate from user data

  return (
    <div className="py-12 text-center">
      <div className="mx-auto max-w-2xl">
        <div className="bg-accent-primary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <PlusCircle className="text-accent-primary h-8 w-8" />
        </div>

        <h2 className="text-text-primary mb-4 text-2xl font-bold">
          Request a Custom Template
        </h2>

        <p className="text-text-muted mb-8 text-lg">
          Don't see the template you need? Describe your project and we'll
          design and build it for you. Our team of experts will create a fully
          functional, pixel-perfect Framer template tailored to your
          requirements.
        </p>

        {/* Plan status */}
        <Card className="bg-elevated border-border-neutral mx-auto mb-8 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="mb-3 flex items-center justify-center space-x-2">
              <FileText className="text-accent-primary h-5 w-5" />
              <span className="text-text-primary font-medium">
                Monthly Requests
              </span>
            </div>

            <div className="text-text-primary mb-2 text-3xl font-bold">
              {thisMonthRequests} / {hasUnlimited ? "∞" : monthlyRequests}
            </div>

            <p className="text-text-muted text-sm">
              {hasUnlimited
                ? "Unlimited custom requests"
                : `${monthlyRequests - thisMonthRequests} remaining this month`}
            </p>
          </CardContent>
        </Card>

        {/* Process highlights */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="bg-accent-success/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <CheckCircle className="text-accent-success h-6 w-6" />
            </div>
            <h3 className="text-text-primary mb-2 font-semibold">
              Quick Review
            </h3>
            <p className="text-text-muted text-sm">
              We review your request within 24 hours
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-accent-warning/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <Clock className="text-accent-warning h-6 w-6" />
            </div>
            <h3 className="text-text-primary mb-2 font-semibold">
              Professional Build
            </h3>
            <p className="text-text-muted text-sm">
              2-3 weeks for standard requests, custom timeline available
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-accent-secondary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <FileText className="text-accent-secondary h-6 w-6" />
            </div>
            <h3 className="text-text-primary mb-2 font-semibold">
              Complete Package
            </h3>
            <p className="text-text-muted text-sm">
              Fully functional template with responsive design
            </p>
          </div>
        </div>

        <Button
          onClick={onCreate}
          size="lg"
          className="bg-accent-primary hover:bg-accent-primary/90"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Custom Request
        </Button>
      </div>
    </div>
  )
}

// Main page component
export default function RequestsPage() {
  // Import getMockPlanById here since we need it in the component
  const { getMockPlanById } = require("@/lib/mock-data")

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-text-primary mb-4 text-3xl font-bold">
          Custom Template Requests
        </h1>
        <p className="text-text-muted mx-auto max-w-2xl">
          Describe your vision and our design team will create a custom Framer
          template just for you. Perfect for unique projects that don't fit our
          standard catalog.
        </p>
      </div>

      <TemplateRequestComposer />
    </div>
  )
}
