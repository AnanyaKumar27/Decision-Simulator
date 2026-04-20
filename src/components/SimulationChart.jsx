// src/components/SimulationChart.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Recharts area chart for simulation results
// ─────────────────────────────────────────────────────────────────────────────
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-surface-muted text-xs mb-1">Day {label}</p>
      <p className="font-display font-bold text-brand-400 text-lg">
        {payload[0].value.toFixed(1)}
        <span className="text-surface-muted text-xs font-normal ml-1">score</span>
      </p>
    </div>
  )
}

export default function SimulationChart({ data }) {
  if (!data || data.length === 0) return null

  // Show every Nth tick to avoid clutter
  const tickInterval = Math.max(1, Math.floor(data.length / 8))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5263ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#5263ff" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: '#8892a4', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={tickInterval}
          tickFormatter={(v) => `D${v}`}
        />
        <YAxis
          tick={{ fill: '#8892a4', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => v.toFixed(0)}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={50} stroke="#5263ff" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'Score 50', fill: '#8892a4', fontSize: 10 }} />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#5263ff"
          strokeWidth={2.5}
          fill="url(#scoreGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#7489ff', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
