import { supabase } from '../lib/supabase'
import { hoyKey } from '../lib/dates'
import type { CierreDiario, DiaKey } from '../types'
import { aNumero, desempaquetar } from './util'

const COLUMNAS =
  'fecha, total_gastos, total_ingresos, cantidad_gastos, cantidad_ingresos, saldo, cerrado_en'

interface Fila {
  fecha: string
  total_gastos: number | string
  total_ingresos: number | string
  cantidad_gastos: number
  cantidad_ingresos: number
  saldo: number | string
  cerrado_en: string
}

function mapear(fila: Fila): CierreDiario {
  return {
    fecha: fila.fecha,
    totalGastos: aNumero(fila.total_gastos),
    totalIngresos: aNumero(fila.total_ingresos),
    cantidadGastos: fila.cantidad_gastos,
    cantidadIngresos: fila.cantidad_ingresos,
    saldo: aNumero(fila.saldo),
    cerradoEn: fila.cerrado_en,
  }
}

export async function listarCierresRecientes(limite = 7): Promise<CierreDiario[]> {
  const filas = desempaquetar<Fila[]>(
    await supabase
      .from('cierres_diarios')
      .select(COLUMNAS)
      .order('fecha', { ascending: false })
      .limit(limite),
  )
  return filas.map(mapear)
}

async function ultimaFechaCerrada(): Promise<DiaKey | null> {
  const filas = desempaquetar<{ fecha: string }[]>(
    await supabase
      .from('cierres_diarios')
      .select('fecha')
      .order('fecha', { ascending: false })
      .limit(1),
  )
  return filas[0]?.fecha ?? null
}

interface Acumulado {
  totalGastos: number
  totalIngresos: number
  cantidadGastos: number
  cantidadIngresos: number
}

function acumuladoVacio(): Acumulado {
  return { totalGastos: 0, totalIngresos: 0, cantidadGastos: 0, cantidadIngresos: 0 }
}

/**
 * Cierra los ciclos de 24 h que ya terminaron y aún no tienen consolidado.
 * Se ejecuta al abrir la app y al cruzar la medianoche. Es idempotente: los
 * días sin movimientos no generan fila y el `upsert` recalcula si hace falta.
 *
 * @returns las fechas que se cerraron en esta corrida.
 */
export async function cerrarDiasPendientes(): Promise<DiaKey[]> {
  const hoy = hoyKey()
  const ultima = await ultimaFechaCerrada()

  const gastosQuery = supabase.from('gastos').select('fecha, monto').lt('fecha', hoy)
  const ingresosQuery = supabase.from('ingresos').select('fecha, monto').lt('fecha', hoy)
  if (ultima) {
    gastosQuery.gt('fecha', ultima)
    ingresosQuery.gt('fecha', ultima)
  }

  const [gastos, ingresos] = await Promise.all([gastosQuery, ingresosQuery])
  type FilaMonto = { fecha: string; monto: number | string }
  const filasGastos = desempaquetar<FilaMonto[]>(gastos)
  const filasIngresos = desempaquetar<FilaMonto[]>(ingresos)

  const porDia = new Map<DiaKey, Acumulado>()
  const obtener = (fecha: DiaKey) => {
    const actual = porDia.get(fecha) ?? acumuladoVacio()
    porDia.set(fecha, actual)
    return actual
  }

  for (const fila of filasGastos) {
    const acumulado = obtener(fila.fecha)
    acumulado.totalGastos += aNumero(fila.monto)
    acumulado.cantidadGastos += 1
  }
  for (const fila of filasIngresos) {
    const acumulado = obtener(fila.fecha)
    acumulado.totalIngresos += aNumero(fila.monto)
    acumulado.cantidadIngresos += 1
  }

  if (porDia.size === 0) return []

  const nuevos = [...porDia.entries()].map(([fecha, a]) => ({
    fecha,
    total_gastos: a.totalGastos,
    total_ingresos: a.totalIngresos,
    cantidad_gastos: a.cantidadGastos,
    cantidad_ingresos: a.cantidadIngresos,
    cerrado_en: new Date().toISOString(),
  }))

  desempaquetar(await supabase.from('cierres_diarios').upsert(nuevos, { onConflict: 'fecha' }))
  return nuevos.map((n) => n.fecha).sort()
}

/**
 * Recalcula el consolidado de un día ya cerrado. Hace falta cuando se registra
 * o se borra un movimiento con fecha anterior a hoy.
 */
export async function recalcularCierre(dia: DiaKey): Promise<void> {
  if (dia >= hoyKey()) return

  const [gastos, ingresos] = await Promise.all([
    supabase.from('gastos').select('monto').eq('fecha', dia),
    supabase.from('ingresos').select('monto').eq('fecha', dia),
  ])
  const filasGastos = desempaquetar<{ monto: number | string }[]>(gastos)
  const filasIngresos = desempaquetar<{ monto: number | string }[]>(ingresos)

  if (filasGastos.length === 0 && filasIngresos.length === 0) {
    desempaquetar(await supabase.from('cierres_diarios').delete().eq('fecha', dia))
    return
  }

  desempaquetar(
    await supabase.from('cierres_diarios').upsert(
      {
        fecha: dia,
        total_gastos: filasGastos.reduce((acc, f) => acc + aNumero(f.monto), 0),
        total_ingresos: filasIngresos.reduce((acc, f) => acc + aNumero(f.monto), 0),
        cantidad_gastos: filasGastos.length,
        cantidad_ingresos: filasIngresos.length,
        cerrado_en: new Date().toISOString(),
      },
      { onConflict: 'fecha' },
    ),
  )
}
