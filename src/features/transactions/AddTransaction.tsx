import { useState } from 'react'

type Props = {
  onAdd: (
    amount: number,
    category: string,
    occurredAt: string,
    note?: string
  ) => void
}

export function AddTransaction({ onAdd }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const submit = () => {
    if (!amount || !category || !date) return

    onAdd(
      Number(amount),
      category,
      date,
      note || undefined
    )

    setAmount('')
    setCategory('')
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

      <input
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />

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
