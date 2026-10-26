import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Sidebar() {
  const { functions, status } = useApp()

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">λ</div>
        <div>
          <h1>AWS Console</h1>
          <p>Lambda & CloudWatch</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Console</div>
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
          <span className="sidebar-link-icon">📊</span>
          Dashboard
        </NavLink>

        <NavLink to="/simulator" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon">⚡</span>
          Service Simulator
        </NavLink>

        <NavLink to="/resources" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon">📦</span>
          Resources ({functions?.length || 0})
        </NavLink>

        <div className="sidebar-section-label" style={{ marginTop: 16 }}>Observability</div>
        <NavLink to="/logs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon">📄</span>
          Activity / Logs
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon">📈</span>
          Analytics & Enhancement
        </NavLink>

        <div className="sidebar-section-label" style={{ marginTop: 16 }}>System</div>
        <NavLink to="/about" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-link-icon">ℹ️</span>
          AWS Mapping & About
        </NavLink>
      </nav>

      {/* AWS Simulation Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span>Total Invocations:</span>
          <strong style={{ color: 'var(--aws-orange)' }}>{status?.totalInvocations || 0}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Chaos Mode:</span>
          <span style={{ color: status?.chaosModeEnabled ? 'var(--accent-rose)' : 'var(--accent-green)', fontWeight: 700 }}>
            {status?.chaosModeEnabled ? `ACTIVE (${status?.chaosFailureType})` : 'DISABLED'}
          </span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
