import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

const AVATARS = ['🧑', '👩', '👨', '🧑‍💻', '👩‍💻', '👨‍💻', '🦸', '🦸‍♀️', '🎓', '🌟', '🐍', '🚀']
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F']
const SLOTS = ['8–9 AM', '9–10 AM', '10–11 AM', '11–12 PM', '1–2 PM', '2–3 PM', '3–4 PM']

// ── Shared styles ──────────────────────────────────────────────
const labelSt = {
  display: 'block', fontSize: '0.76rem', fontWeight: 600,
  color: 'var(--text-secondary)', textTransform: 'uppercase',
  letterSpacing: '0.6px', marginBottom: 6
}
const inputSt = (err) => ({
  width: '100%', padding: '10px 14px',
  background: 'var(--bg-input)',
  border: `1px solid ${err ? '#f43f5e' : 'var(--border-color)'}`,
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)', fontSize: '0.92rem',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
})
const errSt = { color: '#f43f5e', fontSize: '0.76rem', marginTop: 4 }
const primaryBtn = (color = 'linear-gradient(135deg,#3b82f6,#8b5cf6)') => ({
  flex: 1, padding: '11px 20px', background: color, border: 'none',
  borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 700,
  fontSize: '0.92rem', cursor: 'pointer', fontFamily: 'inherit'
})
const secondaryBtn = {
  padding: '11px 18px', background: 'var(--bg-tertiary)',
  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
  color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.88rem',
  cursor: 'pointer', fontFamily: 'inherit'
}
const linkBtn = {
  background: 'none', border: 'none', padding: 0,
  color: '#60a5fa', fontSize: '0.85rem', cursor: 'pointer',
  fontFamily: 'inherit', textDecoration: 'underline'
}

// ── Dot indicator ──────────────────────────────────────────────
function Dot({ n, active, done }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: done ? '#10b981' : active ? '#3b82f6' : 'var(--bg-tertiary)',
      border: `2px solid ${done ? '#10b981' : active ? '#3b82f6' : 'var(--border-color)'}`,
      color: (done || active) ? '#fff' : 'var(--text-muted)',
      fontSize: '0.8rem', fontWeight: 700, flexShrink: 0, transition: 'all 0.3s'
    }}>
      {done ? '✓' : n}
    </div>
  )
}
function StepDots({ step, total }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 28 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Dot n={i + 1} active={step === i + 1} done={step > i + 1} />
          {i < total - 1 && (
            <div style={{ width: 36, height: 2, background: step > i + 1 ? '#10b981' : 'var(--border-color)', transition: 'background 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// ADMIN LOGIN / CREATE — Email + Password
// ──────────────────────────────────────────────────────────────
const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE || 'PYLEARN_ADMIN'

function AdminLoginPane({ onBack }) {
  const { signInWithEmail, signUp, saveAdminProfile, isSupabaseReady } = useApp()
  const [mode, setMode] = useState('login') // 'login' | 'create'
  const [form, setForm] = useState({ email: '', password: '', confirm: '', name: '', adminCode: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); setServerError('') }
  const switchMode = (m) => { setMode(m); setErrors({}); setServerError('') }

  const validateLogin = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e); return !Object.keys(e).length
  }

  const validateCreate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!form.adminCode.trim()) e.adminCode = 'Admin code is required'
    else if (form.adminCode.trim() !== ADMIN_CODE) e.adminCode = 'Invalid admin code'
    setErrors(e); return !Object.keys(e).length
  }

  const handleLogin = async () => {
    if (!validateLogin()) return
    setLoading(true)
    const { error } = await signInWithEmail(form.email.trim(), form.password)
    setLoading(false)
    if (error) setServerError(error.message)
  }

  const handleCreate = async () => {
    if (!validateCreate()) return
    setLoading(true)
    const { data, error } = await signUp(form.email.trim(), form.password)
    if (error) { setServerError(error.message); setLoading(false); return }
    await saveAdminProfile(form.name.trim(), data?.user)
    setLoading(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button style={linkBtn} onClick={onBack}>← Back</button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Admin / Teacher</span>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: 3 }}>
        {['login', 'create'].map(m => (
          <button key={m} onClick={() => switchMode(m)} style={{
            flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontWeight: 600, fontSize: '0.84rem', borderRadius: 'calc(var(--radius-sm) - 2px)',
            background: mode === m ? 'var(--bg-card)' : 'transparent',
            color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
            transition: 'all 0.15s'
          }}>
            {m === 'login' ? '🔐 Sign In' : '➕ Create Account'}
          </button>
        ))}
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', color: '#f59e0b', fontSize: '0.82rem', marginBottom: 16 }}>
        {mode === 'login' ? '🔐 This area is for teachers and administrators only.' : '🔑 Use the admin code provided by the system administrator.'}
      </div>

      {serverError && (
        <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-sm)', color: '#f43f5e', fontSize: '0.85rem', marginBottom: 16 }}>
          {serverError}
        </div>
      )}

      {mode === 'login' ? (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={labelSt}>Admin Email</label>
            <input style={inputSt(errors.email)} type="email" placeholder="admin@college.edu"
              value={form.email} onChange={e => set('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus
            />
            {errors.email && <p style={errSt}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelSt}>Password</label>
            <input style={inputSt(errors.password)} type="password" placeholder="Your password"
              value={form.password} onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            {errors.password && <p style={errSt}>{errors.password}</p>}
          </div>
          <button onClick={handleLogin} disabled={loading || !isSupabaseReady}
            style={{ ...primaryBtn('linear-gradient(135deg,#f59e0b,#ef4444)'), width: '100%', opacity: (loading || !isSupabaseReady) ? 0.7 : 1 }}>
            {loading ? 'Signing in…' : '🔐 Admin Sign In'}
          </button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={labelSt}>Your Name</label>
            <input style={inputSt(errors.name)} type="text" placeholder="e.g. Dr. Priya Sharma"
              value={form.name} onChange={e => set('name', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()} autoFocus
            />
            {errors.name && <p style={errSt}>{errors.name}</p>}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelSt}>Admin Email</label>
            <input style={inputSt(errors.email)} type="email" placeholder="admin@college.edu"
              value={form.email} onChange={e => set('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
            {errors.email && <p style={errSt}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelSt}>Password</label>
            <input style={inputSt(errors.password)} type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
            {errors.password && <p style={errSt}>{errors.password}</p>}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelSt}>Confirm Password</label>
            <input style={inputSt(errors.confirm)} type="password" placeholder="Re-enter password"
              value={form.confirm} onChange={e => set('confirm', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
            {errors.confirm && <p style={errSt}>{errors.confirm}</p>}
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelSt}>Admin Code</label>
            <input style={inputSt(errors.adminCode)} type="password" placeholder="Enter admin secret code"
              value={form.adminCode} onChange={e => set('adminCode', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
            {errors.adminCode && <p style={errSt}>{errors.adminCode}</p>}
          </div>
          <button onClick={handleCreate} disabled={loading || !isSupabaseReady}
            style={{ ...primaryBtn('linear-gradient(135deg,#f59e0b,#ef4444)'), width: '100%', opacity: (loading || !isSupabaseReady) ? 0.7 : 1 }}>
            {loading ? 'Creating admin account…' : '➕ Create Admin Account'}
          </button>
        </>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// SIGN IN — Register Number + Password
// ──────────────────────────────────────────────────────────────
function SignInPane({ onCreateAccount, onAdminLogin }) {
  const { signInByRegNo, isSupabaseReady } = useApp()
  const [form, setForm] = useState({ registerNo: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); setServerError('') }

  const validate = () => {
    const e = {}
    if (!form.registerNo.trim()) e.registerNo = 'Register number is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSignIn = async () => {
    if (!validate()) return
    setLoading(true)
    const { error } = await signInByRegNo(form.registerNo.trim(), form.password)
    setLoading(false)
    if (error) setServerError(error.message)
    // success: AppContext handles the rest
  }

  if (!isSupabaseReady) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
        <p style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>Supabase not configured</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
          Add your Supabase URL and anon key to a <code>.env</code> file.<br />
          See <code>.env.example</code> for the required variables.
        </p>
      </div>
    )
  }

  return (
    <div>
      {serverError && (
        <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-sm)', color: '#f43f5e', fontSize: '0.85rem', marginBottom: 16 }}>
          {serverError}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={labelSt}>Register Number</label>
        <input
          style={inputSt(errors.registerNo)}
          placeholder="e.g. 22BCE1234"
          value={form.registerNo}
          onChange={e => set('registerNo', e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && handleSignIn()}
          autoFocus
        />
        {errors.registerNo && <p style={errSt}>{errors.registerNo}</p>}
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelSt}>Password</label>
        <input
          style={inputSt(errors.password)}
          type="password"
          placeholder="Your password"
          value={form.password}
          onChange={e => set('password', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSignIn()}
        />
        {errors.password && <p style={errSt}>{errors.password}</p>}
      </div>

      <button
        onClick={handleSignIn}
        disabled={loading}
        style={{ ...primaryBtn(), width: '100%', opacity: loading ? 0.7 : 1, marginBottom: 16 }}
      >
        {loading ? 'Signing in…' : 'Sign In →'}
      </button>

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        No account?{' '}
        <button style={linkBtn} onClick={onCreateAccount}>
          Create one →
        </button>
      </p>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <button style={{ ...linkBtn, fontSize: '0.78rem', color: '#f59e0b' }} onClick={onAdminLogin}>
          🔐 Admin / Teacher Login
        </button>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// CREATE ACCOUNT — Email + Password
// ──────────────────────────────────────────────────────────────
function CreateAccountPane({ onSignedUp, onBackToSignIn }) {
  const { signUp } = useApp()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); setServerError('') }

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleCreate = async () => {
    if (!validate()) return
    setLoading(true)
    const { error } = await signUp(form.email.trim(), form.password)
    setLoading(false)
    if (error) { setServerError(error.message); return }
    onSignedUp()
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button style={{ ...linkBtn, fontSize: '0.82rem' }} onClick={onBackToSignIn}>
          ← Back to Sign In
        </button>
      </div>

      {serverError && (
        <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius-sm)', color: '#f43f5e', fontSize: '0.85rem', marginBottom: 16 }}>
          {serverError}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={labelSt}>Email Address</label>
        <input
          style={inputSt(errors.email)}
          type="email"
          placeholder="student@college.edu"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          autoFocus
        />
        {errors.email && <p style={errSt}>{errors.email}</p>}
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelSt}>Password</label>
        <input
          style={inputSt(errors.password)}
          type="password"
          placeholder="Min 6 characters"
          value={form.password}
          onChange={e => set('password', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        {errors.password && <p style={errSt}>{errors.password}</p>}
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelSt}>Confirm Password</label>
        <input
          style={inputSt(errors.confirm)}
          type="password"
          placeholder="Re-enter password"
          value={form.confirm}
          onChange={e => set('confirm', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        {errors.confirm && <p style={errSt}>{errors.confirm}</p>}
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        style={{ ...primaryBtn(), width: '100%', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Creating account…' : 'Continue →'}
      </button>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// PROFILE — fill in details after sign-up
// ──────────────────────────────────────────────────────────────
function ProfilePane() {
  const { saveProfile } = useApp()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', registerNo: '', section: '', slot: '', avatar: '🧑' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })) }

  const validate1 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.registerNo.trim()) e.registerNo = 'Register number is required'
    setErrors(e); return !Object.keys(e).length
  }
  const validate2 = () => {
    const e = {}
    if (!form.section) e.section = 'Select your section'
    if (!form.slot) e.slot = 'Select your slot'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSave = async () => {
    setSaving(true)
    await saveProfile(form)
    setSaving(false)
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Account created! Now set up your student profile.
        </p>
      </div>

      <StepDots step={step} total={3} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: '1rem' }}>Your Details</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={labelSt}>Full Name *</label>
              <input style={inputSt(errors.name)} placeholder="e.g. Priya Sharma"
                value={form.name} onChange={e => set('name', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && validate1() && setStep(2)} autoFocus
              />
              {errors.name && <p style={errSt}>{errors.name}</p>}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelSt}>Register Number *</label>
              <input style={inputSt(errors.registerNo)} placeholder="e.g. 22BCE1234"
                value={form.registerNo} onChange={e => set('registerNo', e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && validate1() && setStep(2)}
              />
              {errors.registerNo && <p style={errSt}>{errors.registerNo}</p>}
            </div>
            <button style={primaryBtn()} onClick={() => validate1() && setStep(2)}>Continue →</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: '1rem' }}>Class Details</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={labelSt}>Section *</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SECTIONS.map(s => (
                  <button key={s} onClick={() => set('section', s)} style={{
                    padding: '8px 18px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    border: `2px solid ${form.section === s ? '#3b82f6' : 'var(--border-color)'}`,
                    background: form.section === s ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: form.section === s ? '#3b82f6' : 'var(--text-secondary)',
                    fontWeight: form.section === s ? 700 : 500, fontSize: '0.9rem', transition: 'all 0.15s'
                  }}>{s}</button>
                ))}
              </div>
              {errors.section && <p style={errSt}>{errors.section}</p>}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelSt}>Slot *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {SLOTS.map(sl => (
                  <button key={sl} onClick={() => set('slot', sl)} style={{
                    padding: '9px 14px', textAlign: 'left', cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${form.slot === sl ? '#3b82f6' : 'var(--border-color)'}`,
                    background: form.slot === sl ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: form.slot === sl ? '#3b82f6' : 'var(--text-secondary)',
                    fontWeight: form.slot === sl ? 600 : 400, fontSize: '0.88rem', transition: 'all 0.15s'
                  }}>⏰ {sl}</button>
                ))}
              </div>
              {errors.slot && <p style={errSt}>{errors.slot}</p>}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={secondaryBtn} onClick={() => setStep(1)}>← Back</button>
              <button style={primaryBtn()} onClick={() => validate2() && setStep(3)}>Continue →</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="p3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: '1rem' }}>Choose Your Avatar</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 18 }}>Pick an avatar to represent you</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10, marginBottom: 20 }}>
              {AVATARS.map(av => (
                <button key={av} onClick={() => set('avatar', av)} style={{
                  fontSize: '1.8rem', padding: '10px', cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${form.avatar === av ? '#3b82f6' : 'var(--border-color)'}`,
                  background: form.avatar === av ? 'rgba(59,130,246,0.15)' : 'var(--bg-tertiary)',
                  transform: form.avatar === av ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.15s'
                }}>{av}</button>
              ))}
            </div>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: '2.2rem' }}>{form.avatar}</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{form.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{form.registerNo} · Sec {form.section} · {form.slot}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={secondaryBtn} onClick={() => setStep(2)}>← Back</button>
              <button
                style={{ ...primaryBtn('linear-gradient(135deg,#10b981,#06b6d4)'), opacity: saving ? 0.7 : 1 }}
                onClick={handleSave} disabled={saving}
              >
                {saving ? 'Saving…' : '🚀 Start Learning'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// Main modal
// ──────────────────────────────────────────────────────────────
export default function ProfileSetup() {
  const { setupMode, isSupabaseReady } = useApp()
  // 'signin' | 'create' | 'profile' | 'admin'
  const [view, setView] = useState(setupMode === 'profile' ? 'profile' : 'signin')

  const showProfilePane = view === 'profile' || setupMode === 'profile'

  const title = showProfilePane
    ? 'Complete Your Profile'
    : view === 'create'
    ? 'Create Account'
    : view === 'admin'
    ? 'Admin Login'
    : 'Welcome to PyLearn'

  const subtitle = !showProfilePane && view === 'signin'
    ? (isSupabaseReady ? 'Sign in with your register number to track your progress.' : 'Python Problem Solving Platform')
    : !showProfilePane && view === 'create'
    ? 'Create an account using your email address.'
    : null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      overflowY: 'auto'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)', padding: '36px',
          width: '100%', maxWidth: 480,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>🐍</div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 4 }}>{title}</h2>
          {subtitle && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>{subtitle}</p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {showProfilePane ? (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProfilePane />
            </motion.div>
          ) : view === 'create' ? (
            <motion.div key="create" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <CreateAccountPane
                onSignedUp={() => setView('profile')}
                onBackToSignIn={() => setView('signin')}
              />
            </motion.div>
          ) : view === 'admin' ? (
            <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <AdminLoginPane onBack={() => setView('signin')} />
            </motion.div>
          ) : (
            <motion.div key="signin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SignInPane onCreateAccount={() => setView('create')} onAdminLogin={() => setView('admin')} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status indicator */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <span style={{
            fontSize: '0.72rem', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSupabaseReady ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
            {isSupabaseReady ? 'Connected to Supabase' : 'localStorage mode (Supabase not configured)'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
