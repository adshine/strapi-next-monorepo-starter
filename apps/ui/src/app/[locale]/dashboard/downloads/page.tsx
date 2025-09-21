"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  CheckCircle,
  Clock,
  Download,
  DownloadIcon,
  ExternalLink,
  Filter,
  XCircle,
} from "lucide-react"

import { projectsAPI } from "@/lib/api/projects"
import { useAuth } from "@/lib/auth-context"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type DownloadStatus = "completed" | "failed" | "pending"

interface DownloadRecord {
  id: string
  templateId: string
  status: DownloadStatus
  downloadedAt: string
  fileSize: string
  expiresAt?: string
}

export default function DownloadsPage() {
  const { user } = useAuth()
  const { profile } = useUserProfile() // eslint-disable-line @typescript-eslint/no-unused-vars
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [templates, setTemplates] = useState<Map<string, any>>(new Map())
  const [loading, setLoading] = useState(true) // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        // Fetch download logs from API
        const response = await fetch("/api/downloads")
        if (response.ok) {
          const downloadData = await response.json()
          setDownloads(downloadData)

          // Fetch template data for each download
          const templateIds = [
            ...new Set(downloadData.map((d: DownloadRecord) => d.templateId)),
          ]
          const templatePromises = templateIds.map((id) =>
            projectsAPI.getProjectById(id).catch(() => null)
          )
          const templateData = await Promise.all(templatePromises)
          const templateMap = new Map()
          templateData.forEach((template, index) => {
            if (template) {
              templateMap.set(templateIds[index], template)
            }
          })
          setTemplates(templateMap)
        }
      } catch (error) {
        console.error("Failed to fetch downloads:", error)
        // Use mock data as fallback
        setDownloads([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDownloads()
    }
  }, [user])

  if (!user) return null

  // Filter downloads for current user and apply status filter
  const userDownloads = useMemo(() => {
    let filtered = downloads.filter((download) => {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      // In a real app, this would check ownership or be filtered server-side
      return true // Show all for demo
    })

    if (statusFilter !== "all") {
      filtered = filtered.filter((download) => download.status === statusFilter) // eslint-disable-line @typescript-eslint/no-unused-vars
    }

    // Sort by download date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
    )
  }, [downloads, statusFilter])

  const getStatusIcon = (status: DownloadStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Download className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: DownloadStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "failed":
        return "bg-red-50 text-red-700 border-red-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  if (userDownloads.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-text-primary mb-4 text-3xl font-bold">
            Download History
          </h1>
          <p className="text-text-muted">
            Your previous template downloads will appear here for easy access.
          </p>
        </div>

        <div className="py-12 text-center">
          <Download className="text-text-muted/50 mx-auto mb-4 h-16 w-16" />
          <h3 className="text-text-primary mb-2 text-lg font-semibold">
            No downloads yet
          </h3>
          <p className="text-text-muted mx-auto mb-6 max-w-md">
            Start browsing templates and downloading them to see your history
            here.
          </p>
          <Button asChild>
            <a href="/templates">Browse Templates</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-text-primary mb-4 text-3xl font-bold">
          Download History
        </h1>
        <p className="text-text-muted">
          {userDownloads.length} download{userDownloads.length !== 1 ? "s" : ""}{" "}
          • Previously downloaded templates
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="text-text-muted h-4 w-4" />
          <span className="text-text-primary text-sm font-medium">
            Filter by status:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "All Downloads" },
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
              className={
                statusFilter === filter.value ? "bg-accent-primary" : ""
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Downloads List */}
      <div className="space-y-4">
        {userDownloads.map((download) => {
          const template = templates.get(download.templateId)
          if (!template) return null

          return (
            <Card
              key={download.id}
              className="bg-elevated border-border-neutral"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Template Image */}
                    <div className="bg-subtle relative h-16 w-16 overflow-hidden rounded">
                      <Image
                        src={template.thumbnailUrl}
                        alt={template.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Template Info */}
                    <div className="flex-1">
                      <h3 className="text-text-primary mb-1 font-semibold">
                        {template.title}
                      </h3>
                      <p className="text-text-muted mb-2 text-sm">
                        by {template.creator} • {template.category}
                      </p>

                      {/* Download Date */}
                      <p className="text-text-muted text-xs">
                        Downloaded on{" "}
                        {new Date(download.downloadedAt).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(download.downloadedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Status */}
                    <div
                      className={`flex items-center space-x-2 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(download.status)}`}
                    >
                      {getStatusIcon(download.status)}
                      <span>
                        {download.status.charAt(0).toUpperCase() +
                          download.status.slice(1)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {download.status === "completed" && (
                        <>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={template.thumbnailUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>View Demo</span>
                            </a>
                          </Button>

                          <Button
                            size="sm"
                            className="bg-accent-primary hover:bg-accent-primary/90"
                            asChild
                          >
                            <a href={`/templates/${template.slug}`}>
                              <DownloadIcon className="mr-1 h-4 w-4" />
                              Download Again
                            </a>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info for Failed Downloads */}
                {download.status === "failed" && (
                  <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-800">
                      This download failed. Please try downloading again or
                      contact support if the issue persists.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="bg-elevated border-border-neutral">
          <CardContent className="p-6 text-center">
            <div className="text-accent-success mb-2 text-2xl font-bold">
              {userDownloads.filter((d) => d.status === "completed").length}
            </div>
            <p className="text-text-muted text-sm">Successful Downloads</p>
          </CardContent>
        </Card>

        <Card className="bg-elevated border-border-neutral">
          <CardContent className="p-6 text-center">
            <div className="text-accent-warning mb-2 text-2xl font-bold">
              {userDownloads.filter((d) => d.status === "pending").length}
            </div>
            <p className="text-text-muted text-sm">Pending Downloads</p>
          </CardContent>
        </Card>

        <Card className="bg-elevated border-border-neutral">
          <CardContent className="p-6 text-center">
            <div className="text-accent-danger mb-2 text-2xl font-bold">
              {userDownloads.filter((d) => d.status === "failed").length}
            </div>
            <p className="text-text-muted text-sm">Failed Downloads</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
