import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LogButton } from '../components/LogButton'
import { TAGS, TAG_LABEL, TagChip } from '../components/TagChip'
import { CheckCircleIcon } from '../components/icons'
import type { LogEntry, Tag } from '../lib/db'
import { formatLongDate, formatTime } from '../lib/time'

export const NOTE_MAX = 100
const TAP_COOLDOWN_MS = 1000

interface LogScreenProps {
  lastLog: LogEntry | undefined
  onLog: (note: string, tag: Tag | null) => void
  toast: ReactNode
}

function useNow() {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function LogScreen({ lastLog, onLog, toast }: LogScreenProps) {
  const now = useNow()
  const [note, setNote] = useState('')
  const [tag, setTag] = useState<Tag | null>(null)
  const lastTap = useRef(0)

  function handleLog() {
    const t = Date.now()
    if (t - lastTap.current < TAP_COOLDOWN_MS) return
    lastTap.current = t
    navigator.vibrate?.(15)
    onLog(note.trim(), tag)
    setNote('')
    setTag(null)
  }

  return (
    <div className="flex min-h-full flex-col px-4 pt-[max(env(safe-area-inset-top),24px)] pb-6">
      <header className="text-center">
        <p className="text-[13px] text-muted">{formatLongDate(now)}</p>
        <p className="mt-1 text-[34px] leading-10 font-semibold tracking-tight tabular-nums">{formatTime(now)}</p>
      </header>

      <div className="mt-3 flex h-11 justify-center">{toast}</div>

      <div className="mt-2 mb-6 flex justify-center">
        <LogButton onLog={handleLog} />
      </div>

      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="note" className="text-[15px] font-semibold">Add a note</label>
          <span className="text-[12px] text-muted">Optional</span>
        </div>
        <div className="rounded-card bg-card px-4 pt-3 pb-2 focus-within:ring-2 focus-within:ring-primary/40">
          <textarea
            id="note"
            data-testid="note-input"
            value={note}
            maxLength={NOTE_MAX}
            rows={2}
            placeholder="What happened?"
            onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
            className="block w-full resize-none bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
          <p className="text-right text-[11px] text-muted tabular-nums">{note.length}/{NOTE_MAX}</p>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 text-[15px] font-semibold">Tag</h2>
        <div className="flex gap-2">
          {TAGS.map((t) => (
            <TagChip key={t} tag={t} selected={tag === t} onToggle={(v) => setTag(tag === v ? null : v)} />
          ))}
        </div>
      </section>

      <section className="mt-5 flex items-center justify-between rounded-card bg-card px-4 py-3">
        <div>
          <p className="text-[12px] text-muted">Last log</p>
          <p className="mt-0.5 text-[15px] font-medium tabular-nums" data-testid="last-log">
            {lastLog
              ? `${formatTime(lastLog.timestamp)}${lastLog.tag ? ` · ${TAG_LABEL[lastLog.tag]}` : ''}`
              : 'Nothing yet'}
          </p>
        </div>
        {lastLog && <CheckCircleIcon className="size-6 text-break" />}
      </section>
    </div>
  )
}
