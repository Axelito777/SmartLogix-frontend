import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Dashboard() {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [stockBajo, setStockBajo] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    const headers = { Authorization: `Bearer ${token}` }
    axios.get(`${API}/api/pedidos`, { headers }).then(r => setPedidos(r.data)).catch(() => {})
    axios.get(`${API}/api/clientes`, { headers }).then(r => setClientes(r.data)).catch(() => {})
    axios.get(`${API}/api/inventario/productos/bajo-stock`, { headers }).then(r => setStockBajo(r.data)).catch(() => {})
  }, [])

  const estadoStyle = (estado) => {
    if (estado === 'ENTREGADO') return { background: '#e8f5e9', color: '#27ae60' }
    if (estado === 'EN_CAMINO') return { background: '#fff3e0', color: '#e67e22' }
    return { background: '#fce4ec', color: '#c0392b' }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f4f4', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: '0 0 0.25rem' }}>Bienvenido</h1>
        <p style={{ fontSize: '13px', color: '#888', margin: '0 0 2rem' }}>Resumen general del sistema</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px' }}>Total pedidos</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#222', margin: 0 }}>{pedidos.length}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px' }}>Clientes</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#222', margin: 0 }}>{clientes.length}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px' }}>Envíos en camino</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#222', margin: 0 }}>{pedidos.filter(p => p.estado === 'EN_CAMINO').length}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px' }}>Stock bajo</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#c0392b', margin: 0 }}>{stockBajo.length}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#222', margin: '0 0 1rem' }}>Pedidos recientes</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: '500' }}>Cliente</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: '500' }}>Estado</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: '500' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 5).map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 0' }}>{p.clienteId}</td>
                    <td style={{ padding: '8px 0' }}>
                      <span style={{ ...estadoStyle(p.estado), padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{p.estado}</span>
                    </td>
                    <td style={{ padding: '8px 0' }}>${p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#c0392b', margin: '0 0 1rem' }}>Productos con stock bajo</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: '500' }}>Producto</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: '500' }}>Stock</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: '500' }}>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 0' }}>{p.nombre}</td>
                    <td style={{ padding: '8px 0', color: '#c0392b', fontWeight: '600' }}>{p.stock}</td>
                    <td style={{ padding: '8px 0' }}>{p.stockMinimo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard