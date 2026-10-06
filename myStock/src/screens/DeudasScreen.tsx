import CompromisosScreen from './CompromisosScreen'
import { actualizarPagadoDeuda, agregarDeuda, eliminarDeuda } from '../data/almacen'
import { useAlmacen } from '../hooks/useAlmacen'
import type { Deuda } from '../types'

export default function DeudasScreen() {
  const { deudas } = useAlmacen()

  return (
    <CompromisosScreen<Deuda>
      titulo="Mis deudas"
      etiquetaPersona="¿A quién le debes?"
      etiquetaTotal="Por pagar"
      acento="#fb7185"
      items={deudas}
      nombreDe={(d) => d.acreedor}
      textoAbono="Registrar pago"
      textoVacio="No tienes deudas registradas."
      crear={agregarDeuda}
      actualizarPagado={actualizarPagadoDeuda}
      eliminar={eliminarDeuda}
    />
  )
}
