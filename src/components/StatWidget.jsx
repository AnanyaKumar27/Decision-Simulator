// src/components/StatWidget.jsx
export default function StatWidget({ icon, label, value, sub, accent = 'brand' }) {
  const colors = {
    brand:   'text-brand-200 bg-brand-500/15',
    cyan:    'text-[#ffc0cf] bg-[#ffc0cf]/12',
    violet:  'text-[#ff9fb1] bg-[#ff9fb1]/12',
    emerald: 'text-[#ff7d96] bg-[#ff7d96]/12',
  }
  const cls = colors[accent] || colors.brand

  return (
    <div className="card story-glow flex items-center gap-4 animate-fade-in min-h-[112px]">
      <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-sm font-semibold shrink-0 ${cls}`}>
        {icon}
      </div>
      <div>
        <p className="text-surface-muted text-[10px] font-medium uppercase tracking-[0.24em]">{label}</p>
        <p className="font-display font-bold text-3xl text-white leading-tight mt-1">{value}</p>
        {sub && <p className="text-surface-muted text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
