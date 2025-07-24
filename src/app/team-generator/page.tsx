'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/Layout/MainLayout'
import PlayerCard from '@/components/team-generator/PlayerCard'
import TeamFormation from '@/components/team-generator/TeamFormation'
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
    }
  }, [availableTeams])

  // Actualizar jugadores disponibles cuando cambie el equipo seleccionado
  useEffect(() => {
    if (selectedTeamId && players.length > 0) {
      const teamPlayers = players.filter(player => player.teamId === selectedTeamId)
      setAvailablePlayers(teamPlayers)
      setPresentPlayers(teamPlayers.map(p => ({ ...p, isPresent: true })))
      setReservePlayers([])
      console.log('Jugadores del equipo actualizados:', teamPlayers.length)
    } else {
      setAvailablePlayers([])
      setPresentPlayers([])
      setReservePlayers([])
    }
  }, [selectedTeamId, players])

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

  const loadTeamsAndPlayers = async () => {
    try {
      console.log('Cargando equipos y jugadores...')
      // Cargar equipos desde localStorage
      const savedTeams = localStorage.getItem('teams-data')
      if (savedTeams) {
        const teamsData = JSON.parse(savedTeams)
        console.log('Equipos cargados:', teamsData.length)
        // Solo mostrar Matiz FC en la lista de equipos disponibles
        const matizFC = teamsData.find((team: any) => team.id === 1)
        if (matizFC) {
          setAvailableTeams([matizFC])
          console.log('Matiz FC cargado:', matizFC.name)
        } else {
          console.log('No se encontró Matiz FC')
          setAvailableTeams([])
        }
        // Cargar jugadores solo de Matiz FC con sincronización mejorada
        const allPlayers: Player[] = []
        if (matizFC && matizFC.players) {
          matizFC.players.forEach((player: any) => {
            // Preservar datos existentes del generador si existen
            const existingPlayer = players.find(p => p.id === player.id)
            const playerName = existingPlayer?.name || player.name || player.full_name || 'Jugador Sin Nombre'
            const playerSkill = existingPlayer?.skill || player.skill || 3
            console.log(`Loading player ${player.id}: existingPlayer.skill=${existingPlayer?.skill}, player.skill=${player.skill}, final skill=${playerSkill}`)
            const playerPosition = existingPlayer?.position || player.position || 'Mediocampista'
            const playerPhoto = existingPlayer?.photo || player.photo_url || player.avatar_url || player.photo
            const playerCountry = existingPlayer?.country || player.country || 'CL'
            const playerJersey = existingPlayer?.jersey_number || player.jersey_number || ''
            const playerTeamLogo = existingPlayer?.teamLogo || player.teamLogo || ''
            const playerEmail = existingPlayer?.email || player.email || ''
            const playerPhone = existingPlayer?.phone || player.phone || ''
            const playerAge = existingPlayer?.age || player.age || ''
            const playerStats = existingPlayer?.stats || player.stats || {
              velocidad: 70,
              disparo: 70,
              pase: 70,
              regate: 70,
              defensa: 70,
              fisico: 70
            }
            
            allPlayers.push({
              ...player, // Copia todos los campos
              id: player.id,
              name: playerName,
              skill: playerSkill,
              position: playerPosition,
              teamId: matizFC.id,
              teamName: matizFC.name,
              photo: playerPhoto,
              country: playerCountry,
              jersey_number: playerJersey,
              teamLogo: playerTeamLogo,
              email: playerEmail,
              phone: playerPhone,
              age: playerAge,
              stats: playerStats
            })
          })
          console.log('Jugadores de Matiz FC cargados:', allPlayers.length)
        }
        setPlayers(allPlayers)
        setAvailablePlayers(allPlayers)
        setLoading(false)
      } else {
        console.log('No se encontraron equipos en localStorage')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error cargando equipos y jugadores:', error)
      setLoading(false)
    }
  }

  const savePlayers = (newPlayers: Player[]) => {
    localStorage.setItem('generator-players', JSON.stringify(newPlayers))
    
    // También guardar en teams-data para sincronización
    const savedTeams = localStorage.getItem('teams-data')
    if (savedTeams) {
      const teamsData = JSON.parse(savedTeams)
      const matizFC = teamsData.find((team: any) => team.id === 1)
      if (matizFC) {
        // Actualizar los nombres de los jugadores en teams-data
        matizFC.players = matizFC.players.map((player: any) => {
          const updatedPlayer = newPlayers.find(p => p.id === player.id)
          if (updatedPlayer) {
            return {
              ...player,
              name: updatedPlayer.name,
              position: updatedPlayer.position,
              skill: updatedPlayer.skill,
              email: updatedPlayer.email,
              phone: updatedPlayer.phone,
              age: updatedPlayer.age,
              country: updatedPlayer.country,
              jersey_number: updatedPlayer.jersey_number
            }
          }
          return player
        })
        
        localStorage.setItem('teams-data', JSON.stringify(teamsData))
      }
    }
  }

  const addPlayer = (playerData: Omit<Player, 'id'>) => {
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
      localStorage.setItem('teams-data', JSON.stringify(teamsData))
      // Disparar evento personalizado para notificar a otros módulos
      window.dispatchEvent(new CustomEvent('teams-data-updated', {
        detail: { teamsData, updatedPlayer: newPlayer }
      }))
      loadTeamsAndPlayers()
    }
  }

  const updatePlayer = (id: number, playerData: Partial<Player>) => {
    // 1. Leer teams-data
    const savedTeams = localStorage.getItem('teams-data')
    if (!savedTeams) return
    const teamsData = JSON.parse(savedTeams)
    // 2. Buscar el equipo y el jugador, y actualizar todos los campos
    let updated = false
    for (const team of teamsData) {
      const idx = team.players.findIndex((p: any) => p.id === id)
      if (idx !== -1) {
        team.players[idx] = { 
          ...team.players[idx], 
          ...playerData,
          // Asegurar que los campos críticos se guarden correctamente
          name: playerData.name || team.players[idx].name,
          skill: playerData.skill || team.players[idx].skill,
          country: playerData.country || team.players[idx].country,
          jersey_number: playerData.jersey_number || team.players[idx].jersey_number,
          email: playerData.email || team.players[idx].email,
          phone: playerData.phone || team.players[idx].phone,
          age: playerData.age || team.players[idx].age,
          teamLogo: playerData.teamLogo || team.players[idx].teamLogo
        }
        updated = true
        break
      }
    }
    if (!updated) return
    // 3. Guardar teams-data actualizado
    localStorage.setItem('teams-data', JSON.stringify(teamsData))
    // 4. Disparar evento personalizado para notificar a otros módulos
    window.dispatchEvent(new CustomEvent('teams-data-updated', {
      detail: { teamsData, updatedPlayer: { id, ...playerData } }
    }))
    // 5. Recargar el array de jugadores desde teams-data
    loadTeamsAndPlayers()
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
    savePlayers(updatedPlayers)
    
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
      players: team.players.map(player => {
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
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, stats } : player
    )
    setPlayers(updatedPlayers)
    savePlayers(updatedPlayers)
    
    // Actualizar también en presentPlayers
    const updatedPresentPlayers = presentPlayers.map(player =>
      player.id === playerId ? { ...player, stats } : player
    )
    setPresentPlayers(updatedPresentPlayers)
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
    
    if (!selectedTeamId || presentPlayersCount < currentPlayersPerTeam * 2) {
      alert('No hay suficientes jugadores presentes para generar equipos')
      return
    }

    setLoading(true)

    // Simular delay de generación
    setTimeout(() => {
      const presentPlayers = players.filter(p => p.isPresent)
      console.log('presentPlayers:', presentPlayers)
      
      if (presentPlayers.length < currentPlayersPerTeam * 2) {
        alert(`Se necesitan al menos ${currentPlayersPerTeam * 2} jugadores presentes para generar equipos`)
        setLoading(false)
        return
      }
      
      // Ordenar por habilidad para mejor distribución
      const sortedPlayers = [...presentPlayers].sort((a, b) => b.skill - a.skill)
      console.log('sortedPlayers:', sortedPlayers)
      
      const teamA: Player[] = []
      const teamB: Player[] = []
      
      // Distribuir jugadores alternando entre equipos
      sortedPlayers.forEach((player, index) => {
        if (index < currentPlayersPerTeam * 2) {
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
    }, 1000)
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
          totalSkill: team.players.reduce((sum, p) => sum + p.skill, 0) + dragState.draggedPlayer!.skill,
          averageSkill: Math.round(((team.players.reduce((sum, p) => sum + p.skill, 0) + dragState.draggedPlayer!.skill) / (team.players.length + 1)) * 10) / 10
        }
      } else if (dragState.sourceTeam && team.id === dragState.sourceTeam) {
        // Remover jugador del equipo origen
        const filteredPlayers = team.players.filter(p => p.id !== dragState.draggedPlayer!.id)
        return {
          ...team,
          players: filteredPlayers,
          totalSkill: filteredPlayers.reduce((sum, p) => sum + p.skill, 0),
          averageSkill: filteredPlayers.length > 0 ? Math.round((filteredPlayers.reduce((sum, p) => sum + p.skill, 0) / filteredPlayers.length) * 10) / 10 : 0
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
      const playersList = team.players.map(p => `${p.name} (${p.skill}⭐)`).join('\n')
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
      const playersCsv = team.players.map(p => `${p.name},${p.skill},${p.position}`).join('\n')
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
      default:
        return []
    }
  }

  // Limpiar datos de prueba y recargar jugadores reales
  const clearTestDataAndReload = () => {
    console.log('Limpiando datos de prueba...')
    localStorage.removeItem('generator-players')
    localStorage.removeItem('generatedTeams')
    setGeneratedTeams([])
    setShowGeneratedTeams(false)
    setPresentPlayers([])
    setReservePlayers([])
    
    // Recargar solo jugadores reales de Matiz FC
    syncPlayersWithDatabase()
    console.log('Datos de prueba limpiados y jugadores reales recargados')
  }

  // Forzar recarga completa de datos
  const forceReloadData = async () => {
    try {
      console.log('Forzando recarga completa de datos...')
      setLoading(true)
      
      // Limpiar estados actuales
      setPlayers([])
      setAvailablePlayers([])
      setPresentPlayers([])
      setReservePlayers([])
      setGeneratedTeams([])
      setShowGeneratedTeams(false)
      
      // Recargar equipos y jugadores
      await loadTeamsAndPlayers()
      
      // Sincronizar con base de datos
      await syncPlayersWithDatabase()
      
      console.log('Recarga completa de datos finalizada')
      setLoading(false)
    } catch (error) {
      console.error('Error en recarga completa de datos:', error)
      setLoading(false)
    }
  }

  // Sincronizar jugadores con la base de datos (solo jugadores reales)
  const syncPlayersWithDatabase = async () => {
    try {
      console.log('Sincronizando con base de datos...')
      const savedTeams = localStorage.getItem('teams-data')
      if (savedTeams) {
        const teamsData = JSON.parse(savedTeams)
        const updatedPlayers: Player[] = []
        
        // Solo cargar jugadores de Matiz FC (teamId: 1)
        const matizFC = teamsData.find((team: any) => team.id === 1)
        if (matizFC && matizFC.players) {
          console.log('Jugadores de Matiz FC encontrados:', matizFC.players.length)
          matizFC.players.forEach((player: any) => {
            const existingPlayer = players.find(p => p.id === player.id)
            
            // Preservar el nombre modificado si existe, sino usar el de la base de datos
            const playerName = existingPlayer?.name || player.name || player.full_name || 'Jugador Sin Nombre'
            
            // Preservar skill existente o usar el de la base de datos
            const playerSkill = existingPlayer?.skill || player.skill || Math.floor(Math.random() * 5) + 1
            
            updatedPlayers.push({
              id: player.id,
              name: playerName,
              skill: playerSkill,
              position: existingPlayer?.position || player.position || 'Mediocampista',
              teamId: matizFC.id,
              teamName: matizFC.name,
              photo: existingPlayer?.photo || player.photo_url || player.avatar_url,
              isPresent: existingPlayer?.isPresent !== undefined ? existingPlayer.isPresent : true,
              stats: existingPlayer?.stats || {
                velocidad: Math.floor(Math.random() * 100) + 1,
                disparo: Math.floor(Math.random() * 100) + 1,
                pase: Math.floor(Math.random() * 100) + 1,
                regate: Math.floor(Math.random() * 100) + 1,
                defensa: Math.floor(Math.random() * 100) + 1,
                fisico: Math.floor(Math.random() * 100) + 1
              }
            })
          })
        } else {
          console.log('No se encontró Matiz FC en teams-data')
        }
        
        setPlayers(updatedPlayers)
        console.log('Jugadores sincronizados:', updatedPlayers.length)
        
        // Si hay un equipo seleccionado, actualizar presentPlayers y availablePlayers
        if (selectedTeamId === 1) {
          setPresentPlayers(updatedPlayers.map(p => ({ ...p, isPresent: true })))
          setAvailablePlayers(updatedPlayers)
          setReservePlayers([])
        } else {
          setAvailablePlayers([])
          setPresentPlayers([])
          setReservePlayers([])
        }
      } else {
        console.log('No se encontró teams-data en localStorage')
      }
    } catch (error) {
      console.error('Error sincronizando jugadores:', error)
    }
  }

  // Sincronizar jugadores automáticamente al cargar
  useEffect(() => {
    syncPlayersWithDatabase()
  }, []) // Solo se ejecuta una vez al montar el componente

  // Escuchar cambios en localStorage para sincronización automática
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'teams-data') {
        console.log('Detectado cambio en teams-data, recargando...')
        loadTeamsAndPlayers()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Página visible, recargando datos...')
        syncPlayersWithDatabase()
      }
    }

    const handleTeamsDataUpdated = (event: CustomEvent) => {
      console.log('Evento teams-data-updated recibido, recargando datos...')
      loadTeamsAndPlayers()
    }

    window.addEventListener('storage', handleStorageChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('teams-data-updated', handleTeamsDataUpdated as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('teams-data-updated', handleTeamsDataUpdated as EventListener)
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'teams-data') {
        console.log('Detectado cambio en teams-data, recargando...')
        loadTeamsAndPlayers();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Página visible, recargando datos...')
        loadTeamsAndPlayers();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Generador de Equipos</h1>
            <p className="text-gray-600">Crea equipos equilibrados para partidos internos</p>
          </div>



          {/* Header FIFA 26 Style */}
          <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 rounded-2xl shadow-2xl mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">⚽ Team Generator</h1>
                  <p className="text-blue-200 text-lg">Generador de Equipos Profesional</p>
                </div>
                <div className="text-right">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/80 text-sm">Estado del Sistema</p>
                    <p className="text-green-400 font-bold text-lg">ONLINE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración Principal - FIFA 26 Style */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  {GAME_MODES.map((mode, index) => (
                    <option key={`mode-${mode.id}-${index}`} value={mode.id}>
                      {mode.name} ({mode.playersPerTeam} vs {mode.playersPerTeam})
                    </option>
                  ))}
                </select>
              </div>

              {/* Estadísticas de Asistencia */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                <label className="block text-sm font-medium text-blue-300 mb-3">
                  Asistencia
                </label>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">
                    {presentPlayersCount}/{totalPlayersCount}
                  </p>
                  <p className="text-sm text-blue-300">
                    {currentPlayersPerTeam * 2} necesarios
                  </p>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
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
                    className="w-full fifa-button bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover-fifa-glow"
                  >
                    📋 Lista Asistencia
                  </button>
                  <button
                    onClick={generateBalancedTeams}
                    disabled={loading || !selectedTeamId || presentPlayersCount < currentPlayersPerTeam * 2}
                    className="w-full fifa-button bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover-fifa-glow"
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
                                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => setShowCustomSettingsModal(true)}
                      className="px-4 py-2 fifa-button bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 font-semibold hover-fifa-glow"
                    >
                      ⚙️ Personalizar
                    </button>
                    <button
                      onClick={() => setEnableEditing(!enableEditing)}
                      className={`px-4 py-2 rounded-lg fifa-button font-semibold hover-fifa-glow ${
                        enableEditing 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' 
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                      }`}
                    >
                      {enableEditing ? '🔒 Desactivar Edición' : '✏️ Activar Edición'}
                    </button>
                    <button
                      onClick={() => setShowEvaluation(!showEvaluation)}
                      className={`px-4 py-2 rounded-lg fifa-button font-semibold hover-fifa-glow ${
                        showEvaluation 
                          ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600' 
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                      }`}
                    >
                      {showEvaluation ? '👁️ Ocultar Evaluación' : '📊 Mostrar Evaluación'}
                    </button>
                    <button
                      onClick={syncPlayersWithDatabase}
                      className="px-4 py-2 fifa-button bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 font-semibold hover-fifa-glow"
                    >
                      🔄 Sincronizar
                    </button>
                    <button
                      onClick={forceReloadData}
                      className="px-4 py-2 fifa-button bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 font-semibold hover-fifa-glow"
                    >
                      🔄 Recargar Datos
                    </button>
                    <button
                      onClick={clearTestDataAndReload}
                      className="px-4 py-2 fifa-button bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 font-semibold hover-fifa-glow"
                    >
                      🗑️ Limpiar Datos
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
                          customPlayersPerTeam={customPlayersPerTeam}
                          isTeamA={team.id === 1}
                        />
                      </div>

                      {/* Lista de jugadores */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-300 mb-4 text-lg">Jugadores ({team.players.length})</h4>
                        {team.players.map((player) => (
                          <div key={player.id} className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-white">{player.name}</span>
                              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">({player.position})</span>
                              <div className="flex space-x-1">
                                {Array.from({ length: player.skill }, (_, i) => (
                                  <span key={`star-${player.id}-${i}-${Date.now()}`} className="text-yellow-400 text-xs">⭐</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => removePlayerFromTeam(player.id, team.id)}
                                className="px-3 py-1 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                              >
                                ❌
                              </button>
                              <button
                                onClick={() => setShowReserveModal(true)}
                                className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                              >
                                🔄
                              </button>
                            </div>
                          </div>
                        ))}
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
              onSave={(playerData) => {
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
              onSave={(updatedPlayers) => {
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
              onSave={(settings) => {
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

  const handlePlayerToggle = (playerId: number) => {
    setAttendanceList(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, isPresent: !player.isPresent }
          : player
      )
    )
  }

  const handleSelectAll = () => {
    const updatedList = attendanceList.map(player => ({ ...player, isPresent: true }))
    setAttendanceList(updatedList)
  }

  const handleDeselectAll = () => {
    const updatedList = attendanceList.map(player => ({ ...player, isPresent: false }))
    setAttendanceList(updatedList)
  }

  const handleAddToReserves = (player: any) => {
    if (onAddReserve) {
      onAddReserve(player)
      setShowReserveOptions(null)
    }
  }

  const presentCount = attendanceList.filter(p => p.isPresent).length
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

  const availablePlayersForReserves = players.filter(p => !p.isPresent && !reservePlayers.find(rp => rp.id === p.id))

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
              {availablePlayersForReserves.map((player) => (
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
              {reservePlayers.map((player) => (
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
                      .find(t => t.id === selectedTeam)
                      ?.players.map((player) => (
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
                      const player = reservePlayers.find(p => p.id === Number(e.target.value))
                      setSelectedPlayer(player || null)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar...</option>
                    {reservePlayers.map((player) => (
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