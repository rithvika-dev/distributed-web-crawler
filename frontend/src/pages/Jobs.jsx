import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://distributed-web-crawler-nchn.onrender.com/api'

function Jobs() {

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch all jobs from backend
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/jobs`)
      setJobs(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Pause a job
  const handlePause = async (id) => {
    try {
      await axios.patch(`${API}/jobs/${id}/pause`)
      fetchJobs() // Refresh list
    } catch (err) {
      console.error(err)
    }
  }

  // Stop a job
  const handleStop = async (id) => {
    try {
      await axios.patch(`${API}/jobs/${id}/stop`)
      fetchJobs() // Refresh list
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  // Status badge color
  const getStatusStyle = (status) => {
    if (status === 'running')   return { background: 'lightyellow', color: 'orange' }
    if (status === 'completed') return { background: 'honeydew',    color: 'green'  }
    if (status === 'paused')    return { background: 'lightcyan',   color: 'teal'   }
    if (status === 'failed')    return { background: 'mistyrose',   color: 'red'    }
    return { background: 'whitesmoke', color: 'gray' }
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
          Crawl Jobs
        </h1>
        <p style={{ color: 'gray', margin: 0, fontSize: '14px' }}>
          View and manage all your crawl jobs
        </p>
      </div>

      {/* Jobs Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid lightgray',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: 'gray',
            fontSize: '14px'
          }}>
            Loading jobs...
          </div>

        ) : jobs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: 'gray'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💼</div>
            <div style={{ fontWeight: '600', marginBottom: '6px' }}>
              No jobs yet
            </div>
            <div style={{ fontSize: '13px' }}>
              Go to Dashboard and start a crawl job
            </div>
          </div>

        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>

            {/* Table Head */}
            <thead>
              <tr style={{ background: 'whitesmoke' }}>
                {['Seed URL', 'Status', 'Pages', 'Links', 'Depth', 'Max Pages', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px',
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

            {/* Table Body */}
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}
                  onMouseEnter={e => e.currentTarget.style.background = 'whitesmoke'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >

                  {/* Seed URL */}
                  <td style={{
                    padding: '14px 16px',
                    fontSize: '13px',
                    color: 'royalblue',
                    borderBottom: '1px solid whitesmoke',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {job.seedUrl}
                  </td>

                  {/* Status Badge */}
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      ...getStatusStyle(job.status)
                    }}>
                      {job.status}
                    </span>
                  </td>

                  {/* Pages Count */}
                  <td style={{
                    padding: '14px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'midnightblue',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    {job.pagesCount}
                  </td>

                  {/* Links Count */}
                  <td style={{
                    padding: '14px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'midnightblue',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    {job.linksCount}
                  </td>

                  {/* Depth */}
                  <td style={{
                    padding: '14px 16px',
                    fontSize: '13px',
                    color: 'gray',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    {job.depth}
                  </td>

                  {/* Max Pages */}
                  <td style={{
                    padding: '14px 16px',
                    fontSize: '13px',
                    color: 'gray',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    {job.maxPages}
                  </td>

                  {/* Action Buttons */}
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    <div style={{ display: 'flex', gap: '8px' }}>

                      {/* Pause Button */}
                      {job.status === 'running' && (
                        <button
                          onClick={() => handlePause(job._id)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'lightyellow',
                            color: 'orange',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          ⏸ Pause
                        </button>
                      )}

                      {/* Stop Button */}
                      {(job.status === 'running' || job.status === 'paused') && (
                        <button
                          onClick={() => handleStop(job._id)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'mistyrose',
                            color: 'red',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          🛑 Stop
                        </button>
                      )}

                      {/* Completed / Failed — no buttons */}
                      {(job.status === 'completed' || job.status === 'failed') && (
                        <span style={{
                          fontSize: '12px',
                          color: 'lightgray'
                        }}>
                          —
                        </span>
                      )}

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs