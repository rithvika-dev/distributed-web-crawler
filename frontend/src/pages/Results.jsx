import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://distributed-web-crawler-nchn.onrender.com/api'

function Results() {

  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Fetch all crawled pages
  const fetchPages = async () => {
    try {
      const res = await axios.get(`${API}/pages`)
      setPages(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  // Filter pages based on search input
  const filteredPages = pages.filter(page =>
    page.url.toLowerCase().includes(search.toLowerCase()) ||
    page.title.toLowerCase().includes(search.toLowerCase())
  )

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
          Crawl Results
        </h1>
        <p style={{ color: 'gray', margin: 0, fontSize: '14px' }}>
          All pages discovered and crawled by the system
        </p>
      </div>

      {/* Search + Count Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by URL or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '320px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1.5px solid lightgray',
            fontSize: '13px',
            outline: 'none'
          }}
        />

        {/* Total Count */}
        <div style={{
          fontSize: '13px',
          color: 'gray',
          fontWeight: '500'
        }}>
          Showing {filteredPages.length} of {pages.length} pages
        </div>

      </div>

      {/* Results Table */}
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
            Loading results...
          </div>

        ) : filteredPages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: 'gray'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontWeight: '600', marginBottom: '6px' }}>
              No results found
            </div>
            <div style={{ fontSize: '13px' }}>
              Try a different search or start a crawl job
            </div>
          </div>

        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>

            {/* Table Head */}
            <thead>
              <tr style={{ background: 'whitesmoke' }}>
                {['#', 'Title', 'URL', 'Status', 'Links Found', 'Depth', 'Crawled At'].map(h => (
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
              {filteredPages.map((page, index) => (
                <tr key={page._id}
                  onMouseEnter={e => e.currentTarget.style.background = 'whitesmoke'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >

                  {/* Row Number */}
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: 'lightgray',
                    borderBottom: '1px solid whitesmoke',
                    fontWeight: '600'
                  }}>
                    {index + 1}
                  </td>

                  {/* Title */}
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'midnightblue',
                    borderBottom: '1px solid whitesmoke',
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {page.title || '—'}
                  </td>

                  {/* URL */}
                  <td style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid whitesmoke',
                    maxWidth: '220px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '12px',
                        color: 'royalblue',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      {page.url}
                    </a>
                  </td>

                  {/* Status Code */}
                  <td style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: page.statusCode === 200 ? 'honeydew' : 'mistyrose',
                      color: page.statusCode === 200 ? 'green' : 'red'
                    }}>
                      {page.statusCode}
                    </span>
                  </td>

                  {/* Links Found */}
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'midnightblue',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    {page.linksFound}
                  </td>

                  {/* Depth */}
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: 'gray',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    {page.depth}
                  </td>

                  {/* Crawled At */}
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '12px',
                    color: 'gray',
                    borderBottom: '1px solid whitesmoke'
                  }}>
                    {new Date(page.crawledAt).toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Results