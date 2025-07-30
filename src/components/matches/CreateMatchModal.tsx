'use client'

import React, { useState, useEffect } from 'react'
import { Match, Championship, ExternalTeam, Venue } from '@/types'
import { format, addDays } from 'date-fns'

interface CreateMatchModalProps {
  onClose: () => void
  onSubmit: (matchData: Partial<Match>) => void
  championships: Championship[]
  externalTeams: ExternalTeam[]
}

interface FormData {
  title: string
  type: Match['type']
  date: string
  time: string
  venueId: string
  description: string
  championshipId?: string
  externalTeamId?: string
  homeTeamId?: string
  awayTeamId?: string
  maxPlayers: number
  duration: number
  requireAttendance: boolean
  autoGenerateTeams: boolean
}

export default function CreateMatchModal({ onClose, onSubmit, championships, externalTeams }: CreateMatchModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: 'internal_friendly',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '18:00',
    venueId: '',
    description: '',
    maxPlayers: 22,
    duration: 90,
    requireAttendance: true,
    autoGenerateTeams: true
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Venues disponibles
  const venues: Venue[] = [
    {
      id: '1',
      name: 'Cancha Municipal',
      address: 'Av. Principal 123',
      capacity: 200,
      surface: 'grass',
      facilities: ['Vestuarios', 'Estacionamiento']
    },
    {
      id: '2',
      name: 'Estadio Deportivo',
      address: 'Calle Deportiva 456',
      capacity: 500,
      surface: 'artificial',
      facilities: ['Vestuarios', 'Estacionamiento', 'Cafetería']
    },
    {
      id: '3',
      name: 'Complejo Deportivo',
      address: 'Boulevard Deportivo 789',
      capacity: 1000,
      surface: 'grass',
      facilities: ['Vestuarios', 'Estacionamiento', 'Cafetería', 'Gimnasio']
    }
  ]

  // Validación
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida'
    }

    if (!formData.time) {
      newErrors.time = 'La hora es requerida'
    }

    if (!formData.venueId) {
      newErrors.venueId = 'La cancha es requerida'
    }

    if (formData.type === 'championship' && !formData.championshipId) {
      newErrors.championshipId = 'El campeonato es requerido'
    }

    if (formData.type === 'external_friendly' && !formData.externalTeamId) {
      newErrors.externalTeamId = 'El equipo externo es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const selectedVenue = venues.find(v => v.id === formData.venueId)
      const dateTime = new Date(`${formData.date}T${formData.time}`)

      const matchData: Partial<Match> = {
        title: formData.title,
        type: formData.type,
        date: dateTime,
        venue: selectedVenue,
        status: 'scheduled',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Agregar datos específicos según el tipo
      if (formData.description) {
        // Agregar descripción como metadata
      }

      await onSubmit(matchData)
    } catch (error) {
      console.error('Error creando partido:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTypeChange = (type: Match['type']) => {
    setFormData(prev => ({
      ...prev,
      type,
      championshipId: undefined,
      externalTeamId: undefined
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Crear Nuevo Partido</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del Partido *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Ej: Matiz FC vs Los Tigres"
                required
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Partido *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value as Match['type'])}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="internal_friendly">Amistoso Interno</option>
                <option value="external_friendly">Amistoso Externo</option>
                <option value="championship">Campeonato</option>
              </select>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-white/20'
                }`}
                required
              />
              {errors.date && (
                <p className="text-red-400 text-xs mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hora *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.time ? 'border-red-500' : 'border-white/20'
                }`}
                required
              />
              {errors.time && (
                <p className="text-red-400 text-xs mt-1">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Cancha */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cancha *
            </label>
            <select
              value={formData.venueId}
              onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
              className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.venueId ? 'border-red-500' : 'border-white/20'
              }`}
            >
              <option value="">Seleccionar cancha</option>
              {venues.map(venue => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} - {venue.address}
                </option>
              ))}
            </select>
            {errors.venueId && (
              <p className="text-red-400 text-xs mt-1">{errors.venueId}</p>
            )}
          </div>

          {/* Campos específicos según tipo */}
          {formData.type === 'championship' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Campeonato *
              </label>
              <select
                value={formData.championshipId}
                onChange={(e) => setFormData({ ...formData, championshipId: e.target.value })}
                className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.championshipId ? 'border-red-500' : 'border-white/20'
                }`}
              >
                <option value="">Seleccionar campeonato</option>
                {championships.map(championship => (
                  <option key={championship.id} value={championship.id}>
                    {championship.name} - {championship.season}
                  </option>
                ))}
              </select>
              {errors.championshipId && (
                <p className="text-red-400 text-xs mt-1">{errors.championshipId}</p>
              )}
            </div>
          )}

          {formData.type === 'external_friendly' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Equipo Externo *
              </label>
              <select
                value={formData.externalTeamId}
                onChange={(e) => setFormData({ ...formData, externalTeamId: e.target.value })}
                className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.externalTeamId ? 'border-red-500' : 'border-white/20'
                }`}
              >
                <option value="">Seleccionar equipo</option>
                {externalTeams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.level})
                  </option>
                ))}
              </select>
              {errors.externalTeamId && (
                <p className="text-red-400 text-xs mt-1">{errors.externalTeamId}</p>
              )}
            </div>
          )}

          {/* Configuración Avanzada */}
          <div className="border-t border-white/20 pt-4">
            <h4 className="text-lg font-semibold text-white mb-4">Configuración Avanzada</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Máximo de Jugadores
                </label>
                <input
                  type="number"
                  value={formData.maxPlayers}
                  onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="10"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="30"
                  max="120"
                  step="15"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.requireAttendance}
                  onChange={(e) => setFormData({ ...formData, requireAttendance: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">Requerir confirmación de asistencia</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.autoGenerateTeams}
                  onChange={(e) => setFormData({ ...formData, autoGenerateTeams: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">Generar equipos automáticamente</span>
              </label>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detalles adicionales del partido, instrucciones especiales, etc..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Partido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 