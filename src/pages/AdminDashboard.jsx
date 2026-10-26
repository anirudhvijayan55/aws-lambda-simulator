import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { tabKeyMap } from '../data/quizData'
import { modules } from '../data/moduleData'
import { tests } from '../data/mockTestData'
import AnswerReviewModal from '../components/AnswerReviewModal'
import QuizManager from './admin/QuizManager'
import ModuleBuilder from './admin/ModuleBuilder'
import TestSubmissions from './admin/TestSubmissions'

const GRADE_COLORS = { S: '#f59e0b', A: '#10b981', B: '#3b82f6', C: '#8b5cf6', F: '#f43f5e' }
const TOTAL_TABS = Object.values(tabKeyMap).reduce((s, m) => s + Object.keys(m).length, 0)

function calcModuleProgress(quizMap, moduleId) {
  const keys = Object.values(tabKeyMap[moduleId] || {})
  if (!keys.length) return 0
  return Math.round(keys.filter(k => quizMap[k]?.passed).length / keys.length * 100)
}
function calcOverall(quizMap) {
  const ids = Object.keys(tabKeyMap).map(Number)
  if (!ids.length) return 0
  return Math.round(ids.reduce((s, id) => s + calcModuleProgress(quizMap, id), 0) / ids.length)
}

function MiniBar({ pct, color = '#3b82f6' }) {
  return (
    <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#10b981' : color, borderRadius: 3, transition: 'width 0.6s ease' }} />
    </div>
  )
}

const TABS = [
  { id: 'reports',     icon: '👥', label: 'Reports' },
  { id: 'quiz',        icon: '📝', label: 'Quiz Manager' },
  { id: 'modules',     icon: '📚', label: 'Module Builder' },
  { id: 'submissions', icon: '🎯', label: 'Test Submissions' },
]

export default function AdminDashboard() {
  const { getAllStudentData, isAdmin, signOut, profile } = useApp()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('reports')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [section, setSection] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [review, setReview] = useState(null) // { student, testRow }

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    getAllStudentData().then(d => {
      if (!d) setError('Could not fetch data. Make sure you ran the admin SQL (Step 6 in supabase.js).')
      else setData(d)
      setLoading(false)
    })
  }, [isAdmin])

  if (!isAdmin) return null

  // ── Build per-student maps ──────────────────────────────────
  const students = (data?.profiles || []).map(p => {
    const quizRows = (data?.quiz_scores || []).filter(q => q.user_id === p.id)
    const testRows = (data?.test_scores || []).filter(t => t.user_id === p.id)
    const quizMap = quizRows.reduce((acc, r) => { acc[r.tab_key] = r; return acc }, {})
    const testMap = testRows.reduce((acc, r) => { acc[r.test_id] = r; return acc }, {})
    const passedCount = quizRows.filter(r => r.passed).length
    const overall = calcOverall(quizMap)
    const bestTest = testRows.length ? testRows.reduce((best, r) => (!best || r.pct > best.pct ? r : best), null) : null
    return { ...p, quizMap, testMap, quizRows, testRows, passedCount, overall, bestTest }
  })

  const sections = ['All', ...new Set(students.map(s => s.section).filter(Boolean).sort())]

  const filtered = students.filter(s => {
    const matchSearch = !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.register_no?.toLowerCase().includes(search.toLowerCase())
    const matchSection = section === 'All' || s.section === section
    return matchSearch && matchSection
  })

  // ── Aggregate stats ─────────────────────────────────────────
  const avgOverall = students.length ? Math.round(students.reduce((s, st) => s + st.overall, 0) / students.length) : 0
  const fullPass = students.filter(s => s.overall === 100).length
  const testCompleted = students.filter(s => s.testRows.length > 0).length

  return (
    <div style={{ maxWidth: 1200 }}>
      {review && (
        <AnswerReviewModal
          student={review.student}
          testRow={review.testRow}
          onClose={() => setReview(null)}
        />
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              🔐 ADMIN PANEL
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Welcome, {profile?.name} · BACSE101 — Python Problem Solving
            </p>
          </div>
          <button
            onClick={() => { signOut() }}
            style={{ padding: '8px 18px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-color)', marginBottom: 28, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '11px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: activeTab === t.id ? 700 : 400,
              fontSize: '0.88rem',
              color: activeTab === t.id ? '#3b82f6' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === t.id ? '#3b82f6' : 'transparent'}`,
              marginBottom: -1, whiteSpace: 'nowrap', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── REPORTS TAB ── */}
      {activeTab === 'reports' && (
        <div>
          {/* Summary Stats */}
          {!loading && !error && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { icon: '👥', value: students.length, label: 'Total Students', color: '#3b82f6' },
                { icon: '📊', value: `${avgOverall}%`, label: 'Avg Progress', color: '#8b5cf6' },
                { icon: '🏆', value: fullPass, label: 'Completed All', color: '#10b981' },
                { icon: '📝', value: testCompleted, label: 'Took Tests', color: '#f59e0b' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                  <div>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or register no…"
              style={{ flex: 1, minWidth: 200, padding: '9px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {sections.map(s => (
                <button key={s} onClick={() => setSection(s)} style={{
                  padding: '7px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
                  border: `1px solid ${section === s ? '#3b82f6' : 'var(--border-color)'}`,
                  background: section === s ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: section === s ? '#3b82f6' : 'var(--text-secondary)'
                }}>{s === 'All' ? 'All Sections' : `Sec ${s}`}</button>
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '16px 20px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-md)', color: '#f43f5e', marginBottom: 20 }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
              Loading student data…
            </div>
          )}

          {/* Student Table */}
          {!loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr', gap: 12, padding: '8px 16px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span>Student</span><span>Section</span><span>Quizzes</span><span>Progress</span><span>Module Breakdown</span><span>Best Test</span>
              </div>

              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No students found.</div>
              )}

              {filtered.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  {/* Main row */}
                  <div
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr', gap: 12, padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: expanded === s.id ? 'var(--radius-md) var(--radius-md) 0 0' : 'var(--radius-md)', cursor: 'pointer', alignItems: 'center', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
                  >
                    {/* Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.4rem' }}>{s.avatar || '🧑'}</span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>{s.name}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.register_no}</p>
                      </div>
                    </div>

                    {/* Section / Slot */}
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>Sec {s.section}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.slot}</p>
                    </div>

                    {/* Quizzes passed */}
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: s.passedCount >= TOTAL_TABS ? '#10b981' : 'var(--text-primary)' }}>
                        {s.passedCount}/{TOTAL_TABS}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>passed</p>
                    </div>

                    {/* Overall % */}
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: s.overall >= 80 ? '#10b981' : s.overall >= 40 ? '#f59e0b' : 'var(--text-muted)' }}>
                        {s.overall}%
                      </p>
                      <MiniBar pct={s.overall} />
                    </div>

                    {/* Module mini bars */}
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {modules.map(m => {
                        const p = calcModuleProgress(s.quizMap, m.id)
                        return (
                          <div key={m.id} title={`Module ${m.id}: ${p}%`} style={{ flex: 1 }}>
                            <MiniBar pct={p} color={m.color} />
                          </div>
                        )
                      })}
                    </div>

                    {/* Best test grade */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {s.bestTest ? (
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, background: `${GRADE_COLORS[s.bestTest.grade]}18`, color: GRADE_COLORS[s.bestTest.grade], border: `1px solid ${GRADE_COLORS[s.bestTest.grade]}30` }}>
                          {s.bestTest.emoji} {s.bestTest.grade}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: 'auto' }}>
                        {expanded === s.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expanded === s.id && (
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderTop: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)', padding: '16px 20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        {/* Module quiz scores */}
                        <div>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Module Quiz Scores</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {modules.map(m => {
                              const pct = calcModuleProgress(s.quizMap, m.id)
                              const keys = Object.values(tabKeyMap[m.id] || {})
                              const passed = keys.filter(k => s.quizMap[k]?.passed).length
                              return (
                                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <span style={{ fontSize: '0.8rem', color: m.color, fontWeight: 600, width: 70, flexShrink: 0 }}>M{m.id}</span>
                                  <div style={{ flex: 1 }}><MiniBar pct={pct} color={m.color} /></div>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: 55, textAlign: 'right', flexShrink: 0 }}>
                                    {passed}/{keys.length} ({pct}%)
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Test scores */}
                        <div>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Test Scores</p>
                          {s.testRows.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No tests taken yet.</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {s.testRows.map(t => {
                                const testInfo = tests.find(x => x.id === t.test_id)
                                const hasAnswers = t.answers && Object.keys(t.answers).length > 0
                                return (
                                  <div key={t.test_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: '0.8rem', flex: 1 }}>{testInfo?.title ?? t.test_id}</span>
                                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: `${GRADE_COLORS[t.grade]}18`, color: GRADE_COLORS[t.grade], border: `1px solid ${GRADE_COLORS[t.grade]}30` }}>
                                      {t.emoji} {t.grade} ({t.pct}%)
                                    </span>
                                    <button
                                      onClick={e => { e.stopPropagation(); setReview({ student: s, testRow: t }) }}
                                      title={hasAnswers ? 'Review student answers' : 'No answers saved'}
                                      style={{
                                        padding: '3px 10px', fontSize: '0.73rem', fontWeight: 600, cursor: hasAnswers ? 'pointer' : 'not-allowed',
                                        border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                                        background: hasAnswers ? 'rgba(59,130,246,0.1)' : 'transparent',
                                        color: hasAnswers ? '#60a5fa' : 'var(--text-muted)', fontFamily: 'inherit',
                                        opacity: hasAnswers ? 1 : 0.5, flexShrink: 0
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
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── QUIZ MANAGER TAB ── */}
      {activeTab === 'quiz' && <QuizManager />}

      {/* ── MODULE BUILDER TAB ── */}
      {activeTab === 'modules' && <ModuleBuilder />}

      {/* ── TEST SUBMISSIONS TAB ── */}
      {activeTab === 'submissions' && <TestSubmissions students={students} />}
    </div>
  )
}
