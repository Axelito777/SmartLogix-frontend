import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Inventario() {
  const [productos, setProductos] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '', bodegaId: '', proveedorId: '' })
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarProductos()
  }, [])

  const cargarProductos = () => {
    axios.get(`${API}/api/inventario/productos`, { headers }).then(r => setProductos(r.data)).catch(() => {})
  }

  const handleGuardar = async () => {
    try {
      if (editando) {
        await axios.put(`${API}/api/inventario/productos/${editando}`, form, { headers })
        setEditando(null)
      } else {
        await axios.post(`${API}/api/inventario/productos`, form, { headers })
      }
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '', bodegaId: '', proveedorId: '' })
      setMostrarForm(false)
      cargarProductos()
    } catch (err) {
      alert('Error al guardar producto')
    }
  }

  const handleEditar = (p) => {
    setEditando(p.id)
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, stockMinimo: p.stockMinimo, bodegaId: p.bodegaId || '', proveedorId: p.proveedorId || '' })
    setMostrarForm(true)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await axios.delete(`${API}/api/inventario/productos/${id}`, { headers })
      cargarProductos()
    } catch (err) {
      alert('Error al eliminar producto')
    }
  }

  const inputStyle = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f4f4' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: '0 0 0.25rem' }}>Inventario</h1>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Gestión de productos y stock</p>
          </div>
          <button onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setForm({ nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '', bodegaId: '', proveedorId: '' }) }}
            style={{ padding: '10px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            {mostrarForm ? 'Cancelar' : '+ Nuevo producto'}
          </button>
        </div>

        {mostrarForm && (
          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#222', margin: '0 0 1rem' }}>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={inputStyle} />
              <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} style={inputStyle} />
              <input name="precio" placeholder="Precio" type="number" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} style={inputStyle} />
              <input name="stock" placeholder="Stock actual" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={inputStyle} />
              <input name="stockMinimo" placeholder="Stock mínimo" type="number" value={form.stockMinimo} onChange={e => setForm({...form, stockMinimo: e.target.value})} style={inputStyle} />
              <input name="proveedorId" placeholder="ID Proveedor (opcional)" value={form.proveedorId} onChange={e => setForm({...form, proveedorId: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setMostrarForm(false)} style={{ padding: '9px 18px', background: '#f0f0f0', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleGuardar} style={{ padding: '9px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Guardar</button>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Descripción</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Precio</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Stock</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Stock mín.</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No hay productos registrados</td></tr>
              ) : (
                productos.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.nombre}</td>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.descripcion}</td>
                    <td style={{ padding: '14px 16px', color: '#222' }}>${p.precio}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: p.stock <= p.stockMinimo ? '#c0392b' : '#27ae60', fontWeight: '600' }}>{p.stock}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.stockMinimo}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditar(p)} style={{ padding: '6px 12px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Editar</button>
                        <button onClick={() => handleEliminar(p.id)} style={{ padding: '6px 12px', background: '#fce4ec', color: '#c0392b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Eliminar</button>
                      </div>
                    </td>
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

export default Inventario