import { useEffect, useState } from 'react'
import { expensesRepository } from '../data'
import { previousMonthKey } from '../lib/dates'
import { buildMonthSummary } from '../lib/summary'
import type { MonthKey, MonthSummary } from '../types'

interface Result {
  month: MonthKey
  summary: MonthSummary | null
  error: string | null
}

export function useMonthSummary(month: MonthKey) {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let active = true

    Promise.all([
      expensesRepository.listByMonth(month),
      expensesRepository.listByMonth(previousMonthKey(month)),
    ])
      .then(([expenses, previous]) => {
        if (!active) return
        setResult({ month, summary: buildMonthSummary(month, expenses, previous), error: null })
      })
      .catch(() => {
        if (!active) return
        setResult({ month, summary: null, error: 'No pudimos cargar tus gastos.' })
      })

    return () => {
      active = false
    }
  }, [month])

  // El resultado de un mes anterior no aplica al mes pedido: seguimos cargando.
  const fresh = result?.month === month ? result : null
  return { summary: fresh?.summary ?? null, error: fresh?.error ?? null, loading: fresh === null }
}
