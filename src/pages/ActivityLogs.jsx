import { useState } from 'react'
import { useApp } from '../context/AppContext'

function ActivityLogs() {
  const { logs, functions, clearLogs, refreshAll } = useApp()
  const [streamFilter, setStreamFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')

  const filteredLogs = logs.filter(l => {
    if (streamFilter !== 'all' && l.stream !== streamFilter) return false
    if (levelFilter !== 'all' && l.type !== levelFilter) return false
    return true
  })

  return (
    <div className="activity-logs-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge-aws" style={{ marginBottom: 8, display: 'inline-block' }}>Amazon CloudWatch</div>
          <h1 className="page-title">CloudWatch Log Streams & Activity Audit</h1>
          <p className="page-subtitle">Real-time structured event logs, execution reports, and stdout/stderr capturing</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={refreshAll}>🔄 Refresh Stream</button>
          <button className="btn btn-danger" onClick={clearLogs}>🗑️ Clear Logs</button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>
            LOG STREAM FILTER
          </label>
          <select
            value={streamFilter}
            onChange={e => setStreamFilter(e.target.value)}
            style={{
              background: 'var(--bg-primary)',
              color: '#fff',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: 4,
              fontSize: '0.85rem'
            }}
          >
            <option value="all">All Log Streams</option>
            <option value="syslog">syslog (System Events)</option>
            {functions.map(f => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>
            EVENT LEVEL
          </label>
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            style={{
              background: 'var(--bg-primary)',
              color: '#fff',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: 4,
              fontSize: '0.85rem'
            }}
          >
            <option value="all">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="START">START</option>
            <option value="LOG">LOG (stdout)</option>
            <option value="REPORT">REPORT (Billed Duration)</option>
            <option value="ERROR">ERROR</option>
            <option value="WARNING">WARNING</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredLogs.length}</strong> of {logs.length} log entries
        </div>
      </div>

      {/* Terminal View */}
      <div className="log-terminal" style={{ minHeight: 480 }}>
        {filteredLogs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 60 }}>
            No CloudWatch entries match the current filter selection.
          </div>
        ) : (
          filteredLogs.map(l => (
            <div key={l.id} className="log-entry">
              <span className="log-time">{l.timestamp}</span>
              <span className={`log-type ${l.type}`}>{l.type}</span>
              <span style={{ color: 'var(--accent-amber)', fontSize: '0.78rem', width: 140, flexShrink: 0, truncate: true }}>
                [{l.stream}]
              </span>
              <span className="log-msg">{l.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ActivityLogs
