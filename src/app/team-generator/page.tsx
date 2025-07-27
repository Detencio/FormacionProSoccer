'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/Layout/MainLayout'
import PlayerCard from '@/components/team-generator/PlayerCard'
import TeamFormation from '@/components/team-generator/TeamFormation'
import PlayerList from '@/components/team-generator/PlayerList'
import PlayerCardModal from '@/components/team-generator/PlayerCardModal'
import { countries } from '@/lib/countries'


interface Player {
  id: number
  name: string
  skill: number // 1-5 estrellas
  position: string
  teamId?: number
  teamName?: string
  photo?: string
  isPresent?: boolean // Nueva propiedad para asistencia
  email?: string
  phone?: string
  age?: number | string
  stats?: {
    velocidad: number
    disparo: number
    pase: number
    regate: number
    defensa: number
    fisico: number
  }
  country?: string
  jersey_number?: string
  teamLogo?: string
  photo_url?: string
  logo_url?: string
}

interface Team {
  id: number
  name: string
  players: Player[]
  totalSkill: number
  averageSkill: number
}

interface GameMode {
  id: string
  name: string
  playersPerTeam: number
  positions: string[]
  formation: string
}

  // Modos de juego disponibles
  const GAME_MODES: GameMode[] = [
    {
      id: 'babyfutbol',
      name: 'Baby Futbol',
      playersPerTeam: 5,
      positions: ['Portero', 'Defensa', 'Defensa', 'Delantero', 'Delantero'],
      formation: '1-2-2'
    },
    {
      id: 'futbolito',
      name: 'Futbolito',
      playersPerTeam: 7,
      positions: ['Portero', 'Defensa', 'Defensa', 'Mediocampista', 'Mediocampista', 'Delantero', 'Delantero'],
      formation: '1-2-2-2'
    },
    {
      id: 'futbol',
      name: 'Futbol',
      playersPerTeam: 11,
      positions: ['Portero', 'Defensa', 'Defensa', 'Defensa', 'Defensa', 'Mediocampista', 'Mediocampista', 'Mediocampista', 'Delantero', 'Delantero', 'Delantero'],
      formation: '1-4-3-3'
    }
  ]

export default function TeamGeneratorPage() {
  // Estados del componente
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(GAME_MODES[0]) // Baby Futbol por defecto
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [availableTeams, setAvailableTeams] = useState<any[]>([])
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [presentPlayers, setPresentPlayers] = useState<Player[]>([])
  const [reservePlayers, setReservePlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showCustomSettingsModal, setShowCustomSettingsModal] = useState(false)
  const [enableEditing, setEnableEditing] = useState(false)
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [customPlayersPerTeam, setCustomPlayersPerTeam] = useState<number | null>(null)
  const [generatedTeams, setGeneratedTeams] = useState<Team[]>([])
  const [showGeneratedTeams, setShowGeneratedTeams] = useState(false)
  const [showReserveModal, setShowReserveModal] = useState(false)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  const [evaluatingPlayer, setEvaluatingPlayer] = useState<Player | null>(null)
  const [selectedPlayerForCard, setSelectedPlayerForCard] = useState<Player | null>(null)
  const [showPlayerCardModal, setShowPlayerCardModal] = useState(false)
  const [dragState, setDragState] = useState<{
    isDragging: boolean
    draggedPlayer: Player | null
    sourceTeam: number | null
  }>({
    isDragging: false,
    draggedPlayer: null,
    sourceTeam: null
  })

  // Cargar equipos y jugadores al montar el componente
  useEffect(() => {
    setLoading(true)
    loadTeamsAndPlayers()
  }, [])

  // Seleccionar automáticamente Matiz FC cuando se carguen los equipos
  useEffect(() => {
    if (availableTeams.length > 0) {
      const matizFC = availableTeams.find(team => team.id === 1)
      if (matizFC) {
        setSelectedTeamId(matizFC.id)
        console.log('Matiz FC seleccionado automáticamente')
      }
      // Asegurar que loading se establezca como false cuando los equipos estén cargados
      setLoading(false)
    }
  }, [availableTeams])

  // Actualizar jugadores disponibles cuando cambie el equipo seleccionado
  useEffect(() => {
    if (selectedTeamId && players.length > 0) {
      // Filtrar jugadores del equipo seleccionado
      const teamPlayers = players.filter(player => {
        // Si el jugador tiene teamId, usar ese
        if (player.teamId) {
          return player.teamId === selectedTeamId;
        }
        // Si no tiene teamId, verificar si está en el equipo seleccionado
        // Buscar en teams-data para encontrar el equipo correcto
        const savedTeams = localStorage.getItem('teams-data');
        if (savedTeams) {
          const teamsData = JSON.parse(savedTeams);
          const selectedTeam = teamsData.find((team: any) => team.id === selectedTeamId);
          if (selectedTeam && selectedTeam.players) {
            return selectedTeam.players.some((p: any) => p.id === player.id);
          }
        }
        return false;
      });
      
      console.log('=== FILTRANDO JUGADORES DEL EQUIPO ===');
      console.log('Equipo seleccionado ID:', selectedTeamId);
      console.log('Total jugadores disponibles:', players.length);
      console.log('Jugadores del equipo seleccionado:', teamPlayers.length);
      teamPlayers.forEach((player, index) => {
        console.log(`${index + 1}. ${player.name} (ID: ${player.id})`);
      });
      
      setAvailablePlayers(teamPlayers);
      setPresentPlayers(teamPlayers.map(p => ({ ...p, isPresent: false })));
      setReservePlayers([]);
      // Asegurar que loading se establezca como false cuando se carguen los jugadores
      setLoading(false);
    } else {
      setAvailablePlayers([]);
      setPresentPlayers([]);
      setReservePlayers([]);
    }
  }, [selectedTeamId, players]);

  // Cargar equipos generados del localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('generatedTeams')
    if (savedTeams) {
      setGeneratedTeams(JSON.parse(savedTeams))
      setShowGeneratedTeams(true)
    }
  }, [])

  // Guardar equipos generados en localStorage
  const saveGeneratedTeams = (teams: Team[]) => {
    console.log('saveGeneratedTeams - teams:', teams)
    setGeneratedTeams(teams)
    localStorage.setItem('generatedTeams', JSON.stringify(teams))
    setShowGeneratedTeams(true)
    console.log('Equipos guardados en localStorage')
    console.log('showGeneratedTeams set to true')
  }

  // Guardar equipos automáticamente cuando cambian
  useEffect(() => {
    if (generatedTeams.length > 0) {
      localStorage.setItem('generatedTeams', JSON.stringify(generatedTeams))
    }
  }, [generatedTeams])

  const loadTeamsAndPlayers = () => {
    try {
      const savedTeams = localStorage.getItem('teams-data');
      if (!savedTeams) {
        console.log('No se encontró teams-data en localStorage');
        return;
      }

      const teamsData = JSON.parse(savedTeams);
      
      console.log('=== CARGANDO TODOS LOS EQUIPOS ===');
      console.log('Total equipos encontrados:', teamsData.length);
      
      // Cargar TODOS los equipos y jugadores
      const allTeams = teamsData;
      const allPlayers: Player[] = [];
      
      allTeams.forEach((team: any) => {
        console.log(`Equipo: ${team.name} (ID: ${team.id}) - ${team.players?.length || 0} jugadores`);
        
        if (team.players && team.players.length > 0) {
          team.players.forEach((player: any) => {
            console.log('=== JUGADOR ORIGINAL ===');
            console.log('Nombre:', player.name);
            console.log('Equipo:', team.name);
            console.log('Datos completos:', player);
            console.log('photo:', player.photo);
            console.log('photo_url:', player.photo_url);
            console.log('jersey_number:', player.jersey_number);
            console.log('teamLogo:', player.teamLogo);
            console.log('logo_url:', player.logo_url);
            console.log('========================');
            
            // NO MODIFICAR NADA, solo agregar campos que NO existan
            const enhancedPlayer = {
              ...player, // Mantener TODOS los campos originales exactamente como están
              // Solo agregar campos que NO existan en el jugador original
              teamLogo: player.teamLogo || team.logo_url || team.logo || null,
              stats: player.stats || {
                velocidad: 70,
                disparo: 70,
                pase: 70,
                regate: 70,
                defensa: 70,
                fisico: 70
              }
            };
            
            console.log('=== JUGADOR PROCESADO ===');
            console.log('Nombre:', enhancedPlayer.name);
            console.log('Equipo:', team.name);
            console.log('photo preservado:', !!enhancedPlayer.photo);
            console.log('photo_url preservado:', !!enhancedPlayer.photo_url);
            console.log('jersey_number preservado:', enhancedPlayer.jersey_number);
            console.log('teamLogo:', enhancedPlayer.teamLogo);
            console.log('========================');
            
            allPlayers.push(enhancedPlayer);
          });
        }
      });

      setPlayers(allPlayers);
      setAvailableTeams(allTeams);
      setAvailablePlayers(allPlayers);
      
      // Seleccionar el primer equipo por defecto
      if (allTeams.length > 0) {
        setSelectedTeamId(allTeams[0].id);
      }
      
      console.log('✅ Datos cargados exitosamente. Total jugadores:', allPlayers.length);
      console.log('✅ Total equipos:', allTeams.length);
      setLoading(false);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    try {
      const savedTeams = localStorage.getItem('teams-data')
      if (!savedTeams) return
      const teamsData = JSON.parse(savedTeams)
      const newId = Date.now() + Math.random()
      const team = teamsData.find((t: any) => t.id === selectedTeamId)
      if (team) {
        const newPlayer = {
          ...playerData,
          id: newId,
          teamId: selectedTeamId,
          teamName: team.name,
          isPresent: true
        }
        team.players.push(newPlayer)
        
        // Intentar guardar con manejo de errores
        try {
          localStorage.setItem('teams-data', JSON.stringify(teamsData))
        } catch (error) {
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded, cleaning up...')
            cleanupLocalStorage()
            
            // Reintentar después de la limpieza
            try {
              localStorage.setItem('teams-data', JSON.stringify(teamsData))
            } catch (retryError) {
              console.error('Failed to save after cleanup:', retryError)
              alert('Error al guardar los datos. Intenta limpiar el caché del navegador.')
              return
            }
          } else {
            console.error('Error saving to localStorage:', error)
            alert('Error al guardar los datos.')
            return
          }
        }
        
        // Disparar evento personalizado para notificar a otros módulos
        window.dispatchEvent(new CustomEvent('teams-data-updated', {
          detail: { teamsData, updatedPlayer: newPlayer }
        }))
        loadTeamsAndPlayers()
      }
    } catch (error) {
      console.error('Error in addPlayer:', error)
      alert('Error al agregar el jugador.')
    }
  }

  const updatePlayer = (id: number, playerData: Partial<Player>) => {
    try {
      const savedTeams = localStorage.getItem('teams-data');
      if (!savedTeams) return false;

      const teamsData = JSON.parse(savedTeams);
      
      // Buscar el jugador en TODOS los equipos
      let foundPlayer = false;
      let updatedTeam = null;
      let playerIndex = -1;
      
      for (const team of teamsData) {
        const idx = team.players.findIndex((p: any) => p.id === id);
        if (idx !== -1) {
          const existingPlayer = team.players[idx];
          
          console.log('=== ACTUALIZANDO JUGADOR ===');
          console.log('Jugador existente:', existingPlayer.name);
          console.log('Equipo:', team.name);
          console.log('Datos a actualizar:', playerData);
          
          // Solo actualizar los campos que se proporcionan explícitamente
          team.players[idx] = {
            ...existingPlayer,  // Mantener TODOS los datos existentes
            ...playerData       // Solo sobrescribir con los nuevos datos proporcionados
          };
          
          console.log('=== JUGADOR ACTUALIZADO ===');
          console.log('Nombre:', team.players[idx].name);
          console.log('Equipo:', team.name);
          console.log('photo preservado:', !!team.players[idx].photo);
          console.log('photo_url preservado:', !!team.players[idx].photo_url);
          console.log('jersey_number:', team.players[idx].jersey_number);
          console.log('========================');

          foundPlayer = true;
          updatedTeam = team;
          playerIndex = idx;
          break;
        }
      }
      
      if (!foundPlayer) {
        console.log('❌ Jugador no encontrado en ningún equipo');
        return false;
      }

      localStorage.setItem('teams-data', JSON.stringify(teamsData));
      window.dispatchEvent(new CustomEvent('teams-data-updated', {
        detail: { teamsData, updatedPlayer: { id, ...playerData } }
      }));

      // Recargar datos para reflejar cambios
      loadTeamsAndPlayers();
      
      return true;
    } catch (error) {
      console.error('Error actualizando jugador:', error);
      return false;
    }
  };

  // Función para limpiar localStorage cuando se excede la cuota
  const cleanupLocalStorage = () => {
    try {
      // Eliminar datos temporales y de caché
      const keysToRemove = [
        'generator-players',
        'generatedTeams',
        'temp-data',
        'cache-data'
      ]
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key)
        } catch (e) {
          console.warn(`Could not remove ${key}:`, e)
        }
      })
      
      // Comprimir teams-data eliminando campos innecesarios
      const savedTeams = localStorage.getItem('teams-data')
      if (savedTeams) {
        const teamsData = JSON.parse(savedTeams)
        const compressedTeamsData = teamsData.map((team: any) => ({
          id: team.id,
          name: team.name,
          players: team.players.map((player: any) => ({
            id: player.id,
            name: player.name,
            skill: player.skill,
            position: player.position,
            email: player.email,
            country: player.country,
            jersey_number: player.jersey_number,
            age: player.age,
            // Solo incluir stats si existen
            ...(player.stats && { stats: player.stats })
          }))
        }))
        
        localStorage.setItem('teams-data', JSON.stringify(compressedTeamsData))
      }
    } catch (error) {
      console.error('Error in cleanupLocalStorage:', error)
    }
  }

  const deletePlayer = (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este jugador?')) return
    const savedTeams = localStorage.getItem('teams-data')
    if (!savedTeams) return
    const teamsData = JSON.parse(savedTeams)
    for (const team of teamsData) {
      const idx = team.players.findIndex((p: any) => p.id === id)
      if (idx !== -1) {
        team.players.splice(idx, 1)
        break
      }
    }
    localStorage.setItem('teams-data', JSON.stringify(teamsData))
    loadTeamsAndPlayers()
  }

  const handleAttendanceChange = (playerId: number, isPresent: boolean) => {
    console.log('handleAttendanceChange - playerId:', playerId, 'isPresent:', isPresent)
    
    const updatedPresentPlayers = presentPlayers.map(player => 
      player.id === playerId ? { ...player, isPresent } : player
    )
    setPresentPlayers(updatedPresentPlayers)
    
    console.log('updatedPresentPlayers:', updatedPresentPlayers)
  }

  const selectAllPlayers = () => {
    const updatedPresentPlayers = presentPlayers.map(player => ({ ...player, isPresent: true }))
    setPresentPlayers(updatedPresentPlayers)
  }

  const deselectAllPlayers = () => {
    const updatedPresentPlayers = presentPlayers.map(player => ({ ...player, isPresent: false }))
    setPresentPlayers(updatedPresentPlayers)
  }

  const handlePositionChange = (playerId: number, newPosition: string) => {
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, position: newPosition } : player
    )
    setPlayers(updatedPlayers)
    
    // Actualizar también en presentPlayers
    const updatedPresentPlayers = presentPlayers.map(player =>
      player.id === playerId ? { ...player, position: newPosition } : player
    )
    setPresentPlayers(updatedPresentPlayers)
  }

  const handlePlayerMove = (playerId: number, fromPosition: string, toPosition: string) => {
    // Actualizar las posiciones de los jugadores en los equipos
    const updatedTeams = teams.map(team => ({
      ...team,
      players: team.players.map((player: any) => {
        if (player.id === playerId) {
          return { ...player, position: toPosition }
        }
        return player
      })
    }))
    setTeams(updatedTeams)
  }

  const getPositionFromCoordinates = (row: number, col: number) => {
    // Mapear coordenadas a posiciones
    if (row === 1 && col === 0) return 'Portero'
    if (row === 1 && col === 3) return 'Portero'
    if (row === 1 || row === 2) {
      if (col === 1 || col === 2) return 'Defensa'
      if (col === 2) return 'Mediocampista'
      if (col === 3) return 'Delantero'
    }
    return 'Delantero'
  }

  const handlePlayerEvaluation = (playerId: number, stats: any) => {
    // Encontrar el jugador que se va a evaluar
    const player = players.find(p => p.id === playerId)
    if (player) {
      setEvaluatingPlayer(player)
      setShowEvaluationModal(true)
    }
  }

  const handleEvaluationSave = (playerId: number, newStats: {
    velocidad: number
    disparo: number
    pase: number
    regate: number
    defensa: number
    fisico: number
  }) => {
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, stats: newStats } : player
    )
    setPlayers(updatedPlayers)
    
    // Actualizar también en presentPlayers
    const updatedPresentPlayers = presentPlayers.map(player =>
      player.id === playerId ? { ...player, stats: newStats } : player
    )
    setPresentPlayers(updatedPresentPlayers)
    
    // Cerrar el modal
    setShowEvaluationModal(false)
    setEvaluatingPlayer(null)
  }

  // Funciones para gestionar reservas y jugadores extra
  const addPlayerToTeam = (player: Player, teamId: number) => {
    // Agregar jugador al equipo
    setGeneratedTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, players: [...team.players, player] }
        : team
    ))
    
    // Eliminar el jugador de reserva de la lista de reservas
    setReservePlayers(prev => prev.filter(p => p.id !== player.id))
  }

  const removePlayerFromTeam = (playerId: number, teamId: number) => {
    setGeneratedTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, players: team.players.filter(p => p.id !== playerId) }
        : team
    ))
  }

  const addReservePlayer = (player: Player) => {
    setReservePlayers(prev => [...prev, player])
  }

  const removeReservePlayer = (playerId: number) => {
    setReservePlayers(prev => prev.filter(p => p.id !== playerId))
  }

  const replacePlayer = (oldPlayerId: number, newPlayer: Player, teamId: number) => {
    // Reemplazar jugador en el equipo
    setGeneratedTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            players: team.players.map(p => p.id === oldPlayerId ? newPlayer : p)
          }
        : team
    ))
    
    // Eliminar el jugador de reserva de la lista de reservas
    setReservePlayers(prev => prev.filter(p => p.id !== newPlayer.id))
  }

  const generateBalancedTeams = () => {
    console.log('generateBalancedTeams - selectedTeamId:', selectedTeamId)
    console.log('generateBalancedTeams - presentPlayersCount:', presentPlayersCount)
    console.log('generateBalancedTeams - currentPlayersPerTeam:', currentPlayersPerTeam)
    console.log('generateBalancedTeams - players:', players)
    console.log('generateBalancedTeams - presentPlayers:', presentPlayers)
    
    // Usar la misma lógica de validación que el botón
    const requiredPlayers = currentPlayersPerTeam * 2
    console.log('generateBalancedTeams - requiredPlayers:', requiredPlayers)
    console.log('generateBalancedTeams - presentPlayersCount:', presentPlayersCount)
    
    if (!selectedTeamId || presentPlayersCount < requiredPlayers) {
      alert(`Se necesitan al menos ${requiredPlayers} jugadores presentes para generar equipos. Actualmente tienes ${presentPlayersCount} jugadores.`)
      return
    }

    setLoading(true)

    try {
      // Simular delay de generación
      setTimeout(() => {
        try {
          // Usar el estado presentPlayers en lugar de filtrar players
          const availablePresentPlayers = presentPlayers.filter(p => p.isPresent)
          console.log('availablePresentPlayers:', availablePresentPlayers)
          
          if (availablePresentPlayers.length < requiredPlayers) {
            alert(`Se necesitan al menos ${requiredPlayers} jugadores presentes para generar equipos. Actualmente tienes ${availablePresentPlayers.length} jugadores.`)
            setLoading(false)
            return
          }
          
          // Ordenar por habilidad para mejor distribución
          const sortedPlayers = [...availablePresentPlayers].sort((a, b) => b.skill - a.skill)
          console.log('sortedPlayers:', sortedPlayers)
          
          const teamA: Player[] = []
          const teamB: Player[] = []
          
          // Distribuir jugadores alternando entre equipos
          sortedPlayers.forEach((player, index) => {
            if (index < requiredPlayers) {
              if (index % 2 === 0) {
                teamA.push(player)
              } else {
                teamB.push(player)
              }
            }
          })
          
          console.log('teamA:', teamA)
          console.log('teamB:', teamB)
          
          // Asignar posiciones según la formación
          const assignPositions = (teamPlayers: Player[], formation: string) => {
            const positions = getFormationPositions(formation, true)
            const positionNames = positions.map(p => p.position)
            console.log('positionNames:', positionNames)
            
            return teamPlayers.map((player, index) => ({
              ...player,
              position: positionNames[index] || 'Mediocampista'
            }))
          }
          
          const teams: Team[] = [
            {
              id: 1,
              name: 'Equipo A',
              players: assignPositions(teamA, selectedGameMode.formation),
              totalSkill: teamA.reduce((sum, p) => sum + p.skill, 0),
              averageSkill: teamA.length > 0 ? teamA.reduce((sum, p) => sum + p.skill, 0) / teamA.length : 0
            },
            {
              id: 2,
              name: 'Equipo B',
              players: assignPositions(teamB, selectedGameMode.formation),
              totalSkill: teamB.reduce((sum, p) => sum + p.skill, 0),
              averageSkill: teamB.length > 0 ? teamB.reduce((sum, p) => sum + p.skill, 0) / teamB.length : 0
            }
          ]
          
          console.log('Equipos generados:', teams)
          saveGeneratedTeams(teams)
          setLoading(false)
        } catch (error) {
          console.error('Error generando equipos:', error)
          alert('Error al generar equipos. Intenta de nuevo.')
          setLoading(false)
        }
      }, 1000)
    } catch (error) {
      console.error('Error en generateBalancedTeams:', error)
      alert('Error al generar equipos. Intenta de nuevo.')
      setLoading(false)
    }
  }

  const regenerateTeams = () => {
    console.log('regenerateTeams called')
    console.log('regenerateTeams - generatedTeams.length:', generatedTeams.length)
    if (generatedTeams.length > 0) {
      console.log('regenerateTeams - calling generateBalancedTeams')
      generateBalancedTeams()
    } else {
      console.log('regenerateTeams - no teams to regenerate')
    }
  }

  const clearGeneratedTeams = () => {
    setGeneratedTeams([])
    setShowGeneratedTeams(false)
    localStorage.removeItem('generatedTeams')
  }

  const handleDragStart = (player: Player, teamId: number | null) => {
    setDragState({
      isDragging: true,
      draggedPlayer: player,
      sourceTeam: teamId
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetTeamId: number) => {
    if (!dragState.draggedPlayer) return

    const updatedTeams = teams.map(team => {
      if (team.id === targetTeamId) {
        // Agregar jugador al equipo destino
        return {
          ...team,
          players: [...team.players, dragState.draggedPlayer!],
          totalSkill: team.players.reduce((sum: number, p: any) => sum + p.skill, 0) + dragState.draggedPlayer!.skill,
          averageSkill: Math.round(((team.players.reduce((sum: number, p: any) => sum + p.skill, 0) + dragState.draggedPlayer!.skill) / (team.players.length + 1)) * 10) / 10
        }
      } else if (dragState.sourceTeam && team.id === dragState.sourceTeam) {
        // Remover jugador del equipo origen
        const filteredPlayers = team.players.filter((p: any) => p.id !== dragState.draggedPlayer!.id)
        return {
          ...team,
          players: filteredPlayers,
          totalSkill: filteredPlayers.reduce((sum: number, p: any) => sum + p.skill, 0),
          averageSkill: filteredPlayers.length > 0 ? Math.round((filteredPlayers.reduce((sum: number, p: any) => sum + p.skill, 0) / filteredPlayers.length) * 10) / 10 : 0
        }
      }
      return team
    })

    setTeams(updatedTeams)
    setDragState({
      isDragging: false,
      draggedPlayer: null,
      sourceTeam: null
    })
  }

  const shareTeams = () => {
    const selectedTeam = availableTeams.find(t => t.id === selectedTeamId)
    const teamName = selectedTeam?.name || 'Equipo'
    
    const teamsText = teams.map(team => {
      const playersList = team.players.map((p: any) => `${p.name} (${p.skill}⭐)`).join('\n')
      return `${team.name}:\n${playersList}\nPromedio: ${team.averageSkill}⭐\n`
    }).join('\n')

    const presentCount = presentPlayers.filter(p => p.isPresent).length
    const reserveCount = reservePlayers.length
    const fullText = `⚽ EQUIPOS GENERADOS - ${teamName} ⚽\n\n${teamsText}\nJugadores presentes: ${presentCount}\nReservas: ${reserveCount}\nGenerado con FormaciónPro Soccer`

    if (navigator.share) {
      navigator.share({
        title: 'Equipos Generados',
        text: fullText
      })
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(fullText)
      alert('Equipos copiados al portapapeles')
    }
  }

  const exportToExcel = () => {
    const selectedTeam = availableTeams.find(t => t.id === selectedTeamId)
    const teamName = selectedTeam?.name || 'Equipo'
    
    const csvContent = teams.map(team => {
      const playersCsv = team.players.map((p: any) => `${p.name},${p.skill},${p.position}`).join('\n')
      return `${team.name}\nJugador,Habilidad,Posición\n${playersCsv}\nPromedio,${team.averageSkill},\n`
    }).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `equipos-${teamName.toLowerCase().replace(/\s+/g, '-')}.csv`
    a.click()
  }

  const presentPlayersCount = presentPlayers.filter(p => p.isPresent).length
  const totalPlayersCount = presentPlayers.length
  const currentPlayersPerTeam = customPlayersPerTeam || selectedGameMode.playersPerTeam

  // Logs de depuración
  console.log('=== DEBUG ESTADO ACTUAL ===')
  console.log('loading:', loading)
  console.log('selectedTeamId:', selectedTeamId)
  console.log('presentPlayersCount:', presentPlayersCount)
  console.log('totalPlayersCount:', totalPlayersCount)
  console.log('currentPlayersPerTeam:', currentPlayersPerTeam)
  console.log('presentPlayers:', presentPlayers.map(p => ({ name: p.name, isPresent: p.isPresent })))
  console.log('players con isPresent:', players.filter(p => p.isPresent).map(p => ({ name: p.name, isPresent: p.isPresent })))
  console.log('========================')

  // Función para obtener posiciones según la formación
  const getFormationPositions = (formation: string, isTeamA: boolean) => {
    switch (formation) {
      case '1-2-1': // 4 jugadores
        return [
          { id: 'portero', position: 'Portero', x: isTeamA ? 12 : 88, y: 50 },
          { id: 'defensa1', position: 'Defensa', x: isTeamA ? 35 : 65, y: 35 },
          { id: 'defensa2', position: 'Defensa', x: isTeamA ? 35 : 65, y: 65 },
          { id: 'delantero', position: 'Delantero', x: isTeamA ? 65 : 35, y: 50 }
        ]
      case '1-2-2': // 5 jugadores
        return [
          { id: 'portero', position: 'Portero', x: isTeamA ? 12 : 88, y: 50 },
          { id: 'defensa1', position: 'Defensa', x: isTeamA ? 35 : 65, y: 35 },
          { id: 'defensa2', position: 'Defensa', x: isTeamA ? 35 : 65, y: 65 },
          { id: 'delantero1', position: 'Delantero', x: isTeamA ? 65 : 35, y: 35 },
          { id: 'delantero2', position: 'Delantero', x: isTeamA ? 65 : 35, y: 65 }
        ]
      case '2-2-2': // 7 jugadores
        return [
          { id: 'portero', position: 'Portero', x: isTeamA ? 12 : 88, y: 50 },
          { id: 'defensa1', position: 'Defensa', x: isTeamA ? 30 : 70, y: 30 },
          { id: 'defensa2', position: 'Defensa', x: isTeamA ? 30 : 70, y: 70 },
          { id: 'medio1', position: 'Mediocampista', x: isTeamA ? 50 : 50, y: 35 },
          { id: 'medio2', position: 'Mediocampista', x: isTeamA ? 50 : 50, y: 65 },
          { id: 'delantero1', position: 'Delantero', x: isTeamA ? 70 : 30, y: 35 },
          { id: 'delantero2', position: 'Delantero', x: isTeamA ? 70 : 30, y: 65 }
        ]
      case '1-2-2-2': // 7 jugadores (Futbolito)
        return [
          { id: 'portero', position: 'Portero', x: isTeamA ? 12 : 88, y: 50 },
          { id: 'defensa1', position: 'Defensa', x: isTeamA ? 25 : 75, y: 35 },
          { id: 'defensa2', position: 'Defensa', x: isTeamA ? 25 : 75, y: 65 },
          { id: 'medio1', position: 'Mediocampista', x: isTeamA ? 45 : 55, y: 35 },
          { id: 'medio2', position: 'Mediocampista', x: isTeamA ? 45 : 55, y: 65 },
          { id: 'delantero1', position: 'Delantero', x: isTeamA ? 70 : 30, y: 35 },
          { id: 'delantero2', position: 'Delantero', x: isTeamA ? 70 : 30, y: 65 }
        ]
      default:
        return []
    }
  }

  // Limpiar datos de prueba y recargar jugadores reales
  const clearTestDataAndReload = () => {
    try {
      console.log('Limpiando datos de prueba y recargando jugadores reales...')
      
      // Limpiar datos de prueba
      localStorage.removeItem('generator-players')
      localStorage.removeItem('generatedTeams')
      
      // Recargar jugadores reales desde teams-data
      loadTeamsAndPlayers()
      
      console.log('Datos de prueba limpiados y jugadores reales recargados')
    } catch (error) {
      console.error('Error limpiando datos de prueba:', error)
    }
  }

  // Sincronización automática con teams-data
  useEffect(() => {
    const handleTeamsDataUpdated = () => {
      console.log('🔄 Sincronización automática detectada - recargando datos...');
      loadTeamsAndPlayers();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'teams-data') {
        console.log('🔄 Cambio en localStorage detectado - recargando datos...');
        loadTeamsAndPlayers();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Página visible - verificando datos actualizados...');
        loadTeamsAndPlayers();
      }
    };

    // Escuchar eventos de sincronización
    window.addEventListener('teams-data-updated', handleTeamsDataUpdated);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Sincronización inicial
    loadTeamsAndPlayers();
    
    return () => {
      window.removeEventListener('teams-data-updated', handleTeamsDataUpdated);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Función para forzar sincronización con teams-data (mantener para casos especiales)
  const forceSyncWithTeamsData = () => {
    console.log('🔄 Sincronización manual forzada...');
    loadTeamsAndPlayers();
  };

  // Función de debug para verificar datos en teams-data


  // Función para verificar el estado actual de los datos
  const checkDataStatus = () => {
    const savedTeams = localStorage.getItem('teams-data');
    if (!savedTeams) {
      console.log('❌ No hay datos en teams-data');
      return;
    }

    const teamsData = JSON.parse(savedTeams);
    const matizFC = teamsData.find((team: any) => team.id === 1);
    
    if (!matizFC) {
      console.log('❌ No se encontró Matiz FC');
      return;
    }

    console.log('=== ESTADO ACTUAL DE DATOS ===');
    console.log('Total jugadores:', matizFC.players.length);
    
    matizFC.players.forEach((player: any, index: number) => {
      console.log(`${index + 1}. ${player.name}:`, {
        photo: !!player.photo,
        photo_url: !!player.photo_url,
        jersey_number: player.jersey_number,
        teamLogo: !!player.teamLogo
      });
    });
    console.log('=============================');
  };

  // Verificar datos al cargar
  useEffect(() => {
    checkDataStatus();
    loadTeamsAndPlayers();
  }, []);

  // Función para inspeccionar completamente localStorage
  const inspectLocalStorage = () => {
    console.log('=== INSPECCIÓN COMPLETA DE LOCALSTORAGE ===');
    
    // Verificar teams-data
    const teamsData = localStorage.getItem('teams-data');
    if (teamsData) {
      try {
        const parsed = JSON.parse(teamsData);
        console.log('📋 TEAMS-DATA encontrado:');
        console.log('Total equipos:', parsed.length);
        
        parsed.forEach((team: any, teamIndex: number) => {
          console.log(`\n🏆 EQUIPO ${teamIndex + 1}:`);
          console.log('ID:', team.id);
          console.log('Nombre:', team.name);
          console.log('Jugadores:', team.players?.length || 0);
          
          if (team.players && team.players.length > 0) {
            team.players.forEach((player: any, playerIndex: number) => {
              console.log(`  👤 JUGADOR ${playerIndex + 1}: ${player.name}`);
              console.log('    ID:', player.id);
              console.log('    Posición:', player.position);
              console.log('    Jersey:', player.jersey_number);
              console.log('    Tiene foto:', !!player.photo);
              console.log('    Tiene photo_url:', !!player.photo_url);
            });
          }
        });
      } catch (error) {
        console.error('Error parseando teams-data:', error);
      }
    } else {
      console.log('❌ No se encontró teams-data');
    }
    
    // Verificar otras claves que puedan contener datos
    console.log('\n🔍 OTRAS CLAVES EN LOCALSTORAGE:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== 'teams-data') {
        console.log(`Clave: ${key}`);
        try {
          const value = localStorage.getItem(key);
          if (value && value.length > 100) {
            console.log('  Valor (primeros 100 chars):', value.substring(0, 100) + '...');
          } else {
            console.log('  Valor:', value);
          }
        } catch (error) {
          console.log('  Error leyendo valor');
        }
      }
    }
    
    console.log('=== FIN DE INSPECCIÓN ===');
  };

  // Llamar inspección al cargar
  useEffect(() => {
    inspectLocalStorage();
    checkDataStatus();
    loadTeamsAndPlayers();
  }, []);

  // Función para verificar jugadores cargados vs mostrados
  const verifyPlayersDisplay = () => {
    console.log('=== VERIFICACIÓN DE JUGADORES ===');
    console.log('Total jugadores cargados:', players.length);
    console.log('Jugadores disponibles:', availablePlayers.length);
    console.log('Jugadores presentes:', presentPlayers.length);
    
    console.log('\n📋 LISTA COMPLETA DE JUGADORES:');
    players.forEach((player, index) => {
      console.log(`${index + 1}. ${player.name} (ID: ${player.id}) - ${player.position}`);
    });
    
    // Buscar específicamente Galleta 1 y Galleta 2
    const galleta1 = players.find(p => p.name === 'Galleta 1');
    const galleta2 = players.find(p => p.name === 'Galleta 2');
    
    console.log('\n🔍 BÚSQUEDA ESPECÍFICA:');
    console.log('Galleta 1 encontrado:', !!galleta1);
    if (galleta1) {
      console.log('  - ID:', galleta1.id);
      console.log('  - Posición:', galleta1.position);
      console.log('  - Tiene foto:', !!galleta1.photo);
      console.log('  - Tiene photo_url:', !!galleta1.photo_url);
    }
    
    console.log('Galleta 2 encontrado:', !!galleta2);
    if (galleta2) {
      console.log('  - ID:', galleta2.id);
      console.log('  - Posición:', galleta2.position);
      console.log('  - Tiene foto:', !!galleta2.photo);
      console.log('  - Tiene photo_url:', !!galleta2.photo_url);
    }
    
    console.log('=== FIN DE VERIFICACIÓN ===');
  };

  // Llamar verificación después de cargar datos
  useEffect(() => {
    const timer = setTimeout(() => {
      verifyPlayersDisplay();
    }, 1000); // Esperar 1 segundo para que se carguen los datos
    
    return () => clearTimeout(timer);
  }, [players]);

  // Función para resetear el estado loading en caso de emergencia
  const resetLoadingState = () => {
    setLoading(false)
    console.log('Estado loading reseteado manualmente')
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Generador de Equipos</h1>
            <p className="text-gray-600">Crea equipos equilibrados para partidos internos</p>
          </div>



          {/* Header EA SPORTS FC Style */}
          <div className="fc-header relative rounded-2xl shadow-2xl mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 fc-text-glow">⚽ EA SPORTS FC Team Generator</h1>
                  <p className="text-green-200 text-lg">Generador de Equipos Profesional</p>
                </div>
                <div className="text-right">
                  <div className="fc-badge-secondary p-4">
                    <p className="text-white/80 text-sm">Estado del Sistema</p>
                    <p className="text-green-400 font-bold text-lg">ONLINE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración Principal - EA SPORTS FC Style */}
          <div className="fc-container bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Configuración del Partido</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Selección de Equipo */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Seleccionar Equipo *
                </label>
                <select
                  value={selectedTeamId || ''}
                  onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-400"
                >
                  <option value="">Seleccionar equipo...</option>
                  {availableTeams.map((team, index) => (
                    <option key={`team-${team.id}-${index}`} value={team.id}>
                      {team.name} ({team.players?.length || 0} jugadores)
                    </option>
                  ))}
                </select>
              </div>

              {/* Modo de Juego */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Modo de Juego
                </label>
                <select
                  value={selectedGameMode.id}
                  onChange={(e) => {
                    const mode = GAME_MODES.find(m => m.id === e.target.value)
                    if (mode) {
                      setSelectedGameMode(mode)
                      setCustomPlayersPerTeam(null)
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-400"
                >
                  {GAME_MODES.map((mode, index) => (
                    <option key={`mode-${mode.id}-${index}`} value={mode.id}>
                      {mode.name} ({mode.playersPerTeam} vs {mode.playersPerTeam})
                    </option>
                  ))}
                </select>
              </div>

              {/* Estadísticas de Asistencia */}
              <div className="bg-gradient-to-br from-green-600/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                <label className="block text-sm font-medium text-green-300 mb-3">
                  Asistencia
                </label>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">
                    {presentPlayersCount}/{totalPlayersCount}
                  </p>
                  <p className="text-sm text-green-300">
                    {currentPlayersPerTeam * 2} necesarios
                  </p>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalPlayersCount > 0 ? (presentPlayersCount / totalPlayersCount) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Acciones
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAttendanceModal(true)}
                    disabled={!selectedTeamId || totalPlayersCount === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    📋 Lista Asistencia
                  </button>
                  <button
                    onClick={generateBalancedTeams}
                    disabled={loading || !selectedTeamId || presentPlayersCount < currentPlayersPerTeam * 2}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {loading ? '🔄 Generando...' : '⚽ Generar Equipos'}
                  </button>
                </div>
              </div>
            </div>

            {/* Configuración Avanzada - FIFA 26 Style */}
            <div className="mt-8 bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Configuración Avanzada</h3>
                </div>
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <button
                      onClick={() => setShowCustomSettingsModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      ⚙️ Personalizar
                    </button>
                    <button
                      onClick={() => setEnableEditing(!enableEditing)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                        enableEditing 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' 
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                      }`}
                    >
                      {enableEditing ? '🔒 Desactivar' : '✏️ Activar'}
                    </button>
                    <button
                      onClick={() => setShowEvaluation(!showEvaluation)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                        showEvaluation 
                          ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600' 
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                      }`}
                    >
                      {showEvaluation ? '👁️ Ocultar' : '📊 Mostrar'}
                    </button>
                    <button
                      onClick={forceSyncWithTeamsData}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      🔄 Sincronizar
                    </button>
                    <button
                      onClick={clearTestDataAndReload}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      🗑️ Limpiar
                    </button>
                    <button
                      onClick={cleanupLocalStorage}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      🧹 Limpiar Cache
                    </button>
                    <button
                      onClick={resetLoadingState}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      🔄 Reset Loading
                    </button>
                  </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Jugadores por equipo</p>
                  <p className="text-2xl font-bold text-blue-400">{currentPlayersPerTeam}</p>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Reservas disponibles</p>
                  <p className="text-2xl font-bold text-green-400">{reservePlayers.length}</p>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Modo edición</p>
                  <p className="text-lg font-bold text-purple-400">{enableEditing ? 'Activado' : 'Desactivado'}</p>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Evaluación</p>
                  <p className="text-lg font-bold text-orange-400">{showEvaluation ? 'Visible' : 'Oculta'}</p>
                </div>
              </div>
            </div>

            {/* Información del equipo seleccionado - FIFA 26 Style */}
            {selectedTeamId && (
              <div className="mt-8 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🏆</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {availableTeams.find(t => t.id === selectedTeamId)?.name}
                      </h3>
                      <p className="text-blue-300">
                        {presentPlayersCount} jugadores presentes de {totalPlayersCount} totales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-300">Promedio de habilidad</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {presentPlayersCount > 0 
                        ? Math.round((presentPlayers.filter(p => p.isPresent).reduce((sum, p) => sum + p.skill, 0) / presentPlayersCount) * 10) / 10
                        : 0}⭐
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Jugadores disponibles - FIFA 26 Style */}
          {selectedTeamId && (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">👥</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Jugadores de {availableTeams.find(t => t.id === selectedTeamId)?.name}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {availablePlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onEdit={() => {
                      console.log('Editando jugador:', player)
                      console.log('Player data completo:', JSON.stringify(player, null, 2))
                      setEditingPlayer(player)
                      setShowAddPlayerModal(true)
                    }}
                    onDelete={() => {
                      console.log('Eliminando jugador:', player.id)
                      deletePlayer(player.id)
                    }}
                    onDragStart={() => handleDragStart(player, null)}
                    isDragging={dragState.isDragging && dragState.draggedPlayer?.id === player.id}
                    onEvaluate={handlePlayerEvaluation}
                    showEvaluation={showEvaluation}
                    enableEditing={enableEditing}
                  />
                ))}
              </div>

              {availablePlayers.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500">No hay jugadores en este equipo</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Agrega jugadores para comenzar
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Jugadores de Reserva - FIFA 26 Style */}
          {reservePlayers.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-900/30 via-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-500/30 p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🔄</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Jugadores de Reserva ({reservePlayers.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {reservePlayers.map((player) => (
                  <div key={player.id} className="relative">
                    <PlayerCard
                      player={player}
                      onEdit={() => {
                        console.log('Editando jugador de reserva:', player)
                        setEditingPlayer(player)
                        setShowAddPlayerModal(true)
                      }}
                      onDelete={() => {
                        console.log('Eliminando jugador de reserva:', player.id)
                        removeReservePlayer(player.id)
                      }}
                      onDragStart={() => handleDragStart(player, null)}
                      isDragging={dragState.isDragging && dragState.draggedPlayer?.id === player.id}
                      onEvaluate={handlePlayerEvaluation}
                      showEvaluation={showEvaluation}
                      enableEditing={enableEditing}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipos Generados - FIFA 26 Style */}
          {(() => {
            console.log('Render condition - showGeneratedTeams:', showGeneratedTeams)
            console.log('Render condition - generatedTeams.length:', generatedTeams.length)
            console.log('Render condition - generatedTeams:', generatedTeams)
            return showGeneratedTeams && generatedTeams.length > 0 && (
              <div className="mt-8">
                {/* Header de Equipos Generados */}
                <div className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 rounded-2xl shadow-2xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white text-xl">🏆</span>
                      </div>
                      <h2 className="text-3xl font-bold text-white">Equipos Generados</h2>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={regenerateTeams}
                        className="px-6 py-3 fifa-button bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 font-semibold hover-fifa-glow"
                      >
                        🔄 Regenerar
                      </button>
                      <button
                        onClick={() => setShowReserveModal(true)}
                        className="px-6 py-3 fifa-button bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 font-semibold hover-fifa-glow"
                      >
                        👥 Reservas
                      </button>
                      <button
                        onClick={clearGeneratedTeams}
                        className="px-6 py-3 fifa-button bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 font-semibold hover-fifa-glow"
                      >
                        🗑️ Limpiar
                      </button>
                      <button
                        onClick={clearTestDataAndReload}
                        className="px-6 py-3 fifa-button bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 font-semibold hover-fifa-glow"
                      >
                        🧹 Datos
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid de Equipos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {generatedTeams.map((team, index) => (
                    <div key={`team-${team.id}-${index}`} className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 p-8">
                      {/* Header del Equipo */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                            team.id === 1 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                              : 'bg-gradient-to-r from-red-500 to-orange-600'
                          }`}>
                            <span className="text-white text-xl">{team.id === 1 ? 'A' : 'B'}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white">{team.name}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Promedio Habilidad</p>
                          <p className="text-2xl font-bold text-yellow-400">
                            {team.averageSkill ? team.averageSkill.toFixed(1) : '0.0'}/5
                          </p>
                        </div>
                      </div>

                      {/* Formación del equipo */}
                      <div className="mb-6">
                        <TeamFormation
                          players={team.players}
                          formation={selectedGameMode.formation}
                          editable={enableEditing}
                          onPlayerMove={handlePlayerMove}
                          onPositionChange={handlePositionChange}
                          customPlayersPerTeam={customPlayersPerTeam || undefined}
                          isTeamA={team.id === 1}
                        />
                      </div>

                      {/* Lista de jugadores */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-300 mb-4 text-lg">Jugadores ({team.players.length})</h4>
                        <PlayerList
                          players={team.players}
                          onEdit={(player) => {
                            setEditingPlayer(player)
                            setShowAddPlayerModal(true)
                          }}
                          onDelete={(playerId) => removePlayerFromTeam(playerId, team.id)}
                          onEvaluate={handlePlayerEvaluation}
                          showEvaluation={showEvaluation}
                          enableEditing={enableEditing}
                          onViewCard={(player) => {
                            setSelectedPlayerForCard(player)
                            setShowPlayerCardModal(true)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Modal para agregar/editar jugadores */}
          {showAddPlayerModal && (
            <PlayerModal
              player={editingPlayer}
              onClose={() => {
                setShowAddPlayerModal(false)
                setEditingPlayer(null)
              }}
              onSave={(playerData: any) => {
                if (editingPlayer) {
                  updatePlayer(editingPlayer.id, playerData)
                } else {
                  addPlayer(playerData)
                }
                setShowAddPlayerModal(false)
                setEditingPlayer(null)
              }}
            />
          )}

          {/* Modal de lista de asistencia */}
          {showAttendanceModal && (
            <AttendanceModal
              players={presentPlayers}
              onClose={() => setShowAttendanceModal(false)}
              onSave={(updatedPlayers: any) => {
                setPresentPlayers(updatedPlayers)
                setShowAttendanceModal(false)
              }}
              onSelectAll={selectAllPlayers}
              onDeselectAll={deselectAllPlayers}
              onAddReserve={addReservePlayer}
            />
          )}

          {/* Modal de configuración personalizada */}
          {showCustomSettingsModal && (
            <CustomSettingsModal
              currentMode={selectedGameMode}
              customPlayersPerTeam={customPlayersPerTeam}
              onClose={() => setShowCustomSettingsModal(false)}
              onSave={(settings: any) => {
                setCustomPlayersPerTeam(settings.playersPerTeam)
                setShowCustomSettingsModal(false)
              }}
            />
          )}

          {/* Modal de gestión de reservas */}
          {showReserveModal && (
            <ReserveModal
              players={players}
              reservePlayers={reservePlayers}
              generatedTeams={generatedTeams}
              onClose={() => setShowReserveModal(false)}
              onAddReserve={addReservePlayer}
              onRemoveReserve={removeReservePlayer}
              onAddToTeam={addPlayerToTeam}
              onReplacePlayer={replacePlayer}
            />
          )}

          {/* Modal de evaluación de jugador */}
          {showEvaluationModal && evaluatingPlayer && (
            <EvaluationModal
              player={evaluatingPlayer}
              onClose={() => {
                setShowEvaluationModal(false)
                setEvaluatingPlayer(null)
              }}
              onSave={(newStats: {
               velocidad: number
               disparo: number
               pase: number
               regate: number
               defensa: number
               fisico: number
             }) => handleEvaluationSave(evaluatingPlayer.id, newStats)}
            />
          )}

          {/* Modal de tarjeta del jugador */}
          {showPlayerCardModal && (
            <PlayerCardModal
              player={selectedPlayerForCard}
              onClose={() => {
                setShowPlayerCardModal(false)
                setSelectedPlayerForCard(null)
              }}
            />
          )}
        </div>
      </div>
    </MainLayout>
  )
}

// Componente Modal para jugadores
function PlayerModal({ player, onClose, onSave }: any) {
  const defaultPlayer = {
    name: '',
    email: '',
    country: '',
    phone: '',
    position: 'Mediocampista',
    age: '',
    jersey_number: '',
    photo_url: '',
    skill: 3
  }
  const [formData, setFormData] = useState({
    name: player?.name || player?.full_name || '',
    email: player?.email || '',
    country: player?.country || '',
    phone: player?.phone || '',
    position: player?.position || 'Mediocampista',
    age: player?.age ? player.age.toString() : '',
    jersey_number: player?.jersey_number ? player.jersey_number.toString() : '',
    photo_url: player?.photo_url || player?.photo || '',
    skill: Number(player?.skill) || 3
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [teams, setTeams] = useState<any[]>([])

  // Cargar equipos desde localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('teams-data')
    if (savedTeams) {
      try {
        const teamsData = JSON.parse(savedTeams)
        setTeams(teamsData)
      } catch (error) {
        console.error('Error cargando equipos:', error)
      }
    }
  }, [])

  // Actualizar formData cuando cambie el player
  useEffect(() => {
    console.log('PlayerModal: Actualizando formData con player:', player)
    console.log('Player email:', player?.email)
    console.log('Player phone:', player?.phone)
    console.log('Player age:', player?.age)
    console.log('Player country:', player?.country)
    console.log('Player jersey_number:', player?.jersey_number)
    
    const newFormData = {
      name: player?.name || player?.full_name || '',
      email: player?.email || '',
      country: player?.country || '',
      phone: player?.phone || '',
      position: player?.position || 'Mediocampista',
      age: player?.age ? player.age.toString() : '',
      jersey_number: player?.jersey_number ? player.jersey_number.toString() : '',
      photo_url: player?.photo_url || player?.photo || '',
      skill: Number(player?.skill) || 3
    }
    
    console.log('Nuevo formData:', newFormData)
    setFormData(newFormData)
    setPhotoPreview(player?.photo_url || player?.photo || null)
  }, [player])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
        setFormData({ ...formData, photo_url: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value
    const selectedCountry = countries.find(country => country.code === countryCode)
    
    setFormData({
      ...formData,
      country: countryCode,
      phone: selectedCountry ? selectedCountry.phoneCode : ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      age: parseInt(formData.age),
      jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
      photo: formData.photo_url,
      skill: formData.skill
    }
    onSave(data)
  }

  const positions = ['Portero', 'Defensa', 'Mediocampista', 'Delantero']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {player ? 'Editar Jugador en el Sistema' : 'Registrar Jugador en el Sistema'}
          </h1>
          <p className="text-blue-100 text-lg">
            {player ? 'Modifica la información del jugador' : 'Crea una cuenta de usuario para un jugador y asígnalo a un equipo'}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ingresa el nombre completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="jugador@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    País *
                  </label>
                  <select
                    value={formData.country}
                    onChange={handleCountryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Selecciona un país</option>
                    {countries.map((country, index) => (
                      <option key={`country-${country.code}-${index}`} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Posición
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Selecciona posición</option>
                    {positions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Edad *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    min="16"
                    max="50"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Camiseta
                </label>
                <input
                  type="number"
                  value={formData.jersey_number}
                  onChange={(e) => setFormData({...formData, jersey_number: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min="1"
                  max="99"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Habilidad *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = formData.skill >= star
                    return (
                      <button
                        key={`skill-star-${star}`}
                        type="button"
                        onClick={() => setFormData({...formData, skill: star})}
                        className="text-2xl transition-colors duration-200"
                      >
                        {isFilled ? '⭐' : '☆'}
                      </button>
                    )
                  })}
                  <span className="text-sm text-gray-600 ml-2">{formData.skill}/5</span>
                </div>
              </div>
            </div>

            {/* Asignación de Equipo */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Asignación de Equipo</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Equipo *
                </label>
                <select
                  value={player?.teamId || 1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled
                >
                  {teams.map((team, index) => (
                    <option key={`team-${team.id}-${index}`} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Foto del Jugador */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Foto del Jugador</h3>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {photoPreview && (
                  <div className="flex-shrink-0">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover border-2 border-blue-200 rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {player ? 'Actualizar Jugador' : 'Crear Cuenta de Jugador'}
                </div>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Componente Modal de lista de asistencia
function AttendanceModal({ players, onClose, onSave, onSelectAll, onDeselectAll, onAddReserve }: any) {
  const [attendanceList, setAttendanceList] = useState(players)
  const [showReserveOptions, setShowReserveOptions] = useState<number | null>(null)

  // Sincronizar el estado cuando cambian los players
  useEffect(() => {
    setAttendanceList(players)
  }, [players])

  const handlePlayerToggle = (playerId: number) => {
        setAttendanceList((prev: any) =>
      prev.map((player: any) => 
        player.id === playerId 
          ? { ...player, isPresent: !player.isPresent }
          : player
      )
    )
  }

  const handleSelectAll = () => {
    const updatedList = attendanceList.map((player: any) => ({ ...player, isPresent: true }))
    setAttendanceList(updatedList)
  }

  const handleDeselectAll = () => {
    const updatedList = attendanceList.map((player: any) => ({ ...player, isPresent: false }))
    setAttendanceList(updatedList)
  }

  const handleAddToReserves = (player: any) => {
    if (onAddReserve) {
      onAddReserve(player)
      setShowReserveOptions(null)
    }
  }

  const presentCount = attendanceList.filter((p: any) => p.isPresent).length
  const totalCount = attendanceList.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Asistencia
          </h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Presentes</p>
            <p className="text-lg font-bold text-green-600">{presentCount}/{totalCount}</p>
          </div>
        </div>

        {/* Controles rápidos */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Seleccionar Todos
          </button>
          <button
            onClick={handleDeselectAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Deseleccionar Todos
          </button>
        </div>

        {/* Lista de jugadores */}
        <div className="space-y-2">
          {attendanceList.map((player: any) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors relative ${
                player.isPresent 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={player.isPresent}
                  onChange={() => handlePlayerToggle(player.id)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <p className="font-medium text-gray-900">{player.name}</p>
                  <p className="text-sm text-gray-500">{player.position}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {Array.from({ length: player.skill }, (_, i) => (
                    <span key={`star-${player.id}-${i}-${Date.now()}`} className="text-yellow-400 text-sm">⭐</span>
                  ))}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  player.isPresent 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {player.isPresent ? 'Presente' : 'Ausente'}
                </span>
                {!player.isPresent && (
                  <button
                    onClick={() => setShowReserveOptions(showReserveOptions === player.id ? null : player.id)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Reserva
                  </button>
                )}
              </div>
              
              {/* Opciones de reserva */}
              {showReserveOptions === player.id && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button
                      onClick={() => handleAddToReserves(player)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                    >
                      Agregar a Reservas
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(attendanceList)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Guardar Asistencia
          </button>
        </div>
      </div>
    </div>
  )
} 

// Componente Modal de configuración personalizada
function CustomSettingsModal({ currentMode, customPlayersPerTeam, onClose, onSave }: any) {
  console.log('CustomSettingsModal renderizado')
  console.log('currentMode:', currentMode)
  console.log('customPlayersPerTeam:', customPlayersPerTeam)
  
  const [formData, setFormData] = useState({
    playersPerTeam: customPlayersPerTeam || currentMode.playersPerTeam,
    positions: currentMode.positions.join(', ')
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Guardando configuración personalizada:', formData)
    onSave(formData)
  }

  const positions = ['Portero', 'Defensa', 'Mediocampista', 'Delantero']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configuración Personalizada
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jugadores por equipo
            </label>
            <input
              type="number"
              value={formData.playersPerTeam}
              onChange={(e) => setFormData({...formData, playersPerTeam: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="20" // Assuming a reasonable max for players per team
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posiciones permitidas (separadas por coma)
            </label>
            <input
              type="text"
              value={formData.positions}
              onChange={(e) => setFormData({...formData, positions: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Portero, Defensa, Mediocampista, Delantero"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 

// Componente Modal de gestión de reservas
function ReserveModal({ 
  players, 
  reservePlayers, 
  generatedTeams, 
  onClose, 
  onAddReserve, 
  onRemoveReserve, 
  onAddToTeam, 
  onReplacePlayer 
}: any) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [selectedPlayerToReplace, setSelectedPlayerToReplace] = useState<number | null>(null)

  const availablePlayersForReserves = players.filter((p: any) => !p.isPresent && !reservePlayers.find((rp: any) => rp.id === p.id))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Gestión de Reservas y Jugadores Extra
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jugadores Disponibles */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Jugadores Disponibles</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availablePlayersForReserves.map((player: any) => (
                <div key={player.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <span className="text-sm font-medium">{player.name}</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: player.skill }, (_, i) => (
                        <span key={`star-${player.id}-${i}-${Date.now()}`} className="text-yellow-400 text-xs">⭐</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => onAddReserve(player)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ➕ Reserva
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reservas */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-3">Reservas ({reservePlayers.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {reservePlayers.map((player: any) => (
                <div key={player.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <span className="text-sm font-medium">{player.name}</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: player.skill }, (_, i) => (
                        <span key={`star-${player.id}-${i}-${Date.now()}`} className="text-yellow-400 text-xs">⭐</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onAddToTeam(player, 1)}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      ➕ Equipo A
                    </button>
                    <button
                      onClick={() => onAddToTeam(player, 2)}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      ➕ Equipo B
                    </button>
                    <button
                      onClick={() => onRemoveReserve(player.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reemplazar Jugador */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-3">Reemplazar Jugador</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seleccionar Equipo
                </label>
                <select
                  value={selectedTeam || ''}
                  onChange={(e) => setSelectedTeam(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccionar...</option>
                  <option value="1">Equipo A</option>
                  <option value="2">Equipo B</option>
                </select>
              </div>

              {selectedTeam && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jugador a Reemplazar
                  </label>
                  <select
                    value={selectedPlayerToReplace || ''}
                    onChange={(e) => setSelectedPlayerToReplace(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar...</option>
                    {generatedTeams
                      .find((t: any) => t.id === selectedTeam)
                      ?.players.map((player: any) => (
                        <option key={player.id} value={player.id}>
                          {player.name} ({player.position})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {selectedPlayerToReplace && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nuevo Jugador
                  </label>
                  <select
                    value={selectedPlayer?.id || ''}
                    onChange={(e) => {
                      const player = reservePlayers.find((p: any) => p.id === Number(e.target.value))
                      setSelectedPlayer(player || null)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar...</option>
                    {reservePlayers.map((player: any) => (
                      <option key={player.id} value={player.id}>
                        {player.name} ({player.skill}⭐)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedPlayer && selectedPlayerToReplace && (
                <button
                  onClick={() => {
                    onReplacePlayer(selectedPlayerToReplace, selectedPlayer, selectedTeam)
                    setSelectedPlayer(null)
                    setSelectedTeam(null)
                    setSelectedPlayerToReplace(null)
                  }}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  🔄 Reemplazar Jugador
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
} 

// Componente Modal de evaluación de jugador
function EvaluationModal({ player, onClose, onSave }: any) {
  const [stats, setStats] = useState({
    velocidad: player?.stats?.velocidad || 70,
    disparo: player?.stats?.disparo || 70,
    pase: player?.stats?.pase || 70,
    regate: player?.stats?.regate || 70,
    defensa: player?.stats?.defensa || 70,
    fisico: player?.stats?.fisico || 70
  })

  const handleChange = (field: keyof typeof stats, value: number) => {
    setStats({ ...stats, [field]: value })
  }

  const handleSubmit = () => {
    onSave(stats)
  }

  const getColorForValue = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-yellow-500'
    if (value >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-lg mx-4">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">
            Evaluar Habilidades de {player?.name}
          </h2>
          <p className="text-purple-100">
            Ajusta las estadísticas del jugador
          </p>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-6">
          {[
            { key: 'velocidad', label: 'Velocidad', icon: '⚡' },
            { key: 'disparo', label: 'Disparo', icon: '🎯' },
            { key: 'pase', label: 'Pase', icon: '📤' },
            { key: 'regate', label: 'Regate', icon: '🎭' },
            { key: 'defensa', label: 'Defensa', icon: '🛡️' },
            { key: 'fisico', label: 'Físico', icon: '💪' }
          ].map((stat) => (
            <div key={stat.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="font-semibold text-gray-700">{stat.label}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{stats[stat.key as keyof typeof stats]}</span>
              </div>
              
              {/* Slider personalizado */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stats[stat.key as keyof typeof stats]}
                  onChange={(e) => handleChange(stat.key as keyof typeof stats, Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${getColorForValue(stats[stat.key as keyof typeof stats])} 0%, ${getColorForValue(stats[stat.key as keyof typeof stats])} ${stats[stat.key as keyof typeof stats]}%, #e5e7eb ${stats[stat.key as keyof typeof stats]}%, #e5e7eb 100%)`
                  }}
                />
                
                {/* Marcadores de rango */}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          ))}

          {/* Resumen de estadísticas */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Resumen</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Promedio:</span>
                <span className="font-bold text-blue-600">
                  {Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Máxima:</span>
                <span className="font-bold text-green-600">
                  {Math.max(...Object.values(stats))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            Guardar Evaluación
          </button>
        </div>
      </div>
    </div>
  )
} 