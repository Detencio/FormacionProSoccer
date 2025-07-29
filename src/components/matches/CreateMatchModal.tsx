'use client'

import React, { useState } from 'react'
import { Match, Championship, ExternalTeam } from '@/types'

interface CreateMatchModalProps {
  onClose: () => void
  onSubmit: (matchData: Partial<Match>) => void
  championships: Championship[]
  externalTeams: ExternalTeam[]
}

export default function CreateMatchModal({ onClose, onSubmit, championships, externalTeams }: CreateMatchModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'internal_friendly' as Match['type'],
    date: '',
    venueId: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      date: new Date(formData.date),
      venue: formData.venueId ? { 
        id: formData.venueId, 
        name: 'Cancha Seleccionada',
        address: '',
        capacity: 0,
        surface: 'grass',
        facilities: []
      } : undefined
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Crear Nuevo Partido</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título del Partido
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Matiz FC vs Los Tigres"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Partido
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Match['type'] })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="internal_friendly">Amistoso Interno</option>
              <option value="external_friendly">Amistoso Externo</option>
              <option value="championship">Campeonato</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fecha y Hora
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cancha
            </label>
            <select
              value={formData.venueId}
              onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar cancha</option>
              <option value="1">Cancha Municipal</option>
              <option value="2">Estadio Deportivo</option>
              <option value="3">Complejo Deportivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detalles adicionales del partido..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Partido
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 