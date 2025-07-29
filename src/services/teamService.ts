import api from '@/lib/api';

export interface PositionZone {
  id: number;
  abbreviation: string;
  name_es: string;
  name_en: string;
  is_active: boolean;
  created_at: string;
}

export interface PositionSpecific {
  id: number;
  abbreviation: string;
  name_es: string;
  name_en: string;
  zone_id: number;
  description_es?: string;
  description_en?: string;
  is_active: boolean;
  created_at: string;
  zone: PositionZone;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  phone?: string;
  is_admin: boolean;
  is_player: boolean;
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  city?: string;
  country?: string;
  founded?: number;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at?: string;
  players?: Player[];
}

export interface Player {
  id: number;
  user_id: number;
  team_id?: number;
  position_zone_id: number;
  position_specific_id?: number;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  jersey_number?: number;
  height?: number;
  weight?: number;
  skill_level: number;
  photo_url?: string; // URL de la foto del jugador
  // Habilidades específicas
  rit?: number;
  tir?: number;
  pas?: number;
  reg?: number;
  defense?: number;
  fis?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  position_zone?: PositionZone;
  position_specific?: PositionSpecific;
  team?: Team;
  user?: User;
}

export interface CreateTeamRequest {
  name: string;
  city?: string;
  country?: string;
  founded?: number;
  description?: string;
  logo_url?: string;
}

export interface CreatePlayerRequest {
  user_id: number;
  team_id: number;
  position_zone_id: number;
  position_specific_id?: number;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  jersey_number?: number;
  height?: number;
  weight?: number;
  skill_level: number;
  photo_url?: string; // URL de la foto del jugador
  // Habilidades específicas
  rit?: number;
  tir?: number;
  pas?: number;
  reg?: number;
  defense?: number;
  fis?: number;
  is_active?: boolean;
}

export interface UpdateTeamRequest {
  name?: string;
  city?: string;
  country?: string;
  founded?: number;
  description?: string;
  logo_url?: string;
}

export interface UpdatePlayerRequest {
  name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  position_zone_id?: number;
  position_specific_id?: number;
  jersey_number?: number;
  height?: number;
  weight?: number;
  skill_level?: number;
  photo_url?: string; // URL de la foto del jugador
  // Habilidades específicas
  rit?: number;
  tir?: number;
  pas?: number;
  reg?: number;
  defense?: number;
  fis?: number;
  is_active?: boolean;
}

// Datos simulados para pruebas - ELIMINADOS
// Ahora el servicio usa solo datos reales del backend

class TeamService {
  // Obtener todos los equipos del usuario
  async getTeams(): Promise<Team[]> {
    try {
      // Primero obtener la lista de equipos
      const teamsResponse = await api.get('/teams/');
      const teams = teamsResponse.data;
      
      // Para cada equipo, obtener sus jugadores
      const teamsWithPlayers = await Promise.all(
        teams.map(async (team: any) => {
          try {
            const teamResponse = await api.get(`/teams/${team.id}`);
            return teamResponse.data;
          } catch (error) {
            console.error(`Error obteniendo jugadores del equipo ${team.id}:`, error);
            // Si no se pueden obtener los jugadores, devolver el equipo sin jugadores
            return {
              ...team,
              players: []
            };
          }
        })
      );
      
      return teamsWithPlayers;
    } catch (error) {
      console.error('Error obteniendo equipos del backend:', error);
      // En lugar de usar datos mock, devolver un array vacío
      return [];
    }
  }

  // Obtener un equipo específico
  async getTeam(teamId: number): Promise<Team> {
    try {
      const response = await api.get(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo equipo del backend:', error);
      throw new Error('Equipo no encontrado');
    }
  }

  // Crear un nuevo equipo
  async createTeam(teamData: CreateTeamRequest): Promise<Team> {
    try {
      const response = await api.post('/teams/', teamData);
      return response.data;
    } catch (error) {
      console.error('Error creando equipo en el backend:', error);
      throw new Error('Error al crear equipo');
    }
  }

  // Actualizar un equipo
  async updateTeam(teamId: number, teamData: UpdateTeamRequest): Promise<Team> {
    try {
      const response = await api.put(`/teams/${teamId}`, teamData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando equipo en el backend:', error);
      throw new Error('Error al actualizar equipo');
    }
  }

  // Eliminar un equipo
  async deleteTeam(teamId: number): Promise<void> {
    try {
      await api.delete(`/teams/${teamId}`);
    } catch (error) {
      console.error('Error eliminando equipo en el backend:', error);
      throw new Error('Error al eliminar equipo');
    }
  }

  // Obtener jugadores de un equipo
  async getTeamPlayers(teamId: number): Promise<Player[]> {
    try {
      const response = await api.get(`/teams/${teamId}`);
      return response.data.players || [];
    } catch (error) {
      console.error('Error obteniendo jugadores del equipo del backend:', error);
      return [];
    }
  }

  // Crear un nuevo jugador
  async createPlayer(playerData: CreatePlayerRequest): Promise<Player> {
    try {
      const response = await api.post('/players/', playerData);
      return response.data;
    } catch (error) {
      console.error('Error creando jugador en el backend:', error);
      throw new Error('Error al crear jugador');
    }
  }

  // Actualizar un jugador
  async updatePlayer(playerId: number, playerData: UpdatePlayerRequest): Promise<Player> {
    try {
      console.log('🔍 DEBUG - Datos enviados al backend:', {
        playerId,
        playerData,
        photo_url: playerData.photo_url
      });
      
      // Log detallado de cada campo
      console.log('🔍 DEBUG - Campos específicos:', {
        name: playerData.name,
        email: playerData.email,
        phone: playerData.phone,
        date_of_birth: playerData.date_of_birth,
        nationality: playerData.nationality,
        position_zone_id: playerData.position_zone_id,
        position_specific_id: playerData.position_specific_id,
        jersey_number: playerData.jersey_number,
        skill_level: playerData.skill_level,
        height: playerData.height,
        weight: playerData.weight,
        photo_url: playerData.photo_url,
        is_active: playerData.is_active
      });
      
      const response = await api.put(`/players/${playerId}`, playerData);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error actualizando jugador en el backend:', error);
      console.error('🔍 DEBUG - Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Log del error completo si está disponible
      if (error.response?.data) {
        console.error('🔍 DEBUG - Error response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      throw new Error('Error al actualizar jugador');
    }
  }

  // Eliminar un jugador
  async deletePlayer(playerId: number): Promise<void> {
    try {
      await api.delete(`/players/${playerId}`);
    } catch (error) {
      console.error('Error eliminando jugador en el backend:', error);
      throw new Error('Error al eliminar jugador');
    }
  }
}

export const teamService = new TeamService(); 