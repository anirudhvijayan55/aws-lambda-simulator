import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConceptCard from '../components/ConceptCard'
import CodeExample from '../components/CodeExample'
import InteractiveDemo from '../components/InteractiveDemo'
import QuizBlock from '../components/QuizBlock'
import { quizData, tabKeyMap } from '../data/quizData'

const MODULE_ID = 2
const tabs = ['Approaches', 'Conditionals', 'Loops', 'Flow Simulator']

function Module2() {
    const [activeTab, setActiveTab] = useState(0)
    const tabKey = tabKeyMap[MODULE_ID][activeTab]
    const currentQuiz = quizData[tabKey]

    /* ── Loop Simulator State ── */
    const [loopType, setLoopType] = useState('for')
    const [loopLimit, setLoopLimit] = useState(5)
    const [loopStep, setLoopStep] = useState(-1)
    const [loopOutput, setLoopOutput] = useState([])
    const [isRunning, setIsRunning] = useState(false)

    const runLoopSim = () => {
        setLoopStep(-1)
        setLoopOutput([])
        setIsRunning(true)
        const limit = Math.min(loopLimit, 15)
        let step = 0
        const interval = setInterval(() => {
            if (step >= limit) {
                clearInterval(interval)
                setIsRunning(false)
                return
            }
            setLoopStep(step)
            setLoopOutput(prev => [...prev, loopType === 'for'
                ? `Iteration ${step}: i = ${step}`
                : `Iteration ${step}: count = ${step}, count < ${limit} ✓`
            ])
            step++
        }, 600)
    }

    const resetLoop = () => {
        setLoopStep(-1)
        setLoopOutput([])
        setIsRunning(false)
    }

    /* ── Decision Tree State ── */
    const [dtAge, setDtAge] = useState(20)
    const dtResult = dtAge >= 18 ? (dtAge >= 65 ? 'Senior Citizen 👴' : 'Adult ✅') : (dtAge >= 13 ? 'Teenager 🧑' : 'Child 👶')

    return (
        <div className="module-page">
            <motion.div className="module-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="module-header-badge" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
                    Module 2
                </div>
                <h1>Problem Solving Approaches & Control Flow</h1>
                <p>Explore different problem-solving strategies and master Python's control flow constructs.</p>
            </motion.div>

            <div className="module-tabs">
                {tabs.map((tab, i) => (
                    <button key={tab} className={`module-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

                    {/* ─── TAB 0: Approaches ─── */}
                    {activeTab === 0 && (
                        <div>
                            <ConceptCard icon="⬇️" title="Top-Down Approach" color="#3b82f6">
                                <p>Break a complex problem into <strong>smaller sub-problems</strong>, then solve each part independently. Start from the overall solution and refine downward.</p>
                                <div className="anim-container" style={{ padding: 16 }}>
                                    <h4>Top-Down Decomposition</h4>
                                    <div style={{ textAlign: 'center' }}>
                                        {['Main Problem', '↙    ↓    ↘', 'Sub-1  Sub-2  Sub-3', '↓       ↓       ↓', 'Solve  Solve  Solve'].map((line, i) => (
                                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.3 }}
                                                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: i === 0 ? 'var(--accent-blue)' : 'var(--text-secondary)', padding: 4 }}>
                                                {line}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </ConceptCard>

                            <ConceptCard icon="⬆️" title="Bottom-Up Approach" color="#10b981" delay={0.1}>
                                <p>Start by solving the <strong>simplest sub-problems</strong> first, then combine them to build the complete solution.</p>
                                <div className="anim-container" style={{ padding: 16 }}>
                                    <h4>Bottom-Up Construction</h4>
                                    <div style={{ textAlign: 'center' }}>
                                        {['Solve  Solve  Solve', '↑       ↑       ↑', 'Sub-1  Sub-2  Sub-3', '↗    ↑    ↖', 'Complete Solution'].map((line, i) => (
                                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.3 }}
                                                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: i === 4 ? 'var(--accent-green)' : 'var(--text-secondary)', padding: 4 }}>
                                                {line}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </ConceptCard>

                            <ConceptCard icon="✂️" title="Divide and Conquer" color="#f59e0b" delay={0.2}>
                                <p><strong>Divide</strong> the problem in half, <strong>conquer</strong> (solve) each half, and <strong>combine</strong> the results. Used in Merge Sort, Binary Search, etc.</p>
                                <div className="anim-container" style={{ padding: 16 }}>
                                    <h4>Divide & Conquer Splitting</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        {[
                                            { items: ['[1, 5, 3, 8, 2, 7, 4, 6]'], c: 'var(--accent-amber)' },
                                            { items: ['[1, 5, 3, 8]', '[2, 7, 4, 6]'], c: 'var(--accent-blue)' },
                                            { items: ['[1,5]', '[3,8]', '[2,7]', '[4,6]'], c: 'var(--accent-purple)' },
                                            { items: ['[1]', '[5]', '[3]', '[8]', '[2]', '[7]', '[4]', '[6]'], c: 'var(--accent-green)' }
                                        ].map((row, rowI) => (
                                            <motion.div key={rowI} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: rowI * 0.4 }}
                                                style={{ display: 'flex', gap: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: row.c }}>
                                                {row.items.map((item, i) => (
                                                    <span key={i} style={{ background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border-color)' }}>{item}</span>
                                                ))}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </ConceptCard>

                            <ConceptCard icon="↩️" title="Backtracking" color="#f43f5e" delay={0.3}>
                                <p>Try a solution, and if it doesn't work, <strong>undo the last step</strong> ("backtrack") and try a different path. Used in puzzles like Sudoku and N-Queens.</p>
                                <CodeExample code={`# Concept: Try → Fail → Undo → Try Again
# Example: Finding a path in a maze
# 1. Move forward
# 2. If dead end → go back
# 3. Try another direction
# 4. Repeat until solution found`} language="python" />
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 1: Conditionals ─── */}
                    {activeTab === 1 && (
                        <div>
                            <ConceptCard icon="🔀" title="Conditional Statements (if / elif / else)" color="#8b5cf6">
                                <p>Execute different code blocks based on conditions. Python uses <code>if</code>, <code>elif</code>, and <code>else</code>.</p>
                                <CodeExample code={`marks = 75

if marks >= 90:
    grade = "A+"
elif marks >= 80:
    grade = "A"
elif marks >= 70:
    grade = "B"
elif marks >= 60:
    grade = "C"
else:
    grade = "F"

print(f"Grade: {grade}")  # Grade: B`} />
                            </ConceptCard>

                            <InteractiveDemo title="Decision Tree — Age Classifier">
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
                                    Move the slider to see how branching decisions classify an age:
                                </p>
                                <div className="flex-row" style={{ marginBottom: 16 }}>
                                    <input type="range" min={1} max={80} value={dtAge} onChange={e => setDtAge(Number(e.target.value))} style={{ flex: 1 }} />
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: 'var(--accent-blue)', minWidth: 40 }}>{dtAge}</span>
                                </div>
                                <div className="anim-container" style={{ minHeight: 120, padding: 16 }}>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, textAlign: 'left', width: '100%' }}>
                                        <div style={{ color: dtAge >= 18 ? 'var(--accent-green)' : 'var(--accent-rose)', marginBottom: 4 }}>
                                            if age &gt;= 18: {dtAge >= 18 ? '✓ True' : '✗ False'}
                                        </div>
                                        {dtAge >= 18 ? (
                                            <div style={{ paddingLeft: 20, color: dtAge >= 65 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                                                if age &gt;= 65: {dtAge >= 65 ? '✓ True → Senior' : '✗ False → Adult'}
                                            </div>
                                        ) : (
                                            <div style={{ paddingLeft: 20 }}>
                                                <div style={{ color: dtAge >= 13 ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}>
                                                    elif age &gt;= 13: {dtAge >= 13 ? '✓ True → Teenager' : '✗ False → Child'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <motion.div key={dtResult} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                        style={{ marginTop: 16, fontSize: 20, fontWeight: 700, color: 'var(--accent-blue)' }}>
                                        Result: {dtResult}
                                    </motion.div>
                                </div>
                            </InteractiveDemo>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 2: Loops ─── */}
                    {activeTab === 2 && (
                        <div>
                            <ConceptCard icon="🔄" title="for Loop" color="#3b82f6">
                                <p>Iterate over a sequence (list, range, string) a definite number of times.</p>
                                <CodeExample code={`# Print numbers 0 to 4
for i in range(5):
    print(i, end=" ")  # 0 1 2 3 4

# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)`} />
                            </ConceptCard>

                            <ConceptCard icon="🔁" title="while Loop" color="#8b5cf6" delay={0.1}>
                                <p>Repeat as long as a condition is <code>True</code>. Be careful of infinite loops!</p>
                                <CodeExample code={`count = 0
while count < 5:
    print(count, end=" ")  # 0 1 2 3 4
    count += 1`} />
                            </ConceptCard>

                            <div className="grid-3" style={{ marginTop: 16 }}>
                                <ConceptCard icon="🛑" title="break" color="#f43f5e" delay={0.2}>
                                    <p>Exit the loop immediately.</p>
                                    <CodeExample code={`for i in range(10):
    if i == 5:
        break
    print(i)  # 0 1 2 3 4`} />
                                </ConceptCard>

                                <ConceptCard icon="⏭️" title="continue" color="#f59e0b" delay={0.25}>
                                    <p>Skip current iteration.</p>
                                    <CodeExample code={`for i in range(5):
    if i == 2:
        continue
    print(i)  # 0 1 3 4`} />
                                </ConceptCard>

                                <ConceptCard icon="⏸️" title="pass" color="#64748b" delay={0.3}>
                                    <p>Placeholder — does nothing.</p>
                                    <CodeExample code={`for i in range(5):
    if i == 3:
        pass  # TODO later
    print(i)  # 0 1 2 3 4`} />
                                </ConceptCard>
                            </div>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 3: Flow Simulator ─── */}
                    {activeTab === 3 && (
                        <div>
                            <h2 className="section-title">Loop Execution Simulator</h2>
                            <p className="section-subtitle">Watch loops execute step by step with variable tracking.</p>

                            <InteractiveDemo title="Step-by-Step Loop Execution">
                                <div className="flex-row flex-wrap" style={{ marginBottom: 16, gap: 12 }}>
                                    <div className="demo-input-group" style={{ margin: 0 }}>
                                        <label>Loop Type</label>
                                        <select className="demo-select" value={loopType} onChange={e => { setLoopType(e.target.value); resetLoop() }}>
                                            <option value="for">for loop</option>
                                            <option value="while">while loop</option>
                                        </select>
                                    </div>
                                    <div className="demo-input-group" style={{ margin: 0 }}>
                                        <label>Iterations</label>
                                        <input className="demo-input" type="number" min={1} max={15} value={loopLimit}
                                            onChange={e => { setLoopLimit(Number(e.target.value)); resetLoop() }} style={{ width: 80 }} />
                                    </div>
                                    <div style={{ alignSelf: 'flex-end' }}>
                                        <button className="demo-btn" onClick={runLoopSim} disabled={isRunning}>
                                            {isRunning ? 'Running...' : '▶ Run'}
                                        </button>
                                        <button className="demo-btn-secondary" onClick={resetLoop} style={{ marginLeft: 8 }}>Reset</button>
                                    </div>
                                </div>

                                <div className="code-block" style={{ margin: '0 0 16px' }}>
                                    <div className="code-block-header"><span className="code-block-lang">Python</span></div>
                                    <pre style={{ padding: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7, color: 'var(--text-primary)' }}>
                                        {loopType === 'for'
                                            ? `for i in range(${loopLimit}):\n    print(f"i = {'{'}i{'}'}")`
                                            : `count = 0\nwhile count < ${loopLimit}:\n    print(f"count = {'{'}count{'}'}")\n    count += 1`
                                        }
                                    </pre>
                                </div>

                                {loopStep >= 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                            {Array.from({ length: Math.min(loopLimit, 15) }).map((_, i) => (
                                                <motion.div key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: i <= loopStep ? 1 : 0 }}
                                                    style={{
                                                        width: 36, height: 36, borderRadius: 8,
                                                        background: i === loopStep ? 'var(--accent-blue)' : i < loopStep ? 'var(--accent-green)' : 'var(--bg-tertiary)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 13, fontWeight: 700, color: i <= loopStep ? 'white' : 'var(--text-muted)',
                                                        border: `1px solid ${i === loopStep ? 'var(--accent-blue)' : 'var(--border-color)'}`
                                                    }}
                                                >
                                                    {i}
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="demo-output" style={{ maxHeight: 200, overflow: 'auto' }}>
                                            {loopOutput.join('\n')}
                                        </div>
                                    </motion.div>
                                )}
                            </InteractiveDemo>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Module2
