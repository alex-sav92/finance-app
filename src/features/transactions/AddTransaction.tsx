import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useTransactions } from './useTransactions'

type Props = {
  accountId: string
}

type Category = {
  id: string
  name: string
}

export function AddTransaction({ accountId }: Props) {
  const { addTransaction } = useTransactions(accountId)

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10)) // YYYY-MM-DD

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
        setLoadingCategories(false)
        return
      }

      setCategories(data ?? [])
      setLoadingCategories(false)
      if (data?.[0]) setCategoryId(data[0].id)
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !categoryId || !date) {
      alert('Please fill amount, category, and date')
      return
    }

    await addTransaction(
      Number(amount),
      categoryId,
      date,
      note || undefined
    )

    // Reset form
    setAmount('')
    setNote('')
    setDate(new Date().toISOString().slice(0, 10))
    if (categories[0]) setCategoryId(categories[0].id)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          disabled={loadingCategories}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Note (optional)
        </label>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Lunch, subscription, etc."
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>
    </form>
  )
}
