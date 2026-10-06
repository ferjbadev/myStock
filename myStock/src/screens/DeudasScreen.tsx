import CompromisosScreen from './CompromisosScreen'
import { actualizarPagadoDeuda, crearDeuda, eliminarDeuda, listarDeudas } from '../data/deudas'
import { hoyKey } from '../lib/dates'
import type { Deuda } from '../types'

export default function DeudasScreen() {
  return (
    <CompromisosScreen<Deuda>
      titulo="Mis deudas"
      etiquetaPersona="¿A quién le debes?"
      etiquetaTotal="Por pagar"
      acento="#fb7185"
      nombreDe={(d) => d.acreedor}
      textoAbono="Registrar pago"
      textoVacio="No tienes deudas registradas."
      cargar={listarDeudas}
      crear={(acreedor, monto) => crearDeuda({ acreedor, monto, fecha: hoyKey() })}
      actualizarPagado={actualizarPagadoDeuda}
      eliminar={eliminarDeuda}
    />
  )
}
