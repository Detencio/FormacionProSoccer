import React from 'react'

interface Player {
  id: number
  name: string
  skill: number
  position: string
  teamId?: number
  teamName?: string
  photo?: string
  jersey_number?: string
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
  photo_url?: string
  logo_url?: string
}

interface PlayerCardModalProps {
  player: Player | null
  onClose: () => void
}

export default function PlayerCardModal({ player, onClose }: PlayerCardModalProps) {
  if (!player) return null

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Portero': return 'bg-red-500'
      case 'Defensa': return 'bg-blue-500'
      case 'Mediocampista': return 'bg-green-500'
      case 'Delantero': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getPositionAbbr = (position: string) => {
    switch (position) {
      case 'Portero': return 'GK'
      case 'Defensa': return 'DEF'
      case 'Mediocampista': return 'MID'
      case 'Delantero': return 'ST'
      default: return position.slice(0, 3).toUpperCase()
    }
  }

  const getSkillStars = (skill: number) => {
    return '★'.repeat(skill) + '☆'.repeat(5 - skill)
  }

  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-400'
    if (value >= 60) return 'text-yellow-400'
    if (value >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Tarjeta del Jugador</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              <span className="text-white text-sm">✕</span>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Foto y información básica */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-4 border-gray-600">
              {player.photo_url ? (
                <img 
                  src={player.photo_url} 
                  alt={player.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{player.name}</h3>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 ${getPositionColor(player.position)} rounded-full`}>
                  <span className="text-white text-xs font-bold">
                    {getPositionAbbr(player.position)}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">{player.position}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-yellow-400 text-lg font-mono">
                {getSkillStars(player.skill)}
              </div>
              <div className="text-gray-400 text-sm">
                {player.skill}/5
              </div>
            </div>
          </div>

          {/* Número de camiseta */}
          {player.jersey_number && !isNaN(player.jersey_number) && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Número de Camiseta</div>
              <div className="text-white text-2xl font-bold">{player.jersey_number.toString()}</div>
            </div>
          )}

          {/* Información personal */}
          <div className="grid grid-cols-2 gap-4">
            {player.age && (
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Edad</div>
                <div className="text-white font-semibold">{player.age}</div>
              </div>
            )}
            
            {player.country && (
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">País</div>
                <div className="text-white font-semibold">{player.country}</div>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          {player.stats && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-3">Estadísticas</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Velocidad</span>
                  <span className={`font-mono ${getStatColor(player.stats.velocidad)}`}>
                    {player.stats.velocidad}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Disparo</span>
                  <span className={`font-mono ${getStatColor(player.stats.disparo)}`}>
                    {player.stats.disparo}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Pase</span>
                  <span className={`font-mono ${getStatColor(player.stats.pase)}`}>
                    {player.stats.pase}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Regate</span>
                  <span className={`font-mono ${getStatColor(player.stats.regate)}`}>
                    {player.stats.regate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Defensa</span>
                  <span className={`font-mono ${getStatColor(player.stats.defensa)}`}>
                    {player.stats.defensa}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Físico</span>
                  <span className={`font-mono ${getStatColor(player.stats.fisico)}`}>
                    {player.stats.fisico}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Información de contacto */}
          {(player.email || player.phone) && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-3">Información de Contacto</div>
              <div className="space-y-2">
                {player.email && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">📧</span>
                    <span className="text-white text-sm">{player.email}</span>
                  </div>
                )}
                {player.phone && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">📞</span>
                    <span className="text-white text-sm">{player.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
} 