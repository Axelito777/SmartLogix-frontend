import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8080'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #c8c8c8 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '18vh' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#222', letterSpacing: '0.12em', margin: '0 0 2rem', textTransform: 'uppercase' }}>Inicio de sesión</h2>
      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '14px', padding: '0 1rem', boxSizing: 'border-box' }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px 14px', border: '1px solid #111', borderRadius: '8px', fontSize: '14px', color: '#333', background: '#fff', boxSizing: 'border-box', boxShadow: '2px 2px 6px rgba(0,0,0,0.08)' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px 14px', border: '1px solid #111', borderRadius: '8px', fontSize: '14px', color: '#333', background: '#fff', boxSizing: 'border-box', boxShadow: '2px 2px 6px rgba(0,0,0,0.08)' }}
        />
        {error && <p style={{ color: 'red', fontSize: '13px', margin: 0 }}>{error}</p>}
        <button
          onClick={handleLogin}
          style={{ marginTop: '6px', padding: '12px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
        >
          Ingresar
        </button>
      </div>
    </div>
  )
}

export default Login