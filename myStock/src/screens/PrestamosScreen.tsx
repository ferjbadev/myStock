import CompromisosScreen from './CompromisosScreen'
import {
  actualizarPagadoPrestamo,
  crearPrestamo,
  eliminarPrestamo,
  listarPrestamos,
} from '../data/prestamos'
import { hoyKey } from '../lib/dates'
import type { Prestamo } from '../types'

export default function PrestamosScreen() {
  return (
    <CompromisosScreen<Prestamo>
      titulo="Mis préstamos"
      etiquetaPersona="¿A quién le prestaste?"
      etiquetaTotal="Por cobrar"
      acento="#34d399"
      nombreDe={(p) => p.persona}
      textoAbono="Registrar cobro"
      textoVacio="No le has prestado dinero a nadie."
      cargar={listarPrestamos}
      crear={(persona, monto) => crearPrestamo({ persona, monto, fecha: hoyKey() })}
      actualizarPagado={actualizarPagadoPrestamo}
      eliminar={eliminarPrestamo}
    />
  )
}
