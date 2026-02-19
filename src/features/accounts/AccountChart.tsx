import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAccountSummary } from './useAccountSummary'

type Props = {
  accountId: string | null
}

export function AccountChart({ accountId }: Props) {
  const { summary, loading } = useAccountSummary(accountId)

  if (!accountId) return null
  if (loading) return <p>Loading chart...</p>
  if (!summary.length) return <p>No transactions yet</p>

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Monthly Totals Chart</h3>
      <ResponsiveContainer>
        <LineChart data={summary}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
