// Pyodide — runs Python 3.11 in-browser via WebAssembly. No API key needed.
// First run loads ~10 MB WASM from CDN; subsequent runs are instant.

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'

let pyodidePromise = null
let _ready = false

// Start loading Pyodide. Safe to call multiple times (returns the same promise).
export async function loadPyodide() {
  if (pyodidePromise) return pyodidePromise

  pyodidePromise = (async () => {
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = PYODIDE_CDN
        s.onload = resolve
        s.onerror = () => reject(new Error('Failed to load Pyodide from CDN'))
        document.head.appendChild(s)
      })
    }
    const py = await window.loadPyodide()
    _ready = true
    return py
  })()

  return pyodidePromise
}

export const isReady = () => _ready

// Python wrapper: patches input() / stdout / stderr, runs user code in its own namespace
const RUNNER = `
import sys, builtins, traceback
from io import StringIO

_lines = list(_stdin_lines_js)
_out   = StringIO()
_err   = StringIO()

_orig_input   = builtins.input
_orig_stdout  = sys.stdout
_orig_stderr  = sys.stderr

def _mock_input(prompt=''):
    if prompt:
        _out.write(str(prompt))
    if _lines:
        return str(_lines.pop(0))
    raise EOFError('stdin exhausted')

builtins.input = _mock_input
sys.stdout = _out
sys.stderr = _err

_exit_code = 0
try:
    _ns = {'__builtins__': __builtins__}
    exec(_code_js, _ns)
except SystemExit as _e:
    _exit_code = _e.code if isinstance(_e.code, int) else 0
except Exception:
    _err.write(traceback.format_exc())
    _exit_code = 1
finally:
    builtins.input = _orig_input
    sys.stdout     = _orig_stdout
    sys.stderr     = _orig_stderr

_RES_STDOUT = _out.getvalue()
_RES_STDERR = _err.getvalue()
_RES_CODE   = _exit_code
`

async function runCode(code, stdin = '') {
  const py = await loadPyodide()

  const stdinLines = stdin
    ? stdin.split('\n').filter(l => l !== '')
    : []

  py.globals.set('_code_js', code)
  py.globals.set('_stdin_lines_js', py.toPy(stdinLines))

  await py.runPythonAsync(RUNNER)

  return {
    stdout:   py.globals.get('_RES_STDOUT'),
    stderr:   py.globals.get('_RES_STDERR'),
    exitCode: py.globals.get('_RES_CODE')
  }
}

function normalize(s) {
  return (s || '').trim().replace(/\r\n/g, '\n')
}

async function runTestCase(userCode, tc) {
  const fullCode = tc.testCode ? userCode + '\n' + tc.testCode : userCode
  let raw
  try {
    raw = await runCode(fullCode, tc.stdin || '')
  } catch (err) {
    return { ...tc, status: 'error', passed: false, actualOutput: '', error: err.message }
  }

  if (raw.exitCode !== 0 || raw.stderr) {
    return { ...tc, status: 'error', passed: false, actualOutput: normalize(raw.stdout), error: raw.stderr }
  }

  const actual   = normalize(raw.stdout)
  const expected = normalize(tc.expectedOutput)
  const passed   = actual === expected

  return { ...tc, status: passed ? 'pass' : 'fail', passed, actualOutput: actual, error: '' }
}

/**
 * Run all test cases with an error gate:
 * if the first test produces any error, execution stops (blocked = true).
 */
export async function runAllTests(userCode, testCases) {
  if (!testCases || testCases.length === 0) {
    return { blocked: false, blockError: null, results: [] }
  }

  const first = await runTestCase(userCode, testCases[0])
  if (first.status === 'error') {
    return { blocked: true, blockError: first.error || 'Runtime error', results: [] }
  }

  const results = [first]
  for (let i = 1; i < testCases.length; i++) {
    results.push(await runTestCase(userCode, testCases[i]))
  }

  return { blocked: false, blockError: null, results }
}
