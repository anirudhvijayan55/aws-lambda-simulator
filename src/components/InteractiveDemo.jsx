function InteractiveDemo({ title, children }) {
    return (
        <div className="demo-container">
            <div className="demo-header">
                <span className="demo-header-dot" style={{ background: '#f43f5e' }} />
                <span className="demo-header-dot" style={{ background: '#f59e0b' }} />
                <span className="demo-header-dot" style={{ background: '#10b981' }} />
                <h4>🧪 {title}</h4>
            </div>
            <div className="demo-body">
                {children}
            </div>
        </div>
    )
}

export default InteractiveDemo
