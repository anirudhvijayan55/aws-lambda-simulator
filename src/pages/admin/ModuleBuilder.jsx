import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

const EMOJI_OPTIONS = ['📚', '🐍', '⚙️', '🔀', '📦', '📊', '🌍', '🎯', '💡', '🚀', '🔬', '🧮']
const COLOR_OPTIONS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#ec4899']
const SECTION_TYPES = ['heading', 'text', 'code']

const emptyModule = () => ({
  module_num: 7,
  title: '',
  description: '',
  icon: '📚',
  color: '#3b82f6',
  is_published: false,
  tabs: [],
})

const emptyTab = () => ({
  key: `tab-${Date.now()}`,
  label: '',
  sections: [],
})

const emptySection = (type) => ({ type, value: '' })

function ModuleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => initial
    ? { ...initial, tabs: (initial.tabs || []).map(t => ({ ...t, sections: (t.sections || []).map(s => ({ ...s })) })) }
    : emptyModule()
  )
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const addTab = () => setForm(f => ({ ...f, tabs: [...f.tabs, emptyTab()] }))
  const removeTab = (ti) => setForm(f => ({ ...f, tabs: f.tabs.filter((_, i) => i !== ti) }))
  const updateTab = (ti, key, val) => setForm(f => {
    const tabs = [...f.tabs]
    tabs[ti] = { ...tabs[ti], [key]: val }
    return { ...f, tabs }
  })

  const addSection = (ti, type) => setForm(f => {
    const tabs = [...f.tabs]
    tabs[ti] = { ...tabs[ti], sections: [...(tabs[ti].sections || []), emptySection(type)] }
    return { ...f, tabs }
  })
  const removeSection = (ti, si) => setForm(f => {
    const tabs = [...f.tabs]
    tabs[ti] = { ...tabs[ti], sections: tabs[ti].sections.filter((_, i) => i !== si) }
    return { ...f, tabs }
  })
  const updateSection = (ti, si, val) => setForm(f => {
    const tabs = [...f.tabs]
    const sections = [...tabs[ti].sections]
    sections[si] = { ...sections[si], value: val }
    tabs[ti] = { ...tabs[ti], sections }
    return { ...f, tabs }
  })

  const handleSave = async () => {
    if (!form.title.trim()) return setErr('Title is required.')
    if (form.module_num < 7) return setErr('Module number must be 7 or higher.')
    setErr('')
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 20 }}>
        {initial?.id ? 'Edit Module' : 'New Custom Module'}
      </h3>

      {err && (
        <div style={{ padding: '8px 14px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-sm)', color: '#f43f5e', fontSize: '0.82rem', marginBottom: 16 }}>
          {err}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Module #</label>
          <input type="number" min={7} value={form.module_num} onChange={e => setForm(f => ({ ...f, module_num: Number(e.target.value) }))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Title</label>
          <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder="Module title…" />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Short description…" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Icon</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {EMOJI_OPTIONS.map(e => (
              <button key={e} onClick={() => setForm(f => ({ ...f, icon: e }))} style={{ width: 36, height: 36, fontSize: '1.2rem', borderRadius: 'var(--radius-sm)', border: `2px solid ${form.icon === e ? '#3b82f6' : 'var(--border-color)'}`, background: form.icon === e ? 'rgba(59,130,246,0.15)' : 'var(--bg-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Color</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {COLOR_OPTIONS.map(c => (
              <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: `3px solid ${form.color === c ? '#fff' : 'transparent'}`, cursor: 'pointer', boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none', transition: 'all 0.15s' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs editor */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Tabs</label>
          <button onClick={addTab} style={{ padding: '4px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-sm)', color: '#60a5fa', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
            + Add Tab
          </button>
        </div>

        {form.tabs.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}>
            No tabs yet. Add a tab to start adding content.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {form.tabs.map((tab, ti) => (
            <div key={tab.key || ti} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <input
                  value={tab.label}
                  onChange={e => updateTab(ti, 'label', e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder={`Tab ${ti + 1} label`}
                />
                <button onClick={() => removeTab(ti)} style={{ padding: '6px 12px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-sm)', color: '#f43f5e', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                  Remove Tab
                </button>
              </div>

              {/* Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                {(tab.sections || []).map((sec, si) => (
                  <div key={si} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8, alignItems: 'flex-start' }}>
                    <select
                      value={sec.type}
                      onChange={e => {
                        const tabs = [...form.tabs]
                        const sections = [...tabs[ti].sections]
                        sections[si] = { ...sections[si], type: e.target.value }
                        tabs[ti] = { ...tabs[ti], sections }
                        setForm(f => ({ ...f, tabs }))
                      }}
                      style={{ padding: '7px 8px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}
                    >
                      {SECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <textarea
                      value={sec.value}
                      onChange={e => updateSection(ti, si, e.target.value)}
                      rows={sec.type === 'heading' ? 1 : sec.type === 'code' ? 4 : 2}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: sec.type === 'code' ? 'JetBrains Mono, monospace' : 'inherit', fontSize: sec.type === 'code' ? '0.82rem' : '0.88rem' }}
                      placeholder={sec.type === 'heading' ? 'Heading text…' : sec.type === 'code' ? 'Code snippet…' : 'Paragraph text…'}
                    />
                    <button onClick={() => removeSection(ti, si)} style={{ padding: '7px 10px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {SECTION_TYPES.map(t => (
                  <button key={t} onClick={() => addSection(ti, t)} style={{ padding: '5px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                    + {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Published */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
        <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} style={{ accentColor: '#10b981', width: 16, height: 16, cursor: 'pointer' }} />
        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Published (visible to students)</span>
      </label>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleSave} disabled={saving} style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.88rem', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : 'Save Module'}
        </button>
        <button onClick={onCancel} style={{ padding: '10px 18px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function ModuleBuilder() {
  const { getLearningModules, saveLearningModule, deleteLearningModule } = useApp()

  const [mods, setMods] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | 'new' | module object
  const [confirmDelete, setConfirmDelete] = useState(null)

  const loadMods = () => getLearningModules().then(d => { setMods(d); setLoading(false) })
  useEffect(() => { loadMods() }, [])

  const handleSave = async (form) => {
    const { error } = await saveLearningModule(form)
    if (!error) { setEditing(null); await loadMods() }
  }

  const handleDelete = async (id) => {
    await deleteLearningModule(id)
    setConfirmDelete(null)
    await loadMods()
  }

  const handleTogglePublish = async (mod) => {
    await saveLearningModule({ ...mod, is_published: !mod.is_published })
    await loadMods()
  }

  if (editing) {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>Module Builder</h2>
        </div>
        <ModuleForm
          initial={editing === 'new' ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>Module Builder</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Create custom learning modules with tabs and content sections.
          </p>
        </div>
        <button
          onClick={() => setEditing('new')}
          style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
        >
          + New Module
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading modules…</div>
      )}

      {!loading && mods.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
          No custom modules yet. Click "New Module" to create one.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mods.map(mod => (
          <div key={mod.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              {/* Icon */}
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${mod.color}20`, border: `2px solid ${mod.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                {mod.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{mod.title}</span>
                  <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: `${mod.color}15`, color: mod.color, border: `1px solid ${mod.color}30` }}>
                    M{mod.module_num}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: mod.is_published ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: mod.is_published ? '#10b981' : 'var(--text-muted)', border: `1px solid ${mod.is_published ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'}` }}>
                    {mod.is_published ? '● Published' : '○ Draft'}
                  </span>
                </div>
                {mod.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 4 }}>{mod.description}</p>
                )}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  {(mod.tabs || []).length} tab{(mod.tabs || []).length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={() => handleTogglePublish(mod)}
                  style={{ padding: '5px 12px', background: mod.is_published ? 'rgba(107,114,128,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${mod.is_published ? 'var(--border-color)' : 'rgba(16,185,129,0.3)'}`, borderRadius: 'var(--radius-sm)', color: mod.is_published ? 'var(--text-secondary)' : '#10b981', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                >
                  {mod.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => setEditing(mod)} style={{ padding: '5px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-sm)', color: '#60a5fa', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                  Edit
                </button>
                {confirmDelete === mod.id ? (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#f43f5e' }}>Sure?</span>
                    <button onClick={() => handleDelete(mod.id)} style={{ padding: '4px 10px', background: '#f43f5e', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>Delete</button>
                    <button onClick={() => setConfirmDelete(null)} style={{ padding: '4px 10px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem' }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(mod.id)} style={{ padding: '5px 12px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-sm)', color: '#f43f5e', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
