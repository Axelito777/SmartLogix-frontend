import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Inventario', path: '/inventario' },
  { label: 'Pedidos', path: '/pedidos' },
  { label: 'Envíos', path: '/envios' },
  { label: 'Pagos', path: '/pagos' },
  { label: 'Proveedores', path: '/proveedores' },
  { label: 'Notificaciones', path: '/notificaciones' },
  { label: 'Reportes', path: '/reportes' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ width: '220px', background: '#222', height: '100vh', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', boxSizing: 'border-box', flexShrink: 0 }}>
      <p style={{ color: '#fff', fontSize: '18px', fontWeight: '700', letterSpacing: '0.1em', margin: '0 0 2rem', padding: '0 1.5rem' }}>SMARTLOGIX</p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {items.map(item => {
          const activo = location.pathname === item.path
          return (
            <span
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ color: activo ? '#fff' : '#bbb', fontSize: '15px', padding: '12px 2rem', cursor: 'pointer', background: activo ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '6px', margin: '0 8px', fontWeight: activo ? '600' : '400' }}
            >
              {item.label}
            </span>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar