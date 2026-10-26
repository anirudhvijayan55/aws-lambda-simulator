import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConceptCard from '../components/ConceptCard'
import CodeExample from '../components/CodeExample'
import InteractiveDemo from '../components/InteractiveDemo'
import QuizBlock from '../components/QuizBlock'
import { quizData, tabKeyMap } from '../data/quizData'

const MODULE_ID = 1

const tabs = ['Problem Solving', 'Data Types', 'Operators', 'Built-in Functions', 'Regex']

/* ───── flowchart steps ───── */
const flowSteps = [
    { label: 'Start', type: 'start-end' },
    { label: 'Read Input', type: 'process' },
    { label: 'Is N > 0?', type: 'decision' },
    { label: 'Print "Positive"', type: 'process' },
    { label: 'Print "Non-positive"', type: 'process' },
    { label: 'End', type: 'start-end' }
]

/* ───── data type info ───── */
const dataTypes = [
    { name: 'int', example: '42', icon: '🔢', color: '#3b82f6', desc: 'Whole numbers without decimals' },
    { name: 'float', example: '3.14', icon: '🔣', color: '#8b5cf6', desc: 'Numbers with decimal points' },
    { name: 'bool', example: 'True / False', icon: '✅', color: '#10b981', desc: 'Logical true or false values' },
    { name: 'str', example: '"Hello"', icon: '📝', color: '#f59e0b', desc: 'Sequence of characters (text)' },
    { name: 'complex', example: '3+4j', icon: '🧮', color: '#f43f5e', desc: 'Numbers with real and imaginary parts' }
]

function Module1() {
    const [activeTab, setActiveTab] = useState(0)
    const [flowStep, setFlowStep] = useState(0)
    const [pseudocode, setPseudocode] = useState('BEGIN\n  READ number\n  IF number > 0 THEN\n    PRINT "Positive"\n  ELSE\n    PRINT "Non-positive"\n  ENDIF\nEND')
    const [regexPattern, setRegexPattern] = useState('[0-9]+')
    const [regexText, setRegexText] = useState('My phone is 9876543210 and zip 600028')
    const [regexResult, setRegexResult] = useState(null)
    const [dtAnswer, setDtAnswer] = useState('')
    const [dtFeedback, setDtFeedback] = useState(null)
    const [dtQuestion] = useState({ value: '3.14', answer: 'float' })

    const tabKey = tabKeyMap[MODULE_ID][activeTab]
    const currentQuiz = quizData[tabKey]

    const testRegex = () => {
        try {
            const re = new RegExp(regexPattern, 'g')
            const matches = [...regexText.matchAll(re)].map(m => m[0])
            setRegexResult({ ok: true, matches })
        } catch (e) {
            setRegexResult({ ok: false, error: e.message })
        }
    }

    const checkDataType = () => {
        if (dtAnswer.toLowerCase().trim() === dtQuestion.answer) {
            setDtFeedback({ ok: true, msg: `Correct! ${dtQuestion.value} is a ${dtQuestion.answer}.` })
        } else {
            setDtFeedback({ ok: false, msg: `Not quite. Hint: ${dtQuestion.value} has a decimal point.` })
        }
    }

    return (
        <div className="module-page">
            <motion.div className="module-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="module-header-badge" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
                    Module 1
                </div>
                <h1>Problem Solving & Python Fundamentals</h1>
                <p>Learn to break problems into steps, design algorithms, and understand Python's core data types and operators.</p>
            </motion.div>

            <div className="module-tabs">
                {tabs.map((tab, i) => (
                    <button
                        key={tab}
                        className={`module-tab ${activeTab === i ? 'active' : ''}`}
                        onClick={() => setActiveTab(i)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    {/* ─── TAB 0: Problem Solving ─── */}
                    {activeTab === 0 && (
                        <div>
                            <ConceptCard icon="🎯" title="Problem Analysis" color="#3b82f6">
                                <p>Problem solving starts with understanding the problem clearly. Break it into <strong>input</strong>, <strong>process</strong>, and <strong>output</strong>.</p>
                            </ConceptCard>

                            <ConceptCard icon="📋" title="Algorithm" color="#8b5cf6" delay={0.1}>
                                <p>An algorithm is a step-by-step procedure to solve a problem. Every algorithm must be <strong>finite</strong>, <strong>definite</strong>, and produce the correct <strong>output</strong>.</p>
                                <CodeExample title="Algorithm Example" code={`Algorithm: Find Maximum of Two Numbers
Step 1: Start
Step 2: Read A, B
Step 3: If A > B then MAX = A
Step 4: Else MAX = B
Step 5: Print MAX
Step 6: Stop`} language="text" />
                            </ConceptCard>

                            <ConceptCard icon="📊" title="Flowchart Visualization" color="#06b6d4" delay={0.2}>
                                <p>A flowchart is a visual representation of an algorithm using standard symbols.</p>
                                <div className="anim-container">
                                    <h4>Step-by-step Flowchart Builder</h4>
                                    <div className="flowchart">
                                        {flowSteps.slice(0, flowStep + 1).map((step, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                                                {i > 0 && <div className="flow-arrow" style={{ margin: '0 auto 8px' }} />}
                                                <div className={`flow-node ${step.type}`}>{step.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="anim-controls">
                                        <button className="demo-btn-secondary" onClick={() => setFlowStep(0)}>Reset</button>
                                        <button className="demo-btn" onClick={() => setFlowStep(s => Math.min(s + 1, flowSteps.length - 1))} disabled={flowStep >= flowSteps.length - 1}>
                                            Next Step →
                                        </button>
                                    </div>
                                </div>
                            </ConceptCard>

                            <ConceptCard icon="📝" title="Pseudocode" color="#10b981" delay={0.3}>
                                <p>Pseudocode describes an algorithm in plain language using programming-like structure, without strict syntax.</p>
                                <InteractiveDemo title="Pseudocode Editor">
                                    <div className="demo-input-group">
                                        <label>Write / Edit Pseudocode</label>
                                        <textarea className="demo-textarea" value={pseudocode} onChange={e => setPseudocode(e.target.value)} rows={8} />
                                    </div>
                                    <div className="demo-output" style={{ whiteSpace: 'pre-wrap' }}>
                                        <strong style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>FORMATTED OUTPUT:</strong>{'\n'}{pseudocode}
                                    </div>
                                </InteractiveDemo>
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 1: Data Types ─── */}
                    {activeTab === 1 && (
                        <div>
                            <h2 className="section-title">Python Data Types</h2>
                            <p className="section-subtitle">Python has several built-in data types for storing different kinds of values.</p>

                            <div className="grid-2">
                                {dataTypes.map((dt, i) => (
                                    <motion.div key={dt.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                                        <ConceptCard icon={dt.icon} title={dt.name} color={dt.color}>
                                            <p>{dt.desc}</p>
                                            <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: dt.color }}>
                                                Example: {dt.example}
                                            </div>
                                        </ConceptCard>
                                    </motion.div>
                                ))}
                            </div>

                            <InteractiveDemo title="Identify the Data Type">
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
                                    What is the data type of <strong style={{ color: 'var(--accent-amber)' }}>{dtQuestion.value}</strong>?
                                </p>
                                <div className="flex-row">
                                    <input
                                        className="demo-input"
                                        style={{ maxWidth: 200 }}
                                        placeholder="e.g. int, float, str..."
                                        value={dtAnswer}
                                        onChange={e => { setDtAnswer(e.target.value); setDtFeedback(null) }}
                                        onKeyDown={e => e.key === 'Enter' && checkDataType()}
                                    />
                                    <button className="demo-btn" onClick={checkDataType}>Check</button>
                                </div>
                                {dtFeedback && (
                                    <div className={`demo-result ${dtFeedback.ok ? 'success' : 'error'}`}>
                                        {dtFeedback.msg}
                                    </div>
                                )}
                            </InteractiveDemo>

                            <CodeExample code={`# Check type of a value in Python
x = 42
print(type(x))      # <class 'int'>

y = 3.14
print(type(y))      # <class 'float'>

name = "Python"
print(type(name))   # <class 'str'>

flag = True
print(type(flag))   # <class 'bool'>`} />
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 2: Operators ─── */}
                    {activeTab === 2 && (
                        <div>
                            <h2 className="section-title">Operators and Expressions</h2>

                            <ConceptCard icon="➕" title="Arithmetic Operators" color="#3b82f6">
                                <p>Perform basic math operations: <code>+</code> <code>-</code> <code>*</code> <code>/</code> <code>//</code> <code>%</code> <code>**</code></p>
                                <CodeExample code={`a, b = 10, 3
print(a + b)    # 13  (Addition)
print(a - b)    # 7   (Subtraction)
print(a * b)    # 30  (Multiplication)
print(a / b)    # 3.33 (Division)
print(a // b)   # 3   (Floor Division)
print(a % b)    # 1   (Modulus)
print(a ** b)   # 1000 (Exponent)`} />
                            </ConceptCard>

                            <ConceptCard icon="⚖️" title="Comparison Operators" color="#06b6d4" delay={0.1}>
                                <p>Compare values and return Boolean: <code>==</code> <code>!=</code> <code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code></p>
                                <CodeExample code={`x = 5
print(x == 5)   # True
print(x != 3)   # True
print(x > 10)   # False
print(x <= 5)   # True`} />
                            </ConceptCard>

                            <ConceptCard icon="🔗" title="Logical Operators" color="#8b5cf6" delay={0.2}>
                                <p>Combine Boolean expressions: <code>and</code>, <code>or</code>, <code>not</code></p>
                                <CodeExample code={`a, b = True, False
print(a and b)   # False
print(a or b)    # True
print(not a)     # False`} />
                            </ConceptCard>

                            <ConceptCard icon="🎭" title="Assignment & Membership Operators" color="#f59e0b" delay={0.3}>
                                <CodeExample code={`# Assignment: =, +=, -=, *=, /=
x = 10
x += 5   # x is now 15

# Membership: in, not in
fruits = ["apple", "banana"]
print("apple" in fruits)     # True
print("grape" not in fruits) # True`} />
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 3: Built-in Functions ─── */}
                    {activeTab === 3 && (
                        <div>
                            <h2 className="section-title">Python Built-in Functions</h2>
                            <p className="section-subtitle">Python provides many commonly-used functions without needing any import.</p>

                            <div className="grid-2">
                                <ConceptCard icon="📥" title="Input / Output" color="#3b82f6">
                                    <CodeExample code={`# Get user input
name = input("Enter name: ")
print("Hello,", name)

# Print formatting
age = 20
print(f"{name} is {age} years old")`} />
                                </ConceptCard>

                                <ConceptCard icon="🔄" title="Type Conversion" color="#8b5cf6">
                                    <CodeExample code={`# Convert between types
int("42")       # 42
float("3.14")   # 3.14
str(100)        # "100"
bool(0)         # False
list("abc")     # ['a','b','c']`} />
                                </ConceptCard>

                                <ConceptCard icon="📏" title="Math Functions" color="#06b6d4">
                                    <CodeExample code={`# Useful math functions
abs(-5)        # 5
max(3, 7, 1)   # 7
min(3, 7, 1)   # 1
round(3.678,2) # 3.68
pow(2, 3)      # 8
len("hello")   # 5`} />
                                </ConceptCard>

                                <ConceptCard icon="📋" title="Sequence Functions" color="#10b981">
                                    <CodeExample code={`# Work with sequences
range(5)         # 0,1,2,3,4
sorted([3,1,2])  # [1,2,3]
reversed([1,2])  # [2,1]
enumerate("ab")  # (0,'a'),(1,'b')
zip([1,2],['a','b'])  # (1,'a'),(2,'b')`} />
                                </ConceptCard>
                            </div>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 4: Regex ─── */}
                    {activeTab === 4 && (
                        <div>
                            <h2 className="section-title">Regular Expressions</h2>
                            <p className="section-subtitle">Regex lets you search for patterns within text using special syntax.</p>

                            <ConceptCard icon="🔍" title="Basic Patterns" color="#f43f5e">
                                <div className="grid-2" style={{ marginTop: 8 }}>
                                    <div>
                                        <p><code>[0-9]+</code> — digits</p>
                                        <p><code>[a-zA-Z]+</code> — letters</p>
                                        <p><code>\\w+</code> — word characters</p>
                                        <p><code>\\d{'{'}{'{'}10{'}'}</code> — exactly 10 digits</p>
                                    </div>
                                    <div>
                                        <p><code>^</code> — start of string</p>
                                        <p><code>$</code> — end of string</p>
                                        <p><code>.</code> — any character</p>
                                        <p><code>*</code> — zero or more</p>
                                    </div>
                                </div>
                                <CodeExample code={`import re

text = "Call 9876543210 or email test@mail.com"
phones = re.findall(r'\\d{10}', text)
print(phones)  # ['9876543210']

emails = re.findall(r'\\w+@\\w+\\.\\w+', text)
print(emails)  # ['test@mail.com']`} />
                            </ConceptCard>

                            <InteractiveDemo title="Regex Pattern Tester">
                                <div className="demo-input-group">
                                    <label>Pattern</label>
                                    <input className="demo-input" value={regexPattern} onChange={e => setRegexPattern(e.target.value)} placeholder="e.g. [0-9]+" />
                                </div>
                                <div className="demo-input-group">
                                    <label>Test String</label>
                                    <input className="demo-input" value={regexText} onChange={e => setRegexText(e.target.value)} />
                                </div>
                                <button className="demo-btn" onClick={testRegex}>Test Pattern</button>
                                {regexResult && (
                                    regexResult.ok ? (
                                        <div className={`demo-result ${regexResult.matches.length > 0 ? 'success' : 'error'}`}>
                                            {regexResult.matches.length > 0
                                                ? `✓ ${regexResult.matches.length} match(es): ${regexResult.matches.join(', ')}`
                                                : '✗ No matches found'}
                                        </div>
                                    ) : (
                                        <div className="demo-result error">Error: {regexResult.error}</div>
                                    )
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

export default Module1
