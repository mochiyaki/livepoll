import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../api'

export default function HostCreate() {
    const navigate = useNavigate()
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const updateOption = (idx: number, value: string) => {
        setOptions(prev => prev.map((o, i) => (i === idx ? value : o)))
    }

    const addOption = () => {
        if (options.length < 8) setOptions(prev => [...prev, ''])
    }

    const removeOption = (idx: number) => {
        if (options.length <= 2) return
        setOptions(prev => prev.filter((_, i) => i !== idx))
    }

    const handleStart = async () => {
        const filled = options.map(o => o.trim()).filter(Boolean)
        if (!question.trim()) { setError('Please enter a question.'); return }
        if (filled.length < 2) { setError('Please provide at least 2 options.'); return }

        setLoading(true)
        setError('')
        try {
            const { data } = await axios.post(`${API}/polls`, {
                question: question.trim(),
                options: filled,
            })
            navigate(`/poll/${data.id}/active`)
        } catch {
            setError('Failed to create poll. Is the backend running?')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <div className="card">
                <h1>Live Poll</h1>
                <p className="subtitle">Create a poll and let your audience vote in real time.</p>

                <div className="field">
                    <label htmlFor="question">Poll Question</label>
                    <input
                        id="question"
                        type="text"
                        placeholder="e.g. What's your favourite programming language?"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                    />
                </div>

                <div className="field">
                    <label>Answer Options</label>
                    <div className="options-list">
                        {options.map((opt, idx) => (
                            <div className="option-row" key={idx}>
                                <input
                                    id={`option-${idx}`}
                                    type="text"
                                    placeholder={`Option ${idx + 1}`}
                                    value={opt}
                                    onChange={e => updateOption(idx, e.target.value)}
                                />
                                {options.length > 2 && (
                                    <button
                                        className="btn-icon"
                                        onClick={() => removeOption(idx)}
                                        aria-label={`Remove option ${idx + 1}`}
                                    >✕</button>
                                )}
                            </div>
                        ))}
                    </div>

                    {options.length < 8 && (
                        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={addOption}>
                            + Add Option
                        </button>
                    )}
                </div>

                {error && (
                    <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
                )}

                <button
                    id="start-poll-btn"
                    className="btn btn-primary"
                    onClick={handleStart}
                    disabled={loading}
                >
                    {loading ? 'Starting…' : '🚀 Start Poll'}
                </button>
            </div>
        </div>
    )
}
