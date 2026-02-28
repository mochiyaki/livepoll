import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HostCreate from './pages/HostCreate'
import HostActive from './pages/HostActive'
import HostResults from './pages/HostResults'
import ParticipantVote from './pages/ParticipantVote'
import ParticipantSuccess from './pages/ParticipantSuccess'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Host flows */}
                <Route path="/" element={<HostCreate />} />
                <Route path="/poll/:id/active" element={<HostActive />} />
                <Route path="/poll/:id/results" element={<HostResults />} />

                {/* Participant flows */}
                <Route path="/join/:id" element={<ParticipantVote />} />
                <Route path="/join/:id/thanks" element={<ParticipantSuccess />} />
            </Routes>
        </BrowserRouter>
    )
}
