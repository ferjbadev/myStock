import type { Deuda, Gasto, Ingreso, Prestamo } from '../types'
import { hoyKey } from '../lib/dates'

const CLAVE = 'mystock.v1'

export interface Estado {
  gastos: Gasto[]
  ingresos: Ingreso[]
  prestamos: Prestamo[]
  deudas: Deuda[]
}

const VACIO: Estado = { gastos: [], ingresos: [], prestamos: [], deudas: [] }

function lista<T>(valor: unknown): T[] {
  return Array.isArray(valor) ? (valor as T[]) : []
}

function leer(): Estado {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return VACIO
    const datos = JSON.parse(crudo) as Partial<Estado>
    return {
      gastos: lista<Gasto>(datos.gastos),
      ingresos: lista<Ingreso>(datos.ingresos),
      prestamos: lista<Prestamo>(datos.prestamos),
      deudas: lista<Deuda>(datos.deudas),
    }
  } catch (e) {
    // Datos corruptos: mejor arrancar vacío que romper la app.
    console.error('No se pudo leer el almacenamiento local', e)
    return VACIO
  }
}

let estado = leer()
const oyentes = new Set<() => void>()

function escribir(siguiente: Estado) {
  estado = siguiente
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch (e) {
    // Sin espacio o en modo privado: al menos la sesión actual sigue viva.
    console.error('No se pudo guardar en el teléfono', e)
  }
  for (const oyente of oyentes) oyente()
}

/** Para `useSyncExternalStore`. */
export function suscribirse(oyente: () => void): () => void {
  oyentes.add(oyente)
  return () => oyentes.delete(oyente)
}

export function obtenerEstado(): Estado {
  return estado
}

function nuevoId(): string {
  return crypto.randomUUID()
}

function ahora(): string {
  return new Date().toISOString()
}

// --- Gastos e ingresos ------------------------------------------------------

export function agregarGasto(nombre: string, monto: number): void {
  const gasto: Gasto = { id: nuevoId(), nombre, monto, fecha: hoyKey(), creadoEn: ahora() }
  escribir({ ...estado, gastos: [gasto, ...estado.gastos] })
}

export function eliminarGasto(id: string): void {
  escribir({ ...estado, gastos: estado.gastos.filter((g) => g.id !== id) })
}

export function agregarIngreso(nombre: string, monto: number): void {
  const ingreso: Ingreso = { id: nuevoId(), nombre, monto, fecha: hoyKey(), creadoEn: ahora() }
  escribir({ ...estado, ingresos: [ingreso, ...estado.ingresos] })
}

export function eliminarIngreso(id: string): void {
  escribir({ ...estado, ingresos: estado.ingresos.filter((i) => i.id !== id) })
}

// --- Préstamos y deudas -----------------------------------------------------

export function agregarPrestamo(persona: string, monto: number): void {
  const prestamo: Prestamo = {
    id: nuevoId(),
    persona,
    monto,
    montoPagado: 0,
    fecha: hoyKey(),
    creadoEn: ahora(),
  }
  escribir({ ...estado, prestamos: [prestamo, ...estado.prestamos] })
}

export function actualizarPagadoPrestamo(id: string, montoPagado: number): void {
  escribir({
    ...estado,
    prestamos: estado.prestamos.map((p) => (p.id === id ? { ...p, montoPagado } : p)),
  })
}

export function eliminarPrestamo(id: string): void {
  escribir({ ...estado, prestamos: estado.prestamos.filter((p) => p.id !== id) })
}

export function agregarDeuda(acreedor: string, monto: number): void {
  const deuda: Deuda = {
    id: nuevoId(),
    acreedor,
    monto,
    montoPagado: 0,
    fecha: hoyKey(),
    creadoEn: ahora(),
  }
  escribir({ ...estado, deudas: [deuda, ...estado.deudas] })
}

export function actualizarPagadoDeuda(id: string, montoPagado: number): void {
  escribir({
    ...estado,
    deudas: estado.deudas.map((d) => (d.id === id ? { ...d, montoPagado } : d)),
  })
}

export function eliminarDeuda(id: string): void {
  escribir({ ...estado, deudas: estado.deudas.filter((d) => d.id !== id) })
}
