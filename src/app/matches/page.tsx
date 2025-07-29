'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Match, MatchSettings, Championship, ExternalTeam } from '@/types'
import MatchCalendar from '@/components/matches/MatchCalendar'
import MatchList from '@/components/matches/MatchList'
import CreateMatchModal from '@/components/matches/CreateMatchModal'
import MatchStats from '@/components/matches/MatchStats'
import ChampionshipManager from '@/components/matches/ChampionshipManager'
import ExternalTeamsManager from '@/components/matches/ExternalTeamsManager'
import MatchSidebar from '@/components/matches/MatchSidebar'
import Sidebar from '@/components/Layout/Sidebar'
import { matchService } from '@/services/matchService'

export default function MatchesPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'championships' | 'external-teams'>('calendar')
  const [matches, setMatches] = useState<Match[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [externalTeams, setExternalTeams] = useState<ExternalTeam[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

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
              attendance: [],
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
              attendance: [],
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
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                + Crear Partido
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
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
            <MatchStats matches={matches} />
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