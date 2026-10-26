import { tests, getTestQuestions } from '../data/mockTestData'

const GRADE_COLORS = { S: '#f59e0b', A: '#10b981', B: '#3b82f6', C: '#8b5cf6', F: '#f43f5e' }

export default function AnswerReviewModal({ student, testRow, onClose }) {
  const testInfo = tests.find(t => t.id === testRow.test_id)
  const questions = getTestQuestions(testRow.test_id)
  const answers = testRow.answers || {}

  const answered = questions.filter(q => answers[q.id]?.trim()).length

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        overflowY: 'auto', padding: '24px 16px'
      }}
    >
      <div style={{
        maxWidth: 800, margin: '0 auto',
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)', overflow: 'hidden'
      }}>
        {/* Modal header */}
        <div style={{
          padding: '20px 28px', background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              Test Review
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 2 }}>
              {student.avatar || '🧑'} {student.name} — {testInfo?.title ?? testRow.test_id}
            </h2>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, background: `${GRADE_COLORS[testRow.grade]}18`, color: GRADE_COLORS[testRow.grade], border: `1px solid ${GRADE_COLORS[testRow.grade]}30` }}>
                {testRow.emoji} Grade {testRow.grade} — {testRow.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {answered}/{questions.length} answered · {testRow.pct}%
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {student.register_no} · Sec {student.section}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '8px 16px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 }}
          >
            ✕ Close
          </button>
        </div>

        {/* Questions */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {questions.map((q, idx) => {
            const studentAnswer = answers[q.id] || ''
            const hasAnswer = studentAnswer.trim().length > 0
            return (
              <div key={q.id} style={{
                border: `1px solid ${hasAnswer ? 'rgba(59,130,246,0.3)' : 'rgba(244,63,94,0.2)'}`,
                borderRadius: 'var(--radius-md)', overflow: 'hidden'
              }}>
                {/* Question header */}
                <div style={{
                  padding: '12px 18px', background: 'var(--bg-tertiary)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', gap: 10
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: hasAnswer ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'var(--bg-secondary)',
                    border: hasAnswer ? 'none' : '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: hasAnswer ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.78rem', fontWeight: 700, flexShrink: 0
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', flex: 1 }}>{q.title}</span>
                  <span style={{ fontSize: '0.75rem', color: hasAnswer ? '#3b82f6' : '#f43f5e', fontWeight: 600 }}>
                    {hasAnswer ? '✓ Answered' : '✗ Not answered'}
                  </span>
                </div>

                <div style={{ padding: '16px 18px' }}>
                  {/* Prompt */}
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 14, fontSize: '0.86rem', lineHeight: 1.65, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                    {q.prompt}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {/* Student answer */}
                    <div>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: hasAnswer ? '#60a5fa' : 'var(--text-muted)', marginBottom: 6 }}>
                        Student's Answer
                      </p>
                      {hasAnswer ? (
                        <pre style={{
                          background: '#0d1117', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem', color: '#e8edf5', fontFamily: 'JetBrains Mono, monospace',
                          whiteSpace: 'pre-wrap', border: '1px solid rgba(59,130,246,0.2)',
                          margin: 0, lineHeight: 1.6, minHeight: 80
                        }}>
                          {studentAnswer}
                        </pre>
                      ) : (
                        <div style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', color: '#f43f5e', fontSize: '0.82rem', fontStyle: 'italic', minHeight: 80, display: 'flex', alignItems: 'center' }}>
                          Not answered
                        </div>
                      )}
                    </div>

                    {/* Model solution */}
                    <div>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#10b981', marginBottom: 6 }}>
                        ✓ Model Solution
                      </p>
                      <pre style={{
                        background: '#0d1117', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem', color: '#10b981', fontFamily: 'JetBrains Mono, monospace',
                        whiteSpace: 'pre-wrap', border: '1px solid rgba(16,185,129,0.2)',
                        margin: 0, lineHeight: 1.6, minHeight: 80
                      }}>
                        {q.solution}
                      </pre>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>💡 </strong>{q.explanation}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
