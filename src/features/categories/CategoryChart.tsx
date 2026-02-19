import { useCategories } from './useCategories'
import { useTransactions } from '../transactions/useTransactions'
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts'

type Props = {
  accountId: string | null
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57']

export function CategoryChart({ accountId }: Props) {
  const { transactions } = useTransactions(accountId || '')
  const { categories } = useCategories()

  if (!accountId) return null

  const data = categories.map(c => {
    const total = transactions
      .filter(tx => tx.category_id === c.id)
      .reduce((sum, tx) => sum + tx.amount, 0)
    return { name: c.name, value: total }
  }).filter(d => d.value > 0)

  if (!data.length) return <p>No data for chart</p>

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Category Breakdown</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" label>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
