import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Envios() {
  const [envios, setEnvios] = useState([])
  const [expandido, setExpandido] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API}/api/envios`, { headers }).then(r => setEnvios(r.data)).catch(() => {})
  }, [])

  const estadoBadge = (estado) => {
    if (estado === 'ENTREGADO') return { background: '#e8f5e9', color: '#27ae60', texto: '✅ ENTREGADO' }
    if (estado === 'EN_CAMINO') return { background: '#fff3e0', color: '#e67e22', texto: '🚚 EN CAMINO' }
    return { background: '#fce4ec', color: '#c0392b', texto: '⏳ PENDIENTE' }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f4f4' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: '0 0 0.25rem' }}>Envíos</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Seguimiento de envíos despachados</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {envios.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '2rem', textAlign: 'center', color: '#aaa' }}>
              No hay envíos registrados
            </div>
          ) : (
            envios.map(e => {
              const badge = estadoBadge(e.estado)
              const abierto = expandido === e.id
              return (
                <div key={e.id} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                  <div
                    onClick={() => setExpandido(abierto ? null : e.id)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>🚚</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#222', fontSize: '14px' }}>Envío #{e.id}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Pedido: #{e.pedidoId?.substring(0, 8)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ ...badge, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{badge.texto}</span>
                      <span style={{ color: '#888', fontSize: '18px' }}>{abierto ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {abierto && (
                    <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px 20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Tracking: {e.trackingNumber}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Estado: <span style={{ color: '#222', fontWeight: '600' }}>{e.estado}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Fecha: <span style={{ color: '#222', fontWeight: '600' }}>{e.fechaCreacion?.slice(0, 10)}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Envios