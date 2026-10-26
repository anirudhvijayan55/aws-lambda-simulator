import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

function ServiceSimulator() {
  const { functions, activeFunction, setActiveFunction, invokeLambda, executionResult, loading } = useApp()

  const [selectedFnId, setSelectedFnId] = useState('')
  const [code, setCode] = useState('')
  const [eventInput, setEventInput] = useState('{\n  "dept": "CS",\n  "min_marks": 70\n}')
  const [memoryMb, setMemoryMb] = useState(512)
  const [timeoutSec, setTimeoutSec] = useState(10)

  useEffect(() => {
    if (activeFunction) {
      setSelectedFnId(activeFunction.id)
      setCode(activeFunction.code)
      setMemoryMb(activeFunction.memoryMb)
      setTimeoutSec(activeFunction.timeoutSec)
      if (activeFunction.sampleEvent) {
        setEventInput(JSON.stringify(activeFunction.sampleEvent, null, 2))
      }
    } else if (functions.length > 0) {
      setActiveFunction(functions[0])
    }
  }, [activeFunction, functions, setActiveFunction])

  const handleSelectFn = (e) => {
    const fnId = e.target.value
    const found = functions.find(f => f.id === fnId)
    if (found) {
      setActiveFunction(found)
    }
  }

  const handleRun = async () => {
    let parsedEvent = {}
    try {
      if (eventInput.trim()) {
        parsedEvent = JSON.parse(eventInput)
      }
    } catch (err) {
      alert('Invalid JSON in Event Payload: ' + err.message)
      return
    }

    await invokeLambda(selectedFnId, code, parsedEvent, memoryMb, timeoutSec)
  }

  return (
    <div className="simulator-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge-aws" style={{ marginBottom: 8, display: 'inline-block' }}>Interactive Invocation Studio</div>
          <h1 className="page-title">AWS Lambda Function Test Workshop</h1>
          <p className="page-subtitle">Configure triggers, memory parameters, code logic, and trigger simulated executions</p>
        </div>
        <button className="btn btn-primary" onClick={handleRun} disabled={loading} style={{ padding: '10px 24px', fontSize: '1rem' }}>
          {loading ? '⏳ Running...' : '▶ Execute Lambda Handler'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        
        {/* Left Column: Function Config & Code Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Controls Bar */}
          <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                SELECT LAMBDA FUNCTION
              </label>
              <select
                value={selectedFnId}
                onChange={handleSelectFn}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  color: '#fff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                {functions.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                MEMORY SIZE: <strong style={{ color: 'var(--aws-orange)' }}>{memoryMb} MB</strong>
              </label>
              <input
                type="range"
                min={128}
                max={3072}
                step={64}
                value={memoryMb}
                onChange={e => setMemoryMb(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--aws-orange)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                TIMEOUT: <strong style={{ color: 'var(--accent-cyan)' }}>{timeoutSec} sec</strong>
              </label>
              <input
                type="range"
                min={1}
                max={60}
                value={timeoutSec}
                onChange={e => setTimeoutSec(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>
          </div>

          {/* Python Code Editor */}
          <div className="editor-container">
            <div className="editor-header">
              <span>🐍 Python 3.11 Runtime (lambda_function.py)</span>
              <span>Layer: {activeFunction?.layer || 'Standard'}</span>
            </div>
            <textarea
              className="code-area"
              rows={14}
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Event Trigger Payload Editor */}
          <div className="editor-container">
            <div className="editor-header">
              <span>📥 Test Event JSON Payload (Trigger: {activeFunction?.trigger || 'API Gateway'})</span>
            </div>
            <textarea
              className="code-area"
              rows={6}
              value={eventInput}
              onChange={e => setEventInput(e.target.value)}
              spellCheck={false}
            />
          </div>

        </div>

        {/* Right Column: Invocation Output & Response Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
              ⚡ Invocation Result & Metrics
            </h3>

            {!executionResult ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '1.4rem', marginBottom: 8 }}>🚀 Ready for Execution</p>
                <p style={{ fontSize: '0.85rem' }}>Configure code & input payload on the left, then click <strong>"Execute Lambda Handler"</strong>.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* Status Bar */}
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: executionResult.statusCode === 200 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  border: `1px solid ${executionResult.statusCode === 200 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>STATUS CODE</span>
                    <strong style={{ fontSize: '1.2rem', color: executionResult.statusCode === 200 ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
                      {executionResult.statusCode} {executionResult.statusCode === 200 ? 'OK' : 'ERROR'}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>REQUEST ID</span>
                    <code style={{ fontSize: '0.8rem', color: '#fff' }}>{executionResult.requestId}</code>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>DURATION</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--accent-cyan)' }}>{executionResult.durationMs} ms</strong>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>BILLED DURATION</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--aws-orange)' }}>{executionResult.billedDurationMs} ms</strong>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>MEMORY ALLOCATED</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--accent-purple)' }}>{executionResult.memorySizeMb} MB</strong>
                  </div>
                </div>

                {/* Execution Output / Return Payload */}
                <div>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Response Payload (return value)
                  </h4>
                  <pre style={{
                    background: '#070a13',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 12,
                    fontSize: '0.82rem',
                    color: '#a7f3d0',
                    maxHeight: 180,
                    overflow: 'auto',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {executionResult.output || executionResult.error || '(No return value)'}
                  </pre>
                </div>

                {/* Captured stdout */}
                <div>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Function Output Log (sys.stdout)
                  </h4>
                  <pre style={{
                    background: '#050811',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 12,
                    fontSize: '0.82rem',
                    color: '#e2e8f0',
                    maxHeight: 160,
                    overflow: 'auto',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {executionResult.stdout || executionResult.stderr || 'Log stream clear.'}
                  </pre>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default ServiceSimulator
