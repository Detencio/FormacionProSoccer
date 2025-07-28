'use client'

import React from 'react'
import { Player } from '@/services/teamService'
import { teamService } from '@/services/teamService'

interface ProfessionalPlayerCardProps {
  player: Player
  onEdit?: (player: Player) => void
  onDelete?: (playerId: number) => void
  onView?: (player: Player) => void
  compact?: boolean
}

const ProfessionalPlayerCard: React.FC<ProfessionalPlayerCardProps> = ({
  player,
  onEdit,
  onDelete,
  onView,
  compact = false
}) => {
  // Calcular edad desde fecha de nacimiento
  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Obtener color de posición (estilo FIFA)
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'POR': return 'from-red-500 to-red-600'
      case 'DEF': return 'from-blue-500 to-blue-600'
      case 'MED': return 'from-green-500 to-green-600'
      case 'DEL': return 'from-orange-500 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  // Obtener color de estadística (estilo FIFA)
  const getStatColor = (value: number) => {
    if (value >= 85) return 'text-green-400'
    if (value >= 75) return 'text-yellow-400'
    if (value >= 65) return 'text-orange-400'
    return 'text-red-400'
  }

  // Obtener color de fondo según posición
  const getCardGradient = (position: string) => {
    switch (position) {
      case 'POR': return 'from-red-900/20 to-red-800/20'
      case 'DEF': return 'from-blue-900/20 to-blue-800/20'
      case 'MED': return 'from-green-900/20 to-green-800/20'
      case 'DEL': return 'from-orange-900/20 to-orange-800/20'
      default: return 'from-gray-900/20 to-gray-800/20'
    }
  }

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
  const getPlayerStats = () => {
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
  }

  const stats = getPlayerStats()
  const age = calculateAge(player.date_of_birth)
  const position = player.position_specific?.abbreviation || player.position_zone?.abbreviation || 'N/A'
  const validSkillLevel = Math.max(1, Math.min(5, player.skill_level || 1))

  // Estado para animación de las barras
  const [barsAnimated, setBarsAnimated] = React.useState(false)
  
  // Estado para habilidades editables
  const [editableStats, setEditableStats] = React.useState(stats)
  const [currentStats, setCurrentStats] = React.useState(stats)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  // Animar barras cuando el componente se monta
  React.useEffect(() => {
    const timer = setTimeout(() => setBarsAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Actualizar estadísticas cuando cambian
  React.useEffect(() => {
    setCurrentStats(stats)
    setEditableStats(stats)
  }, [stats])

  const updateSkill = (skill: keyof typeof stats, value: number) => {
    setEditableStats(prev => ({
      ...prev,
      [skill]: value
    }))
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      console.log('💾 Guardando habilidades:', editableStats)
      setCurrentStats(editableStats)
      setIsEditing(false)
    } catch (error) {
      console.error('❌ Error al guardar habilidades:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (compact) {
    return (
      <div className="relative w-64 h-80 group">
        {/* Fondo con gradiente FIFA */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(position)} rounded-2xl backdrop-blur-sm border border-white/10`}></div>
        
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 rounded-2xl"></div>
        
        {/* Contenido de la tarjeta */}
        <div className="relative h-full p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm truncate">{player.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getPositionColor(position)} rounded-full text-xs font-bold text-white shadow-lg`}>
                  {position}
                </span>
                <span className="text-white/70 text-xs">#{player.jersey_number || 'N/A'}</span>
              </div>
            </div>
            
            {/* Estrella FIFA */}
            <div className="relative">
              <svg className="w-8 h-8 text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-800 font-bold text-xs">{validSkillLevel}</span>
              </div>
            </div>
          </div>

          {/* Estadísticas FIFA */}
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">RIT</div>
              <div className={`text-lg font-bold ${getStatColor(currentStats.rit)} drop-shadow-sm`}>{currentStats.rit}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">TIR</div>
              <div className={`text-lg font-bold ${getStatColor(currentStats.tir)} drop-shadow-sm`}>{currentStats.tir}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">PAS</div>
              <div className={`text-lg font-bold ${getStatColor(currentStats.pas)} drop-shadow-sm`}>{currentStats.pas}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">REG</div>
              <div className={`text-lg font-bold ${getStatColor(currentStats.reg)} drop-shadow-sm`}>{currentStats.reg}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">DEF</div>
              <div className={`text-lg font-bold ${getStatColor(currentStats.defense)} drop-shadow-sm`}>{currentStats.defense}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">FIS</div>
              <div className={`text-lg font-bold ${getStatColor(currentStats.fis)} drop-shadow-sm`}>{currentStats.fis}</div>
            </div>
          </div>

          {/* Acciones en hover */}
          <div className="flex justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit?.(player)}
                className="p-1.5 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-lg"
                title="Editar jugador"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete?.(player.id)}
                className="p-1.5 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg"
                title="Eliminar jugador"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      {/* Fondo con gradiente FIFA */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(position)} rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl`}></div>
      
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/20 rounded-3xl"></div>
      
      {/* Contenido de la tarjeta */}
      <div className="relative h-full p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-white font-bold text-xl mb-2">{player.name}</h2>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 bg-gradient-to-r ${getPositionColor(position)} rounded-full text-sm font-bold text-white shadow-lg`}>
                {position}
              </span>
              <span className="text-white/70 text-sm">#{player.jersey_number || 'N/A'}</span>
            </div>
          </div>
          
          {/* Estrella FIFA grande */}
          <div className="relative">
            <svg className="w-12 h-12 text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-800 font-bold text-sm">{validSkillLevel}</span>
            </div>
          </div>
        </div>

        {/* Estadísticas FIFA */}
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-4">Estadísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">RITMO</div>
              <div className={`text-2xl font-bold ${getStatColor(currentStats.rit)} drop-shadow-sm`}>{currentStats.rit}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">TIRO</div>
              <div className={`text-2xl font-bold ${getStatColor(currentStats.tir)} drop-shadow-sm`}>{currentStats.tir}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">PASE</div>
              <div className={`text-2xl font-bold ${getStatColor(currentStats.pas)} drop-shadow-sm`}>{currentStats.pas}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">REGATE</div>
              <div className={`text-2xl font-bold ${getStatColor(currentStats.reg)} drop-shadow-sm`}>{currentStats.reg}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">DEFENSA</div>
              <div className={`text-2xl font-bold ${getStatColor(currentStats.defense)} drop-shadow-sm`}>{currentStats.defense}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">FÍSICO</div>
              <div className={`text-2xl font-bold ${getStatColor(currentStats.fis)} drop-shadow-sm`}>{currentStats.fis}</div>
            </div>
          </div>
        </div>

        {/* Acciones en hover */}
        <div className="flex justify-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-3">
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