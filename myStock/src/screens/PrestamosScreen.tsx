import CompromisosScreen from './CompromisosScreen'
import {
  actualizarPagadoPrestamo,
  agregarPrestamo,
  eliminarPrestamo,
} from '../data/almacen'
import { useAlmacen } from '../hooks/useAlmacen'
import type { Prestamo } from '../types'

export default function PrestamosScreen() {
  const { prestamos } = useAlmacen()

  return (
    <CompromisosScreen<Prestamo>
      titulo="Mis préstamos"
      etiquetaPersona="¿A quién le prestaste?"
      etiquetaTotal="Por cobrar"
      acento="#34d399"
      items={prestamos}
      nombreDe={(p) => p.persona}
      textoAbono="Registrar cobro"
      textoVacio="No le has prestado dinero a nadie."
      crear={agregarPrestamo}
      actualizarPagado={actualizarPagadoPrestamo}
      eliminar={eliminarPrestamo}
    />
  )
}
