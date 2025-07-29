'use client'

import React, { useState } from 'react'
import { Match } from '@/types'

interface MatchCalendarProps {
  matches: Match[]
  onMatchSelect?: (match: Match) => void
}

export default function MatchCalendar({ matches, onMatchSelect }: MatchCalendarProps) {
  // Asegurar que matches sea siempre un array
  const safeMatches = matches || []
  
  // Estado para navegar entre meses
  const [currentDate, setCurrentDate] = useState(new Date())
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Generar días del mes
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  // Funciones de navegación
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const getMatchesForDay = (day: number) => {
    return safeMatches.filter(match => {
      const matchDate = new Date(match.date)
      return matchDate.getDate() === day && 
             matchDate.getMonth() === currentMonth && 
             matchDate.getFullYear() === currentYear
    })
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Calendario de Partidos</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={goToPreviousMonth}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <span className="text-xl">←</span>
          </button>
          <span className="text-white font-semibold">
            {monthNames[currentMonth]} de {currentYear}
          </span>
          <button 
            onClick={goToNextMonth}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Días de la semana */}
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-gray-300 font-medium">
            {day}
          </div>
        ))}

        {/* Días del mes */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`p-2 min-h-[80px] border border-white/10 ${
              day ? 'bg-white/5' : 'bg-transparent'
            }`}
          >
            {day && (
              <>
                <div className="text-white font-medium mb-1">{day}</div>
                <div className="space-y-1">
                  {getMatchesForDay(day).map(match => (
                    <div
                      key={match.id}
                      className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded truncate cursor-pointer hover:bg-blue-700"
                      title={`${match.title} - ${new Date(match.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                      onClick={() => onMatchSelect?.(match)}
                    >
                      {match.title}
                    </div>
                  ))}
                  {getMatchesForDay(day).length === 0 && (
                    <div className="text-xs text-gray-500">Sin partidos</div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 