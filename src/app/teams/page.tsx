'use client'

import { useState, useEffect } from 'react';
import { Team, Player, CreateTeamRequest, UpdateTeamRequest, CreatePlayerRequest, UpdatePlayerRequest } from '@/services/teamService';
import { teamService } from '@/services/teamService';
import { Button } from '@/components/ui/button';
import TeamCard from '@/components/teams/TeamCard';
import TeamModal from '@/components/teams/TeamModal';
import PlayerModal from '@/components/teams/PlayerModal';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modales
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  
  // Estados de carga
  const [teamLoading, setTeamLoading] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);

  // Cargar equipos
  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teamsData = await teamService.getTeams();
      setTeams(teamsData);
    } catch (err) {
      console.error('Error cargando equipos:', err);
      setError('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // Manejar creación/edición de equipos
  const handleTeamSubmit = async (data: CreateTeamRequest | UpdateTeamRequest) => {
    try {
      setTeamLoading(true);
      if (editingTeam) {
        // Actualizar equipo existente
        const updatedTeam = await teamService.updateTeam(editingTeam.id, data as UpdateTeamRequest);
        setTeams(prev => prev.map(team => team.id === editingTeam.id ? updatedTeam : team));
      } else {
        // Crear nuevo equipo
        const newTeam = await teamService.createTeam(data as CreateTeamRequest);
        setTeams(prev => [...prev, newTeam]);
      }
      setShowTeamModal(false);
      setEditingTeam(null);
    } catch (err) {
      console.error('Error guardando equipo:', err);
      alert('Error al guardar el equipo');
    } finally {
      setTeamLoading(false);
    }
  };

  // Manejar eliminación de equipos
  const handleTeamDelete = (teamId: number) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  };

  // Manejar edición de equipo
  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setShowTeamModal(true);
  };

  // Manejar creación de jugador
  const handleAddPlayer = (teamId: number) => {
    setSelectedTeamId(teamId);
    setEditingPlayer(null);
    setShowPlayerModal(true);
  };

  // Manejar edición de jugador
  const handleEditPlayer = (player: Player, teamId: number) => {
    setEditingPlayer(player);
    setSelectedTeamId(teamId);
    setShowPlayerModal(true);
  };

  // Manejar eliminación de jugador
  const handleDeletePlayer = async (playerId: number, teamId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este jugador?')) {
      try {
        await teamService.deletePlayer(playerId);
        // Recargar el equipo para actualizar la lista de jugadores
        const updatedTeam = await teamService.getTeam(teamId);
        setTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team));
      } catch (err) {
        console.error('Error eliminando jugador:', err);
        alert('Error al eliminar el jugador');
      }
    }
  };

  // Manejar creación/edición de jugadores
  const handlePlayerSubmit = async (data: CreatePlayerRequest | UpdatePlayerRequest) => {
    if (!selectedTeamId) return;

    try {
      setPlayerLoading(true);
      if (editingPlayer) {
        // Actualizar jugador existente
        const updatedPlayer = await teamService.updatePlayer(editingPlayer.id, data as UpdatePlayerRequest);
        // Recargar el equipo para actualizar la lista de jugadores
        const updatedTeam = await teamService.getTeam(selectedTeamId);
        setTeams(prev => prev.map(team => team.id === selectedTeamId ? updatedTeam : team));
      } else {
        // Crear nuevo jugador
        const newPlayer = await teamService.createPlayer({
          ...data as CreatePlayerRequest,
          team_id: selectedTeamId
        });
        // Recargar el equipo para actualizar la lista de jugadores
        const updatedTeam = await teamService.getTeam(selectedTeamId);
        setTeams(prev => prev.map(team => team.id === selectedTeamId ? updatedTeam : team));
      }
      setShowPlayerModal(false);
      setEditingPlayer(null);
      setSelectedTeamId(null);
    } catch (err) {
      console.error('Error guardando jugador:', err);
      alert('Error al guardar el jugador');
    } finally {
      setPlayerLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl">Cargando equipos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <Button onClick={loadTeams}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipos</h1>
          <p className="text-gray-600 mt-2">Administra tus equipos y jugadores</p>
        </div>
        <Button onClick={() => setShowTeamModal(true)}>
          Crear Nuevo Equipo
        </Button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl mb-4">No tienes equipos creados</div>
          <p className="text-gray-400 mb-6">Comienza creando tu primer equipo</p>
          <Button onClick={() => setShowTeamModal(true)}>
            Crear Mi Primer Equipo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onUpdate={() => handleEditTeam(team)}
              onDelete={handleTeamDelete}
              onAddPlayer={handleAddPlayer}
              onEditPlayer={handleEditPlayer}
              onDeletePlayer={handleDeletePlayer}
            />
          ))}
        </div>
      )}

      {/* Modal para equipos */}
      <TeamModal
        isOpen={showTeamModal}
        onClose={() => {
          setShowTeamModal(false);
          setEditingTeam(null);
        }}
        onSubmit={handleTeamSubmit}
        team={editingTeam}
        loading={teamLoading}
      />

      {/* Modal para jugadores */}
      <PlayerModal
        isOpen={showPlayerModal}
        onClose={() => {
          setShowPlayerModal(false);
          setEditingPlayer(null);
          setSelectedTeamId(null);
        }}
        onSubmit={handlePlayerSubmit}
        player={editingPlayer}
        teamId={selectedTeamId || 0}
        loading={playerLoading}
      />
    </div>
  );
} 