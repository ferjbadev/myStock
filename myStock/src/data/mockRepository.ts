import type { Expense, MonthKey, NewExpense } from '../types'
import { currentMonthKey, previousMonthKey } from '../lib/dates'
import type { ExpensesRepository } from './repository'

function day(month: MonthKey, d: number): string {
  return `${month}-${String(d).padStart(2, '0')}`
}

function seed(): Expense[] {
  const thisMonth = currentMonthKey()
  const lastMonth = previousMonthKey(thisMonth)

  const rows: Omit<Expense, 'id'>[] = [
    { amount: 320, categoryId: 'comida', description: 'Mercado semanal', date: day(thisMonth, 2), method: 'debito' },
    { amount: 45, categoryId: 'transporte', description: 'Gasolina', date: day(thisMonth, 2), method: 'efectivo' },
    { amount: 180, categoryId: 'servicios', description: 'Internet', date: day(thisMonth, 3), method: 'pagomovil' },
    { amount: 60, categoryId: 'ocio', description: 'Cine', date: day(thisMonth, 4), method: 'credito' },
    { amount: 95, categoryId: 'comida', description: 'Almuerzo trabajo', date: day(thisMonth, 4), method: 'efectivo' },
    { amount: 210, categoryId: 'salud', description: 'Farmacia', date: day(thisMonth, 5), method: 'debito' },
    { amount: 130, categoryId: 'hogar', description: 'Productos de limpieza', date: day(thisMonth, 5), method: 'pagomovil' },
    { amount: 1450, categoryId: 'comida', description: 'Mercado del mes', date: day(lastMonth, 8), method: 'debito' },
    { amount: 620, categoryId: 'servicios', description: 'Luz y agua', date: day(lastMonth, 12), method: 'pagomovil' },
    { amount: 480, categoryId: 'transporte', description: 'Mantenimiento carro', date: day(lastMonth, 20), method: 'credito' },
  ]

  return rows.map((row, i) => ({ ...row, id: `seed-${i + 1}` }))
}

/** Implementación en memoria para desarrollar la UI sin backend. */
export function createMockRepository(): ExpensesRepository {
  let expenses = seed()

  return {
    async listByMonth(month) {
      return expenses
        .filter((e) => e.date.startsWith(month))
        .sort((a, b) => b.date.localeCompare(a.date))
    },
    async create(input: NewExpense) {
      const expense: Expense = { ...input, id: crypto.randomUUID() }
      expenses = [expense, ...expenses]
      return expense
    },
    async remove(id) {
      expenses = expenses.filter((e) => e.id !== id)
    },
  }
}
