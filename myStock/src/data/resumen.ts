import { diasTranscurridos, hoyKey, mesActual, mesAnterior } from '../lib/dates'
import { pendiente, sumarMontos } from '../lib/calculos'
import type { MesKey, Resumen } from '../types'
import { listarCierresRecientes } from './cierres'
import { listarDeudas } from './deudas'
import { listarGastosDelMes } from './gastos'
import { listarIngresosDelMes } from './ingresos'
import { listarPrestamos } from './prestamos'

/** Carga todo lo que necesita la vista de Resumen en paralelo. */
export async function cargarResumen(mes: MesKey): Promise<Resumen> {
  const [gastos, ingresos, gastosPrevios, cierresRecientes, prestamos, deudas] = await Promise.all([
    listarGastosDelMes(mes),
    listarIngresosDelMes(mes),
    listarGastosDelMes(mesAnterior(mes)),
    listarCierresRecientes(7),
    listarPrestamos(),
    listarDeudas(),
  ])

  const hoy = hoyKey()
  const esMesActual = mes === mesActual()
  const gastosHoy = esMesActual ? gastos.filter((g) => g.fecha === hoy) : []
  const ingresosHoy = esMesActual ? ingresos.filter((i) => i.fecha === hoy) : []
  const totalGastosHoy = sumarMontos(gastosHoy)
  const totalIngresosHoy = sumarMontos(ingresosHoy)

  const mesGastos = sumarMontos(gastos)
  const mesIngresos = sumarMontos(ingresos)

  const ultimosMovimientos = [
    ...gastos.map((g) => ({ tipo: 'gasto' as const, ...g })),
    ...ingresos.map((i) => ({ tipo: 'ingreso' as const, ...i })),
  ]
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
    .slice(0, 6)

  return {
    mes,
    hoy: {
      gastos: totalGastosHoy,
      ingresos: totalIngresosHoy,
      saldo: totalIngresosHoy - totalGastosHoy,
      movimientos: gastosHoy.length + ingresosHoy.length,
    },
    mesGastos,
    mesIngresos,
    mesSaldo: mesIngresos - mesGastos,
    mesAnteriorGastos: sumarMontos(gastosPrevios),
    promedioDiario: mesGastos / diasTranscurridos(mes),
    cierresRecientes,
    porCobrar: prestamos.reduce((acc, p) => acc + pendiente(p), 0),
    porPagar: deudas.reduce((acc, d) => acc + pendiente(d), 0),
    ultimosMovimientos,
  }
}
