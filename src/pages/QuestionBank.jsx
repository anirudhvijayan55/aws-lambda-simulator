import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { questions, DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../data/mockTestData'
import PracticeEditor from '../components/PracticeEditor'

const ALL = 'all'
const DIFFICULTIES = [ALL, 'easy', 'medium', 'hard', 'debug']

function QuestionBank() {
  const [filter, setFilter] = useState(ALL)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({})
  // activeTab[id] = 'solution' | 'practice'
  const [activeTab, setActiveTab] = useState({})

  const filtered = questions.filter(q => {
    const matchesDiff = filter === ALL || q.difficulty === filter
    const term = search.toLowerCase()
    const matchesSearch = !term ||
      q.title.toLowerCase().includes(term) ||
      q.topic.toLowerCase().includes(term) ||
      q.tags.some(t => t.toLowerCase().includes(term))
    return matchesDiff && matchesSearch
  })

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  const setTab = (id, tab) => setActiveTab(prev => ({ ...prev, [id]: tab }))
  const getTab = (id) => activeTab[id] || 'solution'

  const counts = DIFFICULTIES.reduce((acc, d) => {
    acc[d] = d === ALL ? questions.length : questions.filter(q => q.difficulty === d).length
    return acc
  }, {})

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Question Bank
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Browse all {questions.length} practice questions. Click a question, then choose Solution or Practice.
        </p>
      </motion.div>

      {/* Filter + Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '28px' }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DIFFICULTIES.map(d => {
            const active = filter === d
            const color = d === ALL ? '#3b82f6' : DIFFICULTY_COLORS[d]
            return (
              <button
                key={d}
                onClick={() => setFilter(d)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${active ? color : 'var(--border-color)'}`,
                  background: active ? `${color}20` : 'transparent',
                  color: active ? color : 'var(--text-secondary)',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {d === ALL ? 'All' : DIFFICULTY_LABELS[d]}
                <span style={{ marginLeft: '6px', fontSize: '0.75rem', opacity: 0.75 }}>({counts[d]})</span>
              </button>
            )
          })}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Search by title, topic or tag…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-color)' }}
          />
        </div>
      </motion.div>

      {/* Results Count */}
      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
        Showing {filtered.length} of {questions.length} questions
        {search && <span> matching "<em>{search}</em>"</span>}
      </div>

      {/* Question List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}
            >
              <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</p>
              <p>No questions match your search.</p>
            </motion.div>
          )}

          {filtered.map((q, idx) => {
            const isOpen = !!expanded[q.id]
            const tab = getTab(q.id)
            const diffColor = DIFFICULTY_COLORS[q.difficulty]

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: idx * 0.03 }}
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${isOpen ? diffColor + '40' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s'
                }}
              >
                {/* Row Header */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '16px 20px', cursor: 'pointer', userSelect: 'none'
                  }}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: diffColor, flexShrink: 0 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {q.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <span className="tag" style={{ background: `${diffColor}18`, color: diffColor, border: `1px solid ${diffColor}30`, fontSize: '0.75rem' }}>
                      {DIFFICULTY_LABELS[q.difficulty]}
                    </span>
                    <span className="tag" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                      {q.topic}
                    </span>
                  </div>

                  <span style={{ color: 'var(--text-muted)', fontSize: '1rem', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
                    ▾
                  </span>
                </div>

                {/* Expanded Body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ borderTop: '1px solid var(--border-color)', padding: '20px' }}>
                        {/* Tags */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                          {q.tags.map(tag => (
                            <span key={tag} className="tag" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Prompt */}
                        <div style={{
                          background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)',
                          padding: '14px', color: 'var(--text-primary)', fontSize: '0.9rem',
                          lineHeight: 1.7, marginBottom: '16px', whiteSpace: 'pre-wrap'
                        }}>
                          {q.prompt}
                        </div>

                        {/* Hint */}
                        <div style={{
                          padding: '10px 14px', background: 'rgba(56,189,248,0.06)',
                          border: '1px solid rgba(56,189,248,0.15)', borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.6
                        }}>
                          <strong style={{ color: 'var(--text-accent)' }}>Hint: </strong>{q.hint}
                        </div>

                        {/* Tab Bar */}
                        <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                          {['solution', 'practice'].map(t => {
                            const active = tab === t
                            const label = t === 'solution' ? '👁 Solution' : '▶ Practice'
                            return (
                              <button
                                key={t}
                                onClick={() => setTab(q.id, t)}
                                style={{
                                  padding: '8px 20px',
                                  background: 'transparent',
                                  border: 'none',
                                  borderBottom: active ? `2px solid ${diffColor}` : '2px solid transparent',
                                  color: active ? diffColor : 'var(--text-muted)',
                                  fontWeight: active ? 700 : 500,
                                  fontSize: '0.88rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                  marginBottom: '-1px'
                                }}
                              >
                                {label}
                              </button>
                            )
                          })}
                        </div>

                        {/* Solution Tab */}
                        {tab === 'solution' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                            <SyntaxHighlighter
                              language="python"
                              style={vscDarkPlus}
                              customStyle={{ borderRadius: '8px', fontSize: '0.88rem', margin: 0, marginBottom: '12px' }}
                            >
                              {q.solution}
                            </SyntaxHighlighter>
                            <div style={{
                              background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)',
                              borderRadius: 'var(--radius-sm)', padding: '12px 14px',
                              color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.65
                            }}>
                              <strong style={{ color: 'var(--text-primary)' }}>Explanation: </strong>{q.explanation}
                            </div>
                          </motion.div>
                        )}

                        {/* Practice Tab */}
                        {tab === 'practice' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                            <PracticeEditor question={q} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default QuestionBank
