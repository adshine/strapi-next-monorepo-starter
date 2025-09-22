/**
 * Type definitions for Strapi API responses
 */

import type { API } from "@repo/strapi"

// Project (Template) types
export type ProjectResponse = {
  data: API.Project | null
  meta?: any
}

export type ProjectsResponse = {
  data: API.Project[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// User Profile types
export type UserProfileResponse = {
  data: API.UserProfile | null
  meta?: any
}

export type UserProfilesResponse = {
  data: API.UserProfile[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Plan types
export type PlanResponse = {
  data: API.Plan | null
  meta?: any
}

export type PlansResponse = {
  data: API.Plan[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Template Access Log types
export type TemplateAccessLogResponse = {
  data: API.TemplateAccessLog | null
  meta?: any
}

export type TemplateAccessLogsResponse = {
  data: API.TemplateAccessLog[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Generic category type (if needed)
export type CategoryResponse = {
  data: any | null
  meta?: any
}

export type CategoriesResponse = {
  data: any[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}
