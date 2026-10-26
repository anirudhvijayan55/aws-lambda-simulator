import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { tests, getTestQuestions, DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../data/mockTestData'
import { useApp, getGrade } from '../context/AppContext'
import PracticeEditor from '../components/PracticeEditor'

const GRADE_COLORS = { S: '#f59e0b', A: '#10b981', B: '#3b82f6', C: '#8b5cf6', F: '#f43f5e' }

function MockTestRunner() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const { saveTestScore, getTestBest } = useApp()

  const test = tests.find(t => t.id === testId)
  const questions = getTestQuestions(testId)
  const best = getTestBest(testId)

  // Intro screen — shown before timer starts
  const [phase, setPhase] = useState('intro')  // 'intro' | 'running' | 'done'
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState((test?.timeLimit ?? 30) * 60)
  const timerRef = useRef(null)

  useEffect(() => {
    if (phase !== 'running') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          finishTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  if (!test || questions.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Test not found.</p>
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/mock-tests')}>
          Back to Tests
        </button>
      </div>
    )
  }

  const finishTest = () => {
    clearInterval(timerRef.current)
    const attempted = Object.values(answers).filter(a => a.trim()).length
    const total = questions.length
    saveTestScore(testId, attempted, total, (test.timeLimit * 60) - timeLeft, answers)
    setPhase('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRetake = () => {
    setAnswers({})
    setTimeLeft((test.timeLimit ?? 30) * 60)
    setPhase('intro')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatTime = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const timerColor = timeLeft > 300 ? '#10b981' : timeLeft > 60 ? '#f59e0b' : '#f43f5e'

  // ── Review mode (intro screen) ─────────────────────────────────
  const [showReview, setShowReview] = useState(false)

  // ── Compute result data for 'done' phase
  const attempted = Object.values(answers).filter(a => a.trim()).length
  const pct = questions.length > 0 ? Math.round((attempted / questions.length) * 100) : 0
  const grade = getGrade(pct)

  // ──────────────────────────────────────────────────────────────────
  // INTRO SCREEN
  // ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={{ maxWidth: 580, margin: '40px auto' }}>
        <button
          onClick={() => navigate('/mock-tests')}
          style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginBottom: 28, fontSize: '0.85rem' }}
        >
          ← All Tests
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden'
          }}
        >
          <div style={{ height: 4, background: test.gradient }} />
          <div style={{ padding: '36px' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>{test.icon}</div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>{test.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{test.description}</p>
            </div>

            {/* Test details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { icon: '⏱', label: 'Time Limit', value: `${test.timeLimit} minutes` },
                { icon: '❓', label: 'Questions', value: `${questions.length} questions` },
                { icon: '📝', label: 'Format', value: 'Open-ended answers' },
                { icon: '✅', label: 'Grading', value: 'Based on attempts' },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '12px 16px', background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)'
                }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 3 }}>{item.icon} {item.label}</p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Personal Best */}
            {best && (
              <div style={{
                padding: '14px 18px', marginBottom: 24,
                background: `${GRADE_COLORS[best.grade]}12`,
                border: `1px solid ${GRADE_COLORS[best.grade]}30`,
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', gap: 14
              }}>
                <div style={{ fontSize: '2rem' }}>{best.emoji}</div>
                <div>
                  <p style={{ fontWeight: 700, color: GRADE_COLORS[best.grade], fontSize: '0.95rem' }}>
                    Personal Best: {best.grade} — {best.label}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    {best.score}/{best.total} answered · {best.pct}% · {Math.floor(best.timeUsed / 60)}m {best.timeUsed % 60}s
                  </p>
                </div>
              </div>
            )}

            {/* Review Past Attempt */}
            {best?.answers && Object.keys(best.answers).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <button
                  onClick={() => setShowReview(r => !r)}
                  style={{ width: '100%', padding: '10px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>📋 Review Past Attempt</span>
                  <span>{showReview ? '▲ Hide' : '▼ Show'}</span>
                </button>
                {showReview && (
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {questions.map((q, idx) => {
                      const pastAnswer = best.answers[q.id] || ''
                      return (
                        <div key={q.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                          <div style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ width: 26, height: 26, borderRadius: '50%', background: test.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{q.title}</span>
                          </div>
                          <div style={{ padding: '12px 16px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>Your Answer</p>
                            {pastAnswer ? (
                              <pre style={{ background: '#0d1117', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#e8edf5', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap', marginBottom: 12, border: '1px solid var(--border-color)' }}>
                                {pastAnswer}
                              </pre>
                            ) : (
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontStyle: 'italic', marginBottom: 12 }}>Not answered</p>
                            )}
                            <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>✓ Model Solution</p>
                            <pre style={{ background: '#0d1117', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#10b981', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap', border: '1px solid rgba(16,185,129,0.2)' }}>
                              {q.solution}
                            </pre>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.55 }}>
                              <strong>💡 </strong>{q.explanation}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Grade scale */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                Grade Scale
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { g: 'S', l: '≥90%', c: '#f59e0b' },
                  { g: 'A', l: '≥75%', c: '#10b981' },
                  { g: 'B', l: '≥60%', c: '#3b82f6' },
                  { g: 'C', l: '≥40%', c: '#8b5cf6' },
                  { g: 'F', l: '<40%', c: '#f43f5e' },
                ].map(({ g, l, c }) => (
                  <span key={g} style={{
                    padding: '4px 12px', borderRadius: 20,
                    background: `${c}15`, color: c,
                    border: `1px solid ${c}30`, fontSize: '0.8rem', fontWeight: 700
                  }}>
                    {g} {l}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhase('running')}
              style={{
                width: '100%', padding: '14px',
                background: test.gradient, border: 'none',
                borderRadius: 'var(--radius-md)',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', boxShadow: `0 8px 24px ${test.color}40`
              }}
            >
              Start Test →
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // RUNNING / DONE SCREENS
  // ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)',
        padding: '12px 0', marginBottom: 32,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/mock-tests')}
            style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            ← Back
          </button>
          <span style={{ fontSize: '1.4rem' }}>{test.icon}</span>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{test.title}</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{questions.length} questions</p>
          </div>
        </div>

        {phase === 'running' && (
          <div style={{
            fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace',
            color: timerColor, padding: '6px 14px',
            background: `${timerColor}18`, borderRadius: 'var(--radius-sm)',
            border: `1px solid ${timerColor}40`, transition: 'color 0.3s, background 0.3s'
          }}>
            {formatTime(timeLeft)}
          </div>
        )}

        {phase === 'done' && (
          <div style={{
            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
            background: `${GRADE_COLORS[grade.grade]}15`,
            border: `1px solid ${GRADE_COLORS[grade.grade]}30`,
            color: GRADE_COLORS[grade.grade], fontWeight: 700, fontSize: '0.95rem'
          }}>
            {grade.emoji} Grade {grade.grade} — {grade.label}
          </div>
        )}
      </div>

      {/* Results banner (done) */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: `${GRADE_COLORS[grade.grade]}0d`,
              border: `1px solid ${GRADE_COLORS[grade.grade]}30`,
              borderRadius: 'var(--radius-md)', padding: '24px 28px',
              marginBottom: 32, display: 'flex', gap: 20, flexWrap: 'wrap',
              alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ fontSize: '3rem' }}>{grade.emoji}</div>
              <div>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: GRADE_COLORS[grade.grade], lineHeight: 1 }}>
                  Grade {grade.grade}
                </p>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  {grade.label} · {attempted}/{questions.length} answered · {pct}%
                </p>
                {pct > (best?.pct ?? -1) && best && (
                  <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: 4, fontWeight: 600 }}>
                    🎉 New personal best!
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleRetake}
                style={{
                  padding: '10px 24px', background: test.gradient, border: 'none',
                  borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 600, cursor: 'pointer'
                }}
              >
                🔄 Retake
              </button>
              <button
                onClick={() => navigate('/mock-tests')}
                style={{
                  padding: '10px 20px', background: 'none',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer'
                }}
              >
                ← All Tests
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {questions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${phase === 'done' ? DIFFICULTY_COLORS[q.difficulty] + '40' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-lg)', padding: '28px', transition: 'border-color 0.3s'
            }}
          >
            {/* Question header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: test.gradient, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                }}>{idx + 1}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{q.title}</h3>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <span className="tag" style={{ background: `${DIFFICULTY_COLORS[q.difficulty]}18`, color: DIFFICULTY_COLORS[q.difficulty], border: `1px solid ${DIFFICULTY_COLORS[q.difficulty]}30` }}>
                  {DIFFICULTY_LABELS[q.difficulty]}
                </span>
                <span className="tag" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  {q.topic}
                </span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 16, fontSize: '0.92rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {q.prompt}
            </div>

            <details style={{ marginBottom: 16 }}>
              <summary style={{ cursor: 'pointer', color: 'var(--text-accent)', fontSize: '0.85rem', fontWeight: 600, userSelect: 'none', padding: '4px 0' }}>
                💡 Show Hint
              </summary>
              <div style={{ marginTop: 10, padding: 12, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {q.hint}
              </div>
            </details>

            {phase === 'running' && (
              <PracticeEditor
                question={q}
                initialCode={answers[q.id] || ''}
                onCodeChange={(code) => setAnswers(prev => ({ ...prev, [q.id]: code }))}
              />
            )}

            {phase === 'done' && answers[q.id] && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Answer</p>
                <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ borderRadius: 8, fontSize: '0.88rem', margin: 0 }}>
                  {answers[q.id]}
                </SyntaxHighlighter>
              </div>
            )}

            <AnimatePresence>
              {phase === 'done' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20, marginTop: 8 }}>
                    <p style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>✓ Model Solution</p>
                    <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ borderRadius: 8, fontSize: '0.88rem', margin: 0, marginBottom: 14 }}>
                      {q.solution}
                    </SyntaxHighlighter>
                    <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Explanation: </strong>{q.explanation}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Submit button (running) */}
      {phase === 'running' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ marginTop: 40, textAlign: 'center' }}>
          <button
            onClick={finishTest}
            style={{
              padding: '14px 48px', background: test.gradient, border: 'none',
              borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', boxShadow: `0 8px 24px ${test.color}40`
            }}
          >
            Submit & Reveal Solutions
          </button>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 10 }}>
            Submit early — unanswered questions will still show solutions.
          </p>
        </motion.div>
      )}

      {phase === 'done' && (
        <div style={{ marginTop: 40, textAlign: 'center', display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={handleRetake} style={{ padding: '12px 32px', background: test.gradient, border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            🔄 Retake Test
          </button>
          <button onClick={() => navigate('/mock-tests')} style={{ padding: '12px 32px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
            ← All Tests
          </button>
        </div>
      )}
    </div>
  )
}

export default MockTestRunner
