'use client'

import React, { useState } from 'react'
import { Match, PlayerAttendance } from '@/types'
import { format, isToday, isTomorrow, isYesterday, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import EmailReminders from './EmailReminders'
import AdvancedCharts from './AdvancedCharts'

interface MatchSidebarProps {
  selectedMatch: Match | null
  onClose: () => void
  onUpdateMatch: (match: Match) => void
}

export default function MatchSidebar({ selectedMatch, onClose, onUpdateMatch }: MatchSidebarProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'attendance' | 'events' | 'stats' | 'charts' | 'email'>('details')
  const [isEditing, setIsEditing] = useState(false)
  const [showEmailReminders, setShowEmailReminders] = useState(false)

  if (!selectedMatch) return null

  const formatDate = (date: Date) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) {
        return 'Fecha inválida'
      }
      return format(dateObj, 'EEEE d MMMM, yyyy, HH:mm', { locale: es })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  const getStatusText = (status: Match['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Programado'
      case 'in_progress':
        return 'En Progreso'
      case 'finished':
        return 'Finalizado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Desconocido'
    }
  }

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30'
      case 'in_progress':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
      case 'finished':
        return 'bg-green-600/20 text-green-400 border-green-500/30'
      case 'cancelled':
        return 'bg-red-600/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeText = (type: Match['type']) => {
    switch (type) {
      case 'internal_friendly':
        return 'Amistoso Interno'
      case 'external_friendly':
        return 'Amistoso Externo'
      case 'championship':
        return 'Campeonato'
      default:
        return 'Desconocido'
    }
  }

  const getTypeColor = (type: Match['type']) => {
    switch (type) {
      case 'internal_friendly':
        return 'bg-blue-600/20 text-blue-400'
      case 'external_friendly':
        return 'bg-green-600/20 text-green-400'
      case 'championship':
        return 'bg-yellow-600/20 text-yellow-400'
      default:
        return 'bg-gray-600/20 text-gray-400'
    }
  }

  const getDateInfo = (date: Date) => {
    try {
      const matchDate = date instanceof Date ? date : new Date(date)
      if (isNaN(matchDate.getTime())) {
        return { text: 'Fecha inválida', color: 'text-gray-400', bg: 'bg-gray-600/20' }
      }
      
      const today = new Date()
      const daysDiff = differenceInDays(matchDate, today)

      if (isToday(matchDate)) {
        return { text: 'Hoy', color: 'text-green-400', bg: 'bg-green-600/20' }
      } else if (isTomorrow(matchDate)) {
        return { text: 'Mañana', color: 'text-yellow-400', bg: 'bg-yellow-600/20' }
      } else if (isYesterday(matchDate)) {
        return { text: 'Ayer', color: 'text-gray-400', bg: 'bg-gray-600/20' }
      } else if (daysDiff > 0) {
        return { text: `En ${daysDiff} días`, color: 'text-blue-400', bg: 'bg-blue-600/20' }
      } else {
        return { text: `${Math.abs(daysDiff)} días atrás`, color: 'text-red-400', bg: 'bg-red-600/20' }
      }
    } catch (error) {
      return { text: 'Fecha inválida', color: 'text-gray-400', bg: 'bg-gray-600/20' }
    }
  }

  const getAttendanceStats = () => {
    if (!selectedMatch.attendance || selectedMatch.attendance.length === 0) {
      return { confirmed: 0, pending: 0, declined: 0, total: 0 }
    }

    const confirmed = selectedMatch.attendance.filter(a => a.status === 'confirmed').length
    const pending = selectedMatch.attendance.filter(a => a.status === 'pending').length
    const declined = selectedMatch.attendance.filter(a => a.status === 'declined').length

    return { confirmed, pending, declined, total: selectedMatch.attendance.length }
  }

  const attendanceStats = getAttendanceStats()
  const dateInfo = getDateInfo(selectedMatch.date)

  const handleStatusChange = (newStatus: Match['status']) => {
    const updatedMatch = { ...selectedMatch, status: newStatus }
    onUpdateMatch(updatedMatch)
  }

  const handleEditMatch = () => {
    setIsEditing(true)
    // TODO: Implementar modal de edición
  }

  const handleManageAttendance = () => {
    setActiveTab('attendance')
  }

  const handleManageEvents = () => {
    setActiveTab('events')
  }

  const handleViewStats = () => {
    setActiveTab('stats')
  }

  const tabs = [
    { id: 'details', label: 'Detalles', icon: '📋' },
    { id: 'attendance', label: 'Asistencia', icon: '👥' },
    { id: 'events', label: 'Eventos', icon: '⚽' },
    { id: 'stats', label: 'Estadísticas', icon: '📊' },
    { id: 'charts', label: 'Gráficos', icon: '📈' },
    { id: 'email', label: 'Email', icon: '📧' }
  ]

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white/10 backdrop-blur-xl border-l border-white/20 z-50 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Detalles del Partido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{selectedMatch.title}</h3>
          
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedMatch.status)}`}>
              {getStatusText(selectedMatch.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedMatch.type)}`}>
              {getTypeText(selectedMatch.type)}
            </span>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-medium ${dateInfo.bg} ${dateInfo.color}`}>
            {dateInfo.text}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-white/20">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {activeTab === 'details' && (
          <>
            {/* Información General */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Información General</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-blue-400 text-lg">📅</span>
                  <div>
                    <div className="text-white font-medium">{formatDate(selectedMatch.date)}</div>
                    <div className="text-gray-400 text-sm">{dateInfo.text}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-green-400 text-lg">🏟️</span>
                  <div>
                    <div className="text-white font-medium">{selectedMatch.venue.name}</div>
                    <div className="text-gray-400 text-sm">{selectedMatch.venue.address}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-purple-400 text-lg">👥</span>
                  <div>
                    <div className="text-white font-medium">{attendanceStats.total} jugadores invitados</div>
                    <div className="text-gray-400 text-sm">
                      {attendanceStats.confirmed} confirmados, {attendanceStats.pending} pendientes
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-red-400 text-lg">⚽</span>
                  <div>
                    <div className="text-white font-medium">{selectedMatch.events?.length || 0} eventos</div>
                    <div className="text-gray-400 text-sm">Goles, tarjetas, sustituciones</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Acciones</h4>
                             <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={handleEditMatch}
                  className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📝</span>
                  <span className="text-sm">Editar</span>
                </button>
                <button 
                  onClick={handleManageAttendance}
                  className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>👥</span>
                  <span className="text-sm">Asistencias</span>
                </button>
                <button 
                  onClick={handleManageEvents}
                  className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>⚽</span>
                  <span className="text-sm">Eventos</span>
                </button>
                                 <button 
                   onClick={handleViewStats}
                   className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                 >
                   <span>📊</span>
                   <span className="text-sm">Estadísticas</span>
                 </button>
                 <button 
                   onClick={() => setActiveTab('charts')}
                   className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                 >
                   <span>📈</span>
                   <span className="text-sm">Gráficos</span>
                 </button>
                 <button 
                   onClick={() => setShowEmailReminders(true)}
                   className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                 >
                   <span>📧</span>
                   <span className="text-sm">Email</span>
                 </button>
              </div>
            </div>

            {/* Estado del Partido */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Estado</h4>
              <div className="space-y-3">
                {selectedMatch.status === 'scheduled' && (
                  <button 
                    onClick={() => handleStatusChange('in_progress')}
                    className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>▶️</span>
                    <span>Iniciar Partido</span>
                  </button>
                )}
                
                {selectedMatch.status === 'in_progress' && (
                  <button 
                    onClick={() => handleStatusChange('finished')}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>✅</span>
                    <span>Finalizar Partido</span>
                  </button>
                )}
                
                {selectedMatch.status !== 'finished' && selectedMatch.status !== 'cancelled' && (
                  <button 
                    onClick={() => handleStatusChange('cancelled')}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>❌</span>
                    <span>Cancelar Partido</span>
                  </button>
                )}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Información Adicional</h4>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="font-medium">Creado por:</span>
                  <span>{selectedMatch.createdBy}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="font-medium">Creado el:</span>
                  <span>{formatDate(selectedMatch.createdAt)}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="font-medium">Última actualización:</span>
                  <span>{formatDate(selectedMatch.updatedAt)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Gestión de Asistencia</h4>
            
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

            {/* Lista de Jugadores */}
            <div className="space-y-3">
              <h5 className="text-md font-semibold text-white">Jugadores Invitados</h5>
              {selectedMatch.attendance && selectedMatch.attendance.length > 0 ? (
                selectedMatch.attendance.map((attendance) => (
                  <div key={attendance.playerId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {attendance.player.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{attendance.player.name}</div>
                        <div className="text-gray-400 text-sm">{attendance.player.position_zone.name_es}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      attendance.status === 'confirmed' ? 'bg-green-600/20 text-green-400' :
                      attendance.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {attendance.status === 'confirmed' ? 'Confirmado' :
                       attendance.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-lg mb-2">No hay jugadores invitados</div>
                  <div className="text-sm">Invita jugadores al partido para gestionar su asistencia</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Eventos del Partido</h4>
            
            {selectedMatch.events && selectedMatch.events.length > 0 ? (
              <div className="space-y-3">
                {selectedMatch.events.map((event) => (
                  <div key={event.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {event.type === 'goal' ? '⚽' :
                           event.type === 'assist' ? '🎯' :
                           event.type === 'yellow_card' ? '🟨' :
                           event.type === 'red_card' ? '🟥' :
                           event.type === 'substitution' ? '🔄' :
                           event.type === 'injury' ? '🏥' : '📝'}
                        </span>
                        <div>
                          <div className="text-white font-medium">{event.player.name}</div>
                          <div className="text-gray-400 text-sm">{event.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{event.minute}'</div>
                        <div className="text-gray-400 text-xs">{event.team === 'home' ? 'Local' : 'Visitante'}</div>
                      </div>
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
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Estadísticas del Partido</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{attendanceStats.total}</div>
                <div className="text-gray-400 text-sm">Jugadores Invitados</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{selectedMatch.events?.length || 0}</div>
                <div className="text-gray-400 text-sm">Eventos Registrados</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-md font-semibold text-white mb-3">Resumen de Asistencia</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Confirmados:</span>
                  <span className="text-green-400 font-medium">{attendanceStats.confirmed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Pendientes:</span>
                  <span className="text-yellow-400 font-medium">{attendanceStats.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Rechazados:</span>
                  <span className="text-red-400 font-medium">{attendanceStats.declined}</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tasa de Confirmación:</span>
                    <span className="text-blue-400 font-medium">
                      {attendanceStats.total > 0 ? Math.round((attendanceStats.confirmed / attendanceStats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
                         </div>
           </div>
         )}

         {activeTab === 'charts' && (
           <div className="space-y-4">
             <h4 className="text-lg font-semibold text-white">📈 Gráficos Avanzados</h4>
             <div className="text-gray-300 text-sm mb-4">
               Visualización interactiva de estadísticas y tendencias del partido
             </div>
             
             <div className="bg-white/5 rounded-lg p-4 mb-4">
               <div className="flex items-center space-x-3 mb-3">
                 <span className="text-purple-400 text-lg">📊</span>
                 <div>
                   <div className="text-white font-medium">Estadísticas Visuales</div>
                   <div className="text-gray-400 text-sm">Gráficos interactivos y análisis de datos</div>
                 </div>
               </div>
               
               <div className="text-xs text-gray-400 space-y-1">
                 <div>• Gráficos de asistencia por partido</div>
                 <div>• Distribución por tipo de partido</div>
                 <div>• Tendencias de confirmación</div>
                 <div>• Rendimiento por posición</div>
               </div>
             </div>
             
             <AdvancedCharts matches={[selectedMatch]} />
           </div>
         )}

         {activeTab === 'email' && (
           <div className="space-y-4">
             <h4 className="text-lg font-semibold text-white">📧 Enviar Email</h4>
             <div className="text-gray-300 text-sm mb-4">
               Comunícate con los jugadores por email
             </div>
             
             <div className="bg-white/5 rounded-lg p-4">
               <div className="flex items-center space-x-3 mb-4">
                 <span className="text-blue-400 text-lg">📧</span>
                 <div>
                   <div className="text-white font-medium">Email a Jugadores</div>
                   <div className="text-gray-400 text-sm">Invitaciones, recordatorios y confirmaciones</div>
                 </div>
               </div>
               
               <div className="space-y-3 mb-4">
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-300">Jugadores con email:</span>
                   <span className="text-white font-semibold">
                     {selectedMatch.attendance?.filter(a => a.player?.email).length || 0}
                   </span>
                 </div>
                 
                 {selectedMatch.attendance?.filter(a => a.player?.email).length === 0 ? (
                   <div className="text-yellow-400 text-xs bg-yellow-600/10 p-2 rounded">
                     ⚠️ Sin emails registrados
                   </div>
                 ) : (
                   <div className="text-green-400 text-xs bg-green-600/10 p-2 rounded">
                     ✅ Listo para enviar
                   </div>
                 )}
               </div>
               
               <button
                 onClick={() => setShowEmailReminders(true)}
                 className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
               >
                 <span>📧</span>
                 <span>Abrir Email</span>
               </button>
             </div>
           </div>
         )}
       </div>

       {/* Modal de Email Reminders */}
       {showEmailReminders && (
         <EmailReminders
           match={selectedMatch}
           onClose={() => setShowEmailReminders(false)}
         />
       )}
     </div>
   )
 } 