import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Pagos() {
  const [pagos, setPagos] = useState([])
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API}/api/pagos`, { headers }).then(r => setPagos(r.data)).catch(() => {})
  }, [])

  const totalRecaudado = pagos.reduce((acc, p) => acc + (p.monto || 0), 0)
  const pagoMasAlto = pagos.length > 0 ? Math.max(...pagos.map(p => p.monto || 0)) : 0
  const ultimoPago = pagos.length > 0 ? pagos[pagos.length - 1]?.createdAt?.slice(0, 10) : '-'

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f4f4' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: '0 0 0.25rem' }}>Pagos</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Historial de pagos recibidos</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px' }}>Total recaudado</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#27ae60', margin: 0 }}>${totalRecaudado.toLocaleString()}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px' }}>Total de pagos</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#222', margin: 0 }}>{pagos.length}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px' }}>Pago más alto</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#222', margin: 0 }}>${pagoMasAlto.toLocaleString()}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px' }}>Último pago</p>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: 0 }}>{ultimoPago}</p>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>ID Pago</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Pedido</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Monto</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Método</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No hay pagos registrados</td></tr>
              ) : (
                pagos.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '14px 16px', color: '#222' }}>#{p.id}</td>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.pedidoId}</td>
                    <td style={{ padding: '14px 16px', color: '#27ae60', fontWeight: '600' }}>${p.monto?.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.metodoPago}</td>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.createdAt?.slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Pagos