import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useScenarios } from '../context/ScenarioContext'
import { getScenario, updateScenario } from '../services/scenarioService'
import { useForm } from '../hooks/useForm'
import { useSimulation } from '../hooks/useSimulation'
import Layout from '../components/Layout'
import ScenarioForm from '../components/ScenarioForm'
import SimulationChart from '../components/SimulationChart'
import Spinner from '../components/Spinner'

const DEFAULTS = { title: '', category: 'study', effort: 3, consistency: 0.75, duration: 30, notes: '' }

export default function EditScenario() {
  const { id } = useParams()
  const { user } = useAuth()
  const { fetchScenarios } = useScenarios()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSub] = useState(false)
  const [error, setError] = useState('')

  const { values, errors, setErrors, setValues, handleChange } = useForm(DEFAULTS)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getScenario(user.uid, id)
        if (!data) {
          setError('Scenario not found')
          return
        }
        setValues({
          title: data.title ?? '',
          category: data.category ?? 'study',
          effort: data.effort ?? 3,
          consistency: data.consistency ?? 0.75,
          duration: data.duration ?? 30,
          notes: data.notes ?? '',
        })
      } catch {
        setError('Failed to load scenario.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, setValues, user.uid])

  const simParams = useMemo(() => ({
    effort: values.effort,
    consistency: values.consistency,
    duration: values.duration,
  }), [values.effort, values.consistency, values.duration])

  const { results } = useSimulation(simParams)

  const validate = () => {
    const nextErrors = {}
    if (!values.title.trim()) nextErrors.title = 'Please enter a title.'
    setErrors(nextErrors)
    return !Object.keys(nextErrors).length
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSub(true)
    try {
      await updateScenario(user.uid, id, { ...values, simulationData: results })
      await fetchScenarios()
      navigate(`/results/${id}`)
    } catch {
      setError('Failed to update. Please try again.')
    } finally {
      setSub(false)
    }
  }

  if (loading) return <Layout><Spinner /></Layout>

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="text-surface-muted text-sm hover:text-white mb-4 flex items-center gap-1">
          Back
        </button>
        <h1 className="font-display font-bold text-3xl text-white mb-6">Edit Scenario</h1>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <ScenarioForm
              values={values}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitLabel="Update Scenario"
            />
          </div>

          <div className="space-y-4">
            <div className="card">
              <h2 className="font-display font-semibold text-white mb-4">Updated Preview</h2>
              <SimulationChart data={results} />
            </div>
            <div className="card text-center py-4">
              <p className="text-surface-muted text-sm">Projected Score</p>
              <p className="font-display font-bold text-4xl text-brand-400 mt-1">
                {(results[results.length - 1]?.score ?? 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
