'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
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
import { usePathname } from 'next/navigation'

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
    distribution,
    selectedPlayers,
    gameType,
    formation,
    isGenerating,
    error: teamError,
    swapPlayer,
    generateTeams,
    regenerateTeams,
    movePlayer,
    addPlayer,
    removePlayer,
    clearSelection,
    changeGameType,
    changeFormation,
    setSelectedPlayers,
    setGameType,
    setFormation,
    swapTwoPlayers
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
  const pathname = usePathname()
  const [savedTeams, setSavedTeams] = useState<any[]>([])
  const [showSavedTeams, setShowSavedTeams] = useState(false)
  const [currentGeneratedTeams, setCurrentGeneratedTeams] = useState<any>(null)
  const [showPlayerPreviewModal, setShowPlayerPreviewModal] = useState(false)
  const [selectedPlayerForPreview, setSelectedPlayerForPreview] = useState<Player | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  // Función para mostrar notificaciones
  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // Función para manejar errores del hook
  const handleTeamGeneratorError = useCallback((error: string) => {
    showNotification('error', error)
  }, [showNotification])

  // Función para manejar intercambios exitosos
  const handleSuccessfulSwap = useCallback((playerName: string, newRole: string) => {
    showNotification('success', `${playerName} movido a ${newRole}`)
  }, [showNotification])

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
  const allPlayers = useMemo(() => [...availablePlayers, ...manualPlayers], [availablePlayers, manualPlayers])
  
  // Funciones para guardar y recuperar equipos
  const loadSavedTeams = useCallback(() => {
    const savedTeams = JSON.parse(localStorage.getItem('savedTeams') || '[]')
    return savedTeams.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [])

  const saveGeneratedTeams = useCallback((teams: any, metadata: any) => {
    const savedTeams = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      teams,
      metadata: {
        ...metadata,
        gameType,
        formation,
        selectedPlayers: selectedPlayers.map(p => p.id),
        manualPlayers: manualPlayers.map(p => p.id)
      }
    }
    
    const existingTeams = JSON.parse(localStorage.getItem('savedTeams') || '[]')
    existingTeams.push(savedTeams)
    localStorage.setItem('savedTeams', JSON.stringify(existingTeams))
    
    console.log('Teams saved:', savedTeams)
    return savedTeams.id
  }, [gameType, formation, selectedPlayers, manualPlayers])

  const deleteSavedTeam = useCallback((teamId: number) => {
    const savedTeams = JSON.parse(localStorage.getItem('savedTeams') || '[]')
    const filteredTeams = savedTeams.filter((team: any) => team.id !== teamId)
    localStorage.setItem('savedTeams', JSON.stringify(filteredTeams))
    console.log('Team deleted:', teamId)
  }, [])



  // Debug: Log cuando cambia el pathname
  useEffect(() => {
    console.log(`[Sidebar] Pathname changed to: ${pathname}`)
  }, [pathname])

  // Cleanup effect para evitar memory leaks
  useEffect(() => {
    return () => {
      // Limpiar cualquier intervalo o timeout al desmontar
      console.log('TeamGenerator component unmounting')
    }
  }, [])

  // Optimizar re-renders: solo ejecutar debug cuando realmente cambien los datos
  const debugInfo = useMemo(() => ({
    availablePlayersCount: availablePlayers.length,
    manualPlayersCount: manualPlayers.length,
    selectedPlayersCount: selectedPlayers.length,
    totalPlayersCount: allPlayers.length
  }), [availablePlayers.length, manualPlayers.length, selectedPlayers.length, allPlayers.length])

  useEffect(() => {
    console.log('=== DEBUG JUGADORES ===')
    console.log('Jugadores disponibles:', debugInfo.availablePlayersCount)
    console.log('Jugadores manuales:', debugInfo.manualPlayersCount)
    console.log('Total jugadores:', debugInfo.totalPlayersCount)
    console.log('Jugadores seleccionados:', debugInfo.selectedPlayersCount)
    console.log('========================')
  }, [debugInfo])

  // Guardar configuración cuando cambie
  useEffect(() => {
    const config = {
      // NO guardar jugadores seleccionados para evitar pre-selección
      // selectedPlayers: selectedPlayers.map(p => p.id),
      gameType,
      formation,
      manualPlayers: manualPlayers.map(p => p.id)
    }
    localStorage.setItem('teamGeneratorConfig', JSON.stringify(config))
  }, [gameType, formation, manualPlayers.map(p => p.id).join(',')])

  // Cargar configuración guardada (solo una vez al montar)
  useEffect(() => {
    const savedConfig = localStorage.getItem('teamGeneratorConfig')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        // NO cargar jugadores seleccionados automáticamente
        // if (config.selectedPlayers && availablePlayers.length > 0) {
        //   const players = allPlayers.filter(p => config.selectedPlayers.includes(p.id))
        //   setSelectedPlayers(players)
        // }
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
  }, [availablePlayers.length]) // Solo cuando cambie la cantidad de jugadores disponibles

  // Cargar equipos guardados
  useEffect(() => {
    const teams = loadSavedTeams()
    setSavedTeams(teams)
  }, [loadSavedTeams])

  const handleGameTypeChange = useCallback((newGameType: string) => {
    setGameType(newGameType as "5v5" | "7v7" | "11v11")
    // Reset formation to default for new game type
    const defaultFormation = newGameType === '5v5' ? '2-2-1' : 
                           newGameType === '7v7' ? '3-2-1' : '4-4-2'
    setFormation(defaultFormation as any)
  }, [])

  const handleGenerateTeams = useCallback(() => {
    console.log('handleGenerateTeams called, selectedPlayers:', selectedPlayers.length)
    if (selectedPlayers.length === 0) {
      alert('Selecciona al menos un jugador para generar equipos')
      return
    }
    console.log('Calling generateTeams...')
    generateTeams()
    
    // Guardar equipos generados automáticamente
    const teams = distribution
    if (teams && teams.homeTeam && teams.awayTeam) {
      const metadata = {
        gameType,
        formation: formation?.name || '4-4-2',
        totalPlayers: selectedPlayers.length,
        manualPlayersCount: manualPlayers.length
      }
      
      const savedId = saveGeneratedTeams(teams, metadata)
      setCurrentGeneratedTeams({ ...teams, savedId })
      
      // Actualizar lista de equipos guardados
      const updatedTeams = loadSavedTeams()
      setSavedTeams(updatedTeams)
      
      console.log('Teams generated and saved with ID:', savedId)
    }
  }, [selectedPlayers.length, generateTeams, distribution, gameType, formation, selectedPlayers.length, manualPlayers.length, saveGeneratedTeams, loadSavedTeams])

  const handleSaveTeams = useCallback(() => {
    if (distribution && distribution.homeTeam && distribution.awayTeam) {
      const metadata = {
        gameType,
        formation: formation?.name || '4-4-2',
        totalPlayers: selectedPlayers.length,
        manualPlayersCount: manualPlayers.length
      }
      
      const savedId = saveGeneratedTeams(distribution, metadata)
      setCurrentGeneratedTeams({ ...distribution, savedId })
      
      // Actualizar lista de equipos guardados
      const updatedTeams = loadSavedTeams()
      setSavedTeams(updatedTeams)
      
      console.log('Teams manually saved with ID:', savedId)
      alert('Equipos guardados exitosamente!')
    }
  }, [distribution, gameType, formation, selectedPlayers.length, manualPlayers.length, saveGeneratedTeams, loadSavedTeams])

  const generateTeamsImage = useCallback((teams: any, metadata: any) => {
    // Crear un canvas para generar la imagen
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      alert('No se pudo generar la imagen')
      return
    }
    
    // Configurar canvas
    canvas.width = 800
    canvas.height = 1000
    
    // Fondo
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Gradiente de fondo
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#3b82f6')
    gradient.addColorStop(1, '#10b981')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Título
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('⚽ EQUIPOS GENERADOS', canvas.width / 2, 50)
    ctx.fillText('FormaciónPro Soccer', canvas.width / 2, 80)
    
    // Información del partido
    ctx.font = '18px Arial'
    const formationName = metadata.formation || 'Sin formación específica'
    const gameTypeLabel = metadata.gameType === '5v5' ? 'BabyFutbol' : 
                         metadata.gameType === '7v7' ? 'Futbolito' : 'Fútbol 11'
    ctx.fillText(`${gameTypeLabel} | ${formationName}`, canvas.width / 2, 120)
    ctx.fillText(new Date().toLocaleString(), canvas.width / 2, 150)
    
    // Equipo A
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(50, 180, 340, 350)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🔵 EQUIPO A', canvas.width / 2, 210)
    
    ctx.font = '16px Arial'
    ctx.textAlign = 'left'
    let yPos = 240
    teams.homeTeam.starters.forEach((player: any, index: number) => {
      // Obtener posición de manera más flexible
      let position = 'N/A'
      if (player.position_specific?.abbreviation) {
        position = player.position_specific.abbreviation
      } else if (player.position_zone?.abbreviation) {
        position = player.position_zone.abbreviation
      } else if (player.is_guest) {
        position = 'INV'
      }
      
      ctx.fillText(`${index + 1}. ${player.name} (${position})`, 70, yPos)
      yPos += 25
    })
    
    // Equipo B
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(410, 180, 340, 350)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🔴 EQUIPO B', canvas.width / 2, 210)
    
    ctx.font = '16px Arial'
    ctx.textAlign = 'left'
    yPos = 240
    teams.awayTeam.starters.forEach((player: any, index: number) => {
      // Obtener posición de manera más flexible
      let position = 'N/A'
      if (player.position_specific?.abbreviation) {
        position = player.position_specific.abbreviation
      } else if (player.position_zone?.abbreviation) {
        position = player.position_zone.abbreviation
      } else if (player.is_guest) {
        position = 'INV'
      }
      
      ctx.fillText(`${index + 1}. ${player.name} (${position})`, 430, yPos)
      yPos += 25
    })
    
    // Sin asignar
    if (teams.unassigned && teams.unassigned.length > 0) {
      ctx.fillStyle = '#6b7280'
      ctx.fillRect(50, 550, 700, 150)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('⏳ SIN ASIGNAR', canvas.width / 2, 580)
      
      ctx.font = '14px Arial'
      ctx.textAlign = 'left'
      yPos = 610
      teams.unassigned.forEach((player: any) => {
        ctx.fillText(`- ${player.name}`, 70, yPos)
        yPos += 20
      })
    }
    
    // Footer
    ctx.fillStyle = '#ffffff'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Generado con FormaciónPro Soccer', canvas.width / 2, 950)
    
    // Convertir canvas a blob y compartir
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'equipos-generados.png', { type: 'image/png' })
        
        if (navigator.share) {
          navigator.share({
            title: 'Equipos Generados - FormaciónPro',
            text: 'Equipos generados con FormaciónPro Soccer',
            files: [file]
          }).catch(() => {
            // Fallback si no se puede compartir archivo
            downloadImage(canvas)
          })
        } else {
          // Fallback para navegadores sin API de compartir
          downloadImage(canvas)
        }
      }
    }, 'image/png')
  }, [])

  const downloadImage = useCallback((canvas: HTMLCanvasElement) => {
    const link = document.createElement('a')
    link.download = `equipos-generados-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
    alert('Imagen descargada! Puedes compartirla por WhatsApp, email, etc.')
  }, [])

  const handleShareTeams = useCallback(() => {
    if (distribution && distribution.homeTeam && distribution.awayTeam) {
      // Validar que los equipos tengan jugadores
      const homeCount = distribution.homeTeam.starters.length
      const awayCount = distribution.awayTeam.starters.length
      
      if (homeCount === 0 || awayCount === 0) {
        alert('Los equipos no están completos. Genera equipos válidos primero.')
        return
      }
      
      // Para partidos internos, no es necesario validar posiciones específicas
      const isInternalMatch = gameType === '5v5' || gameType === '7v7'
      
      const metadata = {
        gameType,
        formation: isInternalMatch ? 'Distribución interna' : (formation?.name || 'Sin formación específica'),
        totalPlayers: selectedPlayers.length,
        manualPlayersCount: manualPlayers.length
      }
      
      // Generar imagen para compartir
      generateTeamsImage(distribution, metadata)
    } else {
      alert('No hay equipos generados para compartir. Genera equipos primero.')
    }
  }, [distribution, gameType, formation, selectedPlayers.length, manualPlayers.length, generateTeamsImage])

  const handleClear = useCallback(() => {
    console.log('handleClear called')
    clearSelection()
    setManualPlayers([])
    localStorage.removeItem('teamGeneratorConfig')
  }, [clearSelection])

  const handleAddManualPlayer = useCallback((player: Player) => {
    console.log('Agregando jugador manual:', player)
    setManualPlayers(prev => {
      const newManualPlayers = [...prev, player]
      console.log('Jugadores manuales actualizados:', newManualPlayers)
      return newManualPlayers
    })
  }, [])

  const handleRemoveManualPlayer = useCallback((playerId: number) => {
    console.log('Eliminando jugador manual:', playerId)
    setManualPlayers(prev => prev.filter(p => p.id !== playerId))
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId))
  }, [])

  const handlePlayerPreview = useCallback((player: Player) => {
    setPreviewPlayer(player)
  }, [])

  const handleTeamFilterChange = useCallback((teamId: number | null) => {
    setSelectedTeamId(teamId)
  }, [])

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

  const onPlayerSelect = useCallback((player: Player) => {
    console.log('onPlayerSelect called for:', player.name, 'selected:', selectedPlayers.some(p => p.id === player.id))
    if (!selectedPlayers.some(p => p.id === player.id)) {
      setSelectedPlayers(prev => [...prev, player])
    }
  }, [selectedPlayers])

  const onPlayerDeselect = useCallback((playerId: number) => {
    console.log('onPlayerDeselect called for playerId:', playerId)
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId))
  }, [])

  const handleSelectAll = useCallback(() => {
    console.log('handleSelectAll called, total players:', allPlayers.length)
    setSelectedPlayers(allPlayers)
  }, [allPlayers])

  const handleDeselectAll = useCallback(() => {
    console.log('handleDeselectAll called')
    setSelectedPlayers([])
  }, [])

  const handleSelectByPosition = useCallback((position: string) => {
    console.log('handleSelectByPosition called for position:', position)
    const playersInPosition = allPlayers.filter(player => 
      player.position_zone?.abbreviation === position || 
      player.position_specific?.abbreviation === position
    )
    setSelectedPlayers(prev => {
      const newSelected = [...prev]
      playersInPosition.forEach(player => {
        if (!newSelected.some(p => p.id === player.id)) {
          newSelected.push(player)
        }
      })
      return newSelected
    })
  }, [allPlayers])

  const handleSelectRandom = useCallback((count: number) => {
    console.log('handleSelectRandom called for count:', count)
    const availablePlayers = allPlayers.filter(player => 
      !selectedPlayers.some(p => p.id === player.id)
    )
    
    if (availablePlayers.length === 0) return
    
    const randomCount = Math.min(count, availablePlayers.length)
    const shuffled = [...availablePlayers].sort(() => 0.5 - Math.random())
    const randomPlayers = shuffled.slice(0, randomCount)
    
    setSelectedPlayers(prev => [...prev, ...randomPlayers])
  }, [allPlayers, selectedPlayers])

  // Manejar errores del hook
  useEffect(() => {
    if (teamError) {
      handleTeamGeneratorError(teamError)
    }
  }, [teamError, handleTeamGeneratorError])

  // Limpiar configuración guardada al abrir el módulo (solo una vez)
  useEffect(() => {
    // Limpiar jugadores seleccionados guardados para evitar pre-selección
    const savedConfig = localStorage.getItem('teamGeneratorConfig')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        // Remover jugadores seleccionados de la configuración guardada
        const { selectedPlayers, ...cleanConfig } = config
        localStorage.setItem('teamGeneratorConfig', JSON.stringify(cleanConfig))
        console.log('Configuración de jugadores seleccionados limpiada')
      } catch (error) {
        console.error('Error limpiando configuración:', error)
      }
    }
  }, []) // Solo se ejecuta una vez al montar el componente

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
                  <p className="text-xl text-blue-100 font-medium">
                    {gameType === '5v5' || gameType === '7v7' 
                      ? 'Partidos amistosos entre amigos del club' 
                      : 'Selección aleatoria equilibrada para partidos'
                    }
                  </p>
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
              onClick={handleSaveTeams}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>💾</span>
              Guardar Equipos
            </button>
            <button
              onClick={handleShareTeams}
              disabled={distribution && distribution.homeTeam && distribution.awayTeam ? false : true}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>📤</span>
              Compartir Equipos
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>🗑️</span>
              Limpiar Todo
            </button>
            <button
              onClick={() => setShowSavedTeams(!showSavedTeams)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>💾</span>
              Equipos Guardados ({savedTeams.length})
            </button>
          </div>
        </div>

        {/* Equipos Guardados */}
        {showSavedTeams && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-gray-500">💾</span>
              Equipos Guardados ({savedTeams.length})
            </h2>
            
            {savedTeams.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💾</div>
                <p className="text-gray-500 text-lg">No hay equipos guardados</p>
                <p className="text-gray-400 text-sm">Los equipos se guardan automáticamente cuando los generas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedTeams.map((savedTeam: any) => (
                  <div key={savedTeam.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Equipos del {new Date(savedTeam.timestamp).toLocaleDateString()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(savedTeam.timestamp).toLocaleTimeString()} | 
                          {savedTeam.metadata.gameType} | 
                          Formación: {savedTeam.metadata.formation}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Generar imagen para compartir
                            const canvas = document.createElement('canvas')
                            const ctx = canvas.getContext('2d')
                            
                            if (!ctx) {
                              alert('No se pudo generar la imagen')
                              return
                            }
                            
                            // Configurar canvas
                            canvas.width = 800
                            canvas.height = 1000
                            
                            // Fondo
                            ctx.fillStyle = '#1f2937'
                            ctx.fillRect(0, 0, canvas.width, canvas.height)
                            
                            // Gradiente de fondo
                            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
                            gradient.addColorStop(0, '#3b82f6')
                            gradient.addColorStop(1, '#10b981')
                            ctx.fillStyle = gradient
                            ctx.fillRect(0, 0, canvas.width, canvas.height)
                            
                            // Título
                            ctx.fillStyle = '#ffffff'
                            ctx.font = 'bold 32px Arial'
                            ctx.textAlign = 'center'
                            ctx.fillText('⚽ EQUIPOS GENERADOS', canvas.width / 2, 50)
                            ctx.fillText('FormaciónPro Soccer', canvas.width / 2, 80)
                            
                            // Información del partido
                            ctx.font = '18px Arial'
                            const formationName = savedTeam.metadata.formation || '4-4-2'
                            ctx.fillText(`${savedTeam.metadata.gameType} | Formación: ${formationName}`, canvas.width / 2, 120)
                            ctx.fillText(new Date(savedTeam.timestamp).toLocaleString(), canvas.width / 2, 150)
                            
                            // Equipo A
                            ctx.fillStyle = '#3b82f6'
                            ctx.fillRect(50, 180, 340, 350)
                            ctx.fillStyle = '#ffffff'
                            ctx.font = 'bold 24px Arial'
                            ctx.textAlign = 'center'
                            ctx.fillText('🔵 EQUIPO A', canvas.width / 2, 210)
                            
                            ctx.font = '16px Arial'
                            ctx.textAlign = 'left'
                            let yPos = 240
                            savedTeam.teams.homeTeam.starters.forEach((player: any, index: number) => {
                              const position = player.position_specific?.abbreviation || player.position_zone?.abbreviation || 'N/A'
                              ctx.fillText(`${index + 1}. ${player.name} (${position})`, 70, yPos)
                              yPos += 25
                            })
                            
                            // Equipo B
                            ctx.fillStyle = '#ef4444'
                            ctx.fillRect(410, 180, 340, 350)
                            ctx.fillStyle = '#ffffff'
                            ctx.font = 'bold 24px Arial'
                            ctx.textAlign = 'center'
                            ctx.fillText('🔴 EQUIPO B', canvas.width / 2, 210)
                            
                            ctx.font = '16px Arial'
                            ctx.textAlign = 'left'
                            yPos = 240
                            savedTeam.teams.awayTeam.starters.forEach((player: any, index: number) => {
                              const position = player.position_specific?.abbreviation || player.position_zone?.abbreviation || 'N/A'
                              ctx.fillText(`${index + 1}. ${player.name} (${position})`, 430, yPos)
                              yPos += 25
                            })
                            
                            // Sin asignar
                            if (savedTeam.teams.unassigned.length > 0) {
                              ctx.fillStyle = '#6b7280'
                              ctx.fillRect(50, 550, 700, 150)
                              ctx.fillStyle = '#ffffff'
                              ctx.font = 'bold 20px Arial'
                              ctx.textAlign = 'center'
                              ctx.fillText('⏳ SIN ASIGNAR', canvas.width / 2, 580)
                              
                              ctx.font = '14px Arial'
                              ctx.textAlign = 'left'
                              yPos = 610
                              savedTeam.teams.unassigned.forEach((player: any) => {
                                ctx.fillText(`- ${player.name}`, 70, yPos)
                                yPos += 20
                              })
                            }
                            
                            // Footer
                            ctx.fillStyle = '#ffffff'
                            ctx.font = '14px Arial'
                            ctx.textAlign = 'center'
                            ctx.fillText('Generado con FormaciónPro Soccer', canvas.width / 2, 950)
                            
                            // Convertir canvas a blob y compartir
                            canvas.toBlob((blob) => {
                              if (blob) {
                                const file = new File([blob], 'equipos-generados.png', { type: 'image/png' })
                                
                                if (navigator.share) {
                                  navigator.share({
                                    title: 'Equipos Generados - FormaciónPro',
                                    text: 'Equipos generados con FormaciónPro Soccer',
                                    files: [file]
                                  }).catch(() => {
                                    // Fallback si no se puede compartir archivo
                                    const link = document.createElement('a')
                                    link.download = `equipos-generados-${Date.now()}.png`
                                    link.href = canvas.toDataURL()
                                    link.click()
                                    alert('Imagen descargada! Puedes compartirla por WhatsApp, email, etc.')
                                  })
                                } else {
                                  // Fallback para navegadores sin API de compartir
                                  const link = document.createElement('a')
                                  link.download = `equipos-generados-${Date.now()}.png`
                                  link.href = canvas.toDataURL()
                                  link.click()
                                  alert('Imagen descargada! Puedes compartirla por WhatsApp, email, etc.')
                                }
                              }
                            }, 'image/png')
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs"
                        >
                          📤 Compartir
                        </button>
                        <button
                          onClick={() => {
                            deleteSavedTeam(savedTeam.id)
                            setSavedTeams(loadSavedTeams())
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="font-medium text-blue-800 mb-2">🔵 Equipo A</h4>
                        <div className="space-y-1">
                          {savedTeam.teams.homeTeam.starters.map((player: any, index: number) => (
                            <div key={player.id} className="text-sm text-blue-700">
                              {index + 1}. {player.name} ({player.position_specific?.abbreviation || player.position_zone?.abbreviation})
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-red-50 rounded-lg p-3">
                        <h4 className="font-medium text-red-800 mb-2">🔴 Equipo B</h4>
                        <div className="space-y-1">
                          {savedTeam.teams.awayTeam.starters.map((player: any, index: number) => (
                            <div key={player.id} className="text-sm text-red-700">
                              {index + 1}. {player.name} ({player.position_specific?.abbreviation || player.position_zone?.abbreviation})
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {savedTeam.teams.unassigned.length > 0 && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-gray-800 mb-2">⏳ Sin Asignar</h4>
                        <div className="space-y-1">
                          {savedTeam.teams.unassigned.map((player: any) => (
                            <div key={player.id} className="text-sm text-gray-600">
                              - {player.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
            
            {/* Botones de selección masiva */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>⚡</span>
                Selección Rápida
              </h3>
              
              {/* Indicador de estado */}
              <div className="mb-3 p-2 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Estado de selección:</span>
                  <span className="font-semibold text-blue-600">
                    {selectedPlayers.length} de {allPlayers.length} jugadores seleccionados
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${allPlayers.length > 0 ? (selectedPlayers.length / allPlayers.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={handleSelectAll}
                  disabled={selectedPlayers.length === allPlayers.length}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>✅</span>
                  Seleccionar Todos ({allPlayers.length})
                </button>
                <button
                  onClick={handleDeselectAll}
                  disabled={selectedPlayers.length === 0}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>❌</span>
                  Deseleccionar Todos
                </button>
              </div>
              
              {/* Selección aleatoria */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-sm text-gray-600 font-medium">Selección aleatoria:</span>
                <button
                  onClick={() => handleSelectRandom(5)}
                  className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-xs font-medium"
                >
                  🎲 5 Jugadores
                </button>
                <button
                  onClick={() => handleSelectRandom(10)}
                  className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-xs font-medium"
                >
                  🎲 10 Jugadores
                </button>
                <button
                  onClick={() => handleSelectRandom(15)}
                  className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-xs font-medium"
                >
                  🎲 15 Jugadores
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-medium">Seleccionar por posición:</span>
                <button
                  onClick={() => handleSelectByPosition('POR')}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-xs font-medium"
                >
                  🥅 Porteros
                </button>
                <button
                  onClick={() => handleSelectByPosition('DEF')}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs font-medium"
                >
                  🛡️ Defensas
                </button>
                <button
                  onClick={() => handleSelectByPosition('MED')}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs font-medium"
                >
                  ⚽ Mediocampistas
                </button>
                <button
                  onClick={() => handleSelectByPosition('DEL')}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-medium"
                >
                  ⚡ Delanteros
                </button>
              </div>
            </div>
            
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
                onPlayerSelect={onPlayerSelect}
                onPlayerDeselect={onPlayerDeselect}
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
                gameType={gameType}
                formation={formation}
                onRegenerate={handleGenerateTeams}
                onSwapPlayer={swapPlayer}
                onSwapTwoPlayers={swapTwoPlayers}
                isGenerating={isGenerating}
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

      {/* Sistema de Notificaciones */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {notification.type === 'success' ? '✅' : 
               notification.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Modales */}
      {showAddManualPlayerModal && (
        <AddManualPlayerModal
          isOpen={showAddManualPlayerModal}
          onClose={() => setShowAddManualPlayerModal(false)}
          onAddPlayer={handleAddManualPlayer}
        />
      )}

      {showPlayerPreviewModal && selectedPlayerForPreview && (
        <PlayerPreviewModal
          isOpen={showPlayerPreviewModal}
          player={selectedPlayerForPreview}
          onClose={() => {
            setShowPlayerPreviewModal(false)
            setSelectedPlayerForPreview(null)
          }}
        />
      )}
    </MainLayout>
  )
} 