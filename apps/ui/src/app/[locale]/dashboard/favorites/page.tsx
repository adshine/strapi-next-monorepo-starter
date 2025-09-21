"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Heart, Play, Star, Trash2 } from "lucide-react"

import type { Plan } from "@/lib/api/plans"
import type { Project } from "@/lib/api/projects"

import { plansAPI } from "@/lib/api/plans"
import { projectsAPI } from "@/lib/api/projects"
import { useAuth } from "@/lib/auth-context"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RemixModal } from "@/components/ui/remix-modal"

export default function FavoritesPage() {
  const { user } = useAuth()
  const { profile } = useUserProfile()
  const [favoriteTemplates, setFavoriteTemplates] = useState<Project[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<Project | null>(null)
  const [remixModalOpen, setRemixModalOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!profile?.favorites || profile.favorites.length === 0) {
        setLoading(false)
        return
      }

      try {
        // Fetch all favorite projects
        const projectPromises = profile.favorites.map((id: string) =>
          projectsAPI.getProjectById(id).catch(() => null)
        )
        const projects = await Promise.all(projectPromises)
        const validProjects = projects.filter(Boolean) as Project[]
        setFavoriteTemplates(validProjects)

        // Fetch plans for badges
        const plansData = await plansAPI.getAllPlans()
        setPlans(plansData)
      } catch (error) {
        console.error("Error fetching favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [profile?.favorites])

  if (!user) return null

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-text-primary mb-4 text-3xl font-bold">
            My Favorites
          </h1>
          <p className="text-text-muted">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  const handleRemix = (template: Project) => {
    setSelectedTemplate(template)
    setRemixModalOpen(true)
  }

  const handleRemoveFavorite = async (templateId: string) => {
    try {
      // Remove from favorites via API
      const updatedFavorites = // eslint-disable-line @typescript-eslint/no-unused-vars
        profile?.favorites?.filter((id: string) => id !== templateId) || []
      // TODO: Update user profile API to persist favorite changes
      // eslint-disable-next-line no-console
      console.log(`Removing template ${templateId} from favorites`)

      // Update local state
      setFavoriteTemplates((prev) => prev.filter((t) => t.id !== templateId))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  if (favoriteTemplates.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-text-primary mb-4 text-3xl font-bold">
            My Favorites
          </h1>
          <p className="text-text-muted">
            Templates you&apos;ve favorited will appear here for easy access.
          </p>
        </div>

        <div className="py-12 text-center">
          <Heart className="text-text-muted/50 mx-auto mb-4 h-16 w-16" />
          <h3 className="text-text-primary mb-2 text-lg font-semibold">
            No favorites yet
          </h3>
          <p className="text-text-muted mx-auto mb-6 max-w-md">
            Browse templates and click the heart icon to save them to your
            favorites for quick access.
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
          My Favorites
        </h1>
        <p className="text-text-muted">
          {favoriteTemplates.length} favorite
          {favoriteTemplates.length !== 1 ? "s" : ""} • Quick access to your
          saved templates
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favoriteTemplates.map((template) => {
          const plan = plans.find((p) => p.id === template.planId)
          return (
            <Card
              key={template.id}
              className="bg-elevated border-border-neutral overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Template Image */}
              <div className="bg-subtle relative aspect-video overflow-hidden">
                <Image
                  src={template.thumbnailUrl || "/placeholder-template.jpg"}
                  alt={template.title}
                  fill
                  className="h-full w-full object-cover"
                />

                {/* Plan Badge */}
                {plan && (
                  <div className="bg-primary/90 text-text-inverse absolute top-3 right-3 rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm">
                    {plan.displayName || "Pro"}
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title and Creator */}
                  <div>
                    <h3 className="text-text-primary mb-1 line-clamp-1 text-base font-semibold">
                      {template.title}
                    </h3>
                    <p className="text-text-muted text-sm">
                      by {template.creator || "Unknown"}
                    </p>
                  </div>

                  {/* Rating and Remixes */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="fill-accent-warning text-accent-warning h-3 w-3" />
                      <span className="text-text-muted">
                        {template.rating || "4.5"}
                      </span>
                    </div>
                    <span className="text-text-muted">
                      {(template.remixCount || 0).toLocaleString()} remixes
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-text-muted line-clamp-2 text-sm">
                    {template.description || "No description available"}
                  </p>

                  {/* Tags */}
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 2).map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-border-neutral flex items-center justify-between border-t pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFavorite(template.id)}
                      className="text-accent-danger hover:text-accent-danger hover:bg-accent-danger/10"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRemix(template)}
                      className="bg-accent-primary hover:bg-accent-primary/90"
                    >
                      <Play className="mr-1 h-4 w-4" />
                      Remix
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Remix Modal */}
      {selectedTemplate && (
        <RemixModal
          template={selectedTemplate}
          isOpen={remixModalOpen}
          onClose={() => setRemixModalOpen(false)}
        />
      )}
    </div>
  )
}
