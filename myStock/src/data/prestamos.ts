import type { NuevoPrestamo, Prestamo } from '../types'
import { crearApiCompromisos } from './compromisos'

const api = crearApiCompromisos<Prestamo, NuevoPrestamo>('prestamos', 'persona')

export const listarPrestamos = api.listar
export const crearPrestamo = api.crear
export const actualizarPagadoPrestamo = api.actualizarPagado
export const eliminarPrestamo = api.eliminar
