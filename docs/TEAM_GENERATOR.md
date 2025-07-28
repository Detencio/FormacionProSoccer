# 🎮 Team Generator - Documentación Técnica Completa

## 🎯 **Descripción General**

El **Team Generator** es el módulo más avanzado y revolucionario de **Formación
Pro Soccer**. Este sistema inteligente permite generar equipos equilibrados para
diferentes tipos de partidos, con funcionalidades únicas como cancha
interactiva, sistema de intercambios y preservación de posiciones
personalizadas.

### **Características Destacadas**

- 🏆 **Generación inteligente** de equipos equilibrados
- 🎮 **Cancha interactiva** con drag & drop
- 🔄 **Sistema de intercambios** suplente ↔ titular
- 💾 **Posiciones personalizadas** preservadas
- 📱 **Compartir equipos** con imágenes dinámicas
- 👥 **Jugadores invitados** temporales
- 🎯 **Selección masiva** de jugadores
- 🏟️ **Tipos de juego flexibles** (5v5, 7v7, 11v11)

---

## 🏗️ **Arquitectura Técnica**

### **Estructura de Componentes**

```
src/components/team-generator/
├── TeamManager.tsx          # Componente principal
├── FootballField.tsx        # Cancha interactiva
├── PlayerCard.tsx           # Tarjetas de jugadores
├── PlayerList.tsx           # Lista de jugadores
├── PlayerPreviewModal.tsx   # Modal de detalles
├── AddManualPlayerModal.tsx # Agregar jugadores invitados
├── SwapPlayerModal.tsx      # Modal de intercambios
└── TeamStats.tsx           # Estadísticas de equipos
```

### **Custom Hooks**

```
src/hooks/
├── useTeamGenerator.ts      # Lógica principal del generador
└── useAuth.ts              # Autenticación y roles
```

### **Utilidades**

```
src/utils/
├── teamDistribution.ts      # Algoritmos de distribución
└── utils.ts                # Utilidades generales
```

---

## 🎮 **Funcionalidades Principales**

### **1. Tipos de Juego Flexibles**

#### **BabyFutbol (5v5) - Partidos Amistosos**

```typescript
const GAME_CONFIGURATIONS = {
  '5v5': {
    name: 'BabyFutbol',
    label: 'Amistoso',
    formation: '1-2-2',
    maxPlayers: 10,
    positions: ['ARQ', 'DEF', 'DEF', 'DEL', 'DEL'],
    isInternalMatch: true,
  },
};
```

#### **Futbolito (7v7) - Partidos Amistosos**

```typescript
'7v7': {
  name: 'Futbolito',
  label: 'Amistoso',
  formation: '2-3-1',
  maxPlayers: 14,
  positions: ['ARQ', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'DEL'],
  isInternalMatch: true
}
```

#### **Fútbol 11 (11v11) - Partidos Oficiales**

```typescript
'11v11': {
  name: 'Fútbol 11',
  label: 'Oficial',
  formation: '4-4-2',
  maxPlayers: 22,
  positions: ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'DEL', 'DEL'],
  isInternalMatch: false
}
```

### **2. Cancha Interactiva**

#### **Implementación de Drag & Drop**

```typescript
// FootballField.tsx
const handleMouseDown = (e: React.MouseEvent, player: Player) => {
  e.preventDefault();
  e.stopPropagation();

  setDraggedPlayer(player);
  setDragStart({ x: e.clientX, y: e.clientY });

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};
```

#### **Cálculo de Posiciones**

```typescript
const calculatePosition = (clientX: number, clientY: number) => {
  const rect = fieldRef.current?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };

  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;

  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
};
```

### **3. Sistema de Posiciones Personalizadas**

#### **Estado de Posiciones**

```typescript
interface CustomPosition {
  x: number; // Porcentaje X (0-100)
  y: number; // Porcentaje Y (0-100)
  role: 'starter' | 'substitute';
  zone: 'goalkeeper' | 'defense' | 'midfield' | 'attack';
}

const [customPositions, setCustomPositions] = useState<{
  [playerId: number]: CustomPosition;
}>({});
```

#### **Preservación Durante Swaps**

```typescript
const handleSwapConfirm = (substituteId: number, starterId: number) => {
  // Transferir posiciones personalizadas
  setCustomPositions(prev => {
    const newPositions = { ...prev };
    const substitutePosition = newPositions[substituteId];
    const starterPosition = newPositions[starterId];

    delete newPositions[substituteId];
    delete newPositions[starterId];

    if (substitutePosition) {
      newPositions[starterId] = substitutePosition;
    }
    if (starterPosition) {
      newPositions[substituteId] = starterPosition;
    }

    return newPositions;
  });
};
```

### **4. Algoritmos de Distribución**

#### **Distribución para Partidos Amistosos (5v5/7v7)**

```typescript
const calculateTeamDistribution = (players: Player[], gameType: string) => {
  const isInternalMatch = ['5v5', '7v7'].includes(gameType);

  if (isInternalMatch) {
    // Distribución flexible para partidos amistosos
    const shuffledPlayers = shuffleArray([...players]);
    const midPoint = Math.ceil(shuffledPlayers.length / 2);

    const teamA = shuffledPlayers.slice(0, midPoint);
    const teamB = shuffledPlayers.slice(midPoint);

    // Distribuir suplentes aleatoriamente
    const remainingPlayers = players.filter(
      p => !teamA.includes(p) && !teamB.includes(p)
    );

    // Distribución aleatoria y potencialmente desigual
    remainingPlayers.forEach(player => {
      if (Math.random() > 0.5) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    });

    return { teamA, teamB };
  }
};
```

#### **Distribución para Partidos Oficiales (11v11)**

```typescript
const strictPositionDistribution = (players: Player[]) => {
  // Separar por posiciones
  const goalkeepers = players.filter(p => p.position === 'POR');
  const defenders = players.filter(p => p.position === 'DEF');
  const midfielders = players.filter(p => p.position === 'MED');
  const forwards = players.filter(p => p.position === 'DEL');

  // Asignar 1 portero por equipo
  const teamA = [goalkeepers[0]];
  const teamB = [goalkeepers[1]];

  // Distribuir resto por habilidades
  const remainingPlayers = [...defenders, ...midfielders, ...forwards];
  const sortedBySkill = remainingPlayers.sort(
    (a, b) => calculateAverageSkill(b) - calculateAverageSkill(a)
  );

  // Distribución alternada para balance
  sortedBySkill.forEach((player, index) => {
    if (index % 2 === 0) {
      teamA.push(player);
    } else {
      teamB.push(player);
    }
  });

  return { teamA, teamB };
};
```

### **5. Sistema de Intercambios**

#### **SwapPlayerModal Component**

```typescript
interface SwapPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  substitute: Player;
  starters: Player[];
  onConfirm: (substituteId: number, starterId: number) => void;
}
```

#### **Lógica de Intercambio**

```typescript
const swapTwoPlayers = (substituteId: number, starterId: number) => {
  const substitute = findPlayerById(substituteId);
  const starter = findPlayerById(starterId);

  if (!substitute || !starter) return;

  // Crear nuevas referencias para React
  const newDistribution = {
    ...distribution,
    starters: distribution.starters.map(p =>
      p.id === starterId ? substitute : p
    ),
    substitutes: distribution.substitutes.map(p =>
      p.id === substituteId ? starter : p
    ),
  };

  setDistribution(newDistribution);
};
```

### **6. Generación de Imágenes para Compartir**

#### **Canvas API Implementation**

```typescript
const generateTeamsImage = async (
  teams: TeamDistribution,
  formation: Formation
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 600;

  // Fondo
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Formación Pro Soccer', canvas.width / 2, 40);

  // Equipos
  drawTeam(ctx, teams.teamA, 'Equipo A', 50, 100);
  drawTeam(ctx, teams.teamB, 'Equipo B', 50, 350);

  // Formación
  ctx.fillStyle = '#888888';
  ctx.font = '16px Arial';
  ctx.fillText(`Formación: ${formation.name}`, canvas.width / 2, 580);

  return new Promise<Blob>(resolve => {
    canvas.toBlob(blob => {
      resolve(blob!);
    }, 'image/png');
  });
};
```

### **7. Jugadores Invitados**

#### **AddManualPlayerModal**

```typescript
interface ManualPlayer {
  name: string;
  position: string;
  skill_level: number;
  is_guest: boolean;
}

const handleAddManualPlayer = (playerData: ManualPlayer) => {
  const newPlayer: Player = {
    id: Date.now(), // ID temporal
    name: playerData.name,
    position: playerData.position,
    skill_level: playerData.skill_level,
    is_guest: true,
    // ... otros campos
  };

  setManualPlayers(prev => [...prev, newPlayer]);
};
```

### **8. Selección Masiva**

#### **Funciones de Selección**

```typescript
const selectAllPlayers = () => {
  setSelectedPlayers(allPlayers.map(p => p.id));
};

const deselectAllPlayers = () => {
  setSelectedPlayers([]);
};

const selectByPosition = (position: string) => {
  const positionPlayers = allPlayers.filter(p => p.position === position);
  setSelectedPlayers(positionPlayers.map(p => p.id));
};

const selectRandomPlayers = (count: number) => {
  const shuffled = shuffleArray([...allPlayers]);
  setSelectedPlayers(shuffled.slice(0, count).map(p => p.id));
};
```

---

## 🎨 **Diseño y UX**

### **Principios de Diseño**

- **Sobrio y Profesional**: Alejado de estética de videojuego
- **Información Esencial**: Solo datos relevantes en tarjetas
- **Interacción Intuitiva**: Drag & drop natural
- **Feedback Visual**: Estados claros de selección

### **Tarjetas de Jugadores**

```typescript
// PlayerCard.tsx - Diseño optimizado
const PlayerCard = memo(({ player, isSelected, onSelect, onDeselect }) => {
  return (
    <div className={`
      relative overflow-hidden rounded-lg border-2 transition-all
      ${isSelected
        ? 'border-blue-500 bg-blue-50 shadow-lg'
        : 'border-gray-200 bg-white hover:border-gray-300'
      }
    `}>
      {/* Nombre y Posición */}
      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100">
        <h3 className="font-semibold text-gray-800">{player.name}</h3>
        <p className="text-sm text-gray-600">{player.position}</p>
      </div>

      {/* Habilidades en una fila */}
      <div className="p-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Rit</span><span>Tir</span><span>Pas</span><span>Con</span><span>Def</span><span>Fis</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">{player.rit || 0}</span>
          <span className="text-sm font-medium">{player.tir || 0}</span>
          <span className="text-sm font-medium">{player.pas || 0}</span>
          <span className="text-sm font-medium">{player.con || 0}</span>
          <span className="text-sm font-medium">{player.def || 0}</span>
          <span className="text-sm font-medium">{player.fis || 0}</span>
        </div>
      </div>

      {/* Nivel de habilidad */}
      <div className="absolute top-2 right-2">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{player.skill_level}</span>
        </div>
      </div>
    </div>
  )
})
```

---

## 🔧 **Configuración y Optimización**

### **Performance Optimizations**

```typescript
// React.memo para componentes pesados
const PlayerCard = memo(PlayerCardComponent);

// useCallback para funciones estables
const handlePlayerSelect = useCallback((playerId: number) => {
  setSelectedPlayers(prev => [...prev, playerId]);
}, []);

// useMemo para cálculos costosos
const filteredPlayers = useMemo(() => {
  return allPlayers.filter(player => {
    if (teamFilter && player.team !== teamFilter) return false;
    if (positionFilter && player.position !== positionFilter) return false;
    return true;
  });
}, [allPlayers, teamFilter, positionFilter]);
```

### **Estado Global**

```typescript
// useTeamGenerator.ts
interface TeamGeneratorState {
  selectedPlayers: number[];
  manualPlayers: Player[];
  distribution: TeamDistribution | null;
  isGenerating: boolean;
  gameType: string;
  formation: Formation | null;
  teamError: string | null;
}

const useTeamGenerator = () => {
  const [state, setState] = useState<TeamGeneratorState>({
    selectedPlayers: [],
    manualPlayers: [],
    distribution: null,
    isGenerating: false,
    gameType: '5v5',
    formation: null,
    teamError: null,
  });

  // ... lógica del hook
};
```

---

## 🧪 **Testing y Debugging**

### **Debug Information**

```typescript
// DebugInfo.tsx
const DebugInfo = ({ distribution, customPositions }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs">
      <h4 className="font-bold mb-2">Debug Info</h4>
      <div>Team A: {distribution?.teamA?.length || 0} players</div>
      <div>Team B: {distribution?.teamB?.length || 0} players</div>
      <div>Custom Positions: {Object.keys(customPositions).length}</div>
    </div>
  )
}
```

### **Error Handling**

```typescript
const handleGenerateTeams = async () => {
  try {
    setIsGenerating(true);
    setTeamError(null);

    const result = await generateTeams(selectedPlayers, gameType);
    setDistribution(result);
  } catch (error) {
    setTeamError(error.message);
    showNotification('Error al generar equipos', 'error');
  } finally {
    setIsGenerating(false);
  }
};
```

---

## 📊 **Métricas y Analytics**

### **Eventos de Tracking**

```typescript
const trackTeamGeneration = (gameType: string, playerCount: number) => {
  // Analytics tracking
  console.log('Team Generated:', {
    gameType,
    playerCount,
    timestamp: new Date().toISOString(),
  });
};

const trackPlayerSwap = (fromRole: string, toRole: string) => {
  console.log('Player Swapped:', {
    fromRole,
    toRole,
    timestamp: new Date().toISOString(),
  });
};
```

---

## 🚀 **Futuras Mejoras**

### **Funcionalidades Planificadas**

1. **IA Predictiva**: Sugerencias de alineaciones basadas en rendimiento
2. **Historial de Equipos**: Guardar y cargar configuraciones anteriores
3. **Estadísticas Avanzadas**: Métricas de rendimiento por equipo
4. **Exportación PDF**: Reportes profesionales de equipos
5. **Integración con APIs**: Datos de ligas oficiales
6. **Modo Offline**: Funcionamiento sin conexión
7. **Notificaciones Push**: Alertas de cambios en equipos
8. **Gamificación**: Sistema de logros y badges

### **Mejoras Técnicas**

1. **WebSockets**: Actualizaciones en tiempo real
2. **Service Workers**: Caching avanzado
3. **WebGL**: Renderizado 3D de cancha
4. **Machine Learning**: Predicción de resultados
5. **PWA**: Progressive Web App completa

---

## 📚 **Referencias y Recursos**

### **Documentación Relacionada**

- [DEPENDENCIES.md](DEPENDENCIES.md) - Dependencias del proyecto
- [DEVELOPMENT.md](DEVELOPMENT.md) - Guía de desarrollo
- [API.md](API.md) - Documentación de API

### **Tecnologías Utilizadas**

- **React 18**: Hooks y componentes
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos y diseño
- **Canvas API**: Generación de imágenes
- **localStorage**: Persistencia local

---

## 🎯 **Conclusión**

El **Team Generator** representa la funcionalidad más avanzada y revolucionaria
de **Formación Pro Soccer**. Con su combinación de algoritmos inteligentes,
interfaz interactiva y funcionalidades únicas, proporciona una experiencia de
usuario excepcional para la organización de partidos de fútbol.

El sistema está diseñado para ser escalable, mantenible y extensible,
permitiendo futuras mejoras y nuevas funcionalidades sin comprometer la
estabilidad del código existente.

**Estado**: ✅ **Completamente Funcional** **Última Actualización**: Julio 2025
**Versión**: 1.0.0
