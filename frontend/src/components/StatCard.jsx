function StatCard({ title, value, icon, background, color }) {
  // This component receives 5 things from parent:
  // title     → text like "Pages Crawled"
  // value     → number like 150
  // icon      → emoji like 📄
  // background → card background color
  // color     → number text color

  return (
    <div className="stat-card">

      {/* Icon Box */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        marginBottom: '16px'
      }}>
        {icon}
      </div>

      {/* Number */}
      <div style={{
        fontSize: '34px',
        fontWeight: '800',
        color: color,
        marginBottom: '6px',
        letterSpacing: '-1px'
      }}>
        {value}
      </div>

      {/* Title */}
      <div style={{
        fontSize: '13px',
        fontWeight: '500',
        color: 'gray'
      }}>
        {title}
      </div>

    </div>
  )
}

export default StatCard