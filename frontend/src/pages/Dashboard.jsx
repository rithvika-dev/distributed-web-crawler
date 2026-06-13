import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import StatCard from '../components/StatCard'

const socket = io('https://distributed-web-crawler-nchn.onrender.com')
const API = 'https://distributed-web-crawler-nchn.onrender.com/api'

function Dashboard() {

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalPages: 0,
    totalLinks: 0,
    runningJobs: 0,
    completedJobs: 0,
    failedJobs: 0
  })

  const [form, setForm] = useState({
    seedUrl: '',
    depth: 2,
    maxPages: 50
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [recentPages, setRecentPages] = useState([])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/stats`)
      setStats(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchPages = async () => {
    try {
      const res = await axios.get(`${API}/pages`)
      setRecentPages(res.data.slice(0, 10))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchPages()
    // Live update via socket 
    socket.on('crawl_update', () => {
      fetchStats()
      fetchPages()
    })

    // Also refresh every 5 seconds automatically 
    const interval = setInterval(()=>{
      fetchStats()
      fetchPages()
    }, 5000)
    return () => {
      socket.off('crawl_update')
      clearInterval(interval)
    }
  }, [])

  const handleStartCrawl = async () => {
    if (!form.seedUrl) {
      setMessage('Please enter a URL!')
      return
    }
    try {
      setLoading(true)
      setMessage('')
      await axios.post(`${API}/jobs`, form)
      setMessage('Crawl started successfully!')
      fetchStats()
    } catch (err) {
      setMessage('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: 'midnightblue',
          margin: '0 0 6px 0'
        }}>
          Crawler Dashboard
        </h1>
        <p style={{ color: 'gray', margin: 0, fontSize: '14px' }}>
          Monitor and control your web crawling jobs
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <StatCard title="Pages Crawled" value={stats.totalPages}  />
        <StatCard title="Links Found" value={stats.totalLinks}  />
        <StatCard title="Total Jobs" value={stats.totalJobs}   />
        <StatCard title="Running" value={stats.runningJobs}  />
        <StatCard title="Completed" value={stats.completedJobs}  />
        <StatCard title="Failed" value={stats.failedJobs}   />
      </div>

      {/* Bottom Two Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '24px'
      }}>

        {/* Start Crawl Form */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid lightgray',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          height: 'fit-content'
        }}>

          <h3 style={{ margin: '0 0 20px 0', color: 'midnightblue', fontSize: '16px' }}>
            🚀 Start New Crawl
          </h3>

          {/* URL */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: 'dimgray',
              marginBottom: '6px'
            }}>
              Seed URL
            </label>
            <input
              type="text"
              placeholder="https://wikipedia.org"
              value={form.seedUrl}
              onChange={(e) => setForm({ ...form, seedUrl: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid lightgray',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Depth */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: 'dimgray',
              marginBottom: '6px'
            }}>
              Crawl Depth
            </label>
            <input
              type="number"
              value={form.depth}
              onChange={(e) => setForm({ ...form, depth: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid lightgray',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Max Pages */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: 'dimgray',
              marginBottom: '6px'
            }}>
              Max Pages
            </label>
            <input
              type="number"
              value={form.maxPages}
              onChange={(e) => setForm({ ...form, maxPages: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid lightgray',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleStartCrawl}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? 'lightgray' : 'royalblue',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⏳ Starting...' : '🚀 Launch Crawler'}
          </button>

          {/* Message */}
          {message && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: message.includes('successfully') ? 'honeydew' : 'mistyrose',
              color: message.includes('successfully') ? 'green' : 'red',
              fontSize: '13px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
        </div>

        {/* Recent Pages Table */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid lightgray',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>

          <h3 style={{ margin: '0 0 20px 0', color: 'midnightblue', fontSize: '16px' }}>
            📋 Recently Crawled Pages
          </h3>

          {recentPages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'gray' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🕷️</div>
              <div style={{ fontWeight: '600', marginBottom: '6px' }}>No pages crawled yet</div>
              <div style={{ fontSize: '13px' }}>Start a crawl job using the form</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'whitesmoke' }}>
                  {['Title', 'URL', 'Status', 'Links'].map(h => (
                    <th key={h} style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'dimgray',
                      textAlign: 'left',
                      borderBottom: '1px solid lightgray'
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPages.map((page) => (
                  <tr key={page._id}>
                    <td style={{
                      padding: '12px 14px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'midnightblue',
                      borderBottom: '1px solid whitesmoke',
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {page.title || '—'}
                    </td>
                    <td style={{
                      padding: '12px 14px',
                      fontSize: '12px',
                      color: 'royalblue',
                      borderBottom: '1px solid whitesmoke',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {page.url}
                    </td>
                    <td style={{
                      padding: '12px 14px',
                      borderBottom: '1px solid whitesmoke'
                    }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: page.statusCode === 200 ? 'honeydew' : 'mistyrose',
                        color: page.statusCode === 200 ? 'green' : 'red',
                      }}>
                        {page.statusCode}
                      </span>
                    </td>
                    <td style={{
                      padding: '12px 14px',
                      fontSize: '13px',
                      color: 'gray',
                      borderBottom: '1px solid whitesmoke'
                    }}>
                      {page.linksFound}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard