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
      <div className="space-y-8">
        {/* Header con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl shadow-2xl border border-green-500/30 p-8 relative overflow-hidden">
          {/* Efecto de luz de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Registrar Jugador</h1>
                  <p className="text-xl text-green-100 font-medium">Crear cuenta de usuario para jugador</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Personal */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Información Personal
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingresa el nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ejemplo@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-3">País</label>
                    <select
                      value={formData.country}
                      onChange={handleCountryChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un país</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+56 912345678"
                    />
                  </div>
                </div>

                {/* Información Deportiva */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m4 0V2a1 1 0 011-1h4a1 1 0 011 1v2M7 4v16a2 2 0 002 2h10a2 2 0 002-2V4M7 4h10" />
                    </svg>
                    Información Deportiva
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Posición *</label>
                    <select
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecciona una posición</option>
                      <option value="Portero">Portero</option>
                      <option value="Defensa">Defensa</option>
                      <option value="Centrocampista">Centrocampista</option>
                      <option value="Delantero">Delantero</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Edad *</label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="50"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Número de Camiseta</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={formData.jersey_number}
                      onChange={(e) => setFormData({...formData, jersey_number: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Equipo *</label>
                    <select
                      required
                      value={formData.team_id}
                      onChange={(e) => setFormData({...formData, team_id: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un equipo</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Foto del Jugador */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Foto del Jugador
                </h3>
                
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-500 overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-white mb-3">Seleccionar Foto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Mensaje de estado */}
              {message && (
                <div className={`p-4 rounded-2xl ${
                  message.includes('Error') 
                    ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-200' 
                    : 'bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-gray-500/30"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Registrar Jugador</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 