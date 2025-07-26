'use client'

import { useState } from 'react';
import { Team, Player } from '@/services/teamService';
import { Button } from '@/components/ui/button';
import { teamService } from '@/services/teamService';
import PlayerModal from './PlayerModal';
import { FaUsers, FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

interface TeamCardProps {
  team: Team;
  onUpdate: () => void;
  onDelete: (teamId: number) => void;
  onAddPlayer: (teamId: number) => void;
  onEditPlayer: (player: Player, teamId: number) => void;
  onDeletePlayer: (playerId: number, teamId: number) => void;
}

export default function TeamCard({ team, onUpdate, onDelete, onAddPlayer, onEditPlayer, onDeletePlayer }: TeamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [players, setPlayers] = useState<Player[]>(team.players || []);
  const [loading, setLoading] = useState(false);

  const loadPlayers = async () => {
    if (players.length === 0 && !loading) {
      setLoading(true);
      try {
        const teamPlayers = await teamService.getTeamPlayers(team.id);
        setPlayers(teamPlayers);
      } catch (error) {
        console.error('Error cargando jugadores:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      loadPlayers();
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        await teamService.deleteTeam(team.id);
        onDelete(team.id);
      } catch (error) {
        console.error('Error eliminando equipo:', error);
        alert('Error al eliminar el equipo');
      }
    }
  };

  const handleDeletePlayer = async (playerId: number) => {
    await onDeletePlayer(playerId, team.id);
    // Recargar jugadores después de eliminar
    const updatedPlayers = await teamService.getTeamPlayers(team.id);
    setPlayers(updatedPlayers);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
      {/* Efecto de luz de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl border border-blue-400/30">
              <FaUsers className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">{team.name}</h3>
              <p className="text-gray-300 text-lg">{team.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-blue-300 text-sm font-medium">
                  {players.length} Jugadores
                </span>
                <span className="text-green-300 text-sm font-medium">
                  {'CL'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExpand}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-blue-400/30 flex items-center space-x-2"
            >
              {isExpanded ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              <span>{isExpanded ? 'Ocultar' : 'Ver'} Jugadores</span>
            </button>
            <button
              onClick={onUpdate}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-green-400/30 flex items-center space-x-2"
            >
              <FaEdit className="text-lg" />
              <span>Editar</span>
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-red-400/30 flex items-center space-x-2"
            >
              <FaTrash className="text-lg" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-2xl font-bold text-white flex items-center">
                <FaUsers className="mr-3 text-blue-400" />
                Jugadores ({players.length})
              </h4>
              <button
                onClick={() => onAddPlayer(team.id)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-purple-400/30 flex items-center space-x-2"
              >
                <FaPlus className="text-lg" />
                <span>Agregar Jugador</span>
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-300 font-medium">Cargando jugadores...</p>
              </div>
            ) : players.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-400 font-medium">No hay jugadores en este equipo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player) => (
                  <div key={player.id} className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-2xl border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 group hover:shadow-xl">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-white text-lg mb-1">{player.name}</div>
                        <div className="text-gray-300 text-sm mb-2">
                          {player.position} • {player.age} años
                        </div>
                        {player.email && (
                          <div className="text-gray-400 text-xs mb-1">{player.email}</div>
                        )}
                        {player.phone && (
                          <div className="text-gray-400 text-xs">{player.phone}</div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => onEditPlayer(player, team.id)}
                          className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 