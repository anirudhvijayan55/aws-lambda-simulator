import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConceptCard from '../components/ConceptCard'
import CodeExample from '../components/CodeExample'
import InteractiveDemo from '../components/InteractiveDemo'
import QuizBlock from '../components/QuizBlock'
import { quizData, tabKeyMap } from '../data/quizData'

const MODULE_ID = 4
const tabs = ['Functions', 'Arguments & Scope', 'Recursion', 'Stack & Queue']

function Module4() {
    const [activeTab, setActiveTab] = useState(0)
    const tabKey = tabKeyMap[MODULE_ID][activeTab]
    const currentQuiz = quizData[tabKey]

    /* ── Stack ── */
    const [stack, setStack] = useState([])
    const [stackInput, setStackInput] = useState('')

    /* ── Queue ── */
    const [queue, setQueue] = useState([])
    const [queueInput, setQueueInput] = useState('')

    /* ── Recursion tree ── */
    const [fibN, setFibN] = useState(5)

    const pushStack = () => {
        if (stackInput.trim()) {
            setStack(prev => [...prev, stackInput.trim()])
            setStackInput('')
        }
    }

    const popStack = () => {
        setStack(prev => prev.slice(0, -1))
    }

    const enqueue = () => {
        if (queueInput.trim()) {
            setQueue(prev => [...prev, queueInput.trim()])
            setQueueInput('')
        }
    }

    const dequeue = () => {
        setQueue(prev => prev.slice(1))
    }

    /* ── Simple fibonacci tree builder ── */
    const buildFibTree = (n, depth = 0) => {
        if (n <= 1 || depth > 4) {
            return { val: n, left: null, right: null }
        }
        return {
            val: n,
            left: buildFibTree(n - 1, depth + 1),
            right: buildFibTree(n - 2, depth + 1)
        }
    }

    const FibNode = ({ node, delay = 0 }) => {
        if (!node) return null
        return (
            <div className="tree-node">
                <motion.div
                    className="tree-node-value"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay, duration: 0.3 }}
                    style={{
                        borderColor: node.left ? 'var(--accent-purple)' : 'var(--accent-green)',
                        color: node.left ? 'var(--accent-purple)' : 'var(--accent-green)',
                        background: node.left ? 'rgba(139,92,246,0.1)' : 'rgba(16,185,129,0.1)'
                    }}
                >
                    f({node.val})
                </motion.div>
                {(node.left || node.right) && (
                    <div className="tree-children">
                        {node.left && <FibNode node={node.left} delay={delay + 0.15} />}
                        {node.right && <FibNode node={node.right} delay={delay + 0.25} />}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="module-page">
            <motion.div className="module-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="module-header-badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>Module 4</div>
                <h1>Modular Programming</h1>
                <p>Learn functions, arguments, scope, recursion, and implement fundamental data structures.</p>
            </motion.div>

            <div className="module-tabs">
                {tabs.map((tab, i) => (
                    <button key={tab} className={`module-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

                    {/* ─── TAB 0: Functions ─── */}
                    {activeTab === 0 && (
                        <div>
                            <ConceptCard icon="⚙️" title="Function Definition & Calls" color="#10b981">
                                <p>Functions are reusable blocks of code. Define with <code>def</code> keyword, call by name.</p>
                                <CodeExample code={`def greet(name):
    """Greets a person by name"""
    return f"Hello, {name}!"

# Function call
result = greet("Alice")
print(result)   # Hello, Alice!

# Function with multiple returns
def divide(a, b):
    quotient = a // b
    remainder = a % b
    return quotient, remainder

q, r = divide(17, 5)
print(f"17÷5 = {q} remainder {r}")  # 17÷5 = 3 remainder 2`} />
                            </ConceptCard>

                            <ConceptCard icon="🔗" title="Lambda Functions" color="#8b5cf6" delay={0.1}>
                                <p>Small anonymous functions defined in a single line using <code>lambda</code>.</p>
                                <CodeExample code={`# Regular function
def square(x):
    return x ** 2

# Same as lambda
square = lambda x: x ** 2
print(square(5))  # 25

# Lambda with map and filter
nums = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x*2, nums))
evens = list(filter(lambda x: x%2==0, nums))
print(doubled)  # [2, 4, 6, 8, 10]
print(evens)    # [2, 4]`} />
                            </ConceptCard>

                            <ConceptCard icon="🎨" title="Decorators (Basic Idea)" color="#f59e0b" delay={0.2}>
                                <p>A decorator wraps a function to add extra behavior without modifying the original function.</p>
                                <CodeExample code={`def uppercase_decorator(func):
    def wrapper():
        result = func()
        return result.upper()
    return wrapper

@uppercase_decorator
def greet():
    return "hello, world"

print(greet())  # HELLO, WORLD`} />
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 1: Arguments & Scope ─── */}
                    {activeTab === 1 && (
                        <div>
                            <h2 className="section-title">Function Arguments</h2>

                            <div className="grid-2">
                                <ConceptCard icon="1️⃣" title="Positional Arguments" color="#3b82f6">
                                    <CodeExample code={`def power(base, exp):
    return base ** exp

print(power(2, 3))  # 8
# Order matters!`} />
                                </ConceptCard>

                                <ConceptCard icon="🏷️" title="Keyword Arguments" color="#8b5cf6">
                                    <CodeExample code={`def greet(name, msg):
    print(f"{msg}, {name}")

# Can specify by name
greet(msg="Hi", name="Bob")`} />
                                </ConceptCard>

                                <ConceptCard icon="📌" title="Default Parameters" color="#06b6d4">
                                    <CodeExample code={`def greet(name, msg="Hello"):
    print(f"{msg}, {name}")

greet("Alice")         # Hello, Alice
greet("Bob", "Hi")     # Hi, Bob`} />
                                </ConceptCard>

                                <ConceptCard icon="📦" title="Arbitrary Arguments" color="#f59e0b">
                                    <CodeExample code={`# *args: variable positional
def add(*args):
    return sum(args)
print(add(1,2,3,4))  # 10

# **kwargs: variable keyword
def info(**kwargs):
    for k,v in kwargs.items():
        print(f"{k}: {v}")
info(name="Alice", age=20)`} />
                                </ConceptCard>
                            </div>

                            <h2 className="section-title" style={{ marginTop: 32 }}>Variable Scope</h2>

                            <ConceptCard icon="🔍" title="Local vs Global Scope" color="#f43f5e">
                                <p>Variables defined inside a function are <strong>local</strong>. Variables outside are <strong>global</strong>. Use <code>global</code> keyword to modify global variables inside a function.</p>
                                <div className="anim-container" style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', gap: 24, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                            style={{ background: 'rgba(244,63,94,0.1)', border: '2px dashed var(--accent-rose)', borderRadius: 12, padding: 20, minWidth: 200 }}>
                                            <div style={{ fontWeight: 700, color: 'var(--accent-rose)', marginBottom: 8, fontSize: 13 }}>🌐 GLOBAL SCOPE</div>
                                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text-primary)' }}>
                                                x = 10<br />name = "Python"
                                            </div>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                                            style={{ background: 'rgba(59,130,246,0.1)', border: '2px dashed var(--accent-blue)', borderRadius: 12, padding: 20, minWidth: 200 }}>
                                            <div style={{ fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 8, fontSize: 13 }}>📦 LOCAL SCOPE (def func)</div>
                                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text-primary)' }}>
                                                y = 5<br />result = x + y
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                                <CodeExample code={`x = 10  # Global

def func():
    y = 5        # Local
    print(x + y) # Can read global

func()   # 15
# print(y)  # ERROR: y is not defined (local)`} />
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 2: Recursion ─── */}
                    {activeTab === 2 && (
                        <div>
                            <ConceptCard icon="🔄" title="Recursive Functions" color="#8b5cf6">
                                <p>A function that <strong>calls itself</strong> to solve smaller instances of the same problem. Must have a <strong>base case</strong> to stop.</p>
                                <CodeExample code={`def factorial(n):
    if n <= 1:       # Base case
        return 1
    return n * factorial(n - 1)  # Recursive call

print(factorial(5))  # 120
# 5 * 4 * 3 * 2 * 1 = 120`} />
                            </ConceptCard>

                            <ConceptCard icon="🌳" title="Recursion Tree — Fibonacci" color="#10b981" delay={0.1}>
                                <p>Visualize how <code>fib(n)</code> branches into two recursive calls at each step.</p>
                                <div className="anim-container">
                                    <div className="flex-row" style={{ marginBottom: 16 }}>
                                        <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>n =</label>
                                        <select className="demo-select" value={fibN} onChange={e => setFibN(Number(e.target.value))}>
                                            {[2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <div key={fibN} style={{ overflowX: 'auto', width: '100%', display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                                        <FibNode node={buildFibTree(fibN)} />
                                    </div>
                                </div>
                                <CodeExample code={`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(8):
    print(fibonacci(i), end=" ")
# 0 1 1 2 3 5 8 13`} />
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 3: Stack & Queue ─── */}
                    {activeTab === 3 && (
                        <div>
                            <h2 className="section-title">Stack — LIFO (Last In, First Out)</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <ConceptCard icon="📚" title="Stack Concept" color="#3b82f6">
                                    <p>Think of a stack of plates — you can only add or remove from the <strong>top</strong>.</p>
                                    <CodeExample code={`stack = []
stack.append(10)   # Push
stack.append(20)
stack.append(30)
print(stack)       # [10, 20, 30]
top = stack.pop()  # Pop
print(top)         # 30`} />
                                </ConceptCard>

                                <InteractiveDemo title="Stack Push/Pop Animation">
                                    <div className="flex-row" style={{ marginBottom: 12 }}>
                                        <input className="demo-input" value={stackInput} onChange={e => setStackInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && pushStack()}
                                            placeholder="Value..." style={{ maxWidth: 120 }} />
                                        <button className="demo-btn" onClick={pushStack}>Push</button>
                                        <button className="demo-btn-secondary" onClick={popStack} disabled={stack.length === 0}>Pop</button>
                                    </div>
                                    <div className="stack-viz" style={{ minHeight: 160 }}>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>← TOP</div>
                                        <AnimatePresence>
                                            {[...stack].reverse().map((item, i) => (
                                                <motion.div key={item + '-' + (stack.length - 1 - i)}
                                                    className="stack-item"
                                                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                                    style={{ background: i === 0 ? 'rgba(59,130,246,0.2)' : 'var(--bg-tertiary)', borderColor: i === 0 ? 'var(--accent-blue)' : 'var(--border-color)' }}
                                                >
                                                    {item}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {stack.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Stack is empty</div>}
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>← BOTTOM</div>
                                    </div>
                                </InteractiveDemo>
                            </div>

                            <h2 className="section-title">Queue — FIFO (First In, First Out)</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <ConceptCard icon="🚶" title="Queue Concept" color="#06b6d4">
                                    <p>Like a line at a ticket counter — first person in line is served first.</p>
                                    <CodeExample code={`from collections import deque

q = deque()
q.append(10)    # Enqueue
q.append(20)
q.append(30)
print(q)        # deque([10, 20, 30])
front = q.popleft()  # Dequeue
print(front)    # 10`} />
                                </ConceptCard>

                                <InteractiveDemo title="Queue Enqueue/Dequeue Animation">
                                    <div className="flex-row" style={{ marginBottom: 12 }}>
                                        <input className="demo-input" value={queueInput} onChange={e => setQueueInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && enqueue()}
                                            placeholder="Value..." style={{ maxWidth: 120 }} />
                                        <button className="demo-btn" onClick={enqueue}>Enqueue</button>
                                        <button className="demo-btn-secondary" onClick={dequeue} disabled={queue.length === 0}>Dequeue</button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: 60 }}>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginRight: 8 }}>FRONT →</div>
                                        <AnimatePresence>
                                            {queue.map((item, i) => (
                                                <motion.div key={item + '-' + i}
                                                    className="queue-item"
                                                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                                    exit={{ opacity: 0, x: -20, scale: 0.8 }}
                                                    style={{
                                                        background: i === 0 ? 'rgba(6,182,212,0.2)' : 'var(--bg-tertiary)',
                                                        borderColor: i === 0 ? 'var(--accent-cyan)' : 'var(--border-color)',
                                                        padding: '8px 16px', minWidth: 'auto'
                                                    }}
                                                >
                                                    {item}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {queue.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Queue is empty</div>}
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginLeft: 8 }}>← REAR</div>
                                    </div>
                                </InteractiveDemo>
                            </div>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Module4
