'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { countries, getCitiesByCountry, getCommunesByCity } from '@/lib/locations'
import MainLayout from '@/components/Layout/MainLayout'
import PlayerModal from '@/components/teams/PlayerModal'
import ProfessionalPlayerCard from '@/components/teams/ProfessionalPlayerCard'
import PlayerListView from '@/components/teams/PlayerListView'
import { teamService, Team, Player } from '@/services/teamService'

export default function TeamsPage() {
  const { user, token, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAuthWarning, setShowAuthWarning] = useState(false)
  
  // Estados para modales
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState<number | null>(null)
  
  // Estados para filtrado y vista
  const [selectedFilterTeam, setSelectedFilterTeam] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('list')
  const [showAllPlayers, setShowAllPlayers] = useState(false)

  // Cargar equipos desde el backend
  useEffect(() => {
    const loadTeams = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log('TeamsPage - Cargando equipos desde el backend...')
        const teamsData = await teamService.getTeams()
        console.log('TeamsPage - Equipos cargados:', teamsData)
        setTeams(teamsData)
      } catch (error) {
        console.error('Error cargando equipos:', error)
        setError('Error al cargar equipos desde el servidor')
        setTeams([])
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [isAuthenticated])

  useEffect(() => {
    // Mostrar advertencia si no está autenticado
    if (!isAuthenticated || !user || !token) {
      setShowAuthWarning(true)
    }
  }, [isAuthenticated, user, token])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleAddTeam = () => {
    setEditingTeam(null)
    setShowTeamModal(true)
  }

  const handleEditTeam = (team: any) => {
    setEditingTeam(team)
    setShowTeamModal(true)
  }

  const handleDeleteTeam = async (teamId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        await teamService.deleteTeam(teamId);
        // Recargar equipos desde el backend
        const updatedTeams = await teamService.getTeams();
        setTeams(updatedTeams);
        console.log('✅ Equipo eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar equipo:', error);
        alert('Error al eliminar equipo. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const handleTeamSubmit = async (formData: any) => {
    try {
      if (editingTeam) {
        // Actualizar equipo existente
        console.log('Actualizando equipo:', editingTeam.id, formData);
        await teamService.updateTeam(editingTeam.id, {
          name: formData.name,
          city: formData.city,
          country: formData.country,
          founded: parseInt(formData.founded) || undefined,
          description: formData.description,
          logo_url: formData.logo_url
        });
        console.log('✅ Equipo actualizado exitosamente');
      } else {
        // Crear nuevo equipo
        console.log('Creando nuevo equipo:', formData);
        await teamService.createTeam({
          name: formData.name,
          city: formData.city,
          country: formData.country,
          founded: parseInt(formData.founded) || undefined,
          description: formData.description,
          logo_url: formData.logo_url
        });
        console.log('✅ Equipo creado exitosamente');
      }
      
      // Recargar equipos desde el backend
      const updatedTeams = await teamService.getTeams();
      setTeams(updatedTeams);
      
      setShowTeamModal(false);
      setEditingTeam(null);
      
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      alert('Error al guardar equipo. Por favor, inténtalo de nuevo.');
    }
  };

  // Funciones para jugadores
  const handleAddPlayer = (teamId: number) => {
    setSelectedTeamId(teamId)
    setEditingPlayer(null)
    setShowPlayerModal(true)
  }

  const handleEditPlayer = (player: any, teamId: number) => {
    setSelectedTeamId(teamId)
    setEditingPlayer(player)
    setShowPlayerModal(true)
  }

  const handleDeletePlayer = async (playerId: number, teamId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este jugador?')) return;
    
    try {
      await teamService.deletePlayer(playerId);
      // Recargar equipos desde el backend
      const updatedTeams = await teamService.getTeams();
      setTeams(updatedTeams);
      console.log('✅ Jugador eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar jugador:', error);
      alert('Error al eliminar jugador. Por favor, inténtalo de nuevo.');
    }
  };

  const handlePlayerSubmit = async (formData: any) => {
    if (!selectedTeamId) return;
    
    try {
      if (editingPlayer) {
        // Actualizar jugador existente
        console.log('Actualizando jugador:', editingPlayer.id, formData);
        await teamService.updatePlayer(editingPlayer.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          nationality: formData.country,
          position_zone_id: formData.position_zone_id,
          position_specific_id: formData.position_specific_id,
          jersey_number: parseInt(formData.jersey_number) || undefined,
          skill_level: parseInt(formData.skill_level) || 5,
          height: parseInt(formData.height) || undefined,
          weight: parseInt(formData.weight) || undefined,
          is_active: true
        });
        console.log('✅ Jugador actualizado exitosamente');
      } else {
        // Crear nuevo jugador
        console.log('Creando nuevo jugador:', formData);
        await teamService.createPlayer({
          user_id: 1, // ID temporal, se asignará automáticamente
          team_id: selectedTeamId,
          position_zone_id: formData.position_zone_id,
          position_specific_id: formData.position_specific_id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          nationality: formData.country,
          jersey_number: parseInt(formData.jersey_number) || undefined,
          skill_level: parseInt(formData.skill_level) || 5,
          height: parseInt(formData.height) || undefined,
          weight: parseInt(formData.weight) || undefined,
          is_active: true
        });
        console.log('✅ Jugador creado exitosamente');
      }
      
      // Recargar equipos desde el backend
      const updatedTeams = await teamService.getTeams();
      setTeams(updatedTeams);
      
      setShowPlayerModal(false);
      setEditingPlayer(null);
      setSelectedTeamId(null);
      
    } catch (error) {
      console.error('Error al guardar jugador:', error);
      alert('Error al guardar jugador. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para mostrar/ocultar detalles
  const toggleDetails = (teamId: number) => {
    setShowDetails(showDetails === teamId ? null : teamId)
  }

  // Funciones para filtrado y vista
  const handleFilterChange = (teamId: number | null) => {
    setSelectedFilterTeam(teamId)
    setShowAllPlayers(false)
    
    // Si se selecciona un equipo específico, cambiar a vista de tarjetas
    if (teamId) {
      setViewMode('cards')
    } else {
      // Si se deselecciona (todos los equipos), cambiar a vista de lista
      setViewMode('list')
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'list' : 'cards')
  }

  const toggleShowAllPlayers = () => {
    setShowAllPlayers(!showAllPlayers)
    
    // Si se activa "Ver todos los jugadores", cambiar a vista de lista
    if (!showAllPlayers) {
      setViewMode('list')
      setSelectedFilterTeam(null) // Limpiar filtro de equipo
    }
  }

  // Obtener jugadores filtrados
  const getFilteredPlayers = () => {
    if (selectedFilterTeam) {
      const team = teams.find(t => t.id === selectedFilterTeam)
      return team?.players || []
    }
    if (showAllPlayers) {
      const allPlayers = teams.flatMap((team: any) => 
        (team.players || []).map((player: any) => ({
          ...player,
          teamName: team.name,
          teamId: team.id
        }))
      )
      
      // Eliminar duplicados basándose en el ID del jugador
      const uniquePlayers = allPlayers.filter((player, index, self) => 
        index === self.findIndex(p => p.id === player.id)
      )
      
      console.log('getFilteredPlayers - allPlayers:', allPlayers.length)
      console.log('getFilteredPlayers - uniquePlayers:', uniquePlayers.length)
      console.log('getFilteredPlayers - player IDs:', uniquePlayers.map(p => p.id))
      
      return uniquePlayers
    }
    return []
  }

  const filteredPlayers = getFilteredPlayers()

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl shadow-2xl border border-blue-500/30 p-8 relative overflow-hidden">
          {/* Efecto de luz de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Equipos</h1>
                  <p className="text-xl text-blue-100 font-medium">Gestión profesional de equipos y jugadores</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/register-player')}
                  className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-green-400/30"
                  title="Crear cuenta de usuario para jugador"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Registrar Jugador</span>
                  </div>
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={handleLogin}
                    className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-blue-400/30"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Iniciar Sesión</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Advertencia de autenticación con diseño FIFA 26 */}
        {showAuthWarning && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start">
            <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.35 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Modo de Prueba</h3>
                <p className="text-yellow-700 mb-3">
                  Estás viendo datos simulados porque no estás autenticado.
                </p>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Iniciar sesión para acceder a datos reales</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controles de filtrado y vista con diseño FIFA 26 */}
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
                value={selectedFilterTeam || ''}
                onChange={(e) => handleFilterChange(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="">Todos los equipos</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleShowAllPlayers}
                className={`px-4 py-2 rounded-xl transition-all duration-200 font-semibold ${
                  showAllPlayers
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Ver todos los jugadores</span>
                </div>
              </button>

              <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-md">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'cards'
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Vista en tarjetas"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Vista en lista"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Información del filtro activo */}
          {(selectedFilterTeam || showAllPlayers) && (
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
                      {selectedFilterTeam 
                        ? `Mostrando jugadores de: ${teams.find(t => t.id === selectedFilterTeam)?.name}`
                        : 'Mostrando todos los jugadores'
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {filteredPlayers.length} jugador{filteredPlayers.length !== 1 ? 'es' : ''} encontrado{filteredPlayers.length !== 1 ? 's' : ''}
              </p>
            </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFilterTeam(null)
                    setShowAllPlayers(false)
                    setViewMode('list') // Cambiar a vista de lista al limpiar filtro
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar filtro
                </button>
          </div>
        </div>
      )}
        </div>

        {/* Vista de jugadores filtrados */}
        {(selectedFilterTeam || showAllPlayers) && (
          <div className="mb-8">
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlayers.map((player: any) => (
                  <ProfessionalPlayerCard
                    key={player.id}
                    player={player}
                    onEdit={() => handleEditPlayer(player, player.team_id || selectedFilterTeam)}
                    onDelete={() => handleDeletePlayer(player.id, player.team_id || selectedFilterTeam)}
                  />
                ))}
              </div>
            ) : (
              <PlayerListView
                players={filteredPlayers}
                onEdit={(player) => handleEditPlayer(player, player.team_id || selectedFilterTeam || 0)}
                onDelete={(playerId) => handleDeletePlayer(playerId, selectedFilterTeam || 0)}
              />
            )}
          </div>
        )}

        {/* Grid de equipos con diseño FIFA 26 - Solo mostrar cuando no hay filtro activo */}
        {!selectedFilterTeam && !showAllPlayers && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => (
              <div key={`team-${team.id}`} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                {team.logo_url && (
                      <div className="w-20 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-200">
                  <img 
                    src={team.logo_url} 
                    alt={`Logo ${team.name}`}
                          className="w-16 h-20 object-contain"
                  />
                      </div>
                )}
                <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{team.name}</h3>
                      <p className="text-gray-600 font-medium">
                    {team.city && `${team.city}, `}CL
                  </p>
                      <p className="text-sm text-gray-500 mt-1">Fundado: {team.founded}</p>
                </div>
              </div>
                  <div className="flex gap-2">
                <button
                  onClick={() => handleEditTeam(team)}
                      className="p-3 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Editar equipo"
                >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                      className="p-3 text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Eliminar equipo"
                >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Jugadores ({(team.players || []).length})</h4>
                <button
                  onClick={() => handleAddPlayer(team.id)}
                  className="text-green-500 hover:text-green-700 text-sm"
                >
                  + Agregar
                </button>
              </div>
              
              <div className="space-y-2">
                {(team.players || []).map((player: any) => (
                  <ProfessionalPlayerCard
                    key={player.id}
                    player={player}
                    compact={true}
                    onEdit={() => handleEditPlayer(player, team.id)}
                    onDelete={() => handleDeletePlayer(player.id, team.id)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleDetails(team.id)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                >
                  {showDetails === team.id ? 'Ocultar' : 'Ver'} Detalles
                </button>
                <button 
                  onClick={() => handleEditTeam(team)}
                  className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
                >
                  Editar
                </button>
              </div>
              
              {showDetails === team.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h5 className="font-medium mb-2">Detalles del Equipo</h5>
                  <div className="text-sm space-y-1">
                    <p><strong>Nombre:</strong> {team.name}</p>
                    <p><strong>Ciudad:</strong> {team.city}</p>
                    <p><strong>País:</strong> CL</p>
                    <p><strong>Fundado:</strong> {team.founded}</p>
                    <p><strong>Total Jugadores:</strong> {(team.players || []).length}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
        )}

                {/* Botón agregar equipo con diseño FIFA 26 - Solo mostrar cuando no hay filtro activo */}
        {!selectedFilterTeam && !showAllPlayers && (
          <div className="mt-12 text-center">
        <button 
          onClick={handleAddTeam}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>+ Agregar Nuevo Equipo</span>
              </div>
        </button>
      </div>
        )}

      {/* Modal para Equipos */}
      {showTeamModal && (
        <TeamModal
          isOpen={showTeamModal}
          onClose={() => {
            setShowTeamModal(false)
            setEditingTeam(null)
          }}
          onSubmit={handleTeamSubmit}
          team={editingTeam}
        />
      )}

      {/* Modal para Jugadores */}
      {showPlayerModal && selectedTeamId && (
        <PlayerModal
          isOpen={showPlayerModal}
          onClose={() => {
            setShowPlayerModal(false)
            setEditingPlayer(null)
            setSelectedTeamId(null)
          }}
          onSubmit={handlePlayerSubmit}
          player={editingPlayer}
          teamId={selectedTeamId}
        />
      )}
      </div>
    </MainLayout>
  )
}

// Componente Modal para Equipos
function TeamModal({ isOpen, onClose, onSubmit, team }: any) {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    country: team?.country || '',
    city: team?.city || '',
    commune: team?.commune || '',
    founded: team?.founded || '',
    logo_url: team?.logo_url || ''
  })
  const [availableCities, setAvailableCities] = useState<any[]>([])
  const [availableCommunes, setAvailableCommunes] = useState<any[]>([])
  const [logoPreview, setLogoPreview] = useState<string>('')

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
                      country: 'CL',
        city: team.city,
        commune: team.commune,
        founded: team.founded,
        logo_url: team.logo_url
      })
      setLogoPreview(team.logo_url || '')
    } else {
      setFormData({
        name: '',
        country: '',
        city: '',
        commune: '',
        founded: '',
        logo_url: ''
      })
      setLogoPreview('')
    }
  }, [team])

  // Actualizar ciudades cuando cambie el país
  useEffect(() => {
    if (formData.country) {
      const cities = getCitiesByCountry(formData.country)
      setAvailableCities(cities)
      // Resetear ciudad y comuna si cambia el país
      if (formData.city && !cities.find(c => c.id === formData.city)) {
        setFormData(prev => ({ ...prev, city: '', commune: '' }))
      }
    } else {
      setAvailableCities([])
    }
  }, [formData.country])

  // Actualizar comunas cuando cambie la ciudad
  useEffect(() => {
    if (formData.country && formData.city) {
      const communes = getCommunesByCity(formData.country, formData.city)
      setAvailableCommunes(communes)
      // Resetear comuna si cambia la ciudad
      if (formData.commune && !communes.find(c => c.id === formData.commune)) {
        setFormData(prev => ({ ...prev, commune: '' }))
      }
    } else {
      setAvailableCommunes([])
    }
  }, [formData.country, formData.city])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setFormData(prev => ({ ...prev, logo_url: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {team ? 'Editar Equipo' : 'Nuevo Equipo'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País *
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar país</option>
              {countries.map((country) => (
                <option key={`team-country-${country.id}`} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad *
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!formData.country}
            >
              <option value="">Seleccionar ciudad</option>
              {availableCities.map((city) => (
                <option key={`team-city-${city.id}`} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comuna *
            </label>
            <select
              value={formData.commune}
              onChange={(e) => setFormData({...formData, commune: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!formData.city}
            >
              <option value="">Seleccionar comuna</option>
              {availableCommunes.map((commune) => (
                <option key={`team-commune-${commune.id}`} value={commune.id}>
                  {commune.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año de Fundación *
            </label>
            <input
              type="number"
              value={formData.founded}
              onChange={(e) => setFormData({...formData, founded: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1800"
              max="2025"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo/Insignia del Equipo
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {logoPreview && (
                <div className="mt-2">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-20 h-20 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {team ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
 