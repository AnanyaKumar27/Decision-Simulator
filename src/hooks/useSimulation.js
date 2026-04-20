import { useMemo } from 'react'
import { generateInsights, runSimulation } from '../utils/simulationEngine'

export function useSimulation(params) {
  const results = useMemo(() => runSimulation(params), [params])
  const insights = useMemo(() => generateInsights(results, params), [results, params])

  return { results, insights }
}
