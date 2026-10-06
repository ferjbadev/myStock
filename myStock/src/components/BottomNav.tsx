export type TabId = 'resumen' | 'ingresos' | 'gastos' | 'prestamos' | 'deudas'

/** El orden de este arreglo es el orden de la barra inferior. */
const TABS: { id: TabId; label: string; path: string }[] = [
  { id: 'resumen', label: 'Resumen', path: 'M4 13h4v7H4zM10 8h4v12h-4zM16 4h4v16h-4z' },
  { id: 'ingresos', label: 'Ingresos', path: 'M12 3l8 8h-5v10H9V11H4z' },
  { id: 'gastos', label: 'Gastos', path: 'M12 21l-8-8h5V3h6v10h5z' },
  {
    id: 'prestamos',
    label: 'Préstamos',
    path: 'M16 11a4 4 0 100-8 4 4 0 000 8zm-8 1a3 3 0 100-6 3 3 0 000 6zm0 2c-3 0-6 1.5-6 4v2h8v-2c0-1 .4-2 1-2.8A9 9 0 008 14zm8 0c-3.3 0-6 1.8-6 4v2h12v-2c0-2.2-2.7-4-6-4z',
  },
  {
    id: 'deudas',
    label: 'Deudas',
    path: 'M3 6h18v12H3zm2 3v6h14V9zm2 1.5h4V12H7zM7 13h7v1.5H7z',
  },
]

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch">
        {TABS.map((tab) => {
          const activa = tab.id === active
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={activa ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 py-2.5 ${
                  activa ? 'text-brand-soft' : 'text-muted'
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d={tab.path} />
                </svg>
                <span className="text-[10px]">{tab.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
