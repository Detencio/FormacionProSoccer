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
