// Team Formation Types
export interface TeamFormation {
  id: string;
  name: string; // "4-4-2", "4-3-3", etc.
  description: string;
  gameType: '5v5' | '7v7' | '11v11';
  positions: FormationPosition[];
  is_active: boolean;
  created_at: string;
}

export interface FormationPosition {
  id: number;
  position_id: number;
  position: PositionZone | PositionSpecific;
  x: number; // Coordenada X en la cancha (0-100)
  y: number; // Coordenada Y en la cancha (0-100)
  team: 'HOME' | 'AWAY';
  player_id?: number;
  player?: Player;
  is_captain: boolean;
}

// Team Distribution Types
export interface TeamDistribution {
  homeTeam: TeamSection;
  awayTeam: TeamSection;
  unassigned: Player[];
  gameType: '5v5' | '7v7' | '11v11';
  formation?: TeamFormation;
  balanceScore: number;
  generatedAt: string;
}

export interface TeamSection {
  starters: Player[];
  substitutes: Player[];
  averageSkill: number;
}

export interface PlayerMove {
  playerId: number;
  fromTeam: 'home' | 'away';
  fromRole: 'starter' | 'substitute';
  toTeam: 'home' | 'away';
  toRole: 'starter' | 'substitute';
}

export interface TeamGenerationRequest {
  playerIds: number[];
  gameType: '5v5' | '7v7' | '11v11';
  formationId?: string;
  balancePreferences?: {
    skillLevelWeight: number;
    positionBalanceWeight: number;
    teamSizeWeight: number;
  };
}

export interface TeamGenerationResponse {
  distribution: TeamDistribution;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

// Game Configuration Types
export interface GameConfiguration {
  gameType: '5v5' | '7v7' | '11v11';
  startersPerTeam: number;
  maxSubstitutesPerTeam: number;
  requiredPositions: PositionAbbreviation[];
  maxPlayers: number;
}

// Position Types
export interface PositionZone {
  id: number;
  abbreviation: 'POR' | 'DEF' | 'MED' | 'DEL';
  name_es: string;
  name_en: string;
  is_active: boolean;
  created_at: string;
}

export interface PositionSpecific {
  id: number;
  abbreviation:
    | 'LD'
    | 'LI'
    | 'DFC'
    | 'CAI'
    | 'CAD'
    | 'MCD'
    | 'MC'
    | 'MCO'
    | 'MD'
    | 'MI'
    | 'ED'
    | 'EI'
    | 'DC'
    | 'SD';
  name_es: string;
  name_en: string;
  zone_id: number;
  description_es?: string;
  description_en?: string;
  is_active: boolean;
  created_at: string;
  zone: PositionZone;
}

export type PositionAbbreviation = PositionZone['abbreviation'] | PositionSpecific['abbreviation'];

// Player Types
export interface Player {
  id: number;
  user_id: number;
  team_id?: number;
  position_zone_id: number;
  position_specific_id?: number;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  jersey_number?: number;
  height?: number; // en centímetros
  weight?: number; // en kilogramos
  skill_level: number; // 1-10
  is_active: boolean;
  is_guest?: boolean; // Indica si es un jugador invitado manual
  created_at: string;
  updated_at?: string;
  position_zone: PositionZone;
  position_specific?: PositionSpecific;
  team?: Team;
  user?: User;
  // Estadísticas de habilidades (opcionales)
  rit?: number; // Ritmo
  tir?: number; // Tiro
  pas?: number; // Pase
  reg?: number; // Regate
  defense?: number; // Defensa
  fis?: number; // Físico
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'supervisor' | 'jugador' | 'invitado';
  teamId?: string; // equipo asignado (para supervisor, jugador, invitado)
  createdAt: Date;
  updatedAt: Date;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  captainId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'captain' | 'player' | 'coach';
  joinedAt: Date;
  user: User;
}

// Match Types
export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  location: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  homeScore?: number;
  awayScore?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  homeTeam: Team;
  awayTeam: Team;
}

export interface MatchPlayer {
  id: string;
  matchId: string;
  userId: string;
  status: 'confirmed' | 'pending' | 'declined';
  position?: string;
  user: User;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  teamId: string;
  amount: number;
  type: 'subscription' | 'match' | 'equipment' | 'other';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

// Post Types (Social Features)
export interface Post {
  id: string;
  userId: string;
  teamId?: string;
  content: string;
  mediaUrls?: string[];
  likes: string[]; // User IDs
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateTeamForm {
  name: string;
  description?: string;
  logo?: File;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
}

export interface UpdateTeamRequest {
  name: string;
  description: string;
}

export interface CreateMatchForm {
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  location: string;
  notes?: string;
}

// Filter Types
export interface MatchFilters {
  status?: Match['status'];
  dateFrom?: Date;
  dateTo?: Date;
  teamId?: string;
}

export interface PaymentFilters {
  status?: Payment['status'];
  type?: Payment['type'];
  dateFrom?: Date;
  dateTo?: Date;
}
