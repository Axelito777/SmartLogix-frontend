import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Reportes() {
  const [reporteVentas, setReporteVentas] = useState(null)
  const [reporteInventario, setReporteInventario] = useState(null)
  const [loadingVentas, setLoadingVentas] = useState(false)
  const [loadingInventario, setLoadingInventario] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
  }, [])

  const generarVentas = async () => {
    setLoadingVentas(true)
    try {
      const pedidos = await axios.get(`${API}/api/pedidos`, { headers })
      const lista = pedidos.data
      const completados = lista.filter(p => p.estado === 'ENTREGADO')
      const pendientes = lista.filter(p => p.estado === 'PENDIENTE')
      const total = completados.reduce((acc, p) => acc + (p.total || 0), 0)
      const promedio = completados.length > 0 ? total / completados.length : 0
      setReporteVentas({ total, completados: completados.length, pendientes: pendientes.length, promedio })
    } catch {
      alert('Error al generar reporte de ventas')
    }
    setLoadingVentas(false)
  }

  const generarInventario = async () => {
    setLoadingInventario(true)
    try {
      const productos = await axios.get(`${API}/api/inventario/productos`, { headers })
      const lista = productos.data
      const bajoStock = lista.filter(p => p.stock <= p.stockMinimo)
      const valorTotal = lista.reduce((acc, p) => acc + (p.precio * p.stock), 0)
      setReporteInventario({ total: lista.length, bajoStock: bajoStock.length, valorTotal })
    } catch {
      alert('Error al generar reporte de inventario')
    }
    setLoadingInventario(false)
  }

  const fila = (label, valor, color = '#222') => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
      <span style={{ fontSize: '13px', color: '#888' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color }}>{valor}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f4f4' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: '0 0 0.25rem' }}>Reportes</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Resumen de ventas e inventario</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#222', margin: 0 }}>📊 Reporte de Ventas</h2>
              <button onClick={generarVentas} style={{ padding: '7px 14px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                {loadingVentas ? 'Generando...' : 'Generar'}
              </button>
            </div>
            {reporteVentas ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {fila('Total ventas', `$${reporteVentas.total.toLocaleString()}`, '#27ae60')}
                {fila('Pedidos completados', reporteVentas.completados)}
                {fila('Ticket promedio', `$${Math.round(reporteVentas.promedio).toLocaleString()}`)}
                {fila('Pedidos pendientes', reporteVentas.pendientes, '#c0392b')}
              </div>
            ) : (
              <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', marginTop: '2rem' }}>Presiona Generar para ver el reporte</p>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#222', margin: 0 }}>📦 Reporte de Inventario</h2>
              <button onClick={generarInventario} style={{ padding: '7px 14px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                {loadingInventario ? 'Generando...' : 'Generar'}
              </button>
            </div>
            {reporteInventario ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {fila('Total productos', reporteInventario.total)}
                {fila('Productos bajo stock', reporteInventario.bajoStock, '#c0392b')}
                {fila('Valor total inventario', `$${reporteInventario.valorTotal.toLocaleString()}`)}
              </div>
            ) : (
              <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', marginTop: '2rem' }}>Presiona Generar para ver el reporte</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reportes