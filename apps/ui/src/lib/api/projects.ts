/**
 * API client for Project entities (templates)
 */

import type { ProjectResponse, ProjectsResponse } from "@/lib/strapi-api/types"

import { PrivateStrapiClient, PublicStrapiClient } from "@/lib/strapi-api"

class ProjectsAPI {
  private publicClient = PublicStrapiClient
  private privateClient = PrivateStrapiClient

  /**
   * Get all public projects (templates)
   */
  async getAllProjects(params?: {
    populate?: string | Record<string, any>
    filters?: Record<string, any>
    sort?: string[]
    pagination?: {
      page?: number
      pageSize?: number
    }
  }) {
    const response = await this.publicClient.fetchMany("api::project.project", {
      populate: params?.populate || "*",
      filters: params?.filters,
      sort: params?.sort,
      pagination: params?.pagination,
    })
    return response.data
  }

  /**
   * Get a project by ID
   */
  async getProjectById(id: string | number) {
    const response = await this.publicClient.fetchOne(
      "api::project.project",
      id,
      {
        populate: "*",
      }
    )
    return response.data
  }

  /**
   * Get a project by slug
   */
  async getProjectBySlug(slug: string) {
    const response = await this.publicClient.fetchMany("api::project.project", {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: "*",
    })
    return response.data?.[0] || null
  }

  /**
   * Search projects
   */
  async searchProjects(query: string, filters?: Record<string, any>) {
    const response = await this.publicClient.fetchMany("api::project.project", {
      filters: {
        $or: [
          { title: { $containsi: query } },
          { description: { $containsi: query } },
          { tags: { $containsi: query } },
        ],
        ...filters,
      },
      populate: "*",
    })
    return response.data
  }

  /**
   * Get projects by category
   */
  async getProjectsByCategory(categorySlug: string) {
    const response = await this.publicClient.fetchMany("api::project.project", {
      filters: {
        category: {
          slug: {
            $eq: categorySlug,
          },
        },
      },
      populate: "*",
    })
    return response.data
  }

  /**
   * Get featured projects
   */
  async getFeaturedProjects() {
    const response = await this.publicClient.fetchMany("api::project.project", {
      filters: {
        featured: {
          $eq: true,
        },
        publishedAt: {
          $ne: null,
        },
      },
      populate: "*",
      sort: ["order:asc", "publishedAt:desc"],
      pagination: {
        limit: 6,
      },
    })
    return response.data
  }

  /**
   * Get trending projects (most remixes)
   */
  async getTrendingProjects(limit = 10) {
    const response = await this.publicClient.fetchMany("api::project.project", {
      filters: {
        publishedAt: {
          $ne: null,
        },
      },
      populate: "*",
      sort: ["remixCount:desc"],
      pagination: {
        limit,
      },
    })
    return response.data
  }

  /**
   * Toggle favorite status for a project (authenticated)
   */
  async toggleFavorite(projectId: string | number) {
    // This would need to be implemented on the backend
    // For now, we'll use the user profile API to manage favorites
    return this.privateClient.put(
      `user-profiles/toggle-favorite/${projectId}`,
      {}
    )
  }

  /**
   * Increment remix count for a project
   */
  async trackRemix(projectId: string | number) {
    // This should be called after successful template access
    return this.privateClient.post(`projects/${projectId}/remix`, {})
  }

  /**
   * Get project categories
   */
  async getCategories() {
    try {
      // Assuming categories are a separate content type
      const response = await this.publicClient.fetchMany(
        "api::category.category" as any,
        {
          sort: ["name:asc"],
        }
      )
      return response.data
    } catch (error) {
      // Return empty array if categories don't exist yet
      console.warn("Categories API not available:", error)
      return []
    }
  }
}

export const projectsAPI = new ProjectsAPI()
