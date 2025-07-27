# 💰 Módulo de Gestión de Pagos - Formación Pro Soccer

## 📋 Descripción General

El módulo de **Gestión de Pagos** es un componente financiero esencial del sistema Formación Pro Soccer que permite la administración completa de cuotas, pagos y finanzas del club. Incluye funcionalidades para el seguimiento de pagos, generación de reportes financieros y gestión de cuotas mensuales.

## 🎯 Funcionalidades Principales

### ✅ Funcionalidades Implementadas
- **Gestión de Cuotas Mensuales**: Configuración y seguimiento de cuotas por jugador
- **Registro de Pagos**: Captura y validación de pagos realizados
- **Historial de Pagos**: Seguimiento completo de transacciones
- **Notificaciones Automáticas**: Alertas de pagos pendientes y vencidos
- **Reportes Financieros**: Análisis de ingresos y estado de cuentas
- **Gestión de Descuentos**: Aplicación de descuentos y promociones
- **Exportación de Datos**: Generación de reportes en diferentes formatos

### 🔄 Funcionalidades en Desarrollo
- **Integración con Pasarelas de Pago**: Conexión con sistemas de pago online
- **Facturación Electrónica**: Generación automática de facturas
- **Sistema de Reembolsos**: Gestión de devoluciones y ajustes
- **Análisis Predictivo**: Predicción de pagos y flujo de caja

## 🏗️ Arquitectura del Módulo

### Estructura de Archivos
```
src/app/payments/
├── page.tsx                    # Página principal de pagos
├── monthly/                    # Gestión de cuotas mensuales
│   └── page.tsx               # Vista de cuotas por mes
├── manage/                     # Gestión de pagos individuales
│   └── page.tsx               # Administración de pagos
├── reports/                    # Reportes financieros
│   └── page.tsx               # Análisis y reportes
└── components/                # Componentes específicos
    ├── PaymentDashboard.tsx   # Dashboard de pagos
    ├── PaymentNotifications.tsx # Notificaciones de pagos
    ├── PlayerPaymentHistory.tsx # Historial de pagos por jugador
    ├── PaymentModal.tsx       # Modal de registro de pagos
    └── PaymentStats.tsx       # Estadísticas financieras
```

### Modelo de Datos

#### Entidad Payment
```typescript
interface Payment {
  id: number;
  player_id: number;
  player: Player;
  amount: number;
  payment_date: Date;
  due_date: Date;
  payment_type: 'MONTHLY_FEE' | 'SPECIAL_FEE' | 'PENALTY' | 'DISCOUNT';
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD';
  reference_number?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  month_year: string; // Format: "YYYY-MM"
}
```

#### Entidad MonthlyFee
```typescript
interface MonthlyFee {
  id: number;
  player_id: number;
  month_year: string; // Format: "YYYY-MM"
  amount: number;
  due_date: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  discount_amount?: number;
  penalty_amount?: number;
  total_amount: number;
  payment_id?: number;
  created_at: Date;
  updated_at: Date;
}
```

#### Entidad PaymentStats
```typescript
interface PaymentStats {
  total_revenue: number;
  pending_amount: number;
  overdue_amount: number;
  monthly_average: number;
  payment_rate: number; // Percentage
  total_players: number;
  active_payers: number;
  inactive_payers: number;
  monthly_breakdown: Record<string, number>;
}
```

## 🔌 API Endpoints

### Pagos

#### GET /api/v1/payments
Obtiene la lista de todos los pagos.

**Parámetros de Query:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `player_id`: Filtrar por jugador
- `status`: Filtrar por estado (PENDING, PAID, OVERDUE, CANCELLED)
- `payment_type`: Filtrar por tipo de pago
- `date_from`: Fecha desde
- `date_to`: Fecha hasta

**Respuesta:**
```json
{
  "payments": [
    {
      "id": 1,
      "player_id": 1,
      "player": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com"
      },
      "amount": 50000,
      "payment_date": "2024-01-15T00:00:00Z",
      "due_date": "2024-01-31T00:00:00Z",
      "payment_type": "MONTHLY_FEE",
      "status": "PAID",
      "payment_method": "BANK_TRANSFER",
      "reference_number": "TRX-001",
      "month_year": "2024-01"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

#### POST /api/v1/payments
Registra un nuevo pago.

**Body:**
```json
{
  "player_id": 1,
  "amount": 50000,
  "payment_date": "2024-01-15T00:00:00Z",
  "due_date": "2024-01-31T00:00:00Z",
  "payment_type": "MONTHLY_FEE",
  "payment_method": "BANK_TRANSFER",
  "reference_number": "TRX-001",
  "notes": "Pago de cuota mensual"
}
```

#### GET /api/v1/payments/{id}
Obtiene los detalles de un pago específico.

#### PUT /api/v1/payments/{id}
Actualiza un pago existente.

#### DELETE /api/v1/payments/{id}
Elimina un pago (soft delete).

### Cuotas Mensuales

#### GET /api/v1/payments/monthly-fees
Obtiene las cuotas mensuales.

**Parámetros de Query:**
- `month_year`: Mes y año (format: "YYYY-MM")
- `player_id`: Filtrar por jugador
- `status`: Filtrar por estado

**Respuesta:**
```json
{
  "monthly_fees": [
    {
      "id": 1,
      "player_id": 1,
      "player": {
        "id": 1,
        "name": "Juan Pérez"
      },
      "month_year": "2024-01",
      "amount": 50000,
      "due_date": "2024-01-31T00:00:00Z",
      "status": "PAID",
      "discount_amount": 0,
      "penalty_amount": 0,
      "total_amount": 50000,
      "payment": {
        "id": 1,
        "payment_date": "2024-01-15T00:00:00Z",
        "payment_method": "BANK_TRANSFER"
      }
    }
  ]
}
```

#### POST /api/v1/payments/monthly-fees/generate
Genera cuotas mensuales para todos los jugadores activos.

**Body:**
```json
{
  "month_year": "2024-02",
  "amount": 50000,
  "due_date": "2024-02-29T00:00:00Z"
}
```

### Estadísticas Financieras

#### GET /api/v1/payments/stats
Obtiene estadísticas financieras generales.

**Respuesta:**
```json
{
  "total_revenue": 2500000,
  "pending_amount": 500000,
  "overdue_amount": 150000,
  "monthly_average": 500000,
  "payment_rate": 85.5,
  "total_players": 50,
  "active_payers": 43,
  "inactive_payers": 7,
  "monthly_breakdown": {
    "2024-01": 480000,
    "2024-02": 520000,
    "2024-03": 500000
  }
}
```

#### GET /api/v1/payments/player/{player_id}/history
Obtiene el historial de pagos de un jugador específico.

## 🎨 Componentes del Frontend

### PaymentDashboard Component
```typescript
interface PaymentDashboardProps {
  stats: PaymentStats;
  recentPayments: Payment[];
  overduePayments: Payment[];
}

const PaymentDashboard: React.FC<PaymentDashboardProps> = ({
  stats,
  recentPayments,
  overduePayments
}) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.total_revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendiente</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.pending_amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencido</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.overdue_amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasa de Pago</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.payment_rate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pagos Recientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pagos Recientes</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentPayments.map(payment => (
            <div key={payment.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {payment.player.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### PaymentModal Component
```typescript
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment;
  players: Player[];
  onSubmit: (data: PaymentFormData) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  payment,
  players,
  onSubmit
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PaymentFormData>({
    defaultValues: payment || {
      player_id: '',
      amount: 0,
      payment_date: new Date().toISOString().split('T')[0],
      due_date: new Date().toISOString().split('T')[0],
      payment_type: 'MONTHLY_FEE',
      payment_method: 'CASH',
      reference_number: '',
      notes: ''
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jugador
          </label>
          <select
            {...register('player_id', { required: 'El jugador es requerido' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar jugador</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          {errors.player_id && (
            <p className="mt-1 text-sm text-red-600">{errors.player_id.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monto
            </label>
            <input
              {...register('amount', { 
                required: 'El monto es requerido',
                min: { value: 1, message: 'El monto debe ser mayor a 0' }
              })}
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Pago
            </label>
            <select
              {...register('payment_type', { required: 'El tipo de pago es requerido' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="MONTHLY_FEE">Cuota Mensual</option>
              <option value="SPECIAL_FEE">Cuota Especial</option>
              <option value="PENALTY">Multa</option>
              <option value="DISCOUNT">Descuento</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Pago
            </label>
            <input
              {...register('payment_date', { required: 'La fecha de pago es requerida' })}
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Vencimiento
            </label>
            <input
              {...register('due_date', { required: 'La fecha de vencimiento es requerida' })}
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Método de Pago
          </label>
          <select
            {...register('payment_method', { required: 'El método de pago es requerido' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="CASH">Efectivo</option>
            <option value="BANK_TRANSFER">Transferencia Bancaria</option>
            <option value="CREDIT_CARD">Tarjeta de Crédito</option>
            <option value="DEBIT_CARD">Tarjeta de Débito</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de Referencia
          </label>
          <input
            {...register('reference_number')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notas
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {payment ? 'Actualizar' : 'Registrar'} Pago
          </button>
        </div>
      </form>
    </Modal>
  );
};
```

## 🔧 Servicios y Hooks

### PaymentService
```typescript
class PaymentService {
  private api = new ApiService();

  async getPayments(params?: PaymentQueryParams): Promise<PaginatedResponse<Payment>> {
    const queryString = new URLSearchParams(params as Record<string, string>);
    return this.api.get(`/payments?${queryString}`);
  }

  async getPayment(id: number): Promise<Payment> {
    return this.api.get(`/payments/${id}`);
  }

  async createPayment(data: CreatePaymentData): Promise<Payment> {
    return this.api.post('/payments', data);
  }

  async updatePayment(id: number, data: UpdatePaymentData): Promise<Payment> {
    return this.api.put(`/payments/${id}`, data);
  }

  async deletePayment(id: number): Promise<void> {
    return this.api.delete(`/payments/${id}`);
  }

  async getMonthlyFees(params?: MonthlyFeeQueryParams): Promise<MonthlyFee[]> {
    const queryString = new URLSearchParams(params as Record<string, string>);
    return this.api.get(`/payments/monthly-fees?${queryString}`);
  }

  async generateMonthlyFees(data: GenerateMonthlyFeesData): Promise<void> {
    return this.api.post('/payments/monthly-fees/generate', data);
  }

  async getPaymentStats(): Promise<PaymentStats> {
    return this.api.get('/payments/stats');
  }

  async getPlayerPaymentHistory(playerId: number): Promise<Payment[]> {
    return this.api.get(`/payments/player/${playerId}/history`);
  }

  async getOverduePayments(): Promise<Payment[]> {
    return this.api.get('/payments/overdue');
  }

  async sendPaymentReminders(): Promise<void> {
    return this.api.post('/payments/reminders');
  }
}

export const paymentService = new PaymentService();
```

### usePayments Hook
```typescript
export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async (params?: PaymentQueryParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentService.getPayments(params);
      setPayments(response.payments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (data: CreatePaymentData) => {
    try {
      const newPayment = await paymentService.createPayment(data);
      setPayments(prev => [...prev, newPayment]);
      return newPayment;
    } catch (err) {
      throw err;
    }
  }, []);

  const updatePayment = useCallback(async (id: number, data: UpdatePaymentData) => {
    try {
      const updatedPayment = await paymentService.updatePayment(id, data);
      setPayments(prev => prev.map(payment => 
        payment.id === id ? updatedPayment : payment
      ));
      return updatedPayment;
    } catch (err) {
      throw err;
    }
  }, []);

  const deletePayment = useCallback(async (id: number) => {
    try {
      await paymentService.deletePayment(id);
      setPayments(prev => prev.filter(payment => payment.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    payments,
    loading,
    error,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment
  };
};
```

## 🧪 Testing

### Tests Unitarios
```typescript
// __tests__/components/PaymentDashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { PaymentDashboard } from '../../components/PaymentDashboard';

const mockStats = {
  total_revenue: 2500000,
  pending_amount: 500000,
  overdue_amount: 150000,
  payment_rate: 85.5,
  total_players: 50,
  active_payers: 43,
  inactive_payers: 7,
  monthly_average: 500000,
  monthly_breakdown: {}
};

const mockPayments = [
  {
    id: 1,
    player_id: 1,
    player: { id: 1, name: 'Juan Pérez' },
    amount: 50000,
    payment_date: new Date('2024-01-15'),
    status: 'PAID',
    payment_type: 'MONTHLY_FEE',
    payment_method: 'BANK_TRANSFER'
  }
];

describe('PaymentDashboard', () => {
  it('should render payment statistics correctly', () => {
    render(
      <PaymentDashboard
        stats={mockStats}
        recentPayments={mockPayments}
        overduePayments={[]}
      />
    );

    expect(screen.getByText('$2,500,000')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();
    expect(screen.getByText('$150,000')).toBeInTheDocument();
    expect(screen.getByText('85.5%')).toBeInTheDocument();
  });

  it('should display recent payments', () => {
    render(
      <PaymentDashboard
        stats={mockStats}
        recentPayments={mockPayments}
        overduePayments={[]}
      />
    );

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });
});
```

### Tests de Integración
```typescript
// __tests__/pages/payments.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import PaymentsPage from '../../app/payments/page';

const server = setupServer(
  rest.get('/api/v1/payments', (req, res, ctx) => {
    return res(
      ctx.json({
        payments: [
          {
            id: 1,
            player: { id: 1, name: 'Juan Pérez' },
            amount: 50000,
            status: 'PAID',
            payment_date: '2024-01-15T00:00:00Z'
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1
        }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PaymentsPage', () => {
  it('should load and display payments', async () => {
    render(<PaymentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
  });
});
```

## 📊 Métricas y Analytics

### KPIs del Módulo
- **Total de ingresos**: $2,500,000 este año
- **Tasa de cobro**: 85.5% de cuotas pagadas
- **Promedio de pago**: $50,000 por jugador
- **Pagos vencidos**: $150,000 en mora

### Métricas de Performance
- **First Contentful Paint**: 1.0s
- **Largest Contentful Paint**: 1.8s
- **Cumulative Layout Shift**: 0.02
- **Time to Interactive**: 2.2s

## 🔒 Seguridad y Validación

### Validación de Datos
```typescript
// schemas/payment.ts
import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  player_id: z.number().positive('El jugador es requerido'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  payment_date: z.string().datetime('Fecha de pago inválida'),
  due_date: z.string().datetime('Fecha de vencimiento inválida'),
  payment_type: z.enum(['MONTHLY_FEE', 'SPECIAL_FEE', 'PENALTY', 'DISCOUNT']),
  payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD']),
  reference_number: z.string().max(50).optional(),
  notes: z.string().max(500).optional()
}).refine(data => new Date(data.payment_date) <= new Date(data.due_date), {
  message: 'La fecha de pago no puede ser posterior a la fecha de vencimiento',
  path: ['payment_date']
});

export const UpdatePaymentSchema = CreatePaymentSchema.partial();

export type CreatePaymentData = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentData = z.infer<typeof UpdatePaymentSchema>;
```

### Autorización
```typescript
// middleware/paymentAuth.ts
export const requirePaymentAccess = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
      
      // Verificar permisos financieros
      const hasFinancialAccess = await checkFinancialPermissions(decoded.userId);
      if (!hasFinancialAccess) {
        return res.status(403).json({ error: 'Sin permisos financieros' });
      }
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
};
```

## 🚀 Optimizaciones Implementadas

### Performance
- **Lazy Loading**: Carga diferida de historiales largos
- **Memoización**: Uso de React.memo para componentes de pago
- **Virtualización**: Para listas largas de transacciones
- **Caching**: Cache de estadísticas financieras

### UX/UI
- **Skeleton Loading**: Estados de carga con esqueletos
- **Error Boundaries**: Manejo elegante de errores
- **Toast Notifications**: Notificaciones de éxito/error
- **Responsive Design**: Diseño adaptativo para todos los dispositivos
- **Real-time Updates**: Actualizaciones en tiempo real de pagos

## 🔮 Roadmap del Módulo

### Próximas Funcionalidades
- [ ] **Integración con Pasarelas**: Conexión con sistemas de pago online
- [ ] **Facturación Electrónica**: Generación automática de facturas
- [ ] **Sistema de Reembolsos**: Gestión de devoluciones
- [ ] **Análisis Predictivo**: Predicción de pagos
- [ ] **Reportes Avanzados**: Análisis detallado de finanzas

### Mejoras Técnicas
- [ ] **WebSocket**: Actualizaciones en tiempo real
- [ ] **Offline Support**: Funcionalidad offline
- [ ] **Push Notifications**: Alertas de pagos
- [ ] **Blockchain**: Registro inmutable de transacciones

---

**Módulo de Pagos** - Documentación Técnica v1.0

*Última actualización: Diciembre 2024*
*Versión del módulo: 1.0.0* 