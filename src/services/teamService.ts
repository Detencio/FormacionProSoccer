import api from '@/lib/api';

export interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  team_id: number;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  players: Player[];
}

export interface CreateTeamRequest {
  name: string;
  description: string;
}

export interface CreatePlayerRequest {
  name: string;
  position: string;
  age: number;
  team_id: number;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface UpdatePlayerRequest {
  name?: string;
  position?: string;
  age?: number;
}

// Datos simulados para pruebas
const mockTeams: Team[] = [
  {
    id: 1,
    name: "Real Madrid",
    description: "Equipo de fútbol profesional",
    user_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    players: [
      {
        id: 1,
        name: "Cristiano Ronaldo",
        position: "Delantero Centro",
        age: 25,
        team_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "Luka Modric",
        position: "Mediocentro",
        age: 28,
        team_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 2,
    name: "Barcelona FC",
    description: "Club de fútbol catalán",
    user_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    players: [
      {
        id: 3,
        name: "Lionel Messi",
        position: "Extremo Derecho",
        age: 26,
        team_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }
];

class TeamService {
  // Obtener todos los equipos del usuario
  async getTeams(): Promise<Team[]> {
    try {
      const response = await api.get('/teams/');
      return response.data;
    } catch (error) {
      console.log('Backend no disponible, usando datos simulados');
      return mockTeams;
    }
  }

  // Obtener un equipo específico
  async getTeam(teamId: number): Promise<Team> {
    try {
      const response = await api.get(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      const team = mockTeams.find(t => t.id === teamId);
      if (team) return team;
      throw new Error('Equipo no encontrado');
    }
  }

  // Crear un nuevo equipo
  async createTeam(teamData: CreateTeamRequest): Promise<Team> {
    try {
      const response = await api.post('/teams/', teamData);
      return response.data;
    } catch (error) {
      // Simular creación
      const newTeam: Team = {
        id: Date.now(),
        ...teamData,
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        players: []
      };
      mockTeams.push(newTeam);
      return newTeam;
    }
  }

  // Actualizar un equipo
  async updateTeam(teamId: number, teamData: UpdateTeamRequest): Promise<Team> {
    try {
      const response = await api.put(`/teams/${teamId}`, teamData);
      return response.data;
    } catch (error) {
      const teamIndex = mockTeams.findIndex(t => t.id === teamId);
      if (teamIndex !== -1) {
        mockTeams[teamIndex] = { ...mockTeams[teamIndex], ...teamData };
        return mockTeams[teamIndex];
      }
      throw new Error('Equipo no encontrado');
    }
  }

  // Eliminar un equipo
  async deleteTeam(teamId: number): Promise<void> {
    try {
      await api.delete(`/teams/${teamId}`);
    } catch (error) {
      const teamIndex = mockTeams.findIndex(t => t.id === teamId);
      if (teamIndex !== -1) {
        mockTeams.splice(teamIndex, 1);
      }
    }
  }

  // Obtener jugadores de un equipo
  async getTeamPlayers(teamId: number): Promise<Player[]> {
    try {
      const response = await api.get(`/teams/${teamId}/players`);
      return response.data;
    } catch (error) {
      const team = mockTeams.find(t => t.id === teamId);
      return team ? team.players : [];
    }
  }

  // Crear un nuevo jugador
  async createPlayer(playerData: CreatePlayerRequest): Promise<Player> {
    try {
      const response = await api.post('/players/', playerData);
      return response.data;
    } catch (error) {
      // Simular creación
      const newPlayer: Player = {
        id: Date.now(),
        ...playerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const team = mockTeams.find(t => t.id === playerData.team_id);
      if (team) {
        team.players.push(newPlayer);
      }
      
      return newPlayer;
    }
  }

  // Actualizar un jugador
  async updatePlayer(playerId: number, playerData: UpdatePlayerRequest): Promise<Player> {
    try {
      const response = await api.put(`/players/${playerId}`, playerData);
      return response.data;
    } catch (error) {
      // Buscar jugador en equipos simulados
      for (const team of mockTeams) {
        const playerIndex = team.players.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
          team.players[playerIndex] = { ...team.players[playerIndex], ...playerData };
          return team.players[playerIndex];
        }
      }
      throw new Error('Jugador no encontrado');
    }
  }

  // Eliminar un jugador
  async deletePlayer(playerId: number): Promise<void> {
    try {
      await api.delete(`/players/${playerId}`);
    } catch (error) {
      // Buscar y eliminar jugador en equipos simulados
      for (const team of mockTeams) {
        const playerIndex = team.players.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
          team.players.splice(playerIndex, 1);
          break;
        }
      }
    }
  }
}

export const teamService = new TeamService(); 