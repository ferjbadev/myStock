import type { Estado } from '../data/almacen'
import type { MesKey, Resumen } from '../types'
import { delMes, pendiente, sumarMontos } from './calculos'
import { hoyKey, mesActual } from './dates'

/** Arma todo lo que muestra la vista de Resumen para un mes. */
export function construirResumen(estado: Estado, mes: MesKey): Resumen {
  const gastos = delMes(estado.gastos, mes)
  const ingresos = delMes(estado.ingresos, mes)

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
    porCobrar: estado.prestamos.reduce((acc, p) => acc + pendiente(p), 0),
    porPagar: estado.deudas.reduce((acc, d) => acc + pendiente(d), 0),
    ultimosMovimientos,
  }
}
