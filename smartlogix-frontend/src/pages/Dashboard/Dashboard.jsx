import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

const glassCard = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)',
  border: '1px solid rgba(255,255,255,0.4)',
  borderRadius: '16px',
  padding: '1.25rem',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)'
}

function Dashboard() {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [stockBajo, setStockBajo] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    const headers = { Authorization: `Bearer ${token}` }

    const fetchConReintentos = async (url, intentos = 3) => {
      for (let i = 0; i < intentos; i++) {
        try {
          const res = await axios.get(url, { headers })
          return res.data
        } catch {
          if (i === intentos - 1) return []
          await new Promise(r => setTimeout(r, 1000))
        }
      }
      return []
    }

    Promise.all([
      fetchConReintentos(`${API}/api/pedidos`),
      fetchConReintentos(`${API}/api/clientes`),
      fetchConReintentos(`${API}/api/inventario/productos/bajo-stock`)
    ]).then(([p, c, s]) => {
      setPedidos(p)
      setClientes(c)
      setStockBajo(s)
    })
  }, [])

  const estadoBadge = (estado) => {
    if (estado === 'ENTREGADO') return { bg: 'rgba(100,255,180,0.3)', color: '#afffcc', border: 'rgba(100,255,180,0.4)' }
    if (estado === 'EN_CAMINO') return { bg: 'rgba(255,200,50,0.3)', color: '#ffe999', border: 'rgba(255,200,50,0.4)' }
    return { bg: 'rgba(255,120,120,0.3)', color: '#ffbbbb', border: 'rgba(255,120,120,0.4)' }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(135deg, #1a6b9a 0%, #2eb8c8 30%, #4dd9a0 60%, #7ef0b8 100%)', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 0.25rem', textShadow: '0 1px 4px rgba(0,80,150,0.4)' }}>Bienvenido</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: '0 0 2rem' }}>Resumen general del sistema</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
          {[
            { label: 'Total pedidos', valor: pedidos.length, color: '#fff' },
            { label: 'Clientes', valor: clientes.length, color: '#fff' },
            { label: 'Envíos en camino', valor: pedidos.filter(p => p.estado === 'EN_CAMINO').length, color: '#fff' },
            { label: 'Stock bajo', valor: stockBajo.length, color: '#ffdd77' },
          ].map((item, i) => (
            <div key={i} style={glassCard}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', margin: '0 0 8px' }}>{item.label}</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: item.color, margin: 0, textShadow: '0 1px 4px rgba(0,80,150,0.4)' }}>{item.valor}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={glassCard}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 1rem', textShadow: '0 1px 3px rgba(0,80,150,0.4)' }}>Pedidos recientes</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>Cliente</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>Estado</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 5).map(p => {
                  const badge = estadoBadge(p.estado)
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <td style={{ padding: '8px 0', color: '#fff' }}>{p.clienteId?.slice(0, 8)}</td>
                      <td style={{ padding: '8px 0' }}>
                        <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: '2px 8px', borderRadius: '20px', fontSize: '11px' }}>{p.estado}</span>
                      </td>
                      <td style={{ padding: '8px 0', color: '#fff' }}>${p.total}</td>
                    </tr>
                  )
                })}
                {pedidos.length === 0 && <tr><td colSpan="3" style={{ padding: '1rem 0', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Sin pedidos</td></tr>}
              </tbody>
            </table>
          </div>

          <div style={glassCard}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffdd77', margin: '0 0 1rem', textShadow: '0 1px 3px rgba(150,80,0,0.4)' }}>Productos con stock bajo</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>Producto</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>Stock</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '8px 0', color: '#fff' }}>{p.nombre}</td>
                    <td style={{ padding: '8px 0', color: '#ff9999', fontWeight: '600' }}>{p.stock}</td>
                    <td style={{ padding: '8px 0', color: '#fff' }}>{p.stockMinimo}</td>
                  </tr>
                ))}
                {stockBajo.length === 0 && <tr><td colSpan="3" style={{ padding: '1rem 0', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Sin productos bajo stock</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard