// src/components/InsightCard.jsx
const TYPE_STYLES = {
  goal:      'bg-brand-500/10 border-brand-500/25 text-brand-300',
  growth:    'bg-cyan-500/10 border-cyan-500/25 text-cyan-300',
  warning:   'bg-amber-500/10 border-amber-500/25 text-amber-300',
  success:   'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
  info:      'bg-violet-500/10 border-violet-500/25 text-violet-300',
  milestone: 'bg-pink-500/10 border-pink-500/25 text-pink-300',
}

export default function InsightCard({ insight }) {
  const { icon, text, type } = insight
  const style = TYPE_STYLES[type] || TYPE_STYLES.info

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border animate-slide-up ${style}`}>
      <span className="text-xl shrink-0">{icon}</span>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  )
}
