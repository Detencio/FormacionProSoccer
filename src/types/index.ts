// User Types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// Team Types
export interface Team {
  id: string
  name: string
  logo?: string
  description?: string
  captainId: string
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: 'captain' | 'player' | 'coach'
  joinedAt: Date
  user: User
}

// Match Types
export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  date: Date
  location: string
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  homeScore?: number
  awayScore?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  homeTeam: Team
  awayTeam: Team
}

export interface MatchPlayer {
  id: string
  matchId: string
  userId: string
  status: 'confirmed' | 'pending' | 'declined'
  position?: string
  user: User
}

// Payment Types
export interface Payment {
  id: string
  userId: string
  teamId: string
  amount: number
  type: 'subscription' | 'match' | 'equipment' | 'other'
  status: 'pending' | 'completed' | 'failed'
  description?: string
  date: Date
  createdAt: Date
  updatedAt: Date
  user: User
}

// Post Types (Social Features)
export interface Post {
  id: string
  userId: string
  teamId?: string
  content: string
  mediaUrls?: string[]
  likes: string[] // User IDs
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
  user: User
}

export interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
  user: User
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface CreateTeamForm {
  name: string
  description?: string
  logo?: File
}

export interface CreateMatchForm {
  homeTeamId: string
  awayTeamId: string
  date: Date
  location: string
  notes?: string
}

// Filter Types
export interface MatchFilters {
  status?: Match['status']
  dateFrom?: Date
  dateTo?: Date
  teamId?: string
}

export interface PaymentFilters {
  status?: Payment['status']
  type?: Payment['type']
  dateFrom?: Date
  dateTo?: Date
} 