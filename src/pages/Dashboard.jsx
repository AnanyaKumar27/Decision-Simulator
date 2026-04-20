import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useScenarios } from '../context/ScenarioContext'
import Layout from '../components/Layout'
import ScenarioCard from '../components/ScenarioCard'
import StatWidget from '../components/StatWidget'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const { user } = useAuth()
  const { scenarios, loadingScenarios, fetchScenarios, removeScenario } = useScenarios()
  const navigate = useNavigate()

  useEffect(() => {
    fetchScenarios()
  }, [fetchScenarios])

  const stats = useMemo(() => {
    const total = scenarios.length
    const avgEff = total
      ? (scenarios.reduce((sum, sc) => sum + sc.effort, 0) / total).toFixed(1)
      : 0
    const avgCon = total
      ? Math.round((scenarios.reduce((sum, sc) => sum + sc.consistency, 0) / total) * 100)
      : 0
    return { total, avgEff, avgCon }
  }, [scenarios])

  const recent = scenarios.slice(0, 6)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-surface-muted uppercase tracking-[0.28em] text-[11px] mb-3">Your Board</p>
            <h1 className="font-display font-bold text-4xl text-white max-w-xl leading-tight">
              Hey, {user?.displayName?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-surface-muted mt-2 max-w-lg">Pin down the routines, plans, and experiments you want to explore next.</p>
          </div>
          <button onClick={() => navigate('/builder')} className="btn-primary hidden sm:block">
            + New Scenario
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatWidget icon="Total" label="Total Scenarios" value={stats.total} sub="simulations run" accent="brand" />
          <StatWidget icon="Time" label="Avg Daily Effort" value={`${stats.avgEff}h`} sub="hours per day" accent="cyan" />
          <StatWidget icon="Goal" label="Avg Consistency" value={`${stats.avgCon}%`} sub="across all scenarios" accent="violet" />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-xl text-white">Recent Scenarios</h2>
          {scenarios.length > 6 && (
            <button onClick={() => navigate('/history')} className="text-brand-400 text-sm hover:text-brand-300">
              View all
            </button>
          )}
        </div>

        {loadingScenarios ? (
          <Spinner />
        ) : scenarios.length === 0 ? (
          <div className="card text-center py-16 animate-fade-in">
            <p className="text-2xl mb-4 text-surface-muted">No data</p>
            <h3 className="font-display font-semibold text-white text-xl mb-2">No scenarios yet</h3>
            <p className="text-surface-muted mb-6">Build your first scenario to see simulated outcomes.</p>
            <button onClick={() => navigate('/builder')} className="btn-primary">
              Build First Scenario
            </button>
          </div>
        ) : (
          <div className="pin-grid columns-1 md:columns-2 xl:columns-3">
            {recent.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onDelete={removeScenario}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/builder')}
          className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-500 rounded-full text-white text-2xl shadow-lg flex items-center justify-center"
        >
          +
        </button>
      </div>
    </Layout>
  )
}
