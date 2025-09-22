"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Layers,
  UserPlus,
  X,
} from "lucide-react"

import type { Template } from "@/types/templates"

import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/styles"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface RemixModalProps {
  template: Template
  isOpen: boolean
  onClose: () => void
}

type RemixStep = "confirm" | "preparing" | "generating" | "complete" | "error"

export function RemixModal({ template, isOpen, onClose }: RemixModalProps) {
  const [currentStep, setCurrentStep] = useState<RemixStep>("confirm")
  const [progress, setProgress] = useState(0)
  const [remixUrl, setRemixUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const { user } = useAuth()
  const { profile } = useUserProfile()
  const userPlan = profile?.plan
  const canRemix = userPlan ? true : false // Simplified check

  // Calculate quota remaining
  const getQuotaRemaining = () => {
    if (!profile || !userPlan) return 0
    const dailyLimit = userPlan.dailyRemixes || 0 // TODO: rename from dailyDownloads in schema
    const used = profile.remixesUsed || 0 // TODO: rename from downloadsUsed in schema
    return Math.max(0, dailyLimit === -1 ? 999 : dailyLimit - used)
  }

  const quotaRemaining = getQuotaRemaining()

  const resetModal = () => {
    setCurrentStep("confirm")
    setProgress(0)
    setRemixUrl(null)
    setErrorMessage("")
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const startRemix = () => {
    if (!user || !canRemix) {
      setErrorMessage("Insufficient plan permissions")
      setCurrentStep("error")
      return
    }

    if (quotaRemaining <= 0) {
      setErrorMessage(
        "Daily template quota exceeded. Upgrade your plan or wait for reset."
      )
      setCurrentStep("error")
      return
    }

    setCurrentStep("preparing")
    setProgress(10)
  }

  // Mock remix progress
  useEffect(() => {
    if (
      !isOpen ||
      currentStep === "confirm" ||
      currentStep === "complete" ||
      currentStep === "error"
    )
      return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Complete the remix
          const mockUrl = `https://framer.com/projects/remix-template-${template.id}-${Date.now()}`
          setRemixUrl(mockUrl)

          // Update remix count via API
          if (user) {
            // Call API to record remix
            fetch("/api/remix", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                templateId: template.id,
                status: "completed",
              }),
            }).catch(console.error)
          }

          setCurrentStep("complete")
          clearInterval(interval)
          return 100
        }

        // Increment progress
        const increment =
          currentStep === "preparing" ? 5 : currentStep === "generating" ? 8 : 3
        return Math.min(100, prev + increment)
      })
    }, 200)

    return () => clearInterval(interval)
  }, [currentStep, isOpen, template.id, user])

  useEffect(() => {
    if (currentStep === "preparing" && progress >= 30) {
      setCurrentStep("generating")
    }
  }, [currentStep, progress])

  const copyToClipboard = async () => {
    if (remixUrl) {
      try {
        await navigator.clipboard.writeText(remixUrl)
        // Could add a toast here
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "confirm":
        return (
          <div className="space-y-6">
            {/* Template Info */}
            <div className="flex items-start space-x-4">
              <Image
                src={template.thumbnailUrl}
                alt={template.title}
                width={80}
                height={48}
                className="h-12 w-20 rounded border object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {template.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  by {template.creator}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <Badge variant="outline">{template.category}</Badge>
                  {template.planId && (
                    <Badge variant="secondary">
                      Requires Premium Plan Plan
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Quota Info */}
            <div className="rounded-lg border border-[var(--border-neutral)] bg-[var(--bg-elevated)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-[var(--text-primary)]">
                  Template Quota
                </h4>
                <span className="text-sm text-[var(--text-muted)]">
                  {quotaRemaining} remaining today
                </span>
              </div>

              <div className="space-y-2">
                {userPlan && (
                  <div className="text-sm text-[var(--text-muted)]">
                    Daily limit:{" "}
                    {userPlan.dailyRemixes === -1
                      ? "Unlimited"
                      : userPlan.dailyRemixes}
                  </div>
                )}
                <div className="text-xs text-[var(--text-muted)]">
                  Unused template access resets 24 hours after first use
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={startRemix}
                disabled={!canRemix}
                className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90"
              >
                {canRemix ? "Remix Template" : "Upgrade Plan"}
              </Button>
            </div>
          </div>
        )

      case "preparing":
      case "generating":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-primary)]/10">
                <Layers className="h-8 w-8 animate-pulse text-[var(--accent-primary)]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
                {currentStep === "preparing"
                  ? "Preparing Remix"
                  : "Generating Access Link"}
              </h3>
              <p className="text-[var(--text-muted)]">
                {currentStep === "preparing"
                  ? "Checking permissions and quota..."
                  : "Creating your Framer remix link..."}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full border border-[var(--border-neutral)] bg-[var(--bg-elevated)]">
                <div
                  className="h-2 rounded-full bg-[var(--accent-primary)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-center text-sm text-[var(--text-muted)]">
                {progress}% complete
              </div>
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
                Template Ready to Remix!
              </h3>
              <p className="text-[var(--text-muted)]">
                Your remix link is ready. Click to open in Framer and start
                customizing your template.
              </p>
            </div>

            {/* Remix Link */}
            <Card className="border-[var(--border-neutral)] bg-[var(--bg-elevated)] p-4">
              <div className="mb-3 flex items-center space-x-2">
                <div className="flex-1 font-mono text-xs break-all text-[var(--text-primary)]">
                  {remixUrl}
                </div>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={copyToClipboard}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90"
                  onClick={() => window.open(remixUrl!, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in Framer
                </Button>
              </div>
            </Card>

            <div className="text-center">
              <p className="text-xs text-[var(--text-muted)]">
                Link expires in 15 minutes for security. Available for 3 total
                remixes.
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )

      case "error":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-danger)]/10">
                <AlertCircle className="h-8 w-8 text-[var(--accent-danger)]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
                Remix Failed
              </h3>
              <p className="text-[var(--accent-danger)]">{errorMessage}</p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={resetModal}
                className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90"
              >
                Try Again
              </Button>
            </div>
          </div>
        )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md border-[var(--border-neutral)] bg-[var(--bg-elevated)] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-neutral)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Remix Template
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">{renderStepContent()}</div>
      </Card>
    </div>
  )
}
