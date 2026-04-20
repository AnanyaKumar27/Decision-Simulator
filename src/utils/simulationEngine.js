const INITIAL_SCORE = 10
const GROWTH_RATE = 1.5
const PENALTY = 2

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0))

export function runSimulation(params) {
  if (!params) return []

  const effort = clamp(params.effort, 1, 12)
  const consistency = clamp(params.consistency, 0, 1)
  const duration = Math.round(clamp(params.duration, 7, 90))
  const gap = consistency >= 0.99
    ? Number.POSITIVE_INFINITY
    : Math.max(1, Math.round(1 / Math.max(1 - consistency, 0.05)))

  let missedDays = 0
  const results = []

  for (let day = 1; day <= duration; day += 1) {
    const missed = Number.isFinite(gap) && day % gap === 0
    if (missed) missedDays += 1

    const growth = GROWTH_RATE * effort * consistency * day
    const score = Math.max(0, INITIAL_SCORE + growth - (PENALTY * missedDays))

    results.push({
      day,
      score: Number(score.toFixed(1)),
      missed,
    })
  }

  return results
}

export function generateInsights(results, params) {
  if (!results?.length || !params) return []

  const firstScore = results[0]?.score ?? INITIAL_SCORE
  const finalScore = results[results.length - 1]?.score ?? INITIAL_SCORE
  const growthPercent = ((finalScore - firstScore) / Math.max(firstScore, 1)) * 100
  const milestone = results.find((entry) => entry.score >= 50)

  const insights = [
    {
      type: 'goal',
      icon: '🎯',
      text: `Your projected final score is ${finalScore.toFixed(1)} after ${params.duration} days.`,
    },
    {
      type: 'growth',
      icon: '📈',
      text: `That is a ${growthPercent.toFixed(0)}% improvement from your starting baseline.`,
    },
  ]

  if (params.consistency < 0.5) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      text: 'Consistency is the main drag right now. Tightening your routine should improve the curve.',
    })
  } else {
    insights.push({
      type: 'success',
      icon: '✅',
      text: 'Your consistency level is strong enough to create compounding gains over time.',
    })
  }

  if (params.effort < 2) {
    insights.push({
      type: 'info',
      icon: '💡',
      text: 'A small increase in daily effort could produce a noticeably stronger final score.',
    })
  } else if (params.effort > 8) {
    insights.push({
      type: 'info',
      icon: '🧠',
      text: 'This plan is ambitious. Make sure the effort level is sustainable for the whole run.',
    })
  }

  if (milestone) {
    insights.push({
      type: 'milestone',
      icon: '🏁',
      text: `You are on track to cross score 50 around day ${milestone.day}.`,
    })
  }

  return insights
}
