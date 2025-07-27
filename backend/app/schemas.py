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
