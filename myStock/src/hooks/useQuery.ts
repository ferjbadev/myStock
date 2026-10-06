import { useCallback, useEffect, useState } from 'react'

interface Estado<T> {
  token: number
  data: T | null
  error: string | null
}

/**
 * Carga datos asíncronos con estados de carga y error.
 * El `loader` debe ser estable (función de módulo o `useCallback`).
 */
export function useQuery<T>(loader: () => Promise<T>) {
  const [token, setToken] = useState(0)
  const [estado, setEstado] = useState<Estado<T> | null>(null)

  useEffect(() => {
    let activo = true

    loader()
      .then((data) => {
        if (activo) setEstado({ token, data, error: null })
      })
      .catch((e: unknown) => {
        if (activo) {
          setEstado({ token, data: null, error: e instanceof Error ? e.message : 'Error inesperado' })
        }
      })

    return () => {
      activo = false
    }
  }, [loader, token])

  const recargar = useCallback(() => setToken((t) => t + 1), [])

  // Un resultado de una carga anterior no cuenta: seguimos cargando.
  const vigente = estado?.token === token ? estado : null
  return {
    data: vigente?.data ?? null,
    error: vigente?.error ?? null,
    loading: vigente === null,
    recargar,
  }
}
