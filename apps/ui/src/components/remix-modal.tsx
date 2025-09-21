"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Layers,
  Loader2,
} from "lucide-react"
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

interface RemixModalProps {
  isOpen: boolean
  onClose: () => void
  template: {
    id: string
    title: string
    description?: string
    requiredPlan?: string
    remixUrl?: string
  }
  userQuota?: {
    used: number
    limit: number
    resetDate: string
  }
}

export function RemixModal({
  isOpen,
  onClose,
  template,
  userQuota,
}: RemixModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remixSuccess, setRemixSuccess] = useState(false)

  const quotaPercentage = userQuota
    ? (userQuota.used / userQuota.limit) * 100
    : 0

  const handleRemix = async () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch(`/api/remix/${template.id}`)
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
          throw new Error(data.error || "Remix failed")
        }
      }

      // Success - open Framer remix link
      if (data.remixUrl || template.remixUrl) {
        const remixUrl = data.remixUrl || template.remixUrl

        setRemixSuccess(true)

        // Update local quota display if provided
        if (data.quota && userQuota) {
          userQuota.used = data.quota.used
        }

        // Open remix link in new tab after a brief delay
        setTimeout(() => {
          window.open(remixUrl, "_blank", "noopener,noreferrer")
          onClose()
          setRemixSuccess(false)
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remix Template</DialogTitle>
          <DialogDescription>
            Get ready to remix &quot;{template.title}&quot; in Framer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quota Information */}
          {userQuota && userQuota.limit !== -1 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Template Quota</span>
                <span className="font-medium">
                  {userQuota.used} / {userQuota.limit}
                </span>
              </div>
              <Progress value={quotaPercentage} className="h-2" />
              {quotaPercentage >= 90 && (
                <Alert className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    You&apos;re approaching your monthly template limit.
                    {quotaPercentage >= 100 &&
                      " This will be your last template until quota resets."}
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

          {/* How it Works */}
          <div className="bg-muted/30 space-y-2 rounded-lg p-3">
            <h5 className="flex items-center text-sm font-medium">
              <Layers className="mr-2 h-4 w-4" />
              How Remix Works
            </h5>
            <ul className="text-muted-foreground ml-6 space-y-1 text-xs">
              <li>• Opens template in Framer</li>
              <li>• Creates a copy in your account</li>
              <li>• Full editing capabilities</li>
              <li>• Publish to your own domain</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Remix Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {remixSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Opening template in Framer...
              </AlertDescription>
            </Alert>
          )}

          {/* License Agreement */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">
              By remixing this template, you agree to our{" "}
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
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleRemix} disabled={isProcessing || remixSuccess}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : remixSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Opening Framer...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Remix in Framer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
