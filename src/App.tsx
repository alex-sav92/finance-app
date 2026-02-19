import { useState } from 'react'

import { AccountsList } from './features/accounts/AccountsList'
import { AccountSummary } from './features/accounts/AccountSummary'
import { AccountChart } from './features/accounts/AccountChart'

import { TransactionsList } from './features/transactions/TransactionsList'
import { AddTransaction } from './features/transactions/AddTransaction'

import { CategoryChart } from './features/categories/CategoryChart'

export default function App() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Personal Finance
        </h1>

        <div className="text-sm text-gray-500">
          Supabase Demo
        </div>
      </header>

      <div className="flex">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <h2 className="font-semibold mb-4">
            Accounts
          </h2>

          <AccountsList
            selectedAccountId={selectedAccountId}
            onSelect={setSelectedAccountId}
          />
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 space-y-6">

          {!selectedAccountId && (
            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              Select an account to begin
            </div>
          )}

          {selectedAccountId && (
            <>
              {/* Balance */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow">
                <AccountSummary accountId={selectedAccountId} />
              </div>

              {/* Add Transaction */}
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold mb-3">
                  Add Transaction
                </h2>

                <AddTransaction accountId={selectedAccountId} />
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="font-semibold mb-3">
                    Monthly Overview
                  </h2>

                  <AccountChart accountId={selectedAccountId} />
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="font-semibold mb-3">
                    Category Breakdown
                  </h2>

                  <CategoryChart accountId={selectedAccountId} />
                </div>

              </div>

              {/* Transactions */}
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold mb-3">
                  Transactions
                </h2>

                <TransactionsList accountId={selectedAccountId} />
              </div>
            </>
          )}

        </main>

      </div>
    </div>
  )
}
