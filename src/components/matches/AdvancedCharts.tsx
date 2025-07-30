'use client'

import React, { useMemo } from 'react'
import { Match } from '@/types'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

interface AdvancedChartsProps {
  matches: Match[]
}

export default function AdvancedCharts({ matches }: AdvancedChartsProps) {
  const chartData = useMemo(() => {
    // Datos para gráfico de partidos por mes
    const monthlyData = matches.reduce((acc, match) => {
      const date = new Date(match.date)
      const month = date.toLocaleDateString('es-ES', { month: 'long' })
      
      if (!acc[month]) {
        acc[month] = { month, total: 0, internal: 0, external: 0, championship: 0 }
      }
      
      acc[month].total++
      
      switch (match.type) {
        case 'internal_friendly':
          acc[month].internal++
          break
        case 'external_friendly':
          acc[month].external++
          break
        case 'championship':
          acc[month].championship++
          break
      }
      
      return acc
    }, {} as Record<string, any>)

    // Datos para gráfico de asistencia
    const attendanceData = matches.map(match => {
      const totalAttendance = match.attendance?.length || 0
      const confirmedAttendance = match.attendance?.filter(a => a.status === 'confirmed').length || 0
      const pendingAttendance = match.attendance?.filter(a => a.status === 'pending').length || 0
      const declinedAttendance = match.attendance?.filter(a => a.status === 'declined').length || 0
      
      return {
        match: match.title.substring(0, 20) + (match.title.length > 20 ? '...' : ''),
        total: totalAttendance,
        confirmed: confirmedAttendance,
        pending: pendingAttendance,
        declined: declinedAttendance,
        rate: totalAttendance > 0 ? Math.round((confirmedAttendance / totalAttendance) * 100) : 0
      }
    }).slice(0, 10) // Solo los últimos 10 partidos

    // Datos para gráfico de tipos de partido
    const matchTypesData = [
      { name: 'Amistoso Interno', value: matches.filter(m => m.type === 'internal_friendly').length, color: '#3b82f6' },
      { name: 'Amistoso Externo', value: matches.filter(m => m.type === 'external_friendly').length, color: '#10b981' },
      { name: 'Campeonato', value: matches.filter(m => m.type === 'championship').length, color: '#f59e0b' }
    ]

    // Datos para gráfico de estados
    const statusData = [
      { name: 'Programado', value: matches.filter(m => m.status === 'scheduled').length, color: '#3b82f6' },
      { name: 'En Progreso', value: matches.filter(m => m.status === 'in_progress').length, color: '#f59e0b' },
      { name: 'Finalizado', value: matches.filter(m => m.status === 'finished').length, color: '#10b981' },
      { name: 'Cancelado', value: matches.filter(m => m.status === 'cancelled').length, color: '#ef4444' }
    ]

    // Datos para gráfico de rendimiento por posición
    const positionData = matches.reduce((acc, match) => {
      match.attendance?.forEach(attendance => {
        if (attendance.player?.position_zone) {
          const position = attendance.player.position_zone.name_es
          if (!acc[position]) {
            acc[position] = { position, total: 0, confirmed: 0 }
          }
          acc[position].total++
          if (attendance.status === 'confirmed') {
            acc[position].confirmed++
          }
        }
      })
      return acc
    }, {} as Record<string, any>)

    const positionChartData = Object.values(positionData).map((pos: any) => ({
      position: pos.position,
      total: pos.total,
      confirmed: pos.confirmed,
      rate: pos.total > 0 ? Math.round((pos.confirmed / pos.total) * 100) : 0
    }))

    return {
      monthly: Object.values(monthlyData),
      attendance: attendanceData,
      types: matchTypesData,
      status: statusData,
      positions: positionChartData
    }
  }, [matches])

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-gray-800 font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Gráfico de Partidos por Mes */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">📈 Partidos por Mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="internal" 
              stackId="1" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
              name="Amistoso Interno"
            />
            <Area 
              type="monotone" 
              dataKey="external" 
              stackId="1" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.6}
              name="Amistoso Externo"
            />
            <Area 
              type="monotone" 
              dataKey="championship" 
              stackId="1" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.6}
              name="Campeonato"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Asistencia */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">👥 Asistencia por Partido</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.attendance}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="match" 
              stroke="rgba(255,255,255,0.7)"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="confirmed" fill="#10b981" name="Confirmados" />
            <Bar dataKey="pending" fill="#f59e0b" name="Pendientes" />
            <Bar dataKey="declined" fill="#ef4444" name="Rechazados" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Tipos de Partido */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">⚽ Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.types}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.types.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Estados */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📊 Estados de Partidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.status}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.status.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Rendimiento por Posición */}
      {chartData.positions.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🎯 Rendimiento por Posición</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chartData.positions}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis 
                dataKey="position" 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <PolarRadiusAxis 
                stroke="rgba(255,255,255,0.7)"
                fontSize={10}
              />
              <Radar
                name="Tasa de Confirmación (%)"
                dataKey="rate"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Tendencias de Asistencia */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">📈 Tendencias de Asistencia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.attendance}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="match" 
              stroke="rgba(255,255,255,0.7)"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Tasa de Confirmación (%)"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Total Invitados"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 