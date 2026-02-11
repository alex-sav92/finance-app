import { useState } from 'react'
import { useCategories } from '../categories/useCategories'

type Props = {
  onAdd: (
    amount: number,
    categoryId: string,
    occurredAt: string,
    note?: string
  ) => void
}

export function AddTransaction({ onAdd }: Props) {
  const { categories } = useCategories()
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const submit = () => {
    if (!amount || !categoryId || !date) return

    onAdd(
      Number(amount),
      categoryId,
      date,
      note || undefined
    )

    setAmount('')
    setCategoryId('')
    setDate('')
    setNote('')
  }

  return (
    <div>
      <h3>Add transaction</h3>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <select
        value={categoryId}
        onChange={e => setCategoryId(e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <input
        placeholder="Note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <button onClick={submit}>Add</button>
    </div>
  )
}
