from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from passlib.context import CryptContext
from typing import List, Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User functions
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_admin_user(db: Session, email: str, password: str, full_name: str = None):
    hashed_password = pwd_context.hash(password)
    db_user = models.User(email=email, hashed_password=hashed_password, full_name=full_name, is_admin=True)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not pwd_context.verify(password, user.hashed_password):
        return None
    return user

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# Team functions
def create_team(db: Session, team: schemas.TeamCreate):
    db_team = models.Team(**team.dict())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def get_team(db: Session, team_id: int):
    return db.query(models.Team).filter(models.Team.id == team_id).first()

def get_teams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Team).offset(skip).limit(limit).all()

def update_team(db: Session, team_id: int, team: schemas.TeamUpdate):
    db_team = get_team(db, team_id)
    if db_team:
        update_data = team.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_team, field, value)
        db.commit()
        db.refresh(db_team)
    return db_team

def delete_team(db: Session, team_id: int):
    db_team = get_team(db, team_id)
    if db_team:
        db.delete(db_team)
        db.commit()
        return True
    return False

def get_team_with_players(db: Session, team_id: int):
    return db.query(models.Team).filter(models.Team.id == team_id).first()

# Player functions
def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(**player.dict())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def get_player(db: Session, player_id: int):
    return db.query(models.Player).filter(models.Player.id == player_id).first()

def get_players_by_team(db: Session, team_id: int):
    return db.query(models.Player).filter(models.Player.team_id == team_id).all()

def get_player_by_user_id(db: Session, user_id: int):
    return db.query(models.Player).filter(models.Player.user_id == user_id).first()

def update_player(db: Session, player_id: int, player: schemas.PlayerUpdate):
    db_player = get_player(db, player_id)
    if db_player:
        update_data = player.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_player, field, value)
        db.commit()
        db.refresh(db_player)
    return db_player

def delete_player(db: Session, player_id: int):
    db_player = get_player(db, player_id)
    if db_player:
        db.delete(db_player)
        db.commit()
        return True
    return False

def assign_player_to_team(db: Session, player_id: int, team_id: int):
    db_player = get_player(db, player_id)
    if db_player:
        db_player.team_id = team_id
        db.commit()
        db.refresh(db_player)
        return db_player
    return None

def remove_player_from_team(db: Session, player_id: int):
    db_player = get_player(db, player_id)
    if db_player:
        db_player.team_id = None
        db.commit()
        db.refresh(db_player)
        return db_player
    return None

def get_teams_with_player_count(db: Session, skip: int = 0, limit: int = 100):
    """Get teams with player count"""
    teams = db.query(
        models.Team,
        func.count(models.Player.id).label('player_count')
    ).outerjoin(models.Player).group_by(models.Team.id).offset(skip).limit(limit).all()
    
    result = []
    for team, player_count in teams:
        team_dict = {
            'id': team.id,
            'name': team.name,
            'description': team.description,
            'logo_url': team.logo_url,
            'created_at': team.created_at,
            'updated_at': team.updated_at,
            'player_count': player_count
        }
        result.append(team_dict)
    
    return result
