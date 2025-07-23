from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

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
    position: Optional[str] = None
    jersey_number: Optional[int] = None
    age: Optional[int] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: bool = True

class PlayerCreate(PlayerBase):
    user_id: int
    team_id: Optional[int] = None

class PlayerUpdate(BaseModel):
    team_id: Optional[int] = None
    position: Optional[str] = None
    jersey_number: Optional[int] = None
    age: Optional[int] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None

class PlayerOut(PlayerBase):
    id: int
    user_id: int
    team_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    user: UserOut
    team: Optional[TeamOut] = None

    class Config:
        from_attributes = True

# Team with Players
class TeamWithPlayers(TeamOut):
    players: List[PlayerOut] = []

# Player Registration
class PlayerRegistration(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    position: str
    age: int
    team_id: int
    jersey_number: Optional[int] = None
