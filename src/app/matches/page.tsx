'use client'

import { useState } from 'react'
import MainLayout from '@/components/Layout/MainLayout'
import { FaFutbol, FaCalendar, FaClock, FaMapMarkerAlt, FaPlus, FaTrophy } from 'react-icons/fa'

export default function MatchesPage() {
  const [matches] = useState([
    {
      id: 1,
      homeTeam: 'Matiz FC',
      awayTeam: 'Los Tigres',
      date: '2024-01-15',
      time: '15:00',
      venue: 'Cancha Municipal',
      status: 'programado',
      score: null
    },
    {
      id: 2,
      homeTeam: 'Los Leones',
      awayTeam: 'Matiz FC',
      date: '2024-01-22',
      time: '16:30',
      venue: 'Estadio Deportivo',
      status: 'jugado',
      score: '2-3'
    },
    {
      id: 3,
      homeTeam: 'Matiz FC',
      awayTeam: 'Los Águilas',
      date: '2024-01-29',
      time: '14:00',
      venue: 'Cancha Municipal',
      status: 'programado',
      score: null
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'programado':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'jugado':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white'
      case 'cancelado':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'programado':
        return 'Programado'
      case 'jugado':
        return 'Jugado'
      case 'cancelado':
        return 'Cancelado'
      default:
        return 'Desconocido'
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
                  <FaFutbol className="text-white text-3xl" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Partidos</h1>
                  <p className="text-xl text-green-100 font-medium">Gestión de encuentros deportivos</p>
                </div>
              </div>
              <button className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-blue-400/30 flex items-center space-x-3">
                <FaPlus className="text-lg" />
                <span>Nuevo Partido</span>
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas con diseño FIFA 26 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-2xl border border-blue-500/30 p-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Programados</h3>
                <FaCalendar className="text-blue-300 text-2xl" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">2</div>
              <p className="text-blue-100 text-sm">Próximos encuentros</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl shadow-2xl border border-green-500/30 p-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Jugados</h3>
                <FaTrophy className="text-green-300 text-2xl" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">1</div>
              <p className="text-green-100 text-sm">Encuentros completados</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl shadow-2xl border border-purple-500/30 p-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Victorias</h3>
                <FaFutbol className="text-purple-300 text-2xl" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">1</div>
              <p className="text-purple-100 text-sm">Triunfos obtenidos</p>
            </div>
          </div>
        </div>

        {/* Lista de partidos con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <FaFutbol className="mr-3 text-green-400" />
              Próximos Partidos
            </h2>
            <div className="space-y-6">
              {matches.map((match) => (
                <div key={match.id} className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl border border-gray-600/50 hover:border-green-500/50 transition-all duration-300 group hover:shadow-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{match.homeTeam}</div>
                        <div className="text-sm text-gray-300">Local</div>
                      </div>
                      <div className="text-4xl font-bold text-green-400">VS</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{match.awayTeam}</div>
                        <div className="text-sm text-gray-300">Visitante</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaCalendar className="text-blue-400" />
                        <span className="text-sm text-gray-300">{match.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FaClock className="text-yellow-400" />
                        <span className="font-semibold text-white">{match.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <FaMapMarkerAlt className="text-red-400" />
                        <span className="text-sm text-gray-300">{match.venue}</span>
                      </div>
                      {match.score && (
                        <div className="text-2xl font-bold text-green-400 bg-gradient-to-r from-green-500/20 to-green-600/20 px-4 py-2 rounded-xl">
                          {match.score}
                        </div>
                      )}
                      <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(match.status)}`}>
                        {getStatusText(match.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 