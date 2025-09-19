"use client"

import React, { useEffect, useState } from "react"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  Download,
  ExternalLink,
  UserPlus,
  X,
} from "lucide-react"

import type { Template } from "@/lib/mock-data"

import { useAuth } from "@/lib/auth-context"
import {
  getMockPlanById,
  getMockPlanBySlug,
  saveMockDownload,
  saveMockUser,
} from "@/lib/mock-data"
import { cn } from "@/lib/styles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DownloadModalProps {
  template: Template
  isOpen: boolean
  onClose: () => void
}

type DownloadStep =
  | "confirm"
  | "preparing"
  | "generating"
  | "complete"
  | "error"

export function DownloadModal({
  template,
  isOpen,
  onClose,
}: DownloadModalProps) {
  const [currentStep, setCurrentStep] = useState<DownloadStep>("confirm")
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const { user } = useAuth()
  const userPlan = user ? getMockPlanById(user.planId) : null
  const canDownload =
    (userPlan &&
      userPlan.dailyDownloads >=
        (getMockPlanBySlug(template.planRequired)?.dailyDownloads || 0)) ||
    userPlan?.dailyDownloads === -1 // unlimited

  // Mock quota remaining calculation
  const getQuotaRemaining = () => {
    if (!user || !userPlan) return 0
    return Math.max(
      0,
      userPlan.dailyDownloads === -1
        ? 999
        : userPlan.dailyDownloads - user.downloadsToday
    )
  }

  const quotaRemaining = getQuotaRemaining()

  const resetModal = () => {
    setCurrentStep("confirm")
    setProgress(0)
    setDownloadUrl(null)
    setErrorMessage("")
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const startDownload = () => {
    if (!user || !canDownload) {
      setErrorMessage("Insufficient plan permissions")
      setCurrentStep("error")
      return
    }

    if (quotaRemaining <= 0) {
      setErrorMessage(
        "Daily download quota exceeded. Upgrade your plan or wait for reset."
      )
      setCurrentStep("error")
      return
    }

    setCurrentStep("preparing")
    setProgress(10)
  }

  // Mock download progress
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
          // Complete the download
          const mockUrl = `https://mock-download-link.com/template-${template.id}-${Date.now()}.zip`
          setDownloadUrl(mockUrl)

          // Update user data
          if (user) {
            const updatedUser = {
              ...user,
              downloadsToday: user.downloadsToday + 1,
            }
            saveMockUser(updatedUser)

            // Save download record
            saveMockDownload({
              id: `download-${Date.now()}`,
              templateId: template.id,
              downloadedAt: new Date().toISOString(),
              status: "completed",
            })
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
    if (downloadUrl) {
      try {
        await navigator.clipboard.writeText(downloadUrl)
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
              <img
                src={template.thumbnailUrl}
                alt={template.title}
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
                  {getMockPlanById(template.planRequired) && (
                    <Badge variant="secondary">
                      Requires {getMockPlanById(template.planRequired)?.name}{" "}
                      Plan
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Quota Info */}
            <div className="rounded-lg border border-[var(--border-neutral)] bg-[var(--bg-elevated)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-[var(--text-primary)]">
                  Download Quota
                </h4>
                <span className="text-sm text-[var(--text-muted)]">
                  {quotaRemaining} remaining today
                </span>
              </div>

              <div className="space-y-2">
                {userPlan && (
                  <div className="text-sm text-[var(--text-muted)]">
                    Daily limit:{" "}
                    {userPlan.dailyDownloads === -1
                      ? "Unlimited"
                      : userPlan.dailyDownloads}
                  </div>
                )}
                <div className="text-xs text-[var(--text-muted)]">
                  Unused downloads reset 24 hours after first use
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
                onClick={startDownload}
                disabled={!canDownload}
                className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90"
              >
                {canDownload ? "Start Download" : "Upgrade Plan"}
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
                <Download className="h-8 w-8 animate-pulse text-[var(--accent-primary)]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
                {currentStep === "preparing"
                  ? "Preparing Download"
                  : "Generating Files"}
              </h3>
              <p className="text-[var(--text-muted)]">
                {currentStep === "preparing"
                  ? "Checking permissions and quota..."
                  : "Compressing template files..."}
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
                Download Ready!
              </h3>
              <p className="text-[var(--text-muted)]">
                Your download link is ready. Copy and paste it into Framer to
                get started.
              </p>
            </div>

            {/* Download Link */}
            <Card className="border-[var(--border-neutral)] bg-[var(--bg-elevated)] p-4">
              <div className="mb-3 flex items-center space-x-2">
                <div className="flex-1 font-mono text-xs break-all text-[var(--text-primary)]">
                  {downloadUrl}
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
                  onClick={() => window.open(downloadUrl!, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in Framer
                </Button>
              </div>
            </Card>

            <div className="text-center">
              <p className="text-xs text-[var(--text-muted)]">
                Link expires in 15 minutes for security. Available for 3 total
                downloads.
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
                Download Failed
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
            Download Template
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
