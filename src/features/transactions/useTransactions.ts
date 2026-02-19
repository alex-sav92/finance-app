import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
type TransactionFromDb = {
      id: string
      amount: number
      occurred_at: string
      note?: string
      category_id: string
      categories: { id: string; name: string }[]
      account_id: string
    }
    export type Transaction = {
  id: string
  account_id: string
  amount: number
  occurred_at: string
  note?: string
  category_id: string
  category_name: string
  categories: { id: string; name: string }[]
}
export function useTransactions(accountId: string | null) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    if (!accountId) return
    setLoading(true)
    
const { data, error } = await supabase
  .from('transactions') // <-- table name as string literal
  .select(`
    id,
    account_id,
    amount,
    occurred_at,
    note,
    category_id,
    categories!inner (id, name)
  `)
  .eq('account_id', accountId)
  .order('occurred_at', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
      setLoading(false)
      return
    }
    const typedData: TransactionFromDb[] = data ?? []

    const flattened: Transaction[] = typedData?.map(tx => ({
      ...tx,
      category_name: tx.categories[0]?.name ?? 'Uncategorized'
    })) ?? []

    console.log("Flattened::", flattened)

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
