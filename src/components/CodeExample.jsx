import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function CodeExample({ code, language = 'python', title = 'Example' }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="code-block">
            <div className="code-block-header">
                <span className="code-block-lang">{language}</span>
                <button className="code-block-copy" onClick={handleCopy}>
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                    background: 'transparent',
                    padding: '16px',
                    margin: 0,
                    fontSize: '13px',
                    lineHeight: '1.7'
                }}
            >
                {code.trim()}
            </SyntaxHighlighter>
        </div>
    )
}

export default CodeExample
