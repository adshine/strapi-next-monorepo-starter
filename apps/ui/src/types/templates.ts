export interface Template {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string
  previewImages?: string[]
  planRequired?: string
  planId?: string
  category: string
  tags: string[]
  creator: string
  downloadCount: number
  rating: number
  fileSize?: string
  createdAt?: string
  updatedAt?: string
}

export interface Plan {
  id: string
  slug: string
  name: string
  displayName?: string
  badge?: string
  price: number
  yearlyPrice?: number
  features: string[]
  dailyDownloads: number
  monthlyRequests: number
  isActive?: boolean
  isPopular?: boolean
}
