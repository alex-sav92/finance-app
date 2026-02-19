import { useAccounts } from './useAccounts'

type Props = {
  selectedAccountId: string | null
  onSelect: (id: string) => void
}

export function AccountsList({ selectedAccountId, onSelect }: Props) {
  const { accounts, loading } = useAccounts()

  if (loading) {
    return (
      <div className="text-gray-500">
        Loading accounts...
      </div>
    )
  }

  if (!accounts.length) {
    return (
      <div className="text-gray-500">
        No accounts found
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {accounts.map(acc => {
        const isSelected = acc.id === selectedAccountId

        return (
          <button
            key={acc.id}
            onClick={() => onSelect(acc.id)}
            className={`
              w-full text-left px-3 py-2 rounded-lg transition
              ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }
            `}
          >
            <div className="font-medium">
              {acc.name}
            </div>
          </button>
        )
      })}
    </div>
  )
}
