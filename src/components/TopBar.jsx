import { useApp } from '../context/AppContext'

function TopBar() {
  const { status, resetSimulation, triggerQuickInvoke, loading } = useApp()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">
          <span>⚡ AWS Lambda</span>
          <span className="badge-aws">Educational Simulator</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 16 }}>
          <span className="status-pill">
            <span className="status-dot" />
            {status?.status || 'RUNNING'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            us-east-1 (N. Virginia)
          </span>
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="btn btn-secondary"
          onClick={resetSimulation}
          title="Reset all simulation metrics and logs"
          disabled={loading}
        >
          🔄 Reset Simulation
        </button>

        <button
          className="btn btn-primary"
          onClick={triggerQuickInvoke}
          disabled={loading}
        >
          {loading ? '⏳ Executing...' : '▶ Run Lambda Invocation'}
        </button>
      </div>
    </header>
  )
}

export default TopBar
