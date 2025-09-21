"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, Download, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  template: {
    id: string
    title: string
    description?: string
    requiredPlan?: string
  }
  userQuota?: {
    used: number
    limit: number
    resetDate: string
  }
}

export function DownloadModal({
  isOpen,
  onClose,
  template,
  userQuota,
}: DownloadModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const quotaPercentage = userQuota
    ? (userQuota.used / userQuota.limit) * 100
    : 0

  const handleDownload = async () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    setIsDownloading(true)
    setError(null)

    try {
      const response = await fetch(`/api/download/${template.id}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          // Upgrade required
          setError(data.message)
          setTimeout(() => {
            router.push("/pricing")
          }, 3000)
          return
        } else if (response.status === 429) {
          // Quota exceeded
          setError(data.message)
          return
        } else {
          throw new Error(data.error || "Download failed")
        }
      }

      // Success - trigger download
      if (data.downloadUrl) {
        // Create a temporary link and click it
        const link = document.createElement("a")
        link.href = data.downloadUrl
        link.download = `${template.title.replace(/\s+/g, "-").toLowerCase()}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setDownloadSuccess(true)

        // Update local quota display if provided
        if (data.quota && userQuota) {
          userQuota.used = data.quota.used
        }

        // Close modal after a delay
        setTimeout(() => {
          onClose()
          setDownloadSuccess(false)
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Template</DialogTitle>
          <DialogDescription>
            Confirm download for &quot;{template.title}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quota Information */}
          {userQuota && userQuota.limit !== -1 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Download Quota</span>
                <span className="font-medium">
                  {userQuota.used} / {userQuota.limit}
                </span>
              </div>
              <Progress value={quotaPercentage} className="h-2" />
              {quotaPercentage >= 90 && (
                <Alert className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    You&apos;re approaching your monthly download limit.
                    {quotaPercentage >= 100 &&
                      " This will be your last download until quota resets."}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Template Info */}
          <div className="rounded-lg border p-3">
            <h4 className="font-medium">{template.title}</h4>
            {template.description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {template.description}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Download Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {downloadSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your download will start shortly.
              </AlertDescription>
            </Alert>
          )}

          {/* License Agreement */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">
              By downloading this template, you agree to our{" "}
              <a href="/terms" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/license" className="underline">
                License Agreement
              </a>
              . Templates are for personal and commercial use.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDownloading}>
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading || downloadSuccess}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Downloaded
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
