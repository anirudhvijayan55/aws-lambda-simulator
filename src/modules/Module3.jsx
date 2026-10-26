import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConceptCard from '../components/ConceptCard'
import CodeExample from '../components/CodeExample'
import InteractiveDemo from '../components/InteractiveDemo'
import QuizBlock from '../components/QuizBlock'
import { quizData, tabKeyMap } from '../data/quizData'

const MODULE_ID = 3
const tabs = ['Collections', 'Comprehensions', 'Searching', 'Sorting Visualizer']

const collectionTypes = [
    { name: 'List', icon: '📋', color: '#3b82f6', syntax: '[1, 2, 3]', ordered: true, mutable: true, unique: false, desc: 'Ordered, mutable sequence. Most versatile collection.' },
    { name: 'Tuple', icon: '📌', color: '#8b5cf6', syntax: '(1, 2, 3)', ordered: true, mutable: false, unique: false, desc: 'Ordered, immutable sequence. Great for fixed data.' },
    { name: 'Dictionary', icon: '📖', color: '#f59e0b', syntax: '{"a": 1}', ordered: true, mutable: true, unique: true, desc: 'Key-value pairs. Keys must be unique.' },
    { name: 'Set', icon: '🔵', color: '#10b981', syntax: '{1, 2, 3}', ordered: false, mutable: true, unique: true, desc: 'Unordered, unique elements only.' }
]

function Module3() {
    const [activeTab, setActiveTab] = useState(0)
    const tabKey = tabKeyMap[MODULE_ID][activeTab]
    const currentQuiz = quizData[tabKey]

    /* ── Sorting Visualizer ── */
    const [sortAlgo, setSortAlgo] = useState('bubble')
    const [bars, setBars] = useState(() => generateArray())
    const [isSorting, setIsSorting] = useState(false)
    const [comparing, setComparing] = useState([])
    const [sorted, setSorted] = useState([])
    const stopRef = useRef(false)

    /* ── Search Visualizer ── */
    const [searchArr] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91])
    const [searchTarget, setSearchTarget] = useState(23)
    const [searchType, setSearchType] = useState('linear')
    const [searchStep, setSearchStep] = useState(-1)
    const [searchFound, setSearchFound] = useState(null)
    const [searchHighlights, setSearchHighlights] = useState({})
    const [isSearching, setIsSearching] = useState(false)

    function generateArray() {
        return Array.from({ length: 20 }, () => Math.floor(Math.random() * 180) + 20)
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms))

    const resetSort = () => {
        stopRef.current = true
        setTimeout(() => {
            setBars(generateArray())
            setComparing([])
            setSorted([])
            setIsSorting(false)
            stopRef.current = false
        }, 50)
    }

    const startSort = async () => {
        setIsSorting(true)
        setSorted([])
        setComparing([])
        stopRef.current = false
        const arr = [...bars]

        switch (sortAlgo) {
            case 'bubble': await bubbleSort(arr); break
            case 'selection': await selectionSort(arr); break
            case 'insertion': await insertionSort(arr); break
            case 'quick': await quickSort(arr, 0, arr.length - 1); break
            case 'merge': await mergeSort(arr, 0, arr.length - 1); break
        }

        if (!stopRef.current) {
            setSorted(arr.map((_, i) => i))
            setComparing([])
        }
        setIsSorting(false)
    }

    async function bubbleSort(arr) {
        for (let i = 0; i < arr.length - 1 && !stopRef.current; i++) {
            for (let j = 0; j < arr.length - i - 1 && !stopRef.current; j++) {
                setComparing([j, j + 1])
                if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                setBars([...arr])
                await sleep(40)
            }
        }
    }

    async function selectionSort(arr) {
        for (let i = 0; i < arr.length - 1 && !stopRef.current; i++) {
            let min = i
            for (let j = i + 1; j < arr.length && !stopRef.current; j++) {
                setComparing([min, j])
                if (arr[j] < arr[min]) min = j
                await sleep(40)
            }
            if (min !== i) [arr[i], arr[min]] = [arr[min], arr[i]]
            setBars([...arr])
        }
    }

    async function insertionSort(arr) {
        for (let i = 1; i < arr.length && !stopRef.current; i++) {
            let key = arr[i], j = i - 1
            while (j >= 0 && arr[j] > key && !stopRef.current) {
                setComparing([j, j + 1])
                arr[j + 1] = arr[j]
                j--
                setBars([...arr])
                await sleep(40)
            }
            arr[j + 1] = key
            setBars([...arr])
        }
    }

    async function quickSort(arr, low, high) {
        if (low < high && !stopRef.current) {
            const pivot = arr[high]
            let i = low - 1
            for (let j = low; j < high && !stopRef.current; j++) {
                setComparing([j, high])
                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]]
                }
                setBars([...arr])
                await sleep(40)
            }
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
            setBars([...arr])
            const pi = i + 1
            await quickSort(arr, low, pi - 1)
            await quickSort(arr, pi + 1, high)
        }
    }

    async function mergeSort(arr, l, r) {
        if (l < r && !stopRef.current) {
            const m = Math.floor((l + r) / 2)
            await mergeSort(arr, l, m)
            await mergeSort(arr, m + 1, r)
            await merge(arr, l, m, r)
        }
    }

    async function merge(arr, l, m, r) {
        const left = arr.slice(l, m + 1), right = arr.slice(m + 1, r + 1)
        let i = 0, j = 0, k = l
        while (i < left.length && j < right.length && !stopRef.current) {
            setComparing([k])
            if (left[i] <= right[j]) { arr[k++] = left[i++] } else { arr[k++] = right[j++] }
            setBars([...arr])
            await sleep(40)
        }
        while (i < left.length && !stopRef.current) { arr[k++] = left[i++]; setBars([...arr]); await sleep(20) }
        while (j < right.length && !stopRef.current) { arr[k++] = right[j++]; setBars([...arr]); await sleep(20) }
    }

    /* ── Search functions ── */
    const runSearch = async () => {
        setIsSearching(true)
        setSearchFound(null)
        setSearchHighlights({})
        setSearchStep(-1)

        if (searchType === 'linear') {
            for (let i = 0; i < searchArr.length; i++) {
                setSearchStep(i)
                setSearchHighlights({ [i]: 'checking' })
                await sleep(500)
                if (searchArr[i] === searchTarget) {
                    setSearchHighlights({ [i]: 'found' })
                    setSearchFound(i)
                    setIsSearching(false)
                    return
                }
                setSearchHighlights(prev => ({ ...prev, [i]: 'checked' }))
            }
            setSearchFound(-1)
        } else {
            let lo = 0, hi = searchArr.length - 1
            while (lo <= hi) {
                const mid = Math.floor((lo + hi) / 2)
                setSearchStep(mid)
                setSearchHighlights({ lo: 'range', hi: 'range', [mid]: 'checking' })
                await sleep(700)
                if (searchArr[mid] === searchTarget) {
                    setSearchHighlights({ [mid]: 'found' })
                    setSearchFound(mid)
                    setIsSearching(false)
                    return
                } else if (searchArr[mid] < searchTarget) {
                    lo = mid + 1
                } else {
                    hi = mid - 1
                }
            }
            setSearchFound(-1)
        }
        setIsSearching(false)
    }

    return (
        <div className="module-page">
            <motion.div className="module-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="module-header-badge" style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4' }}>Module 3</div>
                <h1>Data Organization using Collections</h1>
                <p>Master Python's built-in collections and visualize searching & sorting algorithms in action.</p>
            </motion.div>

            <div className="module-tabs">
                {tabs.map((tab, i) => (
                    <button key={tab} className={`module-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

                    {/* ─── TAB 0: Collections ─── */}
                    {activeTab === 0 && (
                        <div>
                            <h2 className="section-title">Python Collections</h2>

                            {/* Comparison Table */}
                            <div className="concept-card" style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr><th>Type</th><th>Syntax</th><th>Ordered</th><th>Mutable</th><th>Unique</th></tr>
                                    </thead>
                                    <tbody>
                                        {collectionTypes.map(ct => (
                                            <tr key={ct.name}>
                                                <td style={{ color: ct.color, fontWeight: 600 }}>{ct.icon} {ct.name}</td>
                                                <td>{ct.syntax}</td>
                                                <td>{ct.ordered ? '✅' : '❌'}</td>
                                                <td>{ct.mutable ? '✅' : '❌'}</td>
                                                <td>{ct.unique ? '✅' : '❌'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid-2">
                                <ConceptCard icon="📋" title="List" color="#3b82f6">
                                    <CodeExample code={`fruits = ["apple", "banana", "cherry"]
fruits.append("date")
fruits[1] = "blueberry"
print(fruits)    # ['apple','blueberry','cherry','date']
print(len(fruits))  # 4`} />
                                </ConceptCard>

                                <ConceptCard icon="📌" title="Tuple" color="#8b5cf6">
                                    <CodeExample code={`point = (10, 20)
x, y = point     # Unpacking
print(x, y)      # 10 20
# point[0] = 5   # ERROR: immutable!
print(len(point)) # 2`} />
                                </ConceptCard>

                                <ConceptCard icon="📖" title="Dictionary" color="#f59e0b">
                                    <CodeExample code={`student = {"name": "Alice", "age": 20}
student["grade"] = "A"
print(student["name"])    # Alice
print(student.keys())     # dict_keys([...])
print(student.values())   # dict_values([...])`} />
                                </ConceptCard>

                                <ConceptCard icon="🔵" title="Set" color="#10b981">
                                    <CodeExample code={`nums = {1, 2, 3, 2, 1}
print(nums)           # {1, 2, 3}
nums.add(4)
a = {1,2,3}
b = {3,4,5}
print(a & b)  # {3}  Intersection
print(a | b)  # {1,2,3,4,5}  Union`} />
                                </ConceptCard>
                            </div>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 1: Comprehensions ─── */}
                    {activeTab === 1 && (
                        <div>
                            <ConceptCard icon="⚡" title="List Comprehension" color="#3b82f6">
                                <p>Create lists in one line with an expression and optional condition.</p>
                                <CodeExample code={`# Squares of even numbers 0-9
squares = [x**2 for x in range(10) if x % 2 == 0]
print(squares)  # [0, 4, 16, 36, 64]

# Convert to uppercase
words = ["hello", "world"]
upper = [w.upper() for w in words]
print(upper)  # ['HELLO', 'WORLD']`} />
                            </ConceptCard>

                            <ConceptCard icon="📖" title="Dictionary Comprehension" color="#f59e0b" delay={0.1}>
                                <CodeExample code={`# Square mapping
sq = {x: x**2 for x in range(6)}
print(sq)  # {0:0, 1:1, 2:4, 3:9, 4:16, 5:25}

# Filter dictionary
scores = {"Alice":85, "Bob":60, "Charlie":92}
passed = {k:v for k,v in scores.items() if v >= 70}
print(passed)  # {'Alice':85, 'Charlie':92}`} />
                            </ConceptCard>

                            <ConceptCard icon="🔄" title="Iterators" color="#8b5cf6" delay={0.2}>
                                <p>Iterators provide values one at a time using <code>__iter__</code> and <code>__next__</code>.</p>
                                <CodeExample code={`# Using iter() and next()
nums = [10, 20, 30]
it = iter(nums)
print(next(it))  # 10
print(next(it))  # 20
print(next(it))  # 30

# Generators (lazy iterators)
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for val in countdown(3):
    print(val)  # 3, 2, 1`} />
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 2: Searching ─── */}
                    {activeTab === 2 && (
                        <div>
                            <h2 className="section-title">Search Algorithms</h2>

                            <div className="grid-2">
                                <ConceptCard icon="➡️" title="Linear Search" color="#3b82f6">
                                    <p>Check each element one by one. Works on any list. Time: <strong>O(n)</strong></p>
                                    <CodeExample code={`def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`} />
                                </ConceptCard>
                                <ConceptCard icon="✂️" title="Binary Search" color="#10b981">
                                    <p>Divide sorted list in half each step. Time: <strong>O(log n)</strong></p>
                                    <CodeExample code={`def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`} />
                                </ConceptCard>
                            </div>

                            <InteractiveDemo title="Search Visualization">
                                <div className="flex-row flex-wrap" style={{ marginBottom: 16, gap: 12 }}>
                                    <select className="demo-select" value={searchType} onChange={e => { setSearchType(e.target.value); setSearchFound(null); setSearchHighlights({}) }}>
                                        <option value="linear">Linear Search</option>
                                        <option value="binary">Binary Search</option>
                                    </select>
                                    <div className="demo-input-group" style={{ margin: 0 }}>
                                        <label>Target</label>
                                        <input className="demo-input" type="number" value={searchTarget} onChange={e => setSearchTarget(Number(e.target.value))} style={{ width: 80 }} />
                                    </div>
                                    <button className="demo-btn" onClick={runSearch} disabled={isSearching}>
                                        {isSearching ? 'Searching...' : '🔍 Search'}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                                    {searchArr.map((val, i) => (
                                        <motion.div key={i}
                                            animate={{
                                                scale: searchHighlights[i] === 'checking' ? 1.15 : 1,
                                                backgroundColor: searchHighlights[i] === 'found' ? '#10b981'
                                                    : searchHighlights[i] === 'checking' ? '#f59e0b'
                                                        : searchHighlights[i] === 'checked' ? 'rgba(100,116,139,0.3)'
                                                            : '#1a2236'
                                            }}
                                            style={{
                                                width: 48, height: 48, borderRadius: 8,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 14, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
                                                border: '1px solid var(--border-color)',
                                                color: searchHighlights[i] === 'found' || searchHighlights[i] === 'checking' ? 'white' : 'var(--text-primary)'
                                            }}
                                        >
                                            {val}
                                        </motion.div>
                                    ))}
                                </div>

                                {searchFound !== null && (
                                    <div className={`demo-result ${searchFound >= 0 ? 'success' : 'error'}`}>
                                        {searchFound >= 0 ? `✓ Found ${searchTarget} at index ${searchFound}` : `✗ ${searchTarget} not found in the array`}
                                    </div>
                                )}
                            </InteractiveDemo>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 3: Sorting Visualizer ─── */}
                    {activeTab === 3 && (
                        <div>
                            <h2 className="section-title">Sorting Algorithm Visualizer</h2>
                            <p className="section-subtitle">Watch different sorting algorithms animate in real-time.</p>

                            <InteractiveDemo title="Sorting Visualizer">
                                <div className="flex-row flex-wrap" style={{ marginBottom: 20, gap: 8 }}>
                                    {[
                                        { v: 'bubble', l: 'Bubble Sort' },
                                        { v: 'selection', l: 'Selection Sort' },
                                        { v: 'insertion', l: 'Insertion Sort' },
                                        { v: 'quick', l: 'Quick Sort' },
                                        { v: 'merge', l: 'Merge Sort' }
                                    ].map(a => (
                                        <button key={a.v}
                                            className={sortAlgo === a.v ? 'demo-btn' : 'demo-btn-secondary'}
                                            onClick={() => { setSortAlgo(a.v); if (!isSorting) resetSort() }}
                                            disabled={isSorting}
                                        >
                                            {a.l}
                                        </button>
                                    ))}
                                </div>

                                <div className="viz-bars" style={{ marginBottom: 24 }}>
                                    {bars.map((h, i) => (
                                        <motion.div key={i}
                                            className={`viz-bar ${comparing.includes(i) ? 'comparing' : ''} ${sorted.includes(i) ? 'sorted' : ''}`}
                                            style={{ height: h, background: comparing.includes(i) ? undefined : sorted.includes(i) ? undefined : 'var(--accent-blue)' }}
                                            layout
                                            transition={{ duration: 0.15 }}
                                        />
                                    ))}
                                </div>

                                <div className="flex-row" style={{ justifyContent: 'center' }}>
                                    <button className="demo-btn" onClick={startSort} disabled={isSorting}>▶ Sort</button>
                                    <button className="demo-btn-secondary" onClick={resetSort}>🔄 New Array</button>
                                </div>
                            </InteractiveDemo>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Module3
