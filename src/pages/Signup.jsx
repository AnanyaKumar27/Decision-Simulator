// src/pages/Signup.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../services/authService'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await signup(form.email, form.password, form.name)
      navigate('/')
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use'
        ? 'That email is already registered.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <span className="font-display font-bold text-2xl text-white">
            Decision<span className="text-brand-400">Lab</span>
          </span>
          <h1 className="font-display font-bold text-3xl text-white mt-4 mb-1">Create account</h1>
          <p className="text-surface-muted">Start simulating your decisions today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input name="name" required value={form.name} onChange={handleChange}
              placeholder="Arjun Sharma" className="input-field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange}
              placeholder="you@example.com" className="input-field" />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" required value={form.password} onChange={handleChange}
              placeholder="Min. 6 characters" className="input-field" />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input name="confirm" type="password" required value={form.confirm} onChange={handleChange}
              placeholder="••••••••" className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-surface-muted text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
