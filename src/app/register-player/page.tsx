'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { countries } from '@/lib/countries'
import MainLayout from '@/components/Layout/MainLayout'

export default function RegisterPlayerPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<any[]>([])
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    country: '',
    phone: '',
    position: '',
    age: '',
    team_id: '',
    jersey_number: '',
    photo_url: ''
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  // Cargar equipos desde localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('teams-data')
    if (savedTeams) {
      try {
        const teamsData = JSON.parse(savedTeams)
        setTeams(teamsData)
      } catch (error) {
        console.error('Error cargando equipos:', error)
      }
    }
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
        setFormData({ ...formData, photo_url: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value
    const selectedCountry = countries.find(country => country.code === countryCode)
    
    setFormData({
      ...formData,
      country: countryCode,
      phone: selectedCountry ? selectedCountry.phoneCode : ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Validar que se haya seleccionado un equipo
      if (!formData.team_id) {
        setMessage('Error: Debes seleccionar un equipo para asignar al jugador.')
        return
      }

      // Simular registro exitoso
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Agregar el jugador al equipo seleccionado
      const selectedTeam = teams.find(team => team.id === parseInt(formData.team_id))
      if (selectedTeam) {
        // Crear el nuevo jugador
        const newPlayer = {
          id: Date.now(), // ID único basado en timestamp
          name: formData.full_name,
          email: formData.email,
          country: formData.country,
          phone: formData.phone,
          position: formData.position,
          age: parseInt(formData.age),
          jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
          photo_url: formData.photo_url,
          team_id: parseInt(formData.team_id)
        }

        // Actualizar el equipo con el nuevo jugador
        const updatedTeams = teams.map(team => 
          team.id === parseInt(formData.team_id)
            ? { ...team, players: [...(team.players || []), newPlayer] }
            : team
        )

        // Guardar en localStorage
        localStorage.setItem('teams-data', JSON.stringify(updatedTeams))
        
        setMessage('¡Jugador registrado exitosamente! Se ha creado una cuenta de usuario con contraseña por defecto: 123456')
        
        // Limpiar formulario
        setFormData({
          full_name: '',
          email: '',
          country: '',
          phone: '',
          position: '',
          age: '',
          team_id: '',
          jersey_number: '',
          photo_url: ''
        })
        setPhotoPreview(null)
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/teams')
        }, 2000)
      }
    } catch (error) {
      setMessage('Error al registrar el jugador. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Registrar Jugador en el Sistema</h1>
              <p className="text-blue-100 text-lg">
                Crea una cuenta de usuario para un jugador y asígnalo a un equipo
              </p>
            </div>

            <div className="p-8">
              {message && (
                <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                  message.includes('Error') 
                    ? 'bg-red-50 text-red-700 border-red-400' 
                    : 'bg-green-50 text-green-700 border-green-400'
                }`}>
                  <div className="flex items-center">
                    <svg className={`w-5 h-5 mr-2 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={message.includes('Error') ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                    </svg>
                    {message}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Ingresa el nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="jugador@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        País *
                      </label>
                      <select
                        value={formData.country}
                        onChange={handleCountryChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Selecciona un país</option>
                        {countries.map((country, index) => (
                          <option key={`country-${country.code}-${index}`} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+34 600 000 000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Posición
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Selecciona posición</option>
                        <option value="Portero">Portero</option>
                        <option value="Defensa">Defensa</option>
                        <option value="Mediocampista">Mediocampista</option>
                        <option value="Delantero">Delantero</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Edad *
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        min="16"
                        max="50"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Camiseta
                    </label>
                    <input
                      type="number"
                      value={formData.jersey_number}
                      onChange={(e) => setFormData({...formData, jersey_number: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      min="1"
                      max="99"
                    />
                  </div>
                </div>

                {/* Asignación de Equipo */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Asignación de Equipo</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Equipo *
                    </label>
                    <select
                      value={formData.team_id}
                      onChange={(e) => setFormData({...formData, team_id: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Selecciona un equipo</option>
                      {teams.map((team, index) => (
                        <option key={`register-team-${team.id}-${index}`} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                    {teams.length === 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        No hay equipos disponibles. Primero crea un equipo en la sección de Equipos.
                      </p>
                    )}
                  </div>
                </div>

                {/* Foto del Jugador */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Foto del Jugador</h3>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {photoPreview && (
                      <div className="flex-shrink-0">
                        <img 
                          src={photoPreview} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover border-2 border-blue-200 rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registrando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Crear Cuenta de Jugador
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/teams')}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 