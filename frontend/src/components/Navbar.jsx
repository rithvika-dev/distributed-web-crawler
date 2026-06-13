import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/',        label: 'Dashboard' },
    { path: '/jobs',    label: 'Jobs'      },
    { path: '/results', label: 'Results'   },
  ]

  return (
    <nav style={{
      background: 'white',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid lightgray',
      //boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>

      {/* Logo */}
      <h2 style={{ margin: 0, color: 'royalblue', fontSize: '20px' }}>
        WebCrawler
      </h2>

      {/* Links */}
      <div style={{ display: 'flex', gap: '8px' }}>
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        color: 'green',
        fontWeight: '600'
      }}>
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