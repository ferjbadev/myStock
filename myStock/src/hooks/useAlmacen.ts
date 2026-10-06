import { useSyncExternalStore } from 'react'
import { obtenerEstado, suscribirse, type Estado } from '../data/almacen'

/** Datos guardados en el teléfono. Se re-renderiza al guardar o borrar algo. */
export function useAlmacen(): Estado {
  return useSyncExternalStore(suscribirse, obtenerEstado)
}
