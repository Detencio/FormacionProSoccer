'use client'

import { useEffect, useState, useCallback } from 'react'
import { Player } from '@/types'
import { useTeamGenerator } from '@/hooks/useTeamGenerator'
import { useAuthStore } from '@/store/authStore'
import PlayerList from '@/components/team-generator/PlayerList'
import TeamManager from '@/components/team-generator/TeamManager'
import AddManualPlayerModal from '@/components/team-generator/AddManualPlayerModal'
import PlayerPreviewModal from '@/components/team-generator/PlayerPreviewModal'
import DebugInfo from '@/components/team-generator/DebugInfo'
import { teamGeneratorService } from '@/services/teamGeneratorService'
import MainLayout from '@/components/Layout/MainLayout'

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
  const { user, isAuthenticated } = useAuthStore()
  
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
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [manualPlayers, setManualPlayers] = useState<Player[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [showAddManualPlayerModal, setShowAddManualPlayerModal] = useState(false)
  const [previewPlayer, setPreviewPlayer] = useState<Player | null>(null)

  // Determinar el equipo del usuario según su rol
  const getUserTeam = () => {
    if (!user) return null
    
    // Si es supervisor, obtener su equipo asignado
    if (user.role === 'supervisor') {
      // Por ahora, asumimos que el supervisor está asignado a Matiz FC (ID: 1)
      return 1
    }
    
    // Si es admin, puede ver todos los equipos
    if (user.role === 'admin') {
      return null // null significa todos los equipos
    }
    
    // Si es jugador, obtener su equipo
    if (user.role === 'jugador') {
      // Por ahora, asumimos que el jugador está en Matiz FC (ID: 1)
      return 1
    }
    
    return null
  }

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

  // Establecer equipo inicial según el rol del usuario
  useEffect(() => {
    const userTeam = getUserTeam()
    if (userTeam && !selectedTeamId) {
      setSelectedTeamId(userTeam)
    }
  }, [user, selectedTeamId])

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

  // Combinar jugadores reales con jugadores manuales
  const allPlayers = [...availablePlayers, ...manualPlayers]
  
  // Debug: Mostrar información de jugadores
  useEffect(() => {
    console.log('=== DEBUG JUGADORES ===')
    console.log('Jugadores disponibles:', availablePlayers.length)
    console.log('Jugadores manuales:', manualPlayers.length)
    console.log('Total jugadores:', allPlayers.length)
    console.log('Jugadores seleccionados:', selectedPlayers.length)
    console.log('========================')
  }, [availablePlayers, manualPlayers, allPlayers, selectedPlayers])

  // Guardar configuración cuando cambie
  useEffect(() => {
    const config = {
      selectedPlayers: selectedPlayers.map(p => p.id),
      gameType,
      formation,
      manualPlayers: manualPlayers.map(p => p.id)
    }
    localStorage.setItem('teamGeneratorConfig', JSON.stringify(config))
  }, [selectedPlayers, gameType, formation, manualPlayers])

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem('teamGeneratorConfig')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        if (config.selectedPlayers) {
          const players = allPlayers.filter(p => config.selectedPlayers.includes(p.id))
          setSelectedPlayers(players)
        }
        if (config.gameType) setGameType(config.gameType as "5v5" | "7v7" | "11v11")
        if (config.formation) setFormation(config.formation as any)
        if (config.manualPlayers) {
          // Los jugadores manuales se manejan por separado
          console.log('Configuración de jugadores manuales cargada')
        }
      } catch (error) {
        console.error('Error loading saved config:', error)
      }
    }
  }, [allPlayers, setSelectedPlayers, setGameType, setFormation])

  const handleGameTypeChange = (newGameType: string) => {
    setGameType(newGameType as "5v5" | "7v7" | "11v11")
    // Reset formation to default for new game type
    const defaultFormation = newGameType === '5v5' ? '2-2-1' : 
                           newGameType === '7v7' ? '3-2-1' : '4-4-2'
    setFormation(defaultFormation as any)
  }

  const handleGenerateTeams = () => {
    console.log('handleGenerateTeams called, selectedPlayers:', selectedPlayers.length)
    if (selectedPlayers.length === 0) {
      alert('Selecciona al menos un jugador para generar equipos')
      return
    }
    console.log('Calling generateTeams...')
    generateTeams()
  }

  const handleClear = () => {
    console.log('handleClear called')
    clearSelection()
    setManualPlayers([])
    localStorage.removeItem('teamGeneratorConfig')
  }

  const handleAddManualPlayer = (player: Player) => {
    console.log('Agregando jugador manual:', player)
    setManualPlayers(prev => {
      const newManualPlayers = [...prev, player]
      console.log('Jugadores manuales actualizados:', newManualPlayers)
      return newManualPlayers
    })
  }

  const handleRemoveManualPlayer = (playerId: number) => {
    console.log('Eliminando jugador manual:', playerId)
    setManualPlayers(prev => prev.filter(p => p.id !== playerId))
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId))
  }

  const handlePlayerPreview = (player: Player) => {
    setPreviewPlayer(player)
  }

  const handleTeamFilterChange = (teamId: number | null) => {
    setSelectedTeamId(teamId)
  }

  // Obtener el nombre del equipo seleccionado
  const getSelectedTeamName = () => {
    if (!selectedTeamId) return 'Todos los equipos'
    const team = teams.find(t => t.id === selectedTeamId)
    return team?.name || 'Equipo desconocido'
  }

  // Verificar si el usuario puede cambiar el filtro de equipo
  const canChangeTeamFilter = () => {
    return user?.role === 'admin'
  }

  // Función mejorada para mover jugadores
  const handleMovePlayer = (
    playerId: number,
    fromTeam: 'home' | 'away',
    fromRole: 'starter' | 'substitute',
    toTeam: 'home' | 'away',
    toRole: 'starter' | 'substitute'
  ) => {
    console.log('Moviendo jugador:', { playerId, fromTeam, fromRole, toTeam, toRole })
    movePlayer(playerId, fromTeam, fromRole, toTeam, toRole)
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl shadow-2xl border border-blue-500/30 p-8 relative overflow-hidden">
          {/* Efecto de luz de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Generador de Equipos</h1>
                  <p className="text-xl text-blue-100 font-medium">Selección aleatoria equilibrada para partidos</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddManualPlayerModal(true)}
                  className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-green-400/30"
                  title="Agregar jugador invitado"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Agregar Jugador</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtro de Equipo - Solo para administradores */}
        {canChangeTeamFilter() && teams.length > 1 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  <span className="font-semibold text-gray-800">Filtrar por Equipo:</span>
                </div>
                <select
                  value={selectedTeamId || ''}
                  onChange={(e) => handleTeamFilterChange(e.target.value ? Number(e.target.value) : null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
            </div>

            {/* Información del filtro activo */}
            <div className="mt-4 p-4 bg-white rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {getSelectedTeamName()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {allPlayers.length} jugador{allPlayers.length !== 1 ? 'es' : ''} disponible{allPlayers.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleTeamFilterChange(null)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar filtro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información del equipo para supervisores y jugadores */}
        {!canChangeTeamFilter() && selectedTeamId && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-lg border border-blue-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Generando equipos para: {getSelectedTeamName()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {allPlayers.length} jugador{allPlayers.length !== 1 ? 'es' : ''} disponible{allPlayers.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-gray-500">⚙️</span>
            Configuración del Partido
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-gray-500">👤</span>
                Tipo de Juego
              </label>
              <select
                value={gameType}
                onChange={(e) => handleGameTypeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="5v5">Fútbol 5 vs 5</option>
                <option value="7v7">Fútbol 7 vs 7</option>
                <option value="11v11">Fútbol 11 vs 11</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-gray-500">📄</span>
                Formación
              </label>
              <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700 font-medium">
                {formation?.name || '2-2-1'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-gray-500">👥</span>
                Jugadores Seleccionados
              </label>
              <div className="px-4 py-3 bg-blue-50 rounded-xl text-blue-700 font-medium">
                {selectedPlayers.length}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-gray-500">🎯</span>
                Jugadores Invitados
              </label>
              <div className="px-4 py-3 bg-green-50 rounded-xl text-green-700 font-medium">
                {manualPlayers.length}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleGenerateTeams}
              disabled={selectedPlayers.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>⚙️</span>
              Generar Equipos
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>🗑️</span>
              Limpiar Todo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Players */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-gray-500">👥</span>
              Jugadores Disponibles ({allPlayers.length})
            </h2>
            <p className="text-gray-600 mb-6">
              Selecciona los jugadores para generar los equipos. Los jugadores invitados aparecen con un ícono especial.
            </p>
            
            {loadingPlayers ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Cargando jugadores del servidor...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4 text-lg">⚠️ {error}</div>
                <p className="text-gray-500">Usando datos de prueba</p>
              </div>
            ) : (
              <PlayerList
                players={allPlayers}
                selectedPlayers={selectedPlayers}
                onPlayerSelect={(player: Player) => {
                  setSelectedPlayers(prev => {
                    if (prev.find(p => p.id === player.id)) {
                      return prev.filter(p => p.id !== player.id)
                    } else {
                      return [...prev, player]
                    }
                  })
                }}
                onPlayerDeselect={(playerId: number) => {
                  setSelectedPlayers(prev => prev.filter(p => p.id !== playerId))
                }}
                onRemoveManualPlayer={handleRemoveManualPlayer}
                showManualPlayerControls={true}
                onPlayerPreview={handlePlayerPreview}
              />
            )}
          </div>

          {/* Generated Teams */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-gray-500">🏆</span>
              Equipos Generados
            </h2>
            <p className="text-gray-600 mb-6">
              Visualiza los equipos balanceados y sus suplentes.
            </p>
            
            {distribution ? (
              <TeamManager
                distribution={distribution}
                onPlayerMove={handleMovePlayer}
                onRegenerate={regenerateTeams}
                onSave={() => {}}
                isGenerating={false}
              />
            ) : (
              <div className="text-center py-16 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">No hay equipos generados</p>
                <p className="text-sm">Selecciona jugadores y haz clic en 'Generar Equipos'</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer con información */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            ¿Cómo funciona el Generador de Equipos?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Funcionalidades Clave:</h4>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Distribución automática balanceada por habilidades</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Manejo inteligente de números impares</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Cálculo de balance de habilidades por equipo</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Regeneración de equipos con nuevas combinaciones</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Movimiento flexible de jugadores entre equipos</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Agregar jugadores invitados manualmente</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Consejos de Uso:</h4>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Selecciona los jugadores disponibles del equipo</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Elige el tipo de juego (5v5, 7v7, 11v11)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Usa el botón "Regenerar" para nuevas combinaciones</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Mueve jugadores manualmente si es necesario</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Agrega jugadores invitados para partidos especiales</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Los administradores pueden filtrar por equipo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal para agregar jugadores manuales */}
        <AddManualPlayerModal
          isOpen={showAddManualPlayerModal}
          onClose={() => setShowAddManualPlayerModal(false)}
          onAddPlayer={handleAddManualPlayer}
        />

        {/* Modal de previsualización de jugador */}
        <PlayerPreviewModal
          player={previewPlayer}
          isOpen={!!previewPlayer}
          onClose={() => setPreviewPlayer(null)}
        />

        {/* Debug Info - Solo en desarrollo */}
        <DebugInfo
          availablePlayers={availablePlayers}
          manualPlayers={manualPlayers}
          selectedPlayers={selectedPlayers}
          teams={teams}
          selectedTeamId={selectedTeamId}
          user={user}
        />
      </div>
    </MainLayout>
  )
} 