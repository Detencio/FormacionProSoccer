// Servicio de pagos mejorado con cuotas mensuales y notificaciones
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
  private getPaymentsFromStorage(): Payment[] {
    try {
      const saved = localStorage.getItem('payments-data')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error cargando pagos desde localStorage:', error)
      return []
    }
  }

  private savePaymentsToStorage(payments: Payment[]): void {
    try {
      localStorage.setItem('payments-data', JSON.stringify(payments))
    } catch (error) {
      console.error('Error guardando pagos en localStorage:', error)
    }
  }

  private getNotificationsFromStorage(): PaymentNotification[] {
    try {
      const saved = localStorage.getItem('payment-notifications')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error cargando notificaciones:', error)
      return []
    }
  }

  private saveNotificationsToStorage(notifications: PaymentNotification[]): void {
    try {
      localStorage.setItem('payment-notifications', JSON.stringify(notifications))
    } catch (error) {
      console.error('Error guardando notificaciones:', error)
    }
  }

  // Generar cuotas mensuales para todos los jugadores
  async generateMonthlyPayments(month: string, amount: number = 50000): Promise<Payment[]> {
    const teams = this.getTeamsFromStorage()
    const existingPayments = this.getPaymentsFromStorage()
    
    const newPayments: Payment[] = []
    
    teams.forEach(team => {
      team.players?.forEach(player => {
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
      this.savePaymentsToStorage(updatedPayments)
      
      // Crear notificaciones para pagos pendientes
      await this.createPaymentNotifications(newPayments)
    }
    
    return newPayments
  }

  private getTeamsFromStorage(): any[] {
    try {
      const saved = localStorage.getItem('teams-data')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error cargando equipos:', error)
      return []
    }
  }

  // Crear notificaciones para pagos
  private async createPaymentNotifications(payments: Payment[]): Promise<void> {
    const notifications = this.getNotificationsFromStorage()
    
    const newNotifications: PaymentNotification[] = payments.map(payment => ({
      id: Date.now() + Math.random(),
      playerId: payment.playerId,
      playerName: payment.playerName,
      type: 'payment_due',
      message: `Tienes una cuota pendiente de ${this.formatCurrency(payment.amount)} para ${payment.month}`,
      date: new Date().toISOString(),
      read: false,
      paymentId: payment.id
    }))
    
    this.saveNotificationsToStorage([...notifications, ...newNotifications])
  }

  // Obtener historial de pagos por jugador
  async getPlayerPaymentHistory(playerId: number): Promise<PlayerPaymentHistory | null> {
    const payments = this.getPaymentsFromStorage()
    const playerPayments = payments.filter(p => p.playerId === playerId)
    
    if (playerPayments.length === 0) return null
    
    const player = playerPayments[0]
    const monthlyPayments = playerPayments.map(p => ({
      month: p.month || '',
      status: p.status,
      amount: p.amount,
      dueDate: p.dueDate,
      paidDate: p.date || undefined
    }))
    
    return {
      playerId,
      playerName: player.playerName,
      teamName: player.teamName,
      monthlyPayments,
      totalPaid: playerPayments.filter(p => p.status === 'pagado').reduce((sum, p) => sum + p.amount, 0),
      totalPending: playerPayments.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + p.amount, 0),
      totalOverdue: playerPayments.filter(p => p.status === 'vencido').reduce((sum, p) => sum + p.amount, 0)
    }
  }

  // Obtener estadísticas mensuales
  async getMonthlyStats(): Promise<MonthlyStats[]> {
    const payments = this.getPaymentsFromStorage()
    const monthlyData: { [key: string]: MonthlyStats } = {}
    
    payments.forEach(payment => {
      const month = payment.month || payment.dueDate.substring(0, 7)
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          total: 0,
          paid: 0,
          pending: 0,
          overdue: 0,
          amount: 0
        }
      }
      
      monthlyData[month].total++
      monthlyData[month].amount += payment.amount
      
      switch (payment.status) {
        case 'pagado':
          monthlyData[month].paid++
          break
        case 'pendiente':
          monthlyData[month].pending++
          break
        case 'vencido':
          monthlyData[month].overdue++
          break
      }
    })
    
    return Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month))
  }

  // Obtener notificaciones
  async getNotifications(playerId?: number): Promise<PaymentNotification[]> {
    const notifications = this.getNotificationsFromStorage()
    
    if (playerId) {
      return notifications.filter(n => n.playerId === playerId)
    }
    
    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: number): Promise<void> {
    const notifications = this.getNotificationsFromStorage()
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    this.saveNotificationsToStorage(updatedNotifications)
  }

  // Obtener pagos vencidos que necesitan notificación
  async getOverduePaymentsNeedingNotification(): Promise<Payment[]> {
    const payments = this.getPaymentsFromStorage()
    const today = new Date().toISOString().split('T')[0]
    
    return payments.filter(payment => 
      payment.status === 'pendiente' && 
      payment.dueDate < today && 
      !payment.notificationSent
    )
  }

  // Enviar notificaciones de pagos vencidos
  async sendOverdueNotifications(): Promise<void> {
    const overduePayments = await this.getOverduePaymentsNeedingNotification()
    const notifications = this.getNotificationsFromStorage()
    
    const newNotifications: PaymentNotification[] = overduePayments.map(payment => ({
      id: Date.now() + Math.random(),
      playerId: payment.playerId,
      playerName: payment.playerName,
      type: 'payment_overdue',
      message: `Tu cuota de ${this.formatCurrency(payment.amount)} está vencida desde ${payment.dueDate}`,
      date: new Date().toISOString(),
      read: false,
      paymentId: payment.id
    }))
    
    // Marcar pagos como notificados
    const updatedPayments = this.getPaymentsFromStorage().map(p => 
      overduePayments.some(op => op.id === p.id) ? { ...p, notificationSent: true } : p
    )
    
    this.savePaymentsToStorage(updatedPayments)
    this.saveNotificationsToStorage([...notifications, ...newNotifications])
  }

  // Formatear moneda
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  async getPayments(filters?: PaymentFilters): Promise<Payment[]> {
    const payments = this.getPaymentsFromStorage()
    
    if (!filters) return payments

    return payments.filter(payment => {
      if (filters.status && filters.status !== 'todos' && payment.status !== filters.status) {
        return false
      }
      if (filters.teamId && payment.teamId !== filters.teamId) {
        return false
      }
      if (filters.playerId && payment.playerId !== filters.playerId) {
        return false
      }
      if (filters.month && payment.month !== filters.month) {
        return false
      }
      if (filters.search) {
        const search = filters.search.toLowerCase()
        const matchesPlayer = payment.playerName.toLowerCase().includes(search)
        const matchesDescription = payment.description.toLowerCase().includes(search)
        if (!matchesPlayer && !matchesDescription) {
          return false
        }
      }
      if (filters.startDate && payment.dueDate < filters.startDate) {
        return false
      }
      if (filters.endDate && payment.dueDate > filters.endDate) {
        return false
      }
      return true
    })
  }

  async createPayment(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
    const payments = this.getPaymentsFromStorage()
    const newPayment: Payment = {
      ...paymentData,
      id: Math.max(...payments.map(p => p.id), 0) + 1
    }
    
    const updatedPayments = [...payments, newPayment]
    this.savePaymentsToStorage(updatedPayments)
    
    // Crear notificación de pago recibido
    await this.createPaymentReceivedNotification(newPayment)
    
    return newPayment
  }

  private async createPaymentReceivedNotification(payment: Payment): Promise<void> {
    const notifications = this.getNotificationsFromStorage()
    
    const notification: PaymentNotification = {
      id: Date.now() + Math.random(),
      playerId: payment.playerId,
      playerName: payment.playerName,
      type: 'payment_received',
      message: `Pago recibido: ${this.formatCurrency(payment.amount)} - ${payment.description}`,
      date: new Date().toISOString(),
      read: false,
      paymentId: payment.id
    }
    
    this.saveNotificationsToStorage([...notifications, notification])
  }

  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment> {
    const payments = this.getPaymentsFromStorage()
    const updatedPayments = payments.map(payment =>
      payment.id === id ? { ...payment, ...paymentData } : payment
    )
    
    this.savePaymentsToStorage(updatedPayments)
    const updatedPayment = updatedPayments.find(p => p.id === id)
    if (!updatedPayment) throw new Error('Pago no encontrado')
    return updatedPayment
  }

  async deletePayment(id: number): Promise<void> {
    const payments = this.getPaymentsFromStorage()
    const updatedPayments = payments.filter(payment => payment.id !== id)
    this.savePaymentsToStorage(updatedPayments)
  }

  async getPaymentStats(): Promise<PaymentStats> {
    const payments = this.getPaymentsFromStorage()
    const monthlyStats = await this.getMonthlyStats()
    
    const stats: PaymentStats = {
      total: payments.length,
      paid: payments.filter(p => p.status === 'pagado').length,
      pending: payments.filter(p => p.status === 'pendiente').length,
      overdue: payments.filter(p => p.status === 'vencido').length,
      canceled: payments.filter(p => p.status === 'cancelado').length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      paidAmount: payments.filter(p => p.status === 'pagado').reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: payments.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + p.amount, 0),
      overdueAmount: payments.filter(p => p.status === 'vencido').reduce((sum, p) => sum + p.amount, 0),
      canceledAmount: payments.filter(p => p.status === 'cancelado').reduce((sum, p) => sum + p.amount, 0),
      monthlyStats
    }
    
    return stats
  }

  async getOverduePayments(): Promise<Payment[]> {
    const payments = this.getPaymentsFromStorage()
    return payments.filter(payment => payment.status === 'vencido')
  }

  async markAsPaid(id: number): Promise<Payment> {
    return this.updatePayment(id, { 
      status: 'pagado',
      date: new Date().toISOString().split('T')[0]
    })
  }

  async generatePaymentReport(filters?: PaymentFilters): Promise<string> {
    const payments = await this.getPayments(filters)
    
    const csvHeaders = [
      'ID', 'Jugador', 'Equipo', 'Descripción', 'Monto', 
      'Fecha Pago', 'Vencimiento', 'Estado', 'Método', 'Mes'
    ]
    
    const csvRows = payments.map(payment => [
      payment.id,
      payment.playerName,
      payment.teamName,
      payment.description,
      payment.amount,
      payment.date || '-',
      payment.dueDate,
      payment.status,
      payment.method,
      payment.month || '-'
    ])
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    return csvContent
  }
}

export const paymentService = new PaymentService() 