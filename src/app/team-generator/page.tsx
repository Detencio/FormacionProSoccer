'use client'

import { useEffect, useState } from 'react'
import { Player } from '@/types'
import { useTeamGenerator } from '@/hooks/useTeamGenerator'
import PlayerList from '@/components/team-generator/PlayerList'
import TeamManager from '@/components/team-generator/TeamManager'
import { teamGeneratorService } from '@/services/teamGeneratorService'

// Datos mock para pruebas
const mockPlayers: Player[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+56912345678',
    skill_level: 4,
    user_id: 1,
    position_zone_id: 1,
    is_active: true,
    position_zone: { 
      id: 1, 
      abbreviation: 'DEF', 
      name_es: 'Defensa', 
      name_en: 'Defender',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: { 
      id: 1, 
      abbreviation: 'DFC', 
      name_es: 'Defensa Central', 
      name_en: 'Center Back',
      zone_id: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      zone: { id: 1, abbreviation: 'DEF', name_es: 'Defensa', name_en: 'Defender', is_active: true, created_at: new Date().toISOString() }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Carlos López',
    email: 'carlos@example.com',
    phone: '+56987654321',
    skill_level: 5,
    user_id: 2,
    position_zone_id: 2,
    is_active: true,
    position_zone: { 
      id: 2, 
      abbreviation: 'MED', 
      name_es: 'Mediocampista', 
      name_en: 'Midfielder',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: { 
      id: 2, 
      abbreviation: 'MC', 
      name_es: 'Mediocentro', 
      name_en: 'Center Midfielder',
      zone_id: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      zone: { id: 2, abbreviation: 'MED', name_es: 'Mediocampista', name_en: 'Midfielder', is_active: true, created_at: new Date().toISOString() }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Miguel Rodríguez',
    email: 'miguel@example.com',
    phone: '+56911223344',
    skill_level: 3,
    user_id: 3,
    position_zone_id: 3,
    is_active: true,
    position_zone: { 
      id: 3, 
      abbreviation: 'DEL', 
      name_es: 'Delantero', 
      name_en: 'Forward',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: { 
      id: 3, 
      abbreviation: 'DC', 
      name_es: 'Delantero Centro', 
      name_en: 'Center Forward',
      zone_id: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      zone: { id: 3, abbreviation: 'DEL', name_es: 'Delantero', name_en: 'Forward', is_active: true, created_at: new Date().toISOString() }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Andrés Silva',
    email: 'andres@example.com',
    phone: '+56955667788',
    skill_level: 6,
    user_id: 4,
    position_zone_id: 4,
    is_active: true,
    position_zone: { 
      id: 4, 
      abbreviation: 'POR', 
      name_es: 'Portero', 
      name_en: 'Goalkeeper',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: null as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Roberto Martínez',
    email: 'roberto@example.com',
    phone: '+56999887766',
    skill_level: 7,
    user_id: 5,
    position_zone_id: 1,
    is_active: true,
    position_zone: { 
      id: 1, 
      abbreviation: 'DEF', 
      name_es: 'Defensa', 
      name_en: 'Defender',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: { 
      id: 4, 
      abbreviation: 'LD', 
      name_es: 'Lateral Derecho', 
      name_en: 'Right Back',
      zone_id: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      zone: { id: 1, abbreviation: 'DEF', name_es: 'Defensa', name_en: 'Defender', is_active: true, created_at: new Date().toISOString() }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Diego González',
    email: 'diego@example.com',
    phone: '+56933445566',
    skill_level: 8,
    user_id: 6,
    position_zone_id: 2,
    is_active: true,
    position_zone: { 
      id: 2, 
      abbreviation: 'MED', 
      name_es: 'Mediocampista', 
      name_en: 'Midfielder',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: { 
      id: 5, 
      abbreviation: 'MCD', 
      name_es: 'Mediocentro Defensivo', 
      name_en: 'Defensive Midfielder',
      zone_id: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      zone: { id: 2, abbreviation: 'MED', name_es: 'Mediocampista', name_en: 'Midfielder', is_active: true, created_at: new Date().toISOString() }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Fernando Herrera',
    email: 'fernando@example.com',
    phone: '+56977889900',
    skill_level: 6,
    user_id: 7,
    position_zone_id: 1,
    is_active: true,
    position_zone: { 
      id: 1, 
      abbreviation: 'DEF', 
      name_es: 'Defensa', 
      name_en: 'Defender',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: { 
      id: 6, 
      abbreviation: 'LI', 
      name_es: 'Lateral Izquierdo', 
      name_en: 'Left Back',
      zone_id: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      zone: { id: 1, abbreviation: 'DEF', name_es: 'Defensa', name_en: 'Defender', is_active: true, created_at: new Date().toISOString() }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Luis Morales',
    email: 'luis@example.com',
    phone: '+56911223344',
    skill_level: 5,
    user_id: 8,
    position_zone_id: 2,
    is_active: true,
    position_zone: { 
      id: 2, 
      abbreviation: 'MED', 
      name_es: 'Mediocampista', 
      name_en: 'Midfielder',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: { 
      id: 7, 
      abbreviation: 'MD', 
      name_es: 'Volante por la Derecha', 
      name_en: 'Right Winger',
      zone_id: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      zone: { id: 2, abbreviation: 'MED', name_es: 'Mediocampista', name_en: 'Midfielder', is_active: true, created_at: new Date().toISOString() }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 9,
    name: 'Pedro Ramírez',
    email: 'pedro@example.com',
    phone: '+56955667788',
    skill_level: 4,
    user_id: 9,
    position_zone_id: 3,
    is_active: true,
    position_zone: { 
      id: 3, 
      abbreviation: 'DEL', 
      name_es: 'Delantero', 
      name_en: 'Forward',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: { 
      id: 8, 
      abbreviation: 'ED', 
      name_es: 'Extremo Derecho', 
      name_en: 'Right Winger',
      zone_id: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      zone: { id: 3, abbreviation: 'DEL', name_es: 'Delantero', name_en: 'Forward', is_active: true, created_at: new Date().toISOString() }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 10,
    name: 'Alejandro Torres',
    email: 'alejandro@example.com',
    phone: '+56999887766',
    skill_level: 7,
    user_id: 10,
    position_zone_id: 3,
    is_active: true,
    position_zone: { 
      id: 3, 
      abbreviation: 'DEL', 
      name_es: 'Delantero', 
      name_en: 'Forward',
      is_active: true,
      created_at: new Date().toISOString()
    },
    position_specific: { 
      id: 9, 
      abbreviation: 'EI', 
      name_es: 'Extremo Izquierdo', 
      name_en: 'Left Winger',
      zone_id: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      zone: { id: 3, abbreviation: 'DEL', name_es: 'Delantero', name_en: 'Forward', is_active: true, created_at: new Date().toISOString() }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function TeamGenerator() {
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [loadingTeams, setLoadingTeams] = useState(false)
  
  const {
    selectedPlayers,
    gameType,
    formation,
    distribution,
    setSelectedPlayers,
    setGameType,
    setFormation,
    generateTeams,
    movePlayer,
    regenerateTeams,
    clearSelection
  } = useTeamGenerator()

  // Cargar equipos disponibles
  useEffect(() => {
    const loadTeams = async () => {
      setLoadingTeams(true)
      try {
        const teams = await teamGeneratorService.getTeams()
        setTeams(teams)
        console.log('Equipos cargados:', teams)
      } catch (error) {
        console.error('Error cargando equipos:', error)
      } finally {
        setLoadingTeams(false)
      }
    }
    
    loadTeams()
  }, [])

  // Cargar jugadores reales del backend
  useEffect(() => {
    const loadRealPlayers = async () => {
      setLoadingPlayers(true)
      try {
        console.log('Cargando jugadores reales del backend...')
        const players = await teamGeneratorService.getPlayers(selectedTeamId || undefined)
        console.log('Jugadores cargados:', players)
        setAvailablePlayers(players)
      } catch (error) {
        console.error('Error cargando jugadores:', error)
        setError('Error al cargar jugadores del servidor')
        // Fallback a datos mock si hay error
        setAvailablePlayers(mockPlayers)
      } finally {
        setLoadingPlayers(false)
      }
    }
    
    loadRealPlayers()
  }, [selectedTeamId])

  // Guardar configuración cuando cambie
  useEffect(() => {
    const config = {
      selectedPlayers: selectedPlayers.map(p => p.id),
      gameType,
      formation
    }
    localStorage.setItem('teamGeneratorConfig', JSON.stringify(config))
  }, [selectedPlayers, gameType, formation])

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem('teamGeneratorConfig')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        if (config.selectedPlayers) {
          const players = availablePlayers.filter(p => config.selectedPlayers.includes(p.id))
          setSelectedPlayers(players)
        }
        if (config.gameType) setGameType(config.gameType as "5v5" | "7v7" | "11v11")
        if (config.formation) setFormation(config.formation as any)
      } catch (error) {
        console.error('Error loading saved config:', error)
      }
    }
  }, [availablePlayers, setSelectedPlayers, setGameType, setFormation])

  const handleGameTypeChange = (newGameType: string) => {
    setGameType(newGameType as "5v5" | "7v7" | "11v11")
    // Reset formation to default for new game type
    const defaultFormation = newGameType === '5v5' ? '2-2-1' : 
                           newGameType === '7v7' ? '3-2-1' : '4-4-2'
    setFormation(defaultFormation as any)
  }

  const handleGenerateTeams = () => {
    if (selectedPlayers.length === 0) {
      alert('Selecciona al menos un jugador para generar equipos')
      return
    }
    generateTeams()
  }

  const handleClear = () => {
    clearSelection()
    localStorage.removeItem('teamGeneratorConfig')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-2xl">⚽</span>
            Generador de Equipos
          </h1>
          <p className="text-gray-600 mt-2">
            Genera equipos balanceados automáticamente con titulares y suplentes
          </p>
        </div>

        {/* Filtro de Equipo */}
        {teams.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-gray-500">🏆</span>
              Filtrar por Equipo
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Equipo
                </label>
                <select
                  value={selectedTeamId || ''}
                  onChange={(e) => setSelectedTeamId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingTeams}
                >
                  <option value="">Todos los equipos</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                {selectedTeamId ? (
                  <span className="text-blue-600">
                    Mostrando jugadores de: {teams.find(t => t.id === selectedTeamId)?.name}
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Mostrando todos los jugadores
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Configuration */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-gray-500">⚙️</span>
            Configuración
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <span className="text-gray-500">👤</span>
                Tipo de Juego
              </label>
              <select
                value={gameType}
                onChange={(e) => handleGameTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5v5">Fútbol 5 vs 5</option>
                <option value="7v7">Fútbol 7 vs 7</option>
                <option value="11v11">Fútbol 11 vs 11</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <span className="text-gray-500">📄</span>
                Formación
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                {formation?.name || '2-2-1'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <span className="text-gray-500">👥</span>
                Jugadores Seleccionados
              </label>
              <div className="px-3 py-2 bg-blue-50 rounded-md text-blue-700 font-medium">
                {selectedPlayers.length}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleGenerateTeams}
              disabled={selectedPlayers.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>⚙️</span>
              Generar Equipos
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
            >
              <span>🗑️</span>
              Limpiar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Players */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-gray-500">👥</span>
              Jugadores Disponibles ({availablePlayers.length})
            </h2>
            <p className="text-gray-600 mb-4">
              Selecciona los jugadores para generar los equipos.
            </p>
            
            {loadingPlayers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Cargando jugadores del servidor...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">⚠️ {error}</div>
                <p className="text-gray-500">Usando datos de prueba</p>
              </div>
            ) : (
              <PlayerList
                players={availablePlayers}
                selectedPlayers={selectedPlayers}
                onPlayerSelect={(player) => {
                  if (selectedPlayers.find(p => p.id === player.id)) {
                    setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id))
                  } else {
                    setSelectedPlayers([...selectedPlayers, player])
                  }
                }}
                onPlayerDeselect={(player) => {
                  setSelectedPlayers(selectedPlayers.filter(p => p.id !== (player as any).id))
                }}
              />
            )}
          </div>

          {/* Generated Teams */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-gray-500">🏆</span>
              Equipos Generados
            </h2>
            <p className="text-gray-600 mb-4">
              Visualiza los equipos balanceados y sus suplentes.
            </p>
            
            {distribution ? (
              <TeamManager
                distribution={distribution}
                onPlayerMove={movePlayer}
                onRegenerate={regenerateTeams}
                onSave={() => {}}
                isGenerating={false}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                Selecciona jugadores y haz clic en 'Generar Equipos'
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ¿Cómo funciona el Generador de Equipos?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Funcionalidades Clave:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Distribución automática balanceada</li>
                <li>• Manejo inteligente de números impares</li>
                <li>• Cálculo de balance de habilidades</li>
                <li>• Regeneración de equipos</li>
                <li>• Movimiento flexible de jugadores</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Consejos de Uso:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Selecciona los jugadores disponibles</li>
                <li>• Elige el tipo de juego (5v5, 7v7, 11v11)</li>
                <li>• Usa el botón "Regenerar" para nuevas combinaciones</li>
                <li>• Mueve jugadores manualmente si es necesario</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 