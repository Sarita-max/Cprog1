import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api'

export function LoginPage() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const { token } = await apiFetch<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      localStorage.setItem('token', token)
      const me = await apiFetch<{ id: number, email: string, role: 'ADMIN' | 'STUDENT' }>('/auth/me')
      navigate(me.role === 'ADMIN' ? '/admin' : '/student')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'system-ui, Arial' }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ width: '100%' }} />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  )
}
