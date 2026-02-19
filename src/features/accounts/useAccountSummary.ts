import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export type MonthlySummary = {
  month: string // YYYY-MM
  total: number
}

export function useAccountSummary(accountId: string | null) {
  const [summary, setSummary] = useState<MonthlySummary[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const fetchSummary = async () => {
    if (!accountId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, occurred_at')
      .eq('account_id', accountId)

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    let totalBalance = 0
    const totalsPerMonth: Record<string, number> = {}

    data?.forEach(tx => {
      const month = tx.occurred_at.slice(0, 7) // YYYY-MM
      totalsPerMonth[month] = (totalsPerMonth[month] || 0) + Number(tx.amount)
      totalBalance += Number(tx.amount)
    })

    // let cumulative = 0
    // const cumulativeData = Object.entries(totalsPerMonth)
    //     .sort(([a], [b]) => a.localeCompare(b))
    //     .map(([month, total]) => {
    //         cumulative += total
    //         return { month, total, cumulative }
    // })

    const summaryArray = Object.entries(totalsPerMonth)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month))

    setSummary(summaryArray)
    setBalance(totalBalance)
    setLoading(false)
  }

  useEffect(() => {
    fetchSummary()
  }, [accountId])

  return {
    summary,
    balance,
    loading,
    refresh: fetchSummary
  }
}
