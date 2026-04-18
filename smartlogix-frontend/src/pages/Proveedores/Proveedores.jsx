import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' })
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarProveedores()
  }, [])

  const cargarProveedores = () => {
    axios.get(`${API}/api/proveedores`, { headers }).then(r => setProveedores(r.data)).catch(() => {})
  }

  const handleGuardar = async () => {
    try {
      if (editando) {
        await axios.put(`${API}/api/proveedores/${editando}`, form, { headers })
        setEditando(null)
      } else {
        await axios.post(`${API}/api/proveedores`, form, { headers })
      }
      setForm({ nombre: '', email: '', telefono: '', direccion: '' })
      setMostrarForm(false)
      cargarProveedores()
    } catch (err) {
      alert('Error al guardar proveedor')
    }
  }

  const handleEditar = (p) => {
    setEditando(p.id)
    setForm({ nombre: p.nombre, email: p.email, telefono: p.telefono, direccion: p.direccion })
    setMostrarForm(true)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return
    try {
      await axios.delete(`${API}/api/proveedores/${id}`, { headers })
      cargarProveedores()
    } catch (err) {
      alert('Error al eliminar proveedor')
    }
  }

  const inputStyle = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f4f4' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: '0 0 0.25rem' }}>Proveedores</h1>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Gestión de proveedores</p>
          </div>
          <button onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setForm({ nombre: '', email: '', telefono: '', direccion: '' }) }}
            style={{ padding: '10px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            {mostrarForm ? 'Cancelar' : '+ Nuevo proveedor'}
          </button>
        </div>

        {mostrarForm && (
          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#222', margin: '0 0 1rem' }}>{editando ? 'Editar proveedor' : 'Nuevo proveedor'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={inputStyle} />
              <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} />
              <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} style={inputStyle} />
              <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} style={inputStyle} />
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
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Teléfono</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Dirección</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No hay proveedores registrados</td></tr>
              ) : (
                proveedores.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.nombre}</td>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.email}</td>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.telefono}</td>
                    <td style={{ padding: '14px 16px', color: '#222' }}>{p.direccion}</td>
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

export default Proveedores