'use client'

import React, { useState, useMemo } from 'react'
import { Match } from '@/types'
import { format, isToday, isTomorrow, isYesterday, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

interface MatchListProps {
  matches: Match[]
  onMatchUpdate?: (match: Match) => void
  onMatchSelect?: (match: Match) => void
}

type FilterType = 'all' | 'scheduled' | 'in_progress' | 'finished' | 'cancelled'
type SortBy = 'date' | 'title' | 'type' | 'status'

export default function MatchList({ matches, onMatchUpdate, onMatchSelect }: MatchListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const filteredAndSortedMatches = useMemo(() => {
    let filtered = matches.filter(match => {
      // Filtro por búsqueda
      const matchesSearch = match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           match.venue?.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtro por tipo
      const matchesFilter = filterType === 'all' || match.status === filterType
      
      return matchesSearch && matchesFilter
    })

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [matches, searchTerm, filterType, sortBy, sortOrder])

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30'
      case 'in_progress':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
      case 'finished':
        return 'bg-green-600/20 text-green-400 border-green-500/30'
      case 'cancelled':
        return 'bg-red-600/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeColor = (type: Match['type']) => {
    switch (type) {
      case 'internal_friendly':
        return 'bg-blue-600/20 text-blue-400'
      case 'external_friendly':
        return 'bg-green-600/20 text-green-400'
      case 'championship':
        return 'bg-yellow-600/20 text-yellow-400'
      default:
        return 'bg-gray-600/20 text-gray-400'
    }
  }

  const getDateInfo = (date: Date) => {
    const matchDate = new Date(date)
    const today = new Date()
    const daysDiff = differenceInDays(matchDate, today)

    if (isToday(matchDate)) {
      return { text: 'Hoy', color: 'text-green-400', bg: 'bg-green-600/20' }
    } else if (isTomorrow(matchDate)) {
      return { text: 'Mañana', color: 'text-yellow-400', bg: 'bg-yellow-600/20' }
    } else if (isYesterday(matchDate)) {
      return { text: 'Ayer', color: 'text-gray-400', bg: 'bg-gray-600/20' }
    } else if (daysDiff > 0) {
      return { text: `En ${daysDiff} días`, color: 'text-blue-400', bg: 'bg-blue-600/20' }
    } else {
      return { text: `${Math.abs(daysDiff)} días atrás`, color: 'text-red-400', bg: 'bg-red-600/20' }
    }
  }

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const SortButton = ({ field, children }: { field: SortBy; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
    >
      <span>{children}</span>
      {sortBy === field && (
        <span className="text-xs">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Filtros y Búsqueda */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar partidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex space-x-2">
            {(['all', 'scheduled', 'in_progress', 'finished', 'cancelled'] as FilterType[]).map(filter => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterType === filter
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter === 'all' ? 'Todos' :
                 filter === 'scheduled' ? 'Programados' :
                 filter === 'in_progress' ? 'En Progreso' :
                 filter === 'finished' ? 'Finalizados' : 'Cancelados'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controles de Ordenamiento */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">
            {filteredAndSortedMatches.length} partidos encontrados
          </span>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-300">Ordenar por:</span>
            <SortButton field="date">Fecha</SortButton>
            <SortButton field="title">Título</SortButton>
            <SortButton field="type">Tipo</SortButton>
            <SortButton field="status">Estado</SortButton>
          </div>
        </div>
      </div>

      {/* Lista de Partidos */}
      <div className="space-y-4">
        {filteredAndSortedMatches.map(match => {
          const dateInfo = getDateInfo(new Date(match.date))
          
          return (
            <div
              key={match.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
              onClick={() => onMatchSelect?.(match)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-white">{match.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(match.type)}`}>
                      {match.type === 'internal_friendly' ? 'Amistoso Interno' :
                       match.type === 'external_friendly' ? 'Amistoso Externo' : 'Campeonato'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(match.status)}`}>
                      {match.status === 'scheduled' ? 'Programado' :
                       match.status === 'in_progress' ? 'En Progreso' :
                       match.status === 'finished' ? 'Finalizado' : 'Cancelado'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📅</span>
                        <span className="text-white">
                          {format(new Date(match.date), 'EEEE d MMMM, yyyy', { locale: es })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">🕐</span>
                        <span className="text-white">
                          {format(new Date(match.date), 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">🏟️</span>
                        <span className="text-white">{match.venue?.name}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📍</span>
                        <span className="text-white">{match.venue?.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">👥</span>
                        <span className="text-white">
                          {match.attendance?.length || 0} jugadores invitados
                        </span>
                      </div>
                      {match.score && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">⚽</span>
                          <span className="text-white">
                            {match.score.home} - {match.score.away}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${dateInfo.bg} ${dateInfo.color}`}>
                    {dateInfo.text}
                  </div>
                  
                  {match.events && match.events.length > 0 && (
                    <div className="text-xs text-gray-400">
                      {match.events.length} eventos
                    </div>
                  )}
                </div>
              </div>

              {/* Información adicional */}
              {match.attendance && match.attendance.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Asistencia:</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-green-400">
                        ✓ {match.attendance.filter(a => a.status === 'confirmed').length} confirmados
                      </span>
                      <span className="text-yellow-400">
                        ? {match.attendance.filter(a => a.status === 'pending').length} pendientes
                      </span>
                      <span className="text-red-400">
                        ✗ {match.attendance.filter(a => a.status === 'declined').length} rechazados
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filteredAndSortedMatches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No se encontraron partidos</div>
            <div className="text-gray-500 text-sm">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay partidos programados'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 