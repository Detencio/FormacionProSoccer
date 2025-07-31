# Implementación del Sistema de Refresh Token

## Problema Original
El sistema tenía un problema donde los tokens JWT expiraban después de 24 horas, causando errores de autenticación (`Signature has expired`) sin un mecanismo para renovarlos automáticamente.

## Solución Implementada

### 1. Backend - Configuración de Tokens

#### `backend/app/config.py`
```python
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 día
REFRESH_TOKEN_EXPIRE_DAYS = 30  # 30 días para refresh token
```

#### `backend/app/auth.py`
```python
def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def is_token_expired(payload: dict):
    if not payload:
        return True
    exp = payload.get("exp")
    if not exp:
        return True
    return datetime.utcnow().timestamp() > exp
```

### 2. Backend - Schemas Actualizados

#### `backend/app/schemas.py`
```python
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut
    refresh_token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str
```

### 3. Backend - Endpoints

#### `backend/app/main.py`
```python
@app.post("/auth/login", response_model=schemas.Token)
def login_with_email(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token = auth.create_access_token(data={"sub": user.email})
    refresh_token = auth.create_refresh_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": schemas.UserOut.from_orm(user), "refresh_token": refresh_token}

@app.post("/auth/refresh", response_model=schemas.RefreshTokenResponse)
def refresh_token(refresh_data: schemas.RefreshTokenRequest, db: Session = Depends(get_db)):
    # Verificar el refresh token
    payload = auth.verify_token(refresh_data.refresh_token)
    if not payload or auth.is_token_expired(payload):
        raise HTTPException(status_code=401, detail="Refresh token inválido o expirado")
    
    # Verificar que sea un refresh token
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Token no es un refresh token")
    
    # Obtener el usuario
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    
    # Crear nuevos tokens
    new_access_token = auth.create_access_token(data={"sub": user.email})
    new_refresh_token = auth.create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "refresh_token": new_refresh_token
    }
```

### 4. Frontend - Store Actualizado

#### `src/store/authStore.ts`
```typescript
interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: User, token?: string, refreshToken?: string) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: User) => void
  updateTokens: (token: string, refreshToken: string) => void
}
```

### 5. Frontend - Servicio de Autenticación

#### `src/services/authService.ts`
```typescript
async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
  try {
    console.log('🔍 DEBUG - Intentando refresh token')
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    console.log('🔍 DEBUG - Refresh token exitoso')
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token
    }
  } catch (error: any) {
    console.error('❌ ERROR - Error en refresh token:', error)
    throw this.handleError(error)
  }
}
```

### 6. Frontend - Interceptor Automático

#### `src/lib/api.ts`
```typescript
// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API: Respuesta exitosa:', response.config.url)
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Intentar refresh token automáticamente
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage)
          const refreshToken = authData.state?.refreshToken
          
          if (refreshToken && refreshToken !== 'fake-refresh-token') {
            console.log('API: Intentando refresh token automático')
            
            // Importar authService dinámicamente para evitar dependencias circulares
            const { authService } = await import('@/services/authService')
            
            try {
              const newTokens = await authService.refreshToken(refreshToken)
              
              // Actualizar el token en localStorage
              const updatedAuthData = {
                ...authData,
                state: {
                  ...authData.state,
                  token: newTokens.access_token,
                  refreshToken: newTokens.refresh_token
                }
              }
              localStorage.setItem('auth-storage', JSON.stringify(updatedAuthData))
              
              // Actualizar el store de Zustand
              const { useAuthStore } = await import('@/store/authStore')
              useAuthStore.getState().updateTokens(newTokens.access_token, newTokens.refresh_token)
              
              // Reintentar la petición original con el nuevo token
              error.config.headers.Authorization = `Bearer ${newTokens.access_token}`
              console.log('API: Reintentando petición con nuevo token')
              return api.request(error.config)
              
            } catch (refreshError) {
              console.error('API: Error en refresh token automático:', refreshError)
              // Si el refresh falla, limpiar el localStorage y redirigir a login
              localStorage.removeItem('auth-storage')
              const { useAuthStore } = await import('@/store/authStore')
              useAuthStore.getState().clearUser()
              if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login'
              }
            }
          } else {
            console.log('API: No hay refresh token válido, redirigiendo a login')
            localStorage.removeItem('auth-storage')
            const { useAuthStore } = await import('@/store/authStore')
            useAuthStore.getState().clearUser()
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
          }
        } catch (parseError) {
          console.error('API: Error parsing auth storage:', parseError)
          localStorage.removeItem('auth-storage')
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
      } else {
        console.log('API: No hay auth storage, redirigiendo a login')
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)
```

## Características del Sistema

### 1. **Tokens Duales**
- **Access Token**: Expira en 24 horas, usado para autenticación
- **Refresh Token**: Expira en 30 días, usado para renovar access tokens

### 2. **Renovación Automática**
- El interceptor detecta errores 401 automáticamente
- Intenta renovar el token sin interrumpir la experiencia del usuario
- Si falla, redirige al login

### 3. **Seguridad**
- Refresh tokens tienen un campo `type: "refresh"` para validación
- Verificación de expiración en el backend
- Limpieza automática de tokens inválidos

### 4. **Experiencia de Usuario**
- Renovación transparente sin interrupciones
- Fallback automático al login si es necesario
- Logs detallados para debugging

## Pruebas Realizadas

✅ **Login exitoso** - Genera access token y refresh token
✅ **Endpoint protegido** - Acceso con access token válido
✅ **Refresh token** - Renovación exitosa de tokens
✅ **Nuevo access token** - Funciona correctamente después del refresh

## Beneficios

1. **Eliminación del error "Signature has expired"**
2. **Experiencia de usuario mejorada** - No más interrupciones por tokens expirados
3. **Seguridad mantenida** - Tokens de corta duración con renovación automática
4. **Escalabilidad** - Sistema preparado para alta concurrencia

## Uso

El sistema funciona automáticamente. Los usuarios no necesitan hacer nada especial:

1. **Login normal** - Se obtienen ambos tokens
2. **Uso normal** - El interceptor maneja la renovación automáticamente
3. **Expiración** - Se renueva automáticamente sin interrupciones
4. **Fallback** - Si el refresh falla, se redirige al login

## Estado Actual

🟢 **COMPLETADO Y FUNCIONANDO**

El sistema de refresh token está completamente implementado y probado. El error original "Signature has expired" ha sido resuelto. 