import { motion } from 'framer-motion'
import ConceptCard from '../components/ConceptCard'
import QuizBlock from '../components/QuizBlock'
import { quizData } from '../data/quizData'

const MODULE_ID = 6
const TAB_KEY = '6-overview'

const applications = [
    {
        icon: '🤖',
        title: 'Artificial Intelligence',
        color: '#3b82f6',
        description: 'Python powers leading AI frameworks like TensorFlow, PyTorch, and scikit-learn. It is the go-to language for building intelligent systems, from chatbots to self-driving cars.',
        examples: ['ChatGPT & Large Language Models', 'Image Recognition (OpenCV)', 'Natural Language Processing', 'Recommendation Systems']
    },
    {
        icon: '📊',
        title: 'Data Science',
        color: '#8b5cf6',
        description: 'Python\'s ecosystem (NumPy, Pandas, Matplotlib) makes it the #1 language for data analysis. Data scientists analyze, visualize, and model data to extract insights.',
        examples: ['Exploratory Data Analysis', 'Statistical Modeling', 'Data Visualization (Matplotlib, Seaborn)', 'Predictive Analytics']
    },
    {
        icon: '⚡',
        title: 'Automation',
        color: '#f59e0b',
        description: 'Python excels at automating repetitive tasks — from file management and web scraping to testing and deployment pipelines.',
        examples: ['Web Scraping (BeautifulSoup, Scrapy)', 'File & Folder Management', 'Email Automation', 'CI/CD Pipeline Scripts']
    },
    {
        icon: '🌐',
        title: 'Web Development',
        color: '#10b981',
        description: 'Frameworks like Django and Flask let developers build robust web applications quickly with clean, readable code.',
        examples: ['Django (Instagram, Spotify backend)', 'Flask (APIs and microservices)', 'FastAPI (modern async APIs)', 'REST API Development']
    },
    {
        icon: '🔬',
        title: 'Scientific Computing',
        color: '#06b6d4',
        description: 'Researchers in physics, biology, chemistry, and engineering use Python for simulations, data processing, and mathematical modeling.',
        examples: ['SciPy for Scientific Computation', 'SymPy for Symbolic Math', 'Biopython for Bioinformatics', 'NASA & CERN use Python']
    },
    {
        icon: '🔒',
        title: 'Cybersecurity',
        color: '#f43f5e',
        description: 'Python is widely used in cybersecurity for building tools to analyze vulnerabilities, automate security tasks, and perform penetration testing.',
        examples: ['Network Scanning (Nmap libraries)', 'Penetration Testing', 'Malware Analysis', 'Security Automation']
    }
]

const timeline = [
    { year: '1991', event: 'Python 1.0 released by Guido van Rossum' },
    { year: '2000', event: 'Python 2.0 — List comprehensions, garbage collection' },
    { year: '2008', event: 'Python 3.0 — Modern Python, print becomes function' },
    { year: '2015', event: 'TensorFlow released — Python becomes AI\'s language' },
    { year: '2020', event: 'Python #1 on TIOBE index — Most popular language' },
    { year: '2024', event: 'Python powers ChatGPT, Copilot, and global AI revolution' }
]

function Module6() {
    return (
        <div className="module-page">
            <motion.div className="module-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="module-header-badge" style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e' }}>Module 6</div>
                <h1>Contemporary Issues</h1>
                <p>Discover Python's impact across industries and understand its role in shaping the future of technology.</p>
            </motion.div>

            <h2 className="section-title">Python in the Real World</h2>
            <p className="section-subtitle">Python is used in virtually every domain of technology. Here are the key areas:</p>

            <div className="grid-2">
                {applications.map((app, i) => (
                    <motion.div key={app.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <ConceptCard icon={app.icon} title={app.title} color={app.color}>
                            <p>{app.description}</p>
                            <div style={{ marginTop: 12 }}>
                                {app.examples.map((ex, j) => (
                                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                                        <span style={{ color: app.color }}>▸</span> {ex}
                                    </div>
                                ))}
                            </div>
                        </ConceptCard>
                    </motion.div>
                ))}
            </div>

            <h2 className="section-title" style={{ marginTop: 40 }}>Python's Journey</h2>
            <div className="concept-card">
                <div style={{ position: 'relative', paddingLeft: 24 }}>
                    <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'var(--border-color)' }} />
                    {timeline.map((item, i) => (
                        <motion.div key={item.year}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}
                        >
                            <div style={{
                                width: 16, height: 16, borderRadius: '50%', background: 'var(--gradient-primary)',
                                flexShrink: 0, position: 'relative', left: -16, zIndex: 1
                            }} />
                            <div style={{ marginLeft: -8 }}>
                                <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: 14, fontFamily: "'JetBrains Mono'" }}>{item.year}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{item.event}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div className="concept-card" style={{ textAlign: 'center', marginTop: 32 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🐍</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>Why Python?</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>
                    Python's simple syntax, vast ecosystem, and strong community make it the ideal first programming language
                    and the most versatile tool in a developer's toolkit.
                </p>
            </motion.div>

            <QuizBlock moduleId={MODULE_ID} tabKey={TAB_KEY} questions={quizData[TAB_KEY]} />
        </div>
    )
}

export default Module6
