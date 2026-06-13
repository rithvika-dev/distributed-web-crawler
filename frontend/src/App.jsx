import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Results from './pages/Results'

function App() {
  return (
    <BrowserRouter>
      <div style={{
        minHeight: '100vh',
        background: '#f0f4f8',
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <Navbar />
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App