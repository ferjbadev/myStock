import { supabase } from '../lib/supabase'
import { aNumero, desempaquetar } from './util'

/**
 * Préstamos y deudas comparten estructura: alguien, un monto y lo ya abonado.
 * Esta fábrica evita duplicar el acceso a datos de las dos tablas.
 */
interface Fila {
  id: string
  monto: number | string
  monto_pagado: number | string
  fecha: string
  creado_en: string
  [columna: string]: unknown
}

interface NuevoCompromiso {
  monto: number
  fecha: string
}

export function crearApiCompromisos<T, N extends NuevoCompromiso>(
  tabla: 'prestamos' | 'deudas',
  campoPersona: 'persona' | 'acreedor',
) {
  const columnas = `id, ${campoPersona}, monto, monto_pagado, fecha, creado_en`

  function mapear(fila: Fila): T {
    return {
      id: fila.id,
      [campoPersona]: fila[campoPersona] as string,
      monto: aNumero(fila.monto),
      montoPagado: aNumero(fila.monto_pagado),
      fecha: fila.fecha,
      creadoEn: fila.creado_en,
    } as T
  }

  return {
    async listar(): Promise<T[]> {
      const filas = desempaquetar<Fila[]>(
        await supabase
          .from(tabla)
          .select(columnas)
          .order('fecha', { ascending: false })
          .order('creado_en', { ascending: false }),
      )
      return filas.map(mapear)
    },

    async crear(input: N): Promise<T> {
      const persona = (input as unknown as Record<string, string>)[campoPersona]
      const fila = desempaquetar<Fila>(
        await supabase
          .from(tabla)
          .insert({ [campoPersona]: persona, monto: input.monto, fecha: input.fecha })
          .select(columnas)
          .single(),
      )
      return mapear(fila)
    },

    /** Fija el total abonado (no suma: el llamador calcula el nuevo total). */
    async actualizarPagado(id: string, montoPagado: number): Promise<void> {
      desempaquetar(
        await supabase.from(tabla).update({ monto_pagado: montoPagado }).eq('id', id),
      )
    },

    async eliminar(id: string): Promise<void> {
      desempaquetar(await supabase.from(tabla).delete().eq('id', id))
    },
  }
}
