import { useState } from 'react'
import { parsearMonto } from '../lib/format'
import { BotonPrincipal, Campo, EntradaMonto, EntradaTexto, Hoja } from './ui'

interface Props {
  titulo: string
  abierto: boolean
  onCerrar: () => void
  /** Se llama al guardar; si lanza error, se muestra y el modal sigue abierto. */
  onGuardar: (nombre: string, monto: number) => void | Promise<void>
  etiquetaNombre?: string
  placeholderNombre?: string
  /** En false solo pide el monto (ej. registrar un abono). */
  pedirNombre?: boolean
  textoBoton?: string
  nota?: string
}

/**
 * Modal único de registro para todas las vistas: pide un nombre y una cantidad
 * en dólares. Mantiene su propio estado y lo limpia al guardar.
 */
export default function ModalRegistro({
  titulo,
  abierto,
  onCerrar,
  onGuardar,
  etiquetaNombre = 'Nombre',
  placeholderNombre = 'Ej. mercado',
  pedirNombre = true,
  textoBoton = 'Guardar',
  nota,
}: Props) {
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cantidad = parsearMonto(monto)
  const valido = cantidad > 0 && (!pedirNombre || nombre.trim().length > 0)

  function limpiar() {
    setNombre('')
    setMonto('')
    setError(null)
  }

  function cerrar() {
    limpiar()
    onCerrar()
  }

  async function guardar() {
    if (!valido) return
    setGuardando(true)
    setError(null)
    try {
      await onGuardar(nombre.trim(), cantidad)
      limpiar()
      onCerrar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Hoja titulo={titulo} abierta={abierto} onCerrar={cerrar}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          guardar()
        }}
      >
        {nota && <p className="text-sm text-muted">{nota}</p>}

        {pedirNombre && (
          <Campo label={etiquetaNombre}>
            <EntradaTexto
              valor={nombre}
              onChange={setNombre}
              placeholder={placeholderNombre}
              autoFocus
            />
          </Campo>
        )}

        <Campo label="Cantidad en dólares">
          <EntradaMonto valor={monto} onChange={setMonto} autoFocus={!pedirNombre} />
        </Campo>

        {error && <p className="text-sm text-bad">{error}</p>}

        <BotonPrincipal type="submit" disabled={!valido || guardando}>
          {guardando ? 'Guardando...' : textoBoton}
        </BotonPrincipal>
      </form>
    </Hoja>
  )
}
