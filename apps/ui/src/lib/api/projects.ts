/**
 * API client for Project entities (templates)
 */

import type { ProjectResponse, ProjectsResponse } from "@/lib/strapi-api/types"

import { PrivateStrapiClient, PublicStrapiClient } from "@/lib/strapi-api"

class ProjectsAPI {
  private publicClient: PublicStrapiClient
  private privateClient: PrivateStrapiClient

  constructor() {
    this.publicClient = new PublicStrapiClient()
    this.privateClient = new PrivateStrapiClient()
  }

  /**
   * Get all public projects (templates)
   */
  async getAllProjects(params?: {
    populate?: string
    filters?: Record<string, any>
    sort?: string[]
    pagination?: {
      page?: number
      pageSize?: number
    }
  }) {
    const response = await this.publicClient.find<ProjectsResponse>(
      "projects",
      {
        populate: params?.populate || "plan,tags,screenshots,category",
        filters: params?.filters,
        sort: params?.sort,
        pagination: params?.pagination,
      }
    )
    return response.data
  }

  /**
   * Get a project by ID
   */
  async getProjectById(id: string | number) {
    const response = await this.publicClient.findOne<ProjectResponse>(
      "projects",
      id,
      {
        populate: "plan,tags,screenshots,category",
      }
    )
    return response.data
  }

  /**
   * Get a project by slug
   */
  async getProjectBySlug(slug: string) {
    const response = await this.publicClient.find<ProjectsResponse>(
      "projects",
      {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: "plan,tags,screenshots,category",
      }
    )
    return response.data?.[0] || null
  }

  /**
   * Search projects
   */
  async searchProjects(query: string, filters?: Record<string, any>) {
    const response = await this.publicClient.find<ProjectsResponse>(
      "projects",
      {
        filters: {
          $or: [
            { title: { $containsi: query } },
            { description: { $containsi: query } },
            { tags: { $containsi: query } },
          ],
          ...filters,
        },
        populate: "plan,tags,screenshots,category",
      }
    )
    return response.data
  }

  /**
   * Get projects by category
   */
  async getProjectsByCategory(categorySlug: string) {
    const response = await this.publicClient.find<ProjectsResponse>(
      "projects",
      {
        filters: {
          category: {
            slug: {
              $eq: categorySlug,
            },
          },
        },
        populate: "plan,tags,screenshots,category",
      }
    )
    return response.data
  }

  /**
   * Get featured projects
   */
  async getFeaturedProjects() {
    const response = await this.publicClient.find<ProjectsResponse>(
      "projects",
      {
        filters: {
          featured: {
            $eq: true,
          },
          publishedAt: {
            $ne: null,
          },
        },
        populate: "plan,tags,screenshots,category",
        sort: ["order:asc", "publishedAt:desc"],
        pagination: {
          limit: 6,
        },
      }
    )
    return response.data
  }

  /**
   * Get trending projects (most remixes)
   */
  async getTrendingProjects(limit = 10) {
    const response = await this.publicClient.find<ProjectsResponse>(
      "projects",
      {
        filters: {
          publishedAt: {
            $ne: null,
          },
        },
        populate: "plan,tags,screenshots,category",
        sort: ["remixCount:desc"],
        pagination: {
          limit,
        },
      }
    )
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
    return this.privateClient.post(`projects/${projectId}/download`, {}) // TODO: Backend still uses download endpoint
  }

  /**
   * Get project categories
   */
  async getCategories() {
    // Assuming categories are a separate content type
    const response = await this.publicClient.find("categories", {
      sort: ["name:asc"],
    })
    return response.data
  }
}

export const projectsAPI = new ProjectsAPI()
