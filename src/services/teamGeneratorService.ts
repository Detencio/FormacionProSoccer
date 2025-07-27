import api from '@/lib/api'
import { Player } from '@/types'

export interface TeamGeneratorResponse {
  players: Player[]
  success: boolean
  message?: string
}

class TeamGeneratorService {
  // Obtener todos los jugadores para el Team-Generator
  async getPlayers(teamId?: number): Promise<Player[]> {
    try {
      const params = teamId ? { team_id: teamId } : {}
      const response = await api.get('/team-generator/players/', { params })
      return response.data
    } catch (error: any) {
      console.error('Error fetching players for team generator:', error)
      throw new Error('Error al obtener jugadores del servidor')
    }
  }

  // Obtener jugadores por equipo
  async getPlayersByTeam(teamId: number): Promise<Player[]> {
    try {
      const response = await api.get(`/teams/${teamId}`)
      return response.data.players || []
    } catch (error: any) {
      console.error('Error fetching players by team:', error)
      throw new Error('Error al obtener jugadores del equipo')
    }
  }

  // Obtener todos los equipos
  async getTeams(): Promise<any[]> {
    try {
      const response = await api.get('/team-generator/teams/')
      return response.data
    } catch (error: any) {
      console.error('Error fetching teams:', error)
      throw new Error('Error al obtener equipos')
    }
  }

  // Convertir jugador del backend al formato del frontend
  convertBackendPlayerToFrontend(backendPlayer: any): Player {
    return {
      id: backendPlayer.id,
      user_id: backendPlayer.user_id,
      team_id: backendPlayer.team_id,
      position_zone_id: backendPlayer.position_zone_id,
      position_specific_id: backendPlayer.position_specific_id,
      name: backendPlayer.name,
      email: backendPlayer.email,
      phone: backendPlayer.phone,
      date_of_birth: backendPlayer.date_of_birth,
      nationality: backendPlayer.nationality,
      jersey_number: backendPlayer.jersey_number,
      height: backendPlayer.height,
      weight: backendPlayer.weight,
      skill_level: backendPlayer.skill_level,
      is_active: backendPlayer.is_active,
      created_at: backendPlayer.created_at,
      updated_at: backendPlayer.updated_at,
      position_zone: backendPlayer.position_zone,
      position_specific: backendPlayer.position_specific,
      team: backendPlayer.team,
      user: backendPlayer.user
    }
  }
}

export const teamGeneratorService = new TeamGeneratorService() 