// src/context/ScenarioContext.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Lifts scenario list state up so Dashboard + History share the same source
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useCallback } from 'react'
import { getScenarios, deleteScenario } from '../services/scenarioService'
import { useAuth } from './AuthContext'

const ScenarioContext = createContext(null)

export const ScenarioProvider = ({ children }) => {
  const { user } = useAuth()
  const [scenarios, setScenarios] = useState([])
  const [loadingScenarios, setLoadingScenarios] = useState(false)

  // useCallback: stable reference — won't cause child re-renders
  const fetchScenarios = useCallback(async () => {
    if (!user) return
    setLoadingScenarios(true)
    try {
      const data = await getScenarios(user.uid)
      setScenarios(data)
    } finally {
      setLoadingScenarios(false)
    }
  }, [user])

  const removeScenario = useCallback(async (id) => {
    await deleteScenario(user.uid, id)
    setScenarios((prev) => prev.filter((s) => s.id !== id))
  }, [user])

  return (
    <ScenarioContext.Provider value={{ scenarios, loadingScenarios, fetchScenarios, removeScenario }}>
      {children}
    </ScenarioContext.Provider>
  )
}

export const useScenarios = () => useContext(ScenarioContext)
