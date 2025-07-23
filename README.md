# ⚽ Formación ProSoccer

Plataforma digital integral para fútbol amateur y de barrio.

## 🚀 Descripción

**Formación ProSoccer** es una plataforma web completa diseñada específicamente para el fútbol amateur. Simplifica la organización de partidos, fomenta la camaradería del equipo y asegura una gestión financiera fluida para los clubes de fútbol amateur.

## ✨ Características Principales

- 🏟️ **Organización de Partidos**: Creación y gestión intuitiva de partidos
- 👥 **Gestión de Equipos**: Administración completa de equipos y jugadores
- 📅 **Calendario Inteligente**: Organización de eventos y horarios
- 💰 **Gestión Financiera**: Control de cuotas, gastos y presupuestos
- 📱 **Interfaz Responsive**: Diseño optimizado para móvil y desktop
- 🔐 **Autenticación Segura**: Sistema de login y registro seguro

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React empresarial
- **TypeScript** - Tipado estático
- **Chakra UI** - Sistema de diseño
- **React Query** - Gestión de estado del servidor
- **Zustand** - Gestión de estado local
- **React Hook Form** - Formularios optimizados

### Backend (Próximamente)
- **Node.js + Express** - API REST
- **PostgreSQL** - Base de datos
- **Prisma ORM** - Gestión de base de datos
- **JWT** - Autenticación

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Detencio/FormacionProSoccer.git
   cd FormacionProSoccer
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus configuraciones
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📝 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en modo producción
- `npm run lint` - Ejecutar linter
- `npm run test` - Ejecutar tests
- `npm run test:coverage` - Tests con cobertura

## 🏗️ Estructura del Proyecto

```
src/
├── app/                 # App Router (Next.js 14)
├── components/          # Componentes reutilizables
├── lib/                # Utilidades y configuración
├── store/              # Estado global (Zustand)
├── types/              # Tipos TypeScript
├── hooks/              # Custom hooks
└── utils/              # Funciones utilitarias
```

## 🧪 Testing

El proyecto incluye configuración completa de testing:

- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **Cobertura de código** - >80% requerida

```bash
npm run test           # Ejecutar tests
npm run test:watch     # Tests en modo watch
npm run test:coverage  # Tests con cobertura
```

## 📚 Documentación

- [Guía de Desarrollo](./docs/development.md)
- [API Documentation](./docs/api.md)
- [Componentes](./docs/components.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Detencio** - Desarrollador Principal

## 📞 Contacto

- Email: datencio.trabajo@gmail.com
- GitHub: [@Detencio](https://github.com/Detencio)

---

⭐ Si te gusta este proyecto, ¡dale una estrella! 