import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export function useTransactions(accountId: string | null) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    if (!accountId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        occurred_at,
        note,
        category_id,
        categories (id, name)
      `)
      .eq('account_id', accountId)
      .order('occurred_at', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
      setLoading(false)
      return
    }

    // Flatten category name for easier access
    const flattened = data?.map(tx => ({
      ...tx,
      category_name: tx.categories?.[0]?.name ?? 'Uncategorized'
    })) ?? []

    setTransactions(flattened)
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [accountId])

  // ✅ Add transaction
  const addTransaction = async (
    amount: number,
    categoryId: string,
    date: string,
    note?: string
  ) => {
    if (!accountId) return

    const { error } = await supabase
      .from('transactions')
      .insert({
        account_id: accountId,
        amount,
        category_id: categoryId,
        occurred_at: date,
        note
      })

    if (error) console.error('Error adding transaction:', error)
    else fetchTransactions()
  }

  // ✅ Update transaction
  const updateTransaction = async (
    id: string,
    amount: number,
    categoryId: string,
    date: string,
    note?: string
  ) => {
    const { error } = await supabase
      .from('transactions')
      .update({
        amount,
        category_id: categoryId,
        occurred_at: date,
        note
      })
      .eq('id', id)

    if (error) console.error('Error updating transaction:', error)
    else fetchTransactions()
  }

  // ✅ Delete transaction
  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) console.error('Error deleting transaction:', error)
    else fetchTransactions()
  }

  return {
    transactions,
    loading,
    refetch: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  }
}
