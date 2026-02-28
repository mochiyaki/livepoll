import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import axios from 'axios'
import API from '../api'

interface Option { id: number; text: string; votes: number }
interface Poll { id: string; question: string; is_active: boolean; options: Option[] }

export default function HostActive() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [poll, setPoll] = useState<Poll | null>(null)
    const [ending, setEnding] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Determine join URL: use the current origin so QR works seamlessly locally and via tunnels
    const joinUrl = `${window.location.origin}/join/${id}`

    const fetchPoll = async () => {
        try {
            const { data } = await axios.get<Poll>(`${API}/polls/${id}`)
            setPoll(data)
        } catch {
            // silently ignore transient errors
        }
    }

    useEffect(() => {
        fetchPoll()
        intervalRef.current = setInterval(fetchPoll, 2000)
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [id])

    const handleEnd = async () => {
        setEnding(true)
        if (intervalRef.current) clearInterval(intervalRef.current)
        try {
            await axios.post(`${API}/polls/${id}/end`)
            navigate(`/poll/${id}/results`)
        } catch {
            setEnding(false)
        }
    }

    const totalVotes = poll?.options.reduce((s, o) => s + o.votes, 0) ?? 0

    return (
        <div className="page">
            <div className="card" style={{ maxWidth: 560 }}>
                <div className="badge">LIVE</div>
                <h2 style={{ marginBottom: '0.5rem' }}>{poll?.question ?? 'Loading…'}</h2>

                <div className="vote-count">{totalVotes}</div>
                <p className="vote-label">{totalVotes === 1 ? 'vote cast' : 'votes cast'}</p>

                <div className="qr-wrapper">
                    <div className="qr-box">
                        <QRCodeSVG value={joinUrl} size={200} />
                    </div>
                </div>
                <p className="join-link">{joinUrl}</p>

                <hr className="divider" />

                <button
                    id="end-poll-btn"
                    className="btn btn-danger"
                    onClick={handleEnd}
                    disabled={ending}
                >
                    {ending ? 'Ending…' : '⏹ End Poll & Show Results'}
                </button>
            </div>
        </div>
    )
}
