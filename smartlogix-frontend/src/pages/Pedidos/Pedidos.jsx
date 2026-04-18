import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [expandido, setExpandido] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarPedidos()
  }, [])

  const cargarPedidos = () => {
    axios.get(`${API}/api/pedidos`, { headers }).then(r => setPedidos(r.data)).catch(() => {})
  }

  const handleDespachar = async (id) => {
    try {
      await axios.put(`${API}/api/pedidos/${id}/estado`, { estado: 'ENTREGADO' }, { headers })
      cargarPedidos()
    } catch (err) {
      alert('Error al actualizar estado')
    }
  }

  const estadoBadge = (estado) => {
    if (estado === 'ENTREGADO') return { background: '#e8f5e9', color: '#27ae60', texto: '✅ ENTREGADO' }
    if (estado === 'EN_PROCESO') return { background: '#fff3e0', color: '#e67e22', texto: '🔄 EN PROCESO' }
    return { background: '#fce4ec', color: '#c0392b', texto: '⏳ PENDIENTE' }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f4f4' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: '0 0 0.25rem' }}>Pedidos</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Gestión de pedidos recibidos</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pedidos.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '2rem', textAlign: 'center', color: '#aaa' }}>
              No hay pedidos registrados
            </div>
          ) : (
            pedidos.map(p => {
              const badge = estadoBadge(p.estado)
              const abierto = expandido === p.id
              return (
                <div key={p.id} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                  <div
                    onClick={() => setExpandido(abierto ? null : p.id)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>📦</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#222', fontSize: '14px' }}>Pedido #{p.id?.slice(0, 8)}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Cliente: {p.clienteId}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ ...badge, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{badge.texto}</span>
                      <span style={{ color: '#888', fontSize: '18px' }}>{abierto ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {abierto && (
                    <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px 20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Total: <span style={{ color: '#222', fontWeight: '600' }}>${p.total}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Tipo: <span style={{ color: '#222', fontWeight: '600' }}>{p.tipo}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Fecha: <span style={{ color: '#222', fontWeight: '600' }}>{p.createdAt?.slice(0, 10)}</span></p>
                      </div>

                      {p.estado !== 'ENTREGADO' && (
                        <button
                          onClick={() => handleDespachar(p.id)}
                          style={{ padding: '10px 24px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                        >
                          Despachar
                        </button>
                      )}
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

export default Pedidos