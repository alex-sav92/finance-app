import { useAccountSummary } from './useAccountSummary'

type Props = {
  accountId: string | null
}

export function AccountSummary({ accountId }: Props) {
  const { summary, balance, loading } = useAccountSummary(accountId)

  if (!accountId) return null
  if (loading) return <p>Loading summary...</p>

  return (
    <div>
      <h3>Account Summary</h3>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow">
        <div className="text-sm opacity-80">Current Balance</div>
        <div className="text-3xl font-bold mt-2">
          € 2,430
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
