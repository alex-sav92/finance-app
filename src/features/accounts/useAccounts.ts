import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export type Account = {
  id: string
  name: string
  currency: string
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('accounts')
      .select('id, name, currency')
      .order('created_at', { ascending: true })

    if (error) {
      console.error(error)
    } else {
      setAccounts(data ?? [])
    }
    setLoading(false)
  }

  const addAccount = async (name: string, currency = 'EUR') => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from('accounts').insert({
      user_id: user.id,
      name,
      currency
    })

    if (!error) {
      fetchAccounts()
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  return {
    accounts,
    loading,
    addAccount
  }
}
