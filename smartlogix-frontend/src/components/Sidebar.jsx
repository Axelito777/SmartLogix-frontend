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
    <div style={{
      width: '220px',
      background: 'linear-gradient(180deg, #1a6b9a 0%, #2eb8c8 50%, #4dd9a0 100%)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      boxSizing: 'border-box',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '4px 0 20px rgba(0,100,180,0.3)'
    }}>
      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(100,220,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

      <div style={{ padding: '0 1.5rem', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.1))', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '12px', padding: '8px 12px', textAlign: 'center' }}>
          <p style={{ color: '#fff', fontSize: '16px', fontWeight: '700', letterSpacing: '0.1em', margin: 0, textShadow: '0 1px 4px rgba(0,100,150,0.4)' }}>SMARTLOGIX</p>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, position: 'relative' }}>
        {items.map(item => {
          const activo = location.pathname === item.path
          return (
            <span
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                color: activo ? '#fff' : 'rgba(255,255,255,0.75)',
                fontSize: '14px',
                padding: '11px 1.5rem',
                cursor: 'pointer',
                background: activo ? 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))' : 'transparent',
                borderRadius: '10px',
                margin: '0 8px',
                fontWeight: activo ? '600' : '400',
                border: activo ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                textShadow: activo ? '0 1px 3px rgba(0,80,150,0.4)' : 'none',
                transition: 'all 0.2s ease',
                boxShadow: activo ? 'inset 0 1px 0 rgba(255,255,255,0.4)' : 'none'
              }}
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