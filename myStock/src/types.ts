/** Fecha en formato YYYY-MM-DD. */
export type DiaKey = string
/** Mes en formato YYYY-MM. */
export type MesKey = string

export interface Gasto {
  id: string
  nombre: string
  /** Monto en dólares. */
  monto: number
  fecha: DiaKey
  creadoEn: string
}

export interface Ingreso {
  id: string
  nombre: string
  monto: number
  fecha: DiaKey
  creadoEn: string
}

/** Dinero que presté y me deben devolver. */
export interface Prestamo {
  id: string
  persona: string
  monto: number
  montoPagado: number
  fecha: DiaKey
  creadoEn: string
}

/** Dinero que yo debo pagar. */
export interface Deuda {
  id: string
  acreedor: string
  monto: number
  montoPagado: number
  fecha: DiaKey
  creadoEn: string
}

/** Consolidado de un ciclo de 24 h ya terminado. */
export interface CierreDiario {
  fecha: DiaKey
  totalGastos: number
  totalIngresos: number
  cantidadGastos: number
  cantidadIngresos: number
  saldo: number
  cerradoEn: string
}

export type NuevoGasto = Omit<Gasto, 'id' | 'creadoEn'>
export type NuevoIngreso = Omit<Ingreso, 'id' | 'creadoEn'>
export type NuevoPrestamo = Omit<Prestamo, 'id' | 'creadoEn' | 'montoPagado'>
export type NuevaDeuda = Omit<Deuda, 'id' | 'creadoEn' | 'montoPagado'>

export interface Resumen {
  mes: MesKey
  /** Ciclo de hoy, todavía abierto. */
  hoy: { gastos: number; ingresos: number; saldo: number; movimientos: number }
  mesGastos: number
  mesIngresos: number
  mesSaldo: number
  /** Gastos del mes anterior, para comparar. */
  mesAnteriorGastos: number
  promedioDiario: number
  cierresRecientes: CierreDiario[]
  porCobrar: number
  porPagar: number
  ultimosMovimientos: (
    | ({ tipo: 'gasto' } & Gasto)
    | ({ tipo: 'ingreso' } & Ingreso)
  )[]
}
