"use client"

import { use, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Download, Heart, Share2, Star, Users } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { getMockPlanBySlug, MOCK_TEMPLATES, Template } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DownloadModal } from "@/components/ui/download-modal"

interface TemplatePageProps {
  params: {
    locale: string
    slug: string
  }
}

function getTemplateBySlug(slug: string): Template | undefined {
  return MOCK_TEMPLATES.find((template) => template.slug === slug)
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const resolvedParams = use(params)
  const template = getTemplateBySlug(resolvedParams.slug)

  if (!template) {
    notFound()
  }

  const { user, showAuthModal } = useAuth()
  const requiredPlan = getMockPlanBySlug(template.planRequired)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const galleryImages = useMemo(() => {
    if (template.previewImages && template.previewImages.length > 0) {
      return template.previewImages
    }

    return [template.thumbnailUrl]
  }, [template.previewImages, template.thumbnailUrl])

  const shouldAutoShowRecommendations = galleryImages.length <= 1
  const [showRecommendations, setShowRecommendations] = useState(
    () => shouldAutoShowRecommendations
  )
  const lastImageRef = useRef<HTMLImageElement | null>(null)

  const relatedTemplates = useMemo(
    () =>
      MOCK_TEMPLATES.filter(
        (item) => item.id !== template.id && item.category === template.category
      ).slice(0, 4),
    [template.id, template.category]
  )

  useEffect(() => {
    if (shouldAutoShowRecommendations) {
      setShowRecommendations(true)
      return
    }

    if (!lastImageRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowRecommendations(true)
          }
        })
      },
      { threshold: 0.4, rootMargin: "0px 0px -25% 0px" }
    )

    observer.observe(lastImageRef.current)

    return () => {
      observer.disconnect()
    }
  }, [shouldAutoShowRecommendations, galleryImages.length])

  const isFreePlan = requiredPlan?.slug === "solo"

  const handleDownload = () => {
    if (!user) {
      showAuthModal("signup")
      return
    }

    setShowDownloadModal(true)
  }

  const handleFavorite = () => {
    if (!user) {
      showAuthModal("signup")
      return
    }

    setIsFavorited((prev) => !prev)
  }

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav className="flex flex-wrap items-center gap-2 py-8 text-sm text-[var(--text-muted)]">
              <Link
                href="/templates"
                className="hover:text-[var(--text-primary)]"
              >
                Templates
              </Link>
              <span>→</span>
              <Link
                href={`/templates?category=${encodeURIComponent(template.category.toLowerCase())}`}
                className="hover:text-[var(--text-primary)]"
              >
                {template.category}
              </Link>
              <span>→</span>
              <span className="text-[var(--text-primary)]">
                {template.title}
              </span>
            </nav>

            <div className="space-y-8">
              {galleryImages.map((src, index) => (
                <img
                  key={src + index}
                  ref={index === galleryImages.length - 1 ? lastImageRef : undefined}
                  src={src}
                  alt={`${template.title} preview ${index + 1}`}
                  className="w-full rounded-2xl border border-[var(--border-neutral)] object-cover"
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6 py-8">
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-muted)]">
                  by{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {template.creator}
                  </span>{" "}
                  in{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {template.category}
                  </span>
                </p>
                <h1 className="text-4xl leading-tight font-bold md:text-5xl">
                  {template.title}
                </h1>
                <p className="text-[var(--text-muted)]">
                  {template.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-[var(--accent-warning)] text-[var(--accent-warning)]" />
                    <span>{template.rating} / 5.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {template.downloadCount.toLocaleString()} downloads
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90"
                  size="lg"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-5 w-5" />
                  {isFreePlan
                    ? "Get for Free"
                    : `Unlock with ${requiredPlan?.name}`}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-[var(--border-neutral)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  onClick={handleFavorite}
                >
                  <Heart
                    className={`mr-2 h-5 w-5 ${isFavorited ? "fill-current text-[var(--accent-success)]" : ""}`}
                  />
                  {isFavorited ? "Saved" : "Save"}
                </Button>
              </div>

              <div className="rounded-2xl border border-[var(--border-neutral)] bg-[var(--bg-elevated)] p-6">
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold tracking-widest text-[var(--text-muted)]">
                    Plan Details
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[var(--text-primary)]">
                        {requiredPlan?.name ?? "Solo"} Plan
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {isFreePlan
                          ? "Includes daily free downloads and core components."
                          : "Includes premium downloads, requests, and support."}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]"
                    >
                      {requiredPlan?.badge ?? "Free"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-[var(--text-muted)]">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {requiredPlan?.dailyDownloads === -1
                          ? "Unlimited"
                          : `${requiredPlan?.dailyDownloads ?? 3}`}
                      </p>
                      <p>Daily downloads</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {requiredPlan?.monthlyRequests === -1
                          ? "Unlimited"
                          : `${requiredPlan?.monthlyRequests ?? 0}`}
                      </p>
                      <p>Template requests</p>
                    </div>
                  </div>
                </div>
              </div>

              {template.longDescription && (
                <div className="space-y-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  <h2 className="text-xs font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase">
                    Overview
                  </h2>
                  <p>{template.longDescription}</p>
                </div>
              )}

              {(template.compatibility ?? []).length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase">
                    Compatible with
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    {(template.compatibility ?? ["Framer"]).map((tool) => (
                      <div
                        key={tool}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-neutral)] text-base font-semibold"
                      >
                        {tool[0]}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {template.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-4 text-sm text-[var(--text-muted)]">
                <Button variant="ghost" className="gap-2" size="sm">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                >
                  <a
                    href={template.thumbnailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Preview
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {relatedTemplates.length > 0 && (
          <section
            className={`py-16 transition-all duration-500 ${
              showRecommendations
                ? "opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 translate-y-6"
            }`}
            aria-live="polite"
          >
            <h2 className="text-center text-3xl font-bold">
              You may also like
            </h2>
            <p className="mt-2 text-center text-[var(--text-muted)]">
              Hand-picked templates similar to {template.title}
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTemplates.map((item) => (
                <Card
                  key={item.id}
                  className="border-[var(--border-neutral)] bg-[var(--bg-elevated)]/40 transition-colors hover:border-[var(--accent-primary)]"
                >
                  <Link
                    href={`/templates/${item.slug}`}
                    className="group block"
                  >
                    <div className="aspect-video overflow-hidden rounded-t-xl">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="space-y-2 p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <Star className="h-3 w-3 fill-[var(--accent-warning)] text-[var(--accent-warning)]" />
                          {item.rating}
                        </div>
                      </div>
                      <h3 className="line-clamp-1 font-semibold text-[var(--text-primary)]">
                        {item.title}
                      </h3>
                      <p className="line-clamp-2 text-xs text-[var(--text-muted)]">
                        {item.description}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {showDownloadModal && (
        <DownloadModal
          template={template}
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </div>
  )
}
