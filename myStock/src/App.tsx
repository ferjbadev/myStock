import { useState } from 'react'
import BottomNav, { type TabId } from './components/BottomNav'
import SummaryScreen from './components/SummaryScreen'
import { currentMonthKey } from './lib/dates'

const PENDING_LABELS: Record<Exclude<TabId, 'resumen'>, string> = {
  gastos: 'Lista de gastos',
  agregar: 'Registrar gasto',
  reportes: 'Reportes',
  ajustes: 'Ajustes',
}

function Placeholder({ tab }: { tab: Exclude<TabId, 'resumen'> }) {
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-lg font-semibold">{PENDING_LABELS[tab]}</h1>
      <p className="max-w-xs text-sm text-muted">Esta sección todavía no está lista.</p>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState<TabId>('resumen')
  const [month, setMonth] = useState(currentMonthKey())

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-28">
      {tab === 'resumen' ? (
        <SummaryScreen month={month} onMonthChange={setMonth} />
      ) : (
        <Placeholder tab={tab} />
      )}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
