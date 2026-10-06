import { hoyKey, diaAnterior } from './dates'

const decimales = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Monto en dólares, ej. $1.234,56 */
export function formatUsd(monto: number): string {
  const signo = monto < 0 ? '-' : ''
  return `${signo}$${decimales.format(Math.abs(monto))}`
}

export function formatPorcentaje(valor: number): string {
  return `${valor > 0 ? '+' : ''}${Math.round(valor)}%`
}

function fechaLocal(dia: string): Date {
  const [year, month, day] = dia.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Nombre del mes con año, ej. "octubre 2026" */
export function formatMes(mes: string): string {
  const [year, m] = mes.split('-').map(Number)
  return new Date(year, m - 1, 1).toLocaleDateString('es-VE', { month: 'long', year: 'numeric' })
}

/** Fecha corta, ej. "sáb 4 oct" */
export function formatDiaCorto(dia: string): string {
  return fechaLocal(dia).toLocaleDateString('es-VE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/** "Hoy", "Ayer" o la fecha larga del día. */
export function formatDiaRelativo(dia: string): string {
  const hoy = hoyKey()
  if (dia === hoy) return 'Hoy'
  if (dia === diaAnterior(hoy)) return 'Ayer'
  return fechaLocal(dia).toLocaleDateString('es-VE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/** Hora de creación, ej. "11:35 p. m." */
export function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-VE', { hour: 'numeric', minute: '2-digit' })
}

/**
 * Convierte lo que escribió el usuario a número. Si hay coma, se asume formato
 * con coma decimal (1.500,50); si no, el punto se toma como decimal (1500.50).
 */
export function parsearMonto(valor: string): number {
  const limpio = valor.trim()
  const normalizado = limpio.includes(',') ? limpio.replace(/\./g, '').replace(',', '.') : limpio
  return Number(normalizado)
}

/** Tiempo restante en formato "5 h 12 min". */
export function formatRestante(ms: number): string {
  const totalMin = Math.max(0, Math.floor(ms / 60000))
  const horas = Math.floor(totalMin / 60)
  const min = totalMin % 60
  if (horas === 0) return `${min} min`
  return `${horas} h ${min} min`
}
