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
      <p>
        <strong>Current Balance:</strong> {balance.toFixed(2)}
      </p>

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
