import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp, getGrade } from '../context/AppContext'

export default function QuizBlock({ moduleId, tabKey, questions }) {
  const { saveQuizScore, getQuizBest, getDbQuizQuestions, isSupabaseReady } = useApp()
  const best = getQuizBest(tabKey)

  const [started, setStarted] = useState(false)
  const [selected, setSelected] = useState({})   // questionIdx → optionIdx
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [activeQuestions, setActiveQuestions] = useState(questions || [])

  useEffect(() => {
    if (!isSupabaseReady) return
    getDbQuizQuestions(moduleId, tabKey).then(dbQs => {
      if (dbQs?.length > 0) {
        setActiveQuestions(dbQs.map(q => ({
          q: q.question, options: q.options, answer: q.correct_answer, explanation: q.explanation
        })))
      }
    })
  }, [moduleId, tabKey])

  if (!activeQuestions || activeQuestions.length === 0) return null

  const handleSubmit = () => {
    let correct = 0
    activeQuestions.forEach((q, i) => {
      if (selected[i] === q.answer) correct++
    })
    const total = activeQuestions.length
    setScore(correct)
    setSubmitted(true)
    saveQuizScore(moduleId, tabKey, correct, total)
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const handleRetry = () => {
    setSelected({})
    setSubmitted(false)
    setScore(null)
  }

  const pct = submitted ? Math.round((score / activeQuestions.length) * 100) : null
  const grade = submitted ? getGrade(pct) : null
  const allAnswered = Object.keys(selected).length === activeQuestions.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{
        marginTop: 32,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        background: 'var(--bg-tertiary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.1rem' }}>🧩</span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Quick Quiz</span>
          <span style={{
            background: 'rgba(59,130,246,0.15)', color: '#3b82f6',
            border: '1px solid rgba(59,130,246,0.3)',
            padding: '2px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600
          }}>
            {activeQuestions.length} questions
          </span>
        </div>
        {best && !started && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              fontSize: '0.78rem', color: best.passed ? '#10b981' : '#f59e0b', fontWeight: 600
            }}>
              Best: {best.score}/{best.total} ({best.pct}%)
            </span>
            {best.passed && (
              <span style={{
                background: 'rgba(16,185,129,0.15)', color: '#10b981',
                border: '1px solid rgba(16,185,129,0.3)',
                padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700
              }}>✓ Passed</span>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {/* Not started */}
        {!started && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
              Test your understanding of this section.
              {best?.passed
                ? ' You\'ve already passed — try to beat your score!'
                : ' Score ≥ 60% to mark this section complete.'}
            </p>
            <button
              onClick={() => setStarted(true)}
              style={{
                padding: '10px 28px',
                background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              {best ? 'Retake Quiz' : 'Start Quiz'} →
            </button>
          </div>
        )}

        {/* Quiz questions */}
        {started && !submitted && (
          <div>
            {activeQuestions.map((q, qi) => (
              <motion.div
                key={qi}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qi * 0.05 }}
                style={{ marginBottom: 24 }}
              >
                <p style={{
                  fontWeight: 600, fontSize: '0.92rem', marginBottom: 12,
                  color: 'var(--text-primary)', lineHeight: 1.5
                }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: 6, fontSize: '0.8rem' }}>{qi + 1}.</span>
                  {q.q}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt, oi) => {
                    const chosen = selected[qi] === oi
                    return (
                      <button
                        key={oi}
                        onClick={() => setSelected(prev => ({ ...prev, [qi]: oi }))}
                        style={{
                          textAlign: 'left', padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${chosen ? '#3b82f6' : 'var(--border-color)'}`,
                          background: chosen ? 'rgba(59,130,246,0.12)' : 'var(--bg-card)',
                          color: chosen ? '#60a5fa' : 'var(--text-secondary)',
                          fontWeight: chosen ? 600 : 400,
                          cursor: 'pointer', fontSize: '0.88rem',
                          transition: 'all 0.15s', fontFamily: 'inherit', lineHeight: 1.4
                        }}
                      >
                        <span style={{ marginRight: 8, fontWeight: 700, color: chosen ? '#3b82f6' : 'var(--text-muted)' }}>
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              style={{
                width: '100%', padding: '12px',
                background: allAnswered ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'var(--bg-tertiary)',
                border: `1px solid ${allAnswered ? 'transparent' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-sm)',
                color: allAnswered ? '#fff' : 'var(--text-muted)',
                fontWeight: 700, cursor: allAnswered ? 'pointer' : 'not-allowed',
                fontSize: '0.92rem', transition: 'all 0.2s', fontFamily: 'inherit'
              }}
            >
              {allAnswered ? 'Submit Quiz →' : `Answer all ${activeQuestions.length - Object.keys(selected).length} remaining questions`}
            </button>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {submitted && grade && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {/* Grade Banner */}
              <div style={{
                textAlign: 'center', padding: '24px',
                background: pct >= 60
                  ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${pct >= 60 ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                borderRadius: 'var(--radius-md)', marginBottom: 20
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{grade.emoji}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: pct >= 60 ? '#10b981' : '#f59e0b', lineHeight: 1 }}>
                  {grade.grade}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: 4 }}>{grade.label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 8 }}>
                  {score} / {activeQuestions.length} correct &nbsp;·&nbsp; {pct}%
                </div>
                {pct >= 60 && (
                  <div style={{ marginTop: 10, color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                    ✓ Section marked as complete!
                  </div>
                )}
                {pct < 60 && (
                  <div style={{ marginTop: 10, color: '#f59e0b', fontSize: '0.85rem' }}>
                    Score ≥ 60% to complete this section.
                  </div>
                )}
              </div>

              {/* Answers review */}
              {activeQuestions.map((q, qi) => {
                const isCorrect = selected[qi] === q.answer
                return (
                  <div
                    key={qi}
                    style={{
                      marginBottom: 16, padding: '14px',
                      background: isCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(244,63,94,0.06)',
                      border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{isCorrect ? '✅' : '❌'}</span>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.4 }}>{q.q}</p>
                    </div>
                    {!isCorrect && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4, paddingLeft: 24 }}>
                        Your answer: <span style={{ color: '#f43f5e' }}>{q.options[selected[qi]] ?? '(not answered)'}</span>
                      </p>
                    )}
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: 24 }}>
                      Correct: <span style={{ color: '#10b981', fontWeight: 600 }}>{q.options[q.answer]}</span>
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6, paddingLeft: 24, lineHeight: 1.5 }}>
                      💡 {q.explanation}
                    </p>
                  </div>
                )
              })}

              <button
                onClick={handleRetry}
                style={{
                  width: '100%', padding: '11px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)', fontWeight: 600,
                  cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'inherit'
                }}
              >
                🔄 Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
