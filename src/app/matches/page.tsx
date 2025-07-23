'use client'

import { useState } from 'react'
import MainLayout from '@/components/Layout/MainLayout'

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
        return 'bg-blue-100 text-blue-800'
      case 'jugado':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Partidos</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Nuevo Partido
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Próximos Partidos</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {matches.map((match) => (
              <div key={match.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{match.homeTeam}</div>
                      <div className="text-sm text-gray-500">Local</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">VS</div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{match.awayTeam}</div>
                      <div className="text-sm text-gray-500">Visitante</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{match.date}</div>
                    <div className="font-semibold text-gray-900">{match.time}</div>
                    <div className="text-sm text-gray-500">{match.venue}</div>
                    {match.score && (
                      <div className="text-lg font-bold text-green-600">{match.score}</div>
                    )}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(match.status)}`}>
                      {getStatusText(match.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Estadísticas</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-500">Partidos Jugados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-500">Victorias</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-gray-500">Empates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 