import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { Layout } from './components/Layout'
import { Login } from './auth/login'

function App() {
  const [user, setUser] = useState<any>(null)

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
        </>
      )}
    </Layout>
  )
}

export default App
