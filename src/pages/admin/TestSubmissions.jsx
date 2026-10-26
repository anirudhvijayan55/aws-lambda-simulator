import { useState } from 'react'
import { tests } from '../../data/mockTestData'
import AnswerReviewModal from '../../components/AnswerReviewModal'

const GRADE_COLORS = { S: '#f59e0b', A: '#10b981', B: '#3b82f6', C: '#8b5cf6', F: '#f43f5e' }

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '—'
  }
}

export default function TestSubmissions({ students }) {
  const [search, setSearch] = useState('')
  const [testFilter, setTestFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('All')
  const [review, setReview] = useState(null)

  // Flatten all attempts
  const allAttempts = []
  for (const s of students) {
    for (const t of (s.testRows || [])) {
      allAttempts.push({ student: s, testRow: t })
    }
  }

  // Sort most recent first
  allAttempts.sort((a, b) => {
    const da = a.testRow.updated_at ? new Date(a.testRow.updated_at) : 0
    const db = b.testRow.updated_at ? new Date(b.testRow.updated_at) : 0
    return db - da
  })

  const sections = ['All', ...new Set(students.map(s => s.section).filter(Boolean).sort())]

  const filtered = allAttempts.filter(({ student, testRow }) => {
    const matchSearch = !search ||
      student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.register_no?.toLowerCase().includes(search.toLowerCase())
    const matchTest = testFilter === 'all' || testRow.test_id === testFilter
    const matchSection = sectionFilter === 'All' || student.section === sectionFilter
    return matchSearch && matchTest && matchSection
  })

  return (
    <div>
      {review && (
        <AnswerReviewModal
          student={review.student}
          testRow={review.testRow}
          onClose={() => setReview(null)}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>Test Submissions</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
          All student test attempts. Click Review to see full answers and model solutions.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or register no…"
          style={{ flex: 1, minWidth: 200, padding: '8px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
        />
        <select
          value={testFilter}
          onChange={e => setTestFilter(e.target.value)}
          style={{ padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
        >
          <option value="all">All Tests</option>
          {tests.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {sections.map(s => (
            <button
              key={s}
              onClick={() => setSectionFilter(s)}
              style={{
                padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
                border: `1px solid ${sectionFilter === s ? '#3b82f6' : 'var(--border-color)'}`,
                background: sectionFilter === s ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: sectionFilter === s ? '#3b82f6' : 'var(--text-secondary)'
              }}
            >
              {s === 'All' ? 'All Sections' : `Sec ${s}`}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{filtered.length} attempt{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
          No submissions found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: 12, padding: '10px 16px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Student</span>
            <span>Test</span>
            <span>Section</span>
            <span>Grade</span>
            <span>Answered</span>
            <span>Review</span>
          </div>

          {filtered.map(({ student, testRow }, idx) => {
            const testInfo = tests.find(t => t.id === testRow.test_id)
            const hasAnswers = testRow.answers && Object.keys(testRow.answers).length > 0
            const gradeColor = GRADE_COLORS[testRow.grade] || 'var(--text-muted)'
            return (
              <div
                key={`${student.id}-${testRow.test_id}`}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: 12,
                  padding: '13px 16px', alignItems: 'center',
                  background: idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)',
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}
              >
                {/* Student */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{student.avatar || '🧑'}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{student.register_no}</p>
                  </div>
                </div>

                {/* Test */}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {testInfo?.icon ?? '📝'} {testInfo?.title ?? testRow.test_id}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatDate(testRow.updated_at)}</p>
                </div>

                {/* Section */}
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sec {student.section}</span>

                {/* Grade */}
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, background: `${gradeColor}18`, color: gradeColor, border: `1px solid ${gradeColor}30`, display: 'inline-block' }}>
                  {testRow.emoji} {testRow.grade}
                </span>

                {/* Answered */}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {testRow.score}/{testRow.total} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({testRow.pct}%)</span>
                </span>

                {/* Review button */}
                <button
                  onClick={() => hasAnswers && setReview({ student, testRow })}
                  disabled={!hasAnswers}
                  title={hasAnswers ? 'Review student answers' : 'No answers saved'}
                  style={{
                    padding: '5px 12px', fontSize: '0.78rem', fontWeight: 600, cursor: hasAnswers ? 'pointer' : 'not-allowed',
                    border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                    background: hasAnswers ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: hasAnswers ? '#60a5fa' : 'var(--text-muted)', fontFamily: 'inherit',
                    opacity: hasAnswers ? 1 : 0.45
                  }}
                >
                  📋 Review
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
