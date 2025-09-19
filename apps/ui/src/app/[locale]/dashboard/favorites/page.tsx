"use client"

import { useState } from "react"
import { Download, ExternalLink, Heart, Star, Trash2 } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { MOCK_PLANS, MOCK_TEMPLATES, Template } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DownloadModal } from "@/components/ui/download-modal"

export default function FavoritesPage() {
  const { user } = useAuth()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  )
  const [downloadModalOpen, setDownloadModalOpen] = useState(false)

  if (!user) return null

  const favoriteTemplates = user.favorites
    .map((id) => MOCK_TEMPLATES.find((template) => template.id === id))
    .filter(Boolean) as Template[]

  const handleDownload = (template: Template) => {
    setSelectedTemplate(template)
    setDownloadModalOpen(true)
  }

  const handleRemoveFavorite = (templateId: string) => {
    // In a real app, this would remove from favorites
    // For demo purposes, we'll just show an alert
    alert(`Removed template ${templateId} from favorites (mock functionality)`)
  }

  if (favoriteTemplates.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-text-primary mb-4 text-3xl font-bold">
            My Favorites
          </h1>
          <p className="text-text-muted">
            Templates you've favorited will appear here for easy access.
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
        {favoriteTemplates.map((template) => (
          <Card
            key={template.id}
            className="bg-elevated border-border-neutral overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            {/* Template Image */}
            <div className="bg-subtle relative aspect-video overflow-hidden">
              <img
                src={template.thumbnailUrl}
                alt={template.title}
                className="h-full w-full object-cover"
              />

              {/* Plan Badge */}
              <div className="bg-primary/90 text-text-inverse absolute top-3 right-3 rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm">
                {MOCK_PLANS.find((p) => p.slug === template.planRequired)
                  ?.badge || "Pro"}
              </div>
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
                    by {template.creator}
                  </p>
                </div>

                {/* Rating and Downloads */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="fill-accent-warning text-accent-warning h-3 w-3" />
                    <span className="text-text-muted">{template.rating}</span>
                  </div>
                  <span className="text-text-muted">
                    {template.downloadCount.toLocaleString()} downloads
                  </span>
                </div>

                {/* Description */}
                <p className="text-text-muted line-clamp-2 text-sm">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

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
                    onClick={() => handleDownload(template)}
                    className="bg-accent-primary hover:bg-accent-primary/90"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Download Modal */}
      {selectedTemplate && (
        <DownloadModal
          template={selectedTemplate}
          isOpen={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
        />
      )}
    </div>
  )
}
