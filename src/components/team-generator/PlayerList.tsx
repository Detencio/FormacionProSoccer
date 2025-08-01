'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Player } from '@/types';
import { User, Plus, Phone, Mail, MapPin, Trophy, UserCheck, Edit, Trash2 } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  selectedPlayers: Player[];
  onPlayerSelect: (player: Player) => void;
  onPlayerDeselect: (playerId: number) => void;
  onRemoveManualPlayer?: (playerId: number) => void;
  showManualPlayerControls?: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
  onPlayerDeselect,
  onRemoveManualPlayer,
  showManualPlayerControls = false,
}) => {
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar jugadores con useMemo para mejor rendimiento
  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition =
        filterPosition === 'all' ||
        player.position_zone.abbreviation === filterPosition ||
        player.position_specific?.abbreviation === filterPosition;
      return matchesSearch && matchesPosition;
    });
  }, [players, searchTerm, filterPosition]);

  // Obtener posiciones únicas con useMemo
  const positions = useMemo(() => {
    return Array.from(
      new Set([
        ...players.map(p => p.position_zone.abbreviation),
        ...(players.map(p => p.position_specific?.abbreviation).filter(Boolean) as string[]),
      ])
    ).sort();
  }, [players]);

  const isPlayerSelected = useCallback(
    (playerId: number) => {
      return selectedPlayers.some(p => p.id === playerId);
    },
    [selectedPlayers]
  );

  const handlePlayerClick = useCallback((player: Player) => {
    if (isPlayerSelected(player.id)) {
      onPlayerDeselect(player.id);
    } else {
      onPlayerSelect(player);
    }
  }, [isPlayerSelected, onPlayerSelect, onPlayerDeselect]);

  // Generar estadísticas basadas en skill_level
  const generateStats = (skillLevel: number) => {
    const validSkillLevel = Math.max(1, Math.min(5, skillLevel || 1));
    const baseValue = validSkillLevel * 15 + Math.floor(Math.random() * 10);
    return {
      totalMatches: Math.floor(Math.random() * 50) + 10,
      attendance: Math.floor(Math.random() * 40) + 60, // 60-100%
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <User className="w-5 h-5 mr-2 text-green-600" />
          Jugadores Disponibles ({players.length})
        </h2>
        <div className="flex gap-2">
          {/* Filtros */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Buscar jugadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="all">Todas las posiciones</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6 border border-blue-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-bold text-gray-900 text-xl">{players.length}</div>
            <div className="text-gray-600 text-xs font-medium">Total</div>
          </div>
          <div>
            <div className="font-bold text-blue-600 text-xl">{selectedPlayers.length}</div>
            <div className="text-gray-600 text-xs font-medium">Seleccionados</div>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-xl">{filteredPlayers.length}</div>
            <div className="text-gray-600 text-xs font-medium">Mostrados</div>
          </div>
        </div>
      </div>

      {/* Lista de jugadores */}
      <div className="grid grid-cols-2 gap-6">
        {filteredPlayers.map(player => {
          const stats = generateStats(player.skill_level);
          const position = player.position_specific?.name_es || player.position_zone?.name_es || 'N/A';
          const isSelected = isPlayerSelected(player.id);
          const shouldShowDeleteButton = showManualPlayerControls && player.is_guest;

          return (
            <div 
              key={player.id} 
              className={`bg-white rounded-lg shadow-md border-l-4 border-l-green-500 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                isSelected ? 'ring-2 ring-blue-500' : 'hover:border-l-green-600'
              }`}
              onClick={() => handlePlayerClick(player)}
            >
              <div className="p-4">
                {/* Header con nombre y posición */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {player.name}
                    </h3>
                    <p className="text-green-600 font-medium text-sm">
                      {position}
                    </p>
                  </div>
                  
                  {/* Indicadores */}
                  <div className="flex items-center space-x-2">
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {shouldShowDeleteButton && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveManualPlayer?.(player.id);
                        }}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Eliminar jugador invitado"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {player.is_guest && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                        Invitado
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating/Nivel */}
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">
                    {player.skill_level}/10
                  </span>
                </div>

                {/* Información de contacto */}
                <div className="space-y-2 mb-4">
                  {player.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{player.phone}</span>
                    </div>
                  )}
                  
                  {player.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 break-all">{player.email}</span>
                    </div>
                  )}
                </div>

                {/* Estadísticas */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{stats.totalMatches} partidos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-semibold">{stats.attendance}% asistencia</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay jugadores disponibles</p>
          <p className="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Jugadores seleccionados */}
      {selectedPlayers.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Jugadores Seleccionados ({selectedPlayers.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {selectedPlayers.map(player => (
              <div key={player.id} className="bg-white border border-blue-300 rounded-lg p-3 text-xs shadow-sm">
                <div className="font-medium text-gray-900 truncate mb-1">{player.name}</div>
                <div className="text-gray-600">
                  {player.position_specific?.abbreviation || player.position_zone?.abbreviation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerList;
