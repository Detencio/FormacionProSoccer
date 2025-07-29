from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    full_name: str | None = None
    phone: Optional[str] = None
    is_player: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: int
    full_name: str | None = None
    phone: Optional[str] = None
    is_admin: bool = False
    is_player: bool = False
    must_change_password: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Position Schemas
class PositionZoneBase(BaseModel):
    abbreviation: str
    name_es: str
    name_en: str
    is_active: bool = True

class PositionZoneOut(PositionZoneBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PositionSpecificBase(BaseModel):
    abbreviation: str
    name_es: str
    name_en: str
    zone_id: int
    description_es: Optional[str] = None
    description_en: Optional[str] = None
    is_active: bool = True

class PositionSpecificOut(PositionSpecificBase):
    id: int
    created_at: datetime
    zone: PositionZoneOut

    class Config:
        from_attributes = True

# Team Schemas
class TeamBase(BaseModel):
    name: str
    city: Optional[str] = None
    country: Optional[str] = None
    founded: Optional[int] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    founded: Optional[int] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None

class TeamOut(TeamBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    player_count: Optional[int] = 0

    class Config:
        from_attributes = True

# Player Schemas
class PlayerBase(BaseModel):
    # Sistema de posiciones por zona y específicas
    position_zone_id: int
    position_specific_id: Optional[int] = None
    
    # Información personal
    name: str
    email: EmailStr
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    nationality: Optional[str] = None
    
    # Información física y técnica
    jersey_number: Optional[int] = None
    height: Optional[int] = None  # en centímetros
    weight: Optional[int] = None  # en kilogramos
    skill_level: int = 5  # 1-10
    photo_url: Optional[str] = None  # URL de la foto del jugador
    
    # Habilidades específicas
    rit: Optional[int] = None  # Ritmo (1-100)
    tir: Optional[int] = None  # Tiro (1-100)
    pas: Optional[int] = None  # Pase (1-100)
    reg: Optional[int] = None  # Regate (1-100)
    defense: Optional[int] = None  # Defensa (1-100)
    fis: Optional[int] = None  # Físico (1-100)
    
    is_active: bool = True

class PlayerCreate(PlayerBase):
    user_id: int
    team_id: Optional[int] = None

class PlayerUpdate(BaseModel):
    team_id: Optional[int] = None
    position_zone_id: Optional[int] = None
    position_specific_id: Optional[int] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    nationality: Optional[str] = None
    jersey_number: Optional[int] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    skill_level: Optional[int] = None
    photo_url: Optional[str] = None  # URL de la foto del jugador
    # Habilidades específicas
    rit: Optional[int] = None
    tir: Optional[int] = None
    pas: Optional[int] = None
    reg: Optional[int] = None
    defense: Optional[int] = None
    fis: Optional[int] = None
    is_active: Optional[bool] = None

class PlayerOut(PlayerBase):
    id: int
    user_id: int
    team_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    user: UserOut
    team: Optional[TeamOut] = None
    position_zone: PositionZoneOut
    position_specific: Optional[PositionSpecificOut] = None

    class Config:
        from_attributes = True

# Team with Players
class TeamWithPlayers(TeamOut):
    players: List[PlayerOut] = []

# Player Registration (Formulario de registro)
class PlayerRegistration(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    position_zone: str  # POR, DEF, MED, DEL
    position_specific: Optional[str] = None  # LD, LI, DFC, etc.
    date_of_birth: Optional[date] = None
    nationality: Optional[str] = None
    jersey_number: Optional[int] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    skill_level: int = 5
    team_id: int

# ===== SISTEMA DE PARTIDOS =====

class VenueBase(BaseModel):
    name: str
    address: Optional[str] = None
    capacity: Optional[int] = None
    surface: str = 'grass'  # 'grass', 'artificial', 'indoor'
    facilities: Optional[str] = None

class VenueCreate(VenueBase):
    pass

class VenueUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    capacity: Optional[int] = None
    surface: Optional[str] = None
    facilities: Optional[str] = None

class VenueOut(VenueBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MatchBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    venue_id: Optional[int] = None
    match_type: str  # 'internal_friendly', 'external_friendly', 'championship'
    home_team_id: Optional[int] = None
    away_team_id: Optional[int] = None
    generated_team_a_id: Optional[int] = None
    generated_team_b_id: Optional[int] = None
    status: str = 'scheduled'  # 'scheduled', 'in_progress', 'finished', 'cancelled'
    home_score: Optional[int] = None
    away_score: Optional[int] = None

class MatchCreate(MatchBase):
    created_by: int

class MatchUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    venue_id: Optional[int] = None
    match_type: Optional[str] = None
    home_team_id: Optional[int] = None
    away_team_id: Optional[int] = None
    generated_team_a_id: Optional[int] = None
    generated_team_b_id: Optional[int] = None
    status: Optional[str] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None

class MatchOut(MatchBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    venue: Optional[VenueOut] = None
    home_team: Optional[TeamOut] = None
    away_team: Optional[TeamOut] = None
    generated_team_a: Optional[TeamOut] = None
    generated_team_b: Optional[TeamOut] = None
    creator: UserOut

    class Config:
        from_attributes = True

class PlayerAttendanceBase(BaseModel):
    match_id: int
    player_id: int
    status: str = 'pending'  # 'confirmed', 'declined', 'pending', 'maybe'
    notes: Optional[str] = None

class PlayerAttendanceCreate(PlayerAttendanceBase):
    pass

class PlayerAttendanceUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class PlayerAttendanceOut(PlayerAttendanceBase):
    id: int
    confirmed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    player: PlayerOut
    match: MatchOut

    class Config:
        from_attributes = True

class MatchEventBase(BaseModel):
    match_id: int
    player_id: int
    event_type: str  # 'goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'injury'
    minute: int
    team_side: str  # 'home', 'away'
    description: Optional[str] = None

class MatchEventCreate(MatchEventBase):
    pass

class MatchEventUpdate(BaseModel):
    event_type: Optional[str] = None
    minute: Optional[int] = None
    team_side: Optional[str] = None
    description: Optional[str] = None

class MatchEventOut(MatchEventBase):
    id: int
    timestamp: datetime
    player: PlayerOut
    match: MatchOut

    class Config:
        from_attributes = True

class ChampionshipBase(BaseModel):
    name: str
    season: str
    start_date: datetime
    end_date: datetime
    status: str = 'upcoming'  # 'upcoming', 'active', 'finished'
    points_for_win: int = 3
    points_for_draw: int = 1
    points_for_loss: int = 0
    max_players_per_team: int = 11
    min_players_per_team: int = 7
    substitution_limit: int = 3

class ChampionshipCreate(ChampionshipBase):
    pass

class ChampionshipUpdate(BaseModel):
    name: Optional[str] = None
    season: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    points_for_win: Optional[int] = None
    points_for_draw: Optional[int] = None
    points_for_loss: Optional[int] = None
    max_players_per_team: Optional[int] = None
    min_players_per_team: Optional[int] = None
    substitution_limit: Optional[int] = None

class ChampionshipOut(ChampionshipBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ChampionshipTeamBase(BaseModel):
    championship_id: int
    team_id: int
    played: int = 0
    won: int = 0
    drawn: int = 0
    lost: int = 0
    goals_for: int = 0
    goals_against: int = 0
    points: int = 0
    position: Optional[int] = None

class ChampionshipTeamCreate(ChampionshipTeamBase):
    pass

class ChampionshipTeamUpdate(BaseModel):
    played: Optional[int] = None
    won: Optional[int] = None
    drawn: Optional[int] = None
    lost: Optional[int] = None
    goals_for: Optional[int] = None
    goals_against: Optional[int] = None
    points: Optional[int] = None
    position: Optional[int] = None

class ChampionshipTeamOut(ChampionshipTeamBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    championship: ChampionshipOut
    team: TeamOut

    class Config:
        from_attributes = True

class ExternalTeamBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    description: Optional[str] = None
    level: str = 'intermediate'  # 'beginner', 'intermediate', 'advanced', 'professional'
    contact_name: str
    contact_email: EmailStr
    contact_phone: Optional[str] = None

class ExternalTeamCreate(ExternalTeamBase):
    pass

class ExternalTeamUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None

class ExternalTeamOut(ExternalTeamBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    type: str  # 'match_invitation', 'attendance_reminder', 'match_update', 'championship_announcement'
    title: str
    message: str
    recipient_id: int
    match_id: Optional[int] = None
    read: bool = False
    expires_at: Optional[datetime] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    read: Optional[bool] = None
    expires_at: Optional[datetime] = None

class NotificationOut(NotificationBase):
    id: int
    created_at: datetime
    recipient: UserOut
    match: Optional[MatchOut] = None

    class Config:
        from_attributes = True

# ===== SCHEMAS PARA INTEGRACIÓN CON TEAM GENERATOR =====

class MatchWithAttendance(MatchOut):
    attendance: List[PlayerAttendanceOut] = []

class MatchWithEvents(MatchOut):
    events: List[MatchEventOut] = []

class MatchWithFullDetails(MatchOut):
    attendance: List[PlayerAttendanceOut] = []
    events: List[MatchEventOut] = []
