'use client'

import React, { useState } from 'react'
import { Match } from '@/types'
import { emailService, EmailTemplate } from '@/services/emailService'

interface EmailRemindersProps {
  match: Match
  onClose: () => void
}

export default function EmailReminders({ match, onClose }: EmailRemindersProps) {
  const [selectedType, setSelectedType] = useState<'invitation' | 'reminder' | 'confirmation' | 'cancellation'>('invitation')
  const [isSending, setIsSending] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [sendResults, setSendResults] = useState<{ success: number; failed: number } | null>(null)

  const emailTypes = [
    { 
      id: 'invitation', 
      label: 'Invitación', 
      icon: '🎯', 
      description: 'Primera invitación al partido',
      color: 'bg-blue-600/20 border-blue-500/30'
    },
    { 
      id: 'reminder', 
      label: 'Recordatorio', 
      icon: '⏰', 
      description: 'Aviso antes del partido',
      color: 'bg-yellow-600/20 border-yellow-500/30'
    },
    { 
      id: 'confirmation', 
      label: 'Confirmación', 
      icon: '✅', 
      description: 'Confirmar asistencia',
      color: 'bg-green-600/20 border-green-500/30'
    },
    { 
      id: 'cancellation', 
      label: 'Cancelación', 
      icon: '❌', 
      description: 'Avisar cancelación',
      color: 'bg-red-600/20 border-red-500/30'
    }
  ]

  const handlePreviewTemplate = () => {
    const template = emailService.generateReminderTemplate(match, selectedType)
    setPreviewTemplate(template)
  }

  const handleSendEmails = async () => {
    setIsSending(true)
    setSendResults(null)

    try {
      const recipients = match.attendance
        ?.filter(attendance => attendance.player?.email)
        .map(attendance => ({
          email: attendance.player!.email,
          name: attendance.player!.name,
          playerId: attendance.playerId
        })) || []

      if (recipients.length === 0) {
        alert('No hay jugadores con email registrado')
        return
      }

      const reminder = {
        matchId: match.id,
        matchTitle: match.title,
        matchDate: new Date(match.date),
        venue: `${match.venue.name} - ${match.venue.address}`,
        recipients,
        type: selectedType
      }

      const result = await emailService.sendMatchReminder(reminder)
      
      if (result) {
        setSendResults({ success: recipients.length, failed: 0 })
      } else {
        setSendResults({ success: 0, failed: recipients.length })
      }
    } catch (error) {
      console.error('Error enviando emails:', error)
      setSendResults({ success: 0, failed: 1 })
    } finally {
      setIsSending(false)
    }
  }

  const handleScheduleReminders = async () => {
    setIsSending(true)
    try {
      await emailService.scheduleReminders(match)
      alert('Recordatorios programados')
    } catch (error) {
      console.error('Error programando recordatorios:', error)
      alert('Error programando recordatorios')
    } finally {
      setIsSending(false)
    }
  }

  const recipientsCount = match.attendance?.filter(a => a.player?.email).length || 0
  const hasRecipients = recipientsCount > 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Enviar Email</h2>
            <p className="text-gray-300 mt-1">{match.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel Izquierdo */}
          <div className="space-y-6">
            {/* Paso 1: Tipo de Email */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">1. Selecciona el tipo de email</h3>
              <div className="grid grid-cols-2 gap-3">
                {emailTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as any)}
                    className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                      selectedType === type.id
                        ? `${type.color} text-white`
                        : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-semibold">{type.label}</span>
                    </div>
                    <p className="text-sm opacity-80">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 2: Destinatarios */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">2. Revisa los destinatarios</h3>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Jugadores con email:</span>
                  <span className="text-white font-semibold">{recipientsCount}</span>
                </div>
                
                {!hasRecipients ? (
                  <div className="text-center py-6 text-gray-400">
                    <div className="text-lg mb-2">⚠️ Sin emails registrados</div>
                    <div className="text-sm">Los jugadores necesitan email para recibir notificaciones</div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {match.attendance?.filter(a => a.player?.email).map((attendance) => (
                      <div key={attendance.playerId} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {attendance.player!.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{attendance.player!.name}</div>
                            <div className="text-gray-400 text-xs">{attendance.player!.position_zone.name_es}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-400 text-xs">{attendance.player!.email}</div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            attendance.status === 'confirmed' ? 'bg-green-600/20 text-green-400' :
                            attendance.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-red-600/20 text-red-400'
                          }`}>
                            {attendance.status === 'confirmed' ? 'Confirmado' :
                             attendance.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Paso 3: Acciones */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">3. Envía el email</h3>
              
              <button
                onClick={handlePreviewTemplate}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>👁️</span>
                <span>Ver Vista Previa</span>
              </button>
              
              <button
                onClick={handleSendEmails}
                disabled={isSending || !hasRecipients}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{isSending ? '⏳' : '📧'}</span>
                <span>{isSending ? 'Enviando...' : 'Enviar Ahora'}</span>
              </button>
              
              <button
                onClick={handleScheduleReminders}
                disabled={isSending}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>⏰</span>
                <span>Programar Automático</span>
              </button>
            </div>

            {/* Resultados */}
            {sendResults && (
              <div className={`p-4 rounded-lg ${
                sendResults.failed === 0 
                  ? 'bg-green-600/20 border border-green-500/30' 
                  : 'bg-red-600/20 border border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    {sendResults.failed === 0 ? '✅ Enviado' : '❌ Error'}
                  </span>
                  <span className="text-gray-300">
                    {sendResults.success} enviados, {sendResults.failed} fallidos
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Panel Derecho - Vista Previa */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Vista Previa</h3>
            
            {previewTemplate ? (
              <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                <div className="mb-4">
                  <div className="text-gray-300 text-sm mb-1">Asunto:</div>
                  <div className="text-white font-medium bg-white/10 p-2 rounded">{previewTemplate.subject}</div>
                </div>
                
                <div className="mb-4">
                  <div className="text-gray-300 text-sm mb-2">Contenido:</div>
                  <div className="bg-white/10 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                      {previewTemplate.body}
                    </div>
                  </div>
                </div>

                {previewTemplate.html && (
                  <div>
                    <div className="text-gray-300 text-sm mb-2">Versión HTML:</div>
                    <div className="bg-white/10 rounded-lg p-4 max-h-60 overflow-y-auto border border-white/20">
                      <div 
                        className="text-white text-sm"
                        dangerouslySetInnerHTML={{ __html: previewTemplate.html }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-8 text-center border border-white/20">
                <div className="text-gray-400 text-lg mb-2">📧</div>
                <div className="text-gray-400 mb-2">¿Quieres ver el email?</div>
                <div className="text-gray-500 text-sm">Haz clic en "Ver Vista Previa"</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 