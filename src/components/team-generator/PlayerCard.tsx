'use client'

import React from 'react'
import { Player } from '@/types'

interface PlayerCardProps {
  player: Player
  isSelected: boolean
  onSelect: (player: Player) => void
  onDeselect: (playerId: number) => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isSelected,
  onSelect,
  onDeselect
}) => {
  const handleClick = () => {
    if (isSelected) {
      onDeselect(player.id)
    } else {
      onSelect(player)
    }
  }

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 truncate">
          {player.name}
        </h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isSelected 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}>
          {isSelected ? 'Seleccionado' : 'Disponible'}
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center">
          <span className="font-medium">Posición:</span>
          <span className="ml-2">
            {player.position_specific?.abbreviation || player.position_zone.abbreviation}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium">Nivel:</span>
          <span className="ml-2">{player.skill_level}/5</span>
        </div>

        {player.email && (
          <div className="flex items-center">
            <span className="font-medium">Email:</span>
            <span className="ml-2 truncate">{player.email}</span>
          </div>
        )}

        {player.phone && (
          <div className="flex items-center">
            <span className="font-medium">Teléfono:</span>
            <span className="ml-2">{player.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: {player.id}</span>
          <span>Registrado: {new Date(player.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard 