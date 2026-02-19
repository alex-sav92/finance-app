import { useTransactions } from '../transactions/useTransactions'
import { useAccountSummary } from './useAccountSummary'

type Props = {
  accountId: string | null
}

export function AccountSummary({ accountId }: Props) {
  const { summary, loading } = useAccountSummary(accountId)
  const { transactions } = useTransactions(accountId) // extract the array

  const balance = transactions.reduce(
    (sum, tx) => sum + Number(tx.amount), // make sure tx.amount is a number
    0
  )
  if (!accountId) return null
  if (loading) return <p>Loading summary...</p>

  return (
    <div>
      <h3>Account Summary</h3>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow">
        <div className="text-3xl font-bold mt-2">
          {balance.toLocaleString('en-US', { style: 'currency', currency: 'RON' })}
        </div>
      </div>

      {summary.length ? (
        <>
          <h4>Monthly totals</h4>
          <ul>
            {summary.map(s => (
              <li key={s.month}>
                {s.month}: {s.total.toFixed(2)}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No transactions yet</p>
      )}
    </div>
  )
}
