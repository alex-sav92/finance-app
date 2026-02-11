import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export type Transaction = {
  id: string
  amount: number
  category: string
  occurred_at: string
  note: string | null
}

export function useTransactions(accountId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    if (!accountId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('id, amount, category, occurred_at, note')
      .eq('account_id', accountId)
      .order('occurred_at', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setTransactions(data ?? [])
    }
    setLoading(false)
  }

  const addTransaction = async (
    amount: number,
    category: string,
    occurredAt: string,
    note?: string
  ) => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user || !accountId) return

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      account_id: accountId,
      amount,
      category,
      occurred_at: occurredAt,
      note
    })

    if (!error) {
      fetchTransactions()
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [accountId])

  return {
    transactions,
    loading,
    addTransaction
  }
}
