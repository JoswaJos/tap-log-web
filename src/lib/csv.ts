import type { LogEntry } from './db'
import { formatIsoDate, formatTime } from './time'

function escape(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

export function toCsv(logs: LogEntry[]): string {
  const rows = logs.map((l) =>
    [formatIsoDate(l.timestamp), formatTime(l.timestamp), l.tag ?? '', l.note].map(escape).join(','),
  )
  return ['date,time,tag,note', ...rows].join('\n')
}

export function csvFileName(now = Date.now()): string {
  return `tap-log-${formatIsoDate(now)}.csv`
}

/** Shares via the Web Share API when files are supported, otherwise downloads. */
export async function exportCsv(csv: string, fileName: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([csv], fileName, { type: 'text/csv' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Tap Log export' })
      return 'shared'
    } catch (err) {
      if ((err as DOMException).name === 'AbortError') return 'cancelled'
      // Fall through to download on any other share failure.
    }
  }
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded'
}
