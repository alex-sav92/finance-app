import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export type Category = {
  id: string
  name: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true })

    if (!error) setCategories(data ?? [])
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, refresh: fetchCategories }
}
