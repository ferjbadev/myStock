import { supabase } from '../lib/supabase'
import { rangoDelMes } from '../lib/dates'
import type { Gasto, MesKey, NuevoGasto } from '../types'
import { aNumero, desempaquetar } from './util'

const COLUMNAS = 'id, nombre, monto, fecha, creado_en'

interface Fila {
  id: string
  nombre: string
  monto: number | string
  fecha: string
  creado_en: string
}

function mapear(fila: Fila): Gasto {
  return {
    id: fila.id,
    nombre: fila.nombre,
    monto: aNumero(fila.monto),
    fecha: fila.fecha,
    creadoEn: fila.creado_en,
  }
}

export async function listarGastosDelMes(mes: MesKey): Promise<Gasto[]> {
  const { desde, hasta } = rangoDelMes(mes)
  const filas = desempaquetar<Fila[]>(
    await supabase
      .from('gastos')
      .select(COLUMNAS)
      .gte('fecha', desde)
      .lte('fecha', hasta)
      .order('fecha', { ascending: false })
      .order('creado_en', { ascending: false }),
  )
  return filas.map(mapear)
}

export async function crearGasto(input: NuevoGasto): Promise<Gasto> {
  const fila = desempaquetar<Fila>(
    await supabase
      .from('gastos')
      .insert({ nombre: input.nombre, monto: input.monto, fecha: input.fecha })
      .select(COLUMNAS)
      .single(),
  )
  return mapear(fila)
}

export async function eliminarGasto(id: string): Promise<void> {
  desempaquetar(await supabase.from('gastos').delete().eq('id', id))
}
