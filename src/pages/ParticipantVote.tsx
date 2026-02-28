import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../api'

interface Option { id: number; text: string; votes: number }
interface Poll { id: string; question: string; is_active: boolean; options: Option[] }

export default function ParticipantVote() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [poll, setPoll] = useState<Poll | null>(null)
    const [selected, setSelected] = useState<number | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        axios.get<Poll>(`${API}/polls/${id}`)
            .then(r => {
                if (!r.data.is_active) {
                    setError('This poll has already ended.')
                } else {
                    setPoll(r.data)
                }
            })
            .catch(() => setError('Poll not found.'))
    }, [id])

    const handleVote = async () => {
        if (selected === null) return
        setSubmitting(true)
        try {
            await axios.post(`${API}/polls/${id}/vote`, { option_id: selected })
            navigate(`/join/${id}/thanks`)
        } catch (e: any) {
            const msg = e?.response?.data?.detail ?? 'Vote failed. Please try again.'
            setError(msg)
            setSubmitting(false)
        }
    }

    if (error) return (
        <div className="page">
            <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⚠️</div>
                <h2>{error}</h2>
            </div>
        </div>
    )

    if (!poll) return (
        <div className="page">
            <div className="card" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading poll…</p>
            </div>
        </div>
    )

    return (
        <div className="page">
            <div className="card">
                <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '0.5rem' }}>
                    {poll.question}
                </h1>
                <p className="subtitle">Tap your answer below</p>

                <div className="vote-options">
                    {poll.options.map(opt => (
                        <button
                            key={opt.id}
                            id={`option-${opt.id}`}
                            className={`vote-option${selected === opt.id ? ' selected' : ''}`}
                            onClick={() => setSelected(opt.id)}
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>

                <button
                    id="submit-vote-btn"
                    className="btn btn-primary"
                    onClick={handleVote}
                    disabled={selected === null || submitting}
                >
                    {submitting ? 'Submitting…' : '✓ Cast Vote'}
                </button>
            </div>
        </div>
    )
}
