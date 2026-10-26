import { motion } from 'framer-motion'

function ConceptCard({ icon, title, children, color = 'var(--accent-blue)', delay = 0 }) {
    return (
        <motion.div
            className="concept-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <div className="concept-card-header">
                <div className="concept-card-icon" style={{ background: `${color}18`, color }}>
                    {icon}
                </div>
                <h3>{title}</h3>
            </div>
            <div>{children}</div>
        </motion.div>
    )
}

export default ConceptCard
