'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Grid3X3, List, Download, Star, Heart, Clock } from 'lucide-react';
import { cn } from '@/lib/styles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DownloadModal } from '@/components/ui/download-modal';

import { MOCK_TEMPLATES, getMockUser, getMockPlanById, getMockPlanBySlug } from '@/lib/mock-data';
import type { Template } from '@/lib/mock-data';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'popular' | 'rating' | 'name';

export default function TemplatesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const user = getMockUser();

  // Get unique categories from templates
  const categories = useMemo(() => {
    const cats = [...new Set(MOCK_TEMPLATES.map(t => t.category))];
    return ['all', ...cats];
  }, []);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = MOCK_TEMPLATES.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

      const matchesPlan = selectedPlan === 'all' || template.planRequired === selectedPlan;

      return matchesSearch && matchesCategory && matchesPlan;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return MOCK_TEMPLATES.indexOf(b) - MOCK_TEMPLATES.indexOf(a); // Reverse index = newer
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedPlan, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPlan('all');
    setSortBy('popular');
  };

  const TemplateCard = ({ template }: { template: Template }) => {
    const userPlan = user ? getMockPlanById(user.planId) : null;
    const templatePlan = getMockPlanBySlug(template.planRequired);
    const canAccess = userPlan && templatePlan && userPlan.dailyDownloads >= templatePlan.dailyDownloads;

    const handleDownload = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setSelectedTemplate(template);
      setDownloadModalOpen(true);
    };

    const handleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      alert(`Added "${template.title}" to favorites`);
    };

    const handleDownloadModalClose = () => {
      setDownloadModalOpen(false);
      setSelectedTemplate(null);
    };

    return (
      <Card className={cn(
        "group bg-[var(--bg-elevated)] border-[var(--border-neutral)] hover:shadow-lg transition-all duration-300 overflow-hidden",
        viewMode === 'list' && "flex flex-row"
      )}>
        {/* Clickable Link Area */}
        <Link href={`/templates/${template.slug}`} className={cn(
          "block cursor-pointer hover:bg-transparent!",
          viewMode === 'list' && "flex"
        )}>
          {/* Image */}
          <div className={cn(
            "aspect-video relative overflow-hidden bg-[var(--bg-subtle)]",
            viewMode === 'list' && "w-48 flex-shrink-0"
          )}>
            <img
              src={template.thumbnailUrl}
              alt={template.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Plan Badge */}
            <div className="absolute top-3 right-3 bg-[var(--bg-primary)]/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
              {templatePlan?.badge || 'Pro'}
            </div>

            {/* Access Indicator */}
            {!canAccess && user && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-sm font-medium">Upgrade Required</div>
                  <div className="text-white/80 text-xs mt-1">Requires {templatePlan?.name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={cn("p-4 flex-1", viewMode === 'list' && "w-full")}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-1 line-clamp-1">
                  {template.title}
                </h3>

                <div className="flex items-center space-x-3 text-sm text-[var(--text-muted)]">
                  <span>by {template.creator}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-[var(--accent-warning)] text-[var(--accent-warning)]" />
                    <span>{template.rating}</span>
                  </div>
                  <span>{template.downloadCount.toLocaleString()} downloads</span>
                </div>
              </div>
            </div>

            <p className={cn(
              "text-[var(--text-muted)] text-sm",
              viewMode === 'list' ? "line-clamp-3" : "line-clamp-2"
            )}>
              {template.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {template.tags.slice(0, viewMode === 'list' ? 4 : 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > (viewMode === 'list' ? 4 : 3) && (
                <Badge variant="outline" className="text-xs">
                  +{template.tags.length - (viewMode === 'list' ? 4 : 3)}
                </Badge>
              )}
            </div>
          </div>
        </Link>

        {/* Action Buttons - Outside Link */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--border-neutral)] bg-[var(--bg-subtle)]">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
            onClick={handleFavorite}
          >
            <Heart className="h-4 w-4 mr-1" />
            Favorite
          </Button>

          <Button
            variant={canAccess || !user ? "default" : "outline"}
            size="sm"
            className={cn(
              canAccess ? "bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90" : ""
            )}
            disabled={!canAccess && user !== null}
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Page Header */}
      <div className="border-b border-[var(--border-neutral)] bg-[var(--bg-primary)]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Professional Framer Templates
            </h1>
            <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto">
              Discover beautifully crafted templates that help you build stunning websites faster than ever.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
              <Input
                placeholder="Search templates, categories, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-[var(--bg-elevated)] border-[var(--border-neutral)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-[var(--bg-elevated)] border-[var(--border-neutral)]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Plan Filter */}
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-40 bg-[var(--bg-elevated)] border-[var(--border-neutral)]">
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
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-40 bg-[var(--bg-elevated)] border-[var(--border-neutral)]">
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
              <div className="flex items-center space-x-2 ml-auto">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[var(--accent-primary)]' : ''}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[var(--accent-primary)]' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory !== 'all' || selectedPlan !== 'all' || sortBy !== 'popular') && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-[var(--text-muted)]">
            Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </div>

          {/* User Quota Info */}
          {user && (
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-[var(--text-muted)]">
                <Download className="h-4 w-4" />
                <span>{user?.downloadsToday ?? 0} downloads today</span>
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
          <div className={cn(
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-[var(--text-muted)] text-lg mb-4">
              No templates found matching your criteria
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Download Modal */}
      {selectedTemplate && (
        <DownloadModal
          template={selectedTemplate}
          isOpen={downloadModalOpen}
          onClose={() => {
            setDownloadModalOpen(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}
