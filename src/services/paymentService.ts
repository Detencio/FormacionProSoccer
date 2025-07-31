import api from '@/lib/api'

export interface Payment {
  id: number
  playerName: string
  playerId: number
  teamId: number
  teamName: string
  amount: number
  date: string
  dueDate: string
  status: 'pagado' | 'pendiente' | 'vencido' | 'cancelado'
  method: 'transferencia' | 'efectivo' | 'tarjeta' | 'otro'
  description: string
  notes?: string
  receiptUrl?: string
  month?: string // YYYY-MM
  isRecurring?: boolean
  notificationSent?: boolean
}

export interface PaymentFilters {
  status?: string
  teamId?: number
  search?: string
  startDate?: string
  endDate?: string
  month?: string
  playerId?: number
}

export interface PaymentStats {
  total: number
  paid: number
  pending: number
  overdue: number
  canceled: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  overdueAmount: number
  canceledAmount: number
  monthlyStats?: MonthlyStats[]
}

export interface MonthlyStats {
  month: string
  total: number
  paid: number
  pending: number
  overdue: number
  amount: number
}

export interface PlayerPaymentHistory {
  playerId: number
  playerName: string
  teamName: string
  monthlyPayments: {
    month: string
    status: 'pagado' | 'pendiente' | 'vencido' | 'cancelado'
    amount: number
    dueDate: string
    paidDate?: string
  }[]
  totalPaid: number
  totalPending: number
  totalOverdue: number
}

export interface PaymentNotification {
  id: number
  playerId: number
  playerName: string
  type: 'payment_due' | 'payment_overdue' | 'payment_received' | 'payment_reminder'
  message: string
  date: string
  read: boolean
  paymentId?: number
}

class PaymentService {
  // Obtener pagos desde la API
  private async getPaymentsFromAPI(): Promise<Payment[]> {
    try {
      // TODO: Implementar cuando el backend esté listo
      // const response = await api.get('/payments')
      // return response.data?.data || []
      console.log('Cargando pagos desde API (pendiente de implementación)')
      return []
    } catch (error) {
      console.error('Error cargando pagos desde API:', error)
      return []
    }
  }

  // Guardar pagos en la API
  private async savePaymentsToAPI(payments: Payment[]): Promise<void> {
    try {
      // TODO: Implementar cuando el backend esté listo
      // await api.post('/payments', { payments })
      console.log('Guardando pagos en API (pendiente de implementación):', payments)
    } catch (error) {
      console.error('Error guardando pagos en API:', error)
    }
  }

  // Obtener notificaciones desde la API
  private async getNotificationsFromAPI(): Promise<PaymentNotification[]> {
    try {
      // TODO: Implementar cuando el backend esté listo
      // const response = await api.get('/payment-notifications')
      // return response.data?.data || []
      console.log('Cargando notificaciones desde API (pendiente de implementación)')
      return []
    } catch (error) {
      console.error('Error cargando notificaciones desde API:', error)
      return []
    }
  }

  // Guardar notificaciones en la API
  private async saveNotificationsToAPI(notifications: PaymentNotification[]): Promise<void> {
    try {
      // TODO: Implementar cuando el backend esté listo
      // await api.post('/payment-notifications', { notifications })
      console.log('Guardando notificaciones en API (pendiente de implementación):', notifications)
    } catch (error) {
      console.error('Error guardando notificaciones en API:', error)
    }
  }

  // Obtener equipos desde la API
  private async getTeamsFromAPI(): Promise<any[]> {
    try {
      const response = await api.get('/teams')
      return response.data?.data || []
    } catch (error) {
      console.error('Error cargando equipos desde API:', error)
      return []
    }
  }

  // Generar cuotas mensuales para todos los jugadores
  async generateMonthlyPayments(month: string, amount: number = 50000): Promise<Payment[]> {
    const teams = await this.getTeamsFromAPI()
    const existingPayments = await this.getPaymentsFromAPI()
    
    const newPayments: Payment[] = []
    
    teams.forEach((team: any) => {
      team.players?.forEach((player: any) => {
        // Verificar si ya existe un pago para este jugador en este mes
        const existingPayment = existingPayments.find(p => 
          p.playerId === player.id && p.month === month
        )
        
        if (!existingPayment) {
          const dueDate = new Date(month + '-10') // Vence el día 10 de cada mes
          
          const newPayment: Payment = {
            id: Date.now() + Math.random(),
            playerName: player.name,
            playerId: player.id,
            teamId: team.id,
            teamName: team.name,
            amount,
            date: '',
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'pendiente',
            method: 'efectivo',
            description: `Cuota mensual ${month}`,
            month,
            isRecurring: true,
            notificationSent: false
          }
          
          newPayments.push(newPayment)
        }
      })
    })
    
    if (newPayments.length > 0) {
      const updatedPayments = [...existingPayments, ...newPayments]
      await this.savePaymentsToAPI(updatedPayments)
      
      // Crear notificaciones para pagos pendientes
      await this.createPaymentNotifications(newPayments)
    }
    
    return newPayments
  }

  // Generar cuotas mensuales para equipos específicos
  async generateMonthlyPaymentsForTeams(month: string, amount: number = 50000, selectedTeams: any[]): Promise<Payment[]> {
    const existingPayments = await this.getPaymentsFromAPI()
    
    const newPayments: Payment[] = []
    
    selectedTeams.forEach((team: any) => {
      team.players?.forEach((player: any) => {
        // Verificar si ya existe un pago para este jugador en este mes
        const existingPayment = existingPayments.find(p => 
          p.playerId === player.id && p.month === month
        )
        
        if (!existingPayment) {
          const dueDate = new Date(month + '-10')
          
          const newPayment: Payment = {
            id: Date.now() + Math.random(),
            playerName: player.name,
            playerId: player.id,
            teamId: team.id,
            teamName: team.name,
            amount,
            date: '',
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'pendiente',
            method: 'efectivo',
            description: `Cuota mensual ${month}`,
            month,
            isRecurring: true,
            notificationSent: false
          }
          
          newPayments.push(newPayment)
        }
      })
    })
    
    if (newPayments.length > 0) {
      const updatedPayments = [...existingPayments, ...newPayments]
      await this.savePaymentsToAPI(updatedPayments)
      
      await this.createPaymentNotifications(newPayments)
    }
    
    return newPayments
  }

  // Crear notificaciones para pagos pendientes
  private async createPaymentNotifications(payments: Payment[]): Promise<void> {
    const notifications: PaymentNotification[] = payments.map(payment => ({
      id: Date.now() + Math.random(),
      playerId: payment.playerId,
      playerName: payment.playerName,
      type: 'payment_due',
      message: `Tienes un pago pendiente de $${this.formatCurrency(payment.amount)} para ${payment.month}`,
      date: new Date().toISOString(),
      read: false,
      paymentId: payment.id
    }))
    
    const existingNotifications = await this.getNotificationsFromAPI()
    const updatedNotifications = [...existingNotifications, ...notifications]
    await this.saveNotificationsToAPI(updatedNotifications)
  }

  // Obtener historial de pagos de un jugador
  async getPlayerPaymentHistory(playerId: number): Promise<PlayerPaymentHistory | null> {
    try {
      const payments = await this.getPaymentsFromAPI()
      const playerPayments = payments.filter(p => p.playerId === playerId)
      
      if (playerPayments.length === 0) return null
      
      const monthlyPayments = playerPayments.map(p => ({
        month: p.month || '',
        status: p.status,
        amount: p.amount,
        dueDate: p.dueDate,
        paidDate: p.status === 'pagado' ? p.date : undefined
      }))
      
      const totalPaid = playerPayments
        .filter(p => p.status === 'pagado')
        .reduce((sum, p) => sum + p.amount, 0)
      
      const totalPending = playerPayments
        .filter(p => p.status === 'pendiente')
        .reduce((sum, p) => sum + p.amount, 0)
      
      const totalOverdue = playerPayments
        .filter(p => p.status === 'vencido')
        .reduce((sum, p) => sum + p.amount, 0)
      
      return {
        playerId,
        playerName: playerPayments[0]?.playerName || '',
        teamName: playerPayments[0]?.teamName || '',
        monthlyPayments,
        totalPaid,
        totalPending,
        totalOverdue
      }
    } catch (error) {
      console.error('Error obteniendo historial de pagos:', error)
      return null
    }
  }

  // Obtener estadísticas mensuales
  async getMonthlyStats(): Promise<MonthlyStats[]> {
    try {
      const payments = await this.getPaymentsFromAPI()
      const monthlyStats: { [key: string]: MonthlyStats } = {}
      
      payments.forEach(payment => {
        const month = payment.month || 'Sin mes'
        if (!monthlyStats[month]) {
          monthlyStats[month] = {
            month,
            total: 0,
            paid: 0,
            pending: 0,
            overdue: 0,
            amount: 0
          }
        }
        
        monthlyStats[month].total++
        monthlyStats[month].amount += payment.amount
        
        switch (payment.status) {
          case 'pagado':
            monthlyStats[month].paid++
            break
          case 'pendiente':
            monthlyStats[month].pending++
            break
          case 'vencido':
            monthlyStats[month].overdue++
            break
        }
      })
      
      return Object.values(monthlyStats).sort((a, b) => b.month.localeCompare(a.month))
    } catch (error) {
      console.error('Error obteniendo estadísticas mensuales:', error)
      return []
    }
  }

  // Obtener notificaciones
  async getNotifications(playerId?: number): Promise<PaymentNotification[]> {
    try {
      const notifications = await this.getNotificationsFromAPI()
      return playerId ? notifications.filter(n => n.playerId === playerId) : notifications
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error)
      return []
    }
  }

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      const notifications = await this.getNotificationsFromAPI()
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
      await this.saveNotificationsToAPI(updatedNotifications)
    } catch (error) {
      console.error('Error marcando notificación como leída:', error)
    }
  }

  // Obtener pagos vencidos que necesitan notificación
  async getOverduePaymentsNeedingNotification(): Promise<Payment[]> {
    try {
      const payments = await this.getPaymentsFromAPI()
      const today = new Date()
      
      return payments.filter(payment => {
        const dueDate = new Date(payment.dueDate)
        return payment.status === 'pendiente' && 
               dueDate < today && 
               !payment.notificationSent
      })
    } catch (error) {
      console.error('Error obteniendo pagos vencidos:', error)
      return []
    }
  }

  // Enviar notificaciones de pagos vencidos
  async sendOverdueNotifications(): Promise<void> {
    try {
      const overduePayments = await this.getOverduePaymentsNeedingNotification()
      
      for (const payment of overduePayments) {
        const notification: PaymentNotification = {
          id: Date.now() + Math.random(),
          playerId: payment.playerId,
          playerName: payment.playerName,
          type: 'payment_overdue',
          message: `Tu pago de $${this.formatCurrency(payment.amount)} está vencido desde ${payment.dueDate}`,
          date: new Date().toISOString(),
          read: false,
          paymentId: payment.id
        }
        
        const notifications = await this.getNotificationsFromAPI()
        const updatedNotifications = [...notifications, notification]
        await this.saveNotificationsToAPI(updatedNotifications)
        
        // Marcar el pago como notificado
        const payments = await this.getPaymentsFromAPI()
        const updatedPayments = payments.map(p => 
          p.id === payment.id ? { ...p, notificationSent: true } : p
        )
        await this.savePaymentsToAPI(updatedPayments)
      }
    } catch (error) {
      console.error('Error enviando notificaciones de pagos vencidos:', error)
    }
  }

  // Formatear moneda
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  // Obtener pagos con filtros
  async getPayments(filters?: PaymentFilters): Promise<Payment[]> {
    try {
      const payments = await this.getPaymentsFromAPI()
      
      if (!filters) return payments
      
      return payments.filter(payment => {
        if (filters.status && payment.status !== filters.status) return false
        if (filters.teamId && payment.teamId !== filters.teamId) return false
        if (filters.playerId && payment.playerId !== filters.playerId) return false
        if (filters.month && payment.month !== filters.month) return false
        if (filters.search) {
          const search = filters.search.toLowerCase()
          if (!payment.playerName.toLowerCase().includes(search) &&
              !payment.teamName.toLowerCase().includes(search)) {
            return false
          }
        }
        if (filters.startDate && payment.date < filters.startDate) return false
        if (filters.endDate && payment.date > filters.endDate) return false
        
        return true
      })
    } catch (error) {
      console.error('Error obteniendo pagos:', error)
      return []
    }
  }

  // Crear nuevo pago
  async createPayment(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
    try {
      const newPayment: Payment = {
        ...paymentData,
        id: Date.now() + Math.random()
      }
      
      const payments = await this.getPaymentsFromAPI()
      const updatedPayments = [...payments, newPayment]
      await this.savePaymentsToAPI(updatedPayments)
      
      // Crear notificación de pago recibido
      await this.createPaymentReceivedNotification(newPayment)
      
      return newPayment
    } catch (error) {
      console.error('Error creando pago:', error)
      throw error
    }
  }

  // Crear notificación de pago recibido
  private async createPaymentReceivedNotification(payment: Payment): Promise<void> {
    const notification: PaymentNotification = {
      id: Date.now() + Math.random(),
      playerId: payment.playerId,
      playerName: payment.playerName,
      type: 'payment_received',
      message: `Pago recibido de $${this.formatCurrency(payment.amount)}`,
      date: new Date().toISOString(),
      read: false,
      paymentId: payment.id
    }
    
    const notifications = await this.getNotificationsFromAPI()
    const updatedNotifications = [...notifications, notification]
    await this.saveNotificationsToAPI(updatedNotifications)
  }

  // Actualizar pago
  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment> {
    try {
      const payments = await this.getPaymentsFromAPI()
      const updatedPayments = payments.map(p => 
        p.id === id ? { ...p, ...paymentData } : p
      )
      await this.savePaymentsToAPI(updatedPayments)
      
      const updatedPayment = updatedPayments.find(p => p.id === id)
      if (!updatedPayment) throw new Error('Pago no encontrado')
      
      return updatedPayment
    } catch (error) {
      console.error('Error actualizando pago:', error)
      throw error
    }
  }

  // Eliminar pago
  async deletePayment(id: number): Promise<void> {
    try {
      const payments = await this.getPaymentsFromAPI()
      const filteredPayments = payments.filter(p => p.id !== id)
      await this.savePaymentsToAPI(filteredPayments)
    } catch (error) {
      console.error('Error eliminando pago:', error)
      throw error
    }
  }

  // Obtener estadísticas de pagos
  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const payments = await this.getPaymentsFromAPI()
      
      const stats: PaymentStats = {
        total: payments.length,
        paid: 0,
        pending: 0,
        overdue: 0,
        canceled: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        canceledAmount: 0
      }
      
      payments.forEach(payment => {
        stats.totalAmount += payment.amount
        
        switch (payment.status) {
          case 'pagado':
            stats.paid++
            stats.paidAmount += payment.amount
            break
          case 'pendiente':
            stats.pending++
            stats.pendingAmount += payment.amount
            break
          case 'vencido':
            stats.overdue++
            stats.overdueAmount += payment.amount
            break
          case 'cancelado':
            stats.canceled++
            stats.canceledAmount += payment.amount
            break
        }
      })
      
      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas de pagos:', error)
      return {
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
        canceled: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        canceledAmount: 0
      }
    }
  }

  // Obtener pagos vencidos
  async getOverduePayments(): Promise<Payment[]> {
    try {
      const payments = await this.getPaymentsFromAPI()
      const today = new Date()
      
      return payments.filter(payment => {
        const dueDate = new Date(payment.dueDate)
        return payment.status === 'pendiente' && dueDate < today
      })
    } catch (error) {
      console.error('Error obteniendo pagos vencidos:', error)
      return []
    }
  }

  // Marcar como pagado
  async markAsPaid(id: number): Promise<Payment> {
    try {
      return await this.updatePayment(id, { 
        status: 'pagado', 
        date: new Date().toISOString().split('T')[0] 
      })
    } catch (error) {
      console.error('Error marcando pago como pagado:', error)
      throw error
    }
  }

  // Generar reporte de pagos
  async generatePaymentReport(filters?: PaymentFilters): Promise<string> {
    try {
      const payments = await this.getPayments(filters)
      const stats = await this.getPaymentStats()
      
      let report = '=== REPORTE DE PAGOS ===\n\n'
      report += `Total de pagos: ${stats.total}\n`
      report += `Pagados: ${stats.paid}\n`
      report += `Pendientes: ${stats.pending}\n`
      report += `Vencidos: ${stats.overdue}\n`
      report += `Cancelados: ${stats.canceled}\n\n`
      report += `Monto total: ${this.formatCurrency(stats.totalAmount)}\n`
      report += `Monto pagado: ${this.formatCurrency(stats.paidAmount)}\n`
      report += `Monto pendiente: ${this.formatCurrency(stats.pendingAmount)}\n`
      report += `Monto vencido: ${this.formatCurrency(stats.overdueAmount)}\n\n`
      
      report += '=== DETALLE DE PAGOS ===\n\n'
      payments.forEach(payment => {
        report += `${payment.playerName} - ${payment.teamName}\n`
        report += `  Monto: ${this.formatCurrency(payment.amount)}\n`
        report += `  Estado: ${payment.status}\n`
        report += `  Fecha de vencimiento: ${payment.dueDate}\n`
        report += `  Método: ${payment.method}\n\n`
      })
      
      return report
    } catch (error) {
      console.error('Error generando reporte de pagos:', error)
      return 'Error generando reporte'
    }
  }
}

export const paymentService = new PaymentService() 