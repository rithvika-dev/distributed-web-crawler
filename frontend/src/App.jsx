import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Results from './pages/Results'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div style={{
        minHeight: '100vh',
        background: '#f0f4f8',
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <Navbar />
        <div className="app-container">
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