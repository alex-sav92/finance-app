import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Props = {
  onLogin: () => void
}

export function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      onLogin()
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <br />

      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
        onClick={signIn}>Sign in</button>
    </div>
  )
}
