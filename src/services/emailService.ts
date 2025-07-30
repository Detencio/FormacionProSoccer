import { Match, PlayerAttendance } from '@/types'

export interface EmailTemplate {
  subject: string
  body: string
  html?: string
}

export interface EmailRecipient {
  email: string
  name: string
  playerId?: string
}

export interface MatchReminder {
  matchId: string
  matchTitle: string
  matchDate: Date
  venue: string
  recipients: EmailRecipient[]
  type: 'invitation' | 'reminder' | 'confirmation' | 'cancellation'
}

class EmailService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  async sendMatchReminder(reminder: MatchReminder): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/email/send-reminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminder),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Email enviado exitosamente:', result)
      return true
    } catch (error) {
      console.error('❌ Error enviando email:', error)
      return false
    }
  }

  async sendBulkReminders(reminders: MatchReminder[]): Promise<{ success: number; failed: number }> {
    const results = await Promise.allSettled(
      reminders.map(reminder => this.sendMatchReminder(reminder))
    )

    const success = results.filter(result => result.status === 'fulfilled' && result.value).length
    const failed = results.length - success

    return { success, failed }
  }

  generateReminderTemplate(match: Match, type: 'invitation' | 'reminder' | 'confirmation' | 'cancellation'): EmailTemplate {
    const matchDate = new Date(match.date)
    const formattedDate = matchDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const venueInfo = `${match.venue.name} - ${match.venue.address}`

    switch (type) {
      case 'invitation':
        return {
          subject: `🎯 Invitación: ${match.title}`,
          body: `Hola,\n\nTe invitamos al partido "${match.title}" que se realizará el ${formattedDate} en ${venueInfo}.\n\nPor favor confirma tu asistencia respondiendo este email.\n\n¡Esperamos verte!\n\nSaludos,\nEquipo ProSoccer`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">🎯 Invitación al Partido</h2>
              <h3 style="color: #1f2937;">${match.title}</h3>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>📅 Fecha:</strong> ${formattedDate}</p>
                <p><strong>🏟️ Lugar:</strong> ${venueInfo}</p>
                <p><strong>⚽ Tipo:</strong> ${this.getMatchTypeText(match.type)}</p>
              </div>
              <p>Por favor confirma tu asistencia respondiendo este email.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Confirmar Asistencia</a>
              </div>
              <p style="color: #6b7280;">¡Esperamos verte!</p>
            </div>
          `
        }

      case 'reminder':
        return {
          subject: `⏰ Recordatorio: ${match.title}`,
          body: `Hola,\n\nTe recordamos que mañana tienes el partido "${match.title}" a las ${matchDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} en ${venueInfo}.\n\n¡No olvides confirmar tu asistencia!\n\nSaludos,\nEquipo ProSoccer`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f59e0b;">⏰ Recordatorio de Partido</h2>
              <h3 style="color: #1f2937;">${match.title}</h3>
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>📅 Mañana:</strong> ${formattedDate}</p>
                <p><strong>🏟️ Lugar:</strong> ${venueInfo}</p>
                <p><strong>⏰ Hora:</strong> ${matchDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <p>¡No olvides confirmar tu asistencia!</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Confirmar Ahora</a>
              </div>
            </div>
          `
        }

      case 'confirmation':
        return {
          subject: `✅ Confirmación: ${match.title}`,
          body: `Hola,\n\nTu asistencia al partido "${match.title}" ha sido confirmada.\n\nFecha: ${formattedDate}\nLugar: ${venueInfo}\n\n¡Nos vemos en el partido!\n\nSaludos,\nEquipo ProSoccer`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #059669;">✅ Asistencia Confirmada</h2>
              <h3 style="color: #1f2937;">${match.title}</h3>
              <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>📅 Fecha:</strong> ${formattedDate}</p>
                <p><strong>🏟️ Lugar:</strong> ${venueInfo}</p>
                <p><strong>✅ Estado:</strong> Confirmado</p>
              </div>
              <p>¡Nos vemos en el partido!</p>
            </div>
          `
        }

      case 'cancellation':
        return {
          subject: `❌ Cancelación: ${match.title}`,
          body: `Hola,\n\nEl partido "${match.title}" programado para el ${formattedDate} ha sido cancelado.\n\nTe avisaremos cuando se reprograme.\n\nDisculpa las molestias.\n\nSaludos,\nEquipo ProSoccer`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">❌ Partido Cancelado</h2>
              <h3 style="color: #1f2937;">${match.title}</h3>
              <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>📅 Fecha Original:</strong> ${formattedDate}</p>
                <p><strong>🏟️ Lugar:</strong> ${venueInfo}</p>
                <p><strong>❌ Estado:</strong> Cancelado</p>
              </div>
              <p>Te avisaremos cuando se reprograme.</p>
              <p style="color: #6b7280;">Disculpa las molestias.</p>
            </div>
          `
        }

      default:
        return {
          subject: `📢 Actualización: ${match.title}`,
          body: `Hola,\n\nTienes una actualización sobre el partido "${match.title}".\n\nFecha: ${formattedDate}\nLugar: ${venueInfo}\n\nSaludos,\nEquipo ProSoccer`
        }
    }
  }

  private getMatchTypeText(type: Match['type']): string {
    switch (type) {
      case 'internal_friendly':
        return 'Amistoso Interno'
      case 'external_friendly':
        return 'Amistoso Externo'
      case 'championship':
        return 'Campeonato'
      default:
        return 'Partido'
    }
  }

  async scheduleReminders(match: Match): Promise<void> {
    const matchDate = new Date(match.date)
    const now = new Date()
    const hoursUntilMatch = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    // Recordatorio 24 horas antes
    if (hoursUntilMatch > 24) {
      const reminder24h = {
        matchId: match.id,
        matchTitle: match.title,
        matchDate: matchDate,
        venue: `${match.venue.name} - ${match.venue.address}`,
        recipients: this.getMatchRecipients(match),
        type: 'reminder' as const
      }

      // Programar para enviar en 24 horas
      setTimeout(() => {
        this.sendMatchReminder(reminder24h)
      }, (hoursUntilMatch - 24) * 60 * 60 * 1000)
    }

    // Recordatorio 2 horas antes
    if (hoursUntilMatch > 2) {
      const reminder2h = {
        matchId: match.id,
        matchTitle: match.title,
        matchDate: matchDate,
        venue: `${match.venue.name} - ${match.venue.address}`,
        recipients: this.getMatchRecipients(match),
        type: 'reminder' as const
      }

      // Programar para enviar en 2 horas
      setTimeout(() => {
        this.sendMatchReminder(reminder2h)
      }, (hoursUntilMatch - 2) * 60 * 60 * 1000)
    }
  }

  private getMatchRecipients(match: Match): EmailRecipient[] {
    if (!match.attendance) return []

    return match.attendance
      .filter(attendance => attendance.player && attendance.player.email)
      .map(attendance => ({
        email: attendance.player.email,
        name: attendance.player.name,
        playerId: attendance.playerId
      }))
  }
}

export const emailService = new EmailService() 