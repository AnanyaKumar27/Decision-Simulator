import { useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/helpers'

export default function ScenarioCard({ scenario, onDelete }) {
  const navigate = useNavigate()
  const { id, title, effort, consistency, duration, createdAt } = scenario

  const consistencyPct = Math.round(consistency * 100)

  return (
    <div className="card pin-card story-glow group hover:-translate-y-1 transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-surface-muted mb-2">Saved Idea</p>
          <h3 className="font-display font-semibold text-white text-xl leading-tight">{title}</h3>
          <p className="text-surface-muted text-xs mt-0.5">{formatDate(createdAt)}</p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 hover:border-brand-500 text-surface-muted hover:text-white transition-all"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 hover:border-red-400 text-surface-muted hover:text-red-300 transition-all"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Effort', value: `${effort}h`, sub: 'per day' },
          { label: 'Consistency', value: `${consistencyPct}%`, sub: 'discipline' },
          { label: 'Duration', value: `${duration}d`, sub: 'total days' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-[22px] p-3 text-center bg-white/5 border border-white/5">
            <p className="text-surface-muted text-[10px] uppercase tracking-[0.22em] mb-1">{label}</p>
            <p className="font-display font-bold text-brand-300 text-lg">{value}</p>
            <p className="text-surface-muted text-xs">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-surface-muted mb-1">
          <span>Consistency</span>
          <span>{consistencyPct}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${consistencyPct}%`,
              background: 'linear-gradient(90deg, #ff9ca9 0%, #e74c67 100%)',
            }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/results/${id}`)}
        className="w-full btn-primary text-sm"
      >
        View Results
      </button>
    </div>
  )
}
