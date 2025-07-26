'use client'

import { useState } from 'react'
import MainLayout from '@/components/Layout/MainLayout'

// Datos de ejemplo para la demostración
const demoPlayers = [
  {
    id: 1,
    name: 'Lionel Messi',
    skill: 5,
    position: 'Delantero',
    photo: 'https://via.placeholder.com/150',
    stats: {
      velocidad: 85,
      disparo: 92,
      pase: 91,
      regate: 95,
      defensa: 35,
      fisico: 69
    },
    country: 'AR',
    jersey_number: '10',
    teamLogo: 'https://via.placeholder.com/50'
  },
  {
    id: 2,
    name: 'Cristiano Ronaldo',
    skill: 5,
    position: 'Delantero',
    photo: 'https://via.placeholder.com/150',
    stats: {
      velocidad: 89,
      disparo: 94,
      pase: 82,
      regate: 88,
      defensa: 35,
      fisico: 77
    },
    country: 'PT',
    jersey_number: '7',
    teamLogo: 'https://via.placeholder.com/50'
  },
  {
    id: 3,
    name: 'Kevin De Bruyne',
    skill: 4,
    position: 'Mediocampista',
    photo: 'https://via.placeholder.com/150',
    stats: {
      velocidad: 76,
      disparo: 86,
      pase: 93,
      regate: 86,
      defensa: 64,
      fisico: 78
    },
    country: 'BE',
    jersey_number: '17',
    teamLogo: 'https://via.placeholder.com/50'
  }
]

export default function DemoPage() {
  const [selectedTab, setSelectedTab] = useState('cards')

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header EA SPORTS FC */}
          <div className="fc-header relative rounded-2xl shadow-2xl mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 fc-text-glow">⚽ EA SPORTS FC Demo</h1>
                  <p className="text-green-200 text-lg">Demostración del Sistema de Diseño</p>
                </div>
                <div className="text-right">
                  <div className="fc-badge-secondary p-4">
                    <p className="text-white/80 text-sm">Versión</p>
                    <p className="text-green-400 font-bold text-lg">v2.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegación de pestañas */}
          <div className="flex space-x-4 mb-8">
            {[
              { id: 'cards', name: 'Tarjetas de Jugador', icon: '👤' },
              { id: 'pitch', name: 'Cancha de Fútbol', icon: '⚽' },
              { id: 'buttons', name: 'Botones', icon: '🔘' },
              { id: 'tables', name: 'Tablas', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`fc-button-secondary px-6 py-3 rounded-xl transition-all duration-300 ${
                  selectedTab === tab.id ? 'border-green-400 shadow-green-400/50' : ''
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Contenido de las pestañas */}
          <div className="fc-container rounded-2xl shadow-2xl border border-gray-700 p-8">
            {selectedTab === 'cards' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Tarjetas de Jugador - Estilo EA SPORTS FC</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {demoPlayers.map((player) => (
                    <div key={player.id} className="fc-player-card rounded-xl p-4">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {player.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">{player.name}</h3>
                        <div className="fc-badge mb-2">{player.position}</div>
                        <div className="flex justify-center space-x-1 mb-3">
                          {Array.from({ length: player.skill }, (_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="fc-stat">
                            <div className="text-green-400 font-bold">VEL</div>
                            <div className="text-white">{player.stats.velocidad}</div>
                          </div>
                          <div className="fc-stat">
                            <div className="text-green-400 font-bold">DIS</div>
                            <div className="text-white">{player.stats.disparo}</div>
                          </div>
                          <div className="fc-stat">
                            <div className="text-green-400 font-bold">PAS</div>
                            <div className="text-white">{player.stats.pase}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'pitch' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Cancha de Fútbol - Estilo EA SPORTS FC</h2>
                <div className="fc-pitch relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Fondo de la cancha */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-600 via-green-700 to-green-800"></div>
                  
                  {/* Patrón de césped */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                      backgroundSize: '4px 4px'
                    }}></div>
                  </div>

                  {/* Líneas del campo */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/80 shadow-lg"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/80 rounded-full shadow-lg"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-20 h-32 border-r-2 border-white/80 border-t-2 border-b-2"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-32 border-l-2 border-white/80 border-t-2 border-b-2"></div>
                    <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/80"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 border-t border-white/80"></div>
                  </div>

                  {/* Jugadores de ejemplo */}
                  {demoPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      className="absolute w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-lg border-2 border-green-400"
                      style={{
                        left: `${20 + (index * 25)}%`,
                        top: `${30 + (index * 20)}%`
                      }}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-green-400/50">
                        <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {player.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border border-white">
                        <span className="text-xs text-white font-bold">{player.skill}</span>
                      </div>
                    </div>
                  ))}

                  {/* Información de la cancha */}
                  <div className="absolute top-4 left-4">
                    <div className="fc-badge-secondary text-xs px-3 py-1">
                      Formación: 4-3-3
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="fc-badge text-xs px-3 py-1">
                      11 jugadores
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'buttons' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Botones - Estilo EA SPORTS FC</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Botones Principales</h3>
                    <div className="flex flex-wrap gap-4">
                      <button className="fc-button px-6 py-3 rounded-xl">
                        Botón Principal
                      </button>
                      <button className="fc-button-secondary px-6 py-3 rounded-xl">
                        Botón Secundario
                      </button>
                      <button className="fc-button px-6 py-3 rounded-xl" disabled>
                        Botón Deshabilitado
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Botones de Acción</h3>
                    <div className="flex flex-wrap gap-4">
                      <button className="fc-button px-4 py-2 rounded-lg text-sm">
                        ⚽ Generar Equipos
                      </button>
                      <button className="fc-button-secondary px-4 py-2 rounded-lg text-sm">
                        📋 Lista Asistencia
                      </button>
                      <button className="fc-button px-4 py-2 rounded-lg text-sm">
                        🔄 Regenerar
                      </button>
                      <button className="fc-button-secondary px-4 py-2 rounded-lg text-sm">
                        🗑️ Limpiar
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Inputs y Selects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Input de Texto
                        </label>
                        <input
                          type="text"
                          placeholder="Escribe algo..."
                          className="fc-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Select
                        </label>
                        <select className="fc-select">
                          <option value="">Seleccionar opción</option>
                          <option value="1">Opción 1</option>
                          <option value="2">Opción 2</option>
                          <option value="3">Opción 3</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'tables' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Tablas - Estilo EA SPORTS FC</h2>
                <div className="overflow-x-auto">
                  <table className="fc-table">
                    <thead>
                      <tr>
                        <th>Jugador</th>
                        <th>Posición</th>
                        <th>Habilidad</th>
                        <th>Velocidad</th>
                        <th>Disparo</th>
                        <th>Pase</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoPlayers.map((player) => (
                        <tr key={player.id}>
                          <td className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {player.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">{player.name}</span>
                          </td>
                          <td>
                            <span className="fc-badge-secondary text-xs px-2 py-1">
                              {player.position}
                            </span>
                          </td>
                          <td>
                            <div className="flex space-x-1">
                              {Array.from({ length: player.skill }, (_, i) => (
                                <span key={i} className="text-yellow-400 text-sm">⭐</span>
                              ))}
                            </div>
                          </td>
                          <td>{player.stats.velocidad}</td>
                          <td>{player.stats.disparo}</td>
                          <td>{player.stats.pase}</td>
                          <td>
                            <div className="flex space-x-2">
                              <button className="fc-button-secondary px-2 py-1 text-xs rounded">
                                ✏️
                              </button>
                              <button className="fc-button-secondary px-2 py-1 text-xs rounded">
                                👁️
                              </button>
                              <button className="fc-button-secondary px-2 py-1 text-xs rounded">
                                ❌
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Información del sistema */}
          <div className="mt-8 fc-container rounded-2xl shadow-2xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Sistema de Diseño EA SPORTS FC</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="fc-card p-4">
                <h4 className="text-green-400 font-semibold mb-2">Colores Principales</h4>
                <p className="text-gray-300 text-sm">
                  Verde vibrante (#00ff88) como color principal, con fondos oscuros y acentos estratégicos.
                </p>
              </div>
              <div className="fc-card p-4">
                <h4 className="text-green-400 font-semibold mb-2">Componentes</h4>
                <p className="text-gray-300 text-sm">
                  Tarjetas estilo FUT, botones con efectos de brillo, canchas realistas y tablas modernas.
                </p>
              </div>
              <div className="fc-card p-4">
                <h4 className="text-green-400 font-semibold mb-2">Interactividad</h4>
                <p className="text-gray-300 text-sm">
                  Efectos hover, animaciones suaves y feedback visual para una experiencia premium.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 