import { useTransactions } from './useTransactions'
import { TransactionItem } from './TransactionItem'

type Props = {
  accountId: string | null
}

export function TransactionsList({ accountId }: Props) {
  const { transactions, loading, refetch } = useTransactions(accountId)

  if (!accountId) {
    return (
      <div className="text-gray-500">
        Select an account to see transactions
      </div>
    )
  }

  if (loading) {
    return <div className="text-gray-500">Loading transactions...</div>
  }

  if (!transactions.length) {
    return (
      <div className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">
        No transactions yet. Add your first one above 👆
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map(tx => (
        <TransactionItem
          key={tx.id}
          tx={tx}
          onUpdate={async (id, amount, categoryId, date, note) => {
            // call the hook's update function
            const { updateTransaction } = useTransactions(accountId)
            await updateTransaction(id, amount, categoryId, date, note)
            refetch()
          }}
          onDelete={async id => {
            const { deleteTransaction } = useTransactions(accountId)
            await deleteTransaction(id)
            refetch()
          }}
        >
          
        </TransactionItem>
      ))}
    </div>
  )
}
