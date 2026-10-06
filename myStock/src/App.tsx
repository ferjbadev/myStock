import { useEffect, useState } from 'react'
import BottomNav, { type TabId } from './components/BottomNav'
import DeudasScreen from './screens/DeudasScreen'
import GastosScreen from './screens/GastosScreen'
import IngresosScreen from './screens/IngresosScreen'
import PrestamosScreen from './screens/PrestamosScreen'
import ResumenScreen from './screens/ResumenScreen'
import SinConfigurar from './screens/SinConfigurar'
import { cerrarDiasPendientes } from './data/cierres'
import { hoyKey, msHastaMedianoche } from './lib/dates'
import { supabaseConfigurado } from './lib/supabase'

/**
 * Cierra los ciclos de 24 h pendientes al abrir la app y vuelve a hacerlo
 * justo después de cada medianoche. Devuelve el día en curso, que se usa como
 * `key` de las pantallas para que recarguen datos al cambiar el ciclo.
 */
function useCierreDiario(): string {
  const [ciclo, setCiclo] = useState(hoyKey())

  useEffect(() => {
    if (!supabaseConfigurado) return
    let activo = true
    let timeout = 0

    async function cerrar() {
      try {
        await cerrarDiasPendientes()
      } catch (e) {
        console.error('No se pudo cerrar el ciclo diario', e)
      }
      if (!activo) return
      setCiclo(hoyKey())
      timeout = window.setTimeout(cerrar, msHastaMedianoche() + 2_000)
    }

    cerrar()

    return () => {
      activo = false
      window.clearTimeout(timeout)
    }
  }, [])

  return ciclo
}

export default function App() {
  const [tab, setTab] = useState<TabId>('resumen')
  const ciclo = useCierreDiario()

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-28">
      {!supabaseConfigurado ? (
        <SinConfigurar />
      ) : (
        <div key={`${tab}-${ciclo}`}>
          {tab === 'resumen' && <ResumenScreen onIrA={setTab} />}
          {tab === 'gastos' && <GastosScreen />}
          {tab === 'ingresos' && <IngresosScreen />}
          {tab === 'prestamos' && <PrestamosScreen />}
          {tab === 'deudas' && <DeudasScreen />}
        </div>
      )}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
