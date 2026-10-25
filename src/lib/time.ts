const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const pad = (n: number) => String(n).padStart(2, '0')

/** "7:55:19 PM" */
export function formatTime(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours() % 12 || 12
  return `${h}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${d.getHours() < 12 ? 'AM' : 'PM'}`
}

/** "Sunday, 25 October" */
export function formatLongDate(ts: number): string {
  const d = new Date(ts)
  return `${d.toLocaleDateString('en-GB', { weekday: 'long' })}, ${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'long' })}`
}

/** "2026-10-25" in local time */
export function formatIsoDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** "Today" / "Yesterday" / "24 Oct" (year appended when not the current year) */
export function dayLabel(ts: number, now = Date.now()): string {
  const today = startOfDay(now)
  const day = startOfDay(ts)
  if (day === today) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (day === yesterday.getTime()) return 'Yesterday'
  const d = new Date(ts)
  const label = `${d.getDate()} ${MONTHS[d.getMonth()]}`
  return d.getFullYear() === new Date(now).getFullYear() ? label : `${label} ${d.getFullYear()}`
}

/** Groups items (already sorted newest first) by calendar day, preserving order. */
export function groupByDay<T extends { timestamp: number }>(items: T[], now = Date.now()) {
  const groups: { label: string; items: T[] }[] = []
  for (const item of items) {
    const label = dayLabel(item.timestamp, now)
    const last = groups[groups.length - 1]
    if (last?.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }
  return groups
}
