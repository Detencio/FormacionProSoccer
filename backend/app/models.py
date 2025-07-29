from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)  # Agregado campo teléfono
    is_admin = Column(Boolean, default=False)
    is_player = Column(Boolean, default=False)  # Agregado para identificar jugadores
    role = Column(String, default="player")  # admin, supervisor, player, guest
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)  # Para supervisores
    must_change_password = Column(Boolean, default=False)  # Para cambio obligatorio de contraseña
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relación con equipo (para supervisores)
    team = relationship("Team", backref="supervisors")

class PositionZone(Base):
    __tablename__ = "position_zones"
    id = Column(Integer, primary_key=True, index=True)
    abbreviation = Column(String(3), unique=True, nullable=False)  # POR, DEF, MED, DEL
    name_es = Column(String(20), nullable=False)
    name_en = Column(String(20), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relación con posiciones específicas
    specific_positions = relationship("PositionSpecific", back_populates="zone")

class PositionSpecific(Base):
    __tablename__ = "position_specifics"
    id = Column(Integer, primary_key=True, index=True)
    abbreviation = Column(String(3), unique=True, nullable=False)  # LD, LI, DFC, etc.
    name_es = Column(String(20), nullable=False)
    name_en = Column(String(20), nullable=False)
    zone_id = Column(Integer, ForeignKey("position_zones.id"), nullable=False)
    description_es = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relación con zona
    zone = relationship("PositionZone", back_populates="specific_positions")

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    founded = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relación con jugadores
    players = relationship("Player", back_populates="team")

class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    # Sistema de posiciones por zona y específicas
    position_zone_id = Column(Integer, ForeignKey("position_zones.id"), nullable=False)
    position_specific_id = Column(Integer, ForeignKey("position_specifics.id"), nullable=True)
    
    # Información personal
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    nationality = Column(String, nullable=True)
    
    # Información física y técnica
    jersey_number = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)  # en centímetros
    weight = Column(Integer, nullable=True)  # en kilogramos
    skill_level = Column(Integer, nullable=False, default=5)  # 1-10
    photo_url = Column(String, nullable=True)  # URL de la foto del jugador
    
    # Habilidades específicas
    rit = Column(Integer, nullable=True)  # Ritmo (1-100)
    tir = Column(Integer, nullable=True)  # Tiro (1-100)
    pas = Column(Integer, nullable=True)  # Pase (1-100)
    reg = Column(Integer, nullable=True)  # Regate (1-100)
    defense = Column(Integer, nullable=True)  # Defensa (1-100)
    fis = Column(Integer, nullable=True)  # Físico (1-100)
    
    # Estado
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    user = relationship("User", backref="player_profile")
    team = relationship("Team", back_populates="players")
    position_zone = relationship("PositionZone")
    position_specific = relationship("PositionSpecific")

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    
    # Información básica del partido
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    date = Column(DateTime(timezone=True), nullable=False)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=True)
    
    # Tipo de partido según las condiciones especificadas
    match_type = Column(String(50), nullable=False)  # 'internal_friendly', 'external_friendly', 'championship'
    
    # Equipos (pueden ser generados o específicos)
    home_team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    away_team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    # Para partidos internos con equipos generados
    generated_team_a_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    generated_team_b_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    # Estado del partido
    status = Column(String(50), default='scheduled')  # 'scheduled', 'in_progress', 'finished', 'cancelled'
    
    # Puntuación
    home_score = Column(Integer, nullable=True)
    away_score = Column(Integer, nullable=True)
    
    # Metadatos
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    venue = relationship("Venue")
    home_team = relationship("Team", foreign_keys=[home_team_id])
    away_team = relationship("Team", foreign_keys=[away_team_id])
    generated_team_a = relationship("Team", foreign_keys=[generated_team_a_id])
    generated_team_b = relationship("Team", foreign_keys=[generated_team_b_id])
    creator = relationship("User", foreign_keys=[created_by])
    
    # Relaciones inversas
    attendance = relationship("PlayerAttendance", back_populates="match")
    events = relationship("MatchEvent", back_populates="match")

class Venue(Base):
    __tablename__ = "venues"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=True)
    capacity = Column(Integer, nullable=True)
    surface = Column(String(50), default='grass')  # 'grass', 'artificial', 'indoor'
    facilities = Column(Text, nullable=True)  # JSON string de facilidades
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PlayerAttendance(Base):
    __tablename__ = "player_attendance"
    id = Column(Integer, primary_key=True, index=True)
    
    # Relaciones
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    
    # Estado de asistencia
    status = Column(String(50), default='pending')  # 'confirmed', 'declined', 'pending', 'maybe'
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Metadatos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    match = relationship("Match", back_populates="attendance")
    player = relationship("Player")

class MatchEvent(Base):
    __tablename__ = "match_events"
    id = Column(Integer, primary_key=True, index=True)
    
    # Relaciones
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    
    # Información del evento
    event_type = Column(String(50), nullable=False)  # 'goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'injury'
    minute = Column(Integer, nullable=False)
    team_side = Column(String(10), nullable=False)  # 'home', 'away'
    description = Column(Text, nullable=True)
    
    # Metadatos
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    match = relationship("Match", back_populates="events")
    player = relationship("Player")

class Championship(Base):
    __tablename__ = "championships"
    id = Column(Integer, primary_key=True, index=True)
    
    # Información básica
    name = Column(String(255), nullable=False)
    season = Column(String(50), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default='upcoming')  # 'upcoming', 'active', 'finished'
    
    # Reglas del campeonato
    points_for_win = Column(Integer, default=3)
    points_for_draw = Column(Integer, default=1)
    points_for_loss = Column(Integer, default=0)
    max_players_per_team = Column(Integer, default=11)
    min_players_per_team = Column(Integer, default=7)
    substitution_limit = Column(Integer, default=3)
    
    # Metadatos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ChampionshipTeam(Base):
    __tablename__ = "championship_teams"
    id = Column(Integer, primary_key=True, index=True)
    
    # Relaciones
    championship_id = Column(Integer, ForeignKey("championships.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    
    # Estadísticas del equipo en el campeonato
    played = Column(Integer, default=0)
    won = Column(Integer, default=0)
    drawn = Column(Integer, default=0)
    lost = Column(Integer, default=0)
    goals_for = Column(Integer, default=0)
    goals_against = Column(Integer, default=0)
    points = Column(Integer, default=0)
    position = Column(Integer, nullable=True)
    
    # Metadatos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    championship = relationship("Championship")
    team = relationship("Team")

class ExternalTeam(Base):
    __tablename__ = "external_teams"
    id = Column(Integer, primary_key=True, index=True)
    
    # Información básica
    name = Column(String(255), nullable=False)
    logo_url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    level = Column(String(50), default='intermediate')  # 'beginner', 'intermediate', 'advanced', 'professional'
    
    # Información de contacto
    contact_name = Column(String(255), nullable=False)
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(50), nullable=True)
    
    # Metadatos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    
    # Información básica
    type = Column(String(50), nullable=False)  # 'match_invitation', 'attendance_reminder', 'match_update', 'championship_announcement'
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    
    # Destinatario
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relación con partido (opcional)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=True)
    
    # Estado
    read = Column(Boolean, default=False)
    
    # Metadatos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relaciones
    recipient = relationship("User")
    match = relationship("Match")
