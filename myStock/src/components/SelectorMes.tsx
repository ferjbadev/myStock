import { desplazarMes, mesActual } from '../lib/dates'
import type { MesKey } from '../types'

interface Props {
  mes: MesKey
  onChange: (mes: MesKey) => void
}

export default function SelectorMes({ mes, onChange }: Props) {
  const esMesActual = mes === mesActual()
  const clase =
    'flex size-9 items-center justify-center rounded-full border border-line bg-surface text-muted active:bg-surface-2 disabled:opacity-30'

  return (
    <div className="flex shrink-0 gap-1">
      <button
        type="button"
        onClick={() => onChange(desplazarMes(mes, -1))}
        aria-label="Mes anterior"
        className={clase}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M15 5l-7 7 7 7z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange(desplazarMes(mes, 1))}
        disabled={esMesActual}
        aria-label="Mes siguiente"
        className={clase}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M9 5l7 7-7 7z" />
        </svg>
      </button>
    </div>
  )
}
