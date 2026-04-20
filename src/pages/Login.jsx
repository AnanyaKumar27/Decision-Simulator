// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-surface-card border-r border-surface-border p-12">
        <div>
          <span className="font-display font-bold text-2xl text-white">
            Decision<span className="text-brand-400">Lab</span>
          </span>
        </div>
        <div>
          <p className="text-4xl font-display font-bold text-white leading-tight mb-4">
            Simulate decisions.<br />
            <span className="text-brand-400">See the future.</span>
          </p>
          <p className="text-surface-muted leading-relaxed">
            Build scenarios for study, habits, or fitness. Run a deterministic
            simulation to understand how effort and consistency compound over time.
          </p>
        </div>
        <div className="flex gap-3">
          {['Study Plans', 'Habit Tracking', 'Goal Forecasting'].map((tag) => (
            <span key={tag} className="badge bg-brand-500/10 border border-brand-500/20 text-brand-400">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-white mb-1">Welcome back</h1>
            <p className="text-surface-muted">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                name="email" type="email" required
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                name="password" type="password" required
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-surface-muted text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
