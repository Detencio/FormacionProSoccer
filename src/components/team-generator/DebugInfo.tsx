'use client'

import { Player } from '@/types'

interface DebugInfoProps {
  availablePlayers: Player[]
  manualPlayers: Player[]
  selectedPlayers: Player[]
  teams: any[]
  selectedTeamId: number | null
  user: any
}

export default function DebugInfo({ 
  availablePlayers, 
  manualPlayers, 
  selectedPlayers, 
  teams, 
  selectedTeamId, 
  user 
}: DebugInfoProps) {
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Debug Info</h3>
      <div className="space-y-1">
        <div>👤 Usuario: {user?.role || 'No autenticado'}</div>
        <div>🏆 Equipos: {teams.length}</div>
        <div>🎯 Equipo seleccionado: {selectedTeamId || 'Ninguno'}</div>
        <div>👥 Jugadores disponibles: {availablePlayers.length}</div>
        <div>🎉 Jugadores manuales: {manualPlayers.length}</div>
        <div>✅ Jugadores seleccionados: {selectedPlayers.length}</div>
        <div>📊 Total: {availablePlayers.length + manualPlayers.length}</div>
      </div>
    </div>
  )
} 