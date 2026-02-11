import { useState } from 'react'
import { useAccounts } from './useAccounts'
type Props = {
  onSelect: (accountId: string) => void
}
export function AccountsList({ onSelect }: Props) {
  const { accounts, loading, addAccount } = useAccounts()
  const [name, setName] = useState('')

  const onAdd = () => {
    if (!name.trim()) return
    addAccount(name.trim())
    setName('')
  }

  return (
    <div>
      <h2>Accounts</h2>

      <input
        placeholder="Account name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={onAdd}>Add</button>

      {loading && <p>Loading...</p>}

      <ul>
        {accounts.map(acc => (
          <li key={acc.id}>
            <button onClick={() => onSelect(acc.id)}>
                {acc.name} ({acc.currency})
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
