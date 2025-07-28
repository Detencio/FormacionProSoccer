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

  // Obtener color de posición
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'POR': return 'bg-red-500'
      case 'DEF': return 'bg-blue-500'
      case 'MED': return 'bg-green-500'
      case 'DEL': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  // Obtener color de estadística
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-700'
    if (value >= 60) return 'text-yellow-700'
    if (value >= 40) return 'text-orange-700'
    return 'text-red-700'
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
    // Si el jugador tiene habilidades específicas en el backend, usarlas
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
    // Si no, generar basado en skill_level
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
      // Aquí iría la lógica para guardar en el backend
      console.log('💾 Guardando habilidades:', editableStats)
      setCurrentStats(editableStats)
      setIsEditing(false)
      // Aquí podrías mostrar un toast de éxito si quieres
    } catch (error) {
      console.error('❌ Error al guardar habilidades:', error)
      // Aquí podrías mostrar un toast de error si quieres
    } finally {
      setIsSaving(false)
    }
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md border-2 hover:shadow-lg transition-all duration-200 transform hover:scale-102 group">
        {/* Header compacto */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate mb-1">{player.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 ${getPositionColor(position)} rounded text-xs font-bold text-white`}>
                  {position}
                </span>
                <span className="text-gray-300 text-xs">#{player.jersey_number || 'N/A'}</span>
              </div>
            </div>

            {/* Estrella grande con número */}
            <div className="flex items-center justify-center ml-2">
              <div className="relative">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-800 font-bold text-xs">{validSkillLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body compacto con estadísticas */}
        <div className="p-3">
          {/* 6 habilidades en una fila compacta */}
          <div className="grid grid-cols-6 gap-1">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-0.5">RIT</div>
              <div className={`text-xs font-bold ${getStatColor(currentStats.rit)}`}>{currentStats.rit}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-0.5">TIR</div>
              <div className={`text-xs font-bold ${getStatColor(currentStats.tir)}`}>{currentStats.tir}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-0.5">PAS</div>
              <div className={`text-xs font-bold ${getStatColor(currentStats.pas)}`}>{currentStats.pas}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-0.5">REG</div>
              <div className={`text-xs font-bold ${getStatColor(currentStats.reg)}`}>{currentStats.reg}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-0.5">DEF</div>
              <div className={`text-xs font-bold ${getStatColor(currentStats.defense)}`}>{currentStats.defense}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-0.5">FIS</div>
              <div className={`text-xs font-bold ${getStatColor(currentStats.fis)}`}>{currentStats.fis}</div>
            </div>
          </div>

          {/* Actions - Solo iconos en hover */}
          <div className="flex justify-center mt-3 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit?.(player)}
                className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="Editar jugador"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete?.(player.id)}
                className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
      {/* Header compacto */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-lg truncate mb-2">{player.name}</h2>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 ${getPositionColor(position)} rounded text-sm font-bold text-white`}>
                {position}
              </span>
              <span className="text-gray-300 text-sm">#{player.jersey_number || 'N/A'}</span>
            </div>
          </div>

          {/* Estrella grande con número */}
          <div className="flex items-center justify-center ml-3">
            <div className="relative">
              <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-800 font-bold text-sm">{validSkillLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body compacto con estadísticas */}
      <div className="p-4">
        <h3 className="text-gray-800 font-semibold text-lg mb-4">Estadísticas</h3>
        
        {/* 6 habilidades en una fila compacta */}
        <div className="grid grid-cols-6 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">RIT</div>
            <div className={`text-sm font-bold ${getStatColor(currentStats.rit)}`}>{currentStats.rit}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">TIR</div>
            <div className={`text-sm font-bold ${getStatColor(currentStats.tir)}`}>{currentStats.tir}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">PAS</div>
            <div className={`text-sm font-bold ${getStatColor(currentStats.pas)}`}>{currentStats.pas}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">REG</div>
            <div className={`text-sm font-bold ${getStatColor(currentStats.reg)}`}>{currentStats.reg}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">DEF</div>
            <div className={`text-sm font-bold ${getStatColor(currentStats.defense)}`}>{currentStats.defense}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">FIS</div>
            <div className={`text-sm font-bold ${getStatColor(currentStats.fis)}`}>{currentStats.fis}</div>
          </div>
        </div>

        {/* Actions - Solo iconos en hover */}
        <div className="flex justify-center mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit?.(player)}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              title="Editar jugador"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete?.(player.id)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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