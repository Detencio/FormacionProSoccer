'use client'

import { useState } from 'react';
import { Team, Player } from '@/services/teamService';
import { Button } from '@/components/ui/button';
import { teamService } from '@/services/teamService';
import PlayerModal from './PlayerModal';

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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
          <p className="text-gray-600 mt-1">{team.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExpand}
          >
            {isExpanded ? 'Ocultar' : 'Ver'} Jugadores
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdate}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </div>
      </div>

                {isExpanded && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Jugadores ({players.length})</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddPlayer(team.id)}
                >
                  Agregar Jugador
                </Button>
              </div>
              {loading ? (
                <p className="text-gray-500">Cargando jugadores...</p>
              ) : players.length === 0 ? (
                <p className="text-gray-500">No hay jugadores en este equipo</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {players.map((player) => (
                    <div key={player.id} className="bg-gray-50 p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-600">
                            {player.position} • {player.age} años
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditPlayer(player, team.id)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePlayer(player.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
    </div>
  );
} 