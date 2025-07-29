import api from '@/lib/api'
import { Match, Championship, ExternalTeam, PlayerAttendance, MatchEvent } from '@/types'

export interface CreateMatchData {
  title: string
  description?: string
  date: Date
  venueId?: number
  matchType: string
  homeTeamId?: number
  awayTeamId?: number
  generatedTeamAId?: number
  generatedTeamBId?: number
  status?: string
  homeScore?: number
  awayScore?: number
}

export interface UpdateMatchData {
  title?: string
  description?: string
  date?: Date
  venueId?: number
  matchType?: string
  homeTeamId?: number
  awayTeamId?: number
  generatedTeamAId?: number
  generatedTeamBId?: number
  status?: string
  homeScore?: number
  awayScore?: number
}

export interface CreateAttendanceData {
  matchId: number
  playerId: number
  status: string
  notes?: string
}

export interface UpdateAttendanceData {
  status?: string
  notes?: string
}

export interface CreateEventData {
  matchId: number
  playerId: number
  eventType: string
  minute: number
  teamSide: string
  description?: string
}

class MatchService {
  // Partidos
  async getMatches(params?: {
    skip?: number
    limit?: number
    matchType?: string
    status?: string
  }): Promise<Match[]> {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.matchType) queryParams.append('match_type', params.matchType)
    if (params?.status) queryParams.append('status', params.status)

    const response = await api.get(`/matches/?${queryParams}`)
    return response.data
  }

  async getMatch(id: number): Promise<Match> {
    const response = await api.get(`/matches/${id}`)
    return response.data
  }

  async createMatch(data: CreateMatchData): Promise<Match> {
    const response = await api.post('/matches/', {
      ...data,
      created_by: 1 // TODO: Obtener del usuario actual
    })
    return response.data
  }

  async updateMatch(id: number, data: UpdateMatchData): Promise<Match> {
    const response = await api.put(`/matches/${id}`, data)
    return response.data
  }

  async deleteMatch(id: number): Promise<void> {
    await api.delete(`/matches/${id}`)
  }

  // Asistencia
  async getMatchAttendance(matchId: number): Promise<PlayerAttendance[]> {
    const response = await api.get(`/matches/${matchId}/attendance/`)
    return response.data
  }

  async createPlayerAttendance(data: CreateAttendanceData): Promise<PlayerAttendance> {
    const response = await api.post(`/matches/${data.matchId}/attendance/`, data)
    return response.data
  }

  async updatePlayerAttendance(attendanceId: number, data: UpdateAttendanceData): Promise<PlayerAttendance> {
    const response = await api.put(`/attendance/${attendanceId}`, data)
    return response.data
  }

  async getConfirmedPlayers(matchId: number): Promise<any[]> {
    const response = await api.get(`/matches/${matchId}/confirmed-players/`)
    return response.data
  }

  // Eventos
  async getMatchEvents(matchId: number): Promise<MatchEvent[]> {
    const response = await api.get(`/matches/${matchId}/events/`)
    return response.data
  }

  async createMatchEvent(data: CreateEventData): Promise<MatchEvent> {
    const response = await api.post(`/matches/${data.matchId}/events/`, data)
    return response.data
  }

  // Canchas
  async getVenues(): Promise<any[]> {
    const response = await api.get('/venues/')
    return response.data
  }

  async createVenue(data: any): Promise<any> {
    const response = await api.post('/venues/', data)
    return response.data
  }

  // Campeonatos
  async getChampionships(params?: {
    skip?: number
    limit?: number
    status?: string
  }): Promise<Championship[]> {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)

    const response = await api.get(`/championships/?${queryParams}`)
    return response.data
  }

  async getChampionship(id: number): Promise<Championship> {
    const response = await api.get(`/championships/${id}`)
    return response.data
  }

  async createChampionship(data: any): Promise<Championship> {
    const response = await api.post('/championships/', data)
    return response.data
  }

  async getChampionshipStandings(championshipId: number): Promise<any[]> {
    const response = await api.get(`/championships/${championshipId}/standings/`)
    return response.data
  }

  // Equipos Externos
  async getExternalTeams(params?: {
    skip?: number
    limit?: number
  }): Promise<ExternalTeam[]> {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await api.get(`/external-teams/?${queryParams}`)
    return response.data
  }

  async getExternalTeam(id: number): Promise<ExternalTeam> {
    const response = await api.get(`/external-teams/${id}`)
    return response.data
  }

  async createExternalTeam(data: any): Promise<ExternalTeam> {
    const response = await api.post('/external-teams/', data)
    return response.data
  }

  // Notificaciones
  async getNotifications(unreadOnly?: boolean): Promise<any[]> {
    const queryParams = new URLSearchParams()
    if (unreadOnly) queryParams.append('unread_only', 'true')

    const response = await api.get(`/notifications/?${queryParams}`)
    return response.data
  }

  async createNotification(data: any): Promise<any> {
    const response = await api.post('/notifications/', data)
    return response.data
  }

  async markNotificationAsRead(id: number): Promise<any> {
    const response = await api.put(`/notifications/${id}/read`)
    return response.data
  }

  // Integración con Team Generator
  async getAvailablePlayersForMatch(matchId: number, teamId?: number): Promise<any[]> {
    const queryParams = new URLSearchParams()
    if (teamId) queryParams.append('team_id', teamId.toString())

    const response = await api.get(`/matches/${matchId}/available-players/?${queryParams}`)
    return response.data
  }

  async generateTeamsForMatch(
    matchId: number,
    teamAPlayers: number[],
    teamBPlayers: number[]
  ): Promise<Match> {
    const response = await api.post(`/matches/${matchId}/generate-teams/`, {
      team_a_players: teamAPlayers,
      team_b_players: teamBPlayers
    })
    return response.data
  }
}

export const matchService = new MatchService() 