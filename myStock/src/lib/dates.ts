import type { DiaKey, MesKey } from '../types'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Fecha local a clave de día (YYYY-MM-DD). */
export function aDiaKey(date: Date): DiaKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Fecha local a clave de mes (YYYY-MM). */
export function aMesKey(date: Date): MesKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function hoyKey(): DiaKey {
  return aDiaKey(new Date())
}

export function mesActual(): MesKey {
  return aMesKey(new Date())
}

export function mesDe(dia: DiaKey): MesKey {
  return dia.slice(0, 7)
}

export function mesAnterior(mes: MesKey): MesKey {
  const [year, m] = mes.split('-').map(Number)
  return aMesKey(new Date(year, m - 2, 1))
}

export function desplazarMes(mes: MesKey, delta: number): MesKey {
  const [year, m] = mes.split('-').map(Number)
  return aMesKey(new Date(year, m - 1 + delta, 1))
}

/** Primer y último día del mes, inclusive. */
export function rangoDelMes(mes: MesKey): { desde: DiaKey; hasta: DiaKey } {
  const [year, m] = mes.split('-').map(Number)
  return { desde: `${mes}-01`, hasta: aDiaKey(new Date(year, m, 0)) }
}

export function diaAnterior(dia: DiaKey, dias = 1): DiaKey {
  const [year, m, d] = dia.split('-').map(Number)
  return aDiaKey(new Date(year, m - 1, d - dias))
}

/** Días transcurridos del mes; si el mes ya pasó, sus días totales. */
export function diasTranscurridos(mes: MesKey, hoy = new Date()): number {
  const [year, m] = mes.split('-').map(Number)
  const total = new Date(year, m, 0).getDate()
  if (aMesKey(hoy) !== mes) return total
  return hoy.getDate()
}

/** Milisegundos que faltan para la medianoche local (próximo cierre). */
export function msHastaMedianoche(ahora = new Date()): number {
  const manana = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1)
  return manana.getTime() - ahora.getTime()
}
