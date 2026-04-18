import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([])
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API}/api/notificaciones`, { headers }).then(r => setNotificaciones(r.data)).catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f4f4' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: '0 0 0.25rem' }}>Notificaciones</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Historial de notificaciones del sistema</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notificaciones.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '2rem', textAlign: 'center', color: '#aaa' }}>
              No hay notificaciones
            </div>
          ) : (
            notificaciones.map(n => (
              <div key={n.id} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🔔</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#222', fontWeight: '500' }}>{n.mensaje}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Usuario: {n.usuarioId}</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>{n.fechaEnvio?.slice(0, 10)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Notificaciones