import { getCategory } from '../config'
import type { CategoryTotal, Expense, MonthKey, MonthSummary } from '../types'
import { elapsedDaysInMonth } from './dates'

function sum(expenses: Expense[]): number {
  return expenses.reduce((acc, e) => acc + e.amount, 0)
}

function groupByCategory(expenses: Expense[], total: number): CategoryTotal[] {
  const totals = new Map<string, number>()
  for (const expense of expenses) {
    totals.set(expense.categoryId, (totals.get(expense.categoryId) ?? 0) + expense.amount)
  }

  return [...totals.entries()]
    .map(([id, value]) => ({
      category: getCategory(id as Expense['categoryId']),
      total: value,
      share: total === 0 ? 0 : (value / total) * 100,
    }))
    .sort((a, b) => b.total - a.total)
}

export function buildMonthSummary(
  month: MonthKey,
  expenses: Expense[],
  previousExpenses: Expense[],
): MonthSummary {
  const total = sum(expenses)
  const previousTotal = sum(previousExpenses)

  return {
    month,
    total,
    previousTotal,
    change: previousTotal === 0 ? null : ((total - previousTotal) / previousTotal) * 100,
    dailyAverage: total / elapsedDaysInMonth(month),
    byCategory: groupByCategory(expenses, total),
    recent: expenses.slice(0, 5),
  }
}
