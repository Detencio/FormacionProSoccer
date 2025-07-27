# 💸 Módulo de Gestión de Gastos - Formación Pro Soccer

## 📋 Descripción General

El módulo de **Gestión de Gastos** es un componente financiero esencial del sistema Formación Pro Soccer que permite el control completo de los gastos del club, incluyendo la categorización, seguimiento y análisis de todos los costos operativos. Proporciona herramientas para la gestión presupuestaria y el control financiero.

## 🎯 Funcionalidades Principales

### ✅ Funcionalidades Implementadas
- **Registro de Gastos**: Captura y validación de gastos del club
- **Categorización Automática**: Clasificación inteligente de gastos
- **Control Presupuestario**: Seguimiento de presupuestos por categoría
- **Aprobación de Gastos**: Flujo de autorización para gastos mayores
- **Reportes Financieros**: Análisis detallado de costos y gastos
- **Gestión de Proveedores**: Control de proveedores y facturas
- **Exportación de Datos**: Generación de reportes en diferentes formatos

### 🔄 Funcionalidades en Desarrollo
- **Integración con Contabilidad**: Conexión con sistemas contables
- **Facturación Electrónica**: Gestión automática de facturas
- **Análisis Predictivo**: Predicción de gastos futuros
- **Sistema de Reembolsos**: Gestión de gastos reembolsables

## 🏗️ Arquitectura del Módulo

### Estructura de Archivos
```
src/app/expenses/
├── page.tsx                    # Página principal de gastos
├── categories/                 # Gestión de categorías
│   └── page.tsx               # Administración de categorías
├── reports/                    # Reportes financieros
│   └── page.tsx               # Análisis y reportes
├── approval/                   # Aprobación de gastos
│   └── page.tsx               # Flujo de aprobación
└── components/                # Componentes específicos
    ├── ExpenseDashboard.tsx   # Dashboard de gastos
    ├── ExpenseModal.tsx       # Modal de registro de gastos
    ├── ExpenseCategories.tsx  # Gestión de categorías
    ├── ExpenseReports.tsx     # Reportes financieros
    └── ExpenseApproval.tsx    # Sistema de aprobación
```

### Modelo de Datos

#### Entidad Expense
```typescript
interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  category_id: number;
  category: ExpenseCategory;
  expense_date: Date;
  payment_date?: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CHECK';
  reference_number?: string;
  receipt_url?: string;
  approved_by?: number;
  approved_at?: Date;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  tags: string[];
}
```

#### Entidad ExpenseCategory
```typescript
interface ExpenseCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  budget_limit?: number;
  budget_period: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  is_active: boolean;
  parent_category_id?: number;
  parent_category?: ExpenseCategory;
  subcategories: ExpenseCategory[];
  created_at: Date;
  updated_at: Date;
}
```

#### Entidad ExpenseStats
```typescript
interface ExpenseStats {
  total_expenses: number;
  total_budget: number;
  remaining_budget: number;
  monthly_average: number;
  top_categories: CategoryExpense[];
  pending_approvals: number;
  overdue_expenses: number;
  monthly_breakdown: Record<string, number>;
  category_breakdown: Record<string, number>;
}
```

## 🔌 API Endpoints

### Gastos

#### GET /api/v1/expenses
Obtiene la lista de todos los gastos.

**Parámetros de Query:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `category_id`: Filtrar por categoría
- `status`: Filtrar por estado (PENDING, APPROVED, REJECTED, PAID)
- `priority`: Filtrar por prioridad
- `date_from`: Fecha desde
- `date_to`: Fecha hasta

**Respuesta:**
```json
{
  "expenses": [
    {
      "id": 1,
      "title": "Compra de balones",
      "description": "Balones oficiales para entrenamiento",
      "amount": 150000,
      "category": {
        "id": 1,
        "name": "Equipamiento",
        "color": "#3B82F6"
      },
      "expense_date": "2024-01-15T00:00:00Z",
      "status": "APPROVED",
      "priority": "MEDIUM",
      "payment_method": "BANK_TRANSFER",
      "reference_number": "INV-001",
      "created_by": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 85,
    "pages": 9
  }
}
```

#### POST /api/v1/expenses
Registra un nuevo gasto.

**Body:**
```json
{
  "title": "Compra de balones",
  "description": "Balones oficiales para entrenamiento",
  "amount": 150000,
  "category_id": 1,
  "expense_date": "2024-01-15T00:00:00Z",
  "priority": "MEDIUM",
  "payment_method": "BANK_TRANSFER",
  "reference_number": "INV-001",
  "tags": ["equipamiento", "balones"]
}
```

#### GET /api/v1/expenses/{id}
Obtiene los detalles de un gasto específico.

#### PUT /api/v1/expenses/{id}
Actualiza un gasto existente.

#### DELETE /api/v1/expenses/{id}
Elimina un gasto (soft delete).

### Categorías de Gastos

#### GET /api/v1/expenses/categories
Obtiene todas las categorías de gastos.

**Respuesta:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Equipamiento",
      "description": "Compra de equipamiento deportivo",
      "color": "#3B82F6",
      "icon": "sports-soccer",
      "budget_limit": 500000,
      "budget_period": "MONTHLY",
      "is_active": true,
      "subcategories": [
        {
          "id": 2,
          "name": "Balones",
          "color": "#10B981"
        }
      ]
    }
  ]
}
```

#### POST /api/v1/expenses/categories
Crea una nueva categoría de gastos.

### Aprobación de Gastos

#### GET /api/v1/expenses/pending-approval
Obtiene gastos pendientes de aprobación.

#### PUT /api/v1/expenses/{id}/approve
Aprueba un gasto.

**Body:**
```json
{
  "approved": true,
  "comments": "Gasto aprobado según presupuesto"
}
```

### Estadísticas Financieras

#### GET /api/v1/expenses/stats
Obtiene estadísticas de gastos.

**Respuesta:**
```json
{
  "total_expenses": 2500000,
  "total_budget": 3000000,
  "remaining_budget": 500000,
  "monthly_average": 250000,
  "top_categories": [
    {
      "category_name": "Equipamiento",
      "total_amount": 800000,
      "percentage": 32
    }
  ],
  "pending_approvals": 5,
  "overdue_expenses": 2,
  "monthly_breakdown": {
    "2024-01": 240000,
    "2024-02": 260000,
    "2024-03": 250000
  }
}
```

## 🎨 Componentes del Frontend

### ExpenseDashboard Component
```typescript
interface ExpenseDashboardProps {
  stats: ExpenseStats;
  recentExpenses: Expense[];
  pendingApprovals: Expense[];
}

const ExpenseDashboard: React.FC<ExpenseDashboardProps> = ({
  stats,
  recentExpenses,
  pendingApprovals
}) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Gastos</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.total_expenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Presupuesto Restante</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.remaining_budget.toLocaleString()}
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
              <p className="text-sm font-medium text-gray-600">Pendientes Aprobación</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending_approvals}
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
              <p className="text-sm font-medium text-gray-600">Promedio Mensual</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.monthly_average.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gastos Recientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Gastos Recientes</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentExpenses.map(expense => (
            <div key={expense.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {expense.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {expense.category.name} • {new Date(expense.expense_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${expense.amount.toLocaleString()}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    expense.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    expense.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    expense.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {expense.status}
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

### ExpenseModal Component
```typescript
interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
  categories: ExpenseCategory[];
  onSubmit: (data: ExpenseFormData) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  categories,
  onSubmit
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ExpenseFormData>({
    defaultValues: expense || {
      title: '',
      description: '',
      amount: 0,
      category_id: '',
      expense_date: new Date().toISOString().split('T')[0],
      priority: 'MEDIUM',
      payment_method: 'BANK_TRANSFER',
      reference_number: '',
      tags: []
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título del Gasto
          </label>
          <input
            {...register('title', { required: 'El título es requerido' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
              Categoría
            </label>
            <select
              {...register('category_id', { required: 'La categoría es requerida' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha del Gasto
            </label>
            <input
              {...register('expense_date', { required: 'La fecha es requerida' })}
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prioridad
            </label>
            <select
              {...register('priority', { required: 'La prioridad es requerida' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
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
            <option value="CHECK">Cheque</option>
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
            {expense ? 'Actualizar' : 'Registrar'} Gasto
          </button>
        </div>
      </form>
    </Modal>
  );
};
```

## 🔧 Servicios y Hooks

### ExpenseService
```typescript
class ExpenseService {
  private api = new ApiService();

  async getExpenses(params?: ExpenseQueryParams): Promise<PaginatedResponse<Expense>> {
    const queryString = new URLSearchParams(params as Record<string, string>);
    return this.api.get(`/expenses?${queryString}`);
  }

  async getExpense(id: number): Promise<Expense> {
    return this.api.get(`/expenses/${id}`);
  }

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    return this.api.post('/expenses', data);
  }

  async updateExpense(id: number, data: UpdateExpenseData): Promise<Expense> {
    return this.api.put(`/expenses/${id}`, data);
  }

  async deleteExpense(id: number): Promise<void> {
    return this.api.delete(`/expenses/${id}`);
  }

  async getCategories(): Promise<ExpenseCategory[]> {
    return this.api.get('/expenses/categories');
  }

  async createCategory(data: CreateCategoryData): Promise<ExpenseCategory> {
    return this.api.post('/expenses/categories', data);
  }

  async getExpenseStats(): Promise<ExpenseStats> {
    return this.api.get('/expenses/stats');
  }

  async getPendingApprovals(): Promise<Expense[]> {
    return this.api.get('/expenses/pending-approval');
  }

  async approveExpense(id: number, approved: boolean, comments?: string): Promise<void> {
    return this.api.put(`/expenses/${id}/approve`, { approved, comments });
  }

  async uploadReceipt(id: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('receipt', file);
    return this.api.post(`/expenses/${id}/receipt`, formData);
  }
}

export const expenseService = new ExpenseService();
```

### useExpenses Hook
```typescript
export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (params?: ExpenseQueryParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await expenseService.getExpenses(params);
      setExpenses(response.expenses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar gastos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = useCallback(async (data: CreateExpenseData) => {
    try {
      const newExpense = await expenseService.createExpense(data);
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (id: number, data: UpdateExpenseData) => {
    try {
      const updatedExpense = await expenseService.updateExpense(id, data);
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? updatedExpense : expense
      ));
      return updatedExpense;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id: number) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };
};
```

## 🧪 Testing

### Tests Unitarios
```typescript
// __tests__/components/ExpenseDashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { ExpenseDashboard } from '../../components/ExpenseDashboard';

const mockStats = {
  total_expenses: 2500000,
  total_budget: 3000000,
  remaining_budget: 500000,
  monthly_average: 250000,
  top_categories: [],
  pending_approvals: 5,
  overdue_expenses: 2,
  monthly_breakdown: {},
  category_breakdown: {}
};

const mockExpenses = [
  {
    id: 1,
    title: 'Compra de balones',
    category: { id: 1, name: 'Equipamiento', color: '#3B82F6' },
    amount: 150000,
    expense_date: new Date('2024-01-15'),
    status: 'APPROVED',
    priority: 'MEDIUM',
    payment_method: 'BANK_TRANSFER'
  }
];

describe('ExpenseDashboard', () => {
  it('should render expense statistics correctly', () => {
    render(
      <ExpenseDashboard
        stats={mockStats}
        recentExpenses={mockExpenses}
        pendingApprovals={[]}
      />
    );

    expect(screen.getByText('$2,500,000')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('$250,000')).toBeInTheDocument();
  });

  it('should display recent expenses', () => {
    render(
      <ExpenseDashboard
        stats={mockStats}
        recentExpenses={mockExpenses}
        pendingApprovals={[]}
      />
    );

    expect(screen.getByText('Compra de balones')).toBeInTheDocument();
    expect(screen.getByText('$150,000')).toBeInTheDocument();
    expect(screen.getByText('Equipamiento')).toBeInTheDocument();
  });
});
```

### Tests de Integración
```typescript
// __tests__/pages/expenses.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ExpensesPage from '../../app/expenses/page';

const server = setupServer(
  rest.get('/api/v1/expenses', (req, res, ctx) => {
    return res(
      ctx.json({
        expenses: [
          {
            id: 1,
            title: 'Compra de balones',
            category: { id: 1, name: 'Equipamiento' },
            amount: 150000,
            status: 'APPROVED',
            expense_date: '2024-01-15T00:00:00Z'
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

describe('ExpensesPage', () => {
  it('should load and display expenses', async () => {
    render(<ExpensesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Compra de balones')).toBeInTheDocument();
    });
  });
});
```

## 📊 Métricas y Analytics

### KPIs del Módulo
- **Total de gastos**: $2,500,000 este año
- **Presupuesto restante**: $500,000 disponible
- **Promedio mensual**: $250,000 por mes
- **Gastos pendientes**: 5 por aprobar

### Métricas de Performance
- **First Contentful Paint**: 1.1s
- **Largest Contentful Paint**: 1.9s
- **Cumulative Layout Shift**: 0.03
- **Time to Interactive**: 2.4s

## 🔒 Seguridad y Validación

### Validación de Datos
```typescript
// schemas/expense.ts
import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  description: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  amount: z.number()
    .positive('El monto debe ser mayor a 0'),
  category_id: z.number()
    .positive('La categoría es requerida'),
  expense_date: z.string()
    .datetime('Fecha inválida'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'CHECK']),
  reference_number: z.string()
    .max(50)
    .optional(),
  tags: z.array(z.string())
    .optional()
});

export const UpdateExpenseSchema = CreateExpenseSchema.partial();

export type CreateExpenseData = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseData = z.infer<typeof UpdateExpenseSchema>;
```

### Autorización
```typescript
// middleware/expenseAuth.ts
export const requireExpenseAccess = (handler: NextApiHandler) => {
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
- **Lazy Loading**: Carga diferida de reportes detallados
- **Memoización**: Uso de React.memo para componentes de gastos
- **Virtualización**: Para listas largas de transacciones
- **Caching**: Cache de estadísticas financieras

### UX/UI
- **Skeleton Loading**: Estados de carga con esqueletos
- **Error Boundaries**: Manejo elegante de errores
- **Toast Notifications**: Notificaciones de éxito/error
- **Responsive Design**: Diseño adaptativo para todos los dispositivos
- **Real-time Updates**: Actualizaciones en tiempo real de gastos

## 🔮 Roadmap del Módulo

### Próximas Funcionalidades
- [ ] **Integración con Contabilidad**: Conexión con sistemas contables
- [ ] **Facturación Electrónica**: Gestión automática de facturas
- [ ] **Análisis Predictivo**: Predicción de gastos futuros
- [ ] **Sistema de Reembolsos**: Gestión de gastos reembolsables
- [ ] **Reportes Avanzados**: Análisis detallado de costos

### Mejoras Técnicas
- [ ] **WebSocket**: Actualizaciones en tiempo real
- [ ] **Offline Support**: Funcionalidad offline
- [ ] **Push Notifications**: Alertas de gastos
- [ ] **OCR Integration**: Lectura automática de facturas

---

**Módulo de Gastos** - Documentación Técnica v1.0

*Última actualización: Diciembre 2024*
*Versión del módulo: 1.0.0* 