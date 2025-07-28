# 📦 Documentación de Dependencias - Formación Pro Soccer

## 🎯 **Resumen Ejecutivo**

Este documento detalla todas las dependencias utilizadas en el proyecto
**Formación Pro Soccer**, incluyendo su propósito, versión y configuración. El
proyecto utiliza un stack tecnológico moderno con **Next.js 14** para el
frontend y **FastAPI** para el backend.

---

## 🚀 **Frontend Dependencies (package.json)**

### **Core Framework**

| Dependencia  | Versión   | Propósito                   |
| ------------ | --------- | --------------------------- |
| `next`       | `14.2.30` | Framework React con SSR/SSG |
| `react`      | `^18`     | Biblioteca UI principal     |
| `react-dom`  | `^18`     | Renderizado React para DOM  |
| `typescript` | `^5`      | Tipado estático             |

### **Estado y Gestión de Datos**

| Dependencia             | Versión   | Propósito                     |
| ----------------------- | --------- | ----------------------------- |
| `@tanstack/react-query` | `^5.83.0` | Gestión de estado de servidor |
| `zustand`               | `^4.4.7`  | Gestión de estado global      |
| `swr`                   | `^2.2.4`  | Hooks para data fetching      |
| `react-query`           | `^3.39.3` | Legacy - migrar a @tanstack   |

### **UI/UX y Componentes**

| Dependencia                | Versión     | Propósito                   |
| -------------------------- | ----------- | --------------------------- |
| `tailwindcss`              | `^3.4.0`    | Framework CSS utility-first |
| `tailwindcss-animate`      | `^1.0.7`    | Animaciones para Tailwind   |
| `framer-motion`            | `^10.16.16` | Animaciones avanzadas       |
| `lucide-react`             | `^0.294.0`  | Iconos modernos             |
| `react-icons`              | `^5.5.0`    | Biblioteca de iconos        |
| `class-variance-authority` | `^0.7.0`    | Variantes de componentes    |
| `clsx`                     | `^2.0.0`    | Utilidad para clases CSS    |

### **Formularios y Validación**

| Dependencia           | Versión   | Propósito                 |
| --------------------- | --------- | ------------------------- |
| `react-hook-form`     | `^7.48.2` | Gestión de formularios    |
| `@hookform/resolvers` | `^3.3.2`  | Resolvers para validación |
| `zod`                 | `^3.22.4` | Validación de esquemas    |

### **HTTP y APIs**

| Dependencia   | Versión  | Propósito          |
| ------------- | -------- | ------------------ |
| `axios`       | `^1.6.2` | Cliente HTTP       |
| `@types/node` | `^20`    | Tipos para Node.js |

### **Utilidades y Herramientas**

| Dependencia       | Versión    | Propósito                  |
| ----------------- | ---------- | -------------------------- |
| `date-fns`        | `^2.30.0`  | Manipulación de fechas     |
| `react-hot-toast` | `^2.4.1`   | Notificaciones toast       |
| `recharts`        | `^3.1.0`   | Gráficos y visualizaciones |
| `autoprefixer`    | `^10.4.16` | Autoprefixer para CSS      |
| `postcss`         | `^8.4.32`  | Procesador CSS             |

---

## 🐍 **Backend Dependencies (requirements.txt)**

### **Framework y Servidor**

| Dependencia | Versión   | Propósito             |
| ----------- | --------- | --------------------- |
| `fastapi`   | `0.104.1` | Framework web moderno |
| `uvicorn`   | `0.24.0`  | Servidor ASGI         |

### **Base de Datos**

| Dependencia       | Versión  | Propósito         |
| ----------------- | -------- | ----------------- |
| `sqlalchemy`      | `1.4.53` | ORM para Python   |
| `psycopg2-binary` | `2.9.10` | Driver PostgreSQL |

### **Autenticación y Seguridad**

| Dependencia                 | Versión | Propósito              |
| --------------------------- | ------- | ---------------------- |
| `python-jose[cryptography]` | `3.4.0` | JWT tokens             |
| `passlib[bcrypt]`           | `1.7.4` | Hashing de contraseñas |

### **Configuración**

| Dependencia     | Versión | Propósito            |
| --------------- | ------- | -------------------- |
| `python-dotenv` | `1.0.0` | Variables de entorno |

---

## 🛠️ **Development Dependencies**

### **Testing**

| Dependencia                   | Versión   | Propósito                    |
| ----------------------------- | --------- | ---------------------------- |
| `jest`                        | `^29.7.0` | Framework de testing         |
| `jest-environment-jsdom`      | `^29.7.0` | Entorno DOM para Jest        |
| `@testing-library/jest-dom`   | `^6.1.5`  | Matchers para DOM            |
| `@testing-library/react`      | `^13.4.0` | Testing de componentes React |
| `@testing-library/user-event` | `^14.5.1` | Simulación de eventos        |
| `@playwright/test`            | `^1.40.0` | Testing E2E                  |
| `playwright`                  | `^1.40.0` | Automatización de navegador  |

### **Linting y Formateo**

| Dependencia                        | Versión   | Propósito                         |
| ---------------------------------- | --------- | --------------------------------- |
| `eslint`                           | `^8`      | Linter JavaScript/TypeScript      |
| `eslint-config-next`               | `14.2.30` | Configuración ESLint para Next.js |
| `@typescript-eslint/eslint-plugin` | `^6.13.2` | Plugin ESLint para TypeScript     |
| `@typescript-eslint/parser`        | `^6.13.2` | Parser TypeScript para ESLint     |
| `prettier`                         | `^3.1.0`  | Formateador de código             |

### **Git Hooks y Calidad**

| Dependencia   | Versión   | Propósito                  |
| ------------- | --------- | -------------------------- |
| `husky`       | `^8.0.3`  | Git hooks                  |
| `lint-staged` | `^15.2.0` | Linting de archivos staged |

### **Análisis y Optimización**

| Dependencia             | Versión    | Propósito                           |
| ----------------------- | ---------- | ----------------------------------- |
| `@next/bundle-analyzer` | `^14.2.30` | Análisis de bundle                  |
| `cross-env`             | `^7.0.3`   | Variables de entorno cross-platform |

---

## 📋 **Scripts Disponibles**

### **Desarrollo**

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
```

### **Testing**

```bash
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
npm run test:e2e     # Tests end-to-end
```

### **Calidad de Código**

```bash
npm run lint         # Linting
npm run lint:fix     # Linting con auto-fix
npm run format       # Formatear código
npm run format:check # Verificar formato
npm run type-check   # Verificar tipos TypeScript
```

### **Mantenimiento**

```bash
npm run clean        # Limpiar build
npm run clean:all    # Limpiar todo
npm run install:clean # Reinstalación limpia
```

### **Docker**

```bash
npm run docker:build # Construir imagen Docker
npm run docker:run   # Ejecutar contenedor
```

---

## 🔧 **Configuración de Entorno**

### **Variables de Entorno Requeridas**

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:9000
NEXT_PUBLIC_APP_NAME=Formación Pro Soccer

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/formacion_prosoccer
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### **Configuración de Base de Datos**

- **Tipo**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migraciones**: Alembic (recomendado)

---

## 🚨 **Dependencias Críticas**

### **Para Funcionamiento Básico**

1. `next` - Framework principal
2. `react` - UI library
3. `@tanstack/react-query` - Estado de servidor
4. `tailwindcss` - Estilos
5. `fastapi` - Backend API
6. `sqlalchemy` - Base de datos

### **Para Team Generator**

1. `recharts` - Gráficos del dashboard
2. `react-icons` - Iconos en componentes
3. `tailwindcss-animate` - Animaciones
4. `framer-motion` - Animaciones avanzadas

### **Para Testing**

1. `jest` - Framework de testing
2. `@testing-library/react` - Testing de componentes
3. `playwright` - Testing E2E

---

## 📊 **Análisis de Bundle**

### **Dependencias Más Pesadas**

1. `recharts` (~200KB) - Gráficos
2. `framer-motion` (~150KB) - Animaciones
3. `react-icons` (~100KB) - Iconos
4. `tailwindcss` (~50KB) - CSS framework

### **Optimizaciones Recomendadas**

1. **Code Splitting**: Implementar lazy loading
2. **Tree Shaking**: Eliminar código no usado
3. **Bundle Analysis**: Usar `npm run analyze`
4. **Image Optimization**: Usar Next.js Image component

---

## 🔄 **Actualización de Dependencias**

### **Comando de Actualización**

```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias
npm update

# Actualizar a últimas versiones
npm install package@latest

# Verificar vulnerabilidades
npm audit
npm audit fix
```

### **Política de Actualización**

- **Patch**: Automático (npm update)
- **Minor**: Revisión manual
- **Major**: Testing completo requerido

---

## 📝 **Notas de Mantenimiento**

### **Dependencias Problemáticas**

1. `react-query` - Migrar completamente a `@tanstack/react-query`
2. `@types/node` - Mantener actualizado con Node.js
3. `tailwindcss-animate` - Verificar compatibilidad

### **Dependencias Recomendadas**

1. `@tanstack/react-query` - Para gestión de estado
2. `zustand` - Para estado global simple
3. `recharts` - Para visualizaciones
4. `react-hook-form` - Para formularios

---

## 🎯 **Conclusión**

Este proyecto utiliza un stack tecnológico moderno y bien mantenido. Las
dependencias están organizadas por funcionalidad y cada una tiene un propósito
específico. Se recomienda mantener las dependencias actualizadas y realizar
auditorías de seguridad regularmente.

**Última actualización**: Julio 2025 **Versión del documento**: 1.0.0
