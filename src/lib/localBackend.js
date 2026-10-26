// In-browser port of the Flask backend (backend/*.py) so the simulator runs as a
// fully static site (GitHub Pages). Python handlers execute via Pyodide (WebAssembly)
// and simulation state is persisted to localStorage.

import { loadPyodide } from '../utils/pythonRunner'
import { INITIAL_LAMBDA_FUNCTIONS } from '../data/lambdaFunctions'

const STORAGE_KEY = 'aws-lambda-sim-state-v1'

const DEFAULT_STATS = {
  total_invocations: 0,
  successful_invocations: 0,
  failed_invocations: 0,
  total_execution_time_ms: 0,
  chaos_mode_enabled: false,
  chaos_failure_type: 'none' // "none", "timeout", "oom", "throttle"
}

const DEFAULT_LATENCY = [24.5, 32.1, 18.9, 45.2, 28.0, 110.4, 21.0, 35.8, 19.4, 40.1]
const INVOCATION_HOURLY = [12, 28, 45, 89, 120, 154, 210, 180, 140, 95, 60, 40]

const clone = (obj) => JSON.parse(JSON.stringify(obj))
const shortId = () => crypto.randomUUID().slice(0, 8)

function nowStamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ── State (persisted) ──────────────────────────────────────────────
function freshState() {
  const s = {
    functions: clone(INITIAL_LAMBDA_FUNCTIONS),
    logs: [],
    stats: { ...DEFAULT_STATS },
    latencyHistory: [...DEFAULT_LATENCY]
  }
  addSystemLog(s, 'CloudWatch Log Stream initialized for AWS Lambda service.')
  return s
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* fall through to defaults */ }
  return freshState()
}

let state = loadState()

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* storage unavailable — keep in-memory state */ }
}

// ── CloudWatch logger ──────────────────────────────────────────────
function pushLog(s, entry) {
  s.logs.unshift({ id: shortId(), timestamp: nowStamp(), ...entry })
  if (s.logs.length > 300) s.logs.length = 300
}

function addSystemLog(s, message, type = 'INFO') {
  pushLog(s, { type, message, stream: 'syslog' })
}

function logInvocation(functionName, requestId, status, durationMs, memoryMb, stdout, stderr) {
  pushLog(state, {
    type: 'START',
    message: `START RequestId: ${requestId} Version: $LATEST (Function: ${functionName})`,
    stream: functionName
  })
  for (const line of (stdout || '').trim().split('\n')) {
    if (line) pushLog(state, { type: 'LOG', message: `[STDOUT] ${line}`, stream: functionName })
  }
  for (const line of (stderr || '').trim().split('\n')) {
    if (line) pushLog(state, { type: 'ERROR', message: `[STDERR] ${line}`, stream: functionName })
  }

  const billed = billedDuration(durationMs)
  const maxMemUsed = Math.min(memoryMb, Math.max(16, Math.floor(memoryMb * (0.35 + Math.random() * 0.4))))
  pushLog(state, {
    type: status === 200 ? 'REPORT' : 'REPORT_ERROR',
    message:
      `REPORT RequestId: ${requestId} Duration: ${durationMs.toFixed(2)} ms ` +
      `Billed Duration: ${billed} ms Memory Size: ${memoryMb} MB ` +
      `Max Memory Used: ${maxMemUsed} MB Status: ${status === 200 ? 'SUCCESS' : 'ERROR'}`,
    stream: functionName
  })
}

const billedDuration = (ms) => Math.floor((ms + 99) / 100) * 100

// ── Lambda executor (Pyodide) ──────────────────────────────────────
const LAMBDA_RUNTIME = `
import sys, json, traceback
from io import StringIO

_out, _err = StringIO(), StringIO()
_orig_stdout, _orig_stderr = sys.stdout, sys.stderr
sys.stdout, sys.stderr = _out, _err

_RES_OUTPUT = None
_RES_ERROR = None
try:
    _event = json.loads(_event_js)
    _ns = {
        "__name__": "__main__",
        "event": _event,
        "context": json.loads(_context_js),
    }
    exec(_code_js, _ns)
    _fn = _ns.get("lambda_handler") or _ns.get("handler")
    if callable(_fn):
        _val = _fn(_event, _ns["context"])
        _RES_OUTPUT = str(_val) if _val is not None else None
except Exception as _e:
    _RES_ERROR = type(_e).__name__
    _err.write(traceback.format_exc())
finally:
    sys.stdout, sys.stderr = _orig_stdout, _orig_stderr

_RES_STDOUT = _out.getvalue()
_RES_STDERR = _err.getvalue()
`

async function executePythonCode(functionName, code, eventPayload, memoryMb, timeoutSec) {
  state.stats.total_invocations += 1
  const requestId = crypto.randomUUID()

  // Chaos failure simulation
  if (state.stats.chaos_mode_enabled) {
    const failures = {
      timeout: {
        statusCode: 504, durationMs: timeoutSec * 1000, billedDurationMs: timeoutSec * 1000,
        logs: `Task timed out after ${timeoutSec}.00 seconds (Chaos Simulation: Timeout)`,
        error: 'TaskTimedOutException'
      },
      oom: {
        statusCode: 500, durationMs: 45, billedDurationMs: 100,
        logs: `Memory limit exceeded (${memoryMb} MB limit reached). Runtime killed (Chaos Simulation).`,
        error: 'OutOfMemoryException'
      },
      throttle: {
        statusCode: 429, durationMs: 5, billedDurationMs: 100,
        logs: 'Rate Exceeded. ConcurrentInvocationLimitExceeded (429 Too Many Requests).',
        error: 'TooManyRequestsException'
      }
    }
    const f = failures[state.stats.chaos_failure_type]
    if (f) {
      if (state.stats.chaos_failure_type === 'timeout') await new Promise(r => setTimeout(r, 150))
      state.stats.failed_invocations += 1
      logInvocation(functionName, requestId, f.statusCode, f.durationMs, memoryMb, '', f.logs)
      return { requestId, memorySizeMb: memoryMb, output: null, stderr: f.logs, ...f }
    }
  }

  let stdout = ''
  let stderr = ''
  let output = null
  let errorType = null

  // Cold start (loading the Python runtime and layer packages) is not billed to the invocation
  const py = await loadPyodide()
  try {
    await py.loadPackagesFromImports(code)
  } catch { /* missing packages surface as ImportError when the handler runs */ }
  const start = performance.now()
  try {
    py.globals.set('_code_js', code)
    py.globals.set('_event_js', JSON.stringify(eventPayload || {}))
    py.globals.set('_context_js', JSON.stringify({
      function_name: functionName,
      aws_request_id: requestId,
      memory_limit_in_mb: memoryMb
    }))
    await py.runPythonAsync(LAMBDA_RUNTIME)
    stdout = py.globals.get('_RES_STDOUT')
    stderr = py.globals.get('_RES_STDERR')
    output = py.globals.get('_RES_OUTPUT') ?? null
    errorType = py.globals.get('_RES_ERROR') ?? null
  } catch (err) {
    errorType = 'RuntimeError'
    stderr = String(err?.message || err)
  }

  const durationMs = Math.round((performance.now() - start) * 100) / 100
  const statusCode = errorType ? 500 : 200

  if (statusCode === 200) state.stats.successful_invocations += 1
  else state.stats.failed_invocations += 1
  state.stats.total_execution_time_ms += durationMs

  logInvocation(functionName, requestId, statusCode, durationMs, memoryMb, stdout, stderr)

  return {
    statusCode,
    requestId,
    durationMs,
    billedDurationMs: billedDuration(durationMs),
    memorySizeMb: memoryMb,
    stdout,
    stderr,
    output,
    error: errorType
  }
}

// ── Analytics engine ───────────────────────────────────────────────
function recordInvocation(durationMs) {
  state.latencyHistory.push(durationMs)
  if (state.latencyHistory.length > 100) state.latencyHistory.shift()
}

function calculateCost(monthlyRequests = 1000000, avgDurationMs = 100, memoryMb = 512) {
  // $0.20 per 1M requests, $0.0000166667 per GB-second
  // Free tier: 1M requests & 400,000 GB-seconds / month
  const totalGbSeconds = monthlyRequests * (avgDurationMs / 1000) * (memoryMb / 1024)
  const billableRequests = Math.max(0, monthlyRequests - 1000000)
  const billableGbSeconds = Math.max(0, totalGbSeconds - 400000)
  const requestCost = (billableRequests / 1000000) * 0.20
  const computeCost = billableGbSeconds * 0.0000166667
  const totalCost = requestCost + computeCost
  const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d

  return {
    monthlyRequests,
    avgDurationMs,
    memoryMb,
    totalGbSeconds: round(totalGbSeconds, 2),
    billableRequests,
    billableGbSeconds: round(billableGbSeconds, 2),
    requestCost: round(requestCost, 4),
    computeCost: round(computeCost, 4),
    totalCostMonthly: round(totalCost, 2),
    freeTierCovered: totalCost === 0
  }
}

function getPerformanceMetrics() {
  const { total_invocations: total, successful_invocations: succ, failed_invocations: fail } = state.stats
  const latencies = state.latencyHistory.length ? [...state.latencyHistory].sort((a, b) => a - b) : [0]
  const max = latencies[latencies.length - 1]
  const p50 = latencies[Math.floor(latencies.length * 0.5)]
  const p95 = latencies.length >= 20 ? latencies[Math.floor(latencies.length * 0.95)] : max
  const p99 = latencies.length >= 100 ? latencies[Math.floor(latencies.length * 0.99)] : max
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length
  const r2 = (n) => Math.round(n * 100) / 100

  return {
    totalInvocations: total,
    successfulInvocations: succ,
    failedInvocations: fail,
    errorRatePercent: total > 0 ? Math.round((fail / total) * 1000) / 10 : 0,
    successRatePercent: total > 0 ? Math.round((succ / total) * 1000) / 10 : 100,
    latencyMetrics: { avgMs: r2(avg), p50Ms: r2(p50), p95Ms: r2(p95), p99Ms: r2(p99) },
    recentLatencySamples: state.latencyHistory.slice(-15),
    hourlyInvocationTrend: INVOCATION_HOURLY
  }
}

// ── Lambda function manager ────────────────────────────────────────
const findFn = (id) => state.functions.find(f => f.id === id)

function createFunction(data) {
  const id = `fn-${shortId()}`
  const now = nowStamp()
  const fn = {
    id,
    name: data.name || `custom-lambda-${id}`,
    description: data.description || 'Custom simulated AWS Lambda function',
    runtime: data.runtime || 'python3.11',
    handler: data.handler || 'lambda_handler',
    memoryMb: parseInt(data.memoryMb ?? 512, 10),
    timeoutSec: parseInt(data.timeoutSec ?? 10, 10),
    layer: data.layer || 'Standard-Python-Library',
    trigger: data.trigger || 'API Gateway (HTTP POST)',
    code: data.code || "# Write Python code here\ndef lambda_handler(event, context):\n    print('Hello from Lambda!')\n    return {'statusCode': 200, 'body': 'OK'}\n",
    sampleEvent: data.sampleEvent || {},
    created_at: now,
    last_modified: now
  }
  state.functions.push(fn)
  return fn
}

function updateFunction(id, data) {
  const fn = findFn(id)
  if (!fn) return null
  for (const key of ['name', 'description', 'code', 'layer', 'trigger', 'sampleEvent']) {
    if (key in data) fn[key] = data[key]
  }
  if ('memoryMb' in data) fn.memoryMb = parseInt(data.memoryMb, 10)
  if ('timeoutSec' in data) fn.timeoutSec = parseInt(data.timeoutSec, 10)
  fn.last_modified = nowStamp()
  return fn
}

// ── REST router (mirrors backend/app.py) ───────────────────────────
async function route(method, path, query, body) {
  if (method === 'GET' && path === '/status') {
    return [200, {
      service: 'AWS Lambda Serverless Compute Simulator',
      status: 'RUNNING',
      awsRegion: 'us-east-1 (N. Virginia)',
      activeFunctionsCount: state.functions.length,
      totalInvocations: state.stats.total_invocations,
      successfulInvocations: state.stats.successful_invocations,
      failedInvocations: state.stats.failed_invocations,
      chaosModeEnabled: state.stats.chaos_mode_enabled,
      chaosFailureType: state.stats.chaos_failure_type
    }]
  }

  if (path === '/functions') {
    if (method === 'GET') return [200, { functions: state.functions }]
    if (method === 'POST') {
      if (!body.name) return [400, { error: 'Function name is required' }]
      const fn = createFunction(body)
      addSystemLog(state, `Created new Lambda function '${fn.name}' (${fn.id}).`)
      return [201, { function: fn, message: 'Function created successfully' }]
    }
  }

  const fnMatch = path.match(/^\/functions\/([^/]+)$/)
  if (fnMatch) {
    const id = decodeURIComponent(fnMatch[1])
    const fn = findFn(id)
    if (method === 'GET') return fn ? [200, { function: fn }] : [404, { error: 'Function not found' }]
    if (method === 'PUT') {
      const updated = updateFunction(id, body)
      if (!updated) return [404, { error: 'Function not found' }]
      addSystemLog(state, `Updated configuration for function '${updated.name}' (${id}).`)
      return [200, { function: updated, message: 'Function updated successfully' }]
    }
    if (method === 'DELETE') {
      if (!fn) return [404, { error: 'Function not found' }]
      state.functions = state.functions.filter(f => f.id !== id)
      addSystemLog(state, `Deleted Lambda function '${fn.name}' (${id}).`)
      return [200, { message: 'Function deleted successfully' }]
    }
  }

  if (method === 'POST' && path === '/simulate/invoke') {
    let { functionId, code, event = {}, memoryMb = 512, timeoutSec = 10 } = body
    let fnName = 'custom-adhoc-execution'
    const fn = functionId && findFn(functionId)
    if (fn) {
      fnName = fn.name
      code = code || fn.code
      memoryMb = body.memoryMb ?? fn.memoryMb
      timeoutSec = body.timeoutSec ?? fn.timeoutSec
    }
    if (!code) return [400, { error: 'Python code is required for execution' }]

    const result = await executePythonCode(fnName, code, event, memoryMb, timeoutSec)
    recordInvocation(result.durationMs)
    return [200, { functionName: fnName, result }]
  }

  if (method === 'POST' && path === '/simulate/chaos') {
    const enabled = !!body.enabled
    const failureType = body.failureType || 'none'
    state.stats.chaos_mode_enabled = enabled
    state.stats.chaos_failure_type = failureType
    const message = `Chaos Engine updated: Enabled=${enabled ? 'True' : 'False'}, FailureType='${failureType}'`
    addSystemLog(state, message, enabled ? 'WARNING' : 'INFO')
    return [200, { chaosModeEnabled: enabled, chaosFailureType: failureType, message }]
  }

  if (method === 'GET' && path === '/logs') {
    const stream = query.get('stream') || 'all'
    const limit = parseInt(query.get('limit') || '100', 10)
    const logs = (stream !== 'all' ? state.logs.filter(l => l.stream === stream) : state.logs).slice(0, limit)
    return [200, { logs, total: logs.length }]
  }

  if (method === 'POST' && path === '/logs/clear') {
    state.logs = []
    addSystemLog(state, 'CloudWatch logs cleared by user.')
    return [200, { message: 'Logs cleared successfully' }]
  }

  if (method === 'GET' && path === '/analytics') {
    return [200, { metrics: getPerformanceMetrics() }]
  }

  if (method === 'POST' && path === '/analytics/cost-estimate') {
    return [200, {
      costEstimate: calculateCost(
        parseInt(body.monthlyRequests ?? 1000000, 10),
        parseFloat(body.avgDurationMs ?? 100),
        parseInt(body.memoryMb ?? 512, 10)
      )
    }]
  }

  if (method === 'POST' && path === '/simulate/reset') {
    state = freshState()
    state.logs = []
    addSystemLog(state, 'Entire AWS Lambda simulation state has been reset to defaults.')
    return [200, { message: 'Simulation state reset successfully', functionsCount: state.functions.length }]
  }

  return [404, { error: `No route for ${method} ${path}` }]
}

// fetch()-compatible entry point: localFetch('/api/status', { method, body })
export async function localFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const parsed = new URL(url, 'http://local')
  const path = parsed.pathname.replace(/^\/api/, '')
  let body = {}
  try {
    body = options.body ? JSON.parse(options.body) : {}
  } catch { /* ignore malformed JSON — same as request.json or {} */ }

  const [status, data] = await route(method, path, parsed.searchParams, body)
  if (method !== 'GET') save()
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// Warm up the Python runtime in the background so the first invoke is fast
export function preloadRuntime() {
  loadPyodide().catch(err => console.warn('Pyodide preload failed', err))
}
