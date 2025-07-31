'use client'

import React, { useState } from 'react'
import { Match, MatchEvent, Player } from '@/types'

interface EventsManagerProps {
  match: Match
  onUpdateEvents: (events: MatchEvent[]) => void
}

export default function EventsManager({ match, onUpdateEvents }: EventsManagerProps) {
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    type: 'goal' as MatchEvent['type'],
    playerId: '',
    minute: 1,
    description: '',
    team: 'home' as 'home' | 'away'
  })

  const eventTypes = [
    { id: 'goal', label: 'Gol', icon: '⚽', color: 'text-green-400' },
    { id: 'assist', label: 'Asistencia', icon: '🎯', color: 'text-blue-400' },
    { id: 'yellow_card', label: 'Tarjeta Amarilla', icon: '🟨', color: 'text-yellow-400' },
    { id: 'red_card', label: 'Tarjeta Roja', icon: '🟥', color: 'text-red-400' },
    { id: 'substitution', label: 'Sustitución', icon: '🔄', color: 'text-purple-400' },
    { id: 'injury', label: 'Lesión', icon: '🏥', color: 'text-orange-400' }
  ]

  const getEventIcon = (type: MatchEvent['type']) => {
    return eventTypes.find(et => et.id === type)?.icon || '📝'
  }

  const getEventColor = (type: MatchEvent['type']) => {
    return eventTypes.find(et => et.id === type)?.color || 'text-gray-400'
  }

  const handleAddEvent = () => {
    if (!newEvent.playerId || !newEvent.description) return

    const player = match.attendance?.find(a => a.playerId === newEvent.playerId)?.player
    if (!player) return

    const event: MatchEvent = {
      id: Date.now().toString(),
      type: newEvent.type,
      player,
      minute: newEvent.minute,
      description: newEvent.description,
      team: newEvent.team
    }

    const updatedEvents = [...(match.events || []), event]
    onUpdateEvents(updatedEvents)
    
    // Reset form
    setNewEvent({
      type: 'goal',
      playerId: '',
      minute: 1,
      description: '',
      team: 'home'
    })
    setShowAddEventModal(false)
  }

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = match.events?.filter(event => event.id !== eventId) || []
    onUpdateEvents(updatedEvents)
  }

  const sortedEvents = match.events?.sort((a, b) => a.minute - b.minute) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">Eventos del Partido</h4>
        <button
          onClick={() => setShowAddEventModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          + Agregar Evento
        </button>
      </div>

      {/* Estadísticas de Eventos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{match.events?.length || 0}</div>
          <div className="text-gray-400 text-sm">Total de Eventos</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {match.events?.filter(e => e.type === 'goal').length || 0}
          </div>
          <div className="text-gray-400 text-sm">Goles</div>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-3">
        <h5 className="text-md font-semibold text-white">Cronología de Eventos</h5>
        {sortedEvents.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sortedEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`text-lg ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </span>
                  <div>
                    <div className="text-white text-sm font-medium">{event.player.name}</div>
                    <div className="text-gray-400 text-xs">{event.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-white font-medium">{event.minute}'</div>
                    <div className="text-gray-400 text-xs">
                      {event.team === 'home' ? 'Local' : 'Visitante'}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
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
            <div className="text-lg mb-2">No hay eventos registrados</div>
            <div className="text-sm">Los eventos aparecerán aquí durante el partido</div>
          </div>
        )}
      </div>

      {/* Modal de Agregar Evento */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Agregar Evento</h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Tipo de Evento */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Tipo de Evento</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as MatchEvent['type'] })}
                  className="w-full bg-white/10 text-white rounded px-3 py-2 border border-white/20"
                >
                  {eventTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jugador */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Jugador</label>
                <select
                  value={newEvent.playerId}
                  onChange={(e) => setNewEvent({ ...newEvent, playerId: e.target.value })}
                  className="w-full bg-white/10 text-white rounded px-3 py-2 border border-white/20"
                >
                  <option value="">Seleccionar jugador</option>
                  {match.attendance?.map(attendance => (
                    <option key={attendance.playerId} value={attendance.playerId}>
                      {attendance.player.name} ({attendance.player.position_zone?.name_es || 'Sin posición'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Minuto */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Minuto</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={newEvent.minute}
                  onChange={(e) => setNewEvent({ ...newEvent, minute: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/10 text-white rounded px-3 py-2 border border-white/20"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Descripción</label>
                <input
                  type="text"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Descripción del evento..."
                  className="w-full bg-white/10 text-white rounded px-3 py-2 border border-white/20"
                />
              </div>

              {/* Equipo */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Equipo</label>
                <select
                  value={newEvent.team}
                  onChange={(e) => setNewEvent({ ...newEvent, team: e.target.value as 'home' | 'away' })}
                  className="w-full bg-white/10 text-white rounded px-3 py-2 border border-white/20"
                >
                  <option value="home">Local</option>
                  <option value="away">Visitante</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6 pt-4 border-t border-white/20">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.playerId || !newEvent.description}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Agregar Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 