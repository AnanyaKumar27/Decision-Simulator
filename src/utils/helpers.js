export function formatDate(value) {
  if (!value) return 'Just now'

  const date = typeof value?.toDate === 'function'
    ? value.toDate()
    : new Date(value)

  if (Number.isNaN(date.getTime())) return 'Just now'

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
