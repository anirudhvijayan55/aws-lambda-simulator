import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tests } from '../data/mockTestData'
import { useApp } from '../context/AppContext'

const GRADE_COLORS = { S: '#f59e0b', A: '#10b981', B: '#3b82f6', C: '#8b5cf6', F: '#f43f5e' }

function MockTests() {
  const navigate = useNavigate()
  const { getTestBest } = useApp()

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px' }}
      >
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Mock Tests
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Timed practice sessions to prepare for your PAT Assessment. Choose a test below.
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>How it works:</strong>{' '}
          Each test is timed. Write your answers in the text boxes provided. When you submit,
          the full solution and explanation for each question will be revealed.
          You can retake any test as many times as you like.
        </div>
      </motion.div>

      {/* Test Cards */}
      <div className="grid-3" style={{ gap: '24px' }}>
        {tests.map((test, idx) => {
          const best = getTestBest(test.id)
          return (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.08 }}
            whileHover={{ y: -4 }}
            onClick={() => navigate(`/mock-test/${test.id}`)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              cursor: 'pointer',
              transition: 'border-color var(--transition-normal), box-shadow var(--transition-normal)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = test.color
              e.currentTarget.style.boxShadow = `0 8px 30px ${test.color}22`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-color)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Gradient accent bar */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '3px',
              background: test.gradient
            }} />

            {/* Icon + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>{test.icon}</span>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {test.title}
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
              {test.description}
            </p>

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              <span className="tag" style={{ background: `${test.color}18`, color: test.color, border: `1px solid ${test.color}30` }}>
                ⏱ {test.timeLimit} min
              </span>
              <span className="tag" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                {test.questionIds.length} questions
              </span>
            </div>

            {/* Topics */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {test.topics.map(topic => (
                <span key={topic} className="tag" style={{ fontSize: '0.72rem', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  {topic}
                </span>
              ))}
            </div>

            {/* Personal best */}
            {best && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: `${GRADE_COLORS[best.grade]}10`, border: `1px solid ${GRADE_COLORS[best.grade]}30`, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Personal Best</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: GRADE_COLORS[best.grade] }}>{best.emoji} Grade {best.grade} — {best.pct}%</p>
                </div>
                <div style={{ height: 32, width: 32, borderRadius: '50%', background: `${GRADE_COLORS[best.grade]}20`, border: `2px solid ${GRADE_COLORS[best.grade]}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: GRADE_COLORS[best.grade] }}>
                  {best.grade}
                </div>
              </div>
            )}

            {/* Start Button */}
            <button
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '10px',
                background: test.gradient,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                letterSpacing: '0.3px'
              }}
            >
              {best ? '🔄 Retake Test →' : 'Start Test →'}
            </button>
          </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default MockTests
