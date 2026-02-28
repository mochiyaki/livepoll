import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import axios from 'axios'
import API from '../api'

interface Option { id: number; text: string; votes: number }
interface Poll { id: string; question: string; is_active: boolean; options: Option[] }

const COLORS = ['#8b5cf6', '#6366f1', '#a78bfa', '#7c3aed', '#818cf8', '#c4b5fd', '#4f46e5', '#ddd6fe']

export default function HostResults() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [poll, setPoll] = useState<Poll | null>(null)

    useEffect(() => {
        axios.get<Poll>(`${API}/polls/${id}/results`).then(r => setPoll(r.data))
    }, [id])

    const totalVotes = poll?.options.reduce((s, o) => s + o.votes, 0) ?? 0

    return (
        <div className="page">
            <div className="card" style={{ maxWidth: 680 }}>
                <h1>Results</h1>
                <p className="subtitle" style={{ marginBottom: '0.5rem' }}>{poll?.question}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {totalVotes} total {totalVotes === 1 ? 'vote' : 'votes'}
                </p>

                <div className="chart-container" style={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={poll?.options.map(o => ({ name: o.text, votes: o.votes }))}
                            margin={{ top: 8, right: 20, left: 0, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: 'rgba(240,240,255,0.6)', fontSize: 13 }}
                                angle={-25}
                                textAnchor="end"
                                interval={0}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: 'rgba(240,240,255,0.5)', fontSize: 12 }}
                                width={32}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(15,16,32,0.95)',
                                    border: '1px solid rgba(139,92,246,0.4)',
                                    borderRadius: 10,
                                    color: '#e0d7ff',
                                }}
                                cursor={{ fill: 'rgba(139,92,246,0.08)' }}
                            />
                            <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                                {poll?.options.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <hr className="divider" />

                <button
                    id="new-poll-btn"
                    className="btn btn-primary"
                    onClick={() => navigate('/')}
                >
                    ＋ New Poll
                </button>
            </div>
        </div>
    )
}
