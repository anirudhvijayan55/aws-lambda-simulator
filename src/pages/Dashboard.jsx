import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Dashboard() {
  const { status, functions, logs, analytics, setActiveFunction, triggerQuickInvoke } = useApp()

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="badge-aws" style={{ marginBottom: 8, display: 'inline-block' }}>Compute & Analytics</div>
          <h1 className="page-title">AWS Lambda Console</h1>
          <p className="page-subtitle">Serverless event-driven Python compute platform & runtime environment</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/simulator" className="btn btn-primary">⚡ Open Lambda Studio</Link>
          <Link to="/analytics" className="btn btn-secondary">📈 View Analytics</Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">Simulated Service</div>
          <div className="card-value" style={{ color: 'var(--aws-orange)' }}>AWS Lambda</div>
          <div className="card-subtitle">Python 3.11 Runtime</div>
        </div>

        <div className="card">
          <div className="card-title">Total Invocations</div>
          <div className="card-value">{status?.totalInvocations || 0}</div>
          <div className="card-subtitle">Lifetime requests in session</div>
        </div>

        <div className="card">
          <div className="card-title">Success Rate</div>
          <div className="card-value" style={{ color: 'var(--accent-green)' }}>
            {analytics?.successRatePercent !== undefined ? `${analytics.successRatePercent}%` : '100%'}
          </div>
          <div className="card-subtitle">{status?.successfulInvocations || 0} successful / {status?.failedInvocations || 0} failed</div>
        </div>

        <div className="card">
          <div className="card-title">Lambda Functions</div>
          <div className="card-value" style={{ color: 'var(--accent-cyan)' }}>{functions?.length || 0}</div>
          <div className="card-subtitle">Active simulated resources</div>
        </div>
      </div>

      {/* Main Grid: Functions & Recent Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginTop: 12 }}>
        
        {/* Lambda Functions Section */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Deployed Lambda Functions</h3>
            <Link to="/resources" style={{ fontSize: '0.82rem', color: 'var(--aws-orange)', fontWeight: 600 }}>View All ({functions.length}) →</Link>
          </div>
          <div style={{ padding: 12 }}>
            {functions.map(fn => (
              <div
                key={fn.id}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 16px',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                    <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{fn.name}</strong>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{fn.runtime}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{fn.description}</p>
                  <div style={{ display: 'flex', gap: 14, fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                    <span>Memory: <strong>{fn.memoryMb} MB</strong></span>
                    <span>Timeout: <strong>{fn.timeoutSec}s</strong></span>
                    <span>Layer: <strong style={{ color: 'var(--accent-amber)' }}>{fn.layer}</strong></span>
                  </div>
                </div>
                <Link
                  to="/simulator"
                  className="btn btn-secondary"
                  onClick={() => setActiveFunction(fn)}
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  Test Invocation
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Live CloudWatch Stream Preview */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>☁️ CloudWatch Live Logs</h3>
            <Link to="/logs" style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Full Stream →</Link>
          </div>
          <div className="log-terminal" style={{ flex: 1, minHeight: 320 }}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', paddingTop: 40 }}>
                No CloudWatch log entries captured yet. Click "Run Lambda Invocation" above to trigger a function call.
              </div>
            ) : (
              logs.slice(0, 15).map(l => (
                <div key={l.id} className="log-entry">
                  <span className="log-time">{l.timestamp.split(' ')[1]}</span>
                  <span className={`log-type ${l.type}`}>{l.type}</span>
                  <span className="log-msg">{l.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
