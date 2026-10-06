import type { CierreDiario, DiaKey, Gasto, Ingreso, MesKey } from '../types'
import { hoyKey } from './dates'

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

/** Movimientos de un mes, del más reciente al más viejo. */
export function delMes<T extends { fecha: DiaKey; creadoEn: string }>(
  items: T[],
  mes: MesKey,
): T[] {
  return items
    .filter((item) => item.fecha.startsWith(mes))
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creadoEn.localeCompare(a.creadoEn))
}

export interface GrupoDia<T> {
  dia: DiaKey
  items: T[]
  total: number
}

/** Agrupa movimientos por día (ciclo de 24 h), del más reciente al más viejo. */
export function agruparPorDia<T extends { fecha: DiaKey; monto: number }>(
  items: T[],
): GrupoDia<T>[] {
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

/**
 * Consolidado de los ciclos de 24 h que ya terminaron, del más reciente al más
 * viejo. Se calcula a partir de los movimientos: un día queda "cerrado" en
 * cuanto pasa la medianoche.
 */
export function cierresDiarios(
  gastos: Gasto[],
  ingresos: Ingreso[],
  limite = 7,
): CierreDiario[] {
  const hoy = hoyKey()
  const porDia = new Map<DiaKey, CierreDiario>()

  const obtener = (fecha: DiaKey): CierreDiario => {
    const actual = porDia.get(fecha) ?? {
      fecha,
      totalGastos: 0,
      totalIngresos: 0,
      cantidadGastos: 0,
      cantidadIngresos: 0,
      saldo: 0,
    }
    porDia.set(fecha, actual)
    return actual
  }

  for (const gasto of gastos) {
    if (gasto.fecha >= hoy) continue
    const cierre = obtener(gasto.fecha)
    cierre.totalGastos += gasto.monto
    cierre.cantidadGastos += 1
  }
  for (const ingreso of ingresos) {
    if (ingreso.fecha >= hoy) continue
    const cierre = obtener(ingreso.fecha)
    cierre.totalIngresos += ingreso.monto
    cierre.cantidadIngresos += 1
  }

  return [...porDia.values()]
    .map((cierre) => ({ ...cierre, saldo: cierre.totalIngresos - cierre.totalGastos }))
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, limite)
}
