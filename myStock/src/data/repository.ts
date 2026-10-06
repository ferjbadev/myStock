import type { Expense, MonthKey, NewExpense } from '../types'

/**
 * Contrato de acceso a datos. Hoy lo resuelve `mockRepository`; cuando
 * conectemos Supabase basta con crear otra implementación y cambiarla en
 * `src/data/index.ts` sin tocar la UI.
 */
export interface ExpensesRepository {
  listByMonth(month: MonthKey): Promise<Expense[]>
  create(input: NewExpense): Promise<Expense>
  remove(id: string): Promise<void>
}
