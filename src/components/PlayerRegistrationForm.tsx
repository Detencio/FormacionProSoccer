'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { apiClient } from '@/lib/api'
import { PositionZone, PositionSpecific } from '@/types'

interface PlayerRegistrationFormData {
  full_name: string
  email: string
  phone?: string
  position_zone: string
  position_specific?: string
  date_of_birth?: string
  nationality?: string
  jersey_number?: number
  height?: number
  weight?: number
  skill_level: number
  team_id: number
}

interface PlayerRegistrationFormProps {
  onSubmit: (data: PlayerRegistrationFormData) => void
  onCancel: () => void
  teamId: number
}

const PlayerRegistrationForm: React.FC<PlayerRegistrationFormProps> = ({
  onSubmit,
  onCancel,
  teamId
}) => {
  const [positionZones, setPositionZones] = useState<PositionZone[]>([])
  const [positionSpecifics, setPositionSpecifics] = useState<PositionSpecific[]>([])
  const [selectedZone, setSelectedZone] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<PlayerRegistrationFormData>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      position_zone: '',
      position_specific: '',
      date_of_birth: '',
      nationality: '',
      jersey_number: undefined,
      height: undefined,
      weight: undefined,
      skill_level: 5,
      team_id: teamId
    }
  })

  // Cargar posiciones por zona
  useEffect(() => {
    const loadPositionZones = async () => {
      try {
        const zones = await apiClient.getPositionZones()
        setPositionZones(zones)
      } catch (error) {
        console.error('Error cargando posiciones por zona:', error)
      }
    }
    loadPositionZones()
  }, [])

  // Cargar posiciones específicas cuando se selecciona una zona
  useEffect(() => {
    const loadPositionSpecifics = async () => {
      if (selectedZone) {
        try {
          const zone = positionZones.find(z => z.abbreviation === selectedZone)
          if (zone) {
            const specifics = await apiClient.getPositionSpecificsByZone(zone.id)
            setPositionSpecifics(specifics)
          }
        } catch (error) {
          console.error('Error cargando posiciones específicas:', error)
        }
      } else {
        setPositionSpecifics([])
      }
    }
    loadPositionSpecifics()
  }, [selectedZone, positionZones])

  const handleZoneChange = (zoneAbbreviation: string) => {
    setSelectedZone(zoneAbbreviation)
    setValue('position_zone', zoneAbbreviation)
    setValue('position_specific', '') // Reset posición específica
  }

  const handleSpecificChange = (specificAbbreviation: string) => {
    setValue('position_specific', specificAbbreviation)
  }

  const onSubmitForm = async (data: PlayerRegistrationFormData) => {
    setLoading(true)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error registrando jugador:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Registrar Nuevo Jugador
      </h2>
      
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Información Personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre Completo *
            </label>
            <input
              {...register('full_name', { required: 'El nombre es requerido' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              {...register('email', { 
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              {...register('phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              {...register('date_of_birth')}
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nacionalidad
            </label>
            <input
              {...register('nationality')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Camiseta
            </label>
            <input
              {...register('jersey_number', { valueAsNumber: true })}
              type="number"
              min="1"
              max="99"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Posición por Zona */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Posición por Zona *
          </label>
          <select
            value={selectedZone}
            onChange={(e) => handleZoneChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Seleccionar zona</option>
            {positionZones.map(zone => (
              <option key={zone.id} value={zone.abbreviation}>
                {zone.name_es} ({zone.abbreviation})
              </option>
            ))}
          </select>
          {errors.position_zone && (
            <p className="mt-1 text-sm text-red-600">{errors.position_zone.message}</p>
          )}
        </div>

        {/* Posición Específica (Opcional) */}
        {selectedZone && positionSpecifics.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Posición Específica (Opcional)
            </label>
            <select
              onChange={(e) => handleSpecificChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sin especificar</option>
              {positionSpecifics.map(specific => (
                <option key={specific.id} value={specific.abbreviation}>
                  {specific.name_es} ({specific.abbreviation})
                </option>
              ))}
            </select>
            <small className="text-gray-500">
              Recomendado para fútbol 11v11
            </small>
          </div>
        )}

        {/* Información Física */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Altura (cm)
            </label>
            <input
              {...register('height', { valueAsNumber: true })}
              type="number"
              min="100"
              max="250"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Peso (kg)
            </label>
            <input
              {...register('weight', { valueAsNumber: true })}
              type="number"
              min="30"
              max="150"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nivel de Habilidad *
            </label>
            <div className="mt-1">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      {...register('skill_level', { 
                        required: 'El nivel de habilidad es requerido',
                        valueAsNumber: true
                      })}
                      type="radio"
                      value={level}
                      className="sr-only"
                    />
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      watch('skill_level') == level
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300'
                    }`}>
                      {level}
                    </div>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                1 = Principiante, 10 = Experto
              </p>
            </div>
            {errors.skill_level && (
              <p className="mt-1 text-sm text-red-600">{errors.skill_level.message}</p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Jugador'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlayerRegistrationForm 