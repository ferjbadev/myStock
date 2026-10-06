import { MONTHLY_BUDGET, PAYMENT_LABELS } from '../config'
import { useMonthSummary } from '../hooks/useMonthSummary'
import { currentMonthKey } from '../lib/dates'
import { formatBs, formatMonth, formatPercent, formatShortDate } from '../lib/format'
import type { MonthKey } from '../types'

interface Props {
  month: MonthKey
  onMonthChange: (month: MonthKey) => void
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-4 ${className}`}>{children}</section>
  )
}

export default function SummaryScreen({ month, onMonthChange }: Props) {
  const { summary, loading, error } = useMonthSummary(month)
  const isCurrentMonth = month === currentMonthKey()

  function shiftMonth(delta: number) {
    const [year, m] = month.split('-').map(Number)
    const next = new Date(year, m - 1 + delta, 1)
    onMonthChange(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`)
  }

  const remaining = MONTHLY_BUDGET - (summary?.total ?? 0)
  const usedShare = Math.min(100, ((summary?.total ?? 0) / MONTHLY_BUDGET) * 100)
  const overBudget = remaining < 0

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Resumen de</p>
          <h1 className="text-xl font-semibold capitalize">{formatMonth(month)}</h1>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Mes anterior"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-muted active:bg-surface-2"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M15 5l-7 7 7 7z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            disabled={isCurrentMonth}
            aria-label="Mes siguiente"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-muted active:bg-surface-2 disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M9 5l7 7-7 7z" />
            </svg>
          </button>
        </div>
      </header>

      {error && (
        <Card className="text-sm text-bad">{error}</Card>
      )}

      {loading && !summary && (
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-surface" />
          <div className="h-32 animate-pulse rounded-2xl bg-surface" />
        </div>
      )}

      {summary && (
        <>
          <Card className="bg-linear-to-br from-brand/25 via-surface to-surface">
            <p className="text-xs text-muted">Total gastado</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight">{formatBs(summary.total)}</p>

            <div className="mt-2 flex items-center gap-2 text-xs">
              {summary.change === null ? (
                <span className="text-muted">Sin datos del mes anterior</span>
              ) : (
                <>
                  <span className={summary.change > 0 ? 'text-bad' : 'text-good'}>
                    {formatPercent(summary.change)}
                  </span>
                  <span className="text-muted">vs. mes anterior ({formatBs(summary.previousTotal)})</span>
                </>
              )}
            </div>

            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted">Presupuesto {formatBs(MONTHLY_BUDGET)}</span>
                <span className={overBudget ? 'text-bad' : 'text-good'}>
                  {overBudget ? `${formatBs(Math.abs(remaining))} de más` : `${formatBs(remaining)} libres`}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full ${overBudget ? 'bg-bad' : 'bg-brand'}`}
                  style={{ width: `${usedShare}%` }}
                />
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-left">
              <div>
                <dt className="text-xs text-muted">Promedio diario</dt>
                <dd className="text-base font-medium">{formatBs(summary.dailyAverage)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Movimientos</dt>
                <dd className="text-base font-medium">{summary.byCategory.length} categorías</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold">Por categoría</h2>
            {summary.byCategory.length === 0 ? (
              <p className="text-sm text-muted">Aún no hay gastos este mes.</p>
            ) : (
              <ul className="space-y-3">
                {summary.byCategory.map(({ category, total, share }) => (
                  <li key={category.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: category.color }} />
                        {category.label}
                      </span>
                      <span className="tabular-nums">{formatBs(total)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${share}%`, background: category.color }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold">Movimientos recientes</h2>
            {summary.recent.length === 0 ? (
              <p className="text-sm text-muted">Registra tu primer gasto para verlo aquí.</p>
            ) : (
              <ul className="divide-y divide-line">
                {summary.recent.map((expense) => (
                  <li key={expense.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm">{expense.description}</p>
                      <p className="text-xs text-muted">
                        {formatShortDate(expense.date)} · {PAYMENT_LABELS[expense.method]}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium tabular-nums">
                      {formatBs(expense.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
