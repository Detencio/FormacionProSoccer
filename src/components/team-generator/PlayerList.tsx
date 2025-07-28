'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Player } from '@/types';
import PlayerCard from './PlayerCard';

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

  return (
    <div className='space-y-4 overflow-hidden'>
      {/* Filtros */}
      <div className='space-y-3'>
        {/* Búsqueda */}
        <div>
          <input
            type='text'
            placeholder='Buscar jugadores...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Filtro por posición */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Filtrar por posición:
          </label>
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setFilterPosition('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterPosition === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todas
            </button>
            {positions.map(position => (
              <button
                key={position}
                onClick={() => setFilterPosition(position)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterPosition === position
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='bg-gray-50 rounded-lg p-3'>
        <div className='grid grid-cols-3 gap-4 text-center text-sm'>
          <div>
            <div className='font-semibold text-gray-900'>{players.length}</div>
            <div className='text-gray-600'>Total</div>
          </div>
          <div>
            <div className='font-semibold text-blue-600'>{selectedPlayers.length}</div>
            <div className='text-gray-600'>Seleccionados</div>
          </div>
          <div>
            <div className='font-semibold text-gray-900'>{filteredPlayers.length}</div>
            <div className='text-gray-600'>Mostrados</div>
          </div>
        </div>
      </div>

      {/* Lista de jugadores */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900'>Jugadores Disponibles</h3>
          <div className='text-sm text-gray-600'>{filteredPlayers.length} jugadores</div>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <div className='text-4xl mb-2'>🔍</div>
            <p>No se encontraron jugadores con los filtros aplicados</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 overflow-hidden'>
            {filteredPlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                isSelected={isPlayerSelected(player.id)}
                onSelect={onPlayerSelect}
                onDeselect={onPlayerDeselect}
                onRemoveManualPlayer={onRemoveManualPlayer}
                showManualPlayerControls={showManualPlayerControls}
              />
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      {selectedPlayers.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h4 className='font-semibold text-blue-900 mb-2'>
            📋 Jugadores Seleccionados ({selectedPlayers.length})
          </h4>
          <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2'>
            {selectedPlayers.map(player => (
              <div key={player.id} className='bg-white border border-blue-300 rounded p-2 text-xs'>
                <div className='font-medium text-gray-900 truncate'>{player.name}</div>
                <div className='text-gray-600'>
                  {player.position_specific?.abbreviation || player.position_zone.abbreviation}
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
