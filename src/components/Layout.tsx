import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Personal Finance</h1>
      {children}
    </div>
  )
}
