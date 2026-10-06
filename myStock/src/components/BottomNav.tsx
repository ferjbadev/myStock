export type TabId = 'resumen' | 'gastos' | 'agregar' | 'reportes' | 'ajustes'

const TABS: { id: TabId; label: string; path: string }[] = [
  { id: 'resumen', label: 'Resumen', path: 'M4 13h4v7H4zM10 8h4v12h-4zM16 4h4v16h-4z' },
  { id: 'gastos', label: 'Gastos', path: 'M4 6h16v4H4zM4 12h16v2H4zM4 16h10v2H4z' },
  { id: 'agregar', label: 'Agregar', path: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z' },
  { id: 'reportes', label: 'Reportes', path: 'M12 3a9 9 0 109 9h-9z' },
  { id: 'ajustes', label: 'Ajustes', path: 'M12 8a4 4 0 100 8 4 4 0 000-8zm0-6l1.6 2.6 3-.6.4 3 2.6 1.6-1.6 2.8 1.6 2.8-2.6 1.6-.4 3-3-.6L12 22l-1.6-2.6-3 .6-.4-3L4.4 15.4 6 12.6 4.4 9.8 7 8.2l.4-3 3 .6z' },
]

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          const isAdd = tab.id === 'agregar'
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="flex w-full flex-col items-center gap-1 py-2.5 transition-colors"
              >
                <span
                  className={
                    isAdd
                      ? 'flex size-9 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30'
                      : isActive
                        ? 'text-brand-soft'
                        : 'text-muted'
                  }
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                    <path d={tab.path} />
                  </svg>
                </span>
                <span className={`text-[11px] ${isActive && !isAdd ? 'text-brand-soft' : 'text-muted'}`}>
                  {tab.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
