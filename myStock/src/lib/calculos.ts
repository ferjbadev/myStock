import type { DiaKey } from '../types'

export function sumarMontos(items: { monto: number }[]): number {
  return items.reduce((acc, item) => acc + item.monto, 0)
}

/** Monto que todavía falta por cobrar o pagar de un compromiso. */
export function pendiente(c: { monto: number; montoPagado: number }): number {
  return Math.max(0, c.monto - c.montoPagado)
}

export function estaLiquidado(c: { monto: number; montoPagado: number }): boolean {
  return pendiente(c) === 0
}

export interface GrupoDia<T> {
  dia: DiaKey
  items: T[]
  total: number
}

/** Agrupa movimientos por día (ciclo de 24 h), del más reciente al más viejo. */
export function agruparPorDia<T extends { fecha: DiaKey; monto: number }>(items: T[]): GrupoDia<T>[] {
  const grupos = new Map<DiaKey, T[]>()
  for (const item of items) {
    const lista = grupos.get(item.fecha) ?? []
    lista.push(item)
    grupos.set(item.fecha, lista)
  }

  return [...grupos.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dia, lista]) => ({ dia, items: lista, total: sumarMontos(lista) }))
}
