import type { Category, CategoryId, PaymentMethod } from './types'

/** Presupuesto mensual en bolívares. */
export const MONTHLY_BUDGET = 4500

export const CATEGORIES: Category[] = [
  { id: 'comida', label: 'Comida', color: '#f97316' },
  { id: 'transporte', label: 'Transporte', color: '#38bdf8' },
  { id: 'servicios', label: 'Servicios', color: '#a78bfa' },
  { id: 'salud', label: 'Salud', color: '#f43f5e' },
  { id: 'hogar', label: 'Hogar', color: '#34d399' },
  { id: 'ocio', label: 'Ocio', color: '#fbbf24' },
  { id: 'otros', label: 'Otros', color: '#94a3b8' },
]

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.id, c]))

export function getCategory(id: CategoryId): Category {
  return CATEGORY_MAP.get(id) ?? CATEGORIES[CATEGORIES.length - 1]
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  debito: 'Débito',
  credito: 'Crédito',
  pagomovil: 'Pago móvil',
}
