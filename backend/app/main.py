from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from . import models, schemas, crud, auth, database
from .database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    return crud.create_user(db, user)

@app.post("/create-admin", response_model=schemas.UserOut)
def create_admin(email: str, password: str, full_name: str = None, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    return crud.create_admin_user(db, email, password, full_name)

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=schemas.Token)
def login_with_email(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": schemas.UserOut.from_orm(user)}

from fastapi import Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    print(f"🔍 DEBUG - get_current_user llamado con token: {credentials.credentials[:20]}...")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        print(f"🔍 DEBUG - Token decodificado, email: {email}")
        if email is None:
            print("❌ ERROR - Token no contiene email")
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError as e:
        print(f"❌ ERROR - Error decodificando token: {e}")
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = crud.get_user_by_email(db, email)
    if user is None:
        print(f"❌ ERROR - Usuario {email} no encontrado en BD")
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    
    print(f"✅ DEBUG - Usuario autenticado: {user.email}, is_admin: {user.is_admin}")
    return user

@app.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# Team routes
@app.post("/teams/", response_model=schemas.TeamOut)
def create_team(team: schemas.TeamCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden crear equipos")
    return crud.create_team(db, team)

@app.get("/teams/", response_model=list[schemas.TeamOut])
def get_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.is_admin:
        return crud.get_teams_with_player_count(db, skip=skip, limit=limit)
    else:
        # Jugadores solo ven su equipo
        player = crud.get_player_by_user_id(db, current_user.id)
        if player and player.team_id:
            team = crud.get_team(db, player.team_id)
            return [team] if team else []
        return []

@app.get("/teams/{team_id}", response_model=schemas.TeamWithPlayers)
def get_team(team_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.is_admin:
        team = crud.get_team_with_players(db, team_id)
    else:
        # Jugadores solo pueden ver su equipo
        player = crud.get_player_by_user_id(db, current_user.id)
        if not player or player.team_id != team_id:
            raise HTTPException(status_code=403, detail="No tienes acceso a este equipo")
        team = crud.get_team_with_players(db, team_id)
    
    if not team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return team

@app.put("/teams/{team_id}", response_model=schemas.TeamOut)
def update_team(team_id: int, team: schemas.TeamUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden actualizar equipos")
    db_team = crud.update_team(db, team_id, team)
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return db_team

@app.delete("/teams/{team_id}")
def delete_team(team_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden eliminar equipos")
    success = crud.delete_team(db, team_id)
    if not success:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return {"message": "Equipo eliminado"}

# Player routes
@app.post("/players/", response_model=schemas.PlayerOut)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden crear jugadores")
    return crud.create_player(db, player)

@app.get("/players/", response_model=list[schemas.PlayerOut])
def get_players(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.is_admin:
        # Admin ve todos los jugadores
        return db.query(models.Player).offset(skip).limit(limit).all()
    else:
        # Jugadores solo ven jugadores de su equipo
        player = crud.get_player_by_user_id(db, current_user.id)
        if player and player.team_id:
            return crud.get_players_by_team(db, player.team_id)
        return []

@app.get("/team-generator/players/", response_model=list[schemas.PlayerOut])
def get_players_for_team_generator(
    team_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get players for team generator with role-based filtering"""
    
    # Filtrar jugadores según el rol del usuario
    query = db.query(models.Player)
    
    if current_user.role == "admin":
        # Administradores ven todos los jugadores
        if team_id:
            query = query.filter(models.Player.team_id == team_id)
    elif current_user.role == "supervisor":
        # Supervisores solo ven jugadores de su equipo
        if current_user.team_id:
            query = query.filter(models.Player.team_id == current_user.team_id)
        else:
            # Si no tiene equipo asignado, no puede ver jugadores
            return []
    elif current_user.role == "player":
        # Jugadores solo ven jugadores de su equipo
        player_profile = db.query(models.Player).filter(models.Player.user_id == current_user.id).first()
        if player_profile and player_profile.team_id:
            query = query.filter(models.Player.team_id == player_profile.team_id)
        else:
            return []
    elif current_user.role == "guest":
        # Invitados no pueden ver jugadores para generar equipos
        return []
    else:
        # Rol no reconocido
        return []
    
    return query.all()

@app.get("/team-generator/teams/", response_model=list[schemas.TeamOut])
def get_teams_for_team_generator(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get teams for team generator with role-based filtering"""
    
    if current_user.role == "admin":
        # Administradores ven todos los equipos
        return crud.get_teams(db)
    elif current_user.role == "supervisor":
        # Supervisores solo ven su equipo
        if current_user.team_id:
            team = crud.get_team(db, current_user.team_id)
            return [team] if team else []
        return []
    elif current_user.role == "player":
        # Jugadores solo ven su equipo
        player_profile = db.query(models.Player).filter(models.Player.user_id == current_user.id).first()
        if player_profile and player_profile.team_id:
            team = crud.get_team(db, player_profile.team_id)
            return [team] if team else []
        return []
    elif current_user.role == "guest":
        # Invitados no pueden ver equipos para generar
        return []
    else:
        return []

@app.get("/players/{player_id}", response_model=schemas.PlayerOut)
def get_player(player_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.is_admin:
        player = crud.get_player(db, player_id)
    else:
        # Jugadores solo pueden ver jugadores de su equipo
        current_player = crud.get_player_by_user_id(db, current_user.id)
        if not current_player or not current_player.team_id:
            raise HTTPException(status_code=403, detail="No tienes acceso a este jugador")
        
        player = crud.get_player(db, player_id)
        if not player or player.team_id != current_player.team_id:
            raise HTTPException(status_code=403, detail="No tienes acceso a este jugador")
    
    if not player:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return player

@app.put("/players/{player_id}", response_model=schemas.PlayerOut)
def update_player(player_id: int, player: schemas.PlayerUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    print(f"🔍 DEBUG - Endpoint PUT /players/{player_id} llamado")
    print(f"🔍 DEBUG - Usuario autenticado: {current_user.email if current_user else 'None'}")
    print(f"🔍 DEBUG - Datos recibidos en backend: player_id={player_id}")
    print(f"🔍 DEBUG - Player data completo: {player.dict()}")
    print(f"🔍 DEBUG - Campos específicos recibidos:")
    print(f"  - name: {player.name}")
    print(f"  - email: {player.email}")
    print(f"  - phone: {player.phone}")
    print(f"  - date_of_birth: {player.date_of_birth}")
    print(f"  - nationality: {player.nationality}")
    print(f"  - position_zone_id: {player.position_zone_id}")
    print(f"  - position_specific_id: {player.position_specific_id}")
    print(f"  - jersey_number: {player.jersey_number}")
    print(f"  - skill_level: {player.skill_level}")
    print(f"  - height: {player.height}")
    print(f"  - weight: {player.weight}")
    print(f"  - photo_url: {player.photo_url}")
    print(f"  - is_active: {player.is_active}")
    print(f"  - Habilidades específicas:")
    print(f"    * rit: {player.rit}")
    print(f"    * tir: {player.tir}")
    print(f"    * pas: {player.pas}")
    print(f"    * reg: {player.reg}")
    print(f"    * defense: {player.defense}")
    print(f"    * fis: {player.fis}")
    
    if not current_user.is_admin:
        print(f"❌ ERROR - Usuario {current_user.email} no es admin")
        raise HTTPException(status_code=403, detail="Solo administradores pueden actualizar jugadores")
    
    print(f"✅ DEBUG - Usuario {current_user.email} es admin, procediendo con actualización")
    
    # Verificar si el jugador existe
    db_player = crud.get_player(db, player_id)
    if not db_player:
        print(f"❌ ERROR - Jugador {player_id} no encontrado")
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    
    print(f"✅ DEBUG - Jugador {player_id} encontrado: {db_player.name}")
    print(f"✅ DEBUG - Email actual del jugador: {db_player.email}")
    
    # Verificar si el email ya existe en otro jugador
    if player.email and player.email != db_player.email:
        existing_player = db.query(models.Player).filter(
            models.Player.email == player.email,
            models.Player.id != player_id
        ).first()
        if existing_player:
            print(f"❌ ERROR - Email {player.email} ya existe en jugador {existing_player.id}")
            raise HTTPException(status_code=422, detail=f"El email {player.email} ya está registrado por otro jugador")
    
    try:
        print(f"✅ DEBUG - Procediendo con actualización en CRUD")
        print(f"✅ DEBUG - Datos a actualizar: {player.dict()}")
        
        # Validar que position_specific_id existe si se está enviando
        if player.position_specific_id is not None:
            specific_position = crud.get_position_specific_by_id(db, player.position_specific_id)
            if not specific_position:
                print(f"❌ ERROR - Position specific ID {player.position_specific_id} no existe")
                # Obtener todos los IDs disponibles para debug
                all_specifics = db.query(models.PositionSpecific).filter(models.PositionSpecific.is_active == True).all()
                available_ids = [s.id for s in all_specifics]
                print(f"🔍 DEBUG - IDs disponibles en position_specifics: {available_ids}")
                raise HTTPException(status_code=422, detail=f"La posición específica con ID {player.position_specific_id} no existe. IDs disponibles: {available_ids}")
            print(f"✅ DEBUG - Position specific validada: {specific_position.abbreviation}")
        
        # Validar que position_zone_id existe
        if player.position_zone_id is not None:
            zone_position = crud.get_position_zone_by_id(db, player.position_zone_id)
            if not zone_position:
                print(f"❌ ERROR - Position zone ID {player.position_zone_id} no existe")
                # Obtener todos los IDs disponibles para debug
                all_zones = db.query(models.PositionZone).filter(models.PositionZone.is_active == True).all()
                available_zone_ids = [z.id for z in all_zones]
                print(f"🔍 DEBUG - IDs disponibles en position_zones: {available_zone_ids}")
                raise HTTPException(status_code=422, detail=f"La zona de posición con ID {player.position_zone_id} no existe. IDs disponibles: {available_zone_ids}")
            print(f"✅ DEBUG - Position zone validada: {zone_position.abbreviation}")
        
        print(f"✅ DEBUG - Llamando a crud.update_player con player_id={player_id}")
        db_player = crud.update_player(db, player_id, player)
        print(f"✅ DEBUG - Jugador {player_id} actualizado exitosamente")
        return db_player
    except HTTPException:
        # Re-lanzar HTTPExceptions sin modificar
        raise
    except Exception as e:
        print(f"❌ ERROR - Excepción al actualizar jugador: {e}")
        print(f"❌ ERROR - Tipo de excepción: {type(e)}")
        import traceback
        print(f"❌ ERROR - Traceback completo:")
        traceback.print_exc()
        
        # Determinar el tipo de error y dar un mensaje más específico
        error_message = str(e)
        if "ForeignKeyViolation" in error_message:
            if "position_specific_id" in error_message:
                raise HTTPException(status_code=422, detail=f"La posición específica con ID {player.position_specific_id} no existe en la base de datos")
            elif "position_zone_id" in error_message:
                raise HTTPException(status_code=422, detail=f"La zona de posición con ID {player.position_zone_id} no existe en la base de datos")
            else:
                raise HTTPException(status_code=422, detail=f"Error de clave foránea: {error_message}")
        elif "UniqueViolation" in error_message:
            raise HTTPException(status_code=422, detail=f"El email {player.email} ya está registrado por otro jugador")
        else:
            raise HTTPException(status_code=422, detail=f"Error al actualizar jugador: {error_message}")

@app.delete("/players/{player_id}")
def delete_player(player_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden eliminar jugadores")
    success = crud.delete_player(db, player_id)
    if not success:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return {"message": "Jugador eliminado"}

@app.post("/players/{player_id}/assign/{team_id}")
def assign_player_to_team(player_id: int, team_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden asignar jugadores")
    player = crud.assign_player_to_team(db, player_id, team_id)
    if not player:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return {"message": "Jugador asignado al equipo"}

@app.post("/players/{player_id}/remove")
def remove_player_from_team(player_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden remover jugadores")
    player = crud.remove_player_from_team(db, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return {"message": "Jugador removido del equipo"}

# Position routes
@app.get("/positions/zones/", response_model=list[schemas.PositionZoneOut])
def get_position_zones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all position zones"""
    return crud.get_position_zones(db, skip=skip, limit=limit)

@app.get("/positions/zones/{abbreviation}", response_model=schemas.PositionZoneOut)
def get_position_zone_by_abbreviation(abbreviation: str, db: Session = Depends(get_db)):
    """Get position zone by abbreviation"""
    zone = crud.get_position_zone_by_abbreviation(db, abbreviation)
    if not zone:
        raise HTTPException(status_code=404, detail="Zona de posición no encontrada")
    return zone

@app.get("/positions/specifics/", response_model=list[schemas.PositionSpecificOut])
def get_position_specifics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all position specifics"""
    return crud.get_position_specifics(db, skip=skip, limit=limit)

@app.get("/positions/specifics/zone/{zone_id}", response_model=list[schemas.PositionSpecificOut])
def get_position_specifics_by_zone(zone_id: int, db: Session = Depends(get_db)):
    """Get position specifics by zone"""
    specifics = crud.get_position_specifics_by_zone(db, zone_id)
    return specifics

@app.get("/positions/specifics/{abbreviation}", response_model=schemas.PositionSpecificOut)
def get_position_specific_by_abbreviation(abbreviation: str, db: Session = Depends(get_db)):
    """Get position specific by abbreviation"""
    specific = crud.get_position_specific_by_abbreviation(db, abbreviation)
    if not specific:
        raise HTTPException(status_code=404, detail="Posición específica no encontrada")
    return specific

# Player registration with positions
@app.post("/players/register/", response_model=schemas.PlayerOut)
def register_player(player_data: schemas.PlayerRegistration, db: Session = Depends(get_db)):
    """Register a new player with position information"""
    # Verificar que la zona de posición existe
    zone = crud.get_position_zone_by_abbreviation(db, player_data.position_zone)
    if not zone:
        raise HTTPException(status_code=400, detail="Zona de posición inválida")
    
    # Verificar que la posición específica existe si se proporciona
    specific_id = None
    if player_data.position_specific:
        specific = crud.get_position_specific_by_abbreviation(db, player_data.position_specific)
        if not specific:
            raise HTTPException(status_code=400, detail="Posición específica inválida")
        if specific.zone_id != zone.id:
            raise HTTPException(status_code=400, detail="La posición específica no pertenece a la zona seleccionada")
        specific_id = specific.id
    
    # Crear usuario primero
    user_data = schemas.UserCreate(
        email=player_data.email,
        password="temp_password_123",  # El usuario deberá cambiar su contraseña
        full_name=player_data.full_name,
        phone=player_data.phone,
        is_player=True
    )
    
    # Verificar si el usuario ya existe
    existing_user = crud.get_user_by_email(db, player_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    user = crud.create_user(db, user_data)
    
    # Crear jugador
    player_data_dict = player_data.dict()
    player_data_dict["user_id"] = user.id
    player_data_dict["position_zone_id"] = zone.id
    player_data_dict["position_specific_id"] = specific_id
    
    # Remover campos que no van al modelo Player
    del player_data_dict["position_zone"]
    del player_data_dict["position_specific"]
    del player_data_dict["full_name"]
    del player_data_dict["team_id"]
    
    player_create = schemas.PlayerCreate(**player_data_dict)
    player = crud.create_player(db, player_create)
    
    return player
