import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { Layout } from './components/Layout'
import { Login } from './auth/Login'
import { AccountsList } from './features/accounts/AccountsList'
import { TransactionsList } from './features/transactions/TransactionsList'
import { AccountSummary } from './features/accounts/AccountSummary'

function App() {
  const [user, setUser] = useState<any>(null)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  useEffect(() => {
    loadUser()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <Layout>
      {!user ? (
        <Login onLogin={loadUser} />
      ) : (
        <>
          <p>Logged in as {user.email}</p>
          <button onClick={signOut}>Sign out</button>

          <hr />

          <AccountsList onSelect={setSelectedAccountId} />

          <hr />

          <TransactionsList accountId={selectedAccountId} />

          <AccountSummary accountId={selectedAccountId} />
        </>
      )}
    </Layout>
  )
}

export default App
