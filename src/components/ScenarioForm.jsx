import { useRef, useEffect } from 'react'

const FIELDS = [
  {
    name: 'effort',
    label: 'Daily Effort (hours)',
    type: 'range',
    min: 1,
    max: 12,
    step: 0.5,
    hint: (value) => `${value} hour${value !== 1 ? 's' : ''} per day`,
  },
  {
    name: 'consistency',
    label: 'Consistency / Discipline',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.05,
    hint: (value) => `${Math.round(value * 100)}% consistent`,
  },
  {
    name: 'duration',
    label: 'Simulation Duration (days)',
    type: 'range',
    min: 7,
    max: 90,
    step: 1,
    hint: (value) => `${value} days`,
  },
]

export default function ScenarioForm({ values, errors, onChange, onSubmit, submitting, submitLabel = 'Run Simulation' }) {
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="label">Scenario Title</label>
        <input
          ref={titleRef}
          name="title"
          value={values.title}
          onChange={onChange}
          placeholder="e.g. GATE Prep 30-day plan"
          className="input-field"
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="label">Category</label>
        <select
          name="category"
          value={values.category}
          onChange={onChange}
          className="input-field"
        >
          <option value="study">Study / Learning</option>
          <option value="fitness">Fitness / Health</option>
          <option value="habit">Habit Formation</option>
          <option value="career">Career / Skill</option>
          <option value="other">Other</option>
        </select>
      </div>

      {FIELDS.map(({ name, label, type, min, max, step, hint }) => (
        <div key={name}>
          <div className="flex justify-between items-center mb-2">
            <label className="label mb-0">{label}</label>
            <span className="text-brand-400 font-mono text-sm font-medium">
              {hint(values[name])}
            </span>
          </div>
          <input
            type={type}
            name={name}
            min={min}
            max={max}
            step={step}
            value={values[name]}
            onChange={onChange}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-surface-muted text-xs mt-1">
            <span>{min}{name === 'consistency' ? ' (0%)' : name === 'effort' ? 'h' : 'd'}</span>
            <span>{max}{name === 'consistency' ? ' (100%)' : name === 'effort' ? 'h' : 'd'}</span>
          </div>
          {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
        </div>
      ))}

      <div>
        <label className="label">Notes (optional)</label>
        <textarea
          name="notes"
          value={values.notes}
          onChange={onChange}
          placeholder="Any context or goals for this scenario..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Running...
          </span>
        ) : submitLabel}
      </button>
    </form>
  )
}
