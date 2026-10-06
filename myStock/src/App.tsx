import { useEffect, useState } from 'react'
import BottomNav, { type TabId } from './components/BottomNav'
import DeudasScreen from './screens/DeudasScreen'
import GastosScreen from './screens/GastosScreen'
import IngresosScreen from './screens/IngresosScreen'
import PrestamosScreen from './screens/PrestamosScreen'
import ResumenScreen from './screens/ResumenScreen'
import { hoyKey, msHastaMedianoche } from './lib/dates'

/**
 * Día en curso. Cambia pasada la medianoche para que las vistas recalculen:
 * el ciclo de hoy se cierra y empieza uno nuevo.
 */
function useCicloActual(): string {
  const [ciclo, setCiclo] = useState(hoyKey())

  useEffect(() => {
    let timeout = 0

    function programar() {
      timeout = window.setTimeout(() => {
        setCiclo(hoyKey())
        programar()
      }, msHastaMedianoche() + 2_000)
    }

    programar()
    return () => window.clearTimeout(timeout)
  }, [])

  return ciclo
}

export default function App() {
  const [tab, setTab] = useState<TabId>('resumen')
  const ciclo = useCicloActual()

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-28">
      <div key={ciclo}>
        {tab === 'resumen' && <ResumenScreen onIrA={setTab} />}
        {tab === 'ingresos' && <IngresosScreen />}
        {tab === 'gastos' && <GastosScreen />}
        {tab === 'prestamos' && <PrestamosScreen />}
        {tab === 'deudas' && <DeudasScreen />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
