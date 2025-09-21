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
  remixCount: number // TODO: Future schema rename - downloadCount → remixCount
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
  dailyRemixes: number // TODO: Future schema rename - dailyDownloads → dailyRemixes
  monthlyRequests: number // TODO: Future schema rename - monthlyDownloadLimit → monthlyRemixLimit
  isActive?: boolean
  isPopular?: boolean
}
