'use client'

import React, { useState, useMemo } from 'react'
import { Match } from '@/types'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, eachWeekOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'

interface MatchCalendarProps {
  matches: Match[]
  onMatchSelect?: (match: Match) => void
}

type CalendarView = 'month' | 'week'

export default function MatchCalendar({ matches, onMatchSelect }: MatchCalendarProps) {
  const safeMatches = matches || []
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('month')

  // Navegación
  const goToPreviousPeriod = () => {
    setCurrentDate(prev => view === 'month' ? subMonths(prev, 1) : subMonths(prev, 1))
  }

  const goToNextPeriod = () => {
    setCurrentDate(prev => view === 'month' ? addMonths(prev, 1) : addMonths(prev, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Obtener partidos para un día específico
  const getMatchesForDay = (date: Date) => {
    return safeMatches.filter(match => {
      const matchDate = new Date(match.date)
      return isSameDay(matchDate, date)
    })
  }

  // Vista Mensual
  const MonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = eachDayOfInterval({ start: startDate, end: endDate })

  return (
      <div className="grid grid-cols-7 gap-1">
        {/* Días de la semana */}
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="p-3 text-center text-gray-300 font-semibold text-sm">
            {day}
          </div>
        ))}

        {/* Días del mes */}
        {days.map((day, index) => {
          const dayMatches = getMatchesForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())

          return (
          <div
            key={index}
              className={`min-h-[120px] p-2 border border-white/10 ${
                isCurrentMonth ? 'bg-white/5' : 'bg-white/2'
              } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium mb-2 ${
                isCurrentMonth ? 'text-white' : 'text-gray-500'
              } ${isToday ? 'text-blue-400 font-bold' : ''}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayMatches.map(match => (
                  <div
                    key={match.id}
                    className={`text-xs px-2 py-1 rounded cursor-pointer transition-all duration-200 ${
                      match.type === 'championship' 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                        : match.type === 'external_friendly'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    title={`${match.title} - ${format(new Date(match.date), 'HH:mm')}`}
                    onClick={() => onMatchSelect?.(match)}
                  >
                    <div className="font-medium truncate">{match.title}</div>
                    <div className="text-xs opacity-75">
                      {format(new Date(match.date), 'HH:mm')}
                    </div>
                  </div>
                ))}
                {dayMatches.length === 0 && (
                  <div className="text-xs text-gray-500 text-center py-2">
                    Sin partidos
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Vista Semanal
  const WeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Lunes como inicio
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return (
      <div className="space-y-4">
        {/* Horarios */}
        <div className="grid grid-cols-8 gap-2">
          <div className="text-gray-300 font-semibold text-sm p-2">Hora</div>
          {days.map(day => (
            <div key={day.toISOString()} className="text-center text-gray-300 font-semibold text-sm p-2">
              <div>{format(day, 'EEE', { locale: es })}</div>
              <div className="text-xs">{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Slots de tiempo */}
        {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
          <div key={hour} className="grid grid-cols-8 gap-2">
            <div className="text-gray-400 text-sm p-2 font-medium">
              {hour}:00
            </div>
            {days.map(day => {
              const dayMatches = getMatchesForDay(day).filter(match => {
                const matchHour = new Date(match.date).getHours()
                return matchHour === hour
              })

              return (
                <div key={day.toISOString()} className="min-h-[60px] border border-white/10 bg-white/5 p-1">
                  {dayMatches.map(match => (
                    <div
                      key={match.id}
                      className={`text-xs px-2 py-1 rounded cursor-pointer transition-all duration-200 mb-1 ${
                        match.type === 'championship' 
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                          : match.type === 'external_friendly'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      title={match.title}
                      onClick={() => onMatchSelect?.(match)}
                    >
                      <div className="font-medium truncate">{match.title}</div>
                      <div className="text-xs opacity-75">
                        {format(new Date(match.date), 'HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">Calendario de Partidos</h2>
          
          {/* Selector de vista */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                view === 'month' 
                  ? 'bg-white/20 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                view === 'week' 
                  ? 'bg-white/20 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Semana
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Hoy
          </button>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToPreviousPeriod}
              className="text-white hover:text-gray-300 transition-colors p-2"
            >
              <span className="text-xl">←</span>
            </button>
            
            <span className="text-white font-semibold min-w-[200px] text-center">
              {view === 'month' 
                ? format(currentDate, 'MMMM yyyy', { locale: es })
                : `Semana del ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: es })}`
              }
            </span>
            
            <button 
              onClick={goToNextPeriod}
              className="text-white hover:text-gray-300 transition-colors p-2"
            >
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vista del calendario */}
      {view === 'month' ? <MonthView /> : <WeekView />}

      {/* Leyenda */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-gray-300">Amistoso Interno</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded"></div>
          <span className="text-gray-300">Amistoso Externo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-600 rounded"></div>
          <span className="text-gray-300">Campeonato</span>
        </div>
      </div>
    </div>
  )
} 