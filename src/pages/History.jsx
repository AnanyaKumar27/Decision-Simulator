import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScenarios } from '../context/ScenarioContext'
import Layout from '../components/Layout'
import ScenarioCard from '../components/ScenarioCard'
import Spinner from '../components/Spinner'

const CATEGORIES = ['all', 'study', 'fitness', 'habit', 'career', 'other']
const CAT_LABEL = { all: 'All', study: 'Study', fitness: 'Fitness', habit: 'Habit', career: 'Career', other: 'Other' }

export default function History() {
  const { scenarios, loadingScenarios, fetchScenarios, removeScenario } = useScenarios()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchScenarios()
  }, [fetchScenarios])

  const handleDelete = useCallback(async (id) => {
    if (!confirm('Delete this scenario permanently?')) return
    await removeScenario(id)
  }, [removeScenario])

  const filtered = useMemo(() => {
    let list = [...scenarios]
    if (filter !== 'all') list = list.filter((s) => s.category === filter)
    if (search.trim()) list = list.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
    if (sortBy === 'newest') list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    if (sortBy === 'oldest') list.sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0))
    if (sortBy === 'effort') list.sort((a, b) => b.effort - a.effort)
    return list
  }, [scenarios, filter, search, sortBy])

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">History</h1>
            <p className="text-surface-muted mt-1">{scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} saved</p>
          </div>
          <button onClick={() => navigate('/builder')} className="btn-primary">
            + New
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scenarios..."
            className="input-field sm:max-w-xs"
          />

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all
                  ${filter === cat
                    ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                    : 'border-surface-border text-surface-muted hover:text-white'}`}
              >
                {CAT_LABEL[cat]}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field sm:max-w-[160px]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="effort">Most effort</option>
          </select>
        </div>

        {loadingScenarios ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16 animate-fade-in">
            <p className="text-2xl mb-3 text-surface-muted">{search || filter !== 'all' ? 'Search' : 'Empty'}</p>
            <p className="text-white font-semibold">
              {search || filter !== 'all' ? 'No matching scenarios' : 'No scenarios yet'}
            </p>
            {!search && filter === 'all' && (
              <button onClick={() => navigate('/builder')} className="btn-primary mt-4">
                Create your first scenario
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
