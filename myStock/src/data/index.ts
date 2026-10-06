import { createMockRepository } from './mockRepository'
import type { ExpensesRepository } from './repository'

/** Fuente de datos única de la app. Reemplazar por Supabase cuando esté listo. */
export const expensesRepository: ExpensesRepository = createMockRepository()

export type { ExpensesRepository }
