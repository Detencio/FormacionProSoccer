# 🚀 FormacionProSoccer - Guía de Inicio

## 📋 Requisitos Previos

- **Python 3.8+** con pip instalado
- **Node.js 16+** con npm instalado
- **PostgreSQL** configurado y corriendo

## 🎯 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

**Windows (Batch):**
```bash
start-servers.bat
```

**Windows (PowerShell):**
```powershell
.\start-servers.ps1
```

### Opción 2: Manual

**1. Iniciar Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**2. Iniciar Frontend (nueva terminal):**
```bash
npm run dev
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 👤 Credenciales de Prueba

- **Email**: `admin@prosoccer.com`
- **Password**: `123456`

## 🔧 Funcionalidades Disponibles

### ✅ Implementadas
- ✅ **Autenticación**: Login/Logout con JWT
- ✅ **Gestión de Equipos**: Crear, editar, eliminar equipos
- ✅ **Gestión de Jugadores**: Agregar, editar, eliminar jugadores
- ✅ **Interfaz Responsive**: Diseño moderno y funcional
- ✅ **Datos Simulados**: Funciona sin backend para pruebas

### 🚧 En Desarrollo
- 🔄 **Matches (Partidos)**: Próximamente
- 🔄 **Payments (Pagos)**: Próximamente
- 🔄 **Dashboard Avanzado**: Próximamente

## 🛠️ Solución de Problemas

### Error: "No module named 'app'"
```bash
# Asegúrate de estar en el directorio backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Error: "Port 3000 is in use"
El frontend automáticamente usará el puerto 3001. Accede a:
http://localhost:3001

### Error: "Error al cargar los equipos"
La aplicación usa datos simulados cuando el backend no está disponible. Los equipos de ejemplo incluyen:
- Real Madrid (con Cristiano Ronaldo y Luka Modric)
- Barcelona FC (con Lionel Messi)

## 📁 Estructura del Proyecto

```
FormacionProSoccer/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── main.py         # Rutas principales
│   │   ├── models.py       # Modelos SQLAlchemy
│   │   ├── schemas.py      # Esquemas Pydantic
│   │   ├── crud.py         # Operaciones CRUD
│   │   └── auth.py         # Autenticación JWT
│   └── requirements.txt
├── src/                     # Frontend Next.js
│   ├── app/                # Páginas de la aplicación
│   ├── components/         # Componentes React
│   ├── services/           # Servicios API
│   └── store/              # Estado global
├── start-servers.bat       # Script de inicio (Windows)
├── start-servers.ps1       # Script de inicio (PowerShell)
└── README-SERVERS.md       # Esta guía
```

## 🎉 ¡Listo para Usar!

Una vez que ambos servidores estén corriendo:

1. **Ve a**: http://localhost:3000
2. **Haz login** con las credenciales de prueba
3. **Navega a Teams** para gestionar equipos y jugadores
4. **¡Disfruta de la aplicación!**

---

**Desarrollado con ❤️ para FormacionProSoccer** 