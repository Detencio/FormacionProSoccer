'use client'

import { useState, useEffect } from 'react'
import { Player } from '@/types'

interface AddManualPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPlayer: (player: Player) => void
}

// Posiciones hardcodeadas como en PlayerModal
const POSITION_ZONES = [
  { id: 4, name: 'Portero', abbreviation: 'POR' },
  { id: 1, name: 'Defensa', abbreviation: 'DEF' },
  { id: 2, name: 'Centrocampista', abbreviation: 'MED' },
  { id: 3, name: 'Delantero', abbreviation: 'DEL' }
]

const POSITION_SPECIFICS = {
  1: [ // DEF
    { id: 1, name: 'Lateral Derecho', abbreviation: 'LD' },
    { id: 2, name: 'Lateral Izquierdo', abbreviation: 'LI' },
    { id: 3, name: 'Defensa Central', abbreviation: 'DFC' },
    { id: 4, name: 'Carrilero Izquierdo', abbreviation: 'CAI' },
    { id: 5, name: 'Carrilero Derecho', abbreviation: 'CAD' }
  ],
  2: [ // MED
    { id: 6, name: 'Mediocentro Defensivo', abbreviation: 'MCD' },
    { id: 7, name: 'Mediocentro', abbreviation: 'MC' },
    { id: 8, name: 'Mediocentro Ofensivo', abbreviation: 'MCO' },
    { id: 9, name: 'Volante por la Derecha', abbreviation: 'MD' },
    { id: 10, name: 'Volante por la Izquierda', abbreviation: 'MI' }
  ],
  3: [ // DEL
    { id: 11, name: 'Extremo Derecho', abbreviation: 'ED' },
    { id: 12, name: 'Extremo Izquierdo', abbreviation: 'EI' },
    { id: 13, name: 'Delantero Centro', abbreviation: 'DC' },
    { id: 14, name: 'Segundo Delantero', abbreviation: 'SD' }
  ],
  4: [] // POR - sin posiciones específicas
}

export default function AddManualPlayerModal({ isOpen, onClose, onAddPlayer }: AddManualPlayerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skill_level: 3,
    position_zone_id: 1,
    position_specific_id: undefined as number | undefined,
    jersey_number: '',
    height: '',
    weight: '',
    is_guest: true
  })

  const [availableSpecifics, setAvailableSpecifics] = useState<any[]>([])

  // Actualizar posiciones específicas cuando cambia la zona
  useEffect(() => {
    const specifics = POSITION_SPECIFICS[formData.position_zone_id as keyof typeof POSITION_SPECIFICS] || []
    setAvailableSpecifics(specifics)
    // Resetear posición específica si no está disponible en la nueva zona
    if (formData.position_specific_id && !specifics.find(s => s.id === formData.position_specific_id)) {
      setFormData(prev => ({ ...prev, position_specific_id: undefined }))
    }
  }, [formData.position_zone_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'position_zone_id' || name === 'position_specific_id' || name === 'skill_level' || name === 'jersey_number' || name === 'height' || name === 'weight'
        ? (value === '' ? undefined : parseInt(value))
        : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Creando jugador manual con datos:', formData)
    
    const selectedZone = POSITION_ZONES.find(p => p.id === formData.position_zone_id)
    const selectedSpecific = availableSpecifics.find(p => p.id === formData.position_specific_id)
    
    const newPlayer: Player = {
      id: Date.now(), // ID temporal para jugadores manuales
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      skill_level: formData.skill_level,
      user_id: 0, // 0 indica jugador manual
      position_zone_id: formData.position_zone_id,
      is_active: true,
      position_zone: {
        id: formData.position_zone_id,
        abbreviation: (selectedZone?.abbreviation as 'POR' | 'DEF' | 'MED' | 'DEL') || 'DEF',
        name_es: selectedZone?.name || 'Defensa',
        name_en: selectedZone?.name || 'Defender',
        is_active: true,
        created_at: new Date().toISOString()
      },
      position_specific: selectedSpecific || {
        id: formData.position_specific_id || 1,
        abbreviation: 'DFC',
        name_es: 'Defensa Central',
        name_en: 'Center Back',
        zone_id: formData.position_zone_id,
        is_active: true,
        created_at: new Date().toISOString(),
        zone: selectedZone || {
          id: formData.position_zone_id,
          abbreviation: 'DEF',
          name_es: 'Defensa',
          name_en: 'Defender',
          is_active: true,
          created_at: new Date().toISOString()
        }
      },
      jersey_number: formData.jersey_number ? parseInt(formData.jersey_number.toString()) : undefined,
      height: formData.height ? parseInt(formData.height.toString()) : undefined,
      weight: formData.weight ? parseInt(formData.weight.toString()) : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_guest: true
    }
    
    console.log('Jugador creado:', newPlayer)
    onAddPlayer(newPlayer)
    
    // Resetear formulario
    setFormData({
      name: '',
      email: '',
      phone: '',
      skill_level: 3,
      position_zone_id: 1,
      position_specific_id: undefined,
      jersey_number: '',
      height: '',
      weight: '',
      is_guest: true
    })
    onClose()
  }

  const handleClose = () => {
    // Resetear formulario
    setFormData({
      name: '',
      email: '',
      phone: '',
      skill_level: 3,
      position_zone_id: 1,
      position_specific_id: undefined,
      jersey_number: '',
      height: '',
      weight: '',
      is_guest: true
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Agregar Jugador Invitado
          </h1>
          <p className="text-blue-100 text-lg">
            Agrega un jugador temporal para simular partidos
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="juan.perez@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+56 912345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Camiseta
                </label>
                <input
                  type="number"
                  name="jersey_number"
                  value={formData.jersey_number || ''}
                  onChange={handleChange}
                  min="1"
                  max="99"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  min="140"
                  max="220"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="175"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  min="40"
                  max="150"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="70"
                />
              </div>
            </div>
          </div>

          {/* Posición */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Posición</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona de Posición *
                </label>
                <select
                  name="position_zone_id"
                  value={formData.position_zone_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {POSITION_ZONES.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name} ({position.abbreviation})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición Específica
                </label>
                <select
                  name="position_specific_id"
                  value={formData.position_specific_id || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sin especificar</option>
                  {availableSpecifics.map(position => (
                    <option key={position.id} value={position.id}>
                      {position.name} ({position.abbreviation})
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Recomendado para fútbol 11v11
                </p>
              </div>
            </div>
          </div>

          {/* Nivel de Habilidad General */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nivel de Habilidad General</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Habilidad *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, skill_level: level }))}
                    className="text-2xl transition-colors duration-200 hover:scale-110"
                  >
                    {formData.skill_level >= level ? '⭐' : '☆'}
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {formData.skill_level}/5
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formData.skill_level === 1 && 'Principiante'}
                {formData.skill_level === 2 && 'Básico'}
                {formData.skill_level === 3 && 'Intermedio'}
                {formData.skill_level === 4 && 'Avanzado'}
                {formData.skill_level === 5 && 'Experto'}
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Agregar Jugador</span>
              </div>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 