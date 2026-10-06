interface Respuesta {
  data: unknown
  error: { message: string } | null
}

/**
 * Devuelve los datos de una respuesta de Supabase o lanza el error.
 * Las columnas se piden como string, así que el tipo de fila se indica aquí.
 */
export function desempaquetar<T>(res: Respuesta): T {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

export function aNumero(valor: unknown): number {
  return typeof valor === 'number' ? valor : Number(valor ?? 0)
}
