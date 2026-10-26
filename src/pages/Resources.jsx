import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Resources() {
  const { functions, saveFunction, deleteFunction, setActiveFunction } = useApp()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    runtime: 'python3.11',
    memoryMb: 512,
    timeoutSec: 10,
    layer: 'Standard-Python-Library',
    trigger: 'API Gateway (HTTP POST)',
    code: 'def lambda_handler(event, context):\n    print("Hello from custom AWS Lambda function!")\n    return {"status": 200, "message": "Success"}'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name) return
    await saveFunction(formData)
    setShowCreateModal(false)
    setFormData({
      name: '',
      description: '',
      runtime: 'python3.11',
      memoryMb: 512,
      timeoutSec: 10,
      layer: 'Standard-Python-Library',
      trigger: 'API Gateway (HTTP POST)',
      code: 'def lambda_handler(event, context):\n    print("Hello from custom AWS Lambda function!")\n    return {"status": 200, "message": "Success"}'
    })
  }

  return (
    <div className="resources-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge-aws" style={{ marginBottom: 8, display: 'inline-block' }}>Resource Management</div>
          <h1 className="page-title">AWS Lambda Functions & Layers</h1>
          <p className="page-subtitle">Manage deployed serverless compute units, configurations, and runtime layers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          ➕ Create Lambda Function
        </button>
      </div>

      {/* Functions List Table */}
      <div className="table-container" style={{ marginBottom: 32 }}>
        <table className="aws-table">
          <thead>
            <tr>
              <th>Function Name</th>
              <th>Runtime</th>
              <th>Memory</th>
              <th>Timeout</th>
              <th>Layer</th>
              <th>Trigger</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {functions.map(fn => (
              <tr key={fn.id}>
                <td>
                  <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>{fn.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{fn.description}</span>
                </td>
                <td>
                  <span style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: 4, fontWeight: 600, fontSize: '0.78rem' }}>
                    {fn.runtime}
                  </span>
                </td>
                <td><strong>{fn.memoryMb} MB</strong></td>
                <td>{fn.timeoutSec}s</td>
                <td>
                  <span style={{ color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.82rem' }}>
                    {fn.layer}
                  </span>
                </td>
                <td>{fn.trigger}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link
                      to="/simulator"
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      onClick={() => setActiveFunction(fn)}
                    >
                      ⚡ Test
                    </Link>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      onClick={() => deleteFunction(fn.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: 540, maxWidth: '90%' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Create New AWS Lambda Function</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Function Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. data-transformation-service"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: '#fff', padding: 8, borderRadius: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
                <input
                  type="text"
                  placeholder="Function purpose"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: '#fff', padding: 8, borderRadius: 4 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Memory (MB)</label>
                  <select
                    value={formData.memoryMb}
                    onChange={e => setFormData({ ...formData, memoryMb: Number(e.target.value) })}
                    style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: '#fff', padding: 8, borderRadius: 4 }}
                  >
                    <option value={128}>128 MB</option>
                    <option value={256}>256 MB</option>
                    <option value={512}>512 MB</option>
                    <option value={1024}>1024 MB (1 GB)</option>
                    <option value={2048}>2048 MB (2 GB)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Timeout (sec)</label>
                  <input
                    type="number"
                    value={formData.timeoutSec}
                    onChange={e => setFormData({ ...formData, timeoutSec: Number(e.target.value) })}
                    style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: '#fff', padding: 8, borderRadius: 4 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Function</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Resources
