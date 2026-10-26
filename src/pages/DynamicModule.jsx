import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function DynamicModule() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getLearningModules } = useApp()
  const [mod, setMod] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    getLearningModules().then(mods => {
      const found = mods.find(m => m.id === id)
      setMod(found || null)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  if (!mod) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Module not found.</div>

  const tabs = mod.tabs || []
  const currentTab = tabs[activeTab] || {}
  const sections = currentTab.sections || []

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Module header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: `${mod.color}20`, border: `2px solid ${mod.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
            {mod.icon}
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{mod.title}</h1>
            {mod.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{mod.description}</p>}
          </div>
        </div>
        {/* Accent bar */}
        <div style={{ height: 3, background: mod.color, borderRadius: 2 }} />
      </div>

      {/* Tab navigation */}
      {tabs.length > 1 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 0 }}>
          {tabs.map((t, i) => (
            <button key={t.key || i} onClick={() => setActiveTab(i)} style={{
              padding: '8px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: activeTab === i ? 700 : 400,
              fontSize: '0.88rem', color: activeTab === i ? mod.color : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === i ? mod.color : 'transparent'}`,
              marginBottom: -1, transition: 'all 0.15s'
            }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Content sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sections.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            No content in this tab yet.
          </div>
        )}
        {sections.map((s, i) => {
          if (s.type === 'heading') return (
            <h2 key={i} style={{ fontSize: '1.15rem', fontWeight: 700, color: mod.color, marginTop: 8 }}>{s.value}</h2>
          )
          if (s.type === 'code') return (
            <pre key={i} style={{
              background: '#0d1117', padding: '16px 20px', borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem', color: '#e8edf5', fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'pre-wrap', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 1.7
            }}>{s.value}</pre>
          )
          return (
            <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.75 }}>{s.value}</p>
          )
        })}
      </div>
    </div>
  )
}
