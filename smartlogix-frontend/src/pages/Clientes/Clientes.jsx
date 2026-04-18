import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({})
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarClientes()
  }, [])

  const cargarClientes = () => {
    axios.get(`${API}/api/clientes`, { headers }).then(r => setClientes(r.data)).catch(() => {})
  }

  const handleEditar = (cliente) => {
    setEditando(cliente.id)
    setForm({ nombre: cliente.nombre, rut: cliente.rut, email: cliente.email, telefono: cliente.telefono, direccion: cliente.direccion })
  }

  const handleGuardar = async (id) => {
    try {
      await axios.put(`${API}/api/clientes/${id}`, form, { headers })
      setEditando(null)
      cargarClientes()
    } catch (err) {
      alert('Error al actualizar cliente')
    }
  }

  const inputStyle = { padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f4f4' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#222', margin: '0 0 0.25rem' }}>Clientes</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Listado de clientes registrados</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>RUT</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Teléfono</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Dirección</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: '#444', fontWeight: '600' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No hay clientes registrados</td></tr>
              ) : (
                clientes.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    {editando === c.id ? (
                      <>
                        <td style={{ padding: '10px 16px' }}><input name="nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={inputStyle} /></td>
                        <td style={{ padding: '10px 16px' }}><input name="rut" value={form.rut} onChange={e => setForm({...form, rut: e.target.value})} style={inputStyle} /></td>
                        <td style={{ padding: '10px 16px' }}><input name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} /></td>
                        <td style={{ padding: '10px 16px' }}><input name="telefono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} style={inputStyle} /></td>
                        <td style={{ padding: '10px 16px' }}><input name="direccion" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} style={inputStyle} /></td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleGuardar(c.id)} style={{ padding: '6px 12px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Guardar</button>
                            <button onClick={() => setEditando(null)} style={{ padding: '6px 12px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Cancelar</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '14px 16px', color: '#222' }}>{c.nombre}</td>
                        <td style={{ padding: '14px 16px', color: '#222' }}>{c.rut}</td>
                        <td style={{ padding: '14px 16px', color: '#222' }}>{c.email}</td>
                        <td style={{ padding: '14px 16px', color: '#222' }}>{c.telefono}</td>
                        <td style={{ padding: '14px 16px', color: '#222' }}>{c.direccion}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <button onClick={() => handleEditar(c)} style={{ padding: '6px 12px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Editar</button>
                        </td>
                      </>
                    )}
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

export default Clientes