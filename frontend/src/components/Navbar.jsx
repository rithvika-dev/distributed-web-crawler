import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/',        label: 'Dashboard' },
    { path: '/jobs',    label: 'Jobs'      },
    { path: '/results', label: 'Results'   },
  ]

  return (
    <nav className="navbar">

      {/* Logo */}
      <h2 className="navbar-logo" style={{ margin: 0, color: 'royalblue', fontSize: '20px' }}>
        WebCrawler
      </h2>

      {/* Links */}
      <div className="navbar-links">
        {links.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                background: isActive ? 'royalblue' : 'whitesmoke',
                color: isActive ? 'white' : 'gray',
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Status */}
      <div className="navbar-status">
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'limegreen'
        }} />
        Online
      </div>

    </nav>
  )
}

export default Navbar