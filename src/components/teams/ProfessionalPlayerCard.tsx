'use client'

import React from 'react'
import { Player } from '@/services/teamService'

interface ProfessionalPlayerCardProps {
  player: Player
  onEdit?: (player: Player) => void
  onDelete?: (playerId: number) => void
  compact?: boolean
}

const ProfessionalPlayerCard: React.FC<ProfessionalPlayerCardProps> = ({
  player,
  onEdit,
  onDelete,
  compact = false
}) => {
  // Generar estadísticas aleatorias basadas en skill_level
  const generateStats = (skillLevel: number) => {
    const validSkillLevel = Math.max(1, Math.min(5, skillLevel || 1))
    const baseValue = validSkillLevel * 15 + Math.floor(Math.random() * 10)
    return {
      rit: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      tir: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      pas: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      reg: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      defense: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      fis: Math.min(100, baseValue + Math.floor(Math.random() * 10))
    }
  }

  // Usar estadísticas del backend o generar por defecto
  const getPlayerStats = React.useCallback(() => {
    if (player.rit !== undefined && player.tir !== undefined && player.pas !== undefined && 
        player.reg !== undefined && player.defense !== undefined && player.fis !== undefined) {
      return {
        rit: player.rit,
        tir: player.tir,
        pas: player.pas,
        reg: player.reg,
        defense: player.defense,
        fis: player.fis
      }
    }
    return generateStats(player.skill_level)
  }, [player.rit, player.tir, player.pas, player.reg, player.defense, player.fis, player.skill_level])

  const stats = getPlayerStats()
  const position = player.position_specific?.abbreviation || player.position_zone?.abbreviation || 'N/A'

  // Calcular promedio total de habilidades
  const totalRating = Math.round((stats.rit + stats.tir + stats.pas + stats.reg + stats.defense + stats.fis) / 6)

  // Estado para habilidades editables
  const [currentStats, setCurrentStats] = React.useState(stats)

  // Actualizar estadísticas cuando cambian
  React.useEffect(() => {
    const newStats = getPlayerStats()
    setCurrentStats(newStats)
  }, [getPlayerStats])

  if (compact) {
    return (
      <div className="relative w-64 h-80 group">
        {/* Plantilla PNG como fondo */}
        <img 
          src="/card-template.png" 
          alt="Plantilla de tarjeta" 
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
        />
        
        {/* Contenido superpuesto */}
        <div className="relative h-full p-4 flex flex-col">
          {/* Número total de habilidades - Estilo FIFA */}
          <div className="absolute top-12 left-8">
            <span className="text-black font-bold text-3xl">{totalRating}</span>
          </div>
          
          {/* Posición del jugador - Estilo FIFA */}
          <div className="absolute top-18 left-8">
            <span className="text-black font-bold text-sm text-center">{position}</span>
          </div>
          
          {/* Número de camiseta - POSICIÓN A AJUSTAR */}
          <div className="absolute top-12 right-4">
            <span className="text-white/80 text-xs">#{player.jersey_number || 'N/A'}</span>
          </div>
          
          {/* Nombre del jugador arriba de las estadísticas - Estilo FIFA */}
          <div className="absolute bottom-20 left-4 right-4">
            <h3 className="text-black font-bold text-lg text-center truncate tracking-wide">{player.name}</h3>
          </div>
          
          {/* Estadísticas en fila horizontal - ULTRA COMPACTAS */}
          <div className="absolute bottom-6 left-2 right-2">
            <div className="flex justify-between items-center w-full">
              <div className="text-center flex-1">
                <div className="text-black text-xs font-medium">RIT</div>
                <div className="text-black font-bold text-sm">{currentStats.rit}</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-black text-xs font-medium">TIR</div>
                <div className="text-black font-bold text-sm">{currentStats.tir}</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-black text-xs font-medium">PAS</div>
                <div className="text-black font-bold text-sm">{currentStats.pas}</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-black text-xs font-medium">REG</div>
                <div className="text-black font-bold text-sm">{currentStats.reg}</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-black text-xs font-medium">DEF</div>
                <div className="text-black font-bold text-sm">{currentStats.defense}</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-black text-xs font-medium">FIS</div>
                <div className="text-black font-bold text-sm">{currentStats.fis}</div>
              </div>
            </div>
          </div>

          {/* Acciones en hover */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit?.(player)}
                className="p-1 bg-blue-500/80 backdrop-blur-sm text-white rounded text-xs hover:bg-blue-600 transition-all duration-200"
                title="Editar jugador"
              >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete?.(player.id)}
                className="p-1 bg-red-500/80 backdrop-blur-sm text-white rounded text-xs hover:bg-red-600 transition-all duration-200"
                title="Eliminar jugador"
              >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-80 h-96 group">
      {/* Plantilla PNG como fondo */}
      <img 
        src="/card-template.png" 
        alt="Plantilla de tarjeta" 
        className="absolute inset-0 w-full h-full object-cover rounded-3xl"
      />
      
      {/* Contenido superpuesto */}
      <div className="relative h-full p-6 flex flex-col">
        {/* Número total de habilidades - Estilo FIFA */}
        <div className="absolute top-16 left-10">
          <span className="text-black font-bold text-4xl">{totalRating}</span>
        </div>
        
        {/* Posición del jugador - Estilo FIFA */}
        <div className="absolute top-24 left-10">
          <span className="text-black font-bold text-base text-center">{position}</span>
        </div>
        
        {/* Número de camiseta - POSICIÓN A AJUSTAR */}
        <div className="absolute top-16 right-6">
          <span className="text-white/80 text-sm">#{player.jersey_number || 'N/A'}</span>
        </div>
        
        {/* Nombre del jugador arriba de las estadísticas - Estilo FIFA */}
        <div className="absolute bottom-24 left-6 right-6">
          <h2 className="text-black font-bold text-2xl text-center truncate tracking-wide">{player.name}</h2>
        </div>
        
        {/* Estadísticas en fila horizontal - ULTRA COMPACTAS */}
        <div className="absolute bottom-8 left-4 right-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-center flex-1">
              <div className="text-black text-xs font-medium mb-1">RIT</div>
              <div className="text-black font-bold text-lg">{currentStats.rit}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-black text-xs font-medium mb-1">TIR</div>
              <div className="text-black font-bold text-lg">{currentStats.tir}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-black text-xs font-medium mb-1">PAS</div>
              <div className="text-black font-bold text-lg">{currentStats.pas}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-black text-xs font-medium mb-1">REG</div>
              <div className="text-black font-bold text-lg">{currentStats.reg}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-black text-xs font-medium mb-1">DEF</div>
              <div className="text-black font-bold text-lg">{currentStats.defense}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-black text-xs font-medium mb-1">FIS</div>
              <div className="text-black font-bold text-lg">{currentStats.fis}</div>
            </div>
          </div>
        </div>

        {/* Acciones en hover */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit?.(player)}
              className="p-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-lg"
              title="Editar jugador"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete?.(player.id)}
              className="p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg"
              title="Eliminar jugador"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessionalPlayerCard 