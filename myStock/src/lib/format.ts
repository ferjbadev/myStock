const bolivares = new Intl.NumberFormat('es-VE', {
  style: 'currency',
  currency: 'VES',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const bolivaresCompact = new Intl.NumberFormat('es-VE', {
  style: 'currency',
  currency: 'VES',
  maximumFractionDigits: 0,
})

/** Formatea un monto en bolívares, ej. Bs 1.234,56 */
export function formatBs(amount: number): string {
  return bolivares.format(amount)
}

/** Igual que formatBs pero sin decimales, para cifras grandes. */
export function formatBsCompact(amount: number): string {
  return bolivaresCompact.format(amount)
}

export function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${Math.round(value)}%`
}

/** Nombre del mes con año, ej. "octubre 2026" */
export function formatMonth(month: string): string {
  const [year, m] = month.split('-').map(Number)
  const label = new Date(year, m - 1, 1).toLocaleDateString('es-VE', {
    month: 'long',
    year: 'numeric',
  })
  return label
}

/** Fecha corta de un gasto, ej. "sáb 4 oct" */
export function formatShortDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('es-VE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
