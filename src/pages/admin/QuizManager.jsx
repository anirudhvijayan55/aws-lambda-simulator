import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { modules } from '../../data/moduleData'
import { tabKeyMap } from '../../data/quizData'

const ALPHA = ['A', 'B', 'C', 'D']

const emptyForm = () => ({
  module_id: 1,
  tab_key: '',
  question: '',
  options: ['', '', '', ''],
  correct_answer: 0,
  explanation: '',
  order_num: 0,
})

function QuestionForm({ initial, moduleId, tabKey, onSave, onCancel }) {
  const [form, setForm] = useState(() => initial
    ? { ...initial, options: Array.isArray(initial.options) ? [...initial.options] : ['', '', '', ''] }
    : { ...emptyForm(), module_id: moduleId, tab_key: tabKey }
  )
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const setOpt = (i, val) => {
    const opts = [...form.options]
    opts[i] = val
    setForm(f => ({ ...f, options: opts }))
  }

  const handleSave = async () => {
    if (!form.question.trim()) return setErr('Question text is required.')
    if (form.options.some(o => !o.trim())) return setErr('All 4 options are required.')
    if (!form.explanation.trim()) return setErr('Explanation is required.')
    setErr('')
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: 16 }}>
      <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 14, color: '#60a5fa' }}>
        {initial?.id ? 'Edit Question' : 'New Question'}
      </p>

      {err && (
        <div style={{ padding: '8px 14px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-sm)', color: '#f43f5e', fontSize: '0.82rem', marginBottom: 12 }}>
          {err}
        </div>
      )}

      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Question</label>
      <textarea
        value={form.question}
        onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
        rows={3}
        style={{ width: '100%', marginTop: 4, marginBottom: 14, padding: '9px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.88rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
        placeholder="Enter question text…"
      />

      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Options (select the correct one)</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6, marginBottom: 14 }}>
        {form.options.map((opt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="radio"
              name="correct"
              checked={form.correct_answer === i}
              onChange={() => setForm(f => ({ ...f, correct_answer: i }))}
              style={{ accentColor: '#10b981', cursor: 'pointer', flexShrink: 0 }}
            />
            <span style={{ fontWeight: 700, color: form.correct_answer === i ? '#10b981' : 'var(--text-muted)', width: 20, flexShrink: 0, fontSize: '0.85rem' }}>{ALPHA[i]}.</span>
            <input
              value={opt}
              onChange={e => setOpt(i, e.target.value)}
              style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-input)', border: `1px solid ${form.correct_answer === i ? 'rgba(16,185,129,0.4)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }}
              placeholder={`Option ${ALPHA[i]}`}
            />
          </div>
        ))}
      </div>

      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Explanation</label>
      <textarea
        value={form.explanation}
        onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
        rows={2}
        style={{ width: '100%', marginTop: 4, marginBottom: 16, padding: '9px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.88rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
        placeholder="Why is this the correct answer?"
      />

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.88rem', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving…' : 'Save Question'}
        </button>
        <button
          onClick={onCancel}
          style={{ padding: '9px 18px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function QuizManager() {
  const { getAllQuizQuestions, saveQuizQuestion, deleteQuizQuestion } = useApp()

  const [allQuestions, setAllQuestions] = useState([])
  const [selectedModule, setSelectedModule] = useState(1)
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)
  const [editing, setEditing] = useState(null) // null | 'new' | question object
  const [confirmDelete, setConfirmDelete] = useState(null) // question id

  const loadAll = () => getAllQuizQuestions().then(setAllQuestions)
  useEffect(() => { loadAll() }, [])

  const currentModule = modules.find(m => m.id === selectedModule)
  const tabKeys = tabKeyMap[selectedModule] ? Object.values(tabKeyMap[selectedModule]) : []
  const tabLabels = currentModule?.tabs || []
  const selectedTabKey = tabKeys[selectedTabIdx] ?? ''

  const currentQuestions = allQuestions.filter(q => q.module_id === selectedModule && q.tab_key === selectedTabKey)

  const handleSave = async (form) => {
    const payload = {
      ...form,
      module_id: selectedModule,
      tab_key: selectedTabKey,
    }
    const { error } = await saveQuizQuestion(payload)
    if (!error) {
      setEditing(null)
      await loadAll()
    }
  }

  const handleDelete = async (id) => {
    await deleteQuizQuestion(id)
    setConfirmDelete(null)
    await loadAll()
  }

  const getTabCount = (tabKey) => allQuestions.filter(q => q.module_id === selectedModule && q.tab_key === tabKey).length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>Quiz Manager</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
          DB questions override static ones per tab. Add questions here to replace the default quiz for any module tab.
        </p>
      </div>

      {/* Module selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {modules.map(m => (
          <button
            key={m.id}
            onClick={() => { setSelectedModule(m.id); setSelectedTabIdx(0); setEditing(null) }}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit',
              fontWeight: selectedModule === m.id ? 700 : 400, fontSize: '0.85rem',
              border: `1px solid ${selectedModule === m.id ? m.color : 'var(--border-color)'}`,
              background: selectedModule === m.id ? `${m.color}18` : 'transparent',
              color: selectedModule === m.id ? m.color : 'var(--text-secondary)',
              transition: 'all 0.15s'
            }}
          >
            {m.icon} M{m.id}
          </button>
        ))}
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {tabLabels.map((label, i) => {
          const key = tabKeys[i]
          const count = getTabCount(key)
          const active = selectedTabIdx === i
          return (
            <button
              key={i}
              onClick={() => { setSelectedTabIdx(i); setEditing(null) }}
              style={{
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: active ? 700 : 400, fontSize: '0.82rem',
                border: `1px solid ${active ? '#3b82f6' : 'var(--border-color)'}`,
                background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: active ? '#3b82f6' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s'
              }}
            >
              {label}
              {count > 0 && (
                <span style={{ background: active ? '#3b82f6' : 'var(--bg-tertiary)', color: active ? '#fff' : 'var(--text-muted)', borderRadius: 20, padding: '0px 6px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Question list header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
          {tabLabels[selectedTabIdx]} — {currentQuestions.length} question{currentQuestions.length !== 1 ? 's' : ''} in DB
        </span>
        {currentQuestions.length === 0 && (
          <span style={{ padding: '3px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>
            using static data
          </span>
        )}
        <button
          onClick={() => setEditing('new')}
          style={{ marginLeft: 'auto', padding: '8px 18px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
        >
          + Add Question
        </button>
      </div>

      {/* New question form */}
      {editing === 'new' && (
        <QuestionForm
          initial={null}
          moduleId={selectedModule}
          tabKey={selectedTabKey}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* Question cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {currentQuestions.length === 0 && editing !== 'new' && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', fontSize: '0.88rem' }}>
            No DB questions for this tab. Static fallback questions will be used.<br />
            Click "Add Question" to create DB-managed questions.
          </div>
        )}

        {currentQuestions.map(q => (
          <div key={q.id}>
            {editing?.id === q.id ? (
              <QuestionForm
                initial={q}
                moduleId={selectedModule}
                tabKey={selectedTabKey}
                onSave={handleSave}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px 18px' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 12, lineHeight: 1.5 }}>{q.question}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                  {(Array.isArray(q.options) ? q.options : []).map((opt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700, color: i === q.correct_answer ? '#10b981' : 'var(--text-muted)', width: 22, flexShrink: 0 }}>
                        {ALPHA[i]}.{i === q.correct_answer ? ' ✓' : ''}
                      </span>
                      <span style={{ color: i === q.correct_answer ? '#10b981' : 'var(--text-secondary)', fontWeight: i === q.correct_answer ? 600 : 400 }}>{opt}</span>
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                    💡 {q.explanation}
                  </p>
                )}

                {confirmDelete === q.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.82rem', color: '#f43f5e', flex: 1 }}>Delete this question?</span>
                    <button onClick={() => handleDelete(q.id)} style={{ padding: '4px 12px', background: '#f43f5e', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                    <button onClick={() => setConfirmDelete(null)} style={{ padding: '4px 12px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setEditing(q)}
                      style={{ padding: '5px 14px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-sm)', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(q.id)}
                      style={{ padding: '5px 14px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-sm)', color: '#f43f5e', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
