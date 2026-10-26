import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConceptCard from '../components/ConceptCard'
import CodeExample from '../components/CodeExample'
import InteractiveDemo from '../components/InteractiveDemo'
import QuizBlock from '../components/QuizBlock'
import { quizData, tabKeyMap } from '../data/quizData'

const MODULE_ID = 5
const tabs = ['NumPy', 'Pandas Basics', 'Data Operations', 'Interactive Demo']

/* ── Sample DataFrame data ── */
const sampleData = [
    { id: 1, name: 'Alice', dept: 'CS', marks: 92, grade: 'A+' },
    { id: 2, name: 'Bob', dept: 'ECE', marks: 78, grade: 'B' },
    { id: 3, name: 'Charlie', dept: 'CS', marks: 85, grade: 'A' },
    { id: 4, name: 'Diana', dept: 'ME', marks: 65, grade: 'C' },
    { id: 5, name: 'Eve', dept: 'ECE', marks: 91, grade: 'A+' },
    { id: 6, name: 'Frank', dept: 'CS', marks: 72, grade: 'B' },
    { id: 7, name: 'Grace', dept: 'ME', marks: 88, grade: 'A' },
    { id: 8, name: 'Hank', dept: 'ECE', marks: 55, grade: 'D' }
]

function Module5() {
    const [activeTab, setActiveTab] = useState(0)
    const tabKey = tabKeyMap[MODULE_ID][activeTab]
    const currentQuiz = quizData[tabKey]

    /* ── Interactive filter state ── */
    const [filterDept, setFilterDept] = useState('All')
    const [filterMinMarks, setFilterMinMarks] = useState(0)
    const [sortBy, setSortBy] = useState('id')
    const [sortDir, setSortDir] = useState('asc')

    const filteredData = sampleData
        .filter(r => filterDept === 'All' || r.dept === filterDept)
        .filter(r => r.marks >= filterMinMarks)
        .sort((a, b) => {
            const val = sortDir === 'asc' ? 1 : -1
            if (typeof a[sortBy] === 'number') return (a[sortBy] - b[sortBy]) * val
            return a[sortBy].localeCompare(b[sortBy]) * val
        })

    const deptGroups = sampleData.reduce((acc, r) => {
        acc[r.dept] = acc[r.dept] || { count: 0, total: 0 }
        acc[r.dept].count++
        acc[r.dept].total += r.marks
        return acc
    }, {})

    return (
        <div className="module-page">
            <motion.div className="module-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="module-header-badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>Module 5</div>
                <h1>Data Processing with NumPy & Pandas</h1>
                <p>Learn to process, filter, group, and analyze data using Python's most popular libraries.</p>
            </motion.div>

            <div className="module-tabs">
                {tabs.map((tab, i) => (
                    <button key={tab} className={`module-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

                    {/* ─── TAB 0: NumPy ─── */}
                    {activeTab === 0 && (
                        <div>
                            <ConceptCard icon="🔢" title="NumPy Arrays" color="#3b82f6">
                                <p>NumPy provides powerful N-dimensional arrays for fast numerical computations.</p>
                                <CodeExample code={`import numpy as np

# Create arrays
a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 3))       # 3x3 zeros
c = np.arange(0, 10, 2)    # [0, 2, 4, 6, 8]
d = np.linspace(0, 1, 5)   # 5 evenly spaced

print(a.shape)   # (5,)
print(a.dtype)   # int64`} />
                            </ConceptCard>

                            <ConceptCard icon="➕" title="Array Operations" color="#8b5cf6" delay={0.1}>
                                <p>NumPy operations work element-wise — no loops needed!</p>
                                <div className="anim-container" style={{ padding: 16, minHeight: 'auto' }}>
                                    <h4>Element-wise Operation Visualization</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {[1, 2, 3].map((v, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                                    style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-blue)', fontFamily: "'JetBrains Mono'" }}>
                                                    {v}
                                                </motion.div>
                                            ))}
                                        </div>
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                            style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-amber)' }}>×</motion.span>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {[10, 20, 30].map((v, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                                                    style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(139,92,246,0.15)', border: '1px solid var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-purple)', fontFamily: "'JetBrains Mono'" }}>
                                                    {v}
                                                </motion.div>
                                            ))}
                                        </div>
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                                            style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-amber)' }}>=</motion.span>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {[10, 40, 90].map((v, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.15 }}
                                                    style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-green)', fontFamily: "'JetBrains Mono'" }}>
                                                    {v}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <CodeExample code={`a = np.array([1, 2, 3])
b = np.array([10, 20, 30])

print(a + b)      # [11, 22, 33]
print(a * b)      # [10, 40, 90]
print(a ** 2)     # [1, 4, 9]
print(np.sqrt(a)) # [1.0, 1.414, 1.732]

# Aggregate functions
print(np.sum(a))   # 6
print(np.mean(a))  # 2.0
print(np.max(a))   # 3`} />
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 1: Pandas Basics ─── */}
                    {activeTab === 1 && (
                        <div>
                            <ConceptCard icon="📊" title="Creating DataFrames" color="#f59e0b">
                                <p>A DataFrame is a 2D table with labeled rows and columns — the core Pandas data structure.</p>
                                <CodeExample code={`import pandas as pd

# From dictionary
df = pd.DataFrame({
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [20, 21, 19],
    'Grade': ['A', 'B', 'A+']
})
print(df)
#       Name  Age Grade
# 0    Alice   20     A
# 1      Bob   21     B
# 2  Charlie   19    A+`} />
                            </ConceptCard>

                            <ConceptCard icon="📁" title="Reading Files" color="#3b82f6" delay={0.1}>
                                <CodeExample code={`# Read from CSV
df = pd.read_csv('students.csv')

# Read from Excel
df = pd.read_excel('data.xlsx')

# Basic info
print(df.shape)     # (rows, cols)
print(df.head())    # First 5 rows
print(df.info())    # Column types
print(df.describe())# Statistics`} />
                            </ConceptCard>

                            <ConceptCard icon="🧹" title="Data Cleaning" color="#f43f5e" delay={0.2}>
                                <CodeExample code={`# Handle missing values
df.dropna()              # Remove rows with NaN
df.fillna(0)             # Fill NaN with 0
df['col'].fillna(df['col'].mean())  # Fill with mean

# Remove duplicates
df.drop_duplicates()

# Rename columns
df.rename(columns={'old': 'new'})`} />
                            </ConceptCard>

                            <ConceptCard icon="🔍" title="Selection & Filtering" color="#8b5cf6" delay={0.3}>
                                <CodeExample code={`# Select columns
df['Name']           # Single column
df[['Name', 'Age']]  # Multiple columns

# Filter rows
df[df['Age'] > 20]
df[df['Grade'] == 'A']

# loc and iloc
df.loc[0]           # Row by label
df.iloc[0:3]        # Rows by position`} />
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 2: Data Operations ─── */}
                    {activeTab === 2 && (
                        <div>
                            <ConceptCard icon="📏" title="Sorting" color="#3b82f6">
                                <CodeExample code={`# Sort by column
df.sort_values('marks', ascending=False)

# Sort by multiple columns
df.sort_values(['dept', 'marks'])`} />
                            </ConceptCard>

                            <ConceptCard icon="👥" title="Grouping & Aggregation" color="#10b981" delay={0.1}>
                                <p>Group rows by a column and compute statistics per group.</p>
                                <div className="anim-container" style={{ padding: 16, minHeight: 'auto' }}>
                                    <h4>Group by Department → Aggregate</h4>
                                    <table className="data-table" style={{ marginTop: 8 }}>
                                        <thead>
                                            <tr><th>Dept</th><th>Count</th><th>Avg Marks</th></tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(deptGroups).map(([dept, g], i) => (
                                                <motion.tr key={dept} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                                                    <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{dept}</td>
                                                    <td>{g.count}</td>
                                                    <td>{(g.total / g.count).toFixed(1)}</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <CodeExample code={`# Group and aggregate
df.groupby('dept')['marks'].mean()
df.groupby('dept').agg({
    'marks': ['mean', 'max', 'min'],
    'name': 'count'
})`} />
                            </ConceptCard>

                            <ConceptCard icon="🔗" title="Merging DataFrames" color="#f59e0b" delay={0.2}>
                                <CodeExample code={`# Merge two DataFrames
students = pd.DataFrame({
    'id': [1, 2, 3],
    'name': ['Alice', 'Bob', 'Charlie']
})
scores = pd.DataFrame({
    'id': [1, 2, 3],
    'marks': [90, 75, 88]
})

merged = pd.merge(students, scores, on='id')
print(merged)
#    id     name  marks
# 0   1    Alice     90
# 1   2      Bob     75
# 2   3  Charlie     88`} />
                            </ConceptCard>
                            {currentQuiz && <QuizBlock moduleId={MODULE_ID} tabKey={tabKey} questions={currentQuiz} />}
                        </div>
                    )}

                    {/* ─── TAB 3: Interactive Demo ─── */}
                    {activeTab === 3 && (
                        <div>
                            <h2 className="section-title">Interactive DataFrame Explorer</h2>
                            <p className="section-subtitle">Filter, sort, and explore a sample student dataset.</p>

                            <InteractiveDemo title="DataFrame Operations">
                                <div className="flex-row flex-wrap" style={{ marginBottom: 16, gap: 12 }}>
                                    <div className="demo-input-group" style={{ margin: 0 }}>
                                        <label>Filter by Department</label>
                                        <select className="demo-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                                            <option value="All">All</option>
                                            <option value="CS">CS</option>
                                            <option value="ECE">ECE</option>
                                            <option value="ME">ME</option>
                                        </select>
                                    </div>

                                    <div className="demo-input-group" style={{ margin: 0 }}>
                                        <label>Min Marks</label>
                                        <input className="demo-input" type="number" value={filterMinMarks}
                                            onChange={e => setFilterMinMarks(Number(e.target.value))}
                                            style={{ width: 80 }} min={0} max={100} />
                                    </div>

                                    <div className="demo-input-group" style={{ margin: 0 }}>
                                        <label>Sort By</label>
                                        <select className="demo-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                            <option value="id">ID</option>
                                            <option value="name">Name</option>
                                            <option value="marks">Marks</option>
                                            <option value="dept">Dept</option>
                                        </select>
                                    </div>

                                    <div className="demo-input-group" style={{ margin: 0 }}>
                                        <label>Order</label>
                                        <select className="demo-select" value={sortDir} onChange={e => setSortDir(e.target.value)}>
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr><th>ID</th><th>Name</th><th>Dept</th><th>Marks</th><th>Grade</th></tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence>
                                                {filteredData.map((row) => (
                                                    <motion.tr key={row.id}
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        layout
                                                    >
                                                        <td>{row.id}</td>
                                                        <td style={{ fontWeight: 600 }}>{row.name}</td>
                                                        <td><span className="tag" style={{ background: row.dept === 'CS' ? 'rgba(59,130,246,0.15)' : row.dept === 'ECE' ? 'rgba(139,92,246,0.15)' : 'rgba(16,185,129,0.15)', color: row.dept === 'CS' ? '#3b82f6' : row.dept === 'ECE' ? '#8b5cf6' : '#10b981' }}>{row.dept}</span></td>
                                                        <td style={{ color: row.marks >= 80 ? 'var(--accent-green)' : row.marks >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>{row.marks}</td>
                                                        <td>{row.grade}</td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="demo-result success" style={{ marginTop: 16 }}>
                                    Showing {filteredData.length} of {sampleData.length} rows | Avg Marks: {filteredData.length > 0 ? (filteredData.reduce((s, r) => s + r.marks, 0) / filteredData.length).toFixed(1) : 0}
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

export default Module5
