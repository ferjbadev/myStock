import type { GrupoDia } from '../lib/calculos'
import { formatDiaRelativo, formatHora, formatUsd } from '../lib/format'
import { hoyKey } from '../lib/dates'
import { Card, Vacio } from './ui'

export interface ItemMovimiento {
  id: string
  nombre: string
  monto: number
  fecha: string
  creadoEn: string
}

interface Props<T extends ItemMovimiento> {
  grupos: GrupoDia<T>[]
  signo: '+' | '-'
  onEliminar: (item: T) => void
  vacio: string
}

/**
 * Lista de movimientos agrupada por ciclo de 24 h. Cada grupo muestra su total
 * y marca si el día ya está cerrado o sigue abierto.
 */
export default function ListaPorDia<T extends ItemMovimiento>({
  grupos,
  signo,
  onEliminar,
  vacio,
}: Props<T>) {
  if (grupos.length === 0) {
    return (
      <Card>
        <Vacio mensaje={vacio} />
      </Card>
    )
  }

  const hoy = hoyKey()
  const colorTotal = signo === '+' ? 'text-good' : 'text-white'

  return (
    <div className="space-y-3">
      {grupos.map((grupo) => (
        <Card key={grupo.dia}>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold capitalize">
                {formatDiaRelativo(grupo.dia)}
              </h2>
              <p className="text-[11px] text-muted">
                {grupo.dia === hoy ? 'Ciclo abierto' : 'Ciclo cerrado'} · {grupo.items.length}{' '}
                {grupo.items.length === 1 ? 'movimiento' : 'movimientos'}
              </p>
            </div>
            <span className={`shrink-0 text-sm font-semibold tabular-nums ${colorTotal}`}>
              {signo}
              {formatUsd(grupo.total)}
            </span>
          </div>

          <ul className="divide-y divide-line">
            {grupo.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.nombre}</p>
                  <p className="text-[11px] text-muted">{formatHora(item.creadoEn)}</p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums">
                  {formatUsd(item.monto)}
                </span>
                <button
                  type="button"
                  onClick={() => onEliminar(item)}
                  aria-label="Eliminar"
                  className="shrink-0 text-muted active:text-bad"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                    <path d="M9 3h6l1 2h4v2H4V5h4zM6 9h12l-1 12H7z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  )
}
