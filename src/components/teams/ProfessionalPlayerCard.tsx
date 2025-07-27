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

  // Generar estrellas para nivel de habilidad
  const getSkillStars = (skill: number) => {
    const validSkill = Math.max(1, Math.min(5, skill || 1))
    return '★'.repeat(validSkill) + '☆'.repeat(5 - validSkill)
  }

  // Obtener color de posición
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'POR': return 'bg-red-500'
      case 'DEF': return 'bg-blue-500'
      case 'MED': return 'bg-green-500'
      case 'DEL': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  // Obtener color de estadística
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-500'
    if (value >= 60) return 'text-yellow-500'
    if (value >= 40) return 'text-orange-500'
    return 'text-red-500'
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
  const [isEditing, setIsEditing] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [currentStats, setCurrentStats] = React.useState(stats)

  React.useEffect(() => {
    // Animar las barras después de un pequeño delay
    const timer = setTimeout(() => {
      setBarsAnimated(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  // Función para actualizar una habilidad específica
  const updateSkill = (skill: keyof typeof stats, value: number) => {
    setEditableStats(prev => ({
      ...prev,
      [skill]: Math.max(1, Math.min(100, value))
    }))
  }

  // Función para guardar cambios
  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Crear objeto con las habilidades actualizadas
      const updatedPlayer = {
        ...player,
        rit: editableStats.rit,
        tir: editableStats.tir,
        pas: editableStats.pas,
        reg: editableStats.reg,
        defense: editableStats.defense,
        fis: editableStats.fis
      }

      // Guardar directamente a la base de datos
      await teamService.updatePlayer(player.id, updatedPlayer)
      
      // Actualizar el estado local sin abrir el formulario
      // Solo actualizamos las estadísticas en la tarjeta
      setCurrentStats(editableStats)
      
      setIsEditing(false)
      
      // Mostrar mensaje de éxito (opcional)
      console.log('✅ Habilidades guardadas exitosamente')
      
    } catch (error) {
      console.error('❌ Error al guardar habilidades:', error)
      // Aquí podrías mostrar un toast de error si quieres
    } finally {
      setIsSaving(false)
    }
  }

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">{player.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 ${getPositionColor(position)} rounded-full text-xs font-bold text-white`}>
                    {position}
                  </span>
                  <span className="text-gray-300 text-xs">#{player.jersey_number || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 text-sm font-mono">
                {getSkillStars(validSkillLevel)}
              </div>
              <div className="text-gray-300 text-xs">
                Nivel {validSkillLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">RIT</div>
              <div className={`text-lg font-bold ${getStatColor(currentStats.rit)}`}>{currentStats.rit}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">TIR</div>
              <div className={`text-lg font-bold ${getStatColor(currentStats.tir)}`}>{currentStats.tir}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">PAS</div>
              <div className={`text-lg font-bold ${getStatColor(currentStats.pas)}`}>{currentStats.pas}</div>
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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">
                {player.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div>
              <h2 className="text-white font-bold text-xl">{player.name}</h2>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`px-3 py-1 ${getPositionColor(position)} rounded-full text-sm font-bold text-white`}>
                  {position}
                </span>
                <span className="text-gray-300 text-sm">#{player.jersey_number || 'N/A'}</span>
                {player.nationality && (
                  <span className="text-gray-300 text-sm">🇨🇱 {player.nationality}</span>
                )}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="text-right">
            <div className="text-yellow-400 text-xl font-mono mb-1">
              {getSkillStars(validSkillLevel)}
            </div>
            <div className="text-gray-300 text-sm">
              Nivel {validSkillLevel}/5
            </div>
            {age && (
              <div className="text-gray-300 text-sm mt-1">
                {age} años
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-bold text-lg">Estadísticas</h3>
          
          {/* Botones de acción que aparecen solo en hover */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  title="Editar habilidades"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit?.(player)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  title="Editar jugador completo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaving 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                  title={isSaving ? "Guardando..." : "Guardar cambios"}
                >
                  {isSaving ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditableStats(currentStats)
                    setIsEditing(false)
                  }}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  title="Cancelar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Estadísticas detalladas */}
        <div className="space-y-4">
          {/* Ritmo */}
          <div className="flex justify-between items-center group hover:bg-blue-50 rounded-lg p-2 transition-all duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm group-hover:text-blue-700 transition-colors">Ritmo</span>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={editableStats.rit}
                    onChange={(e) => updateSkill('rit', parseInt(e.target.value))}
                    className="w-32 h-3 bg-gray-100 rounded-full appearance-none cursor-pointer slider-blue"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${editableStats.rit}%, #e5e7eb ${editableStats.rit}%, #e5e7eb 100%)`
                    }}
                  />
                  <span className={`text-sm font-bold ${getStatColor(editableStats.rit)} min-w-[2.5rem] text-right`}>
                    {editableStats.rit}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                    <div 
                                        className={`h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out shadow-lg group-hover:shadow-xl`}
                                          style={{ 
                      width: barsAnimated ? `${currentStats.rit}%` : '0%',
                      transition: 'width 0.3s ease-out 0.1s'
                    }}
                    >

                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getStatColor(currentStats.rit)} min-w-[2.5rem] text-right group-hover:scale-110 transition-transform`}>
                    {currentStats.rit}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Tiro */}
          <div className="flex justify-between items-center group hover:bg-green-50 rounded-lg p-2 transition-all duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm group-hover:text-green-700 transition-colors">Tiro</span>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={editableStats.tir}
                    onChange={(e) => updateSkill('tir', parseInt(e.target.value))}
                    className="w-32 h-3 bg-gray-100 rounded-full appearance-none cursor-pointer slider-green"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${editableStats.tir}%, #e5e7eb ${editableStats.tir}%, #e5e7eb 100%)`
                    }}
                  />
                  <span className={`text-sm font-bold ${getStatColor(editableStats.tir)} min-w-[2.5rem] text-right`}>
                    {editableStats.tir}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                    <div 
                                        className={`h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-500 ease-out shadow-lg group-hover:shadow-xl`}
                                          style={{ 
                      width: barsAnimated ? `${currentStats.tir}%` : '0%',
                      transition: 'width 0.3s ease-out 0.2s'
                    }}
                    >

                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getStatColor(currentStats.tir)} min-w-[2.5rem] text-right group-hover:scale-110 transition-transform`}>
                    {currentStats.tir}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Pase */}
          <div className="flex justify-between items-center group hover:bg-purple-50 rounded-lg p-2 transition-all duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm group-hover:text-purple-700 transition-colors">Pase</span>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={editableStats.pas}
                    onChange={(e) => updateSkill('pas', parseInt(e.target.value))}
                    className="w-32 h-3 bg-gray-100 rounded-full appearance-none cursor-pointer slider-purple"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${editableStats.pas}%, #e5e7eb ${editableStats.pas}%, #e5e7eb 100%)`
                    }}
                  />
                  <span className={`text-sm font-bold ${getStatColor(editableStats.pas)} min-w-[2.5rem] text-right`}>
                    {editableStats.pas}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                    <div 
                                        className={`h-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-lg group-hover:shadow-xl`}
                                          style={{ 
                      width: barsAnimated ? `${currentStats.pas}%` : '0%',
                      transition: 'width 0.3s ease-out 0.3s'
                    }}
                    >

                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getStatColor(currentStats.pas)} min-w-[2.5rem] text-right group-hover:scale-110 transition-transform`}>
                    {currentStats.pas}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Regate */}
          <div className="flex justify-between items-center group hover:bg-yellow-50 rounded-lg p-2 transition-all duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm group-hover:text-yellow-700 transition-colors">Regate</span>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={editableStats.reg}
                    onChange={(e) => updateSkill('reg', parseInt(e.target.value))}
                    className="w-32 h-3 bg-gray-100 rounded-full appearance-none cursor-pointer slider-yellow"
                    style={{
                      background: `linear-gradient(to right, #eab308 0%, #eab308 ${editableStats.reg}%, #e5e7eb ${editableStats.reg}%, #e5e7eb 100%)`
                    }}
                  />
                  <span className={`text-sm font-bold ${getStatColor(editableStats.reg)} min-w-[2.5rem] text-right`}>
                    {editableStats.reg}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                    <div 
                                        className={`h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full transition-all duration-500 ease-out shadow-lg group-hover:shadow-xl`}
                                          style={{ 
                      width: barsAnimated ? `${currentStats.reg}%` : '0%',
                      transition: 'width 0.3s ease-out 0.4s'
                    }}
                    >

                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getStatColor(currentStats.reg)} min-w-[2.5rem] text-right group-hover:scale-110 transition-transform`}>
                    {currentStats.reg}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Defensa */}
          <div className="flex justify-between items-center group hover:bg-red-50 rounded-lg p-2 transition-all duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm group-hover:text-red-700 transition-colors">Defensa</span>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={editableStats.defense}
                    onChange={(e) => updateSkill('defense', parseInt(e.target.value))}
                    className="w-32 h-3 bg-gray-100 rounded-full appearance-none cursor-pointer slider-red"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${editableStats.defense}%, #e5e7eb ${editableStats.defense}%, #e5e7eb 100%)`
                    }}
                  />
                  <span className={`text-sm font-bold ${getStatColor(editableStats.defense)} min-w-[2.5rem] text-right`}>
                    {editableStats.defense}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                    <div 
                                        className={`h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-full transition-all duration-500 ease-out shadow-lg group-hover:shadow-xl`}
                                          style={{ 
                      width: barsAnimated ? `${currentStats.defense}%` : '0%',
                      transition: 'width 0.3s ease-out 0.5s'
                    }}
                    >

                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getStatColor(currentStats.defense)} min-w-[2.5rem] text-right group-hover:scale-110 transition-transform`}>
                    {currentStats.defense}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Físico */}
          <div className="flex justify-between items-center group hover:bg-orange-50 rounded-lg p-2 transition-all duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm group-hover:text-orange-700 transition-colors">Físico</span>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={editableStats.fis}
                    onChange={(e) => updateSkill('fis', parseInt(e.target.value))}
                    className="w-32 h-3 bg-gray-100 rounded-full appearance-none cursor-pointer slider-orange"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${editableStats.fis}%, #e5e7eb ${editableStats.fis}%, #e5e7eb 100%)`
                    }}
                  />
                  <span className={`text-sm font-bold ${getStatColor(editableStats.fis)} min-w-[2.5rem] text-right`}>
                    {editableStats.fis}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                    <div 
                                        className={`h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out shadow-lg group-hover:shadow-xl`}
                                          style={{ 
                      width: barsAnimated ? `${currentStats.fis}%` : '0%',
                      transition: 'width 0.3s ease-out 0.6s'
                    }}
                    >

                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getStatColor(currentStats.fis)} min-w-[2.5rem] text-right group-hover:scale-110 transition-transform`}>
                    {currentStats.fis}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {player.height && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Altura:</span>
                <span className="font-medium">{player.height}cm</span>
              </div>
            )}
            {player.weight && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Peso:</span>
                <span className="font-medium">{player.weight}kg</span>
              </div>
            )}
            {player.team?.name && (
              <div className="col-span-2 flex items-center space-x-2">
                <span className="text-gray-500">Equipo:</span>
                <span className="font-medium">{player.team.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessionalPlayerCard

// Estilos CSS para los sliders
const sliderStyles = `
  .slider-blue::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-blue::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-green::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-green::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-purple::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #8b5cf6;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-purple::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #8b5cf6;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-yellow::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #eab308;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-yellow::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #eab308;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-red::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #ef4444;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-red::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #ef4444;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-orange::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #f97316;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-orange::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #f97316;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`

// Agregar estilos al head si no existen
if (typeof document !== 'undefined') {
  const styleId = 'player-card-slider-styles'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = sliderStyles
    document.head.appendChild(style)
  }
} 