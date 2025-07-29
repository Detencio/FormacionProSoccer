from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from passlib.context import CryptContext
from typing import List, Optional
from datetime import datetime

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

# Position functions
def get_position_zones(db: Session, skip: int = 0, limit: int = 100):
    """Get all position zones"""
    return db.query(models.PositionZone).filter(models.PositionZone.is_active == True).offset(skip).limit(limit).all()

def get_position_zone_by_abbreviation(db: Session, abbreviation: str):
    """Get position zone by abbreviation"""
    return db.query(models.PositionZone).filter(
        models.PositionZone.abbreviation == abbreviation,
        models.PositionZone.is_active == True
    ).first()

def get_position_specifics(db: Session, skip: int = 0, limit: int = 100):
    """Get all position specifics"""
    return db.query(models.PositionSpecific).filter(models.PositionSpecific.is_active == True).offset(skip).limit(limit).all()

def get_position_specifics_by_zone(db: Session, zone_id: int):
    """Get position specifics by zone"""
    return db.query(models.PositionSpecific).filter(
        models.PositionSpecific.zone_id == zone_id,
        models.PositionSpecific.is_active == True
    ).all()

def get_position_specific_by_abbreviation(db: Session, abbreviation: str):
    """Get position specific by abbreviation"""
    return db.query(models.PositionSpecific).filter(
        models.PositionSpecific.abbreviation == abbreviation,
        models.PositionSpecific.is_active == True
    ).first()

def get_position_specific_by_id(db: Session, specific_id: int):
    """Get position specific by ID"""
    return db.query(models.PositionSpecific).filter(
        models.PositionSpecific.id == specific_id,
        models.PositionSpecific.is_active == True
    ).first()

def get_position_zone_by_id(db: Session, zone_id: int):
    """Get position zone by ID"""
    return db.query(models.PositionZone).filter(
        models.PositionZone.id == zone_id,
        models.PositionZone.is_active == True
    ).first()

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

def get_all_players(db: Session, skip: int = 0, limit: int = 100):
    """Get all players with position information"""
    return db.query(models.Player).filter(models.Player.is_active == True).offset(skip).limit(limit).all()

def get_players_by_position_zone(db: Session, zone_id: int):
    """Get players by position zone"""
    return db.query(models.Player).filter(
        models.Player.position_zone_id == zone_id,
        models.Player.is_active == True
    ).all()

def get_players_by_position_specific(db: Session, specific_id: int):
    """Get players by position specific"""
    return db.query(models.Player).filter(
        models.Player.position_specific_id == specific_id,
        models.Player.is_active == True
    ).all()

def update_player(db: Session, player_id: int, player: schemas.PlayerUpdate):
    db_player = get_player(db, player_id)
    if db_player:
        update_data = player.dict(exclude_unset=True)
        print(f"🔍 DEBUG - CRUD update_player: player_id={player_id}")
        print(f"🔍 DEBUG - CRUD update_data: {update_data}")
        print(f"🔍 DEBUG - CRUD nationality en update_data: {update_data.get('nationality')}")
        
        for field, value in update_data.items():
            print(f"🔍 DEBUG - CRUD actualizando campo {field}: {value}")
            setattr(db_player, field, value)
        
        print(f"🔍 DEBUG - CRUD nationality después de actualizar: {db_player.nationality}")
        db.commit()
        db.refresh(db_player)
        print(f"🔍 DEBUG - CRUD nationality después de refresh: {db_player.nationality}")
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

# ===== SISTEMA DE PARTIDOS =====

def create_venue(db: Session, venue: schemas.VenueCreate):
    db_venue = models.Venue(**venue.dict())
    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)
    return db_venue

def get_venue(db: Session, venue_id: int):
    return db.query(models.Venue).filter(models.Venue.id == venue_id).first()

def get_venues(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Venue).offset(skip).limit(limit).all()

def update_venue(db: Session, venue_id: int, venue: schemas.VenueUpdate):
    db_venue = db.query(models.Venue).filter(models.Venue.id == venue_id).first()
    if db_venue:
        for field, value in venue.dict(exclude_unset=True).items():
            setattr(db_venue, field, value)
        db.commit()
        db.refresh(db_venue)
    return db_venue

def delete_venue(db: Session, venue_id: int):
    db_venue = db.query(models.Venue).filter(models.Venue.id == venue_id).first()
    if db_venue:
        db.delete(db_venue)
        db.commit()
    return db_venue

def create_match(db: Session, match: schemas.MatchCreate):
    db_match = models.Match(**match.dict())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

def get_match(db: Session, match_id: int):
    return db.query(models.Match).filter(models.Match.id == match_id).first()

def get_matches(db: Session, skip: int = 0, limit: int = 100, match_type: str = None, status: str = None):
    query = db.query(models.Match)
    
    if match_type:
        query = query.filter(models.Match.match_type == match_type)
    if status:
        query = query.filter(models.Match.status == status)
    
    return query.offset(skip).limit(limit).all()

def get_matches_by_team(db: Session, team_id: int):
    return db.query(models.Match).filter(
        (models.Match.home_team_id == team_id) | 
        (models.Match.away_team_id == team_id) |
        (models.Match.generated_team_a_id == team_id) |
        (models.Match.generated_team_b_id == team_id)
    ).all()

def update_match(db: Session, match_id: int, match: schemas.MatchUpdate):
    db_match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if db_match:
        for field, value in match.dict(exclude_unset=True).items():
            setattr(db_match, field, value)
        db.commit()
        db.refresh(db_match)
    return db_match

def delete_match(db: Session, match_id: int):
    db_match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if db_match:
        db.delete(db_match)
        db.commit()
    return db_match

def create_player_attendance(db: Session, attendance: schemas.PlayerAttendanceCreate):
    db_attendance = models.PlayerAttendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_player_attendance(db: Session, match_id: int):
    return db.query(models.PlayerAttendance).filter(models.PlayerAttendance.match_id == match_id).all()

def update_player_attendance(db: Session, attendance_id: int, attendance: schemas.PlayerAttendanceUpdate):
    db_attendance = db.query(models.PlayerAttendance).filter(models.PlayerAttendance.id == attendance_id).first()
    if db_attendance:
        for field, value in attendance.dict(exclude_unset=True).items():
            setattr(db_attendance, field, value)
        if attendance.status == 'confirmed':
            db_attendance.confirmed_at = datetime.utcnow()
        db.commit()
        db.refresh(db_attendance)
    return db_attendance

def get_confirmed_players_for_match(db: Session, match_id: int):
    return db.query(models.PlayerAttendance).filter(
        models.PlayerAttendance.match_id == match_id,
        models.PlayerAttendance.status == 'confirmed'
    ).all()

def create_match_event(db: Session, event: schemas.MatchEventCreate):
    db_event = models.MatchEvent(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_match_events(db: Session, match_id: int):
    return db.query(models.MatchEvent).filter(models.MatchEvent.match_id == match_id).order_by(models.MatchEvent.minute).all()

def create_championship(db: Session, championship: schemas.ChampionshipCreate):
    db_championship = models.Championship(**championship.dict())
    db.add(db_championship)
    db.commit()
    db.refresh(db_championship)
    return db_championship

def get_championship(db: Session, championship_id: int):
    return db.query(models.Championship).filter(models.Championship.id == championship_id).first()

def get_championships(db: Session, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(models.Championship)
    if status:
        query = query.filter(models.Championship.status == status)
    return query.offset(skip).limit(limit).all()

def update_championship(db: Session, championship_id: int, championship: schemas.ChampionshipUpdate):
    db_championship = db.query(models.Championship).filter(models.Championship.id == championship_id).first()
    if db_championship:
        for field, value in championship.dict(exclude_unset=True).items():
            setattr(db_championship, field, value)
        db.commit()
        db.refresh(db_championship)
    return db_championship

def create_championship_team(db: Session, championship_team: schemas.ChampionshipTeamCreate):
    db_championship_team = models.ChampionshipTeam(**championship_team.dict())
    db.add(db_championship_team)
    db.commit()
    db.refresh(db_championship_team)
    return db_championship_team

def get_championship_standings(db: Session, championship_id: int):
    return db.query(models.ChampionshipTeam).filter(
        models.ChampionshipTeam.championship_id == championship_id
    ).order_by(models.ChampionshipTeam.points.desc(), 
               (models.ChampionshipTeam.goals_for - models.ChampionshipTeam.goals_against).desc()).all()

def create_external_team(db: Session, external_team: schemas.ExternalTeamCreate):
    db_external_team = models.ExternalTeam(**external_team.dict())
    db.add(db_external_team)
    db.commit()
    db.refresh(db_external_team)
    return db_external_team

def get_external_team(db: Session, external_team_id: int):
    return db.query(models.ExternalTeam).filter(models.ExternalTeam.id == external_team_id).first()

def get_external_teams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ExternalTeam).offset(skip).limit(limit).all()

def update_external_team(db: Session, external_team_id: int, external_team: schemas.ExternalTeamUpdate):
    db_external_team = db.query(models.ExternalTeam).filter(models.ExternalTeam.id == external_team_id).first()
    if db_external_team:
        for field, value in external_team.dict(exclude_unset=True).items():
            setattr(db_external_team, field, value)
        db.commit()
        db.refresh(db_external_team)
    return db_external_team

def create_notification(db: Session, notification: schemas.NotificationCreate):
    db_notification = models.Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_user_notifications(db: Session, user_id: int, unread_only: bool = False):
    query = db.query(models.Notification).filter(models.Notification.recipient_id == user_id)
    if unread_only:
        query = query.filter(models.Notification.read == False)
    return query.order_by(models.Notification.created_at.desc()).all()

def mark_notification_as_read(db: Session, notification_id: int):
    db_notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if db_notification:
        db_notification.read = True
        db.commit()
        db.refresh(db_notification)
    return db_notification

# ===== FUNCIONES DE INTEGRACIÓN CON TEAM GENERATOR =====

def get_available_players_for_match(db: Session, match_id: int, team_id: int = None):
    """Obtiene jugadores disponibles para un partido, considerando asistencia confirmada"""
    confirmed_attendance = get_confirmed_players_for_match(db, match_id)
    confirmed_player_ids = [att.player_id for att in confirmed_attendance]
    
    query = db.query(models.Player).filter(models.Player.is_active == True)
    
    if team_id:
        query = query.filter(models.Player.team_id == team_id)
    
    if confirmed_player_ids:
        query = query.filter(models.Player.id.in_(confirmed_player_ids))
    
    return query.all()

def create_match_with_teams(db: Session, match_data: dict, team_a_players: list, team_b_players: list):
    """Crea un partido con equipos generados automáticamente"""
    # Crear el partido
    db_match = models.Match(**match_data)
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    
    # Crear equipos temporales para el partido
    team_a = models.Team(name=f"Equipo A - {db_match.title}", description="Equipo generado automáticamente")
    team_b = models.Team(name=f"Equipo B - {db_match.title}", description="Equipo generado automáticamente")
    
    db.add(team_a)
    db.add(team_b)
    db.commit()
    db.refresh(team_a)
    db.refresh(team_b)
    
    # Asignar jugadores a los equipos
    for player_id in team_a_players:
        player = db.query(models.Player).filter(models.Player.id == player_id).first()
        if player:
            player.team_id = team_a.id
    
    for player_id in team_b_players:
        player = db.query(models.Player).filter(models.Player.id == player_id).first()
        if player:
            player.team_id = team_b.id
    
    # Actualizar el partido con los equipos generados
    db_match.generated_team_a_id = team_a.id
    db_match.generated_team_b_id = team_b.id
    db.commit()
    db.refresh(db_match)
    
    return db_match
