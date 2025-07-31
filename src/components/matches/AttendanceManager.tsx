'use client'

import React, { useState, useEffect } from 'react'
import { Match, PlayerAttendance, Player } from '@/types'
import { useAuthStore } from '@/store/authStore'

interface AttendanceManagerProps {
  match: Match
  onUpdateAttendance: (attendance: PlayerAttendance[]) => void
}

export default function AttendanceManager({ match, onUpdateAttendance }: AttendanceManagerProps) {
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<string>('all')
  
  const { user } = useAuthStore()

  // Cargar jugadores disponibles desde localStorage
  useEffect(() => {
    const loadPlayers = () => {
      try {
        const savedPlayers = localStorage.getItem('players-data')
        if (savedPlayers) {
          const players = JSON.parse(savedPlayers)
          // Filtrar jugadores que no están ya invitados
          const invitedPlayerIds = match.attendance?.map(a => a.playerId) || []
          const available = players.filter((player: Player) => !invitedPlayerIds.includes(player.id.toString()))
          setAvailablePlayers(available)
          setFilteredPlayers(available)
        }
      } catch (error) {
        console.error('Error cargando jugadores:', error)
      }
    }

    loadPlayers()
  }, [match.attendance])

  // Filtrar jugadores basado en búsqueda, equipo y posición
  useEffect(() => {
    let filtered = availablePlayers

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por equipo (para administradores)
    if (user?.role === 'admin' && selectedTeam !== 'all') {
      // Por ahora todos los jugadores son de Matiz FC
      // En el futuro esto se puede expandir para múltiples equipos
      filtered = filtered.filter(player => player.team_id?.toString() === selectedTeam)
    }

    // Filtrar por posición
    if (selectedPosition !== 'all') {
      filtered = filtered.filter(player => 
        player.position_zone?.abbreviation === selectedPosition
      )
    }

    setFilteredPlayers(filtered)
  }, [availablePlayers, searchTerm, selectedTeam, selectedPosition, user?.role])

  const handleInvitePlayers = () => {
    if (selectedPlayers.length === 0) return

    const newAttendance: PlayerAttendance[] = selectedPlayers.map(playerId => {
      const player = availablePlayers.find(p => p.id.toString() === playerId)
      return {
        playerId,
        player: player!,
        status: 'pending',
        confirmedAt: undefined
      }
    })

    const updatedAttendance = [...(match.attendance || []), ...newAttendance]
    onUpdateAttendance(updatedAttendance)
    setSelectedPlayers([])
    setShowInviteModal(false)
  }

  const handleStatusChange = (playerId: string, newStatus: 'confirmed' | 'declined' | 'pending') => {
    const updatedAttendance = match.attendance?.map(attendance => {
      if (attendance.playerId === playerId) {
        return {
          ...attendance,
          status: newStatus,
          confirmedAt: newStatus === 'confirmed' ? new Date() : undefined
        }
      }
      return attendance
    }) || []

    onUpdateAttendance(updatedAttendance)
  }

  const handleRemovePlayer = (playerId: string) => {
    const updatedAttendance = match.attendance?.filter(attendance => attendance.playerId !== playerId) || []
    onUpdateAttendance(updatedAttendance)
  }

  const getAttendanceStats = () => {
    if (!match.attendance || match.attendance.length === 0) {
      return { confirmed: 0, pending: 0, declined: 0, total: 0 }
    }

    const confirmed = match.attendance.filter(a => a.status === 'confirmed').length
    const pending = match.attendance.filter(a => a.status === 'pending').length
    const declined = match.attendance.filter(a => a.status === 'declined').length

    return { confirmed, pending, declined, total: match.attendance.length }
  }

  const attendanceStats = getAttendanceStats()

  // Obtener posiciones únicas para el filtro
  const uniquePositions = Array.from(new Set(availablePlayers.map(p => p.position_zone?.abbreviation))).filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">Gestión de Asistencia</h4>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          + Invitar Jugadores
        </button>
      </div>

      {/* Estadísticas de Asistencia */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3 text-center">
          <div className="text-green-400 text-2xl font-bold">{attendanceStats.confirmed}</div>
          <div className="text-green-400 text-xs">Confirmados</div>
        </div>
        <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 text-center">
          <div className="text-yellow-400 text-2xl font-bold">{attendanceStats.pending}</div>
          <div className="text-yellow-400 text-xs">Pendientes</div>
        </div>
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 text-center">
          <div className="text-red-400 text-2xl font-bold">{attendanceStats.declined}</div>
          <div className="text-red-400 text-xs">Rechazados</div>
        </div>
      </div>

      {/* Tasa de Confirmación */}
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">Tasa de Confirmación</span>
          <span className="text-white font-semibold">
            {attendanceStats.total > 0 ? Math.round((attendanceStats.confirmed / attendanceStats.total) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${attendanceStats.total > 0 ? (attendanceStats.confirmed / attendanceStats.total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Lista de Jugadores */}
      <div className="space-y-3">
        <h5 className="text-md font-semibold text-white">Jugadores Invitados</h5>
        {match.attendance && match.attendance.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {match.attendance.map((attendance) => (
              <div key={attendance.playerId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {attendance.player.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{attendance.player.name}</div>
                    <div className="text-gray-400 text-xs">{attendance.player.position_zone?.name_es || 'Sin posición'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Botones de estado */}
                  <select
                    value={attendance.status}
                    onChange={(e) => handleStatusChange(attendance.playerId, e.target.value as any)}
                    className="text-xs bg-white/10 text-white rounded px-2 py-1 border border-white/20"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="declined">Rechazado</option>
                  </select>
                  
                  {/* Botón de eliminar */}
                  <button
                    onClick={() => handleRemovePlayer(attendance.playerId)}
                    className="text-red-400 hover:text-red-300 text-xs p-1"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-lg mb-2">No hay jugadores invitados</div>
            <div className="text-sm">Invita jugadores al partido para gestionar su asistencia</div>
          </div>
        )}
      </div>

      {/* Modal de Invitar Jugadores */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Invitar Jugadores</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {/* Búsqueda */}
              <div>
                <input
                  type="text"
                  placeholder="Buscar jugadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 placeholder-gray-400"
                />
              </div>

              {/* Filtro por equipo (solo para administradores) */}
              {user?.role === 'admin' && (
                <div>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20"
                  >
                    <option value="all">Todos los equipos</option>
                    <option value="1">Matiz FC</option>
                  </select>
                </div>
              )}

              {/* Filtro por posición */}
              <div>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20"
                >
                  <option value="all">Todas las posiciones</option>
                  {uniquePositions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Información de filtros */}
            <div className="text-sm text-gray-400 mb-4">
              {filteredPlayers.length} jugadores encontrados
              {searchTerm && ` para "${searchTerm}"`}
              {selectedPosition !== 'all' && ` en posición ${selectedPosition}`}
            </div>

            {/* Lista de jugadores */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPlayers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No hay jugadores disponibles para invitar
                </div>
              ) : (
                filteredPlayers.map((player) => (
                  <label key={player.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPlayers.includes(player.id.toString())}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPlayers([...selectedPlayers, player.id.toString()])
                        } else {
                          setSelectedPlayers(selectedPlayers.filter(id => id !== player.id.toString()))
                        }
                      }}
                      className="text-blue-600 rounded"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {player.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{player.name}</div>
                        <div className="text-gray-400 text-xs">{player.position_zone?.name_es || 'Sin posición'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-xs">Nivel {player.skill_level}</div>
                        <div className="text-gray-400 text-xs">{player.position_zone?.abbreviation}</div>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>

            {/* Jugadores seleccionados */}
            {selectedPlayers.length > 0 && (
              <div className="mt-4 p-3 bg-blue-600/20 rounded-lg">
                <div className="text-sm text-blue-400 mb-2">Jugadores seleccionados:</div>
                <div className="text-white text-sm">
                  {selectedPlayers.map(playerId => {
                    const player = availablePlayers.find(p => p.id.toString() === playerId)
                    return player ? (
                      <span key={playerId} className="inline-block bg-blue-600/30 px-2 py-1 rounded mr-2 mb-1">
                        {player.name}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}

            <div className="flex space-x-3 mt-4 pt-4 border-t border-white/20">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleInvitePlayers}
                disabled={selectedPlayers.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Invitar ({selectedPlayers.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 