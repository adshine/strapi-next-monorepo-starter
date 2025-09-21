export interface User {
  id: string
  email: string
  name?: string
  planId?: string
  downloadsToday?: number
  downloadsReset?: string
  requestsThisMonth?: number
  requestsReset?: string
  favorites?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error?: string | null
}
