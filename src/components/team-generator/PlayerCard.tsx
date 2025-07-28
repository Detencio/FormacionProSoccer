'use client';

import React, { useCallback } from 'react';
import { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  onSelect: (player: Player) => void;
  onDeselect: (playerId: number) => void;
  onRemoveManualPlayer?: (playerId: number) => void;
  showManualPlayerControls?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = React.memo(
  ({
    player,
    isSelected,
    onSelect,
    onDeselect,
    onRemoveManualPlayer,
    showManualPlayerControls = false,
  }) => {
    // Obtener color de posición
    const getPositionColor = (position: string) => {
      switch (position) {
        case 'POR':
          return 'bg-red-500';
        case 'DEF':
          return 'bg-blue-500';
        case 'MED':
          return 'bg-green-500';
        case 'DEL':
          return 'bg-orange-500';
        default:
          return 'bg-gray-500';
      }
    };

    // Obtener color de estadística
    const getStatColor = (value: number) => {
      if (value >= 80) return 'text-green-700';
      if (value >= 60) return 'text-yellow-700';
      if (value >= 40) return 'text-orange-700';
      return 'text-red-700';
    };

    // Generar estadísticas aleatorias basadas en skill_level
    const generateStats = (skillLevel: number) => {
      const validSkillLevel = Math.max(1, Math.min(5, skillLevel || 1));
      const baseValue = validSkillLevel * 15 + Math.floor(Math.random() * 10);
      return {
        rit: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
        tir: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
        pas: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
        reg: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
        defense: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
        fis: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      };
    };

    // Usar estadísticas del backend o generar por defecto
    const getPlayerStats = () => {
      if (
        player.rit !== undefined &&
        player.tir !== undefined &&
        player.pas !== undefined &&
        player.reg !== undefined &&
        player.defense !== undefined &&
        player.fis !== undefined
      ) {
        return {
          rit: player.rit,
          tir: player.tir,
          pas: player.pas,
          reg: player.reg,
          defense: player.defense,
          fis: player.fis,
        };
      }
      return generateStats(player.skill_level);
    };

    const stats = getPlayerStats();
    const position =
      player.position_specific?.abbreviation || player.position_zone?.abbreviation || 'N/A';
    const validSkillLevel = Math.max(1, Math.min(5, player.skill_level || 1));
    const shouldShowDeleteButton = showManualPlayerControls && player.is_guest;

    const handleCardClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSelected) {
          onDeselect(player.id);
        } else {
          onSelect(player);
        }
      },
      [player, isSelected, onSelect, onDeselect]
    );

    const handleRemoveClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onRemoveManualPlayer?.(player.id);
      },
      [onRemoveManualPlayer, player.id]
    );

    return (
      <div
        className={`bg-white rounded-lg shadow-md border-2 cursor-pointer transition-all duration-200 transform hover:scale-102 group select-none relative overflow-hidden ${
          isSelected
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-102'
            : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
        }`}
        onClick={handleCardClick}
        style={{ userSelect: 'none' }}
      >
        {/* Header compacto */}
        <div className='bg-gradient-to-r from-slate-700 to-slate-600 p-3'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 min-w-0'>
              <h3 className='text-white font-semibold text-sm truncate mb-1'>{player.name}</h3>
              <div className='flex items-center space-x-2'>
                <span
                  className={`px-2 py-0.5 ${getPositionColor(position)} rounded text-xs font-bold text-white`}
                >
                  {position}
                </span>
                <span className='text-gray-300 text-xs'>#{player.jersey_number || 'N/A'}</span>
              </div>
            </div>

            {/* Estrella grande con número */}
            <div className='flex items-center justify-center ml-2'>
              <div className='relative'>
                <svg className='w-8 h-8 text-yellow-400' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-gray-800 font-bold text-xs'>{validSkillLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body compacto con estadísticas */}
        <div className='p-3'>
          {/* 6 habilidades en una fila compacta */}
          <div className='grid grid-cols-6 gap-1'>
            <div className='text-center'>
              <div className='text-xs text-gray-500 mb-0.5'>RIT</div>
              <div className={`text-xs font-bold ${getStatColor(stats.rit)}`}>{stats.rit}</div>
            </div>
            <div className='text-center'>
              <div className='text-xs text-gray-500 mb-0.5'>TIR</div>
              <div className={`text-xs font-bold ${getStatColor(stats.tir)}`}>{stats.tir}</div>
            </div>
            <div className='text-center'>
              <div className='text-xs text-gray-500 mb-0.5'>PAS</div>
              <div className={`text-xs font-bold ${getStatColor(stats.pas)}`}>{stats.pas}</div>
            </div>
            <div className='text-center'>
              <div className='text-xs text-gray-500 mb-0.5'>REG</div>
              <div className={`text-xs font-bold ${getStatColor(stats.reg)}`}>{stats.reg}</div>
            </div>
            <div className='text-center'>
              <div className='text-xs text-gray-500 mb-0.5'>DEF</div>
              <div className={`text-xs font-bold ${getStatColor(stats.defense)}`}>
                {stats.defense}
              </div>
            </div>
            <div className='text-center'>
              <div className='text-xs text-gray-500 mb-0.5'>FIS</div>
              <div className={`text-xs font-bold ${getStatColor(stats.fis)}`}>{stats.fis}</div>
            </div>
          </div>

          {/* Botón de eliminar para jugadores invitados */}
          {shouldShowDeleteButton && (
            <div className='flex justify-center pt-2 mt-2 border-t border-gray-100'>
              <button
                onClick={handleRemoveClick}
                className='px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200 text-xs font-medium'
                title='Eliminar jugador invitado'
              >
                <div className='flex items-center space-x-1'>
                  <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                  <span>Eliminar</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Indicador de selección */}
        {isSelected && (
          <div className='absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md border border-white'>
            <svg
              className='w-2.5 h-2.5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={3}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
        )}

        {/* Badge de invitado */}
        {player.is_guest && (
          <div className='absolute top-2 left-2'>
            <span className='px-1.5 py-0.5 bg-green-500 text-white text-xs font-bold rounded shadow-md'>
              Invitado
            </span>
          </div>
        )}
      </div>
    );
  }
);

PlayerCard.displayName = 'PlayerCard';

export default PlayerCard;
