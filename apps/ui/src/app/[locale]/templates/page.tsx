"use client"

import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Clock,
  Grid3X3,
  Heart,
  Layers,
  List,
  Play,
  Search,
  Star,
} from "lucide-react"

import { projectsAPI } from "@/lib/api/projects"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/styles"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Container } from "@/components/elementary/Container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RemixModal } from "@/components/ui/remix-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ViewMode = "grid" | "list"
type SortOption = "newest" | "popular" | "rating" | "name"

export default function TemplatesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPlan, setSelectedPlan] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const [remixModalOpen, setRemixModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [templates, setTemplates] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true) // eslint-disable-line @typescript-eslint/no-unused-vars

  const { user } = useAuth()
  const { profile } = useUserProfile() // eslint-disable-line @typescript-eslint/no-unused-vars

  // Fetch templates and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, categoriesData] = await Promise.all([
          projectsAPI.getAllProjects(),
          projectsAPI.getCategories(),
        ])
        setTemplates(projectsData)
        setCategories([
          { id: "all", name: "All Categories", slug: "all" },
          ...categoriesData,
        ])
      } catch (error) {
        console.error("Failed to fetch templates:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (template.tags || []).some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesCategory =
        selectedCategory === "all" ||
        template.category?.slug === selectedCategory

      const matchesPlan =
        selectedPlan === "all" || template.plan?.slug === selectedPlan

      return matchesSearch && matchesCategory && matchesPlan
    })

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          )
        case "popular":
          return (b.remixCount || 0) - (a.remixCount || 0) // TODO: rename from downloadCount in schema
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "name":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedPlan, sortBy, templates])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedPlan("all")
    setSortBy("popular")
  }

  const TemplateCard = ({ template }: { template: any }) => {
    const { profile } = useUserProfile()
    const userPlan = profile?.plan
    const canAccess = userPlan ? true : false // Simplified check

    const handleRemix = (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      setSelectedTemplate(template)
      setRemixModalOpen(true)
    }

    const handleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      alert(`Added "${template.title}" to favorites`)
    }

    const handleRemixModalClose = () => {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      setRemixModalOpen(false)
      setSelectedTemplate(null)
    }

    return (
      <Card
        className={cn(
          "group overflow-hidden border-[var(--border-neutral)] bg-[var(--bg-elevated)] transition-all duration-300 hover:shadow-lg",
          viewMode === "list" && "flex flex-row"
        )}
      >
        {/* Clickable Link Area */}
        <Link
          href={`/templates/${template.slug}`}
          className={cn(
            "block cursor-pointer hover:bg-transparent!",
            viewMode === "list" && "flex"
          )}
        >
          {/* Image */}
          <div
            className={cn(
              "relative aspect-video overflow-hidden bg-[var(--bg-subtle)]",
              viewMode === "list" && "w-48 flex-shrink-0"
            )}
          >
            {template.featuredImage?.url ? (
              <Image
                src={template.featuredImage.url}
                alt={template.title}
                width={400}
                height={225}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-primary)]/20">
                <Layers className="h-12 w-12 text-[var(--text-muted)]" />
              </div>
            )}

            {/* Plan Badge */}
            {template.requiredPlan && (
              <div className="absolute top-3 right-3 rounded-full bg-[var(--bg-primary)]/90 px-2 py-1 text-xs font-medium capitalize backdrop-blur-sm">
                {template.requiredPlan}
              </div>
            )}

            {/* Access Indicator */}
            {!canAccess && user && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <div className="text-sm font-medium text-white">
                    Upgrade Required
                  </div>
                  <div className="mt-1 text-xs text-white/80">
                    Requires {template.requiredPlan || "Premium"} plan
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={cn("flex-1 p-4", viewMode === "list" && "w-full")}>
            <div className="mb-2 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-[var(--text-primary)]">
                  {template.title}
                </h3>

                <div className="flex items-center space-x-3 text-sm text-[var(--text-muted)]">
                  {template.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-[var(--accent-warning)] text-[var(--accent-warning)]" />
                      <span>{template.rating}</span>
                    </div>
                  )}
                  <span>
                    {template.remixCount?.toLocaleString() || 0} remixes
                  </span>
                </div>
              </div>
            </div>

            <p
              className={cn(
                "text-sm text-[var(--text-muted)]",
                viewMode === "list" ? "line-clamp-3" : "line-clamp-2"
              )}
            >
              {template.description}
            </p>

            {/* Tags */}
            {template.tags && template.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {template.tags
                  .slice(0, viewMode === "list" ? 4 : 3)
                  .map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                {template.tags.length > (viewMode === "list" ? 4 : 3) && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - (viewMode === "list" ? 4 : 3)}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Link>

        {/* Action Buttons - Outside Link */}
        <div className="flex items-center justify-between border-t border-[var(--border-neutral)] bg-[var(--bg-subtle)] p-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
            onClick={handleFavorite}
          >
            <Heart className="mr-1 h-4 w-4" />
            Favorite
          </Button>

          <Button
            variant={canAccess || !user ? "default" : "outline"}
            size="sm"
            className={cn(
              canAccess
                ? "bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90"
                : ""
            )}
            disabled={!canAccess && user !== null}
            onClick={handleRemix}
          >
            <Play className="mr-1 h-4 w-4" />
            Remix
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Page Header */}
      <div className="border-b border-[var(--border-neutral)] bg-[var(--bg-primary)]/50 backdrop-blur-sm">
        <Container className="py-8">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
              Professional Framer Templates
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-[var(--text-muted)]">
              Discover beautifully crafted templates that help you build
              stunning websites faster than ever.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mx-auto max-w-6xl space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute top-3 left-3 h-4 w-4 text-[var(--text-muted)]" />
              <Input
                placeholder="Search templates, categories, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 border-[var(--border-neutral)] bg-[var(--bg-elevated)] pl-10 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40 border-[var(--border-neutral)] bg-[var(--bg-elevated)]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={
                        typeof category === "string" ? category : category.slug
                      }
                      value={
                        typeof category === "string" ? category : category.slug
                      }
                    >
                      {typeof category === "string"
                        ? category === "all"
                          ? "All Categories"
                          : category
                        : category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Plan Filter */}
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-40 border-[var(--border-neutral)] bg-[var(--bg-elevated)]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="solo">Free</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-40 border-[var(--border-neutral)] bg-[var(--bg-elevated)]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="ml-auto flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid" ? "bg-[var(--accent-primary)]" : ""
                  }
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list" ? "bg-[var(--accent-primary)]" : ""
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Clear Filters */}
              {(searchQuery ||
                selectedCategory !== "all" ||
                selectedPlan !== "all" ||
                sortBy !== "popular") && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Templates Grid */}
      <Container className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-[var(--text-muted)]">
            Showing {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
          </div>

          {/* User Quota Info */}
          {user && (
            <div className="hidden items-center space-x-4 text-sm md:flex">
              <div className="flex items-center space-x-1 text-[var(--text-muted)]">
                <Layers className="h-4 w-4" />
                <span>{user?.remixesToday ?? 0} remixes today</span>{" "}
                {/* TODO: rename from downloadsToday in schema */}
              </div>
              <div className="flex items-center space-x-1 text-[var(--text-muted)]">
                <Clock className="h-4 w-4" />
                <span>{user?.requestsThisMonth ?? 0} requests this month</span>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  View Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>

        {filteredTemplates.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            )}
          >
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mb-4 text-lg text-[var(--text-muted)]">
              No templates found matching your criteria
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </Container>

      {/* Remix Modal */}
      {selectedTemplate && (
        <RemixModal
          template={selectedTemplate}
          isOpen={remixModalOpen}
          onClose={() => {
            setRemixModalOpen(false)
            setSelectedTemplate(null)
          }}
        />
      )}
    </div>
  )
}
