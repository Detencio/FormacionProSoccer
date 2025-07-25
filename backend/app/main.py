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
    allow_origins=["*"],  # Cambia esto en producción
    allow_credentials=True,
    allow_methods=["*"],
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
    return {"access_token": access_token, "token_type": "bearer"}

from fastapi import Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = crud.get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
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
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Solo administradores pueden actualizar jugadores")
    db_player = crud.update_player(db, player_id, player)
    if not db_player:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return db_player

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
