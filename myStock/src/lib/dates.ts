import type { MonthKey } from '../types'

/** Convierte una fecha a clave de mes (YYYY-MM). */
export function toMonthKey(date: Date): MonthKey {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function currentMonthKey(): MonthKey {
  return toMonthKey(new Date())
}

/** Devuelve el mes anterior a la clave dada. */
export function previousMonthKey(month: MonthKey): MonthKey {
  const [year, m] = month.split('-').map(Number)
  return toMonthKey(new Date(year, m - 2, 1))
}

/** Días transcurridos del mes, o días totales si el mes ya terminó. */
export function elapsedDaysInMonth(month: MonthKey, today = new Date()): number {
  const [year, m] = month.split('-').map(Number)
  const daysInMonth = new Date(year, m, 0).getDate()
  if (toMonthKey(today) !== month) return daysInMonth
  return today.getDate()
}
