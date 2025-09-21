export interface User {
  id: string
  email: string
  name?: string
  planId?: string
  remixesToday?: number // TODO: Backend still uses downloadsToday
  remixesReset?: string // TODO: Backend still uses downloadsReset
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
