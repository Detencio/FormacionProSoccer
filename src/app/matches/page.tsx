'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Match, MatchSettings, Championship, ExternalTeam } from '@/types'
import MatchCalendar from '@/components/matches/MatchCalendar'
import MatchList from '@/components/matches/MatchList'
import CreateMatchModal from '@/components/matches/CreateMatchModal'
import MatchStats from '@/components/matches/MatchStats'
import MatchNotifications from '@/components/matches/MatchNotifications'
import ChampionshipManager from '@/components/matches/ChampionshipManager'
import ExternalTeamsManager from '@/components/matches/ExternalTeamsManager'
import MatchSidebar from '@/components/matches/MatchSidebar'
import Sidebar from '@/components/Layout/Sidebar'
import { matchService } from '@/services/matchService'

export default function MatchesPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'stats' | 'notifications' | 'championships' | 'external-teams'>('calendar')
  const [matches, setMatches] = useState<Match[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [externalTeams, setExternalTeams] = useState<ExternalTeam[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Cargando datos del módulo de partidos...')
        
        // Cargar partidos (sin autenticación por ahora)
        try {
          const matchesData = await matchService.getMatches()
          setMatches(matchesData)
          console.log('✅ Partidos cargados:', matchesData.length)
        } catch (error) {
          console.log('⚠️ No se pudieron cargar partidos (requiere auth):', error)
          // Usar datos de ejemplo si no hay autenticación
          setMatches([
            {
              id: '1',
              type: 'external_friendly',
              title: 'Matiz FC vs Los Tigres',
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              venue: { 
                id: '1', 
                name: 'Cancha Municipal',
                address: 'Av. Principal 123',
                capacity: 200,
                surface: 'grass',
                facilities: ['Vestuarios', 'Estacionamiento']
              },
              status: 'scheduled',
              attendance: [
                {
                  playerId: '1',
                  player: {
                    id: 1,
                    user_id: 1,
                    name: 'Danilo Atencio',
                    email: 'danilo@matizfc.com',
                    skill_level: 8,
                    position_zone_id: 1,
                    position_zone: { 
                      id: 1, 
                      name_es: 'Defensa', 
                      name_en: 'Defense',
                      abbreviation: 'DEF',
                      is_active: true,
                      created_at: new Date().toISOString()
                    },
                    is_active: true,
                    created_at: new Date().toISOString()
                  },
                  status: 'confirmed',
                  confirmedAt: new Date()
                },
                {
                  playerId: '2',
                  player: {
                    id: 2,
                    user_id: 2,
                    name: 'Palito\'S',
                    email: 'palito@matizfc.com',
                    skill_level: 7,
                    position_zone_id: 2,
                    position_zone: { 
                      id: 2, 
                      name_es: 'Mediocampo', 
                      name_en: 'Midfield',
                      abbreviation: 'MED',
                      is_active: true,
                      created_at: new Date().toISOString()
                    },
                    is_active: true,
                    created_at: new Date().toISOString()
                  },
                  status: 'pending'
                }
              ],
              events: [],
              createdBy: 'admin',
              createdAt: new Date(),
              updatedAt: new Date()
            },
                         {
               id: '2',
               type: 'internal_friendly',
               title: 'Entrenamiento Interno',
               date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
               venue: { 
                 id: '2', 
                 name: 'Estadio Deportivo',
                 address: 'Calle Deportiva 456',
                 capacity: 500,
                 surface: 'artificial',
                 facilities: ['Vestuarios', 'Estacionamiento', 'Cafetería']
               },
               status: 'scheduled',
               attendance: [
                 {
                   playerId: '3',
                   player: {
                     id: 3,
                     user_id: 3,
                     name: 'Carlos Rodríguez',
                     email: 'carlos@matizfc.com',
                     skill_level: 6,
                     position_zone_id: 3,
                     position_zone: { 
                       id: 3, 
                       name_es: 'Delantero', 
                       name_en: 'Forward',
                       abbreviation: 'DEL',
                       is_active: true,
                       created_at: new Date().toISOString()
                     },
                     is_active: true,
                     created_at: new Date().toISOString()
                   },
                   status: 'pending'
                 },
                 {
                   playerId: '4',
                   player: {
                     id: 4,
                     user_id: 4,
                     name: 'Miguel Torres',
                     email: 'miguel@matizfc.com',
                     skill_level: 7,
                     position_zone_id: 2,
                     position_zone: { 
                       id: 2, 
                       name_es: 'Mediocampo', 
                       name_en: 'Midfield',
                       abbreviation: 'MED',
                       is_active: true,
                       created_at: new Date().toISOString()
                     },
                     is_active: true,
                     created_at: new Date().toISOString()
                   },
                   status: 'confirmed',
                   confirmedAt: new Date()
                 }
               ],
               events: [],
               createdBy: 'admin',
               createdAt: new Date(),
               updatedAt: new Date()
             },
            {
              id: '3',
              type: 'championship',
              title: 'Liga Local - Jornada 1',
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              venue: { 
                id: '3', 
                name: 'Complejo Deportivo',
                address: 'Boulevard Deportivo 789',
                capacity: 1000,
                surface: 'grass',
                facilities: ['Vestuarios', 'Estacionamiento', 'Cafetería', 'Gimnasio']
              },
              status: 'scheduled',
              attendance: [],
              events: [],
              createdBy: 'admin',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: '4',
              type: 'internal_friendly',
              title: 'Partido de Hoy',
              date: new Date(),
              venue: { 
                id: '1', 
                name: 'Cancha Municipal',
                address: 'Av. Principal 123',
                capacity: 200,
                surface: 'grass',
                facilities: ['Vestuarios', 'Estacionamiento']
              },
              status: 'in_progress',
              attendance: [],
              events: [],
              createdBy: 'admin',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ])
        }
        
        // Cargar campeonatos
        try {
          const championshipsData = await matchService.getChampionships()
          setChampionships(championshipsData)
          console.log('✅ Campeonatos cargados:', championshipsData.length)
        } catch (error) {
          console.log('⚠️ No se pudieron cargar campeonatos:', error)
          setChampionships([])
        }
        
        // Cargar equipos externos
        try {
          const teamsData = await matchService.getExternalTeams()
          setExternalTeams(teamsData)
          console.log('✅ Equipos externos cargados:', teamsData.length)
        } catch (error) {
          console.log('⚠️ No se pudieron cargar equipos externos:', error)
          setExternalTeams([])
        }
        
      } catch (error) {
        console.error('❌ Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const handleCreateMatch = async (matchData: Partial<Match>) => {
    try {
      console.log('Creando partido:', matchData)
      
      // Crear un nuevo partido con ID único
      const newMatch: Match = {
        id: Date.now().toString(), // ID temporal
        type: matchData.type || 'internal_friendly',
        title: matchData.title || 'Nuevo Partido',
        date: matchData.date || new Date(),
        venue: matchData.venue || {
          id: '1',
          name: 'Cancha Municipal',
          address: 'Av. Principal 123',
          capacity: 200,
          surface: 'grass',
          facilities: ['Vestuarios', 'Estacionamiento']
        },
        status: 'scheduled',
        attendance: [],
        events: [],
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Agregar el nuevo partido a la lista
      setMatches(prevMatches => [newMatch, ...prevMatches])
      
      console.log('✅ Partido creado exitosamente:', newMatch)
      setShowCreateModal(false)
      
      // Abrir automáticamente el menú lateral para el nuevo partido
      setSelectedMatch(newMatch)
    } catch (error) {
      console.error('❌ Error creando partido:', error)
    }
  }

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match)
  }

  const handleCloseSidebar = () => {
    setSelectedMatch(null)
  }

  const handleUpdateMatch = (updatedMatch: Match) => {
    setMatches(prevMatches => 
      prevMatches.map(match => 
        match.id === updatedMatch.id ? updatedMatch : match
      )
    )
    setSelectedMatch(updatedMatch)
  }

  const tabs = [
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'list', label: 'Lista de Partidos', icon: '⚽' },
    { id: 'stats', label: 'Estadísticas', icon: '📊' },
    { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { id: 'championships', label: 'Campeonatos', icon: '🏆' },
    { id: 'external-teams', label: 'Equipos Externos', icon: '🤝' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando módulo de partidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 flex">
      {/* ProSoccer Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Gestión de Partidos</h1>
                <p className="text-gray-300 mt-1">Organiza y gestiona todos los partidos del club</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Búsqueda global */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar partidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
                </div>
                
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  + Crear Partido
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <MatchCalendar matches={matches} onMatchSelect={handleMatchSelect} />
            </div>
          )}

          {activeTab === 'list' && (
            <MatchList 
              matches={matches} 
              onMatchUpdate={(updatedMatch: Match) => {
                // TODO: Actualizar partido
                console.log('Actualizando partido:', updatedMatch)
              }}
              onMatchSelect={handleMatchSelect}
            />
          )}

          {activeTab === 'stats' && (
            <MatchStats matches={matches} />
          )}

          {activeTab === 'notifications' && (
            <MatchNotifications 
              matches={matches}
              onMatchSelect={handleMatchSelect}
            />
          )}

          {activeTab === 'championships' && (
            <ChampionshipManager 
              championships={championships}
              onChampionshipUpdate={(updatedChampionship: Championship) => {
                // TODO: Actualizar campeonato
                console.log('Actualizando campeonato:', updatedChampionship)
              }}
            />
          )}

          {activeTab === 'external-teams' && (
            <ExternalTeamsManager 
              teams={externalTeams}
              onTeamUpdate={(updatedTeam: ExternalTeam) => {
                // TODO: Actualizar equipo externo
                console.log('Actualizando equipo externo:', updatedTeam)
              }}
            />
          )}
        </div>

        {/* Create Match Modal */}
        {showCreateModal && (
          <CreateMatchModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateMatch}
            championships={championships}
            externalTeams={externalTeams}
          />
        )}

        {/* Menú lateral */}
        <MatchSidebar 
          selectedMatch={selectedMatch}
          onClose={handleCloseSidebar}
          onUpdateMatch={handleUpdateMatch}
        />
      </div>
    </div>
  )
} 