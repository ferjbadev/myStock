export type CategoryId =
  | 'comida'
  | 'transporte'
  | 'servicios'
  | 'salud'
  | 'hogar'
  | 'ocio'
  | 'otros'

export interface Category {
  id: CategoryId
  label: string
  color: string
}

export type PaymentMethod = 'efectivo' | 'debito' | 'credito' | 'pagomovil'

export interface Expense {
  id: string
  /** Monto en bolívares. */
  amount: number
  categoryId: CategoryId
  description: string
  /** Fecha del gasto en formato ISO (YYYY-MM-DD). */
  date: string
  method: PaymentMethod
}

export type NewExpense = Omit<Expense, 'id'>

/** Mes en formato YYYY-MM. */
export type MonthKey = string

export interface CategoryTotal {
  category: Category
  total: number
  /** Porcentaje del total del mes, de 0 a 100. */
  share: number
}

export interface MonthSummary {
  month: MonthKey
  total: number
  previousTotal: number
  /** Variación porcentual respecto al mes anterior, o null si no hay base. */
  change: number | null
  dailyAverage: number
  byCategory: CategoryTotal[]
  recent: Expense[]
}
