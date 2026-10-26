import { useState, useEffect } from 'react'
import { loadPyodide, isReady, runAllTests } from '../utils/pythonRunner'

// ── sub-components ────────────────────────────────────────────────────────────

function TestRow({ r }) {
  const passed = r.passed
  const isErr  = r.status === 'error'
  const color  = passed ? '#10b981' : isErr ? '#f43f5e' : '#f59e0b'
  const bg     = passed ? 'rgba(16,185,129,0.05)' : isErr ? 'rgba(244,63,94,0.05)' : 'rgba(245,158,11,0.05)'
  const border = passed ? 'rgba(16,185,129,0.18)' : isErr ? 'rgba(244,63,94,0.2)'  : 'rgba(245,158,11,0.2)'
  const icon   = passed ? '✅' : isErr ? '💥' : '❌'

  const clip = (s, n = 80) => s && s.length > n ? s.substring(0, n) + '…' : (s || '')

  const gotText = isErr
    ? (r.error?.split('\n').filter(Boolean).slice(-2).join(' ').trim() || 'Runtime error').substring(0, 120)
    : clip(r.actualOutput || '(no output)')

  return (
    <div style={{ padding: '10px 14px', background: bg, border: `1px solid ${border}`, borderRadius: '6px', fontSize: '0.82rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span>{icon}</span>
        <span style={{ fontWeight: 600, color }}>{r.description}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 3, columnGap: 10, fontSize: '0.78rem' }}>
        {r.stdin && (
          <>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Input:</span>
            <code style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '1px 5px', borderRadius: 3 }}>
              {r.stdin.replace(/\n/g, ' ↵ ')}
            </code>
          </>
        )}
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Expected:</span>
        <code style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '1px 5px', borderRadius: 3 }}>
          {clip(r.expectedOutput)}
        </code>
        {!passed && (
          <>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Got:</span>
            <code style={{ color, background: 'rgba(255,255,255,0.04)', padding: '1px 5px', borderRadius: 3 }}>
              {gotText}
            </code>
          </>
        )}
      </div>
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────

function PracticeEditor({ question, initialCode, onCodeChange }) {
  const starter = initialCode ?? (question.starterCode || '')
  const [code, setCode]           = useState(starter)
  const [runState, setRunState]   = useState('idle')   // idle | loading | running | done
  const [blockError, setBlockError] = useState(null)
  const [results, setResults]     = useState([])

  // Warm up Pyodide in the background as soon as this component mounts
  useEffect(() => {
    loadPyodide().catch(() => {})   // pre-load silently; errors surface on button click
  }, [])

  const handleChange = (e) => {
    setCode(e.target.value)
    onCodeChange?.(e.target.value)
    if (runState === 'done') setRunState('idle')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const s    = e.target.selectionStart
      const end  = e.target.selectionEnd
      const next = code.substring(0, s) + '    ' + code.substring(end)
      setCode(next)
      onCodeChange?.(next)
      setTimeout(() => e.target.setSelectionRange(s + 4, s + 4), 0)
    }
  }

  const handleRun = async () => {
    if (!code.trim() || runState === 'running' || runState === 'loading') return

    setBlockError(null)
    setResults([])

    // Block if required constructs are missing
    if (!allConstraintsMet) {
      const missing = constraintResults.filter(r => !r.met).map(r => r.label).join(', ')
      setBlockError(`Complete the required constructs first.\nMissing: ${missing}`)
      setRunState('done')
      return
    }

    // Show "loading" state only if Pyodide hasn't finished yet
    if (!isReady()) {
      setRunState('loading')
      try { await loadPyodide() } catch (err) {
        setBlockError('Failed to load Python runtime. Check your internet connection.')
        setRunState('done')
        return
      }
    }

    setRunState('running')

    try {
      const { blocked, blockError: be, results: rs } = await runAllTests(code, question.testCases || [])
      if (blocked) {
        setBlockError(be)
      } else {
        setResults(rs)
      }
    } catch (err) {
      setBlockError(err.message || 'Unexpected error during execution.')
    }

    setRunState('done')
  }

  const handleReset = () => {
    setCode(starter)
    onCodeChange?.(starter)
    setRunState('idle')
    setBlockError(null)
    setResults([])
  }

  // Constraint check — derived live from code, no extra state
  const constraintResults = (question.constraints || []).map(c => ({
    ...c,
    met: new RegExp(c.regex, 's').test(code)
  }))
  const allConstraintsMet = constraintResults.length === 0 || constraintResults.every(r => r.met)

  const noTests       = !question.testCases || question.testCases.length === 0
  const busy          = runState === 'loading' || runState === 'running'
  const visibleResults = results.filter(r => !r.isHidden)
  const hiddenResults  = results.filter(r => r.isHidden)
  const hiddenPassed   = hiddenResults.filter(r => r.passed).length
  const totalPassed    = results.filter(r => r.passed).length

  const btnLabel = runState === 'loading'
    ? '⏳ Loading Python…'
    : runState === 'running'
      ? '⏳ Running…'
      : '▶ Run & Test'

  return (
    <div>
      {/* Note */}
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
        Use <code style={{ background: 'var(--bg-tertiary)', padding: '1px 4px', borderRadius: 3 }}>input()</code> without a prompt string. Tab key inserts 4 spaces.
      </p>

      {/* Editor */}
      <textarea
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={10}
        spellCheck={false}
        style={{
          width: '100%',
          background: '#0d1117',
          color: '#e8edf5',
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontSize: '0.875rem',
          padding: '14px 16px',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.65,
          boxSizing: 'border-box',
          tabSize: 4
        }}
        placeholder="Write your Python solution here…"
      />

      {/* Constraint Pills */}
      {constraintResults.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 6 }}>
            Required constructs
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {constraintResults.map(c => (
              <span
                key={c.id}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: c.met ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.08)',
                  border: `1px solid ${c.met ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.25)'}`,
                  color: c.met ? '#10b981' : '#f43f5e',
                  transition: 'all 0.15s'
                }}
              >
                <span>{c.met ? '✅' : '❌'}</span>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
        <button
          onClick={handleRun}
          disabled={busy || !code.trim() || noTests}
          style={{
            padding: '8px 22px',
            background: (busy || !code.trim() || noTests)
              ? 'var(--bg-tertiary)'
              : !allConstraintsMet
                ? 'rgba(244,63,94,0.15)'
                : 'linear-gradient(135deg, #10b981, #06b6d4)',
            border: !allConstraintsMet && !busy && code.trim() && !noTests ? '1px solid rgba(244,63,94,0.3)' : 'none',
            borderRadius: '6px',
            color: busy ? 'var(--text-muted)' : !allConstraintsMet ? '#f43f5e' : '#fff',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: busy ? 'default' : 'pointer',
            transition: 'opacity 0.2s',
            minWidth: 140
          }}
        >
          {btnLabel}
        </button>

        {runState === 'done' && !blockError && results.length > 0 && (
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: totalPassed === results.length ? '#10b981' : '#f59e0b' }}>
            {totalPassed}/{results.length} passed
          </span>
        )}

        {noTests && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No test cases available</span>
        )}

        <button
          onClick={handleReset}
          style={{
            marginLeft: 'auto', padding: '7px 14px',
            background: 'transparent', border: '1px solid var(--border-color)',
            borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      {/* Loading hint */}
      {runState === 'loading' && (
        <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Downloading Python runtime (~10 MB) — this only happens once.
        </div>
      )}

      {/* Error Gate */}
      {runState === 'done' && blockError && (
        <div style={{
          marginTop: 14, padding: '10px 14px',
          background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.25)',
          borderRadius: '6px', fontSize: '0.81rem', color: '#f43f5e',
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          whiteSpace: 'pre-wrap', overflowX: 'auto'
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4, fontFamily: 'sans-serif' }}>
            Fix errors before tests can run:
          </div>
          {blockError}
        </div>
      )}

      {/* Test Results */}
      {runState === 'done' && !blockError && results.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {visibleResults.length > 0 && (
            <>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>
                Visible Test Cases
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {visibleResults.map(r => <TestRow key={r.id} r={r} />)}
              </div>
            </>
          )}

          {hiddenResults.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px', background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.86rem'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>🔒 Hidden Test Cases</span>
              <span style={{ fontWeight: 700, color: hiddenPassed === hiddenResults.length ? '#10b981' : '#f59e0b' }}>
                {hiddenPassed} / {hiddenResults.length} passed
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PracticeEditor
