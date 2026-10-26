import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiFetch, API_BASE } from '../lib/api'
import { preloadRuntime } from '../lib/localBackend'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [status, setStatus] = useState(null)
  const [functions, setFunctions] = useState([])
  const [logs, setLogs] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [activeFunction, setActiveFunction] = useState(null)
  const [executionResult, setExecutionResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch initial state from backend API
  const fetchStatus = useCallback(async () => {
    try {
      const res = await apiFetch(`${API_BASE}/status`)
      if (res.ok) {
        const data = await res.json()
        setStatus(data)
      }
    } catch (err) {
      console.warn('Backend API not running locally yet, falling back to simulated frontend state.', err)
    }
  }, [])

  const fetchFunctions = useCallback(async () => {
    try {
      const res = await apiFetch(`${API_BASE}/functions`)
      if (res.ok) {
        const data = await res.json()
        setFunctions(data.functions || [])
        if (!activeFunction && data.functions?.length > 0) {
          setActiveFunction(data.functions[0])
        }
      }
    } catch (err) {
      console.warn('Failed to fetch functions from API', err)
    }
  }, [activeFunction])

  const fetchLogs = useCallback(async (streamFilter = 'all') => {
    try {
      const res = await apiFetch(`${API_BASE}/logs?stream=${streamFilter}`)
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs || [])
      }
    } catch (err) {
      console.warn('Failed to fetch logs', err)
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await apiFetch(`${API_BASE}/analytics`)
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data.metrics)
      }
    } catch (err) {
      console.warn('Failed to fetch analytics', err)
    }
  }, [])

  const refreshAll = useCallback(() => {
    fetchStatus()
    fetchFunctions()
    fetchLogs()
    fetchAnalytics()
  }, [fetchStatus, fetchFunctions, fetchLogs, fetchAnalytics])

  useEffect(() => {
    preloadRuntime()
  }, [])

  useEffect(() => {
    refreshAll()
    const interval = setInterval(refreshAll, 5000)
    return () => clearInterval(interval)
  }, [refreshAll])

  // Lambda Invocation
  const invokeLambda = async (functionId, customCode, eventPayload, memoryMb, timeoutSec) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch(`${API_BASE}/simulate/invoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functionId,
          code: customCode,
          event: eventPayload,
          memoryMb,
          timeoutSec
        })
      })

      if (res.ok) {
        const data = await res.json()
        setExecutionResult(data.result)
        refreshAll()
        return data.result
      } else {
        const errData = await res.json()
        setError(errData.error || 'Invocation failed')
      }
    } catch (err) {
      setError('Backend communication error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Quick invoke from top bar
  const triggerQuickInvoke = async () => {
    if (functions.length > 0) {
      const target = activeFunction || functions[0]
      await invokeLambda(target.id, target.code, target.sampleEvent, target.memoryMb, target.timeoutSec)
    }
  }

  // Chaos mode toggle
  const setChaosMode = async (enabled, failureType) => {
    try {
      const res = await apiFetch(`${API_BASE}/simulate/chaos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, failureType })
      })
      if (res.ok) {
        refreshAll()
      }
    } catch (err) {
      console.error('Failed to update chaos mode', err)
    }
  }

  // Reset simulation
  const resetSimulation = async () => {
    if (!window.confirm('Reset all simulation metrics, CloudWatch logs, and restore default Lambda functions?')) return
    setLoading(true)
    try {
      const res = await apiFetch(`${API_BASE}/simulate/reset`, { method: 'POST' })
      if (res.ok) {
        setExecutionResult(null)
        refreshAll()
      }
    } catch (err) {
      console.error('Failed to reset simulation', err)
    } finally {
      setLoading(false)
    }
  }

  // Clear logs
  const clearLogs = async () => {
    try {
      await apiFetch(`${API_BASE}/logs/clear`, { method: 'POST' })
      setLogs([])
    } catch (err) {
      console.error('Failed to clear logs', err)
    }
  }

  // Save/Create function
  const saveFunction = async (fnData) => {
    setLoading(true)
    try {
      const isUpdate = !!fnData.id
      const url = isUpdate ? `${API_BASE}/functions/${fnData.id}` : `${API_BASE}/functions`
      const method = isUpdate ? 'PUT' : 'POST'

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fnData)
      })

      if (res.ok) {
        const data = await res.json()
        setActiveFunction(data.function)
        refreshAll()
        return data.function
      }
    } catch (err) {
      setError('Failed to save function: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete function
  const deleteFunction = async (functionId) => {
    if (!window.confirm('Are you sure you want to delete this Lambda function?')) return
    try {
      const res = await apiFetch(`${API_BASE}/functions/${functionId}`, { method: 'DELETE' })
      if (res.ok) {
        if (activeFunction?.id === functionId) {
          setActiveFunction(null)
        }
        refreshAll()
      }
    } catch (err) {
      console.error('Failed to delete function', err)
    }
  }

  return (
    <AppContext.Provider value={{
      status,
      functions,
      logs,
      analytics,
      activeFunction,
      setActiveFunction,
      executionResult,
      loading,
      error,
      invokeLambda,
      triggerQuickInvoke,
      setChaosMode,
      resetSimulation,
      clearLogs,
      saveFunction,
      deleteFunction,
      refreshAll
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
