import { useState } from 'react'

export type Transaction = {
  id: string
  amount: number
  note?: string
  occurred_at: string
  category_id: string
  categories: { id: string; name: string }
}

type Props = {
  tx: Transaction
  onUpdate: (id: string, amount: number, categoryId: string, date: string, note?: string) => void
  onDelete: (id: string) => void
}

export function TransactionItem({ tx, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState(tx.amount.toString())
  const [note, setNote] = useState(tx.note || '')

  const handleSave = () => {
    onUpdate(tx.id, Number(amount), tx.category_id, tx.occurred_at, note)
    setEditing(false)
  }

  return (
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
      <div>
        <div className="font-medium">{tx.categories.name}</div>
        <div className="text-sm text-gray-500">{tx.occurred_at}</div>
      </div>

      <div className="flex items-center gap-3">
        {editing ? (
          <>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="px-2 py-1 border rounded w-24"
            />
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="px-2 py-1 border rounded w-40"
              placeholder="Note"
            />
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className={`font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {tx.amount} 
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(tx.id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}
