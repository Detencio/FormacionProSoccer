from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    full_name: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    full_name: str | None = None
    is_admin: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Team Schemas
class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
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
    is_active: bool = True

class PlayerCreate(PlayerBase):
    user_id: int
    team_id: Optional[int] = None

class PlayerUpdate(BaseModel):
    team_id: Optional[int] = None
    position: Optional[str] = None
    jersey_number: Optional[int] = None
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
