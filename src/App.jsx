// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// React Router v6 with:
//   • React.lazy + Suspense (lazy loading of pages)
//   • Protected routes via PrivateRoute component
//   • Context providers wrapping the tree
// ─────────────────────────────────────────────────────────────────────────────
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ScenarioProvider } from './context/ScenarioContext'
import PrivateRoute from './components/PrivateRoute'
import Spinner from './components/Spinner'

// Lazy-loaded pages — code-split for performance
const Login          = lazy(() => import('./pages/Login'))
const Signup         = lazy(() => import('./pages/Signup'))
const Dashboard      = lazy(() => import('./pages/Dashboard'))
const ScenarioBuilder = lazy(() => import('./pages/ScenarioBuilder'))
const Results        = lazy(() => import('./pages/Results'))
const History        = lazy(() => import('./pages/History'))
const EditScenario   = lazy(() => import('./pages/EditScenario'))

export default function App() {
  return (
    <AuthProvider>
      <ScenarioProvider>
        <BrowserRouter>
          <Suspense fallback={<Spinner fullscreen />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login"  element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/"             element={<Dashboard />} />
                <Route path="/builder"      element={<ScenarioBuilder />} />
                <Route path="/results/:id"  element={<Results />} />
                <Route path="/history"      element={<History />} />
                <Route path="/edit/:id"     element={<EditScenario />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ScenarioProvider>
    </AuthProvider>
  )
}
