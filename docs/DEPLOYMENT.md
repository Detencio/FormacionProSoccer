# 🚀 Guía de Despliegue - ProSoccer Team Generator

## **Información del Proyecto**

**Proyecto:** Sistema de Gestión de Equipos y Jugadores de Fútbol  
**Versión:** 2.0  
**Fecha de Despliegue:** Julio 2025  
**Estado:** Producción  

---

## **1. Requisitos del Sistema**

### **1.1 Software Requerido**
```bash
# Node.js (Frontend)
Node.js >= 18.0.0
npm >= 9.0.0

# Python (Backend)
Python >= 3.13
pip >= 23.0.0

# Base de Datos
PostgreSQL >= 14.0
```

### **1.2 Puertos Requeridos**
- **Frontend:** 3000
- **Backend:** 9000
- **Base de Datos:** 5432

---

## **2. Instalación**

### **2.1 Clonar Repositorio**
```bash
git clone https://github.com/tu-usuario/prosoccer-team-generator.git
cd prosoccer-team-generator
```

### **2.2 Instalar Dependencias Frontend**
```bash
npm install
```

### **2.3 Instalar Dependencias Backend**
```bash
cd backend
pip install -r requirements.txt
```

### **2.4 Configurar Base de Datos**
```bash
# Crear base de datos
createdb prosoccer_db

# Verificar conexión
psql -d prosoccer_db -c "SELECT version();"
```

---

## **3. Configuración**

### **3.1 Variables de Entorno**
Crear archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/prosoccer_db

# JWT
SECRET_KEY=tu_clave_secreta_muy_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Servidores
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:9000
```

### **3.2 Configuración de Base de Datos**
```sql
-- Crear tablas (ejecutar en psql)
\i backend/schema.sql

-- Insertar datos iniciales
\i backend/initial_data.sql
```

---

## **4. Migraciones**

### **4.1 Ejecutar Scripts de Migración**
```bash
cd backend

# Insertar posiciones específicas
python final_insert.py

# Verificar estructura
python check_table.py
```

### **4.2 Crear Usuario Administrador**
```bash
cd backend
python create_admin.py
```

**Credenciales por defecto:**
- **Email:** admin@prosoccer.com
- **Password:** admin123

---

## **5. Despliegue**

### **5.1 Despliegue Manual**

#### **Opción 1: Script Automatizado (Recomendado)**
```bash
# En la raíz del proyecto
./start-simple.bat
```

#### **Opción 2: Despliegue Manual**
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 9000

# Terminal 2 - Frontend
npm run dev
```

### **5.2 Verificación de Servicios**
```bash
# Verificar puertos
netstat -an | findstr "3000"
netstat -an | findstr "9000"

# Verificar endpoints
curl http://localhost:9000/teams/
curl http://localhost:9000/players/
```

---

## **6. Acceso al Sistema**

### **6.1 URLs de Acceso**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:9000
- **Documentación API:** http://localhost:9000/docs
- **Team Generator:** http://localhost:3000/team-generator

### **6.2 Usuarios por Defecto**

#### **Administrador**
- **Email:** admin@prosoccer.com
- **Password:** admin123
- **Permisos:** Acceso completo

#### **Supervisor Matiz FC**
- **Email:** supervisor@matizfc.com
- **Password:** supervisor123
- **Permisos:** Solo jugadores de Matiz FC

---

## **7. Monitoreo**

### **7.1 Logs Importantes**
```bash
# Frontend logs
# Ver en consola del navegador (F12)

# Backend logs
# Ver en terminal donde se ejecuta uvicorn

# Base de datos logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

### **7.2 Verificación de Salud**
```bash
# Verificar frontend
curl -I http://localhost:3000

# Verificar backend
curl -I http://localhost:9000/teams/

# Verificar base de datos
psql -d prosoccer_db -c "SELECT COUNT(*) FROM players;"
```

---

## **8. Mantenimiento**

### **8.1 Backup de Base de Datos**
```bash
# Backup completo
pg_dump prosoccer_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup solo datos
pg_dump --data-only prosoccer_db > data_backup_$(date +%Y%m%d).sql

# Restaurar backup
psql prosoccer_db < backup_20250729_143022.sql
```

### **8.2 Limpieza de Logs**
```bash
# Limpiar logs antiguos
find /var/log -name "*.log" -mtime +30 -delete

# Limpiar backups antiguos
find . -name "backup_*.sql" -mtime +7 -delete
```

### **8.3 Actualización de Dependencias**
```bash
# Frontend
npm update
npm audit fix

# Backend
pip install --upgrade -r requirements.txt
```

---

## **9. Troubleshooting**

### **9.1 Problemas Comunes**

#### **Error: Puerto ocupado**
```bash
# Verificar procesos
netstat -ano | findstr :3000
netstat -ano | findstr :9000

# Terminar procesos
taskkill /PID <PID> /F
```

#### **Error: Base de datos no conecta**
```bash
# Verificar PostgreSQL
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

#### **Error: Módulo no encontrado**
```bash
# Verificar entorno virtual
python -c "import app"

# Reinstalar dependencias
pip install -r requirements.txt
```

### **9.2 Logs de Error**
```bash
# Backend errors
tail -f backend/logs/error.log

# Frontend errors
# Ver en consola del navegador
```

---

## **10. Seguridad**

### **10.1 Configuración de Seguridad**
```bash
# Cambiar contraseñas por defecto
psql -d prosoccer_db -c "UPDATE users SET hashed_password = 'nuevo_hash' WHERE email = 'admin@prosoccer.com';"

# Configurar firewall
sudo ufw allow 3000
sudo ufw allow 9000
```

### **10.2 Certificados SSL (Producción)**
```bash
# Generar certificados
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Configurar HTTPS
# Ver documentación de Next.js y FastAPI
```

---

## **11. Escalabilidad**

### **11.1 Configuración de Producción**
```bash
# Usar PM2 para Node.js
npm install -g pm2
pm2 start npm --name "prosoccer-frontend" -- run start

# Usar Gunicorn para Python
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### **11.2 Base de Datos**
```bash
# Configurar replicación
# Ver documentación de PostgreSQL

# Configurar pool de conexiones
# Ver documentación de SQLAlchemy
```

---

## **12. Rollback**

### **12.1 Procedimiento de Rollback**
```bash
# 1. Detener servicios
./kill-ports.bat

# 2. Restaurar backup
psql prosoccer_db < backup_anterior.sql

# 3. Revertir código
git checkout <commit_anterior>

# 4. Reiniciar servicios
./start-simple.bat
```

---

## **13. Documentación Adicional**

### **13.1 Enlaces Útiles**
- **API Documentation:** http://localhost:9000/docs
- **Swagger UI:** http://localhost:9000/redoc
- **GitHub Repository:** [URL del repositorio]

### **13.2 Contacto**
- **Equipo de Desarrollo:** [Email del equipo]
- **Soporte Técnico:** [Email de soporte]
- **Documentación:** [URL de documentación]

---

**Guía de Despliegue creada por:** Equipo de Desarrollo ProSoccer  
**Última actualización:** Julio 2025  
**Versión:** 2.0  

¡**Esta guía garantiza un despliegue exitoso y mantenimiento eficiente!** ⚽🚀✨ 