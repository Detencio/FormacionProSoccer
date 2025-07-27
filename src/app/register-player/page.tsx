'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/Layout/MainLayout'
import PlayerModal from '@/components/teams/PlayerModal'
import { teamService } from '@/services/teamService'

export default function RegisterPlayerPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<any[]>([])
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Cargar equipos desde el backend
  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true)
        const teamsData = await teamService.getTeams()
        setTeams(teamsData)
      } catch (error) {
        console.error('Error cargando equipos:', error)
        setMessage('Error al cargar equipos desde el servidor')
      } finally {
        setLoading(false)
      }
    }
    loadTeams()
  }, [])

  const handleRegisterPlayer = (teamId: number) => {
    setSelectedTeamId(teamId)
    setShowPlayerModal(true)
  }

  const handlePlayerSubmit = async (formData: any) => {
    if (!selectedTeamId) return
    
    try {
      setLoading(true)
      console.log('Creando nuevo jugador:', formData)
      
      await teamService.createPlayer({
        user_id: 1, // ID temporal, se asignará automáticamente
        team_id: selectedTeamId,
        position_zone_id: formData.position_zone_id,
        position_specific_id: formData.position_specific_id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        nationality: formData.country,
        jersey_number: parseInt(formData.jersey_number) || undefined,
        skill_level: parseInt(formData.skill_level) || 5,
        height: parseInt(formData.height) || undefined,
        weight: parseInt(formData.weight) || undefined,
        is_active: true
      })
      
      console.log('✅ Jugador registrado exitosamente')
      
      // Recargar equipos desde el backend
      const updatedTeams = await teamService.getTeams()
      setTeams(updatedTeams)
      
      setShowPlayerModal(false)
      setSelectedTeamId(null)
      setMessage('Jugador registrado exitosamente')
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000)
      
    } catch (error) {
      console.error('Error al registrar jugador:', error)
      setMessage('Error al registrar jugador. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl shadow-2xl border border-blue-500/30 p-8 relative overflow-hidden">
          {/* Efecto de luz de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Registrar Jugador</h1>
                  <p className="text-xl text-blue-100 font-medium">Crear cuenta de usuario para jugador</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/teams')}
                  className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Volver a Equipos</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-100 border border-red-400 text-red-700' 
              : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Información sobre el registro */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Información del Registro</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-800">✅ Lo que hace este formulario:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Crea cuenta de usuario con email</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Asigna jugador a un equipo específico</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>El jugador puede iniciar sesión</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Contraseña por defecto: <strong>123456</strong></span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-800">📋 Campos incluidos:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Información Personal:</strong> Nombre, email, país, teléfono</li>
                <li>• <strong>Fecha de Nacimiento:</strong> Para notificaciones de cumpleaños</li>
                <li>• <strong>Posición:</strong> Zona (POR/DEF/MED/DEL) + Específica</li>
                <li>• <strong>Datos Físicos:</strong> Altura, peso, número de camiseta</li>
                <li>• <strong>Nivel de Habilidad:</strong> Sistema de estrellas (1-5)</li>
                <li>• <strong>Asignación de Equipo:</strong> Selección automática</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lista de equipos disponibles */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">🏆 Equipos Disponibles</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Cargando equipos...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                      <p className="text-gray-600">
                        {team.city && `${team.city}, `}{team.country}
                      </p>
                      {team.founded && (
                        <p className="text-sm text-gray-500">Fundado: {team.founded}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {(team.players || []).length} jugadores
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-900">Jugadores recientes:</h4>
                    <div className="space-y-1">
                      {(team.players || []).slice(0, 3).map((player: any) => (
                        <div key={player.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">{player.name}</span>
                          <span className="text-gray-500">#{player.jersey_number}</span>
                        </div>
                      ))}
                      {(team.players || []).length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{(team.players || []).length - 3} más...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRegisterPlayer(team.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Registrar Jugador en {team.name}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de registro de jugador */}
        {showPlayerModal && selectedTeamId && (
          <PlayerModal
            isOpen={showPlayerModal}
            onClose={() => {
              setShowPlayerModal(false)
              setSelectedTeamId(null)
            }}
            onSubmit={handlePlayerSubmit}
            teamId={selectedTeamId}
            loading={loading}
          />
        )}
      </div>
    </MainLayout>
  )
} 