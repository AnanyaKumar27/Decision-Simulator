import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getScenario } from '../services/scenarioService'
import { useSimulation } from '../hooks/useSimulation'
import Layout from '../components/Layout'
import SimulationChart from '../components/SimulationChart'
import InsightCard from '../components/InsightCard'
import Spinner from '../components/Spinner'
import { formatDate } from '../utils/helpers'

export default function Results() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [scenario, setScenario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getScenario(user.uid, id)
        if (!data) {
          setError('Scenario not found.')
          return
        }
        setScenario(data)
      } catch {
        setError('Failed to load scenario.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, user.uid])

  const simParams = useMemo(() => (
    scenario
      ? { effort: scenario.effort, consistency: scenario.consistency, duration: scenario.duration }
      : null
  ), [scenario])

  const { results, insights } = useSimulation(simParams)
  const finalScore = results[results.length - 1]?.score ?? 0
  const midScore = results[Math.floor((results.length - 1) / 2)]?.score ?? 0

  if (loading) return <Layout><Spinner /></Layout>
  if (error) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">Error</p>
            <p className="text-white font-semibold">{error}</p>
            <button onClick={() => navigate('/')} className="btn-primary mt-4">Back to Dashboard</button>
          </div>
        </div>
      </Layout>
    )
  }

  const categoryLabel = {
    study: 'Study',
    fitness: 'Fitness',
    habit: 'Habit',
    career: 'Career',
    other: 'Other',
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">
        <button onClick={() => navigate('/')} className="text-surface-muted text-sm hover:text-white mb-4 flex items-center gap-1">
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <span className="badge bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-2">
              {categoryLabel[scenario.category] || 'Scenario'}
            </span>
            <h1 className="font-display font-bold text-3xl text-white">{scenario.title}</h1>
            <p className="text-surface-muted text-sm mt-1">Created {formatDate(scenario.createdAt)}</p>
          </div>
          <button onClick={() => navigate(`/edit/${id}`)} className="btn-ghost self-start">
            Edit Scenario
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Final Score', value: finalScore.toFixed(1), accent: 'text-brand-400' },
            { label: 'Mid Score', value: midScore.toFixed(1), accent: 'text-cyan-400' },
            { label: 'Daily Effort', value: `${scenario.effort}h`, accent: 'text-violet-400' },
            { label: 'Consistency', value: `${Math.round(scenario.consistency * 100)}%`, accent: 'text-emerald-400' },
          ].map(({ label, value, accent }) => (
            <div key={label} className="card text-center">
              <p className={`font-display font-bold text-3xl ${accent}`}>{value}</p>
              <p className="text-surface-muted text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="card mb-6">
          <h2 className="font-display font-semibold text-white mb-4">Score Progression over {scenario.duration} Days</h2>
          <SimulationChart data={results} />
        </div>

        <div className="mb-6">
          <h2 className="font-display font-semibold text-white mb-3">AI Insights</h2>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>

        {scenario.notes && (
          <div className="card">
            <h3 className="font-display font-semibold text-white mb-2">Notes</h3>
            <p className="text-surface-muted text-sm leading-relaxed">{scenario.notes}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
