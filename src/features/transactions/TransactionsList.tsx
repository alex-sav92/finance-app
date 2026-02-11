import { useTransactions } from './useTransactions'
import { AddTransaction } from './AddTransaction'

type Props = {
  accountId: string | null
}

export function TransactionsList({ accountId }: Props) {
  const { transactions, loading, addTransaction } =
    useTransactions(accountId)

  if (!accountId) {
    return <p>Select an account to see transactions</p>
  }

  return (
    <div>
      <h2>Transactions</h2>

      <AddTransaction onAdd={addTransaction} />

      {loading && <p>Loading...</p>}

      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>
            {tx.occurred_at} — {tx.category} — {tx.amount}
            {tx.note && ` (${tx.note})`}
          </li>
        ))}
      </ul>
    </div>
  )
}
