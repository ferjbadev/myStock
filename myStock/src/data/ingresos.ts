import { supabase } from '../lib/supabase'
import { rangoDelMes } from '../lib/dates'
import type { Ingreso, MesKey, NuevoIngreso } from '../types'
import { aNumero, desempaquetar } from './util'

const COLUMNAS = 'id, nombre, monto, fecha, creado_en'

interface Fila {
  id: string
  nombre: string
  monto: number | string
  fecha: string
  creado_en: string
}

function mapear(fila: Fila): Ingreso {
  return {
    id: fila.id,
    nombre: fila.nombre,
    monto: aNumero(fila.monto),
    fecha: fila.fecha,
    creadoEn: fila.creado_en,
  }
}

export async function listarIngresosDelMes(mes: MesKey): Promise<Ingreso[]> {
  const { desde, hasta } = rangoDelMes(mes)
  const filas = desempaquetar<Fila[]>(
    await supabase
      .from('ingresos')
      .select(COLUMNAS)
      .gte('fecha', desde)
      .lte('fecha', hasta)
      .order('fecha', { ascending: false })
      .order('creado_en', { ascending: false }),
  )
  return filas.map(mapear)
}

export async function crearIngreso(input: NuevoIngreso): Promise<Ingreso> {
  const fila = desempaquetar<Fila>(
    await supabase
      .from('ingresos')
      .insert({ nombre: input.nombre, monto: input.monto, fecha: input.fecha })
      .select(COLUMNAS)
      .single(),
  )
  return mapear(fila)
}

export async function eliminarIngreso(id: string): Promise<void> {
  desempaquetar(await supabase.from('ingresos').delete().eq('id', id))
}
