// src/pages/ScenarioBuilder.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Create a new scenario and save it to Firestore.
// Demonstrates: useForm hook, controlled components, live preview sidebar.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useScenarios } from '../context/ScenarioContext'
import { useForm } from '../hooks/useForm'
import { useSimulation } from '../hooks/useSimulation'
import { createScenario } from '../services/scenarioService'
import Layout from '../components/Layout'
import ScenarioForm from '../components/ScenarioForm'
import SimulationChart from '../components/SimulationChart'

const DEFAULTS = {
  title:       '',
  category:    'study',
  effort:      3,
  consistency: 0.75,
  duration:    30,
  notes:       '',
}

export default function ScenarioBuilder() {
  const { user }              = useAuth()
  const { fetchScenarios }    = useScenarios()
  const navigate              = useNavigate()
  const [submitting, setSub]  = useState(false)
  const [error, setError]     = useState('')

  const { values, errors, setErrors, handleChange } = useForm(DEFAULTS)

  // Live preview: memoized params so chart updates only on real changes
  const simParams = useMemo(() => ({
    effort:      values.effort,
    consistency: values.consistency,
    duration:    values.duration,
  }), [values.effort, values.consistency, values.duration])

  const { results } = useSimulation(simParams)

  const validate = () => {
    const e = {}
    if (!values.title.trim()) e.title = 'Please enter a title.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSub(true)
    setError('')
    try {
      const id = await createScenario(user.uid, {
        ...values,
        simulationData: results,
      })
      await fetchScenarios()
      navigate(`/results/${id}`)
    } catch (err) {
      setError('Failed to save scenario. Please try again.')
      console.error(err)
    } finally {
      setSub(false)
    }
  }

  const finalScore = results[results.length - 1]?.score ?? 0

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-3xl text-white">Scenario Builder</h1>
          <p className="text-surface-muted mt-1">Configure your inputs and watch the simulation update live.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="card">
            <ScenarioForm
              values={values}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitLabel="Save & View Results"
            />
          </div>

          {/* Live preview */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="font-display font-semibold text-white mb-1">Live Preview</h2>
              <p className="text-surface-muted text-xs mb-4">Updates as you adjust sliders</p>
              <SimulationChart data={results} />
            </div>

            <div className="card">
              <p className="text-surface-muted text-sm mb-1">Projected Final Score</p>
              <p className="font-display font-bold text-5xl text-brand-400">{finalScore.toFixed(1)}</p>
              <p className="text-surface-muted text-xs mt-1">after {values.duration} days</p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Effort',      val: `${values.effort}h/day` },
                { label: 'Consistency', val: `${Math.round(values.consistency * 100)}%` },
                { label: 'Duration',    val: `${values.duration}d` },
              ].map(({ label, val }) => (
                <div key={label} className="card text-center py-4">
                  <p className="font-display font-bold text-white">{val}</p>
                  <p className="text-surface-muted text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
