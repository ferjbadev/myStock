import type { Deuda, NuevaDeuda } from '../types'
import { crearApiCompromisos } from './compromisos'

const api = crearApiCompromisos<Deuda, NuevaDeuda>('deudas', 'acreedor')

export const listarDeudas = api.listar
export const crearDeuda = api.crear
export const actualizarPagadoDeuda = api.actualizarPagado
export const eliminarDeuda = api.eliminar
